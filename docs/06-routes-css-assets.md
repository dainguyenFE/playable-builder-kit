# Pages — one folder per campaign (isolated CSS + assets)

## Convention

Each **page** is a folder:

```
src/pages/<page-name>/
  index.html       # entry (required — Vite discovers pages from this file)
  page.js
  style.css        # scoped CSS for this page only
  assets/
    images/
    lottie/
```

**No shared CSS** between pages. **No** `src/global.css`. **No** assets outside the page folder.

## CSS isolation

1. Set `<body class="route-<page-name>">` on `index.html`.
2. Prefix **every** selector in `style.css` with `.route-<page-name>`.
3. Never import CSS from another page.

## Viewport — implement UI for mobile only

Design and code UI for **390×844 mobile** only. Do not add desktop-specific layouts or extra `@media` rules.

Copy the shell once per page (`__app` inside `body.route-<name>`). Wide screens show the same mobile UI in a 390px column — see **`ai/skills/playable-viewport-shell/SKILL.md`**.

## Assets

- Files only in `src/pages/<page>/assets/images/` and `.../lottie/`.
- Import in `page.js`:

```js
import hero from "./assets/images/hero.png";
```

Build inlines them as base64 in the single HTML file.

## Vite auto-discovery

Any `src/pages/*/index.html` is a page. **No vite.config edit** when adding a folder.

```bash
PLAYABLE_ROUTE=playable pnpm dev
pnpm build:single hero-screen
```

Output: `dist/<page>/index.html`

## Create a new page

```bash
pnpm new:page hero-screen
pnpm new:landing campaign-tet
```

List pages: `pnpm pages`

## Shared code (allowed)

**`src/core/`** — AppsFlyer, store, MRAID:

```js
import { initStoreLink, openAppStore } from "../../core/store-link.js";
```

**`src/skills/`** — helpers:

```js
import { bindStoreCta } from "../../skills/store-cta.js";
import { initLottie } from "../../skills/lottie.js";
```

Do **not** add `store-link.js` per page. Do **not** share CSS or images across pages.
