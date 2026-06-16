import { bindStoreCta } from "../../skills/store-cta.js";
import { track } from "../tracking.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

export function renderStoreCta(host, { slots }) {
  track("cta_visible", { block: "store-cta" });
  host.classList.add("pb-block", "pb-store-cta");

  host.appendChild(el("h2", "pb-headline pb-headline--sm", slots.ctaHeadline || "Get started"));
  host.appendChild(el("p", "pb-subhead", slots.ctaSubhead || ""));

  const btn = el("button", "pb-btn pb-btn--cta", slots.ctaLabel || "Get the app");
  btn.type = "button";
  btn.id = "cta";
  host.appendChild(btn);

  bindStoreCta("#cta");
  btn.addEventListener("click", () => track("cta_click", { block: "store-cta" }));
}
