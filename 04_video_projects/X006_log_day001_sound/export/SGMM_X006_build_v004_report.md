# SGMM_X006_build_v004

plan `04_video_projects/X006_log_day001_sound/edit/SGMM_X006_scenes_v001.json` · voice `04_video_projects/X006_log_day001_sound/footage/voice/SGMM_X006_voice_elevenlabs_v001.mp3` · chain on

| # | line | source | placed | tempo | voice over bg before → after |
|---|---|---|---|---|---|
| L01 | Today I found out why our videos sound worse. | 0.11–2.91 | 0.11–2.91 | ×1.00 | +19.1 → **+17.9 dB** |
| L02 | I measured our mix against an explainer that sounds great. | 3.27–6.23 | 3.27–6.23 | ×1.00 | +13.2 → **+15.0 dB** |
| L03 | Same voice level… but we had 16 dB more deep bass. | 6.76–11.05 | 6.76–11.05 | ×1.00 | +8.3 → **+14.9 dB** |
| L04 | Theirs sits in the centre. Ours spreads wide. | 11.42–14.65 | 11.42–14.65 | ×1.00 | +5.9 → **+13.3 dB** |
| L05 | So tomorrow: cut the bass, pull it to the middle, more small hits. | 15.06–19.53 | 15.06–19.53 | ×1.00 | +5.0 → **+14.8 dB** |
| L06 | Day 002 starts… now. | 19.96–21.70 | 19.96–21.70 | ×1.00 | +8.5 → **+16.8 dB** |

| line | effects peak vs voice peak (cap −6 dB) |
|---|---|
| L01 | -6.0 dB (turned down 7.2 dB) |
| L02 | -6.0 dB (turned down 9.5 dB) |
| L03 | -6.0 dB (turned down 12.2 dB) |
| L04 | -6.0 dB (turned down 5.6 dB) |
| L05 | -6.0 dB (turned down 3.8 dB) |
| L06 | -6.0 dB (turned down 6.0 dB) |

- voice over music + effects: worst line **+13.3 dB** (music ducked for +15; with the effects at least +13)
- master: **-14.0 LUFS**, true peak **-2.1 dBTP** (target -14 / -1.5)
- duration 27.41 s · no time inserted
- `SGMM_X006_build_v004_1080x1920_60fps.mp4`: h264,1080,1920,yuv420p,60/1,1645, · aac,48000,0/0,1285 · decoded audio -14.1 LUFS / -2.0 dBTP
- `SGMM_X006_build_v004_clean_1080x1920_60fps.mp4`: h264,1080,1920,yuv420p,60/1,1645, · aac,48000,0/0,1285 · decoded audio -14.1 LUFS / -2.0 dBTP
