---
name: playable-store-cta
description: >-
  App Store / install CTA via AppsFlyer OneLink and MRAID-safe open. Use for Get the
  app buttons, end cards, and any click that should open the store.
---

# Store CTA (AppsFlyer + MRAID)

Every playable that drives installs needs a **store CTA** wired through shared core — not custom URLs per page.

## Standard pattern (use this)

```js
import { bindStoreCta } from "../../skills/store-cta.js";

function init() {
  bindStoreCta("#cta"); // calls initStoreLink() + click → openAppStore()
}
```

```html
<button type="button" id="cta" class="route-my-page__cta">Get the app</button>
```

Multiple CTAs:

```js
bindStoreCta("#cta");
bindStoreCta("#cta-footer");
```

## What happens under the hood

1. **`initStoreLink()`** injects AppsFlyer Smart Script (`appfly_script.js`).
2. Polls **`AF_SMART_SCRIPT_RESULT.clickURL`** when ready.
3. **`openAppStore()`** opens via **`mraid.open()`** when MRAID is ready (see applovin-compliance skill).

**Do not** call `window.mraid.open` or `window.open(storeUrl)` directly in page code.

## Campaign OneLink (fallback URL)

Default fallback lives in **`src/core/store-link.js`** → `FALLBACK_URL`.

Update **only there** when the campaign OneLink changes — not per page.

## Sync AppsFlyer script from monorepo

```bash
pnpm sync:appsflyer
```

## End card pattern

After gameplay / last step:

```js
function showEndCard() {
  document.querySelector(".route-my-page__end")?.classList.add("route-my-page__end--visible");
}
// CTA on end card uses same #cta or bindStoreCta("#cta-end")
```

## Checklist

```
[ ] bindStoreCta or initStoreLink on load
[ ] CTA is <button> or element with id used in bindStoreCta
[ ] No direct mraid.* in page.js
[ ] FALLBACK_URL updated in src/core/store-link.js if needed
```
