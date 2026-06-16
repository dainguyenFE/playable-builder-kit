---
name: playable-new-route
description: >-
  Creates a new isolated playable page: scaffold folder, scoped CSS, local
  assets, shared AppsFlyer/MRAID. Use when the user says create new route, new
  page, new screen, marketing landing, or pnpm new:page.
---

# Playable — create new page

Read **`../../README.md`** and **`../../INSTRUCTIONS.md`** first.

## Workflow

1. Pick template: `playable` | `landing` | `minimal`
2. `pnpm new:page <kebab>` or `pnpm new:landing <kebab>`
3. Edit only `src/pages/<kebab>/`
4. CSS: prefix `.route-<kebab>`; viewport shell → **`../playable-viewport-shell/SKILL.md`**
5. Assets: `src/pages/<kebab>/assets/` only
6. Use `../../skills/store-cta.js` and `../../skills/lottie.js` (under `src/skills/`)
7. **Mandatory:** `playable-viewport-shell` (shell only) + **`playable-mobile-scaling`** — UI **mobile 390×844 only**, no desktop layouts
8. `pnpm build:single <kebab>` → `dist/<kebab>/index.html`

## User prompt examples

```text
Create new page hero-screen.
```

```text
New landing english-office: headline, hero, CTA Get the app. Build single HTML.
```

See **`../../PROMPTS.md`** for more examples.
