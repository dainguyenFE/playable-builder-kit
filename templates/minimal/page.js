import { bindStoreCta } from "../../skills/store-cta.js";

function init() {
  bindStoreCta("#cta");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
