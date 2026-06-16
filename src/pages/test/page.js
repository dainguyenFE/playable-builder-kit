import { bindStoreCta } from "../../skills/store-cta.js";
import { initLottie } from "../../skills/lottie.js";

// import heroImg from "./assets/images/hero.png";
// import ctaAnim from "./assets/lottie/cta.json";

function init() {
  bindStoreCta("#cta");

  const hero = document.getElementById("hero");
  // if (hero && heroImg) hero.src = heroImg;

  // initLottie(document.getElementById("ctaLottie"), ctaAnim);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
