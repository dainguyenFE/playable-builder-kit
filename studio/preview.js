import { resolvePreview, mountPreview, getThemeOptions } from "./load-preview.js";
import { initZonePanel } from "./zone-panel.js";
import { initDevicePicker, refitDeviceFrame } from "./device-presets.js";
import { initPromptNotebook } from "./prompt-notebook.js";
import { initAssetPanel } from "./asset-panel.js";
import { initChatTargetToggle } from "./chat-target.js";

initPromptNotebook(document.getElementById("prompt-notebook"));
initAssetPanel(document.getElementById("asset-panel"));
initChatTargetToggle(document.getElementById("chat-target-toggle"));

const titleEl = document.getElementById("preview-title");
const badgeEl = document.getElementById("preview-badge");
const themeWrap = document.getElementById("theme-picker-wrap");
const themeSelect = document.getElementById("theme-picker");
const downloadBtn = document.getElementById("btn-download");
const root = document.getElementById("playable-root");
const zonePanel = document.getElementById("zone-panel");
const zoneInspector = document.getElementById("zone-inspector");
const zoneComposeNote = document.getElementById("zone-compose-note");
const toggleZonesWrap = document.getElementById("toggle-zones-wrap");
const pauseBtn = document.getElementById("btn-pause");
const resumeBtn = document.getElementById("btn-resume");

initDevicePicker({
  shellEl: document.getElementById("device-shell"),
  frameEl: document.getElementById("device-frame"),
  captionEl: document.getElementById("device-caption"),
  selectEl: document.getElementById("device-picker"),
});

let preview;
let studioPlayback = null;
let zonePanelReady = false;

function updatePlaybackButtons() {
  const isStudio = preview?.engine === "studio";
  if (pauseBtn) pauseBtn.hidden = !isStudio;
  if (resumeBtn) resumeBtn.hidden = !isStudio;
  if (!isStudio) return;
  const paused = studioPlayback?.isPaused?.() ?? false;
  if (pauseBtn) pauseBtn.disabled = paused;
  if (resumeBtn) resumeBtn.disabled = !paused;
}

function setupThemePicker(current) {
  const options = getThemeOptions(current);
  if (!options.length || !themeWrap || !themeSelect) {
    themeWrap?.setAttribute("hidden", "");
    return;
  }
  themeWrap.hidden = false;
  themeSelect.innerHTML = options
    .map(
      (t) =>
        `<option value="${t.id}"${t.selected ? " selected" : ""}>${t.name}</option>`,
    )
    .join("");
}

function setupDownload(current) {
  if (!downloadBtn || !current.id) {
    downloadBtn?.setAttribute("hidden", "");
    return;
  }
  if (current.kind === "template" && current.engine === "studio") {
    downloadBtn.hidden = false;
    downloadBtn.href = `/download/template/${current.id}`;
    downloadBtn.setAttribute("download", `${current.id}.html`);
    downloadBtn.title = "Serves export HTML (auto-rebuilds in dev when source is newer)";
    return;
  }
  if (current.kind === "playable") {
    downloadBtn.hidden = false;
    downloadBtn.href = `/download/${current.id}`;
    downloadBtn.setAttribute("download", `${current.id}.html`);
    downloadBtn.title = "Single self-contained HTML (~270KB). Do not use browser Save Page on preview.";
    return;
  }
  downloadBtn?.setAttribute("hidden", "");
}

function setupZoneInspector(current) {
  const isStudio = current.engine === "studio";
  if (zonePanel) zonePanel.hidden = !isStudio;
  if (zoneComposeNote) zoneComposeNote.hidden = isStudio;
  if (toggleZonesWrap) toggleZonesWrap.hidden = !isStudio;
  if (zoneInspector) zoneInspector.classList.toggle("studio-preview__inspector--compose", !isStudio);

  if (isStudio && !zonePanelReady) {
    initZonePanel({
      panelEl: zonePanel,
      toggleZonesEl: document.getElementById("toggle-zones"),
    });
    zonePanelReady = true;
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showPreviewError(err) {
  const file = err?.details?.file ? `<p class="studio-preview__error-file"><code>${escapeHtml(err.details.file)}</code></p>` : "";
  root.innerHTML = `<div class="studio-preview__error" role="alert">
    <h2 class="studio-preview__error-title">Preview unavailable</h2>
    <p class="studio-preview__error-msg">${escapeHtml(err?.message ?? String(err))}</p>
    ${file}
    <p class="studio-preview__error-hint">Fix JSON for this template or playable only. Other previews are unaffected.</p>
  </div>`;
  root.className = "studio-preview__error-root";
  studioPlayback = null;
  if (zonePanel) zonePanel.hidden = true;
  if (zoneComposeNote) zoneComposeNote.hidden = true;
  if (toggleZonesWrap) toggleZonesWrap.hidden = true;
  themeWrap?.setAttribute("hidden", "");
  downloadBtn?.setAttribute("hidden", "");
}

function clearPreviewError() {
  root.className = "";
}

async function renderPreview(overrideThemeId) {
  try {
    preview = await resolvePreview(overrideThemeId);
    titleEl.textContent = preview.label;
    if (badgeEl) {
      badgeEl.textContent = preview.kind === "template" ? "Template preview" : "Playable";
      badgeEl.hidden = false;
    }
    setupThemePicker(preview);
    setupDownload(preview);
    setupZoneInspector(preview);
    root.innerHTML = "";
    clearPreviewError();
    try {
      studioPlayback = mountPreview(preview, root);
    } catch (mountErr) {
      console.error("[preview] mount failed", mountErr);
      showPreviewError(mountErr);
    }
  } catch (loadErr) {
    console.error("[preview] load failed", loadErr);
    titleEl.textContent = "Preview error";
    if (badgeEl) badgeEl.hidden = true;
    showPreviewError(loadErr);
  }
  updatePlaybackButtons();
  requestAnimationFrame(refitDeviceFrame);
}

await renderPreview();

themeSelect?.addEventListener("change", () => {
  const themeId = themeSelect.value;
  const url = new URL(window.location.href);
  url.searchParams.set("theme", themeId);
  window.history.replaceState({}, "", url);
  renderPreview(themeId);
});

document.getElementById("btn-restart")?.addEventListener("click", () => {
  if (!preview) return;
  root.innerHTML = "";
  clearPreviewError();
  try {
    studioPlayback = mountPreview(preview, root);
  } catch (mountErr) {
    console.error("[preview] restart failed", mountErr);
    showPreviewError(mountErr);
  }
  updatePlaybackButtons();
  requestAnimationFrame(refitDeviceFrame);
});

pauseBtn?.addEventListener("click", () => {
  studioPlayback?.pause?.();
  updatePlaybackButtons();
});

resumeBtn?.addEventListener("click", () => {
  studioPlayback?.resume?.();
  updatePlaybackButtons();
});

window.addEventListener("pb-playback-state", () => updatePlaybackButtons());
