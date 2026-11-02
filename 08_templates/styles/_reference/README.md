# Reference style sources (unchanged, as Samrat pasted them, 2 Nov 2026)

Study only — never ship these as-is. Every SGMM build recolours to the brand palette per `../STYLE_LIBRARY_v001.md`.

- `lib/harness.js` — H helper library (seeded rng, noise, grain, paper, vignette)
- `lib/sound.js` — SOUND kit (Web Audio; live + offline render)
- `styles/editorial-collage.js` · `constructivist.js` · `math-anim.js` (Manim) · `papercraft.js` · `origami.js` · `claymation.js` · `voxel.js` · `y2k-chrome.js`

Each style file calls `registerStyle({...})` with `draw` (hero still), `explainer` and `explainerSound`; load `harness.js` first, then `sound.js`, then the style.
