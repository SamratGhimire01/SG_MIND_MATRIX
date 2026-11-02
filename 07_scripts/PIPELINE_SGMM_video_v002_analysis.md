# SGMM pipeline v002 — analysis, problems, fixes, setup (2 Nov 2026)

Builds on `PIPELINE_SGMM_video_v001.md`. New inputs from Samrat:
- **Shorts** may include a setup guide or **Samrat on camera wearing a mask**.
- **Long-form** mixes his real recordings (neck-down / hands, screen, full studio) with **mostly AI-generated** visuals.
- **Not fully automatic.** He approves every step; the system checks that everything is right.
- Phone for both formats: **realme 11 Pro 5G (Android)** — not an iPhone.

---

## 0. Samrat's decisions (2 Nov 2026) — these override anything below
- **Camera:** Open Camera on the realme 11 Pro 5G. Samrat records himself his own way; the pipeline adapts to his clips (no strict shot list required — it's a suggestion only).
- **Editing:** **CapCut only** (no DaVinci Resolve). Claude makes all the video; CapCut is just for joining. So the pipeline delivers **numbered, ready-to-join clips** (`01_hook.mp4`, `02_then.mp4`, …) **plus one fully assembled master** — CapCut is optional polish, never required.
- **Mic:** the **phone mic**, no purchase. The approved crisp+big voice chain stays mandatory; recording rules: 15 cm, aimed at the mouth, noise suppression OFF, quiet soft room.

## 1. The problems right now — and how we solve them

| # | Problem | Why it matters | Fix built into the pipeline |
|---|---|---|---|
| 1 | **YouTube's "inauthentic content" rule** demonetises generic, repetitive, template-based videos — faceless channels that recycle the same template with only the topic changed are the main target. Enforcement is channel-level. | Our pipeline reuses templates. Done carelessly, every video looks the same → no monetisation. | **Human-first by design:** Samrat's script, his voice, his real footage in every video, original research per episode. **Variety rules** the QC checks: no two videos in a row with the same structure/hook/opening scene; every Short has ≥1 new visual idea; every long-form has real footage. Keep the "Script and voice are human" line. |
| 2 | **Phone voice is dull** (EP000 raw: 2–8 kHz was 25–37 dB down). | Costs clarity and needs heavy EQ. | Buy a **wireless lav mic** (see §4). Until then: phone 15 cm away, noise reduction OFF, soft room. Keep the approved voice chain. |
| 3 | **Voice vs. picture timing** — planned windows never match a real voice. | EP000 needed manual re-timing. | **Voice first:** record → auto-find each line → **scenes re-time to the real voice** (rules: ≤10% speed-up, never cut words). |
| 4 | **Line detection is weak here** — the cloud session blocks Hugging Face, so I used pocketsphinx (rough). | Wrong line split = wrong sync. | On the **Mac** use **Whisper** (mlx-whisper on Apple Silicon) — accurate word timings. Always show Samrat the line split for approval. |
| 5 | **Files live in two places** — renders happen in this cloud session; footage/voice live on the iPhone/Mac; big MP4s bloat the GitHub repo (each export 40–80 MB). | Slow transfers, repo gets huge. | Run the pipeline **on the Mac** (Claude Code in the repo, or Remote Control so a session can use the folder). Raw footage + exports stay **out of git** (external SSD / iCloud); git keeps only scripts, plans, source and small files. Use **Git LFS** if exports must be in git. |
| 6 | **Connectors failing here** (Canva, Figma, marketing tools: proxy 403 in this cloud session). | Can't automate those from the cloud. | They work from the Mac / claude.ai. Not needed for the core pipeline. |
| 7 | **Real footage problems** — LCD moiré, auto-exposure flicker, white-balance shift on the green LEDs, colour mismatch with rendered scenes, phone clips in variable frame rate. | Footage looks cheap next to the rendered parts. | A manual camera app (Blackmagic Camera if it supports the realme, otherwise **Open Camera**) with locked exposure / WB / focus / shutter and a fixed frame rate. Pipeline **auto-grades** footage to the SGMM look (lift blacks, shadows to Deep Forest) and conforms frame rate. Shot list says distance/angle to avoid moiré. |
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
- Output: an **assembled master** (voice, music, segments and footage already placed) + the same as **numbered clips** for CapCut if Samrat wants to re-order or trim.
- Chapters + sources auto-written into the description.

## 4. What to get / download

### Phone: realme 11 Pro 5G (Android) — both formats
| App / item | Why | Cost |
|---|---|---|
| **Blackmagic Camera** — *check Google Play first*; realme is **not** on its published device list (Samsung, Pixel, OnePlus, Xiaomi), so it may not install | Best manual control if it works | free |
| **Open Camera** (fallback, open source) — manual ISO/shutter, **exposure lock + white-balance lock**, fixed 30 fps, 4K if the phone exposes it | Stops exposure/colour flicker on the green LEDs | free |
| Or the realme camera's **Pro/manual video mode**, if your build has one — lock ISO, shutter (1/60 at 30 fps), WB, focus | Same goal as above | free |
| **ASR Voice Recorder** (or the built-in Recorder) — record **WAV 48 kHz**, turn **noise suppression / AI enhance OFF** | Clean voice until a mic arrives | free |
| **YouTube Studio**, **X**, **Claude** app | Uploads, comments, approving gates from the phone | free |
| **LocalSend** (phone ↔ Mac over Wi-Fi, full quality) — or a **USB-C cable**; avoid WhatsApp/Telegram (they compress) | Footage + voice → Mac inbox | free |
| **Tailscale** (later, for the Studio app) | Open the Mac's Studio from anywhere | free |
| Mic app (only if you buy one: **DJI Mimo** / **RØDE Central**) | Mic settings | free |

Phone video notes: shoot **4K 30 fps** (the pipeline conforms it to the 60 fps Shorts timeline and 30 fps long-form), horizontal for long-form and vertical for Shorts; turn off beauty/AI scene/HDR auto modes; lock everything before each take. Apple Log/ProRes advice in the iPhone guides does not apply.

**Hardware (recommended order):** 1) wireless lav mic with a **USB-C receiver** (works on the realme and on the Mac) — DJI Mic Mini / DJI Mic 2 class or RØDE Wireless GO class; 2) phone tripod with a bendable arm + clamp; 3) external SSD later. (Check current prices/compatibility before buying.)

