# SGMM render engine v001 (pipeline step 1)

`scenes.json` plan → 1080×1920 / 60 fps MP4. The scene library is EP000's approved storyboard (v008) cut into scene types; the plan places them and supplies the words.

| File | What |
|---|---|
| `sgmm_scenes.js` | Scene library: studio, hands/keyboard, collage, field, build log, logo from the dark, captions, act tags, the Sufi tension sound kit + EP000 cue sheet. `SGMM.load(plan)` → `render / frame / audio` |
| `render.mjs` | Renders a plan (headless Chrome over DevTools, frames piped to ffmpeg, 4 workers) or checks it against an old storyboard (`--compare`). No npm installs. |
| `sgmm.py` | **`sgmm build`** (step 2): voice take + plan → final + clean MP4, mastered mix, voice/music/sfx stems, re-timed plan, report · **`sgmm qc`** + **`sgmm package`** (step 3) |
| `voice_chain.txt` | the approved crisp-and-big voice chain (ffmpeg graph, EP000 v004) |
| `04_video_projects/EP000_matrix_online/edit/SGMM_EP000_scenes_v001.json` | EP000 as a plan, the reference example |

```
python3 08_templates/engine/sgmm.py build <plan.json> <voice take> [--lines lines.json] [--no-chain] [--audio-only] [--name N] [--out DIR]
python3 08_templates/engine/sgmm.py qc <build prefix>
python3 08_templates/engine/sgmm.py package <build prefix> [--out DIR]     (default 09_exports)
python3 08_templates/engine/sgmm.py preview <plan.json> [--out page.html]   (storyboard page + PNG for sign-off)
python3 08_templates/engine/sgmm.py selftest
node 08_templates/engine/render.mjs <plan.json> <out.mp4> [--workers 4] [--clean] [--from s] [--to s] [--audio mix.wav]
node 08_templates/engine/render.mjs <plan.json> --score-out <prefix>
node 08_templates/engine/render.mjs <page.html> --canvas <dir>
node 08_templates/engine/render.mjs <plan.json> --compare <storyboard.html> [--every 0.25]
```
Needs Google Chrome (or `SGMM_CHROME=/path/to/chrome`), ffmpeg and network access to Google Fonts.

## Scene types
Each type keeps its EP000 choreography on its own clock. `at` is where it starts on that clock; the EP000 length is what the choreography was built for. Placing a scene shorter cuts it early; longer keeps the clock running past EP000's end (camera drifts on), so look at those frames. Overlapping scenes cross-dissolve.

| type | EP000 length | what it is | text keys |
|---|---|---|---|
| `enter_in_dark` | 2.25 s | pitch black, hand rises from below, index finger presses green Enter, room floods | – |
| `studio_reveal` | 3.05 s | pull back from the key to the wide studio; screens read THEN · NOW · NEXT | – |
| `push_screen` | 1.6 s | push through the left (THEN) screen | – |
| `collage_library` | 6.65 s | THEN paper collage: hand pulls book, cover turns, opens, pages, clock, green marker ring | `then_label` `then_kicker` `then_word1` `then_word2` |
| `type_hands` | 2.7 s | both hands typing from below, rising to the top screen | – |
| `ots_screen` | 6.6 s | over the shoulder at the top (NOW) screen; question typed, answer streams | `question` |
| `look_right` | 5.95 s | head turns right, pan and push into the right (NEXT) screen | `question` (still on the top screen) |
| `manim_links_answer` | 6.2 s | **NOW in the Manim style** (from `08_templates/styles/manim/sgmm_manim.js`, option A): the question Writes on, ten result rows Create, an Amber box marks the effort, the rows collapse into one written answer, green box round it, "10 links" → "1 answer" | `now_question` `now_answer` [2 lines] `now_from` ["10", " links"] `now_to` ["1", " answer"] |
| `field_push` | 2.8 s | full-frame NEXT flow field with 3D matte forms converging | – |
| `build_log` | 9.4 s | from behind, typing; REC · DAY chip, build-log card, three cards, Mac mini wipe | `log_rec` `log_day` `log_kicker` `log_title` `log_sub` `log_cards` (SHIFT/TOOL/BUILD have pictograms) `log_tagline` |
| `end_push_dark` | 1.45 s | screens go off, push into the dark top screen | – |
| `logo_from_dark` | 2.8 s | the mark rises behind a thin light line, small bounce, THEN · NOW · NEXT | – |
| `blackout_tease` | 2.61 s | black, typed tease, last frame black (Shorts loop) | `tease` |

`text` at plan level is shared by every scene (the screens show the collage and chat in several scenes); `scene.text` overrides it. Missing keys fall back to EP000's words.

Captions: `"is already [being written.]"` — brackets are the one green element, `\n` breaks the line. Act tags take their colour from the label (THEN amber, NOW white, NEXT green).

## Style modules
A style lives in `08_templates/styles/<style>/` and adds scene types through `window.SGMM_STYLE_SCENES = {name: {at, trail, draw(ctx, t, text)}}`; it is loaded before `sgmm_scenes.js` (list: `STYLE_FILES` in `render.mjs` and `sgmm.py`). Draw in 1080×1920 logical pixels, pure function of t, leave act tags and captions to the engine. EP000 still renders byte-identical with the Manim module loaded.

