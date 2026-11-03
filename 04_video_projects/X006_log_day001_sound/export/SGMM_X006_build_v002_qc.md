# QC SGMM_X006_build_v002 — FAIL

Contact sheet (every scene join + first/last frame): `SGMM_X006_build_v002_contact.png` — look at it before sending.

| check | | detail |
|---|---|---|
| video `SGMM_X006_build_v002_1080x1920_60fps.mp4` | ✅ | h264 yuv420p 1080×1920 60/1 fps · 1645/1645 frames · 27.42 s |
| audio stream | ✅ | aac 48000 Hz 2 ch |
| loudness (decoded) | ✅ | -14.1 LUFS (target -14 ±0.5) · -2.0 dBTP (≤ -1.5) |
| video `SGMM_X006_build_v002_clean_1080x1920_60fps.mp4` | ✅ | h264 yuv420p 1080×1920 60/1 fps · 1645/1645 frames · 27.42 s |
| audio stream | ✅ | aac 48000 Hz 2 ch |
| loudness (decoded) | ✅ | -14.1 LUFS (target -14 ±0.5) · -2.0 dBTP (≤ -1.5) |
| L01 Today I found out why our videos sound worse. | ✅ | voice over music + effects **+20.7 dB** (≥ +12.5) · caption vs voice +0.00 s (±0.1) |
| L02 I measured our mix against an explainer that sounds great. | ✅ | voice over music + effects **+23.0 dB** (≥ +12.5) · caption vs voice +0.00 s (±0.1) |
| L03 Same voice level… but we had 16 dB more deep bass. | ✅ | voice over music + effects **+14.5 dB** (≥ +12.5) · caption vs voice -0.01 s (±0.1) |
| L04 Theirs sits in the centre. Ours spreads wide. | ✅ | voice over music + effects **+15.1 dB** (≥ +12.5) · caption vs voice +0.00 s (±0.1) |
| L05 So tomorrow: cut the bass, pull it to the middle, more small hits. | ✅ | voice over music + effects **+14.8 dB** (≥ +12.5) · caption vs voice -0.01 s (±0.1) |
| L06 Day 002 starts… now. | ✅ | voice over music + effects **+15.3 dB** (≥ +12.5) · caption vs voice +0.00 s (±0.1) |
| silence 25.10–25.50 s | ✅ | -46.3 dBFS (≤ -40) |
| dead stretches (no motion, no sound hit ≥ 2 s) | ❌ | 0.6–3.2 s, 3.6–7.2 s, 11.6–14.4 s |
