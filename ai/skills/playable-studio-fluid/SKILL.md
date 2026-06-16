---
name: playable-studio-fluid
description: >-
  Studio runtime fluid scaling, background zones, sample assets, lottie/images.
  Use with playable-studio when editing scenario/CSS for JSON playables.
---

# Studio — fluid mobile UI + zones

Read **`playable-studio/SKILL.md`** and **`playable-mobile-scaling/SKILL.md`** (Studio section).

## Fluid scaling (every device size)

Studio UI lives in **`.pb-studio__content`** with `container-type: size` (not full browser / `__app`).

| Mechanism | Purpose |
|-----------|---------|
| `--pb-design-w` / `--pb-design-h` | From `playable.json` → `viewport.width/height` (default 390×844) |
| `font-size: calc(16 / var(--pb-design-w) * 100cqw)` on **content** | **1em** = 16px at design width — scales inside playable content column |
| `calc(N / var(--pb-design-w) * 100cqw)` | Width-axis spacing (margin, padding, radius, font when not em) |
| `calc(N / var(--pb-design-h) * 100cqh)` | Height-axis spacing |
| `.pb-studio__content .pb-headline { font-size: 1.75em }` | Headline — **do not shrink** |
| `.pb-studio__content .pb-subhead { font-size: 1em }` | Subhead (16px @ design) |
| `.pb-studio__content .pb-body { font-size: 0.9375em }` | Body copy (15px @ design) |
| `--pb-text-sm` / `--pb-text-md` on content | List rows / card copy (14px / 15px @ design) |
| `--pb-cta-width: 80%` on content | CTA button = **80%** of content column, centered |

**Do not** use raw `px` or root `rem` for studio campaign UI. `100cqw` / `100cqh` resolve against **`.pb-studio__content`** (UI) or **`.pb-studio__stage`** (background / overlay). Preview device picker changes frame size — cqw/cqh + em follow automatically.

Patch viewport (rare):

```json
{ "op": "replace", "path": "/viewport", "value": { "width": 390, "height": 844 } }
```

## Content padding (prompt-editable)

`playable.json` → **`layout`** controls safe inset for all zones (not background — background bleeds edge-to-edge):

```json
{
  "layout": {
    "insetX": 20,
    "insetY": 20,
    "insetBottom": 24,
    "gap": 14
  }
}
```

Maps to CSS vars on `.pb-studio__app` (`--pb-layout-inset-*`, `--pb-layout-gap`); `100cqw`/`100cqh` conversion on **`.pb-studio__content`** (UI) and **`.pb-studio__stage`** (overlay insets). Background stays full-bleed via `.pb-studio__bg`.

**Content boundary:** All screen UI must stay inside `.pb-studio__content` (padding = safe area). Never use `width: 100%` on blocks that also have horizontal padding — use `width: auto; max-width: 100%` (see `content-boundary.css`). **CTA** (`cta-button`): wrapper `.pb-el--cta-button` = `80%` content width, centered; button inside = `100%` of wrapper. Background zones only in `.pb-studio__bg`.

**DOM layers:**
- `.pb-studio__app` — full device frame, **no padding**
- `.pb-studio__bg` — background zones, edge-to-edge
- `.pb-studio__content` — padded stack (insetX/Y/bottom + gap)
- `.pb-studio__overlay` — hand-tap Lottie, aligned to content insets

**Marketing prompt:** *"Tăng padding 2 bên lên 28px"* → patch `playable.json` → `layout.insetX` / `layout.insetY`.

Inspector shows layout row with current values + copy-friendly snippet.


Element type **`background`** — always first in `elements[]`:

```json
{
  "id": "bg",
  "type": "background",
  "textKey": "backgroundGradient"
}
```

`context.json`:

```json
{
  "backgroundGradient": "radial-gradient(ellipse 120% 80% at 50% -15%, color-mix(in srgb, #3b82f6 40%, transparent), transparent 55%), linear-gradient(180deg, #0b1220, #0f172a)"
}
```

Or inline fill:

```json
{
  "id": "bg",
  "type": "background",
  "fill": { "type": "gradient", "value": "linear-gradient(180deg, #1a0a2e, #0f172a)" }
}
```

Fill types: `mesh` (default accent glow), `gradient`, `solid`, `image` (+ `assetId`).

**Marketing prompt:** *"Đổi background zone sang gradient tím hồng"* → patch `context.backgroundGradient` or `elements[bg].fill`.

## Images & Lottie (sample assets)

Catalog: **`data/studio/assets/catalog.json`**  
Files: **`data/studio/assets/images/`**, **`data/studio/assets/lottie/`**  
Dev URL: `/studio-assets/images/...`

`assets.json` / `assets.preset.json`:

```json
{
  "assets": [
    { "id": "img-t2i-cyberpunk", "type": "image", "path": "images/t2i-cyberpunk.svg" },
    { "id": "lottie-ai-confetti", "type": "lottie", "path": "lottie/lottie-ai-confetti.json" }
  ]
}
```

Element types:

| type | fields |
|------|--------|
| `hero-image`, `image` | `assetId` |
| `image-canvas` | `assetId` or `context.imageAssetId` |
| `image-compare` | `beforeAssetId`, `afterAssetId` |
| `lottie` | `assetId`, optional `variant`: `overlay` (hand tap hint), `cta` (button pulse) |

Preset Lottie ids: `lottie-ai-confetti`, `lottie-ai-stars`, `lottie-ai-loading`, … — see `data/studio/assets/catalog.json`.

## Block types (elements)

`background`, `hero-image`, `image`, `lottie`, `app-header`, `feature-pills`, `headline-block`, `subheadline-block`, `benefit-title`, `benefit-item`, `benefit-list` (legacy — prefer split items), `problem-card`, `prompt-input`, `ai-loading-card`, `ai-result-card`, `chat-bubble-user`, `chat-bubble-ai`, `typing-indicator`, `plan-board`, `image-canvas`, `image-compare`, `audio-player`, `cta-button`, `tap-hint`

### Zone granularity

Split independent copy lines into **separate zones** (`benefit-item` per line). Do not bundle unrelated bullets in one `benefit-list` unless they always show/hide together. See **`playable-template-authoring`** § Zone granularity.
