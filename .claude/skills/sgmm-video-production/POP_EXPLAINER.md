# Pop Explainer style (learned 3 Nov 2026 from Samrat's 3 references)

Samrat: "The pop-ups of different components are really great — attention and retention. We will use this way of building in our coming videos." References studied frame by frame (kept out of git, in his Downloads): `ANC_Earbuds_KINA_SFX-only`, `StepCount_KINA_MusicSFX`, `UnitPricing_Shampoo_KINA_MusicSFX` (1440×1080, 30 fps, 51–66 s, −12.8 LUFS). **We take the method, never their colours, art, logo or the "KINA?" sign-off.** Everything below is already remapped to SGMM.

## What makes it work (the grammar)
1. **The sentence builds on screen word by word, synced to the voice.** Caption block at the top, max 2 lines, centred. Plain words appear with a quick de-blur; the **key word sits in a solid highlight bar**. A line never appears all at once.
2. **Every spoken noun gets a component that pops in on that word.** "microphones" → MIC tags with dotted leader lines; "bus" → a bus; "engine noise" → gear + jagged lines + ENGINE NOISE pill. Picture = what is said, at the moment it is said.
3. **A pop every 0.5–1 s; nothing on screen is ever still.** Tags, pills, cards, arrows, counters, X marks, ticks, "?" bubbles stack up in a scene, then the scene clears.
4. **One idea per scene, 3–5 s, background flips between dark and light** (their red ↔ paper). The flip itself resets attention. Almost no hard cuts (1–3 per video): scenes change with a **whip blur**, a **zoom-through** into the next object, or the background wiping over.
5. **Flow diagrams for "how it works"**: card → dotted arrow → chip → dotted arrow → card, each piece popping in order, status pill under it (ANALYZING…, REAL TIME).
6. **Number beats**: big value card (STEP COUNT 4,249 / 100% / Rs. 200) that counts up or ticks, then gets a stamp/X/strike-through on the twist.
7. **Story shape**: real-life hook shot (2–4 s, dimmed live footage with components over it) → "But how…?" question with "?" bubbles → explanation in 4–6 scenes → **TWIST!** tag (sticker with burst lines) → a contrast pair (X on the wrong idea, the right idea beside it) → named concept title card (two-line typographic title + underline + short pill) → takeaway checklist → sign-off card. Fits our but/therefore scripts.
8. **Viewer address**: "Look,", "Suppose you're…", "Think…", "Now you know," — the caption mirrors the voice exactly.

## Motion recipes (measured at 30 fps; at our 60 fps double the frame counts)
| Element | Motion |
|---|---|
| Caption word | opacity 0→1 + blur 8→0 px + x −12→0 px, **6 frames (0.2 s)**, ease-out. Next word starts as the voice says it. |
| Highlight bar | bar wipes in left→right (scaleX 0→1, origin left) **6 frames**, then the words inside de-blur one by one over ~8 frames; settle with a 2 % overshoot. Total ≈ 0.5 s. |
| Tag / pill / sticker | scale 0.4→**1.08**→1.0 with motion blur on the first 2 frames, rotation −6°→−3° (stickers stay tilted 2–4°), **≈ 10 frames**; then a slow drift (scale 1.00→0.97 and 1–2 px float) for the rest of the shot. |
| Card (white rounded, soft shadow) | rises 40 px + scale 0.9→1.03→1.0, 10–12 frames; contents pop 3–4 frames later. |
| Arrow / dotted leader | draws from source to target in 8–10 frames, arrow head pops at the end. |
| Counter | counts up on ticks; final digit lands with a 1.06 bump. |
| X / strike / stamp | X strokes draw one after the other (4 frames each); stamp hits at 1.3→1.0 with a 2-frame shake; old value gets a strike line. |
| Burst lines | 8–12 short dashes around a sticker, push out and fade over 8 frames. |
| Lightning / electric outline | jittery outline around the "contrast" card for 0.5 s (we keep it thin, no glow). |
| Scene change | whip pan: 6 frames, horizontal motion blur, next scene slides from the right; or zoom-through on the hero object; or blur-dissolve on bg flip. |
| Held object | slow push-in or float (never a freeze). |

## SGMM colour remap (their → ours)
| Reference | SGMM |
|---|---|
| Crimson background (+ faint binary digits/grid) | **Deep Forest #0B3D2E** with a Void Black vignette and faint Fog grid; or **Void Black #050807** |
| Paper/off-white background with grid | **Signal White #F2F5F3** with a faint Fog grid |
| White highlight bar + crimson text (on dark) | Signal White bar + Void Black text |
| Crimson highlight bar + white text (on light) | Void Black / Deep Forest bar + Signal White text |
| Yellow stickers, prices, "TWIST!", warnings | **Archive Amber #FFB547** + Void Black text |
| Red X, red "NOT NEEDED" stamp, red bad values | **Amber** X / stamp / value (no red in the palette) |
| Green "LESS NOISE", "ESTIMATE", good values | **Matrix Green #00E676** — the **one green element of the frame** (usually the answer / key word bar). Everything else white, amber, fog. |
| White icon cards, soft drop shadow | Signal White cards (on dark) / white cards with Fog shadow (on light); icons in Void/Deep Forest |
| Poppins ExtraBold captions | **Space Grotesk Bold** captions and title cards; **JetBrains Mono Bold caps** for tags, pills, card labels, numbers in cards |
| Their stylised 3D product renders | our own drawn-in-code objects (soft 3D-icon look like Samrat's hands reference); never real logos/brands we can't show; AI imagery never presented as real |
| "KINA?" sign-off | our loop ending / SGMM sign-off (the logo rules apply) |

Act colours still hold when a video has acts: dark (Deep Forest) scenes for the story, light (Signal White) for NOW explanations, amber for THEN facts, green only on the single answer.

## Vertical layout (our 1080×1920)
The references are 4:3. For Shorts: caption block at y ≈ 12–22 % (2 lines, ~64 px Space Grotesk, highlight bars 1.15× line height), stage centred in y 30–80 %, tags never in the bottom 15 % (Shorts UI), side margin 72 px. Long-form 16:9 uses their layout as is.

## Sound (their mix, our palette)
- Every pop has its own short sound: **pop/bloop** for tags, **soft whoosh** for whips/zooms, **tick** for counters and caption words of the highlight, **thud/stamp** for X and stamps, **zap/crackle** for the electric contrast, **ding** for the reveal title, **riser** before TWIST. One sound per pop, tight to the frame.
- Music is an upbeat bed under all of it (our `sgmm_signal` / `sgmm_snap`), never a gap. Their master is very dense (−12.8 LUFS, LRA ≈ 1.5) and peaks at 0 dBFS — **we keep our own targets** (−14 LUFS, ≤ −1.5 dBTP, voice +15 dB over the bed, effects ≥ 6 dB under the voice peak).

## Build notes
- Engine today has `arrive()` (12 fps stepped drop/slide for the collage). The Pop Explainer needs a smooth spring helper at 60 fps (`pop(t, at, {from, over, frames})`), a word-by-word caption with highlight bars driven by the voice alignment, pill/tag/card/arrow/counter/X/stamp/burst components, and the whip/zoom-through transitions — add them to `08_templates/engine/sgmm_scenes.js` the first time we build one, keep them reusable.
- `beats.py` will be easy to pass: the style lands a sound hit every 0.5–1 s.
- Storyboard first as always (3–5 options per scene), then a draft.
