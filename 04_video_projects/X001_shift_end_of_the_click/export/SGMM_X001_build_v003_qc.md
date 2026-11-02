# QC SGMM_X001_build_v003 — PASS, with things to check

Contact sheet (every scene join + first/last frame): `SGMM_X001_build_v003_contact.png` — look at it before sending.

| check | | detail |
|---|---|---|
| video `SGMM_X001_build_v003_1080x1920_60fps.mp4` | ✅ | h264 yuv420p 1080×1920 60/1 fps · 1873/1873 frames · 31.22 s |
| audio stream | ✅ | aac 48000 Hz 2 ch |
| loudness (decoded) | ✅ | -14.0 LUFS (target -14 ±0.5) · -1.7 dBTP (≤ -1.5) |
| video `SGMM_X001_build_v003_clean_1080x1920_60fps.mp4` | ✅ | h264 yuv420p 1080×1920 60/1 fps · 1873/1873 frames · 31.22 s |
| audio stream | ✅ | aac 48000 Hz 2 ch |
| loudness (decoded) | ✅ | -14.0 LUFS (target -14 ±0.5) · -1.7 dBTP (≤ -1.5) |
| L01 Every time you don’t click a link… someone loses money. | ✅ | voice over background **+16.0 dB** (≥ +14.5) · caption vs voice +0.00 s (±0.1) |
| L02 The old deal was simple. | ✅ | voice over background **+21.0 dB** (≥ +14.5) · caption vs voice -0.02 s (±0.1) |
| L03 You searched. Ten blue links. One click paid the website. | ⚠️ | voice over background **+22.5 dB** (≥ +14.5) · no pause before this line (it runs on from the last one), so its start can't be measured — **listen** |
| L04 But now AI answers on top. | ✅ | voice over background **+23.5 dB** (≥ +14.5) · caption vs voice -0.02 s (±0.1) |
| L05 So you don’t click. | ⚠️ | voice over background **+21.6 dB** (≥ +14.5) · caption vs voice -0.13 s (±0.1) |
| L06 One study: Google traffic to publishers fell 40% in a year. | ⚠️ | voice over background **+15.9 dB** (≥ +14.5) · no pause before this line (it runs on from the last one), so its start can't be measured — **listen** |
| L07 Condé Nast told its teams: plan as if search is zero. | ✅ | voice over background **+21.3 dB** (≥ +14.5) · caption vs voice -0.02 s (±0.1) |
| L08 So websites may write for AIs… not for you. | ✅ | voice over background **+23.0 dB** (≥ +14.5) · caption vs voice -0.00 s (±0.1) |
| L09 And when no one clicks… who gets paid? | ✅ | voice over background **+23.3 dB** (≥ +14.5) · caption vs voice -0.06 s (±0.1) |
| silence 28.91–29.31 s | ✅ | -45.3 dBFS (≤ -40) |
| dead stretches (no motion, no sound hit ≥ 2 s) | ✅ | none |
