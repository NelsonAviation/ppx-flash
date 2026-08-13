# Release artifacts

## LED Controller Board 1.3.2 (2026-08-13)

- Source: current `NelsonAviation/Pinpoint` `main` workspace, compiled and
  flashed successfully to ESP32-C3 hardware.
- Application artifact: `bins/ppx_ledboard.bin`
- SHA-256: `b3d6d213cf392ea1ccfb465d5796a4bea5d12bf8bcf64d4185560faaa56c9959`
- Build target: `esp32:esp32:esp32c3:CDCOnBoot=cdc`
- Adds NVS persistence for CrowPanel-provided pin and M/F colors, pin and M/F
  brightness, and blink enable/interval. A short hub power interruption now
  restores the saved display preferences instead of reverting to white.
