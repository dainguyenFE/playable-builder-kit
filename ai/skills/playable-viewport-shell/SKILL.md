---
name: playable-viewport-shell
description: >-
  Shell CSS only: copy the __app block once per page. When implementing UI, design
  mobile-only (390×844); desktop preview is automatic. Do not add desktop layouts.
---

# Playable — viewport shell (1 HTML)

**Deliverable:** one file `dist/<page>/index.html`.

## UI implementation: mobile only

When building **layout, components, typography, spacing, interactions**:

- **Only** design for **mobile 390×844** (the real ad surface).
- **Do not** add CSS for “desktop full screen”, wide breakpoints, or side-by-side desktop layouts.
- **Do not** add extra `@media` queries for UI — the **only** allowed breakpoint is the shell block below (`max-width: 390px` on `__app`).

On a wide monitor, the same mobile UI appears inside a **390px phone column** (white bands left/right). That is **automatic** — not something you design separately.

## Preview (for humans, not for UI code)

| Viewport | What users see |
|----------|----------------|
| **Phone** | Full width + full height |
| **Desktop browser** | Same mobile UI, centered at 390px wide; sides blank |

You copy the shell CSS once; everything else follows **`playable-mobile-scaling`** on the 390×844 mockup.

## HTML (required)

```html
<body class="route-<name>">
  <main class="route-<name>__app" id="app">
    <!-- all UI -->
  </main>
</body>
```

## CSS (required on every page)

Copy into `style.css`. Set `background` on `__app` to the campaign (e.g. `#000`); keep **`body` / `.route-<name>`** light for desktop side bands.

```css
.route-example {
  box-sizing: border-box;
  margin: 0;
  min-height: 100%;
  background: #fff; /* blank sides on desktop */
}

.route-example__app {
  container-type: size;
  container-name: page;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0 auto;
  /* campaign background, color, padding — use playable-mobile-scaling for px */
}

@media (min-width: 391px) {
  .route-example__app {
    max-width: 390px;
  }
}
```

## Rules for AI

1. **Implement UI as mobile-only** — mockup 390×844; no desktop-specific components or breakpoints.
2. **Never** put campaign background on `body` only — use `__app` (side bands stay white on wide screens).
3. **Only one** `@media` in `style.css` for layout: the shell block below. No `@media (min-width: …)` for cards, grids, font sizes, etc.
4. Pair with **`playable-mobile-scaling`** — all inner `cqw`/`cqh` from the mobile artboard.

## Reference pages

- `src/pages/test-2/style.css`
- `templates/playable/style.css`

---

## Studio templates (`.pb-studio__app`)

Studio uses a **full-bleed shell** + **padded content** split:

| Layer | Padding |
|-------|---------|
| `.pb-studio__app` / `.pb-studio__bg` | None — background fills edge-to-edge |
| `.pb-studio__content` | `layout.insetX/Y/bottom` from `playable.json` |

Default inset on `.pb-studio__content` (390×844):

| Token | Value (390×844) |
|-------|-----------------|
| Horizontal inset | `calc(20 / 390 * 100cqw)` |
| Top inset | `calc(20 / 844 * 100cqh)` + safe-area |
| Bottom inset | `calc(24 / 844 * 100cqh)` + safe-area |
| Stack gap | `calc(14 / 844 * 100cqh)` |

When adding **new** studio element CSS, use `playable-mobile-scaling` for all inner spacing — never flush content to the viewport edge.
