// This page transports ciphertext only. It contains no decryption key or crypto code.
export function validatePackage(bytes) {
  if (bytes.length < 112 || new TextDecoder().decode(bytes.slice(0, 8)) !== 'PPXENC1\0') throw Error('Choose a PinPointX encrypted .ppx update.');
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const size = view.getUint32(12, true);
  if (view.getUint32(8, true) !== 0xc3001 || size < 24 || size > 0x180000 || bytes.length !== 112 + size + Math.ceil(size / 1024) * 16) throw Error('The update is incomplete or for a different device.');
}
export class SerialUpdater {
  constructor(port, onProgress = () => {}) { this.port = port; this.onProgress = onProgress; this.id = 0; this.pending = null; this.buffer = ''; this.cancelled = false; }
  async open() {
    await this.port.open({ baudRate: 115200 });
    this.reader = this.port.readable.getReader(); this.writer = this.port.writable.getWriter();
    this.reading = this.readLoop();
    // Terminate a partial line left by an interrupted previous USB connection.
    await this.writer.write(new TextEncoder().encode('\n'));
  }
  async readLoop() {
    const decoder = new TextDecoder();
    try {
      while (true) {
        const { value, done } = await this.reader.read(); if (done) break;
        this.buffer += decoder.decode(value, { stream: true });
        let end;
        while ((end = this.buffer.indexOf('\n')) >= 0) {
          const line = this.buffer.slice(0, end).trim(); this.buffer = this.buffer.slice(end + 1);
          const match = /^PPX1 (\d+) (OK|ERR) (.*)$/.exec(line);
          if (match && this.pending && Number(match[1]) === this.pending.id) {
            const p = this.pending; this.pending = null;
            if (match[2] === 'OK') p.resolve(match[3]); else p.reject(Error(match[3]));
          }
        }
        if (this.buffer.length > 4096) this.buffer = '';
      }
    } catch (error) { this.readError = error; }
    finally { if (this.pending) { this.pending.reject(this.readError || Error('Hub disconnected.')); this.pending = null; } }
  }
  async command(command) {
    if (this.pending) throw Error('An update command is already in progress.');
    const id = ++this.id;
    let timer;
    const result = new Promise((resolve, reject) => {
      timer = setTimeout(() => { if (this.pending?.id === id) this.pending = null; reject(Error('Hub did not respond. Reconnect and try again.')); }, 20000);
      this.pending = { id, resolve, reject };
    });
    // Install rejection handling before any asynchronous write can fail.
    const settled = result.then(value => ({ value }), error => ({ error }));
    try {
      await this.writer.write(new TextEncoder().encode(`PPX1 ${id} ${command}\n`));
      const outcome = await settled; if (outcome.error) throw outcome.error; return outcome.value;
    } finally { clearTimeout(timer); if (this.pending?.id === id) this.pending = null; }
  }
  async install(bytes) {
    validatePackage(bytes);
    const hello = await this.command('HELLO');
    if (!hello.startsWith('READY ')) throw Error(hello === 'UNPROVISIONED' ? 'This Hub needs its initial updater installed by the shop.' : 'Hub is still starting. Wait 15 seconds and try again.');
    if (this.cancelled) throw Error('Update cancelled.');
    await this.command('BEGIN');
    try {
      for (let offset = 0; offset < bytes.length; offset += 512) {
        if (this.cancelled) throw Error('Update cancelled.');
        const part = bytes.subarray(offset, offset + 512);
        await this.command('DATA ' + Array.from(part, b => b.toString(16).padStart(2, '0')).join(''));
        this.onProgress(Math.min(offset + part.length, bytes.length) / bytes.length * 100);
      }
      if (this.cancelled) throw Error('Update cancelled.');
      await this.command('END');
    } catch (error) {
      // No automatic retransmission: lost acknowledgements require restarting the package.
      try { await this.command('ABORT'); } catch { /* device also has an inactivity timeout */ }
      throw error;
    }
  }
  async close() {
    try { await this.reader?.cancel(); await this.reading; } catch { /* already disconnected */ }
    this.reader?.releaseLock(); this.writer?.releaseLock();
    try { await this.port.close(); } catch { /* already disconnected */ }
  }
}
if (typeof document !== 'undefined') {
  const install = document.querySelector('#install'), cancel = document.querySelector('#cancel');
  const download = document.querySelector('#download-package');
  const status = document.querySelector('#status'), progress = document.querySelector('#progress');
  let updater;
  if (!globalThis.isSecureContext || !navigator.serial) { install.disabled = true; status.textContent = 'Open this page over HTTPS or localhost in Chrome or Edge to use USB updates.'; }
  download.onclick = async () => {
    download.disabled = true; status.textContent = 'Loading the published encrypted update…';
    try {
      const response = await fetch('./Web-0.5.52-enc1-ipad.ppx?v=cc4a746b');
      if (!response.ok) throw Error('The published encrypted update could not be downloaded.');
      const bytes = new Uint8Array(await response.arrayBuffer());
      validatePackage(bytes); globalThis.encryptedPackageBytes = bytes;
      status.textContent = 'Web 0.5.52-enc1 (iPad fix) ready. Click Install encrypted update.';
    } catch (error) { status.textContent = error.message; }
    finally { download.disabled = false; }
  };
  cancel.onclick = () => { if (updater) updater.cancelled = true; cancel.disabled = true; status.textContent = 'Cancelling…'; };
  install.onclick = async () => {
    const file = document.querySelector('#package').files[0];
    install.disabled = true; progress.value = 0;
    try {
      const bytes = globalThis.encryptedPackageBytes || (file && new Uint8Array(await file.arrayBuffer()));
      if (!bytes) throw Error('Use the published update or choose an encrypted .ppx file first.');
      if (bytes.length > 1600000) throw Error('The update file is too large.');
      validatePackage(bytes);
      const port = await navigator.serial.requestPort();
      updater = new SerialUpdater(port, value => { progress.value = value; });
      await updater.open(); cancel.disabled = false; status.textContent = 'Checking Hub and transferring update…';
      await updater.install(bytes); status.textContent = 'Encrypted update installed. Hub is restarting. Check its firmware version after startup.';
    } catch (error) { status.textContent = error.message; }
    finally { cancel.disabled = true; if (updater) await updater.close(); updater = null; install.disabled = false; }
  };
}
