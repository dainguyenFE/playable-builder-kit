# Vanilla JS (no React)

## File layout

```
src/pages/my-playable/
  index.html
  page.js         # import from ../../core/ or ../../skills/
  style.css
  assets/images/
  assets/lottie/
```

Split by screen/feature (`screen2.js`, `chat.js`) when the playable grows — keep `page.js` thin.

## Boot pattern

```js
import { bindStoreCta } from "../../skills/store-cta.js";

function init() {
  bindStoreCta("#cta");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
```

## Images in markup

**Preferred for base64 build:** import in JS and assign:

```js
import hero from "./assets/images/hero.png";
document.querySelector("#hero").src = hero;
```

## Avoid

- React, Vue, Svelte, or JSX entries
- Dynamic `import()` of image URLs without Vite static analysis
- `window.open(storeUrl)` on CTA without MRAID wrapper (module 04)
