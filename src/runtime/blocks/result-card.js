import { track } from "../tracking.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

export function renderResultCard(host, { slots, onComplete }) {
  track("demo_completed", { block: "result-card" });
  host.classList.add("pb-block", "pb-result-card");

  const card = el("div", "pb-result-card__card");
  card.appendChild(el("h2", "pb-headline pb-headline--sm", slots.resultTitle || "Result"));
  card.appendChild(el("p", "pb-body", slots.resultBody || ""));

  const list = el("ul", "pb-benefits");
  for (const key of ["benefit1", "benefit2", "benefit3"]) {
    if (slots[key]) {
      const li = el("li", "pb-benefits__item", slots[key]);
      list.appendChild(li);
    }
  }
  card.appendChild(list);
  host.appendChild(card);

  const btn = el("button", "pb-btn pb-btn--secondary", slots.continueLabel || "Continue");
  btn.type = "button";
  btn.addEventListener("click", () => onComplete?.());
  host.appendChild(btn);
}
