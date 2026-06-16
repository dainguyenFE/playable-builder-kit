---
name: playable-applovin-compliance
description: >-
  AppLovin ad review rules: MRAID ready + getState, base64/base122 assets only,
  no eval. Use for every playable before delivery; icons via inline Lucide SVG.
---

# AppLovin compliance (required before upload)

AppLovin **rejects** playables that fail any of these checks. Follow on **every** page.

## 1. MRAID — ready event + `getState()`

**Reject reason:** *Neither listens for MRAID ready nor calls `mraid.getState()`, or calls MRAID APIs while state is `loading`.*

### Do

- Use **`bindStoreCta()`** / **`initStoreLink()`** from `src/skills/store-cta.js` and `src/core/store-link.js` — they call `whenMraidReady()` which:
  - calls **`mraid.getState()`**
  - registers **`mraid.addEventListener("ready", …)`**
  - only calls **`mraid.open()`** when state is **not** `"loading"`
- Call **`initStoreLink()`** (via `bindStoreCta`) on page load.

### Do not

- Call `mraid.open`, `mraid.close`, `mraid.expand`, etc. directly in `page.js`.
- Call any MRAID API before ready / while `getState() === "loading"`.
- Bundle or load `mraid.js` from a CDN (SDK injects `window.mraid`).

```js
// ✅ Correct
import { bindStoreCta } from "../../skills/store-cta.js";
bindStoreCta("#cta");

// ❌ Wrong
document.getElementById("cta").onclick = () => window.mraid.open(url);
```

---

## 2. Assets — base64 or base122 only in shipped HTML

**Reject reason:** *HTML contains assets that are not base64 or base122 encoded.*

### Do

- **PNG/JPG/WebP:** `import img from "./assets/images/hero.png"` in `page.js`, assign to `img.src` (Vite build → `data:image/...;base64,...`).
- **SVG files:** put under `assets/images/icon.svg` and import, **or** paste **inline `<svg>`** in HTML (no `src="https://..."`).
- **Lottie JSON:** only under `assets/lottie/`, imported in JS.
- Deliver **`pnpm build:single <page>`** output — never hand-edit partial HTML.
- After build, confirm **no** `src="/src/` or `https://` image URLs in `dist/<page>/index.html`.

### Do not

- `<img src="https://...">` or `/src/pages/...` paths in production HTML.
- External fonts/scripts/images (no CDN).
- Emoji as only “icon” if design requires vector assets — use Lucide inline SVG instead (below).

---

## 3. No `eval()`

**Reject reason:** *HTML uses `eval()`.*

### Do

- Use **`lottie-web/build/player/lottie_light`** only (via `src/skills/lottie.js`) — **not** full `lottie.js` / `lottie_canvas` / `lottie_html` (those bundle `eval` for expressions).
- Avoid `eval`, `new Function`, `setTimeout("...")` string code, and libraries known to ship `eval`.

### Do not

```js
// ❌ Never
eval("...");
new Function("...");
import lottie from "lottie-web/build/player/lottie"; // full player — has eval
```

---

## 4. Icons — Lucide as inline SVG

For UI icons (chevrons, hands, social, etc.):

1. Pick icon on [lucide.dev](https://lucide.dev/icons).
2. Copy **SVG** markup.
3. Paste **inline** in `index.html` with a scoped class, e.g. `.route-my-page__icon`.
4. Style with CSS (`width`/`height` via 390×844 scaling skill).
5. Optional: save `.svg` under `assets/images/` and **import** in JS so build base64-inlines it.

```html
<span class="route-my-page__icon" aria-hidden="true">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
</span>
```

Do **not** load Lucide from CDN or npm unless the SVG is bundled into the single HTML (inline/import preferred).

---

## Pre-upload checklist

```
[ ] initStoreLink / bindStoreCta on load — no direct mraid.* in page code
[ ] pnpm build:single <page> succeeded
[ ] dist/<page>/index.html — no eval( (run pnpm verify:applovin <page>)
[ ] no src="https:// or src="/src/ for images in dist HTML
[ ] Lottie only via lottie_light + imported JSON
[ ] Icons: inline SVG or imported SVG/PNG (base64 in output)
```

See **`reference.md`** for verify commands.
