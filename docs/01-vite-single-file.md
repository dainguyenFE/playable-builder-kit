# Vite — single-file HTML build

## How this repo builds

Root `vite.config.js` uses:

- `vite-plugin-singlefile` — inlines JS/CSS into one HTML file
- `inlineHtmlIncludes` — `<!-- @include ./path -->` in HTML (onboard pattern)
- `optimizePlayableImages` — images → base64 data URL modules at build
- `inlineHtmlAssets` — other assets referenced from HTML
- `ensureBase64DataUris` — normalizes SVG data URIs to base64 in final HTML
- `playableAdSanitize` — post-process for ad validators

Lottie alias (smaller bundle):

```js
"lottie-web/build/player/lottie_svg": "lottie-web/build/player/lottie_light.js"
```

## Register a new playable entry

1. Add constant in `vite.config.js`:

```js
const HTML_ENTRY_MY = resolve(__dirname, "src/html/my_playable/index.html");
```

2. Extend `PLAYABLE_ENTRY` resolution (same pattern as `art1` / `p08` / `onboard`).

3. Add npm scripts in `package.json`:

```json
"dev:my": "PLAYABLE_ENTRY=my_playable vite",
"build:my": "PLAYABLE_ENTRY=my_playable vite build"
```

4. Optional: `renameHtmlOutput` plugin entry if output should be `dist/my_playable/index.html` instead of `dist/src/html/my_playable/index.html`.

## Dev server

Vite serves the entry from `build.rollupOptions.input`. Open:

`/src/html/my_playable/index.html`

`pnpm run dev:my` sets `server.open` via `entryPathForDevServer`.

## Build output

Default path:

`dist/src/html/<playable_id>/index.html`

Only **one** playable per `vite build` invocation (`PLAYABLE_ENTRY`).

## HTML entry

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>My Playable</title>
  <link rel="stylesheet" href="/src/html/my_playable/styles.css" />
</head>
<body>
  <main id="app"></main>
  <script type="module" src="/src/html/my_playable/main.js"></script>
</body>
</html>
```

Use `type="module"` — Vite bundles to a single script in production.
