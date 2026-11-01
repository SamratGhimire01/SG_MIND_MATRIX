# SG MIND MATRIX — Master Kit & Brand Bible (v1.1, 1 Nov 2026)

**Central message:** THE WORLD IS BEING REWRITTEN BY INTELLIGENCE.
**Philosophy:** THEN → NOW → NEXT
**What we are:** a premium, faceless, cinematic AI documentary + education channel (YouTube first, X second). Not a generic AI news account.

## 1. Approved identity (do not redesign)

| Item | Master file |
|---|---|
| SG mark (vector) | `01_brand/logo/svg/SGMM_mark_green.svg` (+ white, black, on-void variants) |
| SG mark source | `01_brand/_source_originals/APPROVED_MASTER_mark_black_transparent.png` |
| Wordmark lockup | `01_brand/_source_originals/APPROVED_wordmark_lockup.png` (raster only — vector still missing) |
| Avatar | `02_channel/youtube/avatar_800x800.png` |
| SIGNAL character | `03_signal/approved_reference/` + `03_signal/model_views/` |

The SVG mark was traced from the approved master and matches it at 99.7% pixel overlap (IoU 0.9972). Use the SVG; never re-draw the logo.

**Colours:** Matrix Green `#00E676` · Void Black `#050807` · Signal White `#F2F5F3` · Deep Forest `#0B3D2E` · Archive Amber `#FFB547`
**Story colour code:** THEN = Archive Amber · NOW = Signal White · NEXT = Matrix Green
**Fonts:** Space Grotesk Bold (titles) · JetBrains Mono (labels, captions, data). The wordmark lockup uses a different geometric sans — identify it before making a vector wordmark.

**Logo rules:** clear space = 25% of mark width on all sides · minimum size 24 px · only green, white or black · never on busy footage without a void panel · no glow, gradient, outline, rotation or stretch.

## 2. SIGNAL (AI guide character)

White asymmetric swept head shell, dark-green inner surfaces, black visor with green-white digital eyes, round side modules, floating torso with SG chest emblem, pointed lower body, two mechanical arms, green hover ring. Hovers, never walks. Calm, curious, slightly playful, trustworthy.

Use SIGNAL to **enhance** a story (intro, a key explanation, a reaction, an outro) — never on screen constantly. Every video must work without SIGNAL.

## 3. Asset status (honest)

| Asset | Status |
|---|---|
| SG mark SVG + PNG variants | ✅ Production-ready |
| Avatar 800 / 400 | ✅ Production-ready |
| YouTube banner, X header (rebuilt with real mark) | ✅ Ready — review on phone + TV before publishing |
| Wordmark lockup | ⚠️ Raster only; vector needed for large/print use |
| Channel description, X bio text | ✅ Approved-quality drafts |
| v1 banner/header/avatar/thumbnails | ❌ Rejected — logo rendered as a solid green square (`02_channel/_rejected_v1`) |
| SIGNAL approved art + model views | ✅ Reference-grade (flattened, white background) |
| 12 face states + 6 visemes (SVG/PNG) | ✅ Clean vector overlays — not yet calibrated to the visor |
| Gesture library, animation states, rig hierarchy | 📄 Specifications only |
| Cutout prototype (`03_signal/prototype`) | 🧪 Prototype: whole-character hover/tilt from a 334×374 cutout |
| Separated, rigged SIGNAL | ❌ Missing — not animation-ready |
| Thumbnail system | ✅ Template built — `08_templates/thumbnail/make_thumbnail.py`, International Typographic Style |
| Intro/outro sting, lower-thirds, title cards | ❌ Missing |
| Music + SFX library | ❌ Missing |

## 4. Folder structure

```
01_brand        logo, wordmark, originals (never edit originals)
02_channel      YouTube + X graphics, text; _rejected_v1 kept for reference
03_signal       character references, faces, docs, prototype
04_video_projects  one folder per video: EP001_slug/{script,research,footage,edit,export}
05_audio        music, sfx, voice
06_research     sources per episode
07_scripts      drafts and locked scripts
08_templates    Resolve project template, thumbnail templates, title cards
09_exports      final deliverables only
```

