/** Reusable screen builders — V3 screen contract (docs/AI_PLAYABLE_USER_CASE_SCENARIOS_V3_SCREEN_DETAIL.md). */
import { ctaBottom, ctaCenter, ctaOverlay } from "./cta-presets.mjs";
import { splitBenefitBlock, splitBenefitItemZones } from "./zone-split.mjs";

export const BG = { id: "bg", type: "background", textKey: "backgroundGradient" };

/** V3 default: autoNext 3–4s + clickNext on non-final screens. */
export function nav(fromMs = 3500, to, anim = "fade-up") {
  return {
    autoNext: { enabled: true, afterMs: fromMs, target: to },
    clickNext: { enabled: true, target: to },
    transition: { animation: anim, easing: "ease-out", durationMs: 420 },
  };
}

export function hookScreen({ headlineKey, subheadKey, badge, heroAssetId, next, durationMs = 3500, anim = "fade-up" }) {
  const elements = [BG];
  const steps = [{ id: "bg", atMs: 0, action: "show", target: "bg", animation: "fade-in" }];
  if (badge) elements.push({ id: "header", type: "app-header", badge });
  if (heroAssetId) {
    elements.push({ id: "hero", type: "hero-image", assetId: heroAssetId, hidden: true });
    steps.push({ id: "hero", atMs: 200, action: "show", target: "hero", animation: "pop-in" });
  }
  elements.push({ id: "hl", type: "headline-block", textKey: headlineKey, hidden: true });
  steps.push({ id: "hl", atMs: heroAssetId ? 500 : 300, action: "show", target: "hl", animation: "fade-up" });
  if (subheadKey) {
    elements.push({ id: "sub", type: "subheadline-block", textKey: subheadKey, hidden: true });
    steps.push({ id: "sub", atMs: heroAssetId ? 900 : 700, action: "show", target: "sub", animation: "fade-in" });
  }
  return { id: "s1", name: "Hook", type: "problem", durationMs, elements, steps, ...nav(durationMs, next, anim) };
}

/** V3 UC01-1A Screen 1 — sticky notes problem hook. */
export function stickyNotesHookScreen({
  headlineKey,
  subheadKey,
  stickyKeys,
  hintKey,
  badge = "AI Chat",
  next,
  durationMs = 3500,
}) {
  const elements = [BG, { id: "header", type: "app-header", badge }];
  const steps = [{ id: "bg", atMs: 0, action: "show", target: "bg", animation: "fade-in" }];
  elements.push({ id: "hl", type: "headline-block", textKey: headlineKey, hidden: true });
  steps.push({ id: "hl", atMs: 300, action: "show", target: "hl", animation: "fade-up" });
  if (subheadKey) {
    elements.push({ id: "sub", type: "subheadline-block", textKey: subheadKey, hidden: true });
    steps.push({ id: "sub", atMs: 600, action: "show", target: "sub", animation: "fade-in" });
  }
  const notes = splitBenefitItemZones(stickyKeys, { idPrefix: "note", startMs: 900, hidden: true, animation: "fade-up" });
  elements.push(...notes.elements);
  steps.push(...notes.steps);
  if (hintKey) {
    elements.push({ id: "hint", type: "free-badge", textKey: hintKey, hidden: true });
    steps.push({ id: "hint", atMs: notes.lastAtMs + 200, action: "show", target: "hint", animation: "pop-in" });
  }
  return { id: "s1", name: "Problem hook", type: "problem", durationMs, elements, steps, ...nav(durationMs, next, "fade-up") };
}

