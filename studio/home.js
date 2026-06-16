import { initPromptNotebook } from "./prompt-notebook.js";

const [registry, themesCatalog, playablesIndex] = await Promise.all([
  fetch("/data/registry/playables.json").then((r) => r.json()),
  fetch("/data/studio/themes.json").then((r) => r.json()),
  fetch("/studio/api/playables.json").then((r) => r.json()),
]);

const playableList = document.getElementById("playable-list");
const templateList = document.getElementById("template-list");
const templateFilters = document.getElementById("template-filters");
const playableSearch = document.getElementById("playable-search");
const templateSearch = document.getElementById("template-search");
const playableEmpty = document.getElementById("playable-empty");
const templateEmpty = document.getElementById("template-empty");

initPromptNotebook(document.getElementById("prompt-notebook"));

const templateMetaCache = new Map();

/** V3 user case filter chips */
const USER_CASE_GROUPS = [
  { id: "all", label: "All", uc: null },
  { id: "chat", label: "UC01 Chat", uc: "01" },
  { id: "writing", label: "UC02 Writing", uc: "02" },
  { id: "image", label: "UC03 Image", uc: "03" },
  { id: "video", label: "Video", uc: null },
  { id: "resume", label: "UC04 Resume", uc: "04" },
  { id: "tutor", label: "UC05 Tutor", uc: "05" },
  { id: "fitness", label: "UC06 Fitness", uc: "06" },
  { id: "travel", label: "UC07 Travel", uc: "07" },
  { id: "finance", label: "UC08 Finance", uc: "08" },
  { id: "agent", label: "UC09 Agent", uc: "09" },
  { id: "reco", label: "UC10 Reco", uc: "10" },
];

let activeFilter = "all";

