# Legacy firmware recovery

The CrowPanel and CrowPanel-compatible LED Controller panels are currently
hidden from `index.html` at the user's request. Their release files remain in
this repository so the choices can be restored without rebuilding firmware.

To restore the panels, remove the `hidden` attribute from the two firmware
`<details class="board-card bims-card" ...>` elements in `index.html`:

- CrowPanel releases use `manifest-crowpanel*.json` and
  `manifest-crowpanel-no-voice*.json`, with matching `bins/*crowpanel*.bin`.
- CrowPanel-compatible LED Controller releases use
  `manifest-ledboard*.json` and matching `bins/ppx_ledboard*.bin` plus the
  versioned bootloader, partition, and OTA files.

The unencrypted Web UI Hub Web 0.5.51 option remains visible beneath the
encrypted Web UI updater and is separate from these hidden panels.
