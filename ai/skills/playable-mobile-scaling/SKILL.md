---
name: playable-mobile-scaling
description: >-
  MANDATORY for all page CSS. Convert every Figma px (font-size, margin, padding,
  gap, border, radius, size, shadow offset) from design canvas 390×844 to
  calc(N/390*100cqw) or calc(N/844*100cqh). Use before writing or editing style.css.
---

# Playable — mobile scaling (390 × 844)

**Read this skill before writing any `style.css`.** All UI is **mobile-only**: work from the **390 × 844** mockup as if the ad always runs on a phone. Do not tune layout for desktop full screen — wide screens only show the same mobile UI in a centered 390px column (handled by **`playable-viewport-shell`**, copy once, do not redesign).

Every spacing and typography value from the design must scale **proportionally** with `__app` — not fixed `px`, `rem`, or `vw`/`vh`.

Read **`../../INSTRUCTIONS.md`** for project rules.

## Design canvas (standard)

| Axis | Design size | Container unit |
|------|-------------|----------------|
| Width | **390px** | `cqw` (container query width) |
| Height | **844px** | `cqh` (container query height) |

At container width 390px, `calc(16 / 390 * 100cqw)` equals **16px** on screen.

## Setup (required once per page)

On **`.route-<name>__app`** in `src/pages/<name>/style.css`:

```css
.route-example__app {
  container-type: size;
  container-name: page;
  /* …layout… */
}
```

All scaled rules must live **inside** descendants of `__app` (or on `__app` itself) so `cqw` / `cqh` resolve against the phone frame.

## Conversion formulas

Let **N** = number from the design spec (px on the 390×844 artboard).

| Design value applies to… | CSS |
|--------------------------|-----|
| **Width axis:** font-size, letter-spacing, horizontal margin/padding, left/right, width, min/max-width, column-gap, border-width, border-radius, outline-width, horizontal shadow offset/blur/spread | `calc(N / 390 * 100cqw)` |
| **Height axis:** vertical margin/padding, top/bottom, height, min/max-height, row-gap, vertical shadow offset, translateY | `calc(N / 844 * 100cqh)` |
| **Shorthand padding / margin** `vertical horizontal` | `calc(Y / 844 * 100cqh) calc(X / 390 * 100cqw)` |
| **Four sides** | top/bottom → `cqh`; left/right → `cqw` |

### Mental model

```
scaleW(N) → calc(N / 390 * 100cqw)
scaleH(N) → calc(N / 844 * 100cqh)
```

Copy px from Figma → pick axis → paste into `calc`.

### Examples

```css
.route-example__headline {
  font-size: calc(28 / 390 * 100cqw);
  margin-bottom: calc(24 / 844 * 100cqh);
  letter-spacing: calc(-0.5 / 390 * 100cqw);
}

.route-example__cta {
  padding: calc(14 / 844 * 100cqh) calc(28 / 390 * 100cqw);
  border-radius: calc(999 / 390 * 100cqw);
  border: calc(2 / 390 * 100cqw) solid #fff;
  font-size: calc(16 / 390 * 100cqw);
  gap: calc(8 / 390 * 100cqw);
  box-shadow: 0 calc(4 / 844 * 100cqh) calc(12 / 844 * 100cqh) rgba(0, 0, 0, 0.25);
}

.route-example__icon {
  width: calc(72 / 390 * 100cqw);
  height: calc(72 / 390 * 100cqw);
}
```

## Properties that MUST use scaling (when from design)

Apply scaling to **every** numeric px from the mockup:

- `font-size`
- `margin`, `padding` (all longhands and shorthand)
- `gap`, `row-gap`, `column-gap`
- `width`, `height`, `min-*`, `max-*`
- `top`, `right`, `bottom`, `left`
- `border-width`, `border-radius`
- `outline-width`, `outline-offset`
- `letter-spacing` (if specified in px)
- `box-shadow` offsets and blur (use `cqh` / `cqw` per axis)
- `transform: translate*` when distance comes from design px

