# How to make an SGMM video — word by word (v001, 2 Nov 2026)

Copy the grey boxes exactly. `[...]` = fill in your own words.

## 0. Every time: start the Mac session
On the Mac, open Terminal and paste:
```
cd ~/Document/SG_MIND_MATRIX && env -u ANTHROPIC_BASE_URL -u ANTHROPIC_MODEL ~/.local/bin/claude remote-control
```
Then on the phone: Claude app → Code → **Samrats-Mac-mini · SG_MIND_MATRIX**. First message every session:
```
git checkout claude/trusting-keller-uztrn7 && git pull, then read CLAUDE.md, the sgmm-video-production skill, 08_templates/styles/STYLE_LIBRARY_v001.md, 07_scripts/CADENCE_SGMM_weekly_v001.md and 07_scripts/HOWTO_make_a_video.md. Work and push only on claude/trusting-keller-uztrn7.
```

## 1. Until the pipeline is finished (do these once, in order)
Steps 2 and 3 are **done** (2 Nov 2026). The third box is half done: the 3 format templates + storyboard preview exist (`08_templates/formats/`); the music bed and the first new style (Manim NOW) are also done. Next: record the X001 voice and build it.
```
Build pipeline step 2 (sgmm build): voice split, re-time scenes to my real voice, score from the plan's cues, the approved voice chain, automix +15 dB, −14 LUFS master. Test it on EP000 with 05_audio/voice_final. Ask before installing anything. Commit and push.
```
```
Build pipeline step 3 (sgmm qc + sgmm package): QC report, contact sheet, captions SRT, 3 thumbnails + vertical cover, posting kit. Commit and push.
```
```
Build the 3 daily X formats as reusable templates (SHIFT, TIP, LOG) from 07_scripts/CADENCE_SGMM_weekly_v001.md, plus a browser preview page for storyboard sign-off. Then build the first new style from the style library: [Manim / Papercraft]. Commit and push.
```

## 2. Making one video (after the pipeline exists)
**a) Idea** —
```
New [SHIFT / TIP / LOG] video. Give me 5 ideas about [topic or "anything that fits this week"], ranked, with sources.
```
Reply with the number you like: `Number 2.`

**b) Script** —
```
Write the script for number [2]. Keep my voice, mark every claim with its source, time each line.
```
Read it. Change anything: `Change line 3 to: [...]`. When happy: `Script approved.`

**c) Storyboard** —
```
Make the storyboard grid in [style] — key frames, on-screen text, sounds. Send me the preview.
```
Check it on the phone. Notes like `Panel 4: make the number bigger.` When happy: `Storyboard approved.`

**d) Record** — the session gives you the line list. On the realme: Open Camera / voice recorder, phone 15 cm from your mouth, noise reduction OFF, quiet room, one file, 2 s pause between lines. Send it to the Mac `SGMM_Inbox` with LocalSend. Then:
```
Voice is in SGMM_Inbox: [file name]. Build it.
```
(Clips or screen recordings? Send them too and say `Also use [file] for scene [x].`)

**e) Review** — it sends the draft MP4 + QC report. Notes: `At 0:12 the voice is too fast.` / `Change the caption at 0:20 to [...]`. When happy: `Final approved. Package it.`

**f) Post** — open `09_exports/SGMM_[EP###]_POSTING_KIT.md`, copy title/description/tags. YouTube: 7:45 pm Nepal, not for kids, upload the SRT. X: upload the video natively, link only in the first reply. Then:
```
Posted. Log it in 06_research/analytics.md.
```
After 24 h: `24 h numbers: [views] views, [%] watched, [likes] likes, [subs] subs. What should we change?`

## 3. The weekly rhythm
- **Sunday:** `Plan next week: 21 X scripts (7 SHIFT, 7 TIP, 7 LOG) + the Saturday long-form topic.` → approve → record all voices in one sitting.
- **Daily:** `Build today's 3 videos.` → review → post morning / afternoon / evening.
- **Saturday long-form:** `Start the Saturday episode on [topic]: chapters, script, shot list.` Record per chapter, film the desk, then `Build the segments and the assembled master + numbered clips for CapCut.` Join in CapCut, then post at 7:45 pm.

## 4. Before you close
```
Commit and push everything, then stop.
```
If usage runs out mid-job, next time say: `Continue from where you stopped.`
