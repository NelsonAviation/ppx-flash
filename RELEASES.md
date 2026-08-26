# Release artifacts

## LED Hub Controller v1.3.60 (2026-08-25)

- Source: `NelsonAviation/Pinpoint` commit
  `437d0a5f47384312681aae911a0ab9c81e9d012f` (`Release hub firmware v1.3.60`).
- The ESP32-C3 release restores Blink All: every LED illuminates the same
  color and the entire palette cycles together, while retaining the battery
  and charging-status work.
- Application: `bins/ppx_ledboard-1.3.60.bin`
  (`7ac8f50e32fe1d4d9fcf14d2bc5c27036ffff260fd57742a2fe5caf267c6f148`).
- v1.3.60 is the current/latest web-flash choice. v1.3.59 and all earlier Hub
  releases remain available as separate choices.

## LED Hub Controller v1.3.59 and CrowPanel v1.3.4 (2026-08-25)

- LED Hub Controller source: `NelsonAviation/Pinpoint` commit
  `7052c4a9a127527a0953a4b673b579242c8d9646`
  (`Stabilize hub battery charging status`). Built for ESP32-C3.
  Application: `bins/ppx_ledboard-1.3.59.bin`
  (`a59978b7404535a74d48e79603115b827df3183c6df9c9649965e322409fdafa`).
- CrowPanel source: `NelsonAviation/Pinpoint` commit `5a2ae302`
  (`Suspend Crow radio during display inactivity`). The committed validated
  ESP32-S3 release build supplies `bins/ppx_crowpanel-no-voice-1.3.4.bin`
  (`f51df39348d8db061c82c81e20252962f7cbd2cd59ed98353c41ef35bb1afe61`).
- Both versions are added as independent choices; no existing web-flash
  release has been removed or replaced.

## LED Hub Controller v1.3.57 (2026-08-24)

- Source: active `Pinpoint/esp32_led_board` production build for ESP32-C3.
- Application: `bins/ppx_ledboard-1.3.57.bin`
  (`d7432c31655d41b23f0b475e109a77926e8fbc704bc7b9dac6c2aa60b86a7827`).
- This replaces the v1.3.56 web-flash release. CrowPanel releases are unchanged.

## CrowPanel v1.3.2 Display Settings (2026-08-24)

- Built from the active `Pinpoint/esp32_crowpanel_idf` source with ESP-IDF
  5.4.2 for ESP32-S3 and hardware-tested on the attached CrowPanel.
- Settings tiles are Pair → Display → LED → Test. Display persists Normal
  brightness (Maximum battery duration) or High brightness (About 50% less
  battery duration) across reboot.
- Wi-Fi starts two seconds after boot and remains continuous.
- Includes the 2.5 ms touch-sound cue and Settings-header sound mute toggle.
- Application: `bins/ppx_crowpanel-display-sound-1.3.2.bin`
  (`cfd21085830d255ca818afc5f5cb35e1467ac34d8ed9b8e069e289fe76e32c4e`).
- The web-flash page retains v1.3.1 as a separate selectable release.

## CrowPanel v1.3.1 No Voice and LED Hub Controller v1.3.56 (2026-08-15)

- CrowPanel source: `Pinpoint/recovery_points/crowpanel_release_v1.3.1_2026-08-15`.
  Its verified no-voice package includes the final TEST UI with Slow, Medium,
  Fast, Insane, Repeat, and exclusive Blend/Blink All controls.
- LED source: `Pinpoint/recovery_points/hub_release_v1.3.56_2026-08-15`.
  The refreshed v1.3.56 image supports Insane, Blend, and Blink All TEST
  features, with Blink All hard-capped at 5% brightness to protect the Hub
  power supply.
- The retained LED v1.3.55 flasher option now references the verified image in
  `Pinpoint/recovery_points/hub_current_build_2026-08-15`.
- `CHECKSUMS.sha256` passed for all three source release directories before
  publication.

## CrowPanel v1.3.0 No Voice (2026-08-15)

- Source: `Pinpoint/recovery_points/crowpanel_no_voice_v1.3.0_2026-08-15`.
- Application: `bins/ppx_crowpanel-no-voice-1.3.0.bin`
  (`ee2ea1d7e1efa57bea0cedce36a8e108c337d840f972c9c8ecd01942d7fa1d93`).
- This touchscreen-only ESP32-S3 layout contains bootloader, partition table,
  OTA data, and application only. It deliberately does not write a speech-model
  partition.

## CrowPanel v1.2.56 AI Voice retained (2026-08-15)

- Source: `Pinpoint/recovery_points/crowpanel_current_build_2026-08-15`.
- The existing v1.2.56 option remains available with its required speech-model
  partition at `0xC10000`.

## LED Hub Controller 1.3.55 (2026-08-15)

- Source: Pinpoint working tree based on `80e5ac5d4c7ec1febb2379f304d513084f24135c`,
  with the requested `FW_PATCH` update to `55`.
- Application: `bins/ppx_ledboard-1.3.55.bin`
  (`d4baf54ea3ec807d6d30f5ab59b2636936297aa04c004e0cbb096fd30c2a0d8d`);
  built for `esp32:esp32:esp32c3`.
- The versioned application filename and manifest query prevent stale browser
  or CDN responses.

## CrowPanel 1.2.56 and LED Hub Controller 1.3.51 (2026-08-15)

- Source: merged `NelsonAviation/Pinpoint` PR #14, commit
  `ce2079c434562d96b425b2ba6e8f83e7a724cd97`.
- CrowPanel application: `bins/ppx_crowpanel-1.2.56-ce2079c4.bin`
  (`f51df39348d8db061c82c81e20252962f7cbd2cd59ed98353c41ef35bb1afe61`);
  built with ESP-IDF 5.4 for ESP32-S3.
- LED Hub Controller application: `bins/ppx_ledboard-1.3.51-ce2079c4.bin`
  (`c381f99c8296b6901d336d7f6afad00c0f3a0e63f66f43490b168fae39178fb4`);
  built for `esp32:esp32:esp32c3`.
- Both manifests use commit-suffixed application filenames and query strings to
  prevent stale browser or CDN responses.

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
