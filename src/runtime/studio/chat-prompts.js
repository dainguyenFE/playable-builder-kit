/**
 * Scoped AI chat prompts — always name template/playable · screen · zone.
 */

/** @param {object} zoneIndex */
export function formatScope(zoneIndex) {
  if (!zoneIndex) return "playable/template";
  if (zoneIndex.previewKind === "template") {
    return `template "${zoneIndex.templateId}"`;
  }
  if (zoneIndex.sourceTemplateId) {
    return `playable "${zoneIndex.playableId}" (from template "${zoneIndex.sourceTemplateId}")`;
  }
  return `playable "${zoneIndex.playableId}"`;
}

/**
 * @param {{ screenNumber: number, name?: string, screenId: string }} screen
 */
export function formatScreenRef(screen) {
  if (!screen) return "screen";
  const name = screen.name || screen.screenId;
  return `screen ${screen.screenNumber} "${name}" (${screen.screenId})`;
}

/**
 * @param {{ screenZoneNumber: number, zoneId: string, label?: string }} zone
 */
export function formatZoneRef(zone) {
  if (!zone) return "zone";
  const label = zone.label || zone.zoneId;
  return `zone ${zone.screenZoneNumber} "${label}" (${zone.zoneId})`;
}

/** @param {object} zoneIndex */
export function formatFilesHint(zoneIndex) {
  if (!zoneIndex?.editRoot) return "";
  return `Patch only: ${zoneIndex.editRoot}/${zoneIndex.contextFile}, ${zoneIndex.scenarioFile}, ${zoneIndex.assetsFile}`;
}

/** @param {object} zoneIndex */
export function formatExportHint(zoneIndex) {
  return zoneIndex?.exportCmd ? `After edits: ${zoneIndex.exportCmd}` : "";
}

/** @param {object} zoneIndex */
export function formatPlayableGuard(zoneIndex) {
  if (zoneIndex?.previewKind !== "playable" || !zoneIndex.sourceTemplateId) return "";
  return `Do NOT edit data/templates/${zoneIndex.sourceTemplateId}/ — this playable is a separate copy.`;
}

/**
 * Inspector: per-zone "Add to chat".
 * @param {object} zoneIndex
 * @param {object} zone
 */
export function formatZoneShortChatPrompt(zoneIndex, zone) {
  if (!zoneIndex || !zone) return "";
  const screen = {
    screenNumber: zone.screenNumber,
    name: zone.screenName,
    screenId: zone.screenId,
  };
  const elementBits = [
    zone.elementType,
    zone.textKey ? `copy context.${zone.textKey}` : null,
    zone.assetId ? `asset ${zone.assetId}` : null,
  ].filter(Boolean);

  return [
    `Edit ${formatScope(zoneIndex)} — ${formatScreenRef(screen)} — ${formatZoneRef(zone)}.`,
    elementBits.length ? `Element: ${elementBits.join(" · ")}.` : null,
    formatFilesHint(zoneIndex),
    formatPlayableGuard(zoneIndex),
    formatExportHint(zoneIndex),
    "",
    zone.promptSnippet,
  ]
    .filter((line) => line !== null && line !== "")
    .join("\n");
}

/**
 * Inspector: transition "Add to chat".
 * @param {object} zoneIndex
 * @param {object} screen
 */
export function formatTransitionShortChatPrompt(zoneIndex, screen) {
  const t = screen?.transition;
  if (!zoneIndex || !t?.hasTransition || !t.transitionId) return "";

  const anim = t.enterAnimation || "slide";
  const easing = t.enterEasing || "ease";
  const dur = t.enterDurationMs != null ? `, ${t.enterDurationMs}ms` : "";

  return [
    `Edit ${formatScope(zoneIndex)} — ${formatScreenRef(screen)} — transition "${t.transitionId}" (${t.transitionType || "flow"}).`,
    t.transitionLabel ? `Flow: ${t.transitionLabel}.` : null,
    t.autoNext
      ? `Auto → "${t.autoNext.targetName}" (${t.autoNext.target}) after ${t.autoNext.viewAfterLabel ?? `${t.autoNext.afterMs}ms`}.`
      : null,
    t.clickNext ? `Tap → "${t.clickNext.targetName}" (${t.clickNext.target}).` : null,
    `Enter animation: ${anim}, easing ${easing}${dur}.`,
    `Patch: ${zoneIndex.editRoot}/${zoneIndex.scenarioFile} → screens[id=${screen.screenId}]`,
    formatExportHint(zoneIndex),
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Inspector: layout padding "Add to chat".
 * @param {object} zoneIndex
 * @param {object} screen
 */
export function formatLayoutShortChatPrompt(zoneIndex, screen) {
  if (!zoneIndex || !screen) return "";
  const l = zoneIndex.layout ?? {};
  const insetX = l.insetX ?? 20;
  const insetY = l.insetY ?? 20;
  const insetBottom = l.insetBottom ?? 24;
  const gap = l.gap ?? 14;

  return [
    `Edit ${formatScope(zoneIndex)} — layout padding (previewing ${formatScreenRef(screen)}).`,
    `Layout applies to all screens in this ${zoneIndex.previewKind}.`,
    `Patch ${zoneIndex.editRoot}/${zoneIndex.playableFile} → layout`,
    "",
    "Current:",
    `- insetX: ${insetX} (horizontal content padding)`,
    `- insetY: ${insetY} (top padding)`,
    `- insetBottom: ${insetBottom} (bottom padding)`,
    `- gap: ${gap} (vertical gap between zones)`,
    formatPlayableGuard(zoneIndex),
    formatExportHint(zoneIndex),
  ]
    .filter(Boolean)
    .join("\n");
}
