import { track } from "../tracking.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

export function renderChipPicker(host, { slots, onComplete }) {
  host.classList.add("pb-block", "pb-chip-picker");
  host.appendChild(el("h2", "pb-headline pb-headline--sm", slots.headline || "Pick one"));

  const chips = el("div", "pb-chip-picker__chips");
  host.appendChild(chips);

  let picked = false;
  for (const key of ["chip1", "chip2", "chip3"]) {
    const label = slots[key];
    if (!label) continue;
    const btn = el("button", "pb-chip", label);
    btn.type = "button";
    btn.addEventListener("click", () => {
      if (picked) return;
      picked = true;
      track("choice_selected", { block: "chip-picker", choice: key });
      track("demo_completed", { block: "chip-picker" });
      chips.querySelectorAll("button").forEach((b) => {
        b.classList.toggle("pb-chip--active", b === btn);
        b.disabled = true;
      });
      setTimeout(() => onComplete?.(), 600);
    });
    chips.appendChild(btn);
  }
}
