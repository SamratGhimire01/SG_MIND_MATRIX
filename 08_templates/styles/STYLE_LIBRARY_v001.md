# SGMM style library v001 (2 Nov 2026)

Samrat brought 8 "explainer look" reference styles. They become **SGMM styles**: same medium, techniques, finishing passes and timing feel as the reference, but **recoloured to the SGMM palette** and told through the THEN → NOW → NEXT code. The brand bible still wins on appearance.

**Reference sources:** save the original files Samrat pasted (`lib/harness.js`, `lib/sound.js`, `styles/papercraft.js`, `math-anim.js`, `editorial-collage.js`, `claymation.js`, `origami.js`, `voxel.js`, `constructivist.js`, `y2k-chrome.js`) unchanged into `08_templates/styles/_reference/`. They are references to study, never shipped as-is.

## Rules that apply to every style
- Palette only: Void #050807 · Signal White #F2F5F3 · Deep Forest #0B3D2E · Archive Amber #FFB547 · Fog #7C8A84 · **one** Matrix Green #00E676 element per frame (the key thing: the answer, the 97%, the right guess).
- Every reference red / yellow / blue / pink / lilac is remapped (table below). No neon, no glow, no CRT, no code rain.
- Keep each reference's **texture and finishing passes at full strength** (paper fibre, grain, halftone, ink mottle, AO, shadows) — that is what makes the medium read.
- Fonts: titles Space Grotesk Bold, labels/data JetBrains Mono. A style's own display face is allowed only where it *is* the medium (Anton cut-out headlines in collage/constructivist, STIX for math variables in Manim).
- One act, one style. Styles can be mixed across acts, never inside one.
- Wrong answer: Amber cross/ring (not red). Right answer / key number: the one green element.
- Pipeline: storyboard (key-frame grid) first → Samrat's OK → build → verify MP4. Every frame a pure function of t; seeded randomness.
- Faceless + honest: no real faces, no fake stats; assumed numbers listed under the storyboard.

## The styles and where they fit

| Style | Fits | Recolour |
|---|---|---|
| **Editorial Essay Collage** | THEN (already used in EP000) | paper stays warm; red block → Deep Forest; yellow highlighter → Amber; red marker ring → the one Green |
| **Constructivist Propaganda** | THEN (history, "the old promise") | cream paper → Signal White/warm paper; red → Archive Amber; black → Void; the shouted key word → Green |
| **Manim-Style Math** | NOW (diagrams, how it works) | black → Void; white stays; Manim blue/teal → Signal White + Fog; yellow → Amber; red → Amber; green → Matrix Green (one item) |
| **Papercraft Models** | tips / explainers (any act's segment) | cutting mat → Deep Forest; card → Signal White; orange/yellow → Amber; blue → Fog/Void ink; red flag → Amber, spins to Green |
| **Origami Studio** | tips / explainers | sweep → Void-to-Deep-Forest; paper → Signal White + Fog; accents Amber; one Green fold |
| **Claymation Set** | light explainers, X "tip" videos | wall → Deep Forest clay; table → warm Amber clay; letters White/Amber; red X → Amber; tick → Green |
| **Voxel Diorama** | build-log / "how it's made" | island grass → Deep Forest; dirt → Amber/brown; sky → Void; robot White/Fog; emissive eyes → the one Green |
| **Y2K Liquid Chrome** | NEXT alternative (highest brand risk) | env map → Void / Signal White / Deep Forest only; **no lilac/pink iridescence**, no glints that read as tech-glow; mercury blob = the model; one Green highlight |

## Status
- **Manim (NOW):** reference saved in `_reference/`; 3 recoloured options drawn in `manim/` (`sgmm_manim.js`, options page + PNG, https://claude.ai/artifact/B8X82h3p4gno2xp3mmgXAc ) — **Samrat picked option A (ten links → one answer) on 2 Nov 2026**; it is the engine scene type `manim_links_answer` (used in X001 v002). Options B and C stay in `sgmm_manim.js` for later (B: how an answer is made; C: long-form "how it learned").
- The other 7 styles: nothing built yet. First build waits for Samrat's content (topic or script) and which style to start with.
- When a style is built, put it in `08_templates/styles/<style-id>/` (renderer + `style.json` + preview still) so `scenes.json` can name it.