Naming: `SGMM_EP001_{asset}_v001.ext` · SIGNAL: `SIGNAL_{CATEGORY}_{NAME}_{VIEW}_{STATE}_v001.ext`

## 5. Editorial standard

Every claim sourced; facts, forecasts and speculation labelled differently. No fabricated statistics or footage. Never present AI-generated imagery as real historical evidence. Licensed or original music and visuals only. Script and narration are human; AI assists research and polish. Disclose synthetic content in YouTube Studio when it applies.

## 6. Visual style system (from the AI Style Atlas, chosen 1 Nov 2026)

Not one style — three, mapped onto THEN → NOW → NEXT and onto the existing colour code. No other AI channel has this, because no other channel has that framework.

| Act | Atlas style | Palette | Used for |
|---|---|---|---|
| **THEN** | #11 Editorial Essay Collage | Archive Amber + cream, one green accent | History, archival evidence, how we got here |
| **NOW** | #09 Manim-Style Math | Void Black + Signal White, green on the one live element | Mechanism, data, how it actually works |
| **NEXT** | #84 Flow Field | Void Black + Matrix Green | Speculation, emergence, what is coming |

Title cards, thumbnails and lower-thirds use **#83 International Typographic Style** (strict grid, huge flush-left grotesk, red disc swapped for a Matrix Green disc) — that is typography, not a fourth look.

Occasional, inside the act that fits: #48 Transit Map (pipelines/architecture), #55 ISOTYPE Pictograms (statistics), #37 Engineering Blueprint (hardware history), #65 Vintage Newsprint (historical headlines), #13 Product Launch Reveal (AI tool reveals, NOW only).

**Banned for this channel:** #06 Tech Glow Explainer (the generic AI-YouTube look our brief already rejects), #45 Phosphor Terminal, #27 Synthwave Outrun, #53 Vaporwave (green CRT + the name "Mind Matrix" reads as a Matrix-movie fan channel), #20 Kawaii Anime, #18 Claymation, #44 Felt & Patchwork (wrong register), #85 MacPaint, #39 Win95, #75 Bitmap Paint Doodle (crude, contradicts "premium").

### Locked prompts (paste with your topic)

**THEN — SGMM Archive Collage**
> Editorial animated-essay collage in warm archive tones: aged grainy paper stock in amber #FFB547 and cream, archival halftone photographs with torn white borders and soft drop shadows, newspaper clippings in serif type with a translucent amber highlighter sweep, masking tape, flat amber and deep-forest colour blocks, big cut-out condensed headlines, and a single Matrix Green #00E676 annotation line or circle as the only saturated accent.

**NOW — SGMM Signal Diagram**
> Manim-style explainer on pure Void Black #050807: crisp anti-aliased vector lines, restrained palette of Signal White #F2F5F3 for structure and Matrix Green #00E676 for the one element under discussion, Deep Forest #0B3D2E for secondary fills, LaTeX-like serif math with italic variables, labelled axes with tick marks, curves, arrows, braces and surrounding rectangles, generous negative space, no glow and no bloom.

**NEXT — SGMM Emergence Field**
> Thousands of hairline streamlines traced through a curl-noise field on Void Black #050807, parting around an unseen core; additive Matrix Green #00E676 through Deep Forest #0B3D2E building luminous braided filaments that thicken where flows converge, one Signal White #F2F5F3 thread tracing a single path through the field, fine paper grain, no bloom and no neon.

Rule: one act, one style. Never mix two looks inside a single sequence; the cut between acts is where the style changes, and that cut is the channel's signature.

## 7. vizavi-motion (motion craft skill)

Loaded alongside the SGMM brand skill for every motion job: intros, stings, lower-thirds, title cards, kinetic type, SIGNAL animation and the Style Atlas segments.