## Allowed without scaling

| Case | OK |
|------|-----|
| `line-height: 1.2` or `1.4` | Unitless ratio from design |
| `font-weight`, `opacity`, colors | No px conversion |
| `display`, `flex`, `grid`, `position` | Structural |
| `max-width: 390px` on `__app` at `min-width: 391px` | Desktop phone column — see **`playable-viewport-shell`** |
| `min-height: 100vh` / `100dvh` on `__app` | Full viewport shell |
| `0` | `0` or `0px` |
| One shell `@media (min-width: 391px)` on `__app` only | From **`playable-viewport-shell`** — not for component UI |

## Forbidden when implementing from 390×844

- **Do not** copy Figma `px` literally (`font-size: 16px`, `padding: 20px`, `margin: 12px`).
- **Do not** use `rem` / `em` for values taken from the design artboard.
- **Do not** use `vw` / `vh` for design spacing (use **`cqw` / `cqh`** on the page container).
- **Do not** mix one scaled side and one raw px in the same shorthand (e.g. `padding: 20px calc(...)`).

Exception: a true **1px** hairline on retina can stay `1px` if the design explicitly requires a non-scaling hairline; prefer `calc(1 / 390 * 100cqw)` for consistency.

## Workflow for AI

1. Open **`playable-mobile-scaling/SKILL.md`** (this file).
2. For each element in the mockup, list px values (font, margin, padding, gap, radius, size).
3. Write `style.css` with **only** `.route-<page>` selectors and **only** `calc(N/390*100cqw)` / `calc(N/844*100cqh)` for those numbers.
4. Set `container-type: size` on `__app`.
5. Self-check: search `style.css` for `\d+px` — every match must be allowed (0, 390px desktop cap, 100vh/dvh, media query) or converted to `calc`.
6. Copy shell from **`../playable-viewport-shell/SKILL.md`** once; do not add other breakpoints for UI.

Reference implementation: **`src/pages/test-2/style.css`**.

---

## Playable Studio (JSON runtime)

Studio playables scale inside **`.pb-studio__content`** — not `.route-*` pages.

1. **Container:** `container-type: size` on `.pb-studio__content` (UI) and `.pb-studio__stage` (background / overlay). `.pb-studio__app` holds design vars only — **not** a scale container.
2. **Design canvas vars:** `--pb-design-w` / `--pb-design-h` from `playable.json` → `viewport` (set by `fluid-scale.js`).
3. **Formulas** — use vars, not hardcoded 390/844:

```css
/* width axis — cqw/cqh resolve against .pb-studio__content */
font-size: calc(28 / var(--pb-design-w) * 100cqw);
padding: calc(14 / var(--pb-design-h) * 100cqh) calc(20 / var(--pb-design-w) * 100cqw);

/* typography — prefer em on content base (16px @ design width) */
.pb-studio__content .pb-headline { font-size: 1.75em; }   /* keep */
.pb-studio__content .pb-subhead { font-size: 1em; }
.pb-studio__content .pb-body { font-size: 0.9375em; }

/* CTA — 80% of content column */
.pb-studio__content > .pb-el--cta-button { width: var(--pb-cta-width, 80%); align-self: center; }
.pb-studio__content .pb-btn--cta { width: 100%; }
```

4. **Do not** use root `rem` — `rem` follows `<html>`, not the phone frame. Use **cqw/cqh** or **em** under `.pb-studio__content`.
5. **Preview** device sizes (iPhone, Galaxy, Pixel) change frame — UI must scale via cqw/cqh/em only.
6. Full studio zones/assets/backgrounds → **`playable-studio-fluid/SKILL.md`**.

---

- Images / Lottie box size → same formulas (`playable-assets`, `playable-lottie`).
- New page scaffold → `playable-new-route` (step 7 points here).

See **`reference.md`** for a copy-paste starter block.
