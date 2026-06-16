import composition from "./composition.json";
import copy from "./copy.json";
import { createPlayableEngine } from "../../runtime/engine.js";

const routeClass = "route-campaign-nova-mix-v1";

function init() {
  const root = document.getElementById("app");
  if (!root) return;

  createPlayableEngine({
    root,
    composition,
    copy,
    routeClass,
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
