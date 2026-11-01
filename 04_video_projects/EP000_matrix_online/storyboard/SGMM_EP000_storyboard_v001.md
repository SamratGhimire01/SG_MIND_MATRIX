# SGMM EP000 — "The Matrix Is Online" · Storyboard v001

Status: **PLAN — awaiting Samrat's approval.** Nothing is filmed or rendered yet.
Visual version: `SGMM_EP000_storyboard_v001.html` in this folder (animatic with timing).

## Spec

| | |
|---|---|
| Runtime | 46 s (1380 frames) |
| Master | **9:16, 1080×1920, 30 fps** (YouTube Short). Second cut 16:9 1920×1080 for X |
| Timeline rate | 30 fps. Every rendered segment is made at 30 fps to match |
| Export | H.264, yuv420p, AAC 48 kHz, high bitrate |
| Voice | Samrat, recorded close and quiet, cleaned in Adobe Podcast Enhance |
| Character | "The character" = Samrat, faceless: hands, back of head, silhouette. Never face, never reflection. (SIGNAL is pre-rig, so not used) |

## Through-line

**The room wakes up, and its three screens are three times.** One keystroke switches on the studio. The camera then travels *into* each screen in turn: the left screen leads into the past, the right screen is the present happening live, and the top screen opens into what comes next. At the end the three screens fold into one mark. The studio is the channel's home; the screens are its doors. The style changes only at the cuts between acts (amber paper → real studio → green field), which is the channel's signature.

Structural rhyme: we go **through** the left screen into THEN (shot 3) and **through** the top screen into NEXT (shot 5). NOW is never entered: it is real, so we film it straight.

---

## Shot 1 — Hook · 0:00–0:02 · "This is the Matrix."

**Options**
1. **ECU on ENTER, studio in background bokeh.** A finger presses; behind the key, out of focus, a green line races left to right along the LED wall and three soft rectangles (the monitors) bloom on one after another. Cause and effect in one frame. ← **chosen**
2. ECU press, then a hard cut to a locked wide plate where the LED race and screens come on.
3. Sound first: total black, only the CLACK, then the light race reveals the room in silhouette.
4. Top-down macro of the key; the light race reflects across the glossy keycaps.

**Why 1:** the hook has to work in 2 seconds with no sound on. One image that shows *press → the world turns on* reads at a glance.

| Field | Plan |
|---|---|
| Composition | Phone at key height, 8–10 cm from ENTER, lens looking across the keyboard to the wall. ENTER in the lower third, in focus; wall and screens out of focus in the upper two thirds |
| Action | 0.0 s black (LEDs off, screens asleep). 0.3 s finger enters from the bottom and presses. 0.4 s CLACK. 0.45–1.2 s green light races left → right along the wall. Screens on at 1.0 s (left), 1.2 s (right), 1.4 s (top) |
| Text | None on screen. VO "This is the Matrix." lands 0.5–1.8 s |
| Camera | Locked off |
| Light | Starts near-black; the only light is the race, then screens |
| How it's made | Locked phone. Shoot an **all-off plate**, an **all-on plate**, and a take with the press. If the LED controller has no chase mode, the race is a feathered mask wipe from the off plate to the on plate in Resolve; screens come on by masked dissolves (4 frames each) |
| Exit | Continues straight into the pull-back |
| Sound | Silence → real recorded CLACK (dry, close) → low rising hum under the race → three soft power ticks for the screens. No music yet |
| Risk | Phone exposure jumps when the room lights up. **Fix:** exposure locked for the on-state; the dark start is then truly dark |

## Shot 2 — Reveal · 0:02–0:05 · (no voice)

**Options**
1. **Speed-ramped pull-back** along the desk from the key to an over-shoulder wide: the character sits at the glowing desk. ← **chosen**
2. A crane-up: the phone lifts up and back to a high top-down view of the desk.
3. Cut to a static wide; the character sits down into frame.
4. Start on the back of the head, then rack focus to the three screens.

**Why 1:** it continues shot 1's frame. A fast reveal is the one burst of energy in a calm film, then it settles.

| Field | Plan |
|---|---|
| Composition | Ends behind the right shoulder, low: head and shoulders as a dark silhouette lower-left, the three lit screens and the LED wall filling the frame |
| Action | Character's hands rest on the keyboard; slight head turn (back of head only) |
| Camera | Physical: phone slid back slowly over ~4 s on a book or cardboard sled along the desk. In Resolve, ramp it: fast for 1.2 s (motion blur on), easing into a slow 1.8 s drift |
| Light | Screens are the key light; green LED rim on the silhouette |
| Exit | The drift carries toward the left screen, setting up the push-in |
| Sound | Air movement on the fast part (no stock swoosh). The **music bed enters** here: a low dark pad |
| Risk | Handheld jitter. **Fix:** sled on the desk surface; stabilise in Resolve |

