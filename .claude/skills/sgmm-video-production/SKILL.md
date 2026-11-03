---
name: sgmm-video-production
description: SG Mind Matrix video production — Samrat's approved look, motion, sound and workflow for Shorts and episodes (the EP000 "The Matrix Is Online" pipeline). Use for any SGMM video, animatic, storyboard, render, score or sound design, together with the sg-mind-matrix-brand and vizavi-motion skills.
---

# SGMM video production (learned from EP000, approved by Samrat 1 Nov 2026)

Brand rules live in `01_brand/SGMM_Brand_Bible.md` and the `sg-mind-matrix-brand` skill; this skill records **what Samrat asked for, liked and rejected** while making EP000, plus the working pipeline. When a rule here and the bible differ on appearance, ask; when it is about Samrat's taste, this file wins.

## Approved reference build
- Animatic / storyboard source: `04_video_projects/EP000_matrix_online/storyboard/SGMM_EP000_storyboard_v007.html` (everything is drawn in code; `render(ctx,W,H,t)` is a pure function of t).
- Approved video: `09_exports/SGMM_EP000_animatic_v003_1080x1920_60fps.mp4` (with captions) and `..._clean_...mp4` (no captions, for voice-over).
- Approved score: `05_audio/music/SGMM_EP000_score_v001_{mix,music,sfx}.wav` + recipe `05_audio/music/SGMM_THEME_sufi_tension_v001.md`.
- Live storyboard page: https://claude.ai/artifact/TuRFUJFkJqR5CBARUChe4P

## Format
- Shorts master **1080×1920, 60 fps** (Samrat asked for 60), H.264 yuv420p, AAC 48 kHz, ~-15 LUFS, peaks ≤ -1 dBTP.
- Always also deliver a **clean version without burned-in captions** and **music / sfx stems** so voice can be added later.

## Story and screens
- Philosophy THEN → NOW → NEXT. The studio has three screens: **left = THEN (amber), top = NOW (white), right = NEXT (green)**. Never swap them.
- Open in **pitch black** with the line spoken in the dark; one keystroke floods the room green. Frame 1 must already read (caption + faint Enter + hand).
- Every beat needs something happening; never a long shot of just a keyboard. Use components (build-log card, SHIFT/TOOL/BUILD cards with pictograms, REC · DAY counter, act tags `01 THEN / 02 NOW / 03 NEXT`).
- Ending: the logo **rises from the dark** (thin light line opens a mask, the mark settles with a small uniform bounce), then a second keystroke cuts everything to black and the screen types **NEW EPISODE · EVERY SATURDAY**. Music must **stop dead on the full stop** of "rewritten". Last black frame = first black frame (seamless Shorts loop).
- Script line choices Samrat accepted: "A generation ago… you searched. And you waited." · "What comes next… is already being written." · "I'm going to document all of it. Every shift. Every tool. Everything I build, in public." · "This is SG Mind Matrix. The world is being rewritten." · whispered "Let's build it together."

