# SGMM video pipeline — design v001 (2 Nov 2026)

Goal: make every Short and long-form video with the EP000 quality, **in a few hours of Samrat's time and a small fraction of the tokens EP000 took**, by reusing what we already built instead of re-inventing it each time.

Status: **design only.** Build when Samrat approves (see "Build plan" at the end).

---

## 1. What we already have (from EP000)

| Piece | Where | Reusable as |
|---|---|---|
| Studio, hands/keyboard, collage library, 3D NEXT field, build-log cards, logo-from-the-dark, act tags, captions | `04_video_projects/EP000_matrix_online/storyboard/SGMM_EP000_storyboard_v008.html` | **Scene library** — each becomes a scene type |
| Frame renderer (60 fps, motion blur, 4 workers) + encoder | `edit/animatic/export_frames.js`, `encode.sh` | **Render engine** |
| Sufi tension score kit (ney, daf, drone, choir, silence cuts) + SFX kit | `makeKit()` + `score()` in v008, `05_audio/music/SGMM_THEME_sufi_tension_v001.md` | **Score engine** (cues come from the scene plan) |
| Voice line finder (pocketsphinx), placer, approved crisp+big voice chain, per-line automix (+15 dB) | `edit/animatic/build_vo.py`, `voice_chain.txt`, `automix.py` | **Voice engine** |
| Thumbnails (Swiss system, 3 concepts + vertical) | `08_templates/thumbnail/` | **Thumbnail engine** |
| Titles, description, tags, hashtags, X post, settings | `.claude/skills/sgmm-publishing` | **Posting kit generator** |
| Samrat's taste (likes / rejections) | `.claude/skills/sgmm-video-production` | **Rules every stage checks** |

## 2. Samrat's real setup (the pipeline is built around it)

- **Computer:** Mac mini M4 — runs Claude Code, Node, ffmpeg, DaVinci Resolve 21, CapCut, OBS.
- **Screens:** AOC (left = THEN), Himstar top (NOW), Philips (right = NEXT); green LED wall; RGB keyboard.
- **Camera:** phone, Blackmagic Camera app (lock exposure / white balance / focus, 30 fps, 4K; vertical for Shorts, horizontal for long-form).
- **Microphone:** phone voice recorder for now. Rules learned: 15 cm from the mouth, aimed at the mouth, **all "noise reduction / enhance" off**, quiet soft room. One file with ~2 s pauses between lines is fine. Upgrade later: a USB/lav mic is the single biggest quality jump.
- **Screen capture:** OBS (real Claude chats on the brand profile, builds, tools).
- **Anonymity:** no face, no name, no lanyard, no personal profile, no other creators' wallpapers.

## 3. The pipeline (both formats)

```
 1 IDEA ──► 2 SCRIPT ──► 3 SCENE PLAN ──► 4 RECORD ──► 5 AUTO-BUILD ──► 6 QC ──► 7 PACKAGE ──► 8 POST ──► 9 LEARN
 (Claude)   (Samrat +    (Claude, small    (Samrat:     (machine: voice,  (auto    (video, clean,  (Samrat   (analytics
            Claude)      JSON)             voice +      render, score,    checks)  stems, SRT,     or later  → skills)
                                           footage)     mix)                       thumbs, kit)    Studio)
```

