# Playable Studio (Prompt-driven)

Implements **docs/PROMPT_PLAYABLE_STUDIO_SINGLE_HTML_SPEC.md** Phase 1–3 (MVP).

## Two engines

| Engine | Source | Build |
|--------|--------|-------|
| **studio** | `playable.json` + `context.json` + `scenario.json` | `pnpm studio:export <id>` |
| **compose** | `composition.json` + `copy.json` | `pnpm compose:build <id>` |

## Studio workflow

```bash
pnpm studio:list
pnpm studio:create my-campaign ai-writing-generator
# edit playables/my-campaign/*.json (Claude generates JSON only)
pnpm studio:validate my-campaign
pnpm studio:patch my-campaign playables/ai-writing-tool/examples/patch-theme.json
pnpm studio:export my-campaign
# → dist/exports/my-campaign.html
```

## Dev preview

```bash
pnpm dev
# http://localhost:5173/
# http://localhost:5173/preview/ai-writing-tool          # playable
# http://localhost:5173/preview/template/ai-writing-generator  # template preset
# http://localhost:5173/playables/ai-writing-tool
# http://localhost:5173/pages   # hand-coded scaffold pages
```

- **Playable preview** loads JSON from `playables/<id>/` (studio or compose engine).
- **Template preview** loads presets without creating a campaign:
  - Studio templates: `data/templates/<id>/*.preset.json`
  - Compose templates: `playable-templates/<id>/composition.default.json` + `copy/en.sample.json`
- Registry `previewPath` on each template → link on `/` home.

## Artifacts (Claude may edit)

```
playables/<id>/
  manifest.json
  playable.json      # theme, viewport, cta
  context.json       # product copy slots
  scenario.json      # screens, steps, actions
  assets.json
  versions/          # (Phase 2)
  exports/           # copy of exported HTML
```

## Actions allowed in scenario

`show`, `hide`, `typeText`, `pulse`, `trackEvent`, `navigateScreen`

See `src/runtime/studio/registries.js`.

## Skill

`ai/skills/playable-studio/SKILL.md`
