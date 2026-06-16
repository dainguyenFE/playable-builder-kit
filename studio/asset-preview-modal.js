/**
 * Studio dev-only asset preview modal — not included in playable HTML export.
 */

const BG_KEY = "studio-asset-preview-bg";
const BG_PRESETS = [
  { id: "checker", label: "Checker", css: "checker" },
  { id: "white", label: "White", css: "#ffffff" },
  { id: "slate", label: "Slate", css: "#e2e8f0" },
  { id: "dark", label: "Dark", css: "#0f172a" },
  { id: "violet", label: "Violet", css: "#4c1d95" },
];

/** @type {import("lottie-web").AnimationItem | null} */
let lottieAnim = null;
/** @type {HTMLElement | null} */
let modalEl = null;
/** @type {HTMLElement | null} */
let stageEl = null;

function loadBg() {
  return localStorage.getItem(BG_KEY) || "checker";
}

function saveBg(id) {
  localStorage.setItem(BG_KEY, id);
}

function applyBg(bodyEl, presetId) {
  if (!bodyEl) return;
  const preset = BG_PRESETS.find((p) => p.id === presetId) ?? BG_PRESETS[0];
  bodyEl.dataset.bg = preset.id;
  if (preset.css === "checker") {
    bodyEl.style.background =
      "repeating-conic-gradient(#cbd5e1 0% 25%, #f8fafc 0% 50%) 50% / 20px 20px";
  } else {
    bodyEl.style.background = preset.css;
  }
  bodyEl.querySelectorAll(".studio-asset-modal__bg-btn").forEach((btn) => {
    btn.classList.toggle("studio-asset-modal__bg-btn--active", btn.dataset.bg === preset.id);
  });
}

function destroyLottie() {
  if (lottieAnim) {
    lottieAnim.destroy();
    lottieAnim = null;
  }
}

function closeModal() {
  destroyLottie();
  if (!modalEl) return;
  modalEl.hidden = true;
  const body = modalEl.querySelector(".studio-asset-modal__body");
  if (body) body.innerHTML = "";
  stageEl = null;
  document.body.classList.remove("studio-asset-modal-open");
}

function ensureModal() {
  if (modalEl) return modalEl;

  modalEl = document.createElement("div");
  modalEl.className = "studio-asset-modal";
  modalEl.hidden = true;
  modalEl.innerHTML = `
    <div class="studio-asset-modal__backdrop" data-close tabindex="-1"></div>
    <div class="studio-asset-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="studio-asset-modal-title">
      <header class="studio-asset-modal__head">
        <h3 id="studio-asset-modal-title" class="studio-asset-modal__title"></h3>
        <button type="button" class="studio-asset-modal__close" aria-label="Close">×</button>
      </header>
      <div class="studio-asset-modal__toolbar">
        <span class="studio-asset-modal__toolbar-label">Background</span>
        <div class="studio-asset-modal__bg-list" role="group" aria-label="Preview background"></div>
      </div>
      <div class="studio-asset-modal__body"></div>
    </div>
  `;
  document.body.appendChild(modalEl);

  const bgList = modalEl.querySelector(".studio-asset-modal__bg-list");
  for (const preset of BG_PRESETS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "studio-asset-modal__bg-btn";
    btn.dataset.bg = preset.id;
    btn.title = preset.label;
    btn.setAttribute("aria-label", preset.label);
    if (preset.css === "checker") {
      btn.classList.add("studio-asset-modal__bg-btn--checker");
    } else {
      btn.style.background = preset.css;
    }
    btn.addEventListener("click", () => {
      saveBg(preset.id);
      applyBg(modalEl.querySelector(".studio-asset-modal__body"), preset.id);
    });
    bgList?.appendChild(btn);
  }

  modalEl.querySelector(".studio-asset-modal__close")?.addEventListener("click", closeModal);
  modalEl.querySelector("[data-close]")?.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalEl && !modalEl.hidden) closeModal();
  });

  return modalEl;
}

function waitForLayout() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}

async function mountLottie(stage, data) {
  if (!data?.v) {
    throw new Error("Invalid Lottie JSON — missing version field");
  }
  const { initLottie } = await import("/src/skills/lottie.js");
  destroyLottie();
  stage.style.width = "280px";
  stage.style.height = "280px";
  lottieAnim = initLottie(stage, data, { loop: true, autoplay: true });
  if (!lottieAnim) {
    throw new Error("Lottie player could not start");
  }
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(), 2000);
    lottieAnim.addEventListener("DOMLoaded", () => {
      clearTimeout(timer);
      try {
        lottieAnim.resize();
      } catch {
        /* noop */
      }
      resolve();
    });
    lottieAnim.addEventListener("data_failed", () => {
      clearTimeout(timer);
      reject(new Error("Lottie data failed to parse"));
    });
  });
}

/**
 * @param {{ id: string, type: string, path: string, label?: string }} asset
 */
export async function openAssetPreview(asset) {
  if (!asset?.path) return;

  const modal = ensureModal();
  const titleEl = modal.querySelector(".studio-asset-modal__title");
  const bodyEl = modal.querySelector(".studio-asset-modal__body");
  if (!titleEl || !bodyEl) return;

  destroyLottie();
  titleEl.textContent = asset.label?.trim() || asset.id;
  bodyEl.innerHTML = "";
  applyBg(bodyEl, loadBg());

  const url = `/studio-assets/${asset.path}`;

  modal.hidden = false;
  document.body.classList.add("studio-asset-modal-open");
  await waitForLayout();

  try {
    if (asset.type === "lottie") {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load Lottie JSON");
      const data = await res.json();
      stageEl = document.createElement("div");
      stageEl.className = "studio-asset-modal__lottie";
      bodyEl.appendChild(stageEl);
      await waitForLayout();
      await mountLottie(stageEl, data);
    } else {
      const img = document.createElement("img");
      img.className =
        asset.type === "icon"
          ? "studio-asset-modal__img studio-asset-modal__img--icon"
          : "studio-asset-modal__img";
      img.src = url;
      img.alt = asset.label || asset.id;
      bodyEl.appendChild(img);
    }
  } catch (err) {
    bodyEl.innerHTML = `<p class="studio-asset-modal__error">${err?.message || "Could not preview asset"}</p>`;
  }
}
