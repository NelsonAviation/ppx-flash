# Release artifacts

## LED Controller Board 1.3.5 and CrowPanel 1.2.5 (2026-08-13)

- Source: `NelsonAviation/Pinpoint` commit
  `2f63ef759a02db6eb98774c5ce19e57bcc839e6a`, including
  `c2afa76f`, `ccfb183e`, and `2f63ef75`.
- LED application: `bins/ppx_ledboard-1.3.5.bin`
  (`94a957247667df0add3c7b9034f5562ee3dfb2b8da94700ada5069eafd93b729`);
  built for `esp32:esp32:esp32c3`.
- CrowPanel application: `bins/ppx_crowpanel-1.2.5.bin`
  (`64ee227faccc95965b866be9466ee634b5ad4aba937489e440656603cef778fe`);
  built with ESP-IDF 5.4 for ESP32-S3.
- Both manifests use versioned application filenames to prevent stale browser or
  CDN responses. These are the normal production controller and CrowPanel
  firmware builds; no simulated-invalid-BIMS test firmware is included.

## LED Controller Board 1.3.4 (2026-08-13)

- Source: `NelsonAviation/Pinpoint` commit
  `60700de4330f1730fe1b748370c58affaf0fc609`
  (`fix: persist LED settings across hub resets`).
- Application artifact: `bins/ppx_ledboard-1.3.4.bin`
- SHA-256: `25743bb28aa4c7df6ac9d36f0fde3218c6a9407ec74f81cfa46075aaf09a4cf7`
- Build target: `esp32:esp32:esp32c3` (default USB CDC-on-boot setting)
- Build verification: the application includes the persistence log markers
  `Restored saved LED settings` and `Saved LED settings`.
- Flash layout: bootloader at `0x0`, partition table at `0x8000`, Arduino
  `boot_app0.bin` at `0xE000`, and application at `0x10000`.
- The versioned application filename prevents a browser or CDN from reusing the
  prior 1.3.3 application response.
