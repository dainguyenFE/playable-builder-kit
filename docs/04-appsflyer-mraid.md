# AppsFlyer Smart Script + MRAID (shared)

Same setup as **`playable_7_art_2`**, **`playable_08`**, **`playable_09`** in the main repo.

## Shared files (one copy for all pages)

| File | Role |
|------|------|
| `src/core/appfly_script.js` | AppsFlyer OneLink Smart Script (`?raw` inject) |
| `src/core/store-link.js` | Inject script, poll `AF_SMART_SCRIPT_RESULT`, `openAppStore()` |
| `src/core/mraid-open.js` | `whenMraidReady`, `openUrlWithMraid` |
| `src/skills/store-cta.js` | `bindStoreCta(selector)` |

**Do not** add `store-link.js` inside `src/pages/<page>/`.

## Usage in page `page.js`

```js
import { bindStoreCta } from "../../skills/store-cta.js";

bindStoreCta("#cta");
```

## Sync script from monorepo

```bash
pnpm sync:appsflyer
```

Copies AppsFlyer script into `src/core/`. When the kit is inside the `playable` repo, Vite resolves `@playable/core` to `../src/core/` or `../src/js/` automatically.

## MRAID

- `window.mraid` comes from the ad SDK — do not bundle mraid.js.
- `openAppStore()` waits for MRAID ready before `mraid.open(url)`.

Update **`FALLBACK_URL`** in `src/core/store-link.js` when the campaign OneLink changes.
