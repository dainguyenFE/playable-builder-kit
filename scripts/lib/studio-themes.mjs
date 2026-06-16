import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { ROOT } from "./paths.mjs";

const CATALOG_PATH = resolve(ROOT, "data/studio/themes.json");

export function loadThemesCatalog() {
  return JSON.parse(readFileSync(CATALOG_PATH, "utf8"));
}

/**
 * @param {object} catalog
 * @param {object} templateMeta - template.json
 * @param {string} [themeId]
 */
export function resolveThemeForTemplate(catalog, templateMeta, themeId) {
  const allowed = templateMeta.themes ?? Object.keys(catalog.themes ?? {});
  const id = themeId || templateMeta.defaultTheme || allowed[0];
  if (!allowed.includes(id)) {
    throw new Error(
      `Theme "${id}" not allowed for template "${templateMeta.id}". Use: ${allowed.join(", ")}`,
    );
  }
  const t = catalog.themes[id];
  if (!t) throw new Error(`Unknown theme: ${id}`);
  return { id, ...t };
}

export function listTemplateThemes(catalog, templateMeta) {
  const allowed = templateMeta.themes ?? [];
  return allowed.map((id) => ({ id, ...catalog.themes[id] })).filter((t) => t.name);
}
