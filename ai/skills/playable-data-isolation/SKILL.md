---
name: playable-data-isolation
description: >-
  Per-template and per-playable data/UI isolation. Preview must fail gracefully on
  bad JSON without crashing Studio or other previews. AI edits only the scoped sandbox.
---

# Template & playable isolation (mandatory)

Read this skill before **any** edit to `data/templates/**`, `playables/**`, or Studio preview/runtime work.

## Core principle

**One template = one sandbox. One playable = one sandbox.**

| Sandbox | Data root | Preview URL | AI may edit |
|---------|-----------|-------------|-------------|
| Template `<id>` | `data/templates/<id>/` | `/preview/template/<id>` | `*.preset.json`, `template.json` only |
| Playable `<id>` | `playables/<id>/` | `/preview/<id>` | `*.json` in that folder only |

`playable.template.id` on a campaign is **provenance only** (read-only). Changing a template does **not** update playables already created from it.

---

## What is isolated vs shared

| Layer | Shared (do not fork per template) | Per template / playable |
|-------|-----------------------------------|-------------------------|
| **Renderer** | `src/runtime/studio/**` — one engine for all Studio templates | — |
| **Config & copy** | — | `playable*.json`, `context*.json`, `scenario*.json`, `assets*.json` |
| **Theme look** | Token catalog `data/studio/themes.json` | `themeId` + overrides in that sandbox's playable JSON |
| **Export HTML** | — | `data/templates/<id>/exports/<id>.html` or `playables/<id>/exports/<id>.html` |
| **Hand-coded page** | `src/core/`, `src/skills/` | `src/pages/<page-name>/` only |

**AI rule:** Express UI differences through **JSON in the scoped folder** (zones, context keys, theme, assets). Do **not** edit `src/runtime/**` to customize one template unless fixing a **shared engine bug** that affects all templates equally.

Do **not** patch files belonging to another template or playable. Do **not** import or reference another sandbox's JSON paths.

---

## Preview = HTML + config only

Studio preview renders **only** the current URL's config into `#playable-root`.

- Template preview loads from `/template-data/studio/<id>/…`
- Playable preview loads from `/playables-data/<id>/…`
- Each preview is a **separate browser tab/route** — no shared in-memory state between templates/playables.

### Fail gracefully (never crash Studio)

When JSON is missing, invalid, or half-edited:

| Must | Must not |
|------|----------|
| Show an error **inside `#playable-root`** for that preview only | Replace `document.body` or break the preview chrome (header, inspector, notebook) |
| Keep Studio home and other preview tabs working | Throw uncaught errors that blank the whole page |
| Log which file failed (`context.json`, `scenario.preset.json`, …) | Corrupt or overwrite another sandbox's files |
| Let the user fix JSON and refresh / change theme | Assume partial JSON is valid |

Runtime mount errors (bad `entryScreen`, missing screen) should degrade to empty or error state in the playable frame — **not** a global crash.

### After fixing data

- Template → `pnpm template:export <id>`
- Playable → `pnpm playable:export <id>`

---

## AI edit scope checklist

Before saving any change, confirm:

1. **Preview URL** matches the folder you edit (template vs playable).
2. **Only** files under that sandbox's root are modified.
3. **No** cross-references to `data/templates/<other>/` or `playables/<other>/` in JSON paths.
4. **No** shared global state files unless intentionally updating the asset catalog (`data/studio/assets/`) — assets are a library; each sandbox still lists its own `assets*.json` entries.
5. **UI changes** = context/scenario/playable JSON + theme — not runtime CSS forks per template.

Inspector / Add to chat scope follows `resolveEditScope()` in `src/runtime/studio/zone-index.js`.

---

## Shared asset catalog

`data/studio/assets/` is a **read-only library** for dev preview. Templates and playables reference assets by id/path in their own `assets*.json`. Export inlines assets into that sandbox's single HTML — exports do not depend on other sandboxes.

---

## Related skills

| Topic | Skill |
|-------|--------|
| Template CRUD, zone granularity | `playable-template-authoring` |
| Studio JSON fields | `playable-studio` |
| Create playable snapshot | `playable-create-workflow` |
| Mobile shell (preview chrome) | `playable-viewport-shell` |
