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

## Sound (approved: "the sound is good")
- Mood: **ominous, important, ambiguous — Sufi with horror tension.** Original synthesized score, owned, no samples, no Content ID risk.
- Palette: **ney** (breathy reed flute) in **Hijaz on D** (D Eb F# G A Bb C) · **daf** frame drum in 6/8 (`dum . tek dum tek .`, eighth = 0.2 s) that builds · tanpura-style **drone** D2/A2/D3 · breath **choir** ("ah" formants) on big moments · **D/Eb dissonance** that never resolves · **heartbeat** in the dark · **silence as the hit** (cut the music bus and its reverb tail dead).
- Sound design must match the material: **real paper sounds for page turns (never tick-tick)**, book scrape, tape tear, marker stroke, keys, a clock tick only under "waited".
- Keep effects in front, music under, max ~3 layers, silence around the key hit.

## Workflow Samrat expects
1. Storyboard first as an artifact (playable animatic + shot cards with options + timeline lanes), wait for OK.
2. Apply notes exactly and only what was asked ("only change these two things" means only those).
3. Render frames headless at 60 fps in 4 parallel processes (`edit/animatic/export_frames.js`), score via `render_score.js` (OfflineAudioContext), encode with `edit/animatic/encode.sh`.
4. Check the decoded MP4 (frame count, loudness, stills at every join, silence where intended) before sending.
5. Commit and push everything; keep `.html` source beside renders.
6. Record every new preference in this file.

## Not wanted (rejected during EP000)
Stick-like finger · hands from above · long fingers · bald/3D figure · plain rectangle monitors · keyboard sliding across the screen · tick sounds on page turns · static logo ending · generic tech-glow look.
