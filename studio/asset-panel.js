import { openAssetPreview } from "./asset-preview-modal.js";

const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp,image/svg+xml,image/gif";
const LOTTIE_ACCEPT = "application/json,.json";
const ICON_ACCEPT = "image/svg+xml,.svg";

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function assetThumbUrl(asset) {
  if (asset.type === "lottie") return null;
  if (asset.path) return `/studio-assets/${asset.path}`;
  return null;
}

function tabLabel(tab) {
  if (tab === "lottie") return "Lottie";
  if (tab === "icon") return "Icons";
  return "Images";
}

/**
 * @param {HTMLElement} root
 */
export function initAssetPanel(root) {
  if (!root) return;

  let assets = [];
  let tab = "image";
  let iconFilter = "";

  root.innerHTML = `
    <div class="studio-assets__head">
      <h2>Assets</h2>
      <p>Ảnh, Lottie, Lucide icon — kéo thả hoặc Add.</p>
    </div>
    <div class="studio-assets__tabs" role="tablist">
      <button type="button" class="studio-assets__tab studio-assets__tab--active" data-tab="image" role="tab" aria-selected="true">Images</button>
      <button type="button" class="studio-assets__tab" data-tab="lottie" role="tab" aria-selected="false">Lottie</button>
      <button type="button" class="studio-assets__tab" data-tab="icon" role="tab" aria-selected="false">Icons</button>
    </div>
    <div class="studio-assets__drop" id="asset-drop-zone" tabindex="0">
      <p class="studio-assets__drop-hint">Kéo thả file vào đây</p>
      <button type="button" class="studio-assets__add-btn" id="asset-add-btn">Add</button>
      <input type="file" id="asset-file-input" hidden />
    </div>
    <div id="asset-icon-search-wrap" hidden>
      <input type="search" class="studio-assets__icon-search" id="asset-icon-search" placeholder="Search Lucide icons…" autocomplete="off" />
    </div>
    <div class="studio-assets__list-wrap">
      <ul class="studio-assets__list" id="asset-list" aria-live="polite"></ul>
    </div>
  `;

  const dropZone = root.querySelector("#asset-drop-zone");
  const fileInput = root.querySelector("#asset-file-input");
  const addBtn = root.querySelector("#asset-add-btn");
  const listEl = root.querySelector("#asset-list");
  const tabBtns = root.querySelectorAll(".studio-assets__tab");
  const iconSearchWrap = root.querySelector("#asset-icon-search-wrap");
  const iconSearch = root.querySelector("#asset-icon-search");

  async function fetchAssets() {
    const res = await fetch("/studio/api/assets");
    if (!res.ok) throw new Error("Failed to load assets");
    const data = await res.json();
    assets = data.assets ?? [];
    renderList();
  }

  function filtered() {
    let items = assets.filter((a) => a.type === tab);
    if (tab === "icon") {
      const q = iconFilter.trim().toLowerCase();
      if (q) {
        items = items.filter(
          (a) =>
            a.id.toLowerCase().includes(q) ||
            String(a.label || "")
              .toLowerCase()
              .includes(q),
        );
      } else {
        items = items.slice(0, 100);
      }
    }
    return items;
  }

  function renderList() {
    const items = filtered();
    const totalIcons = tab === "icon" ? assets.filter((a) => a.type === "icon").length : 0;
    if (!items.length) {
      listEl.innerHTML = `<li class="studio-assets__empty">No ${tabLabel(tab)} assets${iconFilter ? " match" : ""}.</li>`;
      return;
    }
    const hint =
      tab === "icon" && !iconFilter.trim() && totalIcons > 100
        ? `<li class="studio-assets__empty studio-assets__empty--hint">Showing 100 of ${totalIcons} Lucide icons — search to find more</li>`
        : "";
    listEl.innerHTML =
      hint +
      items
      .map((asset) => {
        const thumb = assetThumbUrl(asset);
        let thumbHtml;
        if (thumb) {
          thumbHtml = `<img class="studio-assets__thumb${asset.type === "icon" ? " studio-assets__thumb--icon" : ""}" src="${escapeHtml(thumb)}" alt="" loading="lazy" />`;
        } else {
          thumbHtml = `<span class="studio-assets__thumb studio-assets__thumb--lottie" aria-hidden="true">{}</span>`;
        }
        return `
        <li class="studio-assets__item studio-assets__item--clickable" data-id="${escapeHtml(asset.id)}" role="button" tabindex="0" title="Preview">
          ${thumbHtml}
          <div class="studio-assets__meta">
            <span class="studio-assets__id">${escapeHtml(asset.id)}</span>
            <span class="studio-assets__label">${escapeHtml(asset.label || "")}</span>
          </div>
        </li>`;
      })
      .join("");
  }

  function setTab(next) {
    tab = next;
    iconSearchWrap.hidden = tab !== "icon";
    if (tab !== "icon") iconFilter = "";
    if (iconSearch) iconSearch.value = iconFilter;
    tabBtns.forEach((btn) => {
      const on = btn.dataset.tab === tab;
      btn.classList.toggle("studio-assets__tab--active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
    if (tab === "lottie") {
      fileInput.accept = LOTTIE_ACCEPT;
      dropZone.querySelector(".studio-assets__drop-hint").textContent = "Kéo thả file .json Lottie";
    } else if (tab === "icon") {
      fileInput.accept = ICON_ACCEPT;
      dropZone.querySelector(".studio-assets__drop-hint").textContent =
        "Lucide library + custom SVG — search or Add";
    } else {
      fileInput.accept = IMAGE_ACCEPT;
      dropZone.querySelector(".studio-assets__drop-hint").textContent = "Kéo thả ảnh (PNG, JPG, SVG, WebP)";
    }
    renderList();
  }

  async function uploadFile(file) {
    const defaultId = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "asset";
    const id = window.prompt(`Asset id (filename: ${file.name})`, defaultId);
    if (!id?.trim()) return;

    const buf = await file.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
    const dataBase64 = btoa(binary);

    const body = { id: id.trim(), dataBase64, filename: file.name };
    if (tab === "lottie") body.type = "lottie";
    else if (tab === "icon") body.type = "icon";
    else body.type = "image";

    const res = await fetch("/studio/api/assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      window.alert(data.error || "Upload failed");
      return;
    }
    await fetchAssets();
  }

  async function handleFiles(fileList) {
    const files = [...fileList];
    if (!files.length) return;
    for (const file of files) {
      if (tab === "lottie" && !file.name.endsWith(".json")) {
        window.alert("Lottie tab accepts .json files only.");
        continue;
      }
      if (tab === "icon" && !file.name.endsWith(".svg")) {
        window.alert("Icons tab accepts .svg files only (Lucide / shadcn).");
        continue;
      }
      if (tab === "image" && !file.type.startsWith("image/") && !file.name.endsWith(".svg")) {
        window.alert("Images tab accepts image files only.");
        continue;
      }
      await uploadFile(file);
    }
  }

  iconSearch?.addEventListener("input", () => {
    iconFilter = iconSearch.value;
    renderList();
  });

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => setTab(btn.dataset.tab));
  });

  addBtn.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => {
    handleFiles(fileInput.files);
    fileInput.value = "";
  });

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("studio-assets__drop--over");
  });
  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("studio-assets__drop--over");
  });
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("studio-assets__drop--over");
    handleFiles(e.dataTransfer?.files);
  });

  listEl.addEventListener("click", (e) => {
    const item = e.target.closest(".studio-assets__item");
    if (!item) return;
    const asset = assets.find((a) => a.id === item.dataset.id);
    if (asset) openAssetPreview(asset);
  });
  listEl.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const item = e.target.closest(".studio-assets__item");
    if (!item) return;
    e.preventDefault();
    const asset = assets.find((a) => a.id === item.dataset.id);
    if (asset) openAssetPreview(asset);
  });

  setTab("image");
  fetchAssets().catch((err) => {
    listEl.innerHTML = `<li class="studio-assets__empty">${escapeHtml(err.message)}</li>`;
  });

  return { refresh: fetchAssets };
}
