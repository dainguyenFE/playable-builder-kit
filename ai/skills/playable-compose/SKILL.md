---
name: playable-compose
description: >-
  Create playables from blocks/templates via composition.json. Use when Marketing
  prompts from template, mixes template A+B, or creates campaign in playables/.
---

# Playable compose (blocks + templates)

**Source of truth:** `playables/<campaign>/composition.json` + `copy.json`  
**Output:** `dist/<page>/index.html` via `pnpm compose:build <campaign>`

## Folders

| Path | Purpose |
|------|---------|
| `blocks/` | Behavior modules (`tap-to-start`, `chat-stream`, `store-cta`…) |
| `playable-templates/` | Default compositions (`ai-chat-simulator`, …) |
| `playables/` | Campaign contracts |
| `src/runtime/` | Scene engine + block renderers |
| `src/pages/<page>/` | **Generated** from compose scaffold |

Page scaffolds for hand-coded UI stay in `templates/playable|landing|minimal` (`pnpm new:page`).

## Commands

```bash
pnpm compose:list
pnpm compose:create my-campaign ai-chat-simulator
# edit playables/my-campaign/composition.json + copy.json
pnpm compose:validate my-campaign
pnpm compose:scaffold my-campaign
pnpm compose:build my-campaign   # validate + scaffold + build + verify
```

## Marketing prompts

**From template:**
```text
pnpm compose:create nova-launch ai-chat-simulator
Fill copy for Nova AI. pnpm compose:build nova-launch
```

**Mix templates (flow):**
```json
"flow": [
  { "id": "intro", "blockRef": "blocks/tap-to-start", "fromTemplate": "ai-chat-simulator" },
  { "id": "result", "blockRef": "blocks/result-card", "fromTemplate": "ai-writing-assistant" },
  { "id": "cta", "blockRef": "blocks/store-cta", "fromTemplate": "ai-chat-simulator" }
]
```

**Mix regions (one screen):**
```json
"mode": "regions",
"screens": [{
  "id": "main",
  "regions": {
    "header": { "blockRef": "blocks/intro-headline", "fromTemplate": "ai-chat-simulator" },
    "main": { "blockRef": "blocks/chip-picker", "fromTemplate": "ai-writing-assistant" },
    "footer": { "blockRef": "blocks/store-cta", "fromTemplate": "ai-chat-simulator" }
  }
}]
```

## Rules

- UI skin in `copy.json` (`theme`, `slots`) — blocks are behavior only.
- Still apply `playable-mobile-scaling`, `playable-viewport-shell`, `playable-applovin-compliance` on export.
- Do not edit `src/runtime/` for one campaign — extend blocks or copy overrides.
- New `behaviorType` = dev adds block under `blocks/` + `src/runtime/blocks/`.

Example: `playables/campaign-nova-mix-v1/`
