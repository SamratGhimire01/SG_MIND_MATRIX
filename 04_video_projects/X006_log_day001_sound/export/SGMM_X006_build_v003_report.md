# SGMM_X006_build_v003

plan `04_video_projects/X006_log_day001_sound/edit/SGMM_X006_scenes_v001.json` · voice `04_video_projects/X006_log_day001_sound/footage/voice/SGMM_X006_voice_elevenlabs_v001.mp3` · chain on

| # | line | source | placed | tempo | voice over bg before → after |
|---|---|---|---|---|---|
| L01 | Today I found out why our videos sound worse. | 0.11–2.91 | 0.11–2.91 | ×1.00 | +19.1 → **+18.2 dB** |
| L02 | I measured our mix against an explainer that sounds great. | 3.27–6.23 | 3.27–6.23 | ×1.00 | +13.2 → **+16.1 dB** |
| L03 | Same voice level… but we had 16 dB more deep bass. | 6.76–11.05 | 6.76–11.05 | ×1.00 | +8.3 → **+14.2 dB** |
| L04 | Theirs sits in the centre. Ours spreads wide. | 11.42–14.65 | 11.42–14.65 | ×1.00 | +5.9 → **+13.0 dB** |
| L05 | So tomorrow: cut the bass, pull it to the middle, more small hits. | 15.06–19.53 | 15.06–19.53 | ×1.00 | +5.0 → **+13.2 dB** |
| L06 | Day 002 starts… now. | 19.96–21.70 | 19.96–21.70 | ×1.00 | +8.5 → **+14.4 dB** |

| line | effects peak vs voice peak (cap −6 dB) |
|---|---|
| L01 | -6.0 dB (turned down 8.7 dB) |
| L02 | -6.0 dB (turned down 7.8 dB) |
| L03 | -6.0 dB (turned down 12.2 dB) |
| L04 | -6.0 dB (turned down 7.8 dB) |
| L05 | -6.0 dB (turned down 8.1 dB) |
| L06 | -6.0 dB (turned down 9.1 dB) |

- voice over music + effects: worst line **+13.0 dB** (music ducked for +15; with the effects at least +13)
- master: **-14.0 LUFS**, true peak **-2.1 dBTP** (target -14 / -1.5)
- duration 27.41 s · no time inserted
- `SGMM_X006_build_v003_1080x1920_60fps.mp4`: h264,1080,1920,yuv420p,60/1,1645, · aac,48000,0/0,1285 · decoded audio -14.0 LUFS / -1.9 dBTP
- `SGMM_X006_build_v003_clean_1080x1920_60fps.mp4`: h264,1080,1920,yuv420p,60/1,1645, · aac,48000,0/0,1285 · decoded audio -14.0 LUFS / -1.9 dBTP