/** V3 input screen — typed prompt + quick suggestion chips. */
export function promptWithChipsScreen({
  id = "s2",
  label = "Ask AI",
  promptText,
  chipKeys = [],
  microcopyKey,
  next,
  durationMs = 4000,
  badge,
}) {
  const elements = [BG];
  if (badge) elements.push({ id: "header", type: "app-header", badge });
  elements.push({ id: "prompt", type: "prompt-input", label });
  const steps = [
    { id: "t", atMs: 400, action: "typeText", target: "prompt", value: promptText },
  ];
  if (chipKeys.length) {
    const chips = splitBenefitItemZones(chipKeys, { idPrefix: "chip", startMs: 1800, hidden: true, animation: "fade-up" });
    elements.push(...chips.elements);
    steps.push(...chips.steps);
  }
  if (microcopyKey) elements.push({ id: "micro", type: "subheadline-block", textKey: microcopyKey, hidden: true });
  if (microcopyKey) steps.push({ id: "micro", atMs: 2200, action: "show", target: "micro", animation: "fade-in" });
  return {
    id,
    name: "User input",
    type: "demo",
    durationMs,
    transition: { animation: "slide" },
    elements,
    steps,
    ...nav(durationMs, next, "slide"),
  };
}

export function promptScreen({ id = "s1", label, promptText, next, durationMs = 3500, lotte, badge }) {
  const elements = [BG];
  if (badge) elements.push({ id: "header", type: "app-header", badge });
  if (lotte) elements.push({ id: "lot", type: "lottie", assetId: lotte });
  elements.push({ id: "prompt", type: "prompt-input", label });
  return {
    id,
    name: "Input",
    type: "demo",
    durationMs,
    transition: { animation: "slide" },
    elements,
    steps: [{ id: "t", atMs: 400, action: "typeText", target: "prompt", value: promptText }],
    autoNext: { enabled: true, afterMs: durationMs - 500, target: next },
    clickNext: { enabled: true, target: next },
  };
}

export function streamScreen({ id = "s-stream", name = "AI stream", questionKey = "userQuestion", next = "screen_cta", afterStreamMs = 1800 }) {
  return {
    id,
    name,
    type: "demo",
    durationMs: 120000,
    transition: { animation: "fade" },
    elements: [BG, { id: "resp", type: "ai-model-response", variant: "demo", textKey: questionKey }],
    steps: [],
    autoNext: { enabled: true, afterStreamMs, target: next },
    clickNext: { enabled: true, target: next },
  };
}

/** V3 value summary — result cards before final CTA. */
export function valueSummaryScreen({
  id = "s3",
  headlineKey,
  subheadKey,
  keys = ["summary1", "summary2", "summary3"],
  next = "screen_cta",
  durationMs = 3500,
}) {
  const elements = [BG, { id: "hl", type: "headline-block", textKey: headlineKey, hidden: true }];
  const steps = [
    { id: "bg", atMs: 0, action: "show", target: "bg", animation: "fade-in" },
    { id: "hl", atMs: 200, action: "show", target: "hl", animation: "fade-up" },
  ];
  if (subheadKey) {
    elements.push({ id: "sub", type: "subheadline-block", textKey: subheadKey, hidden: true });
    steps.push({ id: "sub", atMs: 500, action: "show", target: "sub", animation: "fade-in" });
  }
  const summary = splitBenefitItemZones(keys, {
    idPrefix: "sum",
    startMs: subheadKey ? 800 : 600,
    hidden: true,
    animation: "fade-up",
  });
  elements.push(...summary.elements);
  steps.push(...summary.steps);
  return { id, name: "Summary", type: "demo", durationMs, elements, steps, ...nav(durationMs, next, "fade-up") };
}

/** V3 AI processing — loading between input and results. */
export function aiProcessingScreen({
  id = "s2",
  name = "Processing",
  next,
  durationMs = 3500,
  badge,
  promptText,
  promptLabel = "Input",
}) {
  const elements = [BG];
  if (badge) elements.push({ id: "header", type: "app-header", badge });
  if (promptText) elements.push({ id: "prompt", type: "prompt-input", label: promptLabel, hidden: true });
  elements.push({ id: "load", type: "ai-loading-card", hidden: true });
  const steps = [{ id: "bg", atMs: 0, action: "show", target: "bg", animation: "fade-in" }];
  if (promptText) {
    steps.push({ id: "p", atMs: 200, action: "show", target: "prompt" });
    steps.push({ id: "t", atMs: 400, action: "typeText", target: "prompt", value: promptText });
  }
  steps.push({ id: "l", atMs: promptText ? 1200 : 300, action: "show", target: "load", animation: "fade-in" });
  return { id, name, type: "demo", durationMs, transition: { animation: "slide" }, elements, steps, ...nav(durationMs, next) };
}

