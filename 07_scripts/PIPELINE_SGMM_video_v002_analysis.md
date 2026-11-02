# SGMM pipeline v002 — analysis, problems, fixes, setup (2 Nov 2026)

Builds on `PIPELINE_SGMM_video_v001.md`. New inputs from Samrat:
- **Shorts** may include a setup guide or **Samrat on camera wearing a mask**.
- **Long-form** mixes his real recordings (neck-down / hands, screen, full studio) with **mostly AI-generated** visuals.
- **Not fully automatic.** He approves every step; the system checks that everything is right.
- He'll shoot on an **iPhone** for both formats (model to confirm — affects Apple Log and frame rates).

---

## 1. The problems right now — and how we solve them

| # | Problem | Why it matters | Fix built into the pipeline |
|---|---|---|---|
| 1 | **YouTube's "inauthentic content" rule** demonetises generic, repetitive, template-based videos — faceless channels that recycle the same template with only the topic changed are the main target. Enforcement is channel-level. | Our pipeline reuses templates. Done carelessly, every video looks the same → no monetisation. | **Human-first by design:** Samrat's script, his voice, his real footage in every video, original research per episode. **Variety rules** the QC checks: no two videos in a row with the same structure/hook/opening scene; every Short has ≥1 new visual idea; every long-form has real footage. Keep the "Script and voice are human" line. |
| 2 | **Phone voice is dull** (EP000 raw: 2–8 kHz was 25–37 dB down). | Costs clarity and needs heavy EQ. | Buy a **wireless lav mic** (see §4). Until then: phone 15 cm away, noise reduction OFF, soft room. Keep the approved voice chain. |
| 3 | **Voice vs. picture timing** — planned windows never match a real voice. | EP000 needed manual re-timing. | **Voice first:** record → auto-find each line → **scenes re-time to the real voice** (rules: ≤10% speed-up, never cut words). |
| 4 | **Line detection is weak here** — the cloud session blocks Hugging Face, so I used pocketsphinx (rough). | Wrong line split = wrong sync. | On the **Mac** use **Whisper** (mlx-whisper on Apple Silicon) — accurate word timings. Always show Samrat the line split for approval. |
| 5 | **Files live in two places** — renders happen in this cloud session; footage/voice live on the iPhone/Mac; big MP4s bloat the GitHub repo (each export 40–80 MB). | Slow transfers, repo gets huge. | Run the pipeline **on the Mac** (Claude Code in the repo, or Remote Control so a session can use the folder). Raw footage + exports stay **out of git** (external SSD / iCloud); git keeps only scripts, plans, source and small files. Use **Git LFS** if exports must be in git. |
| 6 | **Connectors failing here** (Canva, Figma, marketing tools: proxy 403 in this cloud session). | Can't automate those from the cloud. | They work from the Mac / claude.ai. Not needed for the core pipeline. |
| 7 | **Real footage problems** — LCD moiré, auto-exposure flicker, white-balance shift on the green LEDs, colour mismatch with rendered scenes, iPhone clips in variable frame rate. | Footage looks cheap next to the rendered parts. | **Blackmagic Camera** with locked exposure / WB / focus / shutter, fixed frame rate; consistent profile (Rec.709, or Apple Log + LUT on Pro iPhones). Pipeline **auto-grades** footage to the SGMM look (lift blacks, shadows to Deep Forest) and conforms frame rate. Shot list says distance/angle to avoid moiré. |
| 8 | **Anonymity leaks** — reflections in screens/glass, lanyard, name on screen, mail, window views; a mask can still leak (eyes, tattoos, rings, room). | One frame unmasks a faceless channel. | **Automatic anonymity check**: Claude inspects sampled frames of every clip and flags faces, reflections, readable names, documents, identifiable windows. Samrat approves before use. |
| 9 | **Mask persona** — a cliché mask (e.g. Guy Fawkes) reads "hacker/Matrix fan", is someone else's design, and fights the premium brand. | Brand damage, possible rights issues. | A **plain, matte, consistent mask** (black or Deep Forest balaclava / simple matte face mask, no logos), back-lit silhouette from the LED wall, never shown in sharp close-up. Keep it rare: setup guides, reactions, the outro. Every video must still work without it. |
| 10 | **Render size/time** — 60 fps frames as JPEGs: ~1 GB per 46 s Short; a 12-min long-form at 60 fps would be ~45k frames. | Disk and hours. | Shorts 60 fps; **long-form 30 fps**; render frames **straight into ffmpeg** (no frame files) on the Mac; render only the AI segments, not the whole episode. |
| 11 | **Fully-auto risk** — the system could post something wrong. | Brand and policy risk. | **Approval gates** (§2). Nothing renders final, mixes, or posts without Samrat's OK. |
| 12 | **AI-visual honesty** — "mostly AI-generated" long-form must never pass AI images off as real history or real events. | Editorial rule + YouTube disclosure. | Stylised visuals only (collage, diagram, field, studio). If anything realistic is AI-made, tick **"altered or synthetic content: Yes"**. Sources listed in every description. |

## 2. Approval gates (not fully automatic)

