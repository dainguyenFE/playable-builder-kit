import lottie from "lottie-web/build/player/lottie_light";

function fitLottieSvg(container) {
  const svg = container?.querySelector("svg");
  if (!svg) return;
  svg.removeAttribute("width");
  svg.removeAttribute("height");
  svg.style.width = "100%";
  svg.style.height = "100%";
}

/** Load Lottie into a container; returns animation instance or null */
export function initLottie(container, animationData, options = {}) {
  if (!container || !animationData) return null;
  const anim = lottie.loadAnimation({
    container,
    renderer: "svg",
    loop: options.loop ?? true,
    autoplay: options.autoplay ?? true,
    animationData,
    rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
  });
  anim.addEventListener("DOMLoaded", () => fitLottieSvg(container));
  return anim;
}
