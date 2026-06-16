import { bootFromDom } from "./bootstrap.js";
import { initExportViewport } from "./export-viewport.js";

function start() {
  initExportViewport();
  bootFromDom();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
