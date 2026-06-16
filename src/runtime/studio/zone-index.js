/**
 * Build editable zone index from scenario — for Studio inspector & AI prompt context.
 * Hierarchy: Playable → Screens → Zones
 */
import {
  estimateAutoAdvanceMs,
  estimateScreenViewMs,
  formatEstimatedViewTime,
} from "./screen-timing.js";
import {
  formatExportHint,
  formatFilesHint,
  formatLayoutShortChatPrompt,
  formatPlayableGuard,
  formatScope,
  formatScreenRef,
  formatTransitionShortChatPrompt,
  formatZoneRef,
  formatZoneShortChatPrompt,
} from "./chat-prompts.js";

export {
  formatLayoutShortChatPrompt,
  formatTransitionShortChatPrompt,
  formatZoneShortChatPrompt,
} from "./chat-prompts.js";

const ABSURD_CAP_MS = 30000;

/**
 * Resolve which files the inspector/agent should edit (template vs playable sandbox).
 * @param {object} playable
 * @param {{ previewKind?: 'template'|'playable' }} [opts]
 */
function resolveEditScope(playable, opts = {}) {
  const previewKind =
    opts.previewKind ?? (playable.id === "preview-template" ? "template" : "playable");
  const sourceTemplateId = playable.template?.id ?? null;

  if (previewKind === "template") {
    const templateId = sourceTemplateId || "unknown";
    return {
      previewKind: "template",
      editRoot: `data/templates/${templateId}`,
      contextFile: "context.preset.json",
      scenarioFile: "scenario.preset.json",
      assetsFile: "assets.preset.json",
      playableFile: "playable.preset.json",
      exportCmd: `pnpm template:export ${templateId}`,
      templateId,
      playableId: null,
      sourceTemplateId: null,
    };
  }

  return {
    previewKind: "playable",
    editRoot: `playables/${playable.id}`,
    contextFile: "context.json",
    scenarioFile: "scenario.json",
    assetsFile: "assets.json",
    playableFile: "playable.json",
    exportCmd: `pnpm playable:export ${playable.id}`,
    templateId: null,
    playableId: playable.id,
    /** Provenance only — changing template does not change this playable. */
    sourceTemplateId,
  };
}

function patchPathForElement(el, screenId, scope) {
  const cf = scope.contextFile;
  const sf = scope.scenarioFile;
  const af = scope.assetsFile;
  if (el.textKey) {
    return {
      context: `${cf} → ${el.textKey}`,
      scenarioElement: `${sf} → screens[id=${screenId}].elements[id=${el.id}]`,
      scenarioStep: `${sf} → screens[id=${screenId}].steps[target=${el.id}]`,
    };
  }
  if (el.type === "background") {
    return {
      context: el.textKey ? `${cf} → ${el.textKey} (gradient/CSS)` : `scenario element fill`,
      scenarioElement: `${sf} → screens[id=${screenId}].elements[id=${el.id}].fill`,
    };
  }
  if (el.assetId) {
    return {
      assets: `${af} → assets[id=${el.assetId}]`,
      scenarioElement: `${sf} → screens[id=${screenId}].elements[id=${el.id}]`,
    };
  }
  return {
    scenarioElement: `${sf} → screens[id=${screenId}].elements[id=${el.id}]`,
    scenarioStep: `${sf} → screens[id=${screenId}].steps[target=${el.id}]`,
  };
}

function screenNameById(scenario, id) {
  const s = scenario.screens?.find((x) => x.id === id);
  return s?.name || id;
}

function slugTransitionId(fromId, toId) {
  const strip = (id) => String(id).replace(/^screen_/, "");
  return `${strip(fromId)}-to-${strip(toId)}`;
}

function hasElementType(screen, type) {
  return (screen.elements ?? []).some((el) => el.type === type);
}

