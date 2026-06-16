# AppLovin — verify after build

```bash
pnpm build:single my-page
pnpm verify:applovin my-page
```

Manual checks on `dist/<page>/index.html`:

```bash
# Must be empty (no matches)
rg 'eval\s*\(' dist/my-page/index.html
rg 'src="https?://' dist/my-page/index.html
rg 'src="/src/' dist/my-page/index.html
rg 'href="https?://[^"]+\.(png|jpe?g|svg|webp)"' dist/my-page/index.html

# Should find inlined assets
rg 'data:image/(png|jpeg|svg\+xml);base64,' dist/my-page/index.html | head

# MRAID helpers should be in bundled JS (from src/core/mraid-open.js)
rg 'getState' dist/my-page/index.html
rg 'addEventListener' dist/my-page/index.html
```

## Lucide workflow (quick)

| Step | Action |
|------|--------|
| 1 | [lucide.dev/icons](https://lucide.dev/icons) → search icon |
| 2 | Copy SVG |
| 3 | Paste in page HTML under `.route-<name>__*` |
| 4 | `stroke="currentColor"` + `color` in CSS |
| 5 | Size: `width: calc(24 / 390 * 100cqw)` etc. |

Replace emoji placeholders (👆) with Lucide `hand` / `pointer` SVG when polishing for review.
