# AppsFlyer (shared with main playables)

All routes use **one** Smart Script — the same file as `playable_7_art_2`, `playable_08`, `playable_09`:

| File | Role |
|------|------|
| `src/core/appfly_script.js` | AppsFlyer OneLink Smart Script (`?raw` inject) |
| `src/core/store-link.js` | `initStoreLink`, `openAppStore`, MRAID + polling |
| `src/core/mraid-open.js` | `whenMraidReady`, `openUrlWithMraid` |

Routes import only:

```js
import { bindStoreCta } from "../../skills/store-cta.js";
// or: import { initStoreLink, openAppStore } from "../../core/store-link.js";
```

Do **not** add `store-link.js` per route.

## Sync from monorepo

When `playable-builder-kit` is inside the `playable` repo, Vite uses `../src/core/` or `../src/js/` automatically.

To refresh the kit copy after updating the main script:

```bash
pnpm sync:appsflyer
```

## Standalone zip (Claude)

Include `src/core/appfly_script.js` in the zip, or run `pnpm sync:appsflyer` before zipping.

Update `FALLBACK_URL` in `src/core/store-link.js` if the campaign OneLink changes.