function buildTransition(screen, scenario, screenNumber, context = {}, scope) {
  const sf = scope?.scenarioFile ?? "scenario.json";
  const auto = screen.autoNext;
  const click = screen.clickNext;
  const lines = [];
  const patchPaths = {
    screen: `${sf} → screens[id=${screen.id}]`,
    durationMs: `${sf} → screens[id=${screen.id}].durationMs`,
  };

  const hasAuto = Boolean(auto?.enabled && auto.target);
  const hasTap = Boolean(click?.enabled && click.target);
  const hasTransition = hasAuto || hasTap;

  let transitionType = null;
  if (hasAuto && hasTap) transitionType = "auto-tap";
  else if (hasAuto) transitionType = "auto";
  else if (hasTap) transitionType = "tap";

  const targetId = hasAuto ? auto.target : hasTap ? click.target : null;
  const targetName = targetId ? screenNameById(scenario, targetId) : null;
  const transitionId = hasTransition ? slugTransitionId(screen.id, targetId) : null;
  const transitionLabel = hasTransition
    ? `${screen.name || screen.id} → ${targetName}`
    : null;

  const estimatedViewMs = estimateScreenViewMs(screen, context);
  const estimatedViewLabel = formatEstimatedViewTime(estimatedViewMs);
  const estimatedAutoMs = estimateAutoAdvanceMs(screen, context);

  if (estimatedViewMs != null) {
    lines.push(`View time (est.): ${estimatedViewLabel}`);
  } else if (hasElementType(screen, "quiz-options")) {
    lines.push("View time: tap / interactive");
  }

  if (hasAuto) {
    const ms = estimatedAutoMs ?? (auto.afterMs != null && auto.afterMs < ABSURD_CAP_MS ? auto.afterMs : 4000);
    lines.push(`Auto advance → "${targetName}" (${auto.target}) after ${formatEstimatedViewTime(ms)}`);
    patchPaths.autoNext = `${sf} → screens[id=${screen.id}].autoNext`;
  }

  if (hasTap) {
    const tapTargetName = screenNameById(scenario, click.target);
    lines.push(`Tap anywhere → "${tapTargetName}" (${click.target})`);
    patchPaths.clickNext = `${sf} → screens[id=${screen.id}].clickNext`;
  }

  const enterAnimation = screen.transition?.animation || "slide";
  const enterEasing = screen.transition?.easing || "ease";
  const enterDurationMs = screen.transition?.durationMs ?? null;
  if (hasTransition) {
    lines.push(`Enter animation: ${enterAnimation}`);
    lines.push(`Enter easing: ${enterEasing}`);
    if (enterDurationMs != null) lines.push(`Enter duration: ${enterDurationMs}ms`);
    patchPaths.transitionAnimation = `${sf} → screens[id=${screen.id}].transition.animation`;
    patchPaths.transitionEasing = `${sf} → screens[id=${screen.id}].transition.easing`;
    patchPaths.transitionDurationMs = `${sf} → screens[id=${screen.id}].transition.durationMs`;
  }

  if (!hasTransition) {
    lines.push("No auto/tap transition (terminal or CTA screen)");
  }

  const promptSnippet = [
    transitionId ? `Transition "${transitionId}" [${transitionType}] (${transitionLabel})` : null,
    `Screen "${screen.name || screen.id}" (${screen.id})`,
    screen.type ? `Type: ${screen.type}` : null,
    ...lines,
    "",
    "Patch transitions:",
    `  durationMs → screens[id=${screen.id}].durationMs`,
    hasAuto ? `  autoNext.afterMs → screens[id=${screen.id}].autoNext.afterMs` : null,
    hasAuto ? `  autoNext.target → screens[id=${screen.id}].autoNext.target` : null,
    hasTap ? `  clickNext.target → screens[id=${screen.id}].clickNext.target` : null,
    hasTransition ? `  transition.animation → screens[id=${screen.id}].transition.animation (slide|fade|fade-up|fade-out|pop-in)` : null,
    hasTransition ? `  transition.easing → screens[id=${screen.id}].transition.easing (ease|ease-in|ease-out|ease-in-out|linear)` : null,
    hasTransition ? `  transition.durationMs → screens[id=${screen.id}].transition.durationMs` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    transitionId,
    transitionLabel,
    transitionType,
    fromScreenId: screen.id,
    fromScreenNumber: screenNumber,
    toScreenId: targetId,
    toScreenName: targetName,
    hasTransition,
    durationMs: screen.durationMs ?? null,
    estimatedViewMs,
    estimatedViewLabel,
    autoNext: hasAuto
      ? {
          afterMs: auto.afterMs ?? screen.durationMs ?? 4000,
          viewAfterMs: estimatedAutoMs,
          viewAfterLabel: formatEstimatedViewTime(estimatedAutoMs),
          target: auto.target,
          targetName: screenNameById(scenario, auto.target),
        }
      : null,
    clickNext: hasTap
      ? { target: click.target, targetName: screenNameById(scenario, click.target) }
      : null,
    enterAnimation: hasTransition ? enterAnimation : null,
    enterEasing: hasTransition ? enterEasing : null,
    enterDurationMs: hasTransition ? enterDurationMs : null,
    lines,
    patchPaths,
    promptSnippet,
  };
}

