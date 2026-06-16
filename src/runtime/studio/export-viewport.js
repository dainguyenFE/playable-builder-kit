/** Viewports wider than this keep a centered mobile-aspect content frame (bg stays full bleed). */
const MOBILE_LAYOUT_MAX_PX = 768;

/**
 * Export shell adapts to the iframe the ad network provides:
 * - Mobile (≤768px): content + bg fill 100% w/h.
 * - Wide (desktop / AppLovin dashboard preview): bg full bleed; content in scaled 390×844 frame.
 */
export function initExportViewport() {
  if (document.documentElement.dataset.playableMode !== "export") return;

  const root = document.documentElement;

  function apply() {
    const sw = window.innerWidth || root.clientWidth;
    root.dataset.exportLayout = sw <= MOBILE_LAYOUT_MAX_PX ? "mobile" : "desktop";
  }

  apply();
  window.addEventListener("resize", apply);
  window.addEventListener("orientationchange", () => setTimeout(apply, 100));
}
