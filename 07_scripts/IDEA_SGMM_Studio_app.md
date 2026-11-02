# IDEA — "SGMM Studio" (parked 2 Nov 2026, ready to build)

Samrat's request, saved so a future session can build it without re-explaining. Status: **idea + research done, nothing built yet.**

## What Samrat wants (his words, organised)
One private app/website for the channel — runs on his **Mac**, openable from his **phone or any laptop**:

1. **Research tab** — on open, an AI (Claude via API/MCP) researches topics automatically and ranks video ideas that fit the SGMM brand (THEN → NOW → NEXT, AI shift) **and** are likely to get views/engagement. Each idea: angle, hook, why it should perform (with sources), score.
2. **Analytics tab** — YouTube + X connected: views, watch time, subscribers/followers, likes, retweets/reposts, replies, growth over time.
3. **Publish tab** — upload video, write title/description/tags/hashtags (use `.claude/skills/sgmm-publishing`), **draft, schedule, and auto-post** to YouTube and X.
4. **Comments tab** — YouTube + X comments in one place, **most engaging/important rise to the top**, reply from the app (reply goes back to YouTube or X).
5. **Video Lab** — pipeline to make videos:
   - Separate **Shorts/Reels** and **Long-form** sections.
   - A **style library**: Samrat will add 3–4 styles of his own; Claude enhances them. When making a video he **clicks which styles to combine**, and the pipeline builds it.
   - Must follow everything in `.claude/skills/sgmm-video-production` (his likes/dislikes).
6. **Low-token long-form pipeline** — make whole long-form videos using as few AI tokens as possible.
7. Also asked: **3 videos for X** (shift / tip / log format) — not made yet.

## Research findings (2 Nov 2026 — verify prices before building)
- **X API:** no free tier for new developers since Feb 2026; **pay-per-use credits**: ~$0.015 per post ($0.20 with a link), ~$0.005 per read, ~$0.001 per read of your own account's data; new accounts get up to ~$70 free credits. Rate limits in 15-min windows. → Posting + own-analytics should cost a few $/month at SGMM's scale. Replies/comment reading = reads.
  Sources: elfsight.com/blog/how-to-get-x-twitter-api-key-in-2026, wearefounders.uk (X API price changes), outstand.so/blog/x-api-pricing, climbx.so/blog/x-api-limits.
- **YouTube Data API v3:** upload with `videos.insert`, `status.privacyStatus = private` + `status.publishAt` → YouTube publishes it itself (works even if the Mac is off; can't set publishAt on a public video; mismatched status silently doesn't schedule). Upload quota became much cheaper in 2026 (~100 units or its own bucket, sources differ). Comments: `commentThreads.list/insert`, `comments.insert` for replies (free quota). Analytics: YouTube Analytics API (free). OAuth needed (Google Cloud project + OAuth client).
  Sources: posteverywhere.ai/blog/post-to-youtube-api, dev.to (publishAt scopes), bundle.social (quota), upload-post.com/youtube-api.
- **Video pipelines others use:** Claude Code + Remotion, or Claude + ffmpeg/n8n; Remotion publishes a Claude Code skill. SGMM already has its own working HTML-canvas → frames → ffmpeg pipeline (EP000), which is enough.
  Sources: github.com/collij22/yt-faceless-automation, github.com/wilwaldon/Claude-Code-Video-Toolkit, learnwithhasan.com faceless Shorts guide.
- **Key token-saving idea:** the AI should **not** write a whole animation each time. It writes a **small scene-plan JSON** (scenes, text, timings, style choice); a **reusable render engine** (built once from EP000's code: collage, studio, flow field, logo reveal, cards, captions, score kit) turns it into video. Plus prompt caching for the brand context (bible + skills) and cheap models for bulk research.

## Proposed architecture (v0.1)
- **Node.js + Express** server on the Mac (`npm start` → `http://localhost:4545`), SQLite or JSON file store, one responsive web UI in brand style. Phone access on the same Wi-Fi via the Mac's IP, or anywhere via **Tailscale** (private, free). Optional double-click launcher `SGMM Studio.command`.
- `lib/claude.js` — research with the Anthropic SDK (`@anthropic-ai/sdk`), model `claude-opus-5-5` by default (or a cheaper model if Samrat chooses), web search tool `web_search_20260209`, brand context cached, structured JSON output.
- `lib/youtube.js` — googleapis OAuth; upload + publishAt; channel/video stats; Analytics API; commentThreads + replies.
- `lib/x.js` — X API v2 OAuth 2.0 user context; media upload + post + first reply; own-post metrics; replies to own posts.
- `lib/scheduler.js` — every minute, post due X items (YouTube uses native publishAt).
- Comments ranking — likes + replies + recency + "is a question" + keyword flags; "important" pin.
- `pipeline/` — scene-plan JSON schema, render engine (from `04_video_projects/EP000_matrix_online/storyboard/SGMM_EP000_storyboard_v008.html`), `export_frames.js`, `encode.sh`, `build_vo.py`, `automix.py`; style library folder `08_templates/styles/` (Samrat's 3–4 styles + SGMM styles).
- `.env` — `ANTHROPIC_API_KEY`, Google OAuth client id/secret, X client id/secret. Never commit secrets.

## Decisions Samrat still needs to make
1. Run only on the Mac (free; scheduled X posts need the Mac awake) **or** also a small cloud server (always-on, ~$5/mo)?
2. Buy X API credits (pay-per-use) — yes/no and a monthly cap.
3. Which model for research (default Opus 5.5; cheaper if cost matters).
4. His 3–4 styles (images/links) for the style library.

## Build order when resumed
1. Studio shell + Research tab (works with just an Anthropic key).
2. YouTube connect: analytics + comments + scheduled upload.
3. X connect: post + first reply + metrics + replies.
4. Video Lab: scene-plan JSON → render engine (Shorts first, then long-form).
5. The 3 X videos (shift / tip / log) as the first test of the pipeline.
