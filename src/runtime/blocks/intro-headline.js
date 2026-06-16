import { track } from "../tracking.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

export function renderIntroHeadline(host, { slots, routeClass, onComplete }) {
  track("scene_view", { block: "intro-headline" });
  host.classList.add("pb-block", "pb-intro-headline");

  host.appendChild(el("h1", "pb-headline", slots.headline || "Title"));
  host.appendChild(el("p", "pb-subhead", slots.subheadline || ""));

  const btn = el("button", "pb-btn pb-btn--primary", slots.continueLabel || "Continue");
  btn.type = "button";
  btn.addEventListener("click", () => {
    track("first_interaction", { block: "intro-headline" });
    onComplete?.();
  });
  host.appendChild(btn);
}