**It governs craft and process:** one original through-line, 3–5 genuinely different options per scene before building, a full dynamic storyboard (composition, action, camera, light, entry, exit, sound, rhythm per shot), motion with real weight and inertia, music plus sound design, and the rule that the first build is a draft — watch it all, listen to the full mix, check the decoded export, fix causes, re-check.

**This bible governs look and truth:** act-to-style mapping, palette, typography, logo, SIGNAL's design, editorial rules. On appearance, the bible wins.

Resolved conflicts:

| Point | Decision |
|---|---|
| Camera movement | Yes for Collage (paper parallax) and Flow Field (push into the field). No 3D camera moves on Manim or Swiss — they are deliberately planar; move within their own vocabulary |
| Motion blur / depth of field | Collage and Flow Field only. Never on Manim or Swiss — it breaks the crisp vector medium |
| Resolution | Raise the Atlas prompts' 1280×720 to 1920×1080 and scale type minimums with it |
| Frame rate | Set the episode timeline rate first; render every segment to match. vizavi's 60 fps default applies only if the episode is 60 |
| Sound | Designed, but restrained: effects front, bed under, max ~3 at once, silence around the key hit |
| Export | H.264, yuv420p, AAC. Keep HTML/JS source beside the MP4. An HTML preview is never the deliverable |

## 8. 3D models and image sequences

3D will be in most videos from here on. It is an asset source, not a style — it obeys the style system and the palette.

**Where 3D belongs:** NOW (hardware, chips, devices, AI tool reveals — the Product Launch Reveal look) and NEXT (abstract forms in the field).
**Where it must not go:** inside Editorial Collage, Manim or International Typographic. Those are flat media; a shaded render destroys them. Cut to the 3D shot instead of compositing it into a flat frame.

Model rules: prefer **GLB/glTF** (single file); strip stock chrome, tech-blue and neon materials, re-material to the SGMM palette; light it soft key + rim + floor reflection on near-black, not like a game engine. Never substitute a downloaded robot for SIGNAL.

### Licence reality (check per model, not per site)

| Source | Reality |
|---|---|
| Poly Haven, Kenney (3D sets), ambientCG | CC0, no attribution required. **Default safe choice** |
| Quaternius | QAL v1.0 allows commercial finished projects but forbids redistributing the asset itself. Not blanket CC0 — save the licence of the exact release |
| Sketchfab | Per-model terms, account needed. Many are CC-BY — credit the author in the description |
| Poly Pizza | Terms restrict automated downloads. Browse and download by hand only; never automate it |

Everything downloaded goes in `10_assets/3d/` and gets a row in `10_assets/LICENSES.md` (source, author, release, terms). Free to download never means free to redistribute.

### Image sequences

Generate several near-identical images differing only in pose or expression, then cut on twos or threes. Identity must stay rigid between frames — same lighting, framing and proportions — or it reads as flicker. For SIGNAL, build poses from the approved model sheet and stay inside the 12 approved face states; never invent new expressions. Hand the images and models to Claude with a description of the motion wanted.

## 9. Thumbnail system

International Typographic Style (#83), consistent across every thumbnail: void black, faint Swiss grid, one bleeding accent disc (colour = the dominant act — amber THEN, white NOW, green NEXT), huge flush-left Space Grotesk headline (max 3 lines, one word highlighted in the accent colour), small mono kicker top-left, SG mark bottom-left on every one.

Generator: `08_templates/thumbnail/make_thumbnail.py` — edit the `__main__` block per episode (title_lines, kicker, accent, highlight_word) and run it. Output 1280x720, rendered at 3x and downsampled for crisp edges at YouTube's small preview size.

Rule: never use a stock/AI face, never use a downloaded celebrity or politician photo, never fabricate a screenshot. If a thumbnail needs a photo element (e.g. the three-screen desk shot), it must be real footage from `04_video_projects/EP###_slug/footage`, composited under the same type treatment — not a separate style.
