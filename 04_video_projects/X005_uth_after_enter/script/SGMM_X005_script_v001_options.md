# X005 · UNDER THE HOOD (afternoon) · "What happens in the 2 seconds after you press Enter" — script v001, two options (for approval)

First **Pop Explainer** (`sgmm-video-production/POP_EXPLAINER.md`): 8-beat formula, 45–60 s, caption builds word by word, a pop + sound every 0.5–1 s, Deep Forest ↔ Signal White scene flips, ends on **"Now you see the code."** Hero word per line = highlight bar; one green per frame. Sources: `../research/SGMM_X005_sources_v001.md`.

---

## Option A — "It doesn't look it up. It writes it." (twist: why it can sound sure and be wrong)

| Beat | # | Voice (= caption, **bold** = highlight bar) | Pops (each with its sound) | Bg | Src |
|---|---|---|---|---|---|
| 1 Hook | L01 | You press **Enter**… and the answer starts **typing back**. | dark desk POV (Samrat's hand from below, no face); the green ENTER key pops (click); timer pill 0.0 s → counts (ticks); answer text streams in | dark | — |
| | L02 | But here's the **interesting part?** | amber "?" bubble pops (bloop) | dark | — |
| 2 Claim | L03 | The model doesn't look up a finished answer… it **writes it**. | a "SEARCH" card gets an amber X (stamp); pen icon + blank card (pop) | light | [1] |
| | L04 | One small piece at a time! | the card fills piece by piece (tick ×5) | light | [1] |
| 3 Mechanism | L05 | Look, first your message is cut into **tokens**. | sentence card splits into 5 chips (snip ×5); TOKENS pill; "simplified" tag | light | [1][2] |
| | L06 | A token is about a word… or **part of one**. | one chip splits in two ("un" + "believable") (snip) | light | [1][2] |
| | L07 | Then each token becomes a **list of numbers**. | chips flip into number cards [0.12, −0.8, …] (flip ×5) | dark | [3] |
| | L08 | Now **attention**: every word checks which words matter to it. | dotted arrows draw between chips (whoosh ticks); ATTENTION pill | dark | [3] |
| | L09 | Then it scores every possible **next word**. | bar chart of 4 candidates pops (slide ×4); top bar green | dark | [1] |
| | L10 | It picks one… adds it… and **guesses again**. | loop arrow spins (click); chip joins the sentence (pop); counter +1 | dark | [1] |
| 4 Proof | L11 | That's why you see it **typing**… piece by piece. | stream pipe: chips fly one by one to a chat bubble (bloop ×4) | light | [4] |
| 5 Name it | L12 | This is called… **next-token prediction**. | title card types on, amber underline swipes (ding) | light | [1] |
| 6 Twist | L13 | But there's a **twist!** | TWIST! sticker + burst (riser → hit) | dark | — |
| | L14 | It picks the **likely** word… not a checked fact. | LIKELY tag vs FACT tag; FACT gets a dotted outline (pop, pop) | dark | [5] |
| | L15 | That's why AI can sound **sure**… and still be **wrong**. | SURE meter fills, a WRONG amber stamp hits (thud) | dark | [5] |
| 7 Recap | L16 | So AI doesn't **find** your answer… it **writes** it! | recap row: Enter → tokens → numbers → attention → next word (pop ×5) | light | — |
| 8 Sign-off | L17 | Now you see **the code**. | end card: "Now you see" small, **CODE** big card (burst); faint chips + Enter key drift behind | dark | — |

**Words:** 133 · **≈ 58 s** at 2.3 words/s.

---

## Option B — "Before it reads a single word…" (visual evidence first; twist: same question, different answer)

| Beat | # | Voice (= caption) | Pops | Bg | Src |
|---|---|---|---|---|---|
| 1 Hook | L01 | Type "**how are you**" and press Enter. | phone screen POV, the text types (key ticks), Enter (click) | dark | — |
| | L02 | Before AI reads a single word… it **chops it up**. | the words split into chips (snip ×3) | dark | [1] |
| 2 Claim | L03 | Because AI doesn't read words. It reads **numbers**! | chips flip into numbers (flip ×3); amber "WORDS?" X'd (stamp) | light | [3] |
| 3 Mechanism | L04 | Look, each piece is a **token**: about a word, or part of one. | TOKEN pill; one chip splits (snip) | light | [1][2] |
| | L05 | Every token turns into a **list of numbers**. | number cards (flip) | light | [3] |
| | L06 | Then **attention**: each word looks at the others to get the meaning. | dotted arrows (whoosh ticks) | dark | [3] |
| | L07 | Now it scores every possible **next word**… | 4 candidate bars (slide ×4) | dark | [1] |
| | L08 | picks one, adds it, and **does it again**. | loop arrow, chip joins (click, pop) | dark | [1] |
| 4 Proof | L09 | Think… your keyboard's **word suggestions**, on a giant scale. | phone keyboard suggestion strip pops, grows to fill the frame (zoom-through whoosh) | light | [1] |
| 5 Name it | L10 | This is called… **next-token prediction**. | title card, amber underline (ding) | light | [1] |
| 6 Twist | L11 | And the **twist?** | TWIST! sticker (riser → hit) | dark | — |
| | L12 | Ask the same question twice… you can get a **different answer**. | two chat bubbles side by side, different text (pop, pop); ≠ sign (thud) | dark | [1] |
| | L13 | There's a little **randomness** in every pick. | dice/spinner on the top bars (tick-tick) | dark | [1] |
| 7 Recap | L14 | So it isn't reading your words… it's **predicting** the next one! | recap row (pop ×5) | light | — |
| 8 Sign-off | L15 | Now you see **the code**. | end card (burst) | dark | — |

**Words:** 124 · **≈ 54 s**.

---

## Both
- "Simplified" tag on the mechanism scenes (4 steps stand for the whole transformer).
- "2 seconds" is the title's framing only; no exact time is claimed (streaming shows first words in "a second or less" [4]).
- Chip splits are illustrative; we never say how many tokens a given sentence has.
- No real product UI, logos or screenshots: the chat is our own drawn SGMM chat.
- My pick: **A** — its counter-intuitive claim ("it doesn't look it up, it writes it") is stronger, and its twist (sounds sure, can be wrong) sets up the morning SHIFT on trust.