### Mac mini M4 (what the pipeline needs)
- **Homebrew**, then `brew install ffmpeg node git python` (+ `git-lfs` if exports go in git).
- **Claude Code** (desktop app or CLI) — open it **in the `SG_MIND_MATRIX` folder** so it reads CLAUDE.md and the skills.
- **Whisper for Apple Silicon** (`pip install mlx-whisper`) for accurate line timing.
- **LocalSend** for Mac (receives phone files)
- **Playwright + Chromium** (`npx playwright install chromium`) for the render engine.
- **Fonts:** Space Grotesk, JetBrains Mono, Anton, Libre Baskerville, Oswald.
- **CapCut** desktop (joining/trims only), **OBS** (screen capture). No DaVinci Resolve.

### What access to give Claude on the Mac (least needed)
- **Only the repo folder** (`SG_MIND_MATRIX`) **plus one inbox folder** for footage/voice (e.g. `~/Movies/SGMM_Inbox`) — not your whole home folder, not Full Disk Access.
- Allow it to run: `ffmpeg`, `node`, `python`, `git`, `brew install …` for pipeline tools (Claude asks before anything else).
- To let a cloud/app session work on the Mac: turn on **Remote Control** for that folder (Claude Desktop → Settings → Claude Code → Remote Control, or run `claude remote-control` in the folder).
- No Accessibility/Screen-Recording permissions unless you later want Claude to operate apps (not needed for the pipeline).
- Keys (Anthropic, Google, X) go in a local `.env`, never in git.

## 5. Open questions for Samrat
1. ~~Phone/camera?~~ → realme 11 Pro 5G with Open Camera.
2. Mask: **balaclava-style or a simple matte face mask?** Black or Deep Forest?
3. ~~Resolve or CapCut?~~ → CapCut.
4. ~~Mic?~~ → phone mic.

## Sources (2 Nov 2026)
- YouTube inauthentic-content policy: techcrunch.com/2026/07/20/youtube-clarifies-policies-around-ai-slop-and-upsetting-videos · creatorblade.com/blog/youtube-inauthentic-content-policy-2026-stay-monetized · scenema.ai/articles/monetize-your-youtube-channel-with-ai-video · vexub.com/blog/ai-generated-video-monetization-policies
- iPhone video: blackmagicdesign.com (Blackmagic Camera tech specs) · androidcentral.com / phonearena.com / gsmarena.com (Blackmagic Camera Android device support) · primalvideo.com (Blackmagic Camera app tutorial) · nofilmschool.com/blackmagic-camera-app-settings · petapixel.com (iPhone video gear, 2024)
- Claude Code on Mac: support.claude.com/en/articles/14554922 (Claude Code FAQ) · claudecodeguides.com (Mac setup 2026) · uvm.edu (permissions and sandboxing)
