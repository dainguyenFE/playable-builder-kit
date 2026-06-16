---
name: playable-interactions
description: >-
  Common playable interaction patterns: multi-step flows, tap targets, show/hide
  screens, end card then CTA. Use for mini-games, quizzes, or step-by-step demos.
---

# Playable interactions (vanilla JS)

Playables are **not** React apps. Use simple DOM + CSS classes in `page.js`.

## Multi-step / screen flow

```html
<section class="route-my-page__screen route-my-page__screen--active" data-screen="1">...</section>
<section class="route-my-page__screen" data-screen="2" hidden>...</section>
```

```js
function showScreen(n) {
  document.querySelectorAll(".route-my-page__screen").forEach((el) => {
    const active = el.dataset.screen === String(n);
    el.hidden = !active;
    el.classList.toggle("route-my-page__screen--active", active);
  });
}

document.querySelector("#next")?.addEventListener("click", () => showScreen(2));
```

## Tap / click feedback

```css
.route-my-page__tap {
  cursor: pointer;
  transition: transform 0.15s ease;
}
.route-my-page__tap:active {
  transform: scale(0.96);
}
```

## Step buttons (marketing demo style)

Scroll or jump to section on tap; **store CTA** on final step still uses `bindStoreCta("#cta")`:

```js
document.querySelectorAll("[data-scroll]").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.id === "cta") return; // let store CTA handle
    const id = btn.getAttribute("data-scroll");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  });
});
```

## End card → install

1. User completes interaction.
2. Show end overlay (`classList.add("--visible")`).
3. Single **Get the app** button → `bindStoreCta("#cta")`.

Do not auto-open store without user tap (network policy).

## Performance

- Prefer CSS transitions over heavy animation libraries.
- Debounce rapid taps if counting score.
- Avoid `setInterval` faster than needed; clean up on end.

## Checklist

```
[ ] Logic only in page.js (scoped selectors)
[ ] Final step has store CTA via bindStoreCta
[ ] No eval, no external scripts
[ ] build:single + verify:applovin before delivery
```