/** V3 stacked result cards — captions, storyboard, etc. */
export function resultCardsScreen({
  id = "s3",
  name = "Results",
  headlineKey,
  resultKeys = ["result1", "result2", "result3"],
  next = "screen_cta",
  durationMs = 4000,
}) {
  const elements = [
    BG,
    { id: "hl", type: "headline-block", textKey: headlineKey, hidden: true },
    ...resultKeys.map((k, i) => ({ id: `r${i + 1}`, type: "ai-result-card", textKey: k, hidden: true })),
  ];
  const steps = [
    { id: "bg", atMs: 0, action: "show", target: "bg", animation: "fade-in" },
    { id: "hl", atMs: 200, action: "show", target: "hl", animation: "fade-up" },
    ...resultKeys.map((_, i) => ({ id: `r${i}`, atMs: 600 + i * 700, action: "show", target: `r${i + 1}`, animation: "fade-up" })),
  ];
  return { id, name, type: "demo", durationMs, elements, steps, ...nav(durationMs, next, "fade-up") };
}

/** V3 image gallery teaser. */
export function imageGalleryScreen({
  id = "s3",
  assetId,
  headlineKey,
  styleKeys = ["style1", "style2", "style3", "style4"],
  next = "screen_cta",
  durationMs = 3500,
}) {
  const elements = [
    BG,
    { id: "hl", type: "headline-block", textKey: headlineKey, hidden: true },
    { id: "hero", type: "image-canvas", assetId, hidden: true },
  ];
  const styles = splitBenefitItemZones(styleKeys, { idPrefix: "style", startMs: 900, hidden: true, animation: "fade-up" });
  elements.push(...styles.elements);
  const steps = [
    { id: "bg", atMs: 0, action: "show", target: "bg", animation: "fade-in" },
    { id: "hl", atMs: 200, action: "show", target: "hl", animation: "fade-up" },
    { id: "hero", atMs: 500, action: "show", target: "hero", animation: "pop-in" },
    ...styles.steps,
  ];
  return { id, name: "Gallery", type: "demo", durationMs, elements, steps, ...nav(durationMs, next, "pop-in") };
}

export function agentOutputScreen({
  id = "s3",
  headlineKey,
  resultKeys = ["agentMon", "agentWed", "agentFri"],
  checklistKeys = ["agentKpi1", "agentKpi2", "agentKpi3"],
  next = "screen_cta",
  durationMs = 4000,
}) {
  const elements = [
    BG,
    { id: "hl", type: "headline-block", textKey: headlineKey, hidden: true },
    ...resultKeys.map((k, i) => ({ id: `r${i + 1}`, type: "ai-result-card", textKey: k, hidden: true })),
  ];
  const kpi = splitBenefitItemZones(checklistKeys, {
    idPrefix: "kpi",
    startMs: 500 + resultKeys.length * 600 + 200,
    hidden: true,
  });
  elements.push(...kpi.elements);
  const steps = [
    { id: "bg", atMs: 0, action: "show", target: "bg", animation: "fade-in" },
    { id: "hl", atMs: 200, action: "show", target: "hl", animation: "fade-up" },
    ...resultKeys.map((_, i) => ({ id: `r${i}`, atMs: 500 + i * 600, action: "show", target: `r${i + 1}`, animation: "fade-up" })),
    ...kpi.steps,
  ];
  return { id, name: "Agent output", type: "demo", durationMs, elements, steps, ...nav(durationMs, next) };
}

export function quizScreen({
  id = "s1",
  name = "Quiz",
  badge,
  questionKey = "quizQuestion",
  optionsKey = "quizOptions",
  next = "s2",
  durationMs = 3800,
}) {
  const elements = [BG];
  if (badge) elements.push({ id: "header", type: "app-header", badge });
  elements.push({ id: "quiz", type: "quiz-options", questionKey, optionsKey });
  return {
    id,
    name,
    type: "demo",
    durationMs: 120000,
    elements,
    steps: [{ id: "bg", atMs: 0, action: "show", target: "bg", animation: "fade-in" }],
    ...nav(durationMs, next, "fade-up"),
  };
}