## The person, hands and keyboard (Samrat was specific — follow exactly)
- The character is **2D, seen from behind, sitting in a chair** (hair, ears, hoodie, headphones round the neck, mesh office chair). **No 3D person, no bald silhouette, never a face.**
- When the person types in a wide/medium shot, show them **from behind at a little distance; the keyboard is hidden by the body**. Do not show a keyboard sliding across the frame.
- Hands follow Samrat's reference (stylised soft 3D-icon look): **short, chunky, rounded fingers held together**, rounded palm, **white (Signal White) cuff, thick Deep Forest sleeve**, soft contact shadow. **Never long or stick-like fingers.**
- Hands always **come from below** (the typist's side), never from the top of frame.
- Enter is pressed with the **index finger**, other fingers curled.
- Keyboard: compact 60% layout like the reference, **every key labelled** (Esc, numbers, Back, Tab, Caps, Enter, Shift, Ctrl, Win, Alt, Fn…), soft rounded caps. Colours: dark caps, **Deep Forest modifiers, amber Esc, Matrix Green Enter** (the one focal key). Real proportions: 1u keys, Enter 2.25u, Backspace 2u, Shift 2.25u / 2.75u, Space 6.25u.
- Studio must look designed: thin-bezel monitors on stands, top screen on a monitor arm, desk with depth, desk mat, mouse, Mac mini with its light, cables, a plant, green LED wall. No plain rectangles.

## THEN act (Editorial Collage, SGMM palette)
- Paper collage: torn-edge halftone prints, fibre texture, masking tape, cut-out condensed headlines (Anton), an index card in Libre Baskerville, **amber highlighter**, **one Matrix Green marker ring**, 12 fps stepped cut-outs, grain + warm vignette every frame.
- The book beat: a **hand reaches down over the shelf**, pulls a book out, the **cover turns to camera**, it lands on a **2D reader's table** and **opens**; pages flip; the reader then waits (pose swap).
- Use the reference's ideas, never copy-paste another style wholesale; always recolour to SGMM (no red, no yellow).

## Extra styles (added 2 Nov 2026)
Samrat added 8 explainer looks (Editorial Collage, Constructivist, Manim, Papercraft, Origami, Claymation, Voxel, Y2K Chrome). Always recolour to SGMM and follow `08_templates/styles/STYLE_LIBRARY_v001.md` (palette remap, where each style fits, rules). Storyboard grid first, wait for his OK, then build.
- **Manim NOW (picked 2 Nov 2026): option A "ten links → one answer"** — engine scene `manim_links_answer`. Recolour: Manim blue → Signal White, teal → Fog, yellow/gold/red → Amber (Indicate, flash, old-effort box, wrong), green only on the answer. Math in STIX. He saw options as a 3-option grid page with players; keep doing that for each new style.

## Pop Explainer — default build method (Samrat, 3 Nov 2026)
"The pop-ups of different components are really great… we will use this way of building the video in our coming videos." Full playbook in `POP_EXPLAINER.md` (this folder) — Samrat asked to learn **everything** about these videos, so it covers the 8-beat script formula, the voice delivery, the measured audio mix (mono, almost no sub, warm voice, bed ~17 dB under, ~2 SFX hits/s) and the picture, not only pops. Caption builds word by word with highlight bars, every spoken noun pops in as a component on that word, a pop + its own sound every 0.5–1 s, one idea per 3–5 s scene, dark ↔ light background flips, whip/zoom-through transitions, TWIST sticker, contrast pair, concept title card. **Their method, our colours** (Deep Forest / Signal White backgrounds, amber stickers and X marks, one green answer per frame, Space Grotesk + JetBrains Mono).

## Samrat's notes on the Day 001 drafts (3 Nov 2026)
- **Every format uses the Pop style now** — SHIFT too ("follow the same pop design as the second video"). Build scenes as Pop timelines written on the real voice (`SGMM_POP.timelineScene`, scene `text.L` = its lines): each spoken thing pops in on its word with its own sound.
- **No generic "heartbeat" filler** (a repeating pop + punch-in every 1–2 s looked and sounded wrong). Fill every hold with a real component (tag, card, counter, ≠, ✓, "?") with a varied sound — never a pulse.
- **Real-world references, so people recognise "this is that":** name the real products as SGMM tags (ChatGPT, Claude, Gemini, Stack Overflow). **No logo graphics and no look-alike logos** without written permission — Anthropic's trademark guidelines need prior approval and OpenAI's brand rules forbid similar logos; product names in text are fine. If permission ever comes, logos drop into the same tag spots.

## Cadence (decided 2 Nov 2026)
3 X videos a day (SHIFT morning, TIP afternoon, LOG evening) + Saturday long-form. Formats, styles and weekly batching: `07_scripts/CADENCE_SGMM_weekly_v001.md`.

## Sound (approved: "the sound is good")
- Mood: **ominous, important, ambiguous — Sufi with horror tension.** Original synthesized score, owned, no samples, no Content ID risk.
- Palette: **ney** (breathy reed flute) in **Hijaz on D** (D Eb F# G A Bb C) · **daf** frame drum in 6/8 (`dum . tek dum tek .`, eighth = 0.2 s) that builds · tanpura-style **drone** D2/A2/D3 · breath **choir** ("ah" formants) on big moments · **D/Eb dissonance** that never resolves · **heartbeat** in the dark · **silence as the hit** (cut the music bus and its reverb tail dead).
- Sound design must match the material: **real paper sounds for page turns (never tick-tick)**, book scrape, tape tear, marker stroke, keys, a clock tick only under "waited".
- Keep effects in front, music under, max ~3 layers, silence around the key hit.
- New formats (2 Nov 2026): `"score": "sufi_tension"` builds the same score for any plan from its scenes (scene sounds + beds). Manim moves map onto the palette: Write = pen ticks, Amber box = marker + daf tek, collapse = breath whoosh, green answer = one ney note. A voice line should land on the NEXT hit, not run through the dead stop.

## Samrat's kit (decided 2 Nov 2026)
- Phone: **realme 11 Pro 5G** (Android), camera app **Open Camera** (lock exposure + WB, 4K 30 fps, beauty/AI/HDR off). He records himself his own way — adapt to his clips; shot lists are suggestions only.
- Mic: **phone mic only** (no purchase). Always run the approved voice chain + automix.
- Editing: **CapCut only** (no DaVinci Resolve). Deliver an assembled master **and** numbered clips ready to join.
- Transfer: LocalSend or USB-C (never WhatsApp/Telegram).
- On camera: possibly Samrat in a plain matte mask (no cliché masks), silhouette, rare.

## Workflow Samrat expects
1. Storyboard first as an artifact (playable animatic + shot cards with options + timeline lanes), wait for OK. For plans: `python3 08_templates/engine/sgmm.py preview <plan.json>` → publish the HTML as an Artifact; **no MP4 until Samrat approves the storyboard**. Daily X formats: copy a template from `08_templates/formats/`.
2. Apply notes exactly and only what was asked ("only change these two things" means only those).
3. Write a `scenes.json` plan from the scene library. With Samrat's voice take: `python3 08_templates/engine/sgmm.py build <plan> <voice>` (split → re-time → score → chain → automix +15 dB → −14 LUFS → final + clean MP4, stems, report). Picture only: `node 08_templates/engine/render.mjs <plan> <out.mp4>`. See `08_templates/engine/README.md`. (EP000's old `edit/animatic/*` scripts are history.)
4. `python3 08_templates/engine/sgmm.py qc <build prefix>` (frame count, loudness, voice +15 dB per line, caption sync, intended silences, contact sheet) — look at the contact sheet and any ⚠️ before sending. After Samrat's final OK: `sgmm.py package <build prefix>` (SRT, thumbnails, cover, posting kit into `09_exports/`).
5. Commit and push everything; keep `.html` source beside renders.
6. Record every new preference in this file.

## Topics (2 Nov 2026)
- **Scripts:** write them with the `sgmm-scriptwriting` skill (Samrat found v001 of X001 not engaging; always send 2 options).
- **Never reuse EP000's topic** (library → search → ask). Every SHIFT needs a new topic. X001 = "The End of the Click".
- Verify every number at its original source before scripting; list sources in the video's `research/` folder; flag mis-attributions to Samrat (the 65% → high 20s figure is People Inc., not Condé Nast).

## Music direction (Samrat, 3 Nov 2026)
"Not the spooky one — interesting, energetic, motivating music people engage with." The Sufi tension bed is retired for SHIFT/TIP/LOG. He gave three references (freetouse.com: Aetheric "Snap Crackle" ~112 BPM B♭m 808/snaps; Damtaro "Start" ~141 BPM F♯ major bright/building; Pufino "Stadium Rock" ~85 BPM C♯m big drums/power chords). We **write original tracks in those styles** (tempo, key, groove, sound) — never copy, sample or lightly alter the reference audio (Content ID / copyright). Scores: `08_templates/styles/music/sgmm_music.js` — `sgmm_snap`, `sgmm_startline`, `sgmm_arena`, `sgmm_signal` (+ earlier `pulse_drive`, `pulse_lofi`, `pulse_rise`). Keep them bright (air band near the references) with the low end under control; the build keeps the voice ≥ +13 dB over music + effects. Reference audio stays out of git.

## Beats (Samrat, 2 Nov 2026, X001)
Retention dies when nothing moves or clicks. Every 1.5–2 s a component must move with its own sound (scan + ticks, count-up + ticks, bars + slides, stamp + thud, blocks + key clicks, blink + click). Held frames get a slow push-in, never a freeze. Run `python3 08_templates/engine/beats.py <build prefix>` and fix every dead stretch before sending; QC checks it.

## Effects level (Samrat, 2 Nov 2026, X001)
"The clicks and the coin are too quiet — raise them, but never over the voice." `sgmm build` mixes music and effects separately: the **music** ducks for the voice (+15 dB); the **effects** are raised +6 dB and only turned down inside a line as far as needed so that (1) every effect peak stays ≥ 6 dB under the voice's peak and (2) the voice stays ≥ +13 dB over music + effects together. The boost stops at the blackout (the approved ending keeps its balance). The limiter aims 0.6 dB under the true-peak ceiling (sharp clicks overshoot after AAC).

## Not wanted (rejected during EP000)
Stick-like finger · hands from above · long fingers · bald/3D figure · plain rectangle monitors · keyboard sliding across the screen · tick sounds on page turns · static logo ending · generic tech-glow look.

## Voice (added after EP000 voice pass)
- Samrat records all lines in one take with pauses; `sgmm build` (was `edit/animatic/build_vo.py`) cuts each line out and places it at its exact start (frame-accurate), with 80 ms pre-roll and short fades.
- **Voice must be crisp and in front.** Samrat's phone recordings come in dull (2–8 kHz 25–37 dB down). Measure the band balance first (`spec.py` idea) and EQ toward a clear narration curve: 0.8–2 kHz ≈ -13 dB, 2–4 kHz ≈ -14 dB, 4–8 kHz ≈ -22 dB relative to total. Samrat then asked for **"more crisp and bigger"**: approved chain is in `08_templates/engine/voice_chain.txt` (was `edit/animatic/voice_chain.txt`) — high-pass 80 Hz, +1.5 dB body at 130 Hz, -4.5 dB mud at 380 Hz, +5 dB at 1.3 kHz, +13 dB presence at 3 kHz, +7 dB treble shelf 6.5 kHz, exciter, de-esser, 3:1 compression, **parallel compression** (10:1 copy at 45%) for size, and a very short subtle room (early reflections 19/31/47 ms at 22%). Target band balance: lows ≈ -1.6, 2–4 kHz ≈ -13, 4–8 kHz ≈ -18.5 dB. Voice sits **+15 dB** over the background on every line. **No denoiser on clean recordings** (it smeared the voice). The opening line "This is the Matrix." sits ~2 dB more forward.
- **Samrat's voice must sit clearly on top: +15 dB above music + SFX on every line (approved v004 automix; Samrat corrected this on 2 Nov 2026 — not +12, not +13).** A 6 dB side-chain duck was too little (he said the voice felt pressed down). `sgmm build` does it (port of `edit/animatic/automix.py`): per-line background dips sized to reach +15 dB (dip 4–18 dB, ramps 80 ms, 120 ms pre-roll), a voice-pocket EQ on the background while he speaks (-7 dB at 2.6 kHz, -4 dB at 1.2 kHz), Background returns to full between lines. Final mix -14 LUFS, -1.5 dBTP. Always measure the voice-over-background ratio per line before delivering.
- Samrat reads straight through (X001 take: no 2 s pauses, slower than the script's targets). `sgmm build` copes: line boundaries go in `footage/voice/*_voice_lines.json` (found by gaps + syllable peaks), long lines hold the picture instead of letting it run on. Ask for 2 s pauses anyway; it makes the split certain.
- **"Dwar" fix (2 Nov 2026, X001):** Samrat heard a low "dwar". Cause: his hot phone take (−10 LUFS) drove the de-esser past full scale after the +13 dB presence boost, adding ~20 dB of sub-80 Hz rumble. `sgmm build` now (1) sets the take to −26 dBFS speech before the chain, (2) fits presence / treble / exciter to the take so the voice lands on the approved curve (2–4 kHz ≈ −13, 4–8 kHz ≈ −18.5) instead of reusing EP000's fixed boosts, (3) talking formats use `"bed": "light"` (steady pure drone, no detuned saws, no deep daf under the voice), (4) the music's low end is cut under the voice and the ducking holds through gaps < 1 s. Always measure the band balance of the processed voice (sub-80 Hz must stay near −40 dB).
- If a line is longer than its slot: move it earlier or speed it up at most ~10% (pitch kept); never cut words. Captions are re-timed to the real voice.
- Line identification: `sgmm build` finds the pauses and matches them to the plan's lines by text length; it writes `<name>_voice_lines.json` — check it, fix a wrong boundary there and re-run with `--lines`. A **2 s pause between lines** keeps this reliable. (No speech recognition on the Mac: pocketsphinx is not installed; ask before installing.)
