# Release artifacts

## CrowPanel 1.2.51 — Nelson Aviation header logo (2026-08-13)

- Source: `NelsonAviation/Pinpoint` branch `codex/pin-led-color-badge`, commit
  `4ff990cf2ed0b8e3fc6d90d1e1261f35fbc98667`
  (`feat: add Nelson Aviation header logo`).
- CrowPanel application: `bins/ppx_crowpanel-1.2.51-4ff990cf.bin`
  (`0d49ebf418973d90182fa0279b668aa740307ec35a7a3cdb4f06ea171e11ff3b`);
  built with ESP-IDF 5.4 for ESP32-S3 and verified on hardware.
- The commit-suffixed filename and manifest query prevent browsers and CDNs
  from serving the prior CrowPanel application from cache.

## LED Controller Board 1.3.5 and CrowPanel 1.2.5 (2026-08-13)

- Source: `NelsonAviation/Pinpoint` commit
  `d7b03fc3` for the LED Controller and `c02a37fa` for the CrowPanel color
  selection feedback update, based on the valid-BIMS enforcement work in
  `c2afa76f`, `ccfb183e`, and `2f63ef75`.
- LED application: `bins/ppx_ledboard-1.3.5-d7b03fc3.bin`
  (`fae5baa2d233cd2203b5be729315c85fed10119af83837b2e34b4ec4e2971ef2`);
  built for `esp32:esp32:esp32c3`.
- CrowPanel application: `bins/ppx_crowpanel-1.2.5-c02a37fa.bin`
  (`1e0dfdcda207f21024ae398100145a2e6d5af474d32dd969f8a477415e982144`);
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