export function captionDemoScreen({ id = "s2", promptText, resultKeys = ["result1", "result2", "result3"], next = "screen_cta", durationMs = 10000 }) {
  return {
    id,
    name: "Generate",
    type: "demo",
    durationMs,
    transition: { animation: "slide" },
    elements: [
      BG,
      { id: "prompt", type: "prompt-input", label: "Product" },
      { id: "load", type: "ai-loading-card", hidden: true },
      ...resultKeys.map((k, i) => ({ id: `r${i + 1}`, type: "ai-result-card", textKey: k, hidden: true })),
    ],
    steps: [
      { id: "t", atMs: 400, action: "typeText", target: "prompt", value: promptText },
      { id: "l", atMs: 2600, action: "show", target: "load" },
      { id: "h", atMs: 4000, action: "hide", target: "load" },
      ...resultKeys.map((_, i) => ({ id: `s${i}`, atMs: 4200 + i * 800, action: "show", target: `r${i + 1}`, animation: "fade-up" })),
    ],
    autoNext: { enabled: true, afterMs: durationMs - 500, target: next },
    clickNext: { enabled: true, target: next },
  };
}

export function beforeTextScreen({ id = "s1", textKey, next, durationMs = 3500, badge = "Rewrite" }) {
  return {
    id,
    name: "Before",
    type: "demo",
    durationMs,
    elements: [BG, { id: "header", type: "app-header", badge }, { id: "before", type: "ai-result-card", textKey, variant: "before" }],
    steps: [],
    ...nav(durationMs, next, "fade"),
  };
}

export function compareScreen({ id = "s2", next, durationMs = 5500 }) {
  return {
    id,
    name: "Compare",
    type: "demo",
    durationMs,
    transition: { animation: "pop-in" },
    elements: [BG, { id: "cmp", type: "image-compare", beforeAssetId: "img-before", afterAssetId: "img-after", hidden: true }],
    steps: [{ id: "a", atMs: 400, action: "show", target: "cmp", animation: "scale-in" }],
    ...nav(durationMs, next, "fade-up"),
  };
}

export function checkpointScreen({ id = "s3", keys = ["checkpoint1", "checkpoint2", "checkpoint3"], badgeKey, next, durationMs = 5000 }) {
  const elements = [BG];
  if (badgeKey) elements.push({ id: "badge", type: "free-badge", textKey: badgeKey, hidden: true });
  const checks = splitBenefitItemZones(keys, { idPrefix: "check", startMs: badgeKey ? 700 : 400, hidden: true, animation: "fade-up" });
  elements.push(...checks.elements);
  const steps = [{ id: "bg", atMs: 0, action: "show", target: "bg", animation: "fade-in" }];
  if (badgeKey) steps.push({ id: "b", atMs: 300, action: "show", target: "badge", animation: "pop-in" });
  steps.push(...checks.steps);
  return { id, name: "Checkpoint", type: "demo", durationMs, elements, steps, ...nav(durationMs, next, "fade-up") };
}

export function loadingRevealScreen({ id = "s2", assetId, next, durationMs = 4000, promptText, label = "Prompt" }) {
  return {
    id,
    name: "Generate",
    type: "demo",
    durationMs,
    transition: { animation: "slide" },
    elements: [
      BG,
      { id: "scan", type: "lottie", assetId: "lottie-ai-scan" },
      { id: "prompt", type: "prompt-input", label },
      { id: "load", type: "ai-loading-card", hidden: true },
      { id: "canvas", type: "image-canvas", assetId, hidden: true },
    ],
    steps: [
      { id: "t", atMs: 500, action: "typeText", target: "prompt", value: promptText },
      { id: "l", atMs: 2400, action: "show", target: "load" },
      { id: "h", atMs: 3800, action: "hide", target: "load" },
      { id: "c", atMs: 4000, action: "show", target: "canvas", animation: "pop-in" },
    ],
    autoNext: { enabled: true, afterMs: durationMs - 500, target: next },
    clickNext: { enabled: true, target: next },
  };
}

