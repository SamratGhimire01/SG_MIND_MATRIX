# SGMM render engine v001 (pipeline step 1)

`scenes.json` plan → 1080×1920 / 60 fps MP4. The scene library is EP000's approved storyboard (v008) cut into scene types; the plan places them and supplies the words.

| File | What |
|---|---|
| `sgmm_scenes.js` | Scene library: studio, hands/keyboard, collage, field, build log, logo from the dark, captions, act tags, the Sufi tension sound kit + EP000 cue sheet. `SGMM.load(plan)` → `render / frame / audio` |
| `render.mjs` | Renders a plan (headless Chrome over DevTools, frames piped to ffmpeg, 4 workers) or checks it against an old storyboard (`--compare`). No npm installs. |
| `04_video_projects/EP000_matrix_online/edit/SGMM_EP000_scenes_v001.json` | EP000 as a plan, the reference example |

```
node 08_templates/engine/render.mjs <plan.json> <out.mp4> [--workers 4] [--clean] [--from s] [--to s]
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
| `field_push` | 2.8 s | full-frame NEXT flow field with 3D matte forms converging | – |
| `build_log` | 9.4 s | from behind, typing; REC · DAY chip, build-log card, three cards, Mac mini wipe | `log_rec` `log_day` `log_kicker` `log_title` `log_sub` `log_cards` (SHIFT/TOOL/BUILD have pictograms) `log_tagline` |
| `end_push_dark` | 1.45 s | screens go off, push into the dark top screen | – |
| `logo_from_dark` | 2.8 s | the mark rises behind a thin light line, small bounce, THEN · NOW · NEXT | – |
| `blackout_tease` | 2.61 s | black, typed tease, last frame black (Shorts loop) | `tease` |

`text` at plan level is shared by every scene (the screens show the collage and chat in several scenes); `scene.text` overrides it. Missing keys fall back to EP000's words.

Captions: `"is already [being written.]"` — brackets are the one green element, `\n` breaks the line. Act tags take their colour from the label (THEN amber, NOW white, NEXT green).

## Not in v001
- Score is EP000's fixed cue sheet (`"score": "sufi_tension_ep000"`); cues from the plan, voice placement, retiming to the real voice, chain and automix come with `sgmm build` (step 2).
- Scene choreography plays at EP000 speed; a `speed` field is the first thing to add when a new plan needs it.
- No `real_clip` / `mask_host` / `setup_tour` types yet (v002 analysis §3).

## Proof (2 Nov 2026)
`--compare` against `storyboard/SGMM_EP000_storyboard_v008.html`, every 0.1 s: **460/460 frames byte-identical**, score within **1 LSB** (Chrome's offline audio differs from itself by 1 LSB run to run).
