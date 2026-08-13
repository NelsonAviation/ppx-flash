# Release artifacts

## LED Controller Board 1.3.1 (2026-08-13)

- Source: `NelsonAviation/Pinpoint` commit
  `f51ec766c609dea1b7786545df0e45c9ba705af4` (current `main`; includes
  `f68fdc82`, **Disable numeric input for alphabetic-only boards**).
- Application artifact: `bins/ppx_ledboard.bin`
- SHA-256: `b3d6d213cf392ea1ccfb465d5796a4bea5d12bf8bcf64d4185560faaa56c9959`
- Build target: `esp32:esp32:esp32c3:CDCOnBoot=cdc`
- Validation: canonical `NA-LED-0086.bims` has 110 non-numeric pin labels and
  no numeric labels. Its detected capability flags are `0x91`:
  `PPX_HAT_CAP_BIMS | PPX_HAT_CAP_LABELS | PPX_HAT_CAP_ALPHA_ONLY`.
