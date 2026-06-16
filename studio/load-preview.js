import { bootPlayableStudio } from "/src/runtime/studio/bootstrap.js";
import { createPlayableEngine } from "/src/runtime/engine.js";
import { resolvePlayableTheme } from "/src/runtime/studio/theme.js";
import { hydrateAssetsBundle } from "/src/runtime/studio/assets-hydrate.js";

const COMPOSE_ROUTE_CLASS = "route-template-preview";

/** Scoped preview load/parse failure — handled in preview frame only. */
export class PreviewDataError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "PreviewDataError";
    this.details = details;
  }
}

let registry;
let themesCatalog;

async function safeFetchJson(url, label) {
  let res;
  try {
    res = await fetch(url);
  } catch (e) {
    throw new PreviewDataError(`Network error loading ${label}: ${e.message}`, { file: label, url });
  }
  if (!res.ok) {
    throw new PreviewDataError(`Missing or unreadable ${label} (HTTP ${res.status})`, { file: label, url });
  }
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new PreviewDataError(`Invalid JSON in ${label}: ${e.message}`, { file: label, url });
  }
}

async function loadCatalogs() {
  if (registry && themesCatalog) return;
  [registry, themesCatalog] = await Promise.all([
    fetch("/data/registry/playables.json").then((r) => r.json()),
    fetch("/data/studio/themes.json").then((r) => r.json()),
  ]);
}

export function themeFromUrl() {
  return new URLSearchParams(window.location.search).get("theme");
}

function findTemplate(id) {
  return (registry.templates ?? []).find((t) => t.id === id);
}

function findPlayable(id) {
  return (registry.playables ?? []).find((p) => p.id === id);
}

async function loadTemplateMeta(templateId) {
  const res = await fetch(`/template-data/studio/${templateId}/template.json`);
  if (!res.ok) return { id: templateId, themes: [] };
  return res.json();
}

function applyThemeToPlayable(playable, templateMeta, themeId) {
  const resolved = resolvePlayableTheme(
    { ...playable, defaultTheme: templateMeta.defaultTheme },
    themesCatalog.themes,
    themeId || playable.themeId || templateMeta.defaultTheme,
  );
  playable.theme = resolved;
  playable.themeId = resolved.id;
  return playable;
}

export function getThemeOptions(preview) {
  if (preview.engine === "compose") return [];
  const meta = preview.templateMeta ?? {};
  const allowed = meta.themes ?? [];
  const current = preview.bundle?.playable?.themeId || meta.defaultTheme;
  return allowed
    .map((id) => ({
      id,
      name: themesCatalog.themes[id]?.name ?? id,
      selected: id === current,
    }))
    .filter((t) => t.name);
}

async function loadStudioTemplate(templateId, themeId) {
  const base = `/template-data/studio/${templateId}`;
  const [playable, context, scenario, assets, templateMeta] = await Promise.all([
    safeFetchJson(`${base}/playable.preset.json`, "playable.preset.json"),
    safeFetchJson(`${base}/context.preset.json`, "context.preset.json"),
    safeFetchJson(`${base}/scenario.preset.json`, "scenario.preset.json"),
    safeFetchJson(`${base}/assets.preset.json`, "assets.preset.json").catch(() => ({ assets: [] })),
    loadTemplateMeta(templateId),
  ]);
  applyThemeToPlayable(playable, templateMeta, themeId ?? themeFromUrl());
  const hydratedAssets = await hydrateAssetsBundle(assets);
  return {
    engine: "studio",
    bundle: { playable, context, scenario, assets: hydratedAssets },
    templateMeta,
    templateId,
  };
}

async function loadComposeTemplate(templateId) {
  const base = `/template-data/compose/${templateId}`;
  const [composition, copy] = await Promise.all([
    safeFetchJson(`${base}/composition.default.json`, "composition.default.json"),
    safeFetchJson(`${base}/copy/en.sample.json`, "copy/en.sample.json"),
  ]);
  return { engine: "compose", composition, copy };
}

