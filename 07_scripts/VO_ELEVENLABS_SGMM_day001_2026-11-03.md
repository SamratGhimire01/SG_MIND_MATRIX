# Day 001 voice-over on ElevenLabs — one generation per video (3 Nov 2026)

Paste each block **whole** into ElevenLabs (Text to Speech), generate, download. 3 generations = 3 files: `X004.mp3`, `X005.mp3`, `X006.mp3`. Send them with LocalSend to `SGMM_Inbox`.

- **Voice:** one for all 3 (pick by ear in the Voice Library: Brian, George or Chris; or search "male narrator warm conversational").
- **Model:** **Eleven v3** (the `[tags]` only work on v3). Stability **0.55** for X004 and X006, **0.40** for X005 · Similarity 0.80 · Style 0 · Speed 1.0.
- **Pauses:** the blank line between lines gives a natural pause. You don't need long gaps — `sgmm build` finds each line by matching the words (it handled Samrat's straight-through X001 take).
- **If you use Multilingual v2 instead:** delete every `[tag]` and put `<break time="1.5s" />` between lines.
- **Credits:** ~1,350 characters for all 3 (free tier ≈ 10,000/month).
- **Licence:** free plan = no commercial use + ElevenLabs credit. Regenerate the finals on Starter ($6) before a monetised post. Descriptions get "Voice: AI narration (ElevenLabs)".

## X004 SHIFT "The Trust Gap" — Stability 0.55
```text
[calm] It answered in two seconds. Did you check it?

[warm] Coders used to ask strangers on forums… and wait hours for a tick.

But now, more than seven in ten use AI every day.

So they trust it? [slowly] Only sixteen percent trust it with most tasks.

Most trust it only when they can check the answer.

So the next skill may not be asking… but checking.

[quietly] Because when it answers in two seconds—
```

## X005 UNDER THE HOOD "After you press Enter" — Stability 0.40
```text
[curious] You press Enter… and the answer starts typing back.

[excited] But here's the interesting part?

The model doesn't look up a finished answer… it writes it.

[bright] One small piece at a time!

Look, first your message is cut into tokens.

A token is about a word… [playfully] or part of one.

Then each token becomes a list of numbers.

Now attention: every word checks which words matter to it.

Then it scores every possible next word.

It picks one… adds it… and guesses again.

[amazed] That's why you see it typing… piece by piece.

This is called… [proudly] next-token prediction.

[excited] But there's a twist!

[serious] It picks the likely word… not a checked fact.

That's why AI can sound sure… and still be wrong.

[warm] So AI doesn't find your answer… it writes it!

[calm] Now you see the code.
```

## X006 LOG Day 001 — Stability 0.55
```text
[casual] Today I found out why our videos sound worse.

I measured our mix against an explainer that sounds great.

Same voice level… but we had sixteen decibels more deep bass.

Theirs sits in the centre. Ours spreads wide.

So tomorrow: cut the bass, pull it to the middle, more small hits.

Day two starts… now.
```
