import { track } from "../tracking.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

export function renderTapToStart(host, { slots, routeClass, onComplete }) {
  track("playable_start");
  host.classList.add("pb-block", "pb-tap-to-start");

  const inner = el("div", `pb-tap-to-start__inner ${routeClass}__tap-inner`);
  inner.appendChild(el("h1", "pb-headline", slots.headline || "Welcome"));
  inner.appendChild(el("p", "pb-subhead", slots.subheadline || ""));

  const btn = el("button", "pb-btn pb-btn--primary", slots.tapLabel || "Tap to start");
  btn.type = "button";
  btn.addEventListener("click", () => {
    track("first_interaction", { block: "tap-to-start" });
    onComplete?.();
  });

  inner.appendChild(btn);
  host.appendChild(inner);
}
