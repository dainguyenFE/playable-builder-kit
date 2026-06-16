# Mobile scaling — property cheat sheet

Design canvas: **390 × 844**. Container: `.route-<name>__app` with `container-type: size`.

## Axis quick pick

| Figma measures along… | Use |
|-----------------------|-----|
| Width of frame (text size, side padding, icon width) | `calc(N / 390 * 100cqw)` |
| Height of frame (stack spacing, section padding) | `calc(N / 844 * 100cqh)` |

## Property → unit

| Property | Unit |
|----------|------|
| `font-size` | `cqw` |
| `letter-spacing` (px in design) | `cqw` |
| `margin-top`, `margin-bottom`, `padding-top`, `padding-bottom` | `cqh` |
| `margin-left`, `margin-right`, `padding-left`, `padding-right` | `cqw` |
| `gap` (horizontal flex) | `cqw` |
| `gap` (vertical stack) | `cqh` |
| `row-gap` | `cqh` |
| `column-gap` | `cqw` |
| `width`, `min-width`, `max-width` | `cqw` (square icons: same N for width & height) |
| `height`, `min-height`, `max-height` | `cqh` |
| `border-radius`, `border-width` | `cqw` |
| `top`, `bottom` | `cqh` |
| `left`, `right` | `cqw` |
| `box-shadow` offset X / blur X | `cqw` |
| `box-shadow` offset Y / blur Y | `cqh` |
| `translateY` | `cqh` |
| `translateX` | `cqw` |

## Starter block

```css
/* ai/skills/playable-mobile-scaling/SKILL.md */
.route-example__app {
  container-type: size;
  container-name: page;
  padding: calc(20 / 844 * 100cqh) calc(16 / 390 * 100cqw);
}

.route-example__title {
  font-size: calc(28 / 390 * 100cqw);
  margin-bottom: calc(12 / 844 * 100cqh);
  line-height: 1.2;
}

.route-example__card {
  padding: calc(20 / 844 * 100cqh) calc(16 / 390 * 100cqw);
  margin-bottom: calc(8 / 844 * 100cqh);
  border: calc(1 / 390 * 100cqw) solid rgba(255, 255, 255, 0.2);
  border-radius: calc(16 / 390 * 100cqw);
  gap: calc(10 / 844 * 100cqh);
}
```

At **390px** container width, `calc(16 / 390 * 100cqw)` renders as **16px**.
