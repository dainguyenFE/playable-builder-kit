# Studio AI templates (V3 — 14 scenarios)

Source of truth: [`docs/AI_PLAYABLE_USER_CASE_SCENARIOS_V3_SCREEN_DETAIL.md`](../docs/AI_PLAYABLE_USER_CASE_SCENARIOS_V3_SCREEN_DETAIL.md)

Each template follows **V3 screen contract**: per-screen purpose/layout/content/visual/animation, **autoNext (3–4s) + clickNext** on non-final screens, and **final CTA with hero AI result**.

| UC | User case | Template | Scenario | Screens |
|----|-----------|----------|----------|---------|
| 01 | Chat | `ai-chat-ask-solve` | 1A | 4 |
| 01 | Chat | `ai-chat-qa-cards` | 1B | 4 |
| 02 | Writing | `ai-writing-captions` | 2A | 4 |
| 02 | Writing | `ai-writing-rewrite` | 2B | 4 |
| 03 | Image | `ai-image-t2i` | 3A | 4 |
| 03 | Image | `ai-image-before-after` | 3B | 4 |
| — | Video | `ai-video-product-ad` | 4A* | 3 |
| 04 | Resume | `ai-resume-review` | 4B | 4 |
| 05 | Tutor | `ai-tutor-quiz` | 5A | 4 |
| 06 | Fitness | `ai-fitness-meal` | 6A | 4 |
| 07 | Travel | `ai-travel-itinerary` | 7A | 4 |
| 08 | Finance | `ai-finance-budget` | 8A | 4 |
| 09 | Agent | `ai-agent-delegate` | 9A | 4 |
| 10 | Reco | `ai-reco-questions` | 10A | 4 |

\*Video uses V3 CTA §3.3 (Video Preview).

## Regenerate

```bash
pnpm template:catalog:generate
pnpm template:export <template-id>
```

Preview: `/preview/template/<id>`

Each `template.json` includes `userCase`, `scenario`, `flow`, `screenCount`, `scenarioGuide`, `scenarioDoc`.

## Isolation from playables

Templates are **scaffolds only**. `pnpm playable:new` copies presets into `playables/<campaign-id>/` as a **snapshot**.

- Editing a template does **not** update existing playables created from it.
- Editing one template does **not** affect other templates.
- Regenerating the catalog (`pnpm template:catalog:generate`) only rewrites `data/templates/**`, never `playables/`.
- Bad JSON in one sandbox shows a preview error in that frame only — other templates/playables are unaffected.

AI rules: **`ai/skills/playable-data-isolation/SKILL.md`**.

Shared asset paths (`data/studio/assets/`) are a global catalog — both template and playable previews resolve the same files until export embeds them inline.
