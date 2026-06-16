---
name: playable-single-file-deliver
description: >-
  End-to-end workflow to produce one self-contained index.html for playable ads.
  Use when the user asks for single file HTML, export playable, build for AppLovin,
  or deliver dist output.
---

# Deliver one single-file HTML (playable ad)

**Output:** exactly one file — `dist/<page-name>/index.html` — no external JS/CSS/images.

## When to use this skill

User wants: *“build playable”*, *“export HTML”*, *“single file for AppLovin”*, *“ship the ad”*.

Read this skill **plus** the task-specific skills below.

## End-to-end workflow

| Step | Action | Skill / command |
|------|--------|-----------------|
| 1 | Parse prompt: page name, template, CTA, assets | `ai/INSTRUCTIONS.md` |
| 2 | Scaffold page | `pnpm new:page <name>` → `ai/skills/playable-new-route/` |
| 3 | Implement UI in `src/pages/<name>/` only | scaling + assets + lottie skills |
| 4 | Wire store CTA | `ai/skills/playable-store-cta/` |
| 5 | Dev check | `pnpm dev` → `http://localhost:5173/<name>` |
| 6 | Production build | `pnpm build:single <name>` (or `pnpm build` for every page) |
| 7 | AppLovin verify | `pnpm verify:applovin <name>` |
| 8 | Deliver file | Give user **`dist/<name>/index.html`** |

## What the built file must contain

- **One HTML** — no external files; user opens or uploads this file only.
- **UI:** mobile 390×844 only. **Viewport shell** (`playable-viewport-shell`) copied once — desktop preview is automatic, not a separate design.
- All **CSS** inlined in `<style>` (via Vite + singlefile plugin).
- All **JS** inlined in `<script>` (no separate `.js` files).
- All **images** as `data:image/...;base64,...` (import in `page.js`).
- **Lottie JSON** bundled in JS (import from `./assets/lottie/`).
- **AppsFlyer** Smart Script injected via `initStoreLink()` (in bundle).
- **No** `src="https://..."` for assets, **no** `eval(`.

## File size (typical networks)

| Network | Common HTML limit |
|---------|-------------------|
| AppLovin | ~5 MB (check current dashboard) |
| Others | 2–5 MB |

If too large: compress PNG (build optimizes), simplify Lottie, remove unused assets, avoid huge base64 SVGs.

```bash
ls -lh dist/<name>/index.html
```

## Handoff message to user

```text
Playable ready: dist/<name>/index.html
- Single self-contained HTML
- Verified: pnpm verify:applovin <name>
Upload this file to your ad network (AppLovin / etc.).
```

## Skill map (read as needed)

| Topic | Skill |
|-------|--------|
| New page folder | `playable-new-route` |
| CSS from 390×844 design | `playable-mobile-scaling` |
| PNG / SVG / Lucide | `playable-assets` |
| Lottie animations | `playable-lottie` |
| Install CTA / OneLink | `playable-store-cta` |
| MRAID / base64 / no eval | `playable-applovin-compliance` |
| Tap / steps / end screen | `playable-interactions` |

## Do not

- Hand-edit `dist/*.html` to “fix” things — change source and rebuild.
- Ship `src/pages/...` paths or dev URLs.
- Commit `node_modules/` or rely on CDN scripts in production.