export function featureGridScreen({ id = "s3", next, durationMs = 5000, icons }) {
  return {
    id,
    name: "Cards",
    type: "demo",
    durationMs,
    transition: { animation: "fade-up" },
    elements: [BG, { id: "grid", type: "feature-grid", hidden: true, ...icons }],
    steps: [{ id: "a", atMs: 400, action: "show", target: "grid", animation: "fade-up" }],
    ...nav(durationMs, next, "fade-up"),
  };
}

export function scoreScreen({ id = "s3", scoreKey = "scoreValue", issuesKey = "issueList", next, durationMs = 4000 }) {
  return {
    id,
    name: "Score",
    type: "demo",
    durationMs,
    transition: { animation: "modal" },
    elements: [
      BG,
      { id: "score", type: "stat-strip", keys: [scoreKey], hidden: true },
      { id: "issues", type: "ai-result-card", textKey: issuesKey, hidden: true },
    ],
    steps: [
      { id: "a", atMs: 300, action: "show", target: "score", animation: "scale-in" },
      { id: "b", atMs: 900, action: "show", target: "issues", animation: "fade-up" },
    ],
    ...nav(durationMs, next, "fade-down"),
  };
}

export function progressBadgeScreen({ id = "s3", headlineKey, subheadKey, next, durationMs = 5000 }) {
  return {
    id,
    name: "Progress",
    type: "demo",
    durationMs,
    elements: [
      BG,
      { id: "hl", type: "headline-block", textKey: headlineKey, hidden: true },
      { id: "sub", type: "subheadline-block", textKey: subheadKey, hidden: true },
      { id: "prog", type: "lottie", assetId: "lottie-ai-confetti", hidden: true },
    ],
    steps: [
      { id: "a", atMs: 300, action: "show", target: "hl", animation: "fade-up" },
      { id: "b", atMs: 700, action: "show", target: "sub", animation: "fade-in" },
      { id: "c", atMs: 1100, action: "show", target: "prog", animation: "pop-in" },
    ],
    ...nav(durationMs, next, "fade-up"),
  };
}

export function agentStepsScreen({ id = "s2", next, durationMs = 4000 }) {
  return {
    id,
    name: "Agent plan",
    type: "demo",
    durationMs,
    transition: { animation: "slide" },
    elements: [BG, { id: "bot", type: "lottie", assetId: "lottie-ai-robot" }, { id: "resp", type: "ai-model-response", variant: "demo", textKey: "userQuestion" }],
    steps: [],
    autoNext: { enabled: true, afterStreamMs: 2000, target: next },
    clickNext: { enabled: true, target: next },
  };
}

export function workflowScreen({ id = "s2", next, durationMs = 7000 }) {
  return {
    id,
    name: "Workflow",
    type: "demo",
    durationMs,
    elements: [
      BG,
      { id: "load", type: "ai-loading-card", hidden: true },
      { id: "r1", type: "ai-result-card", textKey: "workflowSteps", hidden: true },
    ],
    steps: [
      { id: "l", atMs: 400, action: "show", target: "load" },
      { id: "h", atMs: 2200, action: "hide", target: "load" },
      { id: "r", atMs: 2400, action: "show", target: "r1", animation: "fade-up" },
    ],
    ...nav(durationMs, next, "modal"),
  };
}

export function chatBubblesScreen({ id = "s1", userKey, aiKey, next, durationMs = 8000 }) {
  return {
    id,
    name: "Chat",
    type: "demo",
    durationMs,
    elements: [
      BG,
      { id: "header", type: "app-header", badge: "Chat" },
      { id: "user", type: "chat-bubble-user", textKey: userKey },
      { id: "ai", type: "chat-bubble-ai", textKey: aiKey, hidden: true },
    ],
    steps: [
      { id: "a", atMs: 500, action: "show", target: "user", animation: "slide-left" },
      { id: "b", atMs: 2000, action: "show", target: "ai", animation: "pop-in" },
    ],
    ...nav(durationMs, next, "fade-up"),
  };
}