| # | Stage | Who | Input → Output | Token cost (rough) |
|---|---|---|---|---|
| 1 | **Idea** — 5 ranked topics that fit THEN/NOW/NEXT, with sources and why they'd perform | Claude (web search) | topic area → `idea.md` | ~20–40k |
| 2 | **Script** — Samrat writes/approves; Claude tightens, checks every claim has a source, labels fact/forecast/speculation, times each line | Samrat + Claude | idea → `script.md` (lines with target seconds) | ~5–10k |
| 3 | **Scene plan** — Claude picks scene types from the library + Samrat's style picks, writes on-screen text, timings, camera, sound cues | Claude | script → `scenes.json` (Short ≈ 1–3k tokens; long-form ≈ 10–25k) | ~5–30k |
| 4 | **Record** — voice (one file), optional setup footage (shot list generated from the plan), OBS captures, collage photos | Samrat | phone/OBS → `footage/`, `voice/` | 0 |
| 5 | **Auto-build** — find & place each voice line → re-time scenes to the real voice → render scenes (4 workers) → composite real footage → score from cues → voice chain → automix | machine | plan + recordings → `final.mp4`, `clean.mp4`, stems | ~0 (scripts) |
| 6 | **QC** — frame count, loudness −14 LUFS, voice +15 dB over background on every line, intended silences, stills at every join, caption sync | machine, Claude looks at the contact sheet | → `qc_report.md` | ~3–5k |
| 7 | **Package** — final + clean + stems + SRT + 3 thumbnails + vertical cover + posting kit (title, description, tags, hashtags, X post, pinned comment) | machine + Claude (copy) | → `09_exports/` | ~3–5k |
| 8 | **Post** — YouTube schedule 7:45 pm NPT, X 15 min later, first reply with link | Samrat (Studio app later) | | 0 |
| 9 | **Learn** — fill `06_research/analytics.md` at 24 h; Claude updates the skills with what worked | Samrat + Claude | | ~2k |

**Total per Short ≈ 40–90k tokens; per long-form ≈ 80–150k** — versus EP000, which was built from scratch over many iterations and cost far more. Notes after review become small edits to `scenes.json`, not rewrites (≈1–3k each).

### Why voice comes before final timing
EP000 taught us: Samrat's real pace differs from the planned windows. So the plan has target times, but **after recording, the engine re-times scenes to the real voice** (with the rules: speed up ≤10%, never cut words, captions follow the voice). No more fitting the voice into a fixed animation.

## 4. Shorts vs long-form

| | **Shorts / Reels** | **Long-form (8–15 min)** |
|---|---|---|
| Format | 1080×1920, **60 fps** | 1920×1080 (or 4K), **30 fps** (render time: 15 min @60 fps = 54k frames; @30 = 27k) |
| Structure | Hook in pitch black (frame 1 must read) → THEN → NOW → NEXT → logo from the dark → blackout tease; seamless loop | Cold open (30 s) → promise → chapters, each THEN/NOW/NEXT → honest section → invitation; YouTube chapters in the description |
| Picture | 100% rendered by the engine (+ optional phone clips) | **Real footage + narration is the spine**; the engine renders 3–6 segments per episode (collage, diagram, field, title cards, lower-thirds) |
| Edit | Fully automatic | Engine outputs segments + a **assembled master + numbered clips for CapCut** (Samrat uses CapCut only for joining/trims) |
| Score | Full Sufi tension score | Same kit, lighter: bed under talking, the big cues only at act changes; music ducks harder under long narration |
| Voice | One file, ~14 lines | Record per chapter; same auto-split, chain and automix |
| Deliverables | final, clean, stems, SRT, cover, kit | segments, Resolve timeline, voice/music stems, SRT, 3 thumbnails (Test & Compare), chapters, kit |
| Samrat's time | ~1–2 h (script, record, review) | ~1–2 days (script, record, shoot, finish in Resolve) |

## 5. Styles and "click to combine"
- `08_templates/styles/<style>/` — one folder per style: `style.json` (palette, fonts, motion rules, allowed scenes), preview still, the scene renderer code.
- Built-in styles from EP000: **Studio (2D desk)**, **Archive Collage (THEN)**, **Signal Diagram (NOW, Manim-like)** — not built yet, **Emergence Field (NEXT)**, **Swiss titles**, **Build-log cards**, **Logo-from-the-dark**.
- Samrat's 3–4 new styles get added the same way. In `scenes.json` each scene names its style; the rule "one act, one style" is checked automatically.
- Later, the Studio app shows these as clickable cards and writes `scenes.json` for him.

