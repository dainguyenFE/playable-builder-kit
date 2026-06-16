import { syncPreviewDeviceViewport } from "/src/runtime/studio/fluid-scale.js";

/** Popular mobile viewport presets (CSS px — logical resolution). */
export const DEVICE_PRESETS = [
  { id: "iphone-15", name: "iPhone 15 / 14 / 13", w: 390, h: 844, default: true },
  { id: "iphone-15-pro-max", name: "iPhone 15 Pro Max", w: 430, h: 932 },
  { id: "iphone-se", name: "iPhone SE", w: 375, h: 667 },
  { id: "iphone-12-mini", name: "iPhone 12 mini", w: 375, h: 812 },
  { id: "galaxy-s24", name: "Galaxy S24", w: 360, h: 780 },
  { id: "galaxy-s24-ultra", name: "Galaxy S24 Ultra", w: 412, h: 915 },
  { id: "pixel-8", name: "Pixel 8", w: 412, h: 915 },
  { id: "pixel-8-pro", name: "Pixel 8 Pro", w: 448, h: 998 },
  { id: "android-compact", name: "Android compact", w: 360, h: 640 },
];

export function deviceFromUrl() {
  return new URLSearchParams(window.location.search).get("device");
}

export function getPreset(id) {
  return DEVICE_PRESETS.find((d) => d.id === id) ?? DEVICE_PRESETS.find((d) => d.default);
}

/**
 * @param {{ shellEl: HTMLElement, frameEl: HTMLElement, captionEl?: HTMLElement, selectEl?: HTMLSelectElement }} els
 */
export function initDevicePicker({ shellEl, frameEl, captionEl, selectEl }) {
  if (!shellEl || !frameEl) return () => {};

  const scalerEl = shellEl.parentElement?.classList?.contains("studio-preview__device-scaler")
    ? shellEl.parentElement
    : null;

  let preset = getPreset(deviceFromUrl());

  function fillSelect() {
    if (!selectEl) return;
    selectEl.innerHTML = DEVICE_PRESETS.map(
      (d) => `<option value="${d.id}"${d.id === preset.id ? " selected" : ""}>${d.name}</option>`,
    ).join("");
  }

  function applyPreset(next) {
    preset = next;
    shellEl.dataset.device = preset.id;
    frameEl.style.width = `${preset.w}px`;
    frameEl.style.height = `${preset.h}px`;
    frameEl.style.setProperty("--preview-w", `${preset.w}px`);
    frameEl.style.setProperty("--preview-h", `${preset.h}px`);
    syncPreviewDeviceViewport(preset.w, preset.h);
    fitLayout();
  }

  /** 1:1 CSS px — content frame is exactly preset.w × preset.h (bezel outside, no scale). */
  function fitLayout() {
    syncPreviewDeviceViewport(preset.w, preset.h);

    const layout = () => {
      shellEl.style.left = "50%";
      shellEl.style.transform = "translateX(-50%)";
      shellEl.style.setProperty("--device-scale", "1");
      shellEl.classList.toggle("studio-preview__device-shell--compact", preset.h < 720);

      if (scalerEl) {
        scalerEl.style.width = `${shellEl.offsetWidth}px`;
        scalerEl.style.height = `${shellEl.offsetHeight}px`;
      }

      if (captionEl) {
        captionEl.textContent = `${preset.name} · ${preset.w} × ${preset.h}px (1:1)`;
      }
    };

    requestAnimationFrame(layout);
  }

  fillSelect();
  applyPreset(preset);

  selectEl?.addEventListener("change", () => {
    const next = getPreset(selectEl.value);
    applyPreset(next);
    const url = new URL(window.location.href);
    url.searchParams.set("device", next.id);
    window.history.replaceState({}, "", url);
  });

  const onResize = () => fitLayout();
  window.addEventListener("resize", onResize);
  window.addEventListener("pb-inspector-resize", onResize);
  window.addEventListener("pb-preview-mounted", fitLayout);

  refitDevice = fitLayout;

  return () => {
    window.removeEventListener("resize", onResize);
    window.removeEventListener("pb-inspector-resize", onResize);
    window.removeEventListener("pb-preview-mounted", fitLayout);
    refitDevice = null;
  };
}

let refitDevice = null;

export function refitDeviceFrame() {
  refitDevice?.();
}