function buildPromptSnippet(screenZoneNum, globalZoneNum, el, screen, steps, context) {
  const lines = [
    `Screen ${screen.screenNumber} zone ${screenZoneNum} "${el.id}" (${screen.name || screen.id})`,
    `Element type: ${el.type}`,
  ];
  if (el.textKey) lines.push(`Copy slot: context.${el.textKey} = "${context[el.textKey] ?? ""}"`);
  if (el.assetId) lines.push(`Asset: ${el.assetId}`);
  if (el.fill?.type) lines.push(`Background fill: ${el.fill.type}`);
  if (steps.length) {
    lines.push("Timeline:");
    for (const s of steps) {
      lines.push(
        `  - ${s.atMs}ms: ${s.action}${s.animation ? ` (${s.animation})` : ""}${s.value ? ` "${s.value}"` : ""}`,
      );
    }
  }
  return lines.join("\n");
}

function formatLabel(id) {
  return String(id)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * @param {object} scenario
 * @param {object} context
 * @param {object} [playable]
 */
export function buildZoneIndex(scenario, context = {}, playable = {}, opts = {}) {
  const scope = resolveEditScope(playable, opts);
  const pf = scope.playableFile;
  const zones = [];
  const screens = [];
  let zoneNum = 0;
  let screenNum = 0;

  for (const screen of scenario.screens ?? []) {
    screenNum += 1;
    const screenZones = [];
    let screenZoneNum = 0;

    for (const el of screen.elements ?? []) {
      zoneNum += 1;
      screenZoneNum += 1;
      const steps = (screen.steps ?? []).filter((s) => s.target === el.id);
      const text =
        el.text ??
        (el.textKey && context[el.textKey] != null ? String(context[el.textKey]) : "");

      const zone = {
        zoneNumber: zoneNum,
        screenZoneNumber: screenZoneNum,
        zoneId: el.id,
        screenId: screen.id,
        screenNumber: screenNum,
        screenName: screen.name || screen.id,
        screenType: screen.type,
        label: formatLabel(el.id),
        elementType: el.type,
        textKey: el.textKey || null,
        text: text.slice(0, 120),
        hidden: Boolean(el.hidden),
        variant: el.variant || null,
        steps: steps.map((s) => ({
          stepId: s.id,
          action: s.action,
          atMs: s.atMs,
          animation: s.animation || null,
          speed: s.speed ?? null,
          value: s.value ? String(s.value).slice(0, 80) : null,
        })),
        assetId: el.assetId || null,
        patchPaths: patchPathForElement(el, screen.id, scope),
        promptSnippet: buildPromptSnippet(
          screenZoneNum,
          zoneNum,
          el,
          { ...screen, screenNumber: screenNum },
          steps,
          context,
        ),
      };
      zones.push(zone);
      screenZones.push(zone);
    }

    const transition = buildTransition(screen, scenario, screenNum, context, scope);
    screens.push({
      screenNumber: screenNum,
      screenId: screen.id,
      name: screen.name || screen.id,
      type: screen.type || null,
      isEntry: screen.id === scenario.entryScreen,
      zoneCount: screenZones.length,
      zones: screenZones,
      transition,
    });
  }

  const layout = playable.layout ?? {};
  const layoutDefaults = {
    insetX: layout.insetX ?? 20,
    insetY: layout.insetY ?? 20,
    insetBottom: layout.insetBottom ?? 24,
    gap: layout.gap ?? 14,
  };

  return {
    playableId: playable.id,
    templateId: playable.template?.id,
    themeId: playable.themeId,
    entryScreen: scenario.entryScreen,
    screenCount: screens.length,
    zoneCount: zones.length,
    layout: layoutDefaults,
    layoutPromptSnippet: [
      `Layout padding (${pf} → layout):`,
      `  insetX: ${layoutDefaults.insetX}  (horizontal content padding)`,
      `  insetY: ${layoutDefaults.insetY}  (top padding)`,
      `  insetBottom: ${layoutDefaults.insetBottom}  (bottom padding)`,
      `  gap: ${layoutDefaults.gap}  (vertical gap between zones)`,
    ].join("\n"),
    ...scope,
    screens,
    zones,
  };
}

export function zonesForScreen(zoneIndex, screenId) {
  return (zoneIndex?.zones ?? []).filter((z) => z.screenId === screenId);
}

export function screenById(zoneIndex, screenId) {
  return (zoneIndex?.screens ?? []).find((s) => s.screenId === screenId) ?? null;
}

/**
 * @param {object} zoneIndex
 * @param {{ selectedScreenId?: string, selectedZoneId?: string, activeScreenId?: string }} selection
 */
export function formatZoneIndexForAI(zoneIndex, selection = {}) {
  const { selectedScreenId, selectedZoneId, activeScreenId } =
    typeof selection === "string"
      ? { selectedZoneId: selection }
      : selection;

  const header = `# Playable authoring context
Scope: ${formatScope(zoneIndex)}
Files: ${zoneIndex.editRoot}/
${zoneIndex.sourceTemplateId ? `Source template (read-only): ${zoneIndex.sourceTemplateId}` : ""}
Theme: ${zoneIndex.themeId || "—"}
Screens: ${zoneIndex.screenCount ?? 0} · Zones: ${zoneIndex.zoneCount ?? 0}
Flow: ${(zoneIndex.screens ?? []).map((s) => `${s.screenNumber}.${s.name}`).join(" → ")}
Layout: insetX=${zoneIndex.layout?.insetX ?? 20} insetY=${zoneIndex.layout?.insetY ?? 20} bottom=${zoneIndex.layout?.insetBottom ?? 24} gap=${zoneIndex.layout?.gap ?? 14}
${formatExportHint(zoneIndex)}
`;

  if (selectedZoneId) {
    const z = zoneIndex.zones.find((x) => x.zoneId === selectedZoneId);
    if (z) {
      const scr = screenById(zoneIndex, z.screenId);
      return `${header}\n## Selected zone\n\`\`\`\n${z.promptSnippet}\n\`\`\`\n\n## Parent screen transitions\n\`\`\`\n${scr?.transition?.promptSnippet ?? ""}\n\`\`\`\n\nPatch paths:\n${JSON.stringify(z.patchPaths, null, 2)}`;
    }
  }

  if (selectedScreenId) {
    const scr = screenById(zoneIndex, selectedScreenId);
    if (scr) {
      const zoneBlock = scr.zones
        .map((z) => `  - Zone ${z.screenZoneNumber}: ${z.zoneId} (${z.elementType})`)
        .join("\n");
      return `${header}\n## Selected screen ${scr.screenNumber}: ${scr.name}\n\`\`\`\n${scr.transition.promptSnippet}\n\`\`\`\n\nZones on this screen:\n${zoneBlock}\n\nPatch paths:\n${JSON.stringify(scr.transition.patchPaths, null, 2)}`;
    }
  }

  const screenBlocks = (zoneIndex.screens ?? [])
    .map((s) => {
      const trans = s.transition.lines.join("; ") || "—";
      return `### Screen ${s.screenNumber}: ${s.name} (\`${s.screenId}\`)${s.isEntry ? " ★ entry" : ""}
Transition: ${trans}
Zones: ${s.zones.map((z) => `${z.screenZoneNumber}.${z.zoneId}`).join(", ")}`;
    })
    .join("\n\n");

  const activeNote = activeScreenId
    ? `\n(Preview showing: ${activeScreenId})\n`
    : "";

  return `${header}${activeNote}\n${screenBlocks}`;
}

/**
 * Chat-ready prompt for zone/screen editing (used by "Add to chat" in inspector).
 * @param {object} zoneIndex
 * @param {{ selectedScreenId?: string, selectedZoneId?: string, activeScreenId?: string }} selection
 */
export function formatZoneChatPrompt(zoneIndex, selection = {}) {
  const { selectedZoneId, selectedScreenId, activeScreenId } =
    typeof selection === "string" ? { selectedZoneId: selection } : selection;

  const ctx = formatZoneIndexForAI(zoneIndex, {
    selectedZoneId,
    selectedScreenId: selectedZoneId ? undefined : selectedScreenId,
    activeScreenId,
  });

  if (selectedZoneId) {
    const z = zoneIndex.zones.find((x) => x.zoneId === selectedZoneId);
    if (z) {
      const screen = screenById(zoneIndex, z.screenId);
      return [
        `Edit ${formatScope(zoneIndex)} — ${formatScreenRef(screen ?? { screenNumber: z.screenNumber, name: z.screenName, screenId: z.screenId })} — ${formatZoneRef(z)}.`,
        `Element: ${z.elementType}${z.textKey ? ` · copy context.${z.textKey}` : ""}${z.assetId ? ` · asset ${z.assetId}` : ""}.`,
        formatFilesHint(zoneIndex),
        formatPlayableGuard(zoneIndex),
        formatExportHint(zoneIndex),
        "",
        ctx,
      ]
        .filter(Boolean)
        .join("\n");
    }
  }

  if (selectedScreenId) {
    const scr = screenById(zoneIndex, selectedScreenId);
    if (scr) {
      return [
        `Edit ${formatScope(zoneIndex)} — ${formatScreenRef(scr)}.`,
        formatFilesHint(zoneIndex),
        formatPlayableGuard(zoneIndex),
        formatExportHint(zoneIndex),
        "",
        ctx,
      ]
        .filter(Boolean)
        .join("\n");
    }
  }

  return [
    `Edit ${formatScope(zoneIndex)} (all screens).`,
    formatFilesHint(zoneIndex),
    formatPlayableGuard(zoneIndex),
    formatExportHint(zoneIndex),
    "",
    ctx,
  ]
    .filter(Boolean)
    .join("\n");
}
