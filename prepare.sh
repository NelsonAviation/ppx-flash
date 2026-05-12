#!/bin/bash
# Copies firmware build artifacts into local_flash_test/bins/
# Run this from the repo root OR from inside local_flash_test/.
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BINS="$SCRIPT_DIR/bins"
mkdir -p "$BINS"

ok=0
fail=0

copy_bin() {
    local src="$1"
    local dst="$2"
    if [ -f "$src" ]; then
        cp "$src" "$dst"
        echo "  [OK]  $(basename "$dst")"
        ok=$((ok + 1))
    else
        echo "  [--]  $(basename "$dst")  <-- source not found: $src"
        fail=$((fail + 1))
    fi
}

echo ""
echo "=== CrowPanel (ESP32-S3) ==="
IDF_BUILD="$REPO_ROOT/esp32_crowpanel_idf/build"
copy_bin "$IDF_BUILD/bootloader/bootloader.bin"               "$BINS/bootloader-crowpanel.bin"
copy_bin "$IDF_BUILD/partition_table/partition-table.bin"     "$BINS/partition-table-crowpanel.bin"
copy_bin "$IDF_BUILD/ota_data_initial.bin"                    "$BINS/ota_data_initial.bin"
copy_bin "$IDF_BUILD/ppx_crowpanel.bin"                       "$BINS/ppx_crowpanel.bin"
copy_bin "$IDF_BUILD/srmodels/srmodels.bin"                   "$BINS/srmodels.bin"

echo ""
echo "=== LED Board (ESP32-C3) ==="
# Arduino IDE "Export Compiled Binary" places files in the sketch folder.
# Check the sketch folder first, then a build/ subfolder.
LED_SKETCH="$REPO_ROOT/esp32_led_board"
LED_BUILD="$LED_SKETCH/build/esp32.esp32.esp32c3"

find_led_bin() {
    local pattern="$1"
    local result
    result=$(find "$LED_SKETCH" -maxdepth 3 -name "$pattern" 2>/dev/null | head -1)
    echo "$result"
}

BL_SRC=$(find_led_bin "*.bootloader.bin")
PT_SRC=$(find_led_bin "*.partitions.bin")
FW_SRC=$(find_led_bin "*.ino.bin")

copy_bin "${BL_SRC:-MISSING}"  "$BINS/ppx_ledboard_bootloader.bin"
copy_bin "${PT_SRC:-MISSING}"  "$BINS/ppx_ledboard_partitions.bin"
copy_bin "${FW_SRC:-MISSING}"  "$BINS/ppx_ledboard.bin"

echo ""
echo "Done: $ok copied, $fail missing."
if [ "$fail" -gt 0 ]; then
    echo ""
    echo "Missing CrowPanel bins: run 'idf.py build' in esp32_crowpanel_idf/"
    echo "Missing LED board bins: open Arduino IDE, Sketch → Export Compiled Binary"
    exit 1
fi
echo "All bins ready. Run ./start.sh to start the local server."