export function teaserBridgeScreen({ headlineKey, subheadKey, teaserKey, next, durationMs = 5000 }) {
  return {
    id: "s-bridge",
    name: "Result",
    type: "demo",
    durationMs,
    transition: { animation: "pop-in" },
    elements: [
      BG,
      { id: "hl", type: "headline-block", textKey: headlineKey, hidden: true },
      { id: "sub", type: "subheadline-block", textKey: subheadKey, hidden: true },
      { id: "teaser", type: "cta-teaser", textKey: teaserKey, hidden: true },
    ],
    steps: [
      { id: "a", atMs: 300, action: "show", target: "hl", animation: "fade-up" },
      { id: "b", atMs: 600, action: "show", target: "sub", animation: "fade-in" },
      { id: "c", atMs: 900, action: "show", target: "teaser", animation: "scale-in" },
    ],
    autoNext: { enabled: true, afterMs: durationMs - 500, target: next },
    clickNext: { enabled: true, target: next },
  };
}

export function cta(type = "bottom") {
  if (type === "center") return ctaCenter();
  if (type === "overlay") return ctaOverlay();
  return ctaBottom();
}

/**
 * V3 final CTA — main AI result visible on CTA screen (not button-only).
 * @param {'bottom'|'center'|'overlay'} layout
 * @param {'card'|'checklist'|'image'|'compare'|'stat'} resultMode
 */
export function ctaWithResult({
  layout = "bottom",
  resultMode = "card",
  resultKey,
  resultKeys,
  assetId,
  statKeys,
}) {
  const base = layout === "center" ? ctaCenter() : layout === "overlay" ? ctaOverlay() : ctaBottom();
  const resultSteps = [];
  const insertAt = layout === "overlay" ? 1 : 3;

  if (resultMode === "card" && resultKey) {
    base.elements.splice(insertAt, 0, {
      id: "cta_result",
      type: "ai-result-card",
      textKey: resultKey,
      variant: "primary",
      hidden: layout !== "overlay",
    });
    resultSteps.push({ id: "res", atMs: 100, action: "show", target: "cta_result", animation: "scale-in" });
  } else if (resultMode === "checklist" && resultKeys?.length) {
    const block = splitBenefitBlock({
      keys: resultKeys,
      titleKey: null,
      idPrefix: "cta_res",
      startMs: 100,
      hidden: layout !== "overlay",
    });
    base.elements.splice(insertAt, 0, ...block.elements);
    resultSteps.push(...block.steps);
  } else if (resultMode === "image" && assetId) {
    base.elements.splice(insertAt, 0, {
      id: "cta_result",
      type: "hero-image",
      assetId,
      hidden: layout !== "overlay",
    });
    resultSteps.push({ id: "res", atMs: 100, action: "show", target: "cta_result", animation: "pop-in" });
  } else if (resultMode === "compare") {
    base.elements.splice(insertAt, 0, {
      id: "cta_result",
      type: "image-compare",
      beforeAssetId: "img-before",
      afterAssetId: "img-after",
      hidden: layout !== "overlay",
    });
    resultSteps.push({ id: "res", atMs: 100, action: "show", target: "cta_result", animation: "scale-in" });
  } else if (resultMode === "stat" && statKeys?.length) {
    base.elements.splice(insertAt, 0, {
      id: "cta_stat",
      type: "stat-strip",
      keys: statKeys,
      hidden: layout !== "overlay",
    });
    if (resultKey) {
      base.elements.splice(insertAt + 1, 0, {
        id: "cta_result",
        type: "ai-result-card",
        textKey: resultKey,
        hidden: layout !== "overlay",
      });
      resultSteps.push({ id: "stat", atMs: 80, action: "show", target: "cta_stat", animation: "scale-in" });
      resultSteps.push({ id: "res", atMs: 200, action: "show", target: "cta_result", animation: "fade-up" });
    }
  }

  base.steps = [...resultSteps, ...base.steps];
  return base;
}
