import { bindStoreCta } from "../../skills/store-cta.js";

function initStepScroll() {
  document.querySelectorAll("[data-scroll]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = btn.getAttribute("data-scroll");
      const section = id ? document.getElementById(id) : null;
      if (section && btn.id !== "cta") {
        e.preventDefault();
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

function init() {
  bindStoreCta("#cta");
  initStepScroll();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
