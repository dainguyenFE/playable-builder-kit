/**
 * Studio theme tokens → CSS variables on .pb-studio__app
 */

const THEME_KEYS = [
  ["primaryColor", "--pb-accent"],
  ["backgroundColor", "--pb-bg"],
  ["textColor", "--pb-fg"],
  ["mutedColor", "--pb-muted"],
  ["cardColor", "--pb-card"],
];

/**
 * @param {Record<string, object>} catalogThemes
 * @param {string} themeId
 */
export function getThemeTokens(catalogThemes, themeId) {
  const t = catalogThemes?.[themeId];
  if (!t) return null;
  return { id: themeId, name: t.name, ...t };
}

/**
 * Merge playable.theme with catalog theme id.
 * @param {object} playable
 * @param {Record<string, object>} catalogThemes
 * @param {string} [themeId]
 */
export function resolvePlayableTheme(playable, catalogThemes, themeId) {
  const id = themeId || playable.themeId || playable.theme?.id || playable.defaultTheme;
  const fromCatalog = id ? getThemeTokens(catalogThemes, id) : null;
  const base = playable.theme || {};
  if (!fromCatalog) return { ...base, id };
  return {
    ...fromCatalog,
    ...base,
    id: fromCatalog.id,
    name: base.name || fromCatalog.name,
  };
}

/**
 * @param {HTMLElement} el
 * @param {object} theme
 */
export function applyStudioTheme(el, theme = {}) {
  if (!el) return;
  for (const [jsonKey, cssVar] of THEME_KEYS) {
    if (theme[jsonKey]) el.style.setProperty(cssVar, theme[jsonKey]);
  }
  if (theme.id) el.dataset.theme = theme.id;
}

/**
 * @param {object} catalog - full themes.json
 * @param {string[]} allowedIds
 */
export function listThemesForTemplate(catalog, allowedIds = []) {
  const themes = catalog?.themes ?? {};
  return allowedIds
    .map((id) => ({ id, ...themes[id] }))
    .filter((t) => t.name);
}
