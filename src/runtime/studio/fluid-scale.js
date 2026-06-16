/**
 * Fluid mobile scaling + layout insets (prompt-editable via playable.json → layout).
 * @param {HTMLElement} app
 * @param {object} [playable]
 */
export function applyFluidViewport(app, playable = {}) {
  if (!app) return;
  const w = playable.viewport?.width ?? 390;
  const h = playable.viewport?.height ?? 844;
  applyFluidViewportSize(app, w, h, playable.layout ?? {});
}

/**
 * Apply design size + insets (preview device picker or export viewport).
 * @param {HTMLElement} app
 * @param {number} w
 * @param {number} h
 * @param {object} [layout]
 */
export function applyFluidViewportSize(app, w, h, layout = {}) {
  if (!app) return;
  const insetX = layout.insetX ?? (Number(app.dataset.insetX) || 20);
  const insetY = layout.insetY ?? (Number(app.dataset.insetY) || 20);
  const insetBottom = layout.insetBottom ?? (Number(app.dataset.insetBottom) || 24);
  const gap = layout.gap ?? 14;

  app.style.setProperty("--pb-design-w", String(w));
  app.style.setProperty("--pb-design-h", String(h));
  app.style.setProperty("--pb-inset-x", `calc(${insetX} / ${w} * 100cqw)`);
  app.style.setProperty("--pb-inset-y", `calc(${insetY} / ${h} * 100cqh)`);
  app.style.setProperty("--pb-inset-bottom", `calc(${insetBottom} / ${h} * 100cqh)`);
  app.style.setProperty("--pb-gap", `calc(${gap} / ${h} * 100cqh)`);
  app.dataset.insetX = String(insetX);
  app.dataset.insetY = String(insetY);
  app.dataset.insetBottom = String(insetBottom);
  app.style.fontSize = `calc(16 / ${w} * 100cqw)`;
}

/**
 * Match playable content coordinate system to preview device (logical CSS px).
 * Frame #device-frame is exactly w×h — bezel is outside.
 */
export function syncPreviewDeviceViewport(w, h) {
  const root = document.getElementById("playable-root");
  if (!root) return;

  const studioApp = root.querySelector(".pb-studio__app");
  if (studioApp) {
    applyFluidViewportSize(studioApp, w, h);
    return;
  }

  const composeApp = root.querySelector('[class$="__app"]');
  if (composeApp) {
    composeApp.style.setProperty("--pb-design-w", String(w));
    composeApp.style.setProperty("--pb-design-h", String(h));
  }
}
