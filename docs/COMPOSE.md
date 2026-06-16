# Compose workflow (Phase 1)

Block-based playables: **behavior in `blocks/`**, campaigns in **`playables/`**, build to one HTML.

## Quick start

```bash
pnpm compose:list
pnpm compose:create my-campaign ai-chat-simulator
# edit playables/my-campaign/copy.json
pnpm compose:build my-campaign
# → dist/my-campaign/index.html
```

Cross-template example: `playables/campaign-nova-mix-v1/` → `pnpm compose:build campaign-nova-mix-v1`

## Structure

```
blocks/<id>/block.manifest.json
playable-templates/<id>/composition.default.json
playables/<campaign>/composition.json + copy.json
src/runtime/engine.js + blocks/*.js
src/pages/<campaign>/          # scaffolded (do not hand-edit if using compose)
```

## Hand-coded pages

`pnpm new:page <name>` still works for fully custom UI (`src/pages/` without composition).

Full spec: `docs/PLAYABLE_BUILDER_KIT_SPEC.md` §29.
