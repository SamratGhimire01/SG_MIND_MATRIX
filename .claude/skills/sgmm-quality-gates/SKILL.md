---
name: sgmm-quality-gates
description: Every rule Samrat has given for SG Mind Matrix videos, as a checklist mapped to the pipeline step and the automatic check that enforces it. Read before starting any SGMM video and before sending anything to Samrat for approval; a video only goes to him when every gate here is green.
---

# SGMM quality gates — Samrat's rules, enforced (2 Nov 2026, after X001 "The End of the Click" was approved as v004)

Each row is something Samrat asked for (often after a bad draft). The pipeline must keep enforcing it; if a check is manual, do it every time. Details live in `sgmm-video-production`, `sgmm-scriptwriting`, `sgmm-publishing`, `08_templates/engine/README.md`.

## 1. Topic, facts, script
| Rule (Samrat's words / intent) | Where it is enforced |
|---|---|
| Every video is a **new topic** — never reuse EP000's (library → search → ask). | Ideas step: check `04_video_projects/*/script` titles before proposing. |
| **Verify every number at its original source**; list sources in the video's `research/`; flag mis-attributions (X001: 65% → high 20s was People Inc., not Condé Nast). Caption a single study as "one study". | `research/SGMM_X###_sources_v###.md`; plan `sources` + caption `kind`/`src`; `sgmm package` copy checks. |
| Scripts must be **engaging from the first to the last second** — research-backed hook, but/therefore beats, one hero number, loop ending. Always **2 options**. | `sgmm-scriptwriting` checklist before sending. |
| Topic + tension in frame 1; no hype; forecasts marked "may". | scriptwriting checklist; brand bible. |

## 2. Storyboard and look
| Rule | Where it is enforced |
|---|---|
| **Storyboard with 3 options per scene first; wait for OK; no render before.** | options page (players + key frames) published as an Artifact; render only after picks. |
| Styles come from Samrat's references, **recoloured to SGMM** (one act one style; THEN collage amber, NOW Manim white, NEXT voxel/flow green). | `08_templates/styles/*`, `STYLE_LIBRARY_v001.md`. |
| **One green element per frame** (captions included). | Look at the contact sheet; captions only bracket green when nothing else in the frame is green. Thumbnails: check the phone preview. |
| **Something moves, with its own sound, every 1.5–2 s.** A still or frozen frame loses viewers. | `08_templates/engine/beats.py`; `sgmm qc` fails any stretch ≥ 2.5 s with no motion and no sound hit. Held frames push in. |

## 3. Voice
| Rule | Where it is enforced |
|---|---|
| Record as **WAV** (48 kHz), phone ~15 cm, noise reduction off; one take. Samrat may read straight through. | Line list file; build accepts any take. |
| **Captions must line up with the voice.** | `sgmm build` aligns lines with macOS `say` + DTW (no syllable guessing); `sgmm qc` checks every caption start ±0.1 s; ⚠️ lines need a listen. |
| **No "dwar" / rumble** — voice crisp and in front. | Build sets the take to −26 dBFS before the chain and fits presence/treble/exciter to the approved curve; check the report: sub-80 Hz near −40 dB, 2–4 kHz ≈ −13, 4–8 kHz ≈ −18.5. |
| Long lines: never cut words; speed up ≤ 10 %; the picture **holds** (pushes in) instead of running ahead. | `retime` + scene `hold`. |

## 4. Mix
| Rule | Where it is enforced |
|---|---|
| Voice clearly on top: music ducked for **+15 dB**; voice ≥ **+13 dB** over music + effects. | automix + `sfx_under_voice`; `sgmm qc` per line (≥ +12.5). |
| **Effects (coin, clicks, ticks, stamps) loud enough to hear**, but every effect peak ≥ 6 dB under the voice peak. | `SFX_BOOST` / `SFX_UNDER`; build report table. |
| Talking formats use the **light bed** (steady pure drone, no detuned saws, no deep daf under the voice); music never swells between close lines. | plan `"bed": "light"`; `DUCK_HOLD`. |
| Sufi tension palette; music stops dead where the script says; silence after the blackout. | plan `silences` + cues; `sgmm qc` silence check. |
| −14 LUFS, true peak ≤ −1.5 dBTP on the **decoded MP4**. | `sgmm qc`. |

## 5. Delivery
| Rule | Where it is enforced |
|---|---|
| 1080×1920 · 60 fps · H.264 yuv420p · AAC; final + clean + stems; MP4 checked after decoding. | `sgmm qc` (frames, codecs, loudness). |
| Package: SRT timed to the voice, 3 thumbnails + vertical cover (one green each, readable at 168×94), posting kit with copy checks. | `sgmm package`. |
| Commit and push after every step; MP4 into `09_exports` only after approval. | Workflow. |

## Before sending anything to Samrat
1. `sgmm qc` = PASS (⚠️ items listened to or named in the message).
2. `beats.py` shows no dead stretch.
3. Contact sheet looked at: one green per frame, captions on the right picture.
4. Report table: voice over music + effects, effects under voice, voice band balance.
5. Say plainly what was not checked by ear.