## 6. The scene-plan format (what Claude writes)
```json
{
  "episode": "EP001", "format": "short", "fps": 60, "size": [1080,1920],
  "voice": "voice/EP001_take1.wav",
  "scenes": [
    {"id": "hook",  "style": "studio",   "type": "pitch_black_enter", "line": "L01", "t": [0, 2]},
    {"id": "then",  "style": "collage",  "type": "collage_story", "line": ["L02","L03"],
     "text": {"headline": "SEARCHED", "kicker": "THEN · THE LIBRARY"}, "props": ["shelf","hand_pull_book","clock"], "t": [5, 13]},
    {"id": "now",   "style": "studio",   "type": "ots_screen", "screen": "top", "content": "real_capture:footage/chat.mp4", "t": [13, 22]},
    {"id": "next",  "style": "field",    "type": "push_through", "screen": "right", "forms": true, "t": [22, 30]},
    {"id": "log",   "style": "cards",    "type": "build_log", "cards": ["SHIFT","TOOL","BUILD"], "t": [30, 39]},
    {"id": "end",   "style": "logo",     "type": "from_the_dark", "tease": "NEW EPISODE · EVERY SATURDAY", "t": [39, 46]}
  ],
  "score": {"theme": "sufi_tension", "silences": [27.5, 43.4], "hits": [1.15, 28.0, 41.0]}
}
```
Claude writes only this. Everything else is code that already exists.

## 7. Setup footage (Samrat's real desk) — how it plugs in
- From `scenes.json` the pipeline prints a **shot list**: which shots, phone orientation, distance, movement, which screen shows what (it also renders the screen files to play on the AOC / Himstar / Philips while filming).
- Samrat films; footage goes in `04_video_projects/EP###/footage/`.
- A scene can use `"source": "footage/xyz.mp4"` instead of a drawn studio: the engine trims it, colour-matches it to the grade (lift blacks, shadows to green), and composites captions, act tags and cards on top.
- Long-form: the footage is the spine in the Resolve timeline; rendered segments drop between chapters.
- A future **"The Setup" episode** (Mac mini M4 tour) runs through the same pipeline with mostly footage.

## 8. Where it runs
On the **Mac mini M4** with Claude Code in the repo (`claude` in the `SG_MIND_MATRIX` folder) — rendering a 46 s Short at 60 fps takes ~10 min on 4 cores; the M4 should be similar or faster. One command per stage, e.g.:
```
sgmm new short "how AI changed homework"     # 1–3: idea, script draft, scenes.json
sgmm shotlist EP001                          # what to record / film
sgmm build EP001                             # 5: voice → retime → render → score → mix
sgmm qc EP001 && sgmm package EP001          # 6–7
```

## 9. Build plan (when approved)
1. Extract the EP000 scenes into a **scene library** (one module per scene type) + `scenes.json` loader. Re-render EP000 from a JSON plan to prove it matches.
   **Done 2 Nov 2026** → `08_templates/engine/` (12 scene types, `render.mjs`); EP000 plan `04_video_projects/EP000_matrix_online/edit/SGMM_EP000_scenes_v001.json` renders byte-identical to storyboard v008.
2. `sgmm build`: voice split → retime → render → score from cues → chain → automix (all exist; wire them together).
   **Done 2 Nov 2026** → `08_templates/engine/sgmm.py build`; tested on EP000 against final v004 (`04_video_projects/EP000_matrix_online/export/SGMM_EP000_build_v001_report.md`).
3. `sgmm qc` + `sgmm package` (thumbnail + posting kit generation).
   **Done 2 Nov 2026** → `sgmm.py qc` / `sgmm.py package`; EP000 test regenerates the approved thumbnails and posting kit.
4. Make the **3 X videos** (shift / tip / log) with it as the first real test.
   **4a done 2 Nov 2026** → `08_templates/formats/` (3 plan templates) + `sgmm.py preview` (storyboard page); sample X001 SHIFT waiting for approval. **4b next:** score from scene cues (no music bed for new lengths yet).
5. Long-form: segment rendering at 30 fps + assembled master + numbered clips for CapCut.
6. Add Samrat's 3–4 styles.
7. Later: plug into the SGMM Studio app (`07_scripts/IDEA_SGMM_Studio_app.md`).