async function loadTemplateMeta(templateId) {
  if (templateMetaCache.has(templateId)) return templateMetaCache.get(templateId);
  const res = await fetch(`/template-data/studio/${templateId}/template.json`);
  if (!res.ok) return null;
  const meta = await res.json();
  templateMetaCache.set(templateId, meta);
  return meta;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function themeLinks(templateId, meta) {
  if (!meta?.themes?.length) return "";
  return meta.themes
    .map((tid) => {
      const name = themesCatalog.themes[tid]?.name ?? tid;
      const def = tid === meta.defaultTheme ? " ★" : "";
      return `<a class="studio-card__theme" href="/preview/template/${templateId}?theme=${tid}" title="Preview ${escapeHtml(name)}">${escapeHtml(name)}${def}</a>`;
    })
    .join("");
}

function flowChips(flow = []) {
  if (!flow?.length) return "";
  return flow
    .map((step, i) => {
      const arrow = i < flow.length - 1 ? `<span class="studio-flow-arrow" aria-hidden="true">→</span>` : "";
      return `<span class="studio-flow-chip">${escapeHtml(step)}</span>${arrow}`;
    })
    .join("");
}

function ucBadge(category) {
  const group = USER_CASE_GROUPS.find((g) => g.id === category);
  const uc = group?.uc;
  if (uc) return `<span class="studio-badge studio-badge--uc">UC${uc}</span>`;
  if (category === "video") return `<span class="studio-badge studio-badge--uc">Video</span>`;
  return "";
}

function playableCard(p) {
  const card = document.createElement("article");
  card.className = "studio-card";
  card.setAttribute("role", "listitem");
  card.dataset.search = `${p.name} ${p.id} ${p.engine}`.toLowerCase();
  card.innerHTML = `
    <h3 class="studio-card__title">${escapeHtml(p.name)}</h3>
    <p class="studio-card__meta"><code>${escapeHtml(p.id)}</code> · ${escapeHtml(p.engine)}</p>
    <div class="studio-card__actions">
      <a class="studio-card__btn" href="/preview/${encodeURIComponent(p.id)}">Preview</a>
      <a class="studio-card__btn studio-card__btn--ghost" href="/open-export/${encodeURIComponent(p.id)}" target="_blank" rel="noopener">Open export</a>
      <a class="studio-card__btn studio-card__btn--accent" href="/download/${encodeURIComponent(p.id)}" download="${escapeHtml(p.id)}.html">Download</a>
    </div>`;
  return card;
}

function templateCard(t, meta, themesHtml) {
  const preview = t.previewPath || `/preview/template/${t.id}`;
  const desc = t.description || meta?.description || "";
  const screenCount = t.screenCount ?? meta?.screenCount ?? "?";
  const flow = meta?.flow ?? t.flow ?? [];
  const category = t.category ?? meta?.userCase ?? "";
  const scenario = t.scenario ?? meta?.scenario ?? "";
  const card = document.createElement("article");
  card.className = "studio-card studio-card--template";
  card.setAttribute("role", "listitem");
  card.dataset.search = `${t.name} ${t.id} ${category} ${scenario} ${desc} ${flow.join(" ")}`.toLowerCase();
  card.dataset.category = category;
  card.innerHTML = `
    <div class="studio-card__badges">
      ${ucBadge(category)}
      ${scenario ? `<span class="studio-badge studio-badge--scenario">${escapeHtml(scenario)}</span>` : ""}
      <span class="studio-badge studio-badge--screens">${screenCount} screens</span>
    </div>
    <h3 class="studio-card__title">${escapeHtml(t.name)}</h3>
    <p class="studio-card__meta"><code>${escapeHtml(t.id)}</code></p>
    ${desc ? `<p class="studio-card__desc">${escapeHtml(desc)}</p>` : ""}
    ${flow.length ? `<div class="studio-card__flow" aria-label="Screen flow">${flowChips(flow)}</div>` : ""}
    <div class="studio-card__actions">
      <a class="studio-card__btn studio-card__btn--accent" href="${preview}">Preview</a>
    </div>
    ${themesHtml ? `<div class="studio-card__themes"><span class="studio-card__themes-label">Themes</span>${themesHtml}</div>` : ""}`;
  return card;
}

function applyTemplateFilters() {
  const q = templateSearch?.value.trim().toLowerCase() ?? "";
  let visible = 0;
  for (const card of templateList?.children ?? []) {
    const category = card.dataset.category ?? "";
    const tagMatch = activeFilter === "all" || category === activeFilter;
    const textMatch = !q || (card.dataset.search ?? "").includes(q);
    const show = tagMatch && textMatch;
    card.hidden = !show;
    if (show) visible += 1;
  }
  if (templateEmpty) templateEmpty.hidden = visible > 0 || !templateList?.children.length;
}

function filterGrid(grid, query, emptyEl) {
  const q = query.trim().toLowerCase();
  let visible = 0;
  for (const card of grid.children) {
    const match = !q || (card.dataset.search ?? "").includes(q);
    card.hidden = !match;
    if (match) visible += 1;
  }
  if (emptyEl) emptyEl.hidden = visible > 0 || grid.children.length === 0;
}

function renderTemplateFilters() {
  if (!templateFilters) return;
  templateFilters.innerHTML = USER_CASE_GROUPS.map(
    (g) =>
      `<button type="button" class="studio-filter-chip${g.id === activeFilter ? " studio-filter-chip--active" : ""}" data-filter="${g.id}" role="tab" aria-selected="${g.id === activeFilter}">${escapeHtml(g.label)}</button>`,
  ).join("");
  templateFilters.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.filter;
      templateFilters.querySelectorAll("[data-filter]").forEach((b) => {
        b.classList.toggle("studio-filter-chip--active", b.dataset.filter === activeFilter);
        b.setAttribute("aria-selected", b.dataset.filter === activeFilter ? "true" : "false");
      });
      applyTemplateFilters();
    });
  });
}

async function renderTemplateList(templates) {
  if (!templateList) return;
  templateList.innerHTML = "";

  for (const t of templates) {
    const meta = t.engine === "studio" ? await loadTemplateMeta(t.id) : null;
    const themes = meta ? themeLinks(t.id, meta) : "";
    templateList.appendChild(templateCard(t, meta, themes));
  }

  applyTemplateFilters();
}

const playables = playablesIndex.playables ?? [];
for (const p of playables) {
  playableList.appendChild(playableCard(p));
}
if (!playables.length) {
  playableEmpty.hidden = false;
  playableEmpty.textContent = "No playables yet. Create one with pnpm playable:new.";
}

renderTemplateFilters();
await renderTemplateList(registry.templates ?? []);

playableSearch?.addEventListener("input", () => filterGrid(playableList, playableSearch.value, playableEmpty));
templateSearch?.addEventListener("input", () => applyTemplateFilters());
