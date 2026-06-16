# Lottie (vanilla, bundled)

Dependency: `lottie-web` (already in root `package.json`).

## Import

Use the light player (aliased in `vite.config.js`):

```js
import lottie from "lottie-web/build/player/lottie_light";
import animJson from "/src/assets/my_playable/lottie/button.json";
```

## Load animation

```js
const anim = lottie.loadAnimation({
  container: document.getElementById("sendLottie"),
  renderer: "svg",
  loop: true,
  autoplay: true,
  animationData: animJson,
  rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
});

anim.addEventListener("DOMLoaded", () => {
  const svg = container.querySelector("svg");
  if (!svg) return;
  svg.removeAttribute("width");
  svg.removeAttribute("height");
  svg.style.width = "100%";
  svg.style.height = "100%";
});
```

## HTML placeholder

```html
<div class="send-lottie" id="sendLottie" aria-hidden="true"></div>
```

Size the **container** in CSS; let SVG scale to 100%.

## Split large JSON

For huge animations, use repo scripts pattern (`scripts/split-*-lottie.mjs`) or separate JSON files per state — still import as modules so they inline in the single HTML file.

## Do not

- Load Lottie from a CDN `<script src="https://cdn...">` in the shipped playable
- Use `@lottiefiles/react-lottie-player` or any React wrapper

Reference: `src/html/playable_7_art_2/screen2.js` (`initSendLottie`, `initLoadingLottie`).
