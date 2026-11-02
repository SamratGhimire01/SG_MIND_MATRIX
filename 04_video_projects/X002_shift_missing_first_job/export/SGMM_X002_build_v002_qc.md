# QC SGMM_X002_build_v002 — PASS, with things to check

Contact sheet (every scene join + first/last frame): `SGMM_X002_build_v002_contact.png` — look at it before sending.

| check | | detail |
|---|---|---|
| video `SGMM_X002_build_v002_1080x1920_60fps.mp4` | ✅ | h264 yuv420p 1080×1920 60/1 fps · 2158/2158 frames · 35.97 s |
| audio stream | ✅ | aac 48000 Hz 2 ch |
| loudness (decoded) | ✅ | -14.0 LUFS (target -14 ±0.5) · -1.9 dBTP (≤ -1.5) |
| video `SGMM_X002_build_v002_clean_1080x1920_60fps.mp4` | ✅ | h264 yuv420p 1080×1920 60/1 fps · 2158/2158 frames · 35.97 s |
| audio stream | ✅ | aac 48000 Hz 2 ch |
| loudness (decoded) | ✅ | -14.0 LUFS (target -14 ±0.5) · -1.9 dBTP (≤ -1.5) |
| L01 AI isn’t taking the last job. It’s taking the first one. | ⚠️ | voice over music + effects **+13.2 dB** (≥ +12.5) · no pause before this line (it runs on from the last one), so its start can't be measured — **listen** |
| L02 Your first job used to be the boring part. | ✅ | voice over music + effects **+14.9 dB** (≥ +12.5) · caption vs voice -0.01 s (±0.1) |
| L03 Coffee. Spreadsheets. First drafts. That’s how you learned. | ⚠️ | voice over music + effects **+14.3 dB** (≥ +12.5) · no pause before this line (it runs on from the last one), so its start can't be measured — **listen** |
| L04 But now AI does the boring part. | ⚠️ | voice over music + effects **+17.5 dB** (≥ +12.5) · no pause before this line (it runs on from the last one), so its start can't be measured — **listen** |
| L05 So companies hire fewer beginners. | ⚠️ | voice over music + effects **+17.1 dB** (≥ +12.5) · no pause before this line (it runs on from the last one), so its start can't be measured — **listen** |
| L06 One study: young workers in AI-exposed jobs are 19% behind their peers. | ✅ | voice over music + effects **+13.0 dB** (≥ +12.5) · caption vs voice -0.00 s (±0.1) |
| L07 Experienced workers? No gap. | ⚠️ | voice over music + effects **+15.5 dB** (≥ +12.5) · no pause before this line (it runs on from the last one), so its start can't be measured — **listen** |
| L08 So if nobody starts at the bottom… | ✅ | voice over music + effects **+18.0 dB** (≥ +12.5) · caption vs voice -0.02 s (±0.1) |
| L09 who becomes the expert? | ✅ | voice over music + effects **+13.2 dB** (≥ +12.5) · caption vs voice -0.00 s (±0.1) |
| silence 33.66–34.06 s | ✅ | -45.3 dBFS (≤ -40) |
| dead stretches (no motion, no sound hit ≥ 2 s) | ⚠️ | 5.0–7.1 s, 18.3–20.8 s, 23.2–25.6 s, 28.3–30.6 s |
