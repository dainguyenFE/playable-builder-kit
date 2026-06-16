import { bindStoreCta } from "../../skills/store-cta.js";

// import heroImg from "./assets/images/hero.png";

function init() {
  bindStoreCta("#cta");

  const hero = document.getElementById("hero");
  // if (hero && heroImg) hero.src = heroImg;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
