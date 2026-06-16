---
name: playable-assets
description: >-
  Images and icons for playables: import PNG/SVG for base64 single-file build,
  inline Lucide SVG, no external URLs. Use when adding heroes, icons, or graphics.
---

# Playable assets (base64 in single HTML)

Production HTML must **not** reference external image URLs. Assets are inlined at build time.

## Folder layout

```
src/pages/<page>/assets/
  images/     # .png .jpg .webp .svg
  lottie/     # .json only (see playable-lottie skill)
```

## Raster images (PNG / JPG / WebP)

```js
// page.js
import hero from "./assets/images/hero.png";

const el = document.getElementById("hero");
if (el) el.src = hero; // build → data:image/png;base64,...
```

```html
<!-- Prefer JS assignment; if needed in HTML for dev only, build inlines /src/ paths -->
<img id="hero" alt="" decoding="async" />
```

**Do not** use `src="https://..."` or leave `/src/pages/...` in shipped HTML.

## SVG files

Option A — import (recommended for complex SVG):

```js
import logo from "./assets/images/logo.svg";
img.src = logo;
```

Option B — inline in `index.html` (good for icons):

```html
<span class="route-my-page__icon" aria-hidden="true">
  <!-- paste Lucide or custom SVG here -->
</span>
```

## Lucide icons

1. [lucide.dev/icons](https://lucide.dev/icons) → copy SVG.
2. Paste inline under scoped class.
3. Size with mobile scaling: `width: calc(24 / 390 * 100cqw)`.
4. Use `stroke="currentColor"` + CSS `color`.

See also **`playable-applovin-compliance`** (icons section).

## Optimization tips

- Use reasonable dimensions (e.g. hero ≤ 750px wide source).
- Build runs image optimizer (PNG/JPEG).
- Prefer SVG for flat icons; PNG for photos.

## Checklist

```
[ ] Files only under src/pages/<page>/assets/
[ ] Imported in page.js (or inline SVG in HTML)
[ ] pnpm build:single <page>
[ ] dist HTML contains data:image/...;base64,... for used images
```
