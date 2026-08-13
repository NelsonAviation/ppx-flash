# Release artifacts

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
