# SGMM daily X formats v001 (pipeline step 4a, 2 Nov 2026)

Plan templates for the 3 daily videos in `07_scripts/CADENCE_SGMM_weekly_v001.md`, built from the existing scene library (`08_templates/engine/README.md`). Copy one to `04_video_projects/X###_<format>_<slug>/edit/SGMM_X###_scenes_v001.json`, replace every `‹…›`, then:

```
python3 08_templates/engine/sgmm.py preview <plan.json>     # storyboard page + PNG in ../storyboard/ — Samrat approves this
python3 08_templates/engine/sgmm.py build <plan.json> <voice take>   # only after the storyboard OK
```

| Format | Slot | Length | Scenes | Voice |
|---|---|---|---|---|
| `SGMM_format_shift_v001.json` | morning | 29.9 s | hook → studio map → push → **THEN** collage → bridge (typing) → **NOW** chat → turn right → **NEXT** field → logo → tease | yes, 9 lines |
| `SGMM_format_tip_v001.json` | afternoon | 22.8 s | hook → typing → the prompt on the NOW screen → STEP 1/2/3 cards → logo → tease | optional (captions carry it muted) |
| `SGMM_format_log_v001.json` | evening | 20.1 s | hook → studio map → build log (DAY ###, BUILT/BROKE/LEARNED cards) → screens off → logo → tease | optional |

Plan keys added for this step (the engine ignores them): `format`, `version`, `status`, `notes` (open items shown on the storyboard), `sources` (`{id: {title, url, note}}`), and per caption `kind` (`line` · `fact` · `forecast`) and `src` (a source id). Every fact line needs a `src`; a forecast is always marked.

Previews of the empty templates: `preview/`. First filled plan: `04_video_projects/X001_shift_finding_answers/` (storyboard https://claude.ai/artifact/CRpVWcRroWzYrrGRQeBHa8).

## Before the first render of these formats
- Music: done — the templates use `"score": "sufi_tension"` (fits any plan; see the engine README).
- **TIP** wants Papercraft or Claymation (cadence) — not built; uses the studio + cards meanwhile.
- **LOG** wants a real OBS clip — needs a `real_clip` scene type.
