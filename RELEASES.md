# Release artifacts

## LED Controller Board 1.3.3 (2026-08-13)

- Source: `NelsonAviation/Pinpoint` commit
  `60700de4330f1730fe1b748370c58affaf0fc609`
  (`fix: persist LED settings across hub resets`).
- Application artifact: `bins/ppx_ledboard.bin`
- SHA-256: `4e63afbde243b11b4aecf962dc1ace7ca75789ef923053adf31235f9a43ed1ea`
- Build target: `esp32:esp32:esp32c3:CDCOnBoot=cdc`
- Build verification: the application includes the persistence log markers
  `Restored saved LED settings` and `Saved LED settings`.