```
IDEA ─┤G1├─ SCRIPT ─┤G2├─ SCENE PLAN + STORYBOARD ─┤G3├─ RECORD ─┤G4├─ BUILD (draft) ─┤G5├─ FINAL MIX ─┤G6├─ PACKAGE ─┤G7├─ POST
```
| Gate | Samrat approves | The system checks before asking |
|---|---|---|
| G1 | which idea | sources exist, fits THEN/NOW/NEXT, not a repeat of a recent video |
| G2 | the script | every claim sourced, fact/forecast/speculation labelled, no hype words, line timings fit |
| G3 | storyboard page (playable animatic, like EP000) | brand rules, one-act-one-style, one green element, variety vs last videos |
| G4 | recordings: the voice line split + footage clips | Whisper line match, audio levels, noise, **anonymity scan**, exposure/flicker, frame rate |
| G5 | first full render | frame count, joins, caption sync, logo rules |
| G6 | final sound | −14 LUFS, voice ≥ +12 dB over background on every line, intended silences, no clipping |
| G7 | title, description, tags, thumbnails, schedule | posting-kit rules, ≤60-char title, 3–5 hashtags, settings checklist |

## 3. What changes for each format

**Shorts (46–60 s, 1080×1920, 60 fps)** — engine-rendered scenes + optional real clips:
- New scene types: `real_clip` (phone footage, auto-graded), `mask_host` (Samrat in mask, silhouette), `setup_tour` (desk pans with labelled callouts — Mac mini M4, screens, keyboard, mic).
- Setup-guide Shorts: mostly real footage + callout cards + the score.

**Long-form (8–15 min, 1920×1080 or 4K, 30 fps)** — "mostly AI-generated" but anchored by real footage:
- Spine = Samrat's narration + his footage (hands, screen recordings, studio wides).
- AI segments per act: Collage (THEN), Diagram (NOW), Field/3D (NEXT), Swiss chapter cards, lower-thirds.
- Output: segments + a **DaVinci Resolve timeline (FCPXML)** with voice, music bed, segments and footage placed; Samrat finishes and approves in Resolve.
- Chapters + sources auto-written into the description.

## 4. What to get / download

### iPhone (both formats)
| App / item | Why | Cost |
|---|---|---|
| **Blackmagic Camera** | Locked exposure/WB/focus, fixed frame rate, pro codecs, Apple Log on Pro models | free |
| **Voice Memos** (built-in) → Settings → Voice Memos → **Audio Quality: Lossless** | Voice recording until a mic arrives | free |
| **YouTube Studio** | Upload checks, comments, analytics on the go | free |
| **X** | Posting, replies | free |
| **Claude** app | Approve gates / follow sessions from the phone | free |
| **Tailscale** (later, for the Studio app) | Open the Mac's Studio from anywhere, privately | free |
| Mic app (only if you buy a mic: **DJI Mimo** or **RØDE Central**) | Mic firmware/settings | free |
| Transfer: **AirDrop** to the Mac (best, full quality) | Footage + voice → Mac inbox folder | free |

**Hardware (recommended order):** 1) wireless lav mic that works with iPhone and Mac (DJI Mic Mini / DJI Mic 2 class, or RØDE Wireless GO class) — biggest quality jump; 2) small phone tripod with a bendable arm + a phone clamp; 3) later, an external SSD for footage/renders. (Check current prices/compatibility before buying.)

### Mac mini M4 (what the pipeline needs)
- **Homebrew**, then `brew install ffmpeg node git python` (+ `git-lfs` if exports go in git).
- **Claude Code** (desktop app or CLI) — open it **in the `SG_MIND_MATRIX` folder** so it reads CLAUDE.md and the skills.
- **Whisper for Apple Silicon** (`pip install mlx-whisper`) for accurate line timing.
- **Playwright + Chromium** (`npx playwright install chromium`) for the render engine.
- **Fonts:** Space Grotesk, JetBrains Mono, Anton, Libre Baskerville, Oswald.
- **DaVinci Resolve 21** (long-form finishing), **OBS** (screen capture), CapCut optional.

### What access to give Claude on the Mac (least needed)
- **Only the repo folder** (`SG_MIND_MATRIX`) **plus one inbox folder** for footage/voice (e.g. `~/Movies/SGMM_Inbox`) — not your whole home folder, not Full Disk Access.
- Allow it to run: `ffmpeg`, `node`, `python`, `git`, `brew install …` for pipeline tools (Claude asks before anything else).
- To let a cloud/app session work on the Mac: turn on **Remote Control** for that folder (Claude Desktop → Settings → Claude Code → Remote Control, or run `claude remote-control` in the folder).
- No Accessibility/Screen-Recording permissions unless you later want Claude to operate apps (not needed for the pipeline).
- Keys (Anthropic, Google, X) go in a local `.env`, never in git.

## 5. Open questions for Samrat
1. **Which iPhone model?** (Apple Log needs iPhone 15 Pro or newer; frame rates differ.)
2. Mask: **balaclava-style or a simple matte face mask?** Black or Deep Forest?
3. Long-form finishing in **DaVinci Resolve** (recommended) or CapCut?
4. Mic: buy one now, or keep the phone for the next few videos?

## Sources (2 Nov 2026)
- YouTube inauthentic-content policy: techcrunch.com/2026/07/20/youtube-clarifies-policies-around-ai-slop-and-upsetting-videos · creatorblade.com/blog/youtube-inauthentic-content-policy-2026-stay-monetized · scenema.ai/articles/monetize-your-youtube-channel-with-ai-video · vexub.com/blog/ai-generated-video-monetization-policies
- iPhone video: blackmagicdesign.com (Blackmagic Camera tech specs) · primalvideo.com (Blackmagic Camera app tutorial) · nofilmschool.com/blackmagic-camera-app-settings · petapixel.com (iPhone video gear, 2024)
- Claude Code on Mac: support.claude.com/en/articles/14554922 (Claude Code FAQ) · claudecodeguides.com (Mac setup 2026) · uvm.edu (permissions and sandboxing)