## Shot 3 — THEN · 0:05–0:13 · "Twenty years ago… you searched. You waited."

Style: **Editorial Essay Collage (#11)** — amber + cream paper, one green accent.

**Options**
1. **Push through the left screen.** The phone pushes in on the AOC, which shows the exact first frame of the collage. The push continues digitally past the bezel and hands off to the full-frame render: a paper library in parallax, cut-out hands pull a book, pages flip, a clock waits. ← **chosen**
2. Amber light spills out of the screen and turns the studio into paper.
3. The screen image tears like paper to reveal the library.
4. A card-catalogue drawer slides out of the screen toward the camera.

**Why 1:** it's the "through" the script asks for, and it is reliable, because the screen shows the same frame the render starts on, so the join is a match, not a trick.

Collage beats (8 s):

| Time | Beat | On screen |
|---|---|---|
| 0:05–0:07 | Push in on the AOC; at 0:06.5 the bezel leaves frame → handoff to the render | Screen shows the collage's first frame: torn amber paper, mono kicker `THEN` |
| 0:07–0:09 | Paper parallax into the shelves (3–4 depth layers); cut-out hands pull a book. VO "Twenty years ago…" | Halftone shelves, masking tape, kicker `THEN` top-left |
| 0:09–0:11 | Book open, three pages flip (paper weight, shadows). VO "you searched." | Amber highlighter sweep under a cut-out word **SEARCHED** |
| 0:11–0:13 | Waiting: a cut-out clock's hand advances; the **single green annotation circle** draws around the clock. VO "You waited." | Cut-out word **WAITED** |

| Field | Plan |
|---|---|
| Hands and character | Made from **Samrat's own photos**: hands pulling a book and turning pages, shot against a plain sheet, then halftoned and cut out. No faces. Honest and on-brand |
| Library | Own photo of a real bookshelf (any shelf works), halftoned, or drawn flat shapes. **No AI photoreal library**: it would read as real history |
| Camera | Slow push with real parallax between paper layers; motion blur + shallow depth of field allowed (Collage) |
| Exit | **Hard cut** on the first keystroke into shot 4. That cut is the act change |
| Sound | Bed filtered darker and warmer; paper rustle; 3 page flips; a soft clock tick under "You waited." |
| Risk | (a) Moiré when filming an LCD close up. **Fix:** stop the physical push before moiré appears and continue digitally. (b) Landscape screen → vertical frame. **Fix:** the collage keeps its subject inside the centre 9:16 strip |

## Shot 4 — NOW · 0:13–0:22 · "Today, you just ask. And something answers."

Style: **real footage**. NOW is the real thing happening.

**Options**
1. **Hard cut to hands typing**, then over the shoulder onto the right screen: a real Claude chat, the question typed, the answer streaming in. ← **chosen**
2. Pull back out of the left screen and pan right to the NOW screen.
3. One frame for both: the library still glowing amber on the left screen, out of focus, while the right screen answers instantly. ← **folded into 1**
4. Full-frame OBS screen recording, no studio.

**Why 1 + 3:** the cut is the act change, and keeping the amber left screen soft in the over-shoulder frame puts THEN and NOW side by side in one image.

| Time | Beat |
|---|---|
| 0:13–0:15.5 | ECU of hands on the RGB keyboard; first keystroke = the cut |
| 0:15.5–0:22 | Over-shoulder onto the Philips: the question typed slowly; the answer begins streaming at ~0:19.5 on "And something answers." |

| Field | Plan |
|---|---|
| Question (proposed) | "How did people find a book in a library before computers?" — it rhymes with shot 3 |
| Rules | **Real recording, never mocked up.** Brand Chrome profile, new chat, history sidebar closed, no name visible, bookmarks bar hidden. Check the real answer for accuracy before publishing |
| Also capture | OBS screen recording of the same chat, for clean punch-ins |
| Exit | The tilt-up starts from the keyboard |
| Sound | Real typing (close mic or recorded separately); bed opens up, brighter. Silence under "you just ask" except keys |
| Risk | Screen too bright vs room. **Fix:** lower that monitor's brightness so text reads under the slightly-under exposure |

## Shot 5 — NEXT · 0:22–0:30 · "What comes next will change… everything."

Style: **Flow Field (#84)** on the top (Himstar) screen.

**Options**
1. **Slow tilt up** from the keyboard to the top screen full of green streamlines; the hands stop; the head lifts into silhouette against the green. ← **chosen**
2. Rack focus from hands to the top screen.
3. Low angle from the desk, past the shoulder, up at the screen.
4. Cut to a full-frame render of the field.
5. **Through the top screen** on "everything": a digital push into the screen hands off to a full-frame render where the filaments converge and one white thread runs through. ← **chosen as the ending of 1**

| Time | Beat |
|---|---|
| 0:22–0:25 | Tilt up from hands to the top screen; typing stops |
| 0:25–0:27.5 | Head lifts (back of head only), silhouetted against the green. VO "What comes next will change…" |
| 0:27.5–0:28 | **0.4 s of silence** |
| 0:28–0:30 | VO "everything." + one deep low hit. Push through the screen: filaments converge, the single Signal White thread runs through |

| Field | Plan |
|---|---|
| Screen content | `SGMM_EP000_screen_top_NEXT_loop` — 30 s loop of the Emergence Field at the screen's native resolution |
| Full-frame | `SGMM_EP000_seg_NEXT_converge` — 2.5 s render, starts on the same frame as the screen |
| Exit | Field dissolves to the dark desk surface (same green) for the slide |
| Risk | The screen's green clips on the phone. **Fix:** screen brightness at ~60%; expose for the screen |

## Shot 6 — The builder · 0:30–0:39 · "I'm going to document it…"

**Options**
1. **Low lateral slide** along the RGB keyboard to the Mac mini, the character back at work above. ← **chosen**
2. Overhead top-down slide along the desk.
3. The Mac mini as a foreground wipe that reveals the wide. ← **used as the exit**
4. Macro on the Mac mini's light, rack to the hands.

| Field | Plan |
|---|---|
| Composition | Phone flat on the desk at key level, 10 cm from the keys. Hands typing in soft focus above; keys slide past in the foreground |
| Camera | Slow slide right over ~9 s, ending on the Mac mini's glowing side; the Mac mini passes close to the lens as a foreground wipe |
| Note | Keep the Apple logo on top of the Mac mini out of frame or out of focus. It's fine to have it, but it shouldn't be the hero |
| Sound | Soft typing, bed continues; a single warm motif note on "document" |

## Shot 7 — The Matrix · 0:39–0:46 · "This is SG Mind Matrix. Let's build it together."

**Options**
1. **Static wide; the SG mark fades onto the top screen.** ← **chosen as the base**
2. A very slow step back.
3. The side screens drop to black and the LEDs dim to a slow breath; only the mark remains. ← **folded in**
4. The screens show THEN / NOW / NEXT, then all three fold into the one mark. ← **folded in**

| Time | Beat |
|---|---|
| 0:39–0:41 | Wide, centred, chest height, 1.5 m back. Screens read `THEN` (amber) · `NOW` (white) · `NEXT` (green), in JetBrains Mono on Void |
| 0:41–0:43 | VO "This is SG Mind Matrix." Side screens fade to void; the SG mark appears on the top screen (green on Void, which satisfies the logo's void-panel rule) |
| 0:43–0:46 | VO "Let's build it together." Hold. LEDs dim slowly; the mark stays. Final low hit and air tail |

| Field | Plan |
|---|---|
| Screen content | `SGMM_EP000_screen_{left,right,top}_finale` — synced 10 s clips: word → void / word → mark |
| Wordmark | The approved lockup is raster only and **not in the repo**. Ending on the mark alone works; add the lockup PNG if you want the full name on screen |
| Captions | The spoken "SG Mind Matrix" in the captions, in green |

---

## Sound map (30 fps)

| Time | Event | Layers (max 3) |
|---|---|---|
| 0:00.0 | Silence | — |
| 0:00.4 | CLACK (real key, recorded close) | SFX |
| 0:00.45–1.2 | LED race: low rising hum | SFX |
| 0:01.0 / 1.2 / 1.4 | Three soft screen power ticks | SFX |
| 0:02.0 | Bed enters: low dark pad | bed |
| 0:02–0:03.2 | Air movement on the fast pull-back | SFX + bed |
| 0:05–0:13 | Bed filtered warm; paper rustle, 3 page flips, clock tick | bed + 2 SFX |
| 0:13.0 | Hard cut on a keystroke; bed opens brighter | bed + keys |
| 0:19.5 | Answer starts streaming: a single soft high note | bed + keys + note |
| 0:22–0:27.5 | Bed thins as the tilt rises; typing stops | bed |
| 0:27.5–0:28.0 | **Silence** | — |
| 0:28.0 | "everything." + deep low hit | VO + hit |
| 0:30–0:39 | Bed returns; soft typing; motif note on "document" | bed + keys |
| 0:41.0 | Mark appears: second deep hit, softer | VO + hit + bed |
| 0:43–0:46 | Air tail; bed resolves | bed |

Music: an original dark ambient bed (I build it, about 46 s, no licensing question) or a YouTube Audio Library track that becomes one of the channel's five recurring tracks. Voice sits on top; the bed ducks 6 dB under VO.

## Captions

JetBrains Mono, Signal White, centred low in the 9:16 frame (inside the Shorts safe area, above the UI). Colour words: **THEN** amber, **NOW** white, **NEXT** and **SG MIND MATRIX** green.

## Grade

Lift blacks slightly (Void, never crushed to #000), push shadows toward Deep Forest, keep the screens neutral and readable, underexpose a touch. No glow or bloom added in post.