## `sgmm build` (step 2)
1. **Split** — finds speech in the take (one file, ~2 s pauses) and matches it to the plan's captions (one caption = one line) by text length, so a pause inside a line stays inside it. Writes `<name>_voice_lines.json`; fix a wrong boundary there and pass it back with `--lines`.
2. **Re-time** — each line starts at its caption; if it runs past the caption end (+0.1 s tail allowed): move it earlier (keeping 0.15 s after the previous line), then speed it up ≤10 % (pitch kept), then insert time 0.5 s before the slot ends — everything after moves later, the scene across that point **holds its picture** for the inserted time (`"hold"` on the scene), and the plan gets `"warp"` so the score's cue sheet moves with the picture. Words are never cut. Captions follow the voice (end = voice end + 0.25 s).
3. **Score** — the plan's named score, warped, plus the plan's own `"cues"` (`{"t":28,"cue":"impact","g":1.2}`; one-shots `key tick click thud impact whoosh riser paper slide put tear stroke ding`, `{"cue":"daf","kind":"dum"}`, `{"cue":"cut","reopen":28}` = music stops dead). `"score": null` = cues only.
4. **Voice chain** — `voice_chain.txt` (skip with `--no-chain` when the take is already processed).
5. **Automix** — per line, the background dips just enough for the voice to sit **+15 dB** over it (4–18 dB dips, voice-pocket EQ on the background while he speaks).
6. **Master** — −14 LUFS, true peak ≤ −1.5 dBTP (limiter at 4× rate).
7. **Render** — final (captions) and clean MP4 with the master, AAC 320k. `--audio-only` stops before this.

Output in the episode's `export/`: `<name>_1080x1920_60fps.mp4`, `_clean_…mp4`, `_mix.wav` (master, 24-bit), `_voice.wav`, `_music.wav`, `_sfx.wav` (score stems, not ducked), `_plan.json` (re-timed plan), `_voice_lines.json`, `_report.md` (per-line voice-over-background, loudness, video check).

## `sgmm qc` (step 3)
Reads `<prefix>_plan.json`, both MP4s and `_voice.wav`; writes `<prefix>_qc.md` and `<prefix>_contact.png`; exit 1 on FAIL.
- both MP4s: H.264 yuv420p, plan size and fps, exact frame count, AAC 48 kHz stereo; decoded loudness −14 ±0.5 LUFS, true peak ≤ −1.5 dBTP
- every line: voice over background ≥ +14.5 dB (target +15), measured from the delivered mix; caption starts within ±0.1 s of the voice (⚠️ "listen" when a line runs on from the last one with no pause, so its start can't be measured)
- intended silences: the plan's `"silences": [[a, b], ...]` stay under −40 dBFS (e.g. the dead stop after "rewritten.")
- contact sheet: a still at every scene join + first and last frame — look at it before sending

## `sgmm package` (step 3)
Into `09_exports/` (or `--out`): `<name>_captions_en.srt` (captions = voice timing), `_thumb_A/B/C_<name>_1280x720.png` + `_cover_vertical_1080x1920.png` (the approved template `08_templates/thumbnail/sgmm_thumbnail_template.html`, rendered 3× and downsampled), `_thumbs_phone_preview.png` (168×94, as YouTube shows them), `_POSTING_KIT.md` (sgmm-publishing skill). Words and frames come from the plan's `"publish"` block (Claude writes it with the script): `titles`, `why`, `summary`, `hashtags`, `tags`, `pinned`, `x_post`, `day`, `shorts_frame`, `thumbs` (`A {small, big}`, `B/C {t, y, lines}`, `vertical {lines, big}`, `names`, `pick`; `[word]` = the one green). Copy checks in the kit: titles ≤ 60 chars and no hashtags, 3–5 hashtags with #Shorts, no #viral/#fyp, ≤ 2 hashtags and no YouTube link on X, no hype words, no TODOs left.

EP000 test (2 Nov 2026): thumbnails regenerate the approved set (PSNR 42–50 dB), the kit matches the approved kit plus a thumbnails section and the QC line, the SRT follows the real voice.

## `sgmm preview` (step 4a)
Writes `../storyboard/<name>_storyboard_v###.html` next to the plan's `edit/` folder (one self-contained page: scene library + plan inline; silent animatic with scrubber, a key frame at the middle of every scene and every voice line, on-screen text, act tags, script table with fact/forecast + sources, open items from `notes`) and the same cards as `…_storyboard_v###.png`. Publish the HTML as an Artifact so Samrat can approve it on the phone. Template: `storyboard_page.html`. Daily format templates: `08_templates/formats/`.

## Scores
- `"score": "sufi_tension_ep000"` — EP000's hand-written cue sheet (46 s, unchanged, byte-identical).
- `"score": "sufi_tension"` — **any plan** (2 Nov 2026): every scene type brings its EP000 sounds on its own clock (`SCENE_SOUND` in `sgmm_scenes.js`; a style scene brings its own `sound`), kept inside the scene's window; the beds follow the plan: drone from the Enter press to the dead stop before the NEXT hit (`field_push`, cut 0.52 s before it), a brighter drone from the hit to the blackout, the opening breath choir + ney until the first act, the 6/8 daf that builds through NOW, the accelerating drum and cluster into the blackout, music dead after it. Section levels match EP000's (NOW is the quiet act, for the voice).
- `"cues"` still add one-shots on top; `null` = cues only.

## Not yet
- Scene choreography plays at EP000 speed; a `speed` field is the first thing to add when a new plan needs it.
- No `real_clip` / `mask_host` / `setup_tour` types yet (v002 analysis §3).

## Proof (2 Nov 2026)
`--compare` against `storyboard/SGMM_EP000_storyboard_v008.html`, every 0.1 s: **460/460 frames byte-identical**, score within **1 LSB** (Chrome's offline audio differs from itself by 1 LSB run to run).
