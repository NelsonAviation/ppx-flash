// Web-Serial port of bims_tool.py's flash() — talks to the
// PPX_BIMS_PROGRAMMER sketch over USB CDC.
//
// Protocol:
//   1. Pulse RTS → resets ESP32-C3 so the sketch starts fresh
//   2. Read serial until "PPX_BIMS_PROGRAMMER ready" + "EEPROM at 0xNN"
//   3. Send "PPX_BIMS_FLASH <length>\n"
//   4. Wait for "READY"
//   5. Stream bytes in 32-byte chunks with a 10 ms pause (matches EEPROM page write)
//   6. Wait for "PASS …" or "FAIL …"

const BIMS_MAGIC = 0x4C504944; // "DIPL" little-endian
const CHUNK_SIZE = 32;
const CHUNK_DELAY_MS = 10;
const GREETING_TIMEOUT_MS = 8000;
const READY_TIMEOUT_MS = 6000;
const RESULT_TIMEOUT_MS = 60000;
const SERIAL_FILTERS = [
    { usbVendorId: 0x303a },              // Espressif native USB
    { usbVendorId: 0x10c4 },              // CP210x
    { usbVendorId: 0x1a86 },              // CH340
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// IEEE 802.3 CRC32 (same polynomial as bims_manifest.cpp).
function crc32(buf) {
    let crc = 0xFFFFFFFF >>> 0;
    for (let i = 0; i < buf.length; i++) {
        crc ^= buf[i];
        for (let b = 0; b < 8; b++) {
            crc = (crc & 1) ? (((crc >>> 1) ^ 0xEDB88320) >>> 0) : (crc >>> 1);
        }
    }
    return (~crc) >>> 0;
}

// Validate header + CRC. Returns { ok, total_len, version, message }.
export function validateBims(buf) {
    const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    if (buf.length < 0x30) {
        return { ok: false, message: `File too small (${buf.length} bytes)` };
    }
    const magic = dv.getUint32(0, true);
    if (magic !== BIMS_MAGIC) {
        return { ok: false, message: `Bad magic (got 0x${magic.toString(16)}, expected 0x4C504944)` };
    }
    const version = dv.getUint16(0x04, true);
    const total_len = dv.getUint16(0x06, true);
    if (total_len !== buf.length) {
        return { ok: false, message: `Length mismatch (header=${total_len}, file=${buf.length})` };
    }
    const computed = crc32(buf.subarray(0, buf.length - 4));
    const stored = dv.getUint32(buf.length - 4, true);
    if (computed !== stored) {
        return { ok: false, message: `CRC32 mismatch (computed=0x${computed.toString(16)}, stored=0x${stored.toString(16)})` };
    }
    return { ok: true, total_len, version, message: `OK · BIMS v${version} · ${total_len} bytes · CRC32 0x${stored.toString(16).padStart(8, '0')}` };
}

// Read serial line-by-line until `predicate(line)` returns true or timeout elapses.
// Each non-empty line is passed to `onLine`.
async function readUntil(reader, decoder, deadline, predicate, onLine) {
    let buf = '';
    while (Date.now() < deadline) {
        const remaining = deadline - Date.now();
        const result = await Promise.race([
            reader.read(),
            sleep(remaining).then(() => null),
        ]);
        if (!result) break; // timed out
        const { value, done } = result;
        if (done) break;
        if (!value) continue;
        buf += decoder.decode(value, { stream: true });
        let nl;
        while ((nl = buf.indexOf('\n')) >= 0) {
            const line = buf.slice(0, nl).replace(/\r$/, '').trim();
            buf = buf.slice(nl + 1);
            if (line) {
                onLine(line);
                if (predicate(line)) return true;
            }
        }
    }
    return false;
}

export async function flashBims(port, data, hooks = {}) {
    const log = hooks.onLog || (() => {});
    const progress = hooks.onProgress || (() => {});

    log('Opening port at 115200 baud…');
    await port.open({ baudRate: 115200 });

    let reader, writer;
    try {
        // Reset the board via RTS pulse so the programmer sketch starts fresh.
        log('Resetting LED board (RTS pulse)…');
        await port.setSignals({ dataTerminalReady: false, requestToSend: true });
        await sleep(100);
        await port.setSignals({ requestToSend: false });
        await sleep(500);

        const decoder = new TextDecoder();
        reader = port.readable.getReader();
        writer = port.writable.getWriter();

        // Wait for greeting.
        log('Waiting for PPX_BIMS_PROGRAMMER greeting…');
        let sawGreeting = false;
        const gotEepromLine = await readUntil(
            reader, decoder,
            Date.now() + GREETING_TIMEOUT_MS,
            line => {
                if (line.includes('PPX_BIMS_PROGRAMMER')) sawGreeting = true;
                return sawGreeting && (line.startsWith('EEPROM at') || line.startsWith('FAIL: no EEPROM'));
            },
            line => log('  << ' + line)
        );
        if (!sawGreeting) {
            throw new Error('No PPX_BIMS_PROGRAMMER greeting — is the BIMS Programmer sketch flashed on the LED board?');
        }
        if (!gotEepromLine) {
            throw new Error('Programmer started but never reported the EEPROM address');
        }

        // Send the FLASH command.
        const length = data.length;
        log(`Sending: PPX_BIMS_FLASH ${length}`);
        await writer.write(new TextEncoder().encode(`PPX_BIMS_FLASH ${length}\n`));

        // Wait for READY.
        log('Waiting for READY…');
        const gotReady = await readUntil(
            reader, decoder,
            Date.now() + READY_TIMEOUT_MS,
            line => line === 'READY',
            line => log('  << ' + line)
        );
        if (!gotReady) throw new Error('Timed out waiting for READY from programmer');

        // Stream the bytes in 32-byte chunks. Each EEPROM page write needs ~10 ms.
        log(`Streaming ${length} bytes in ${CHUNK_SIZE}-byte chunks…`);
        for (let off = 0; off < length; off += CHUNK_SIZE) {
            const chunk = data.subarray(off, Math.min(off + CHUNK_SIZE, length));
            await writer.write(chunk);
            await sleep(CHUNK_DELAY_MS);
            progress(off + chunk.length, length);
        }

        // Wait for PASS or FAIL from the programmer's verify step.
        log('Waiting for verify result…');
        let resultLine = null;
        await readUntil(
            reader, decoder,
            Date.now() + RESULT_TIMEOUT_MS,
            line => {
                if (line.startsWith('PASS') || line.startsWith('FAIL')) {
                    resultLine = line;
                    return true;
                }
                return false;
            },
            line => log('  << ' + line)
        );
        if (!resultLine) throw new Error('Timed out waiting for PASS/FAIL');
        if (resultLine.startsWith('FAIL')) throw new Error(resultLine);

        log(`\nSUCCESS: ${resultLine}`);
    } finally {
        try { if (reader) reader.releaseLock(); } catch {}
        try { if (writer) writer.releaseLock(); } catch {}
        try { await port.close(); } catch {}
    }
}

export async function pickPortAndFlash(data, hooks = {}) {
    if (!('serial' in navigator)) {
        throw new Error('Web Serial not supported — use Chrome 89+ or Edge 89+');
    }
    const port = await navigator.serial.requestPort({ filters: SERIAL_FILTERS });
    await flashBims(port, data, hooks);
}
