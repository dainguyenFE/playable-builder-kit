# Base64 images at build time

Production playables must embed images as **base64 data URIs** inside the single HTML file (ad network / offline requirement).

## Pipeline (automatic)

1. **`optimizePlayableImages`** (`vite-plugins/optimize-playable-images.js`)  
   On `build`, intercepts image imports matching `ASSET_RE`, resizes/optimizes with `sharp`, returns:

   ```js
   export default "data:image/png;base64,....";
   ```

2. **`ViteImageOptimizer`** — additional pass on raster assets in the bundle.

3. **`ensureBase64DataUris`** — converts any remaining `data:image/svg+xml,` (non-base64) to `;base64,` in final HTML.

4. **`vite-plugin-singlefile`** — inlines the JS module strings into HTML.

## Register your asset path

Edit `ASSET_RE` in `vite-plugins/optimize-playable-images.js`:

```js
const ASSET_RE =
  /(?:playable_7_art_[123]\/images|playable_08\/images|playable_09\/images|playable_8\/|my_playable\/).*\.(png|jpe?g|svg)$/i;
```

Without this, images may not convert and can break single-file delivery.

Tune `maxEdge()` / `jpegQualityFor()` if you add heavy folders (see existing `ls`, `result`, `portraitThumb` rules).

## How to reference images in source

| Method | Build behavior |
|--------|----------------|
| `import img from ".../hero.png"` in JS | ✅ Data URL module |
| `url(...)` in CSS imported by JS/HTML | ✅ Processed by Vite |
| `<img src="/src/assets/...">` in HTML | ✅ If path is inlined via `inlineHtmlAssets` |
| Remote `https://` image URLs | ❌ Avoid — won't be base64 |

SVG: plugin ensures `xmlns` and emits `data:image/svg+xml;base64,...`.

## Verify after build

```bash
PLAYABLE_ENTRY=my_playable pnpm run build
rg 'src="https?://' dist/src/html/my_playable/index.html   # should be empty
rg 'src="/src/' dist/src/html/my_playable/index.html        # should be empty
rg 'data:image/(png|jpeg|svg\+xml);base64,' dist/src/html/my_playable/index.html | wc -l
```

## Dev vs prod

In **dev**, imports may show as paths or data URLs depending on plugin `apply: "build"` — `optimizePlayableImages` only runs on `build`. Use production build to validate base64 inlining.
