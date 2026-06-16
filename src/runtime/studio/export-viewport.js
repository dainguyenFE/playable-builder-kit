/** Viewports wider than this use desktop “phone frame” mode (scaled, centered). */
const MOBILE_LAYOUT_MAX_PX = 768;

/**
 * Export shell layout:
 * - Mobile (≤768px): full 100% width/height — real ad slot on device.
 * - Desktop: fixed design viewport (e.g. 390×844) scaled to fit, like Studio preview.
 */
export function initExportViewport() {
  if (document.documentElement.dataset.playableMode !== "export") return;

  const viewportEl = document.getElementById("playable-viewport");
  if (!viewportEl) return;

  let designW = 390;
  let designH = 844;
  try {
    const el = document.getElementById("playable-config");
    if (el?.textContent) {
      const bundle = JSON.parse(el.textContent);
      designW = bundle.playable?.viewport?.width ?? designW;
      designH = bundle.playable?.viewport?.height ?? designH;
    }
  } catch {
    /* keep defaults */
  }

  const root = document.documentElement;
  root.style.setProperty("--pb-export-design-w", `${designW}px`);
  root.style.setProperty("--pb-export-design-h", `${designH}px`);

  function isMobileLayout() {
    const sw = window.innerWidth || root.clientWidth;
    return sw <= MOBILE_LAYOUT_MAX_PX;
  }

  function apply() {
    const sw = window.innerWidth || root.clientWidth;
    const sh = window.innerHeight || root.clientHeight;
    const mobile = isMobileLayout();

    root.dataset.exportLayout = mobile ? "mobile" : "desktop";

    if (mobile) {
      viewportEl.style.width = "";
      viewportEl.style.height = "";
      root.style.setProperty("--pb-export-scale", "1");
      return;
    }

    viewportEl.style.width = `${designW}px`;
    viewportEl.style.height = `${designH}px`;
    const scale = Math.min(sw / designW, sh / designH);
    root.style.setProperty("--pb-export-scale", String(scale));
  }

  apply();
  window.addEventListener("resize", apply);
  window.addEventListener("orientationchange", () => setTimeout(apply, 100));
}
