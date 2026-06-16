---
name: playable-lottie
description: >-
  Lottie animations in playables: lottie_light only (no eval), JSON in assets/lottie,
  initLottie helper. Use when design has animated buttons, loaders, or motion.
---

# Lottie in single-file playables

## Critical: use light player only

AppLovin rejects **`eval()`**. Full `lottie-web` players include expression `eval`.

```js
// ✅ Use helper (already imports lottie_light)
import { initLottie } from "../../skills/lottie.js";

// ❌ Never
import lottie from "lottie-web/build/player/lottie";
import lottie from "lottie-web"; // full bundle
```

## Setup

1. Put JSON in `src/pages/<page>/assets/lottie/cta.json`
2. HTML container:

```html
<div class="route-my-page__lottie" id="ctaLottie" aria-hidden="true"></div>
```

3. `page.js`:

```js
import { initLottie } from "../../skills/lottie.js";
import ctaAnim from "./assets/lottie/cta.json";

function init() {
  initLottie(document.getElementById("ctaLottie"), ctaAnim, {
    loop: true,
    autoplay: true,
  });
}
```

## Options

| Option | Default |
|--------|---------|
| `loop` | `true` |
| `autoplay` | `true` |

## Sizing

Style the container in `style.css` (390×844 scaling):

```css
.route-my-page__lottie {
  width: calc(72 / 390 * 100cqw);
  height: calc(72 / 390 * 100cqw);
}
```

Helper auto-scales inner SVG to 100% width/height.

## File size

- Remove unused layers in After Effects before export.
- Prefer short loops for CTA buttons.
- One or two animations per playable is usually enough.

## Checklist

```
[ ] JSON in assets/lottie/
[ ] initLottie from src/skills/lottie.js only
[ ] pnpm build:single <page>
[ ] pnpm verify:applovin <page> — no eval(
```
