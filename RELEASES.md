# Release artifacts

## LED Controller Board 1.3.5 and CrowPanel 1.2.5 (2026-08-13)

- Source: `NelsonAviation/Pinpoint` commit
  `d7b03fc3` (`fix firmware version reporting`), based on the valid-BIMS
  enforcement work in `c2afa76f`, `ccfb183e`, and `2f63ef75`.
- LED application: `bins/ppx_ledboard-1.3.5-d7b03fc3.bin`
  (`fae5baa2d233cd2203b5be729315c85fed10119af83837b2e34b4ec4e2971ef2`);
  built for `esp32:esp32:esp32c3`.
- CrowPanel application: `bins/ppx_crowpanel-1.2.5-d7b03fc3.bin`
  (`c3634590e96bd234438ddc1b53badf3f62a192a42be1113bd86d53c929651b85`);
  built with ESP-IDF 5.4 for ESP32-S3.
- Both manifests use commit-suffixed application filenames to prevent stale
  browser or CDN responses. These are the validated, normal production builds
  flashed successfully to the attached hardware.

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
