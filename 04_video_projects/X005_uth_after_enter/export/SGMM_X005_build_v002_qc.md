# QC SGMM_X005_build_v002 — PASS, with things to check

Contact sheet (every scene join + first/last frame): `SGMM_X005_build_v002_contact.png` — look at it before sending.

| check | | detail |
|---|---|---|
| video `SGMM_X005_build_v002_1080x1920_60fps.mp4` | ✅ | h264 yuv420p 1080×1920 60/1 fps · 3592/3592 frames · 59.87 s |
| audio stream | ✅ | aac 48000 Hz 2 ch |
| loudness (decoded) | ✅ | -14.0 LUFS (target -14 ±0.5) · -2.0 dBTP (≤ -1.5) |
| video `SGMM_X005_build_v002_clean_1080x1920_60fps.mp4` | ✅ | h264 yuv420p 1080×1920 60/1 fps · 3592/3592 frames · 59.87 s |
| audio stream | ✅ | aac 48000 Hz 2 ch |
| loudness (decoded) | ✅ | -14.0 LUFS (target -14 ±0.5) · -2.0 dBTP (≤ -1.5) |
| L01 You press Enter… and the answer starts typing back. | ✅ | voice over music + effects **+13.5 dB** (≥ +12.5) · caption vs voice +0.00 s (±0.1) |
| L02 But here’s the interesting part? | ✅ | voice over music + effects **+17.8 dB** (≥ +12.5) · caption vs voice +0.00 s (±0.1) |
| L03 The model doesn’t look up a finished answer… it writes it. | ✅ | voice over music + effects **+14.1 dB** (≥ +12.5) · caption vs voice -0.01 s (±0.1) |
| L04 One small piece at a time! | ✅ | voice over music + effects **+15.8 dB** (≥ +12.5) · caption vs voice +0.00 s (±0.1) |
| L05 Look, first your message is cut into tokens. | ✅ | voice over music + effects **+14.7 dB** (≥ +12.5) · caption vs voice +0.00 s (±0.1) |
| L06 A token is about a word… or part of one. | ✅ | voice over music + effects **+13.1 dB** (≥ +12.5) · caption vs voice -0.02 s (±0.1) |
| L07 Then each token becomes a list of numbers. | ✅ | voice over music + effects **+16.0 dB** (≥ +12.5) · caption vs voice +0.00 s (±0.1) |
| L08 Now attention: every word checks which words matter to it. | ✅ | voice over music + effects **+14.8 dB** (≥ +12.5) · caption vs voice +0.00 s (±0.1) |
| L09 Then it scores every possible next word. | ✅ | voice over music + effects **+13.1 dB** (≥ +12.5) · caption vs voice +0.00 s (±0.1) |
| L10 It picks one… adds it… and guesses again. | ✅ | voice over music + effects **+13.6 dB** (≥ +12.5) · caption vs voice -0.01 s (±0.1) |
| L11 That’s why you see it typing… piece by piece. | ✅ | voice over music + effects **+15.4 dB** (≥ +12.5) · caption vs voice +0.00 s (±0.1) |
| L12 This is called… | ✅ | voice over music + effects **+15.7 dB** (≥ +12.5) · caption vs voice -0.01 s (±0.1) |
| L13 But there’s a twist! | ✅ | voice over music + effects **+13.0 dB** (≥ +12.5) · caption vs voice -0.01 s (±0.1) |
| L14 It picks the likely word… not a checked fact. | ✅ | voice over music + effects **+14.3 dB** (≥ +12.5) · caption vs voice -0.01 s (±0.1) |
| L15 That’s why AI can sound sure… and still be wrong. | ✅ | voice over music + effects **+13.5 dB** (≥ +12.5) · caption vs voice +0.00 s (±0.1) |
| L16 So AI doesn’t find your answer… it writes it! | ✅ | voice over music + effects **+14.3 dB** (≥ +12.5) · caption vs voice +0.00 s (±0.1) |
| L17 Now you see the code. | ✅ | voice over music + effects **+13.2 dB** (≥ +12.5) · caption vs voice -0.01 s (±0.1) |
| dead stretches (no motion, no sound hit ≥ 2 s) | ⚠️ | 2.2–4.3 s |
