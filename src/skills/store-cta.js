import { initStoreLink, openAppStore } from "../core/store-link.js";

/** Wire store CTA: init AppsFlyer + bind click → openAppStore */
export function bindStoreCta(selector = "#cta") {
  initStoreLink();
  document.querySelector(selector)?.addEventListener("click", (e) => {
    e.preventDefault();
    openAppStore();
  });
}