async function loadStudioPlayable(playableId, themeId) {
  const base = `/playables-data/${playableId}`;
  const [playable, context, scenario, assets, manifest] = await Promise.all([
    safeFetchJson(`${base}/playable.json`, "playable.json"),
    safeFetchJson(`${base}/context.json`, "context.json"),
    safeFetchJson(`${base}/scenario.json`, "scenario.json"),
    safeFetchJson(`${base}/assets.json`, "assets.json").catch(() => ({ assets: [] })),
    safeFetchJson(`${base}/manifest.json`, "manifest.json").catch(() => ({})),
  ]);
  const templateId = playable.template?.id || manifest.templateId;
  const templateMeta = templateId ? await loadTemplateMeta(templateId) : { defaultTheme: playable.themeId, themes: playable.themeId ? [playable.themeId] : [] };
  const themeMeta = {
    defaultTheme: manifest.defaultTheme || manifest.themeId || playable.themeId || templateMeta.defaultTheme,
    themes: manifest.themes?.length ? manifest.themes : templateMeta.themes,
  };
  applyThemeToPlayable(playable, themeMeta, themeId ?? themeFromUrl());
  const hydratedAssets = await hydrateAssetsBundle(assets);
  return {
    engine: "studio",
    bundle: { playable, context, scenario, assets: hydratedAssets },
    templateMeta,
    templateId,
  };
}

async function loadComposePlayable(playableId) {
  const base = `/playables-data/${playableId}`;
  const [composition, copy] = await Promise.all([
    safeFetchJson(`${base}/composition.json`, "composition.json"),
    safeFetchJson(`${base}/copy.json`, "copy.json"),
  ]);
  return { engine: "compose", composition, copy };
}

export async function resolvePreview(overrideThemeId) {
  await loadCatalogs();
  const templateMatch = window.location.pathname.match(/\/preview\/template\/([a-z0-9-]+)/);
  const playableMatch = window.location.pathname.match(/^\/preview\/([a-z0-9-]+)$/);
  const themeId = overrideThemeId ?? themeFromUrl();

  if (templateMatch) {
    const templateId = templateMatch[1];
    const meta = findTemplate(templateId);
    if (!meta) throw new Error(`Unknown template: ${templateId}`);
    const engine = meta.engine || "studio";
    if (engine === "compose") {
      return {
        kind: "template",
        id: templateId,
        engine: "compose",
        label: `Template: ${meta.name}`,
        ...(await loadComposeTemplate(templateId)),
      };
    }
    const data = await loadStudioTemplate(templateId, themeId);
    const themeName = data.bundle.playable.theme?.name || data.bundle.playable.themeId;
    return {
      kind: "template",
      id: templateId,
      engine: "studio",
      label: `Template: ${meta.name}${themeName ? ` · ${themeName}` : ""}`,
      ...data,
    };
  }

  if (playableMatch) {
    const playableId = playableMatch[1];
    const meta = findPlayable(playableId);
    const engine = meta?.engine || "studio";

    if (engine === "compose") {
      return {
        kind: "playable",
        id: playableId,
        engine: "compose",
        label: meta?.name || playableId,
        ...(await loadComposePlayable(playableId)),
      };
    }

    const data = await loadStudioPlayable(playableId, themeId);
    const themeName = data.bundle.playable.theme?.name;
    return {
      kind: "playable",
      id: playableId,
      engine: "studio",
      label: `${meta?.name || playableId}${themeName ? ` · ${themeName}` : ""}`,
      ...data,
    };
  }

  throw new Error("Use /preview/<playable> or /preview/template/<template-id>");
}

function mountCompose(preview, root) {
  root.innerHTML = "";
  root.className = `${COMPOSE_ROUTE_CLASS}__app`;
  createPlayableEngine({
    root,
    composition: preview.composition,
    copy: preview.copy,
    routeClass: COMPOSE_ROUTE_CLASS,
  });
}

export function mountPreview(preview, root) {
  if (preview.engine === "compose") {
    mountCompose(preview, root);
    return { restart: () => mountCompose(preview, root) };
  }

  return bootPlayableStudio({
    root,
    bundle: preview.bundle,
    mode: "preview",
    previewKind: preview.kind === "template" ? "template" : "playable",
  });
}
