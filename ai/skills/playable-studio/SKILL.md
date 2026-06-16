---
name: playable-studio
description: >-
  Prompt Playable Studio: generate playable.json, context.json, scenario.json only.
  Templates support multiple themes (data/studio/themes.json). Preview with ?theme=.
  Export dist/exports/<id>.html. No per-playable routes.
---

# Playable Studio (JSON-driven)

Read **docs/PROMPT_PLAYABLE_STUDIO_SINGLE_HTML_SPEC.md** and **docs/STUDIO.md**.

## Claude rules

1. **Only generate JSON** — `playable.json`, `context.json`, `scenario.json`, `assets.json`, `patch.json`.
2. **Do not** create `src/pages/<id>/` for studio playables.
3. **Do not** write arbitrary runtime JS for campaigns.
4. Use **allowed actions** only: `show`, `hide`, `typeText`, `pulse`, `trackEvent`, `navigateScreen`.
5. Mobile **390×844**, CTA within 15s, every screen has `autoNext` or `clickNext` fallback.
6. **Edits** → `patch.json` with `op: "replace"` paths, not full file overwrite.
7. **Themes** — pick from template's `themes[]` in `data/templates/<id>/template.json`; catalog in `data/studio/themes.json`.
8. **UI inset** — never remove studio padding; follow **`playable-viewport-shell`** (20px horizontal @ 390).

## Themes (Marketing chọn màu)

Each **template** = flow mẫu. Each template lists **nhiều theme** (màu brand):

```bash
pnpm playable:new --list                    # themes per template
pnpm playable:new <id> studio <template> <theme-id>
```

Preview theme: `/preview/template/<template-id>?theme=midnight-blue`

`playable.json`:

```json
{
  "themeId": "midnight-blue",
  "theme": {
    "primaryColor": "#3B82F6",
    "backgroundColor": "#0B1220",
    "textColor": "#F8FAFC",
    "mutedColor": "#94A3B8",
    "cardColor": "#1E293B"
  }
}
```

Patch theme:

```json
{ "op": "replace", "path": "/themeId", "value": "violet-pro" }
```

## Animations (scenario steps)

Use on `show` steps — runtime in `src/runtime/studio/registries.js`:

| Animation | Use for |
|-----------|---------|
| `fade-in` | Subtle appear |
| `fade-up` | Headlines, text blocks |
| `fade-down` | Top banners |
| `pop-in` | Cards, images, results |
| `slide-left` | Chat user bubble, incoming panels |
| `slide-right` | Alternate slide |
| `scale-in` | Legacy (prefer `pop-in`) |
| `pulse` | Tap hints |
| `cta-glow` | CTA emphasis (also auto on CTA screen) |

**Screen transitions** are automatic (slide on screen change). Example:

```json
{ "id": "show_card", "atMs": 1200, "action": "show", "target": "problem_card", "animation": "pop-in" }
```

## Files per playable

```
playables/<id>/manifest.json
playables/<id>/playable.json      # themeId + theme tokens
playables/<id>/context.json
playables/<id>/scenario.json
playables/<id>/assets.json
```

Template presets: `data/templates/<template-id>/*.preset.json`

## Commands

```bash
pnpm studio:validate <id>
pnpm playable:export <id>
pnpm playable export <id>
pnpm playable:new <id> studio <template-id> [theme-id]
```

## Block types (elements)

`background`, `hero-image`, `image`, `lottie`, `app-header`, `feature-pills`, `headline-block`, `subheadline-block`, `problem-card`, `prompt-input`, `ai-loading-card`, `ai-result-card`, `chat-bubble-user`, `chat-bubble-ai`, `typing-indicator`, `plan-board`, `image-canvas`, `image-compare`, `audio-player`, `cta-button`, `tap-hint`

**Background / assets / fluid scaling:** read **`playable-studio-fluid/SKILL.md`**.

Sample assets: `data/studio/assets/` · catalog `catalog.json`.

**Asset library (Studio UI):** preview layout = Notebook | **Assets** | Preview | Inspector. Save via panel drag-drop or chat:

```bash
pnpm studio:asset save <id> --image <file>
pnpm studio:asset save <id> --lottie <file>
pnpm studio:asset delete <id>
pnpm studio:asset embed <id> --playable <playable-id>   # clone inline into assets.json
```

When assigning `assetId` to a zone, **always embed** (`studio:asset embed`) so the playable keeps working if the catalog asset is deleted. Embedded entries use `dataUrl` or `lottie` (no shared `path`).

## Preview URLs

| Kind | URL |
|------|-----|
| Studio playable | `/preview/<id>?theme=<theme-id>` |
| Studio template | `/preview/template/<template-id>?theme=<theme-id>` |

## Patch example

```bash
pnpm studio:patch ai-writing-tool playables/ai-writing-tool/examples/patch-theme.json
```
