# X005 · UNDER THE HOOD · "What happens in the 2 seconds after you press Enter" — sources (checked 3 Nov 2026)

Mechanism checked against primary sources. On screen: **"simplified"** tag on the pipeline scene (we compress the transformer to 4 steps).

[1] **Anthropic — Glossary** (official docs). https://platform.claude.com/docs/en/about-claude/glossary
- Tokens: "the smallest individual units of a language model, and can correspond to words, subwords, characters, or even bytes"; "text … is encoded into a series of tokens for the model to process"; a token ≈ 3.5 English characters on earlier Claude models (varies by model) → we say **"about a word, or part of one"**.
- Pretraining: "autoregressive language models … are pretrained to predict the next word, given the previous context of text" → next-token prediction.
- Temperature: "controls the randomness of a model's predictions"; "Even with temperature set to 0, the results will not be fully deterministic, and identical inputs might produce different outputs" → option B twist.
- TTFT: time to generate the first token after the prompt.

[2] **OpenAI — Tokens help article** (official; page blocks fetch, checked via search snippets): 1 token ≈ 4 characters ≈ ¾ of an English word; 100 tokens ≈ 75 words. https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them

[3] **Vaswani et al., "Attention Is All You Need", 2017** (primary paper). https://arxiv.org/abs/1706.03762 — "the Transformer, based solely on attention mechanisms"; §3.4 learned embeddings convert input tokens to vectors (lists of numbers); attention lets every position weigh every other position. → "each token becomes a list of numbers", "attention: every word checks which other words matter to it" (simplified).

[4] **OpenAI — Latency optimization guide** (official). https://developers.openai.com/api/docs/guides/latency-optimization — "Generating tokens is almost always the highest latency step"; streaming "cuts the waiting time to a second or less"; "ChatGPT would feel pretty different if you saw nothing until each response was done." → "that's why you see it typing" and the "2 seconds" framing (first words in about a second; we never claim an exact time).

[5] **Kalai, Nachum, Vempala, Zhang (OpenAI), "Why Language Models Hallucinate", 2025** (primary paper). https://arxiv.org/abs/2509.04664 — models "sometimes guess when uncertain, producing plausible yet incorrect statements"; training and evaluation "reward guessing over acknowledging uncertainty." → option A twist.

Wording rules: "AI doesn't fetch a finished answer" is true for the model itself; products can add search/tools first → line says "the model", and the tag "simplified" covers it. Never claim a token count for a specific sentence (depends on tokenizer) — chips are illustrative.
