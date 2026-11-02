# SGMM_EP000_build_v001

plan `04_video_projects/EP000_matrix_online/edit/SGMM_EP000_scenes_v001.json` · voice `05_audio/voice_final/SGMM_EP000_voice_aligned_v004.wav` · chain off (take already processed)

| # | line | source | placed | tempo | voice over bg before → after |
|---|---|---|---|---|---|
| L01 | This is the Matrix. | 0.06–1.22 | 0.04–1.20 | ×1.00 | +11.6 → **+15.6 dB** |
| L02 | A generation ago… | 6.88–8.18 | 6.90–8.20 | ×1.00 | +9.8 → **+15.2 dB** |
| L03 | you searched. | 8.69–9.40 | 8.70–9.41 | ×1.00 | +10.0 → **+15.8 dB** |
| L04 | And you waited. | 10.79–11.59 | 10.80–11.60 | ×1.00 | +7.1 → **+15.3 dB** |
| L05 | Today, you just ask. | 15.80–16.79 | 15.80–16.79 | ×1.00 | +15.0 → **+19.2 dB** |
| L06 | And something answers. | 19.23–20.49 | 19.30–20.56 | ×1.00 | +14.8 → **+19.0 dB** |
| L07 | What comes next… | 24.55–25.59 | 24.60–25.64 | ×1.00 | +12.7 → **+17.0 dB** |
| L08 | is already being written. | 27.98–29.94 | 28.00–29.96 | ×1.00 | +6.4 → **+15.4 dB** |
| L09 | I’m going to document all of it. | 30.98–33.09 | 31.00–33.11 | ×1.00 | +14.3 → **+18.5 dB** |
| L10 | Every shift. Every tool. | 33.80–35.49 | 33.80–35.49 | ×1.00 | +9.5 → **+15.4 dB** |
| L11 | Everything I build, in public. | 36.00–38.16 | 36.00–38.16 | ×1.00 | +9.7 → **+15.4 dB** |
| L12 | This is SG Mind Matrix. | 39.43–41.62 | 39.45–41.64 | ×1.00 | +7.8 → **+15.2 dB** |
| L13 | The world is being rewritten. | 41.70–43.45 | 41.70–43.45 | ×1.00 | +9.3 → **+15.5 dB** |
| L14 | Let’s build it together. | 44.43–46.01 | 44.47–46.05 | ×1.00 | +10.4 → **+15.2 dB** |

- voice over background: worst line **+15.2 dB** (target +15)
- master: **-13.9 LUFS**, true peak **-1.9 dBTP** (target -14 / -1.5)
- duration 46 s · no time inserted
- `SGMM_EP000_build_v001_1080x1920_60fps.mp4`: h264,1080,1920,yuv420p,60/1,2760, · aac,48000,0/0,2157 · decoded audio -14.0 LUFS / -1.9 dBTP
- `SGMM_EP000_build_v001_clean_1080x1920_60fps.mp4`: h264,1080,1920,yuv420p,60/1,2760, · aac,48000,0/0,2157 · decoded audio -14.0 LUFS / -1.9 dBTP

## Compared with the approved final v004 (2 Nov 2026)
Test input: `voice_aligned_v004.wav` (already processed, so `--no-chain`; no raw take in the repo). Lines file `edit/SGMM_EP000_voice_lines_v004.json`: auto-split matched 13/14 lines; L12/L13 sit 80 ms apart in this placed file, so that one boundary is taken from the v004 automix windows.

| | v004 | build v001 |
|---|---|---|
| line starts | — | same within 0.03 s (L01 −0.01, L14 −0.03) |
| voice over background, worst line (same estimator for both) | +11.1 dB (L11) | **+15.1 dB** |
| loudness / true peak (decoded MP4) | −14.0 LUFS / −1.5 dBTP | −14.0 LUFS / −1.9 dBTP |
| after "rewritten." 43.50–43.95 s | −36.8 dBFS | −49.2 dBFS (cleaner dead stop) |
| picture | — | same frames; PSNR clean vs clean 42.3 dB avg, differences = caption fades re-timed to the voice |
| frames / codec | 2760 · H.264 yuv420p · AAC 48 kHz | 2760 · H.264 yuv420p · AAC 48 kHz 320k |

Score: the engine's EP000 score equals `score_v001` (correlation 0.9995), 5 ms earlier. Contact sheet: `SGMM_EP000_build_v001_vs_v004.png` (each pair v004 | build; 0.6, 9, 17, 29 / 35, 41, 43.2, 44.8 s).
