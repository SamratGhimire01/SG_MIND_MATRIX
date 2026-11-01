# SGMM EP000 — "The Matrix Is Online" · Production plan v001

46-second channel launch film. Storyboard: `storyboard/SGMM_EP000_storyboard_v001.md` (+ the `.html` animatic).

## Locked script (Samrat's voice)

| # | Time | Voice |
|---|---|---|
| 1 | 0:00–0:02 | "This is the Matrix." |
| 2 | 0:02–0:05 | — |
| 3 | 0:05–0:13 | "Twenty years ago… you searched. You waited." |
| 4 | 0:13–0:22 | "Today, you just ask. And something answers." |
| 5 | 0:22–0:30 | "What comes next will change… everything." |
| 6 | 0:30–0:39 | "I'm going to document it…" |
| 7 | 0:39–0:46 | "This is SG Mind Matrix. Let's build it together." |

Editorial notes:
- "Twenty years ago" = around 2006. The collage stays era-neutral (shelves, card catalogue, clock), with **no fake dates, headlines or documents** that would read as real records.
- The Claude chat is a real recording. Check the answer before publishing.
- The closing differs from the channel signature ("The world is being rewritten. Let's build it together."). Fine for a launch film; decide on purpose.

## Who makes what

### Claude builds (source HTML/JS + MP4 kept together in `edit/segments/`)

| ID | Asset | Spec | Notes |
|---|---|---|---|
| B1 | `screen_left_THEN_hold` | monitor-native, 30 fps, loop | First frame of the collage, gently breathing — plays on the AOC while filming |
| B2 | `screen_top_NEXT_loop` | monitor-native, 30 fps, 30 s loop | Emergence Field — plays on the Himstar while filming |
| B3 | `screen_{left,right,top}_finale` | monitor-native, 10 s each, synced | THEN/NOW/NEXT words → void / → SG mark |
| B4 | `screen_black` | monitor-native | Pure void, for the "off" look and plates |
| B5 | `seg_THEN_library` | 1080×1920 + 1920×1080, 8 s | Editorial Collage segment from Samrat's own photos |
| B6 | `seg_NEXT_converge` | 1080×1920 + 1920×1080, 2.5 s | Full-frame field convergence + white thread |
| B7 | Music bed + SFX set | 48 kHz WAV stems | Original; bed, hum, ticks, hits, paper, clock |
| B8 | Edit kit | Resolve markers CSV, SRT captions, grade notes | Timeline guide for Resolve/CapCut |
| B9 | Wallpapers | per-monitor PNG | THEN / NOW / NEXT stills (replaces the JK wallpapers) |

### Samrat films and records (phone, Blackmagic Camera: locked exposure, WB, focus, 30 fps, 4K vertical)

| Shot | What | Takes |
|---|---|---|
| P1 | **Plates**, locked wide + locked key-ECU: all off / LEDs only / all on | 1 each, 5 s |
| 1 | ECU ENTER press, wall in bokeh (LED chase if the controller has it) | ×3 |
| 2 | Slow pull-back on a sled, key → over-shoulder wide | ×3 |
| 3 | Slow push-in on the AOC showing B1 | ×3 |
| 3b | **Photos for the collage**: hands pulling a book off a shelf; hands turning pages; a bookshelf; a simple clock. Plain background, no faces | 10–15 photos |
| 4a | ECU hands typing on the RGB keyboard | ×3 |
| 4b | Over-shoulder onto the Philips: real Claude chat, question typed, answer streaming (+ OBS capture) | ×3 |
| 5 | Tilt from the keyboard to the Himstar showing B2; stop typing, look up | ×3 |
| 6 | Low slide along the keyboard to the Mac mini | ×3 |
| 7 | Wide, centred, 1.5 m back, with B3 playing on all three screens | ×3 (+1 horizontal) |
| SFX | Real ENTER clack close-up, 30 s of typing, 30 s room tone | — |
| VO | Read the script three times: slow, slower, long pauses | — |

### Before the shoot (anonymity)
Lanyard out of the room · brand Chrome profile, new chat, no sidebar, no name · bookmarks bar hidden · JK wallpapers replaced with B9 · Batman/Deadpool out of frame · no mail, certificates or window views.

## Order of work
1. **Approve the storyboard** (this plan).
2. **Risk test first:** B1 on the AOC + one push-in take → I check the handoff to B5's first frame and the moiré, before anything else is built.
3. Build B1–B4 + B9 (needed on set).
4. Shoot everything in one evening.
5. Build B5 (from the photos), B6, B7.
6. Edit kit B8 → Samrat assembles in Resolve, or I assemble a reference cut from the footage.
7. Review the decoded export: start, end, every act join, the audio mix. Fix, re-check, publish.
