/**
 * Scaffold empty or topic-based studio template presets.
 * V3 screen contract: docs/AI_PLAYABLE_USER_CASE_SCENARIOS_V3_SCREEN_DETAIL.md
 */
import { loadThemesCatalog } from "./studio-themes.mjs";
import { V3_TIMING } from "./v3-screen-contract.mjs";

const ALL_THEME_IDS = Object.keys(loadThemesCatalog().themes ?? {});

export function listThemeIds() {
  return ALL_THEME_IDS;
}

function titleCase(id) {
  return id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function screenType(index, total) {
  if (index === 0) return "problem";
  if (index === total - 1) return "cta";
  return "demo";
}

function screenName(index, total) {
  if (index === 0) return "Screen 1 — Hook";
  if (index === total - 1) return `Screen ${index + 1} — CTA`;
  return `Screen ${index + 1}`;
}

function screenId(index) {
  return `screen_${index + 1}`;
}

export function buildEmptyScenario(screenCount = 1) {
  const n = Math.max(1, Math.min(8, Number(screenCount) || 1));
  const screens = [];

  for (let i = 0; i < n; i += 1) {
    const id = screenId(i);
    const nextId = i < n - 1 ? screenId(i + 1) : null;
    const screen = {
      id,
      name: screenName(i, n),
      type: screenType(i, n),
      durationMs: i === n - 1 ? 60000 : 6000,
      elements: [
        {
          id: "bg",
          type: "background",
          textKey: "backgroundGradient",
        },
      ],
      steps: [
        {
          id: `bg_${id}`,
          atMs: 0,
          action: "show",
          target: "bg",
          animation: "fade-in",
        },
      ],
    };

    if (nextId) {
      const afterMs = i === n - 1 ? V3_TIMING.hook : V3_TIMING.interaction;
      screen.autoNext = { enabled: true, afterMs, target: nextId };
      screen.clickNext = { enabled: true, target: nextId };
      if (i === 0) {
        screen.transition = { animation: "fade-up", easing: "ease-in-out" };
      }
    }

    screens.push(screen);
  }

  return {
    id: "template-flow",
    entryScreen: screenId(0),
    screens,
  };
}

export function buildTopicContext(topic, templateId, theme) {
  const subject = String(topic || "").trim() || "Your product";
  const product = subject.length > 28 ? subject.slice(0, 28) : subject;
  const accent = theme?.primaryColor ?? "#64748B";

  return {
    id: `${templateId}-sample`,
    productName: product,
    category: subject,
    featureBadge: "New",
    feature1: "Fast setup",
    feature2: "Easy to use",
    feature3: "Pro results",
    problemHeadline: `Need help with ${subject}?`,
    problem: `Users struggle to get started with ${subject} without the right tool.`,
    hookSubhead: `Discover a simpler way to enjoy ${subject}.`,
    loadingText: "Generating…",
    campaignMessage: `Here's why ${subject} matters — and how you can get started today.`,
    ctaHeadline: `Try ${product} free`,
    ctaSubhead: `Join others who love ${subject}.`,
    cta: "Get the app",
    backgroundGradient: `radial-gradient(ellipse 110% 75% at 50% -18%, color-mix(in srgb, ${accent} 40%, transparent), transparent 58%), linear-gradient(180deg, #0b1120 0%, #0f172a 55%, #0b1120 100%)`,
  };
}

export function buildEmptyContext(templateId, theme) {
  const accent = theme?.primaryColor ?? "#64748B";
  return {
    id: `${templateId}-sample`,
    productName: "Product name",
    category: "Category",
    cta: "Get the app",
    backgroundGradient: `radial-gradient(ellipse 110% 75% at 50% -18%, color-mix(in srgb, ${accent} 35%, transparent), transparent 58%), linear-gradient(180deg, #0b1120 0%, #0f172a 100%)`,
  };
}

export function buildTopicScenario(screenCount, topic) {
  const n = Math.max(1, Math.min(8, Number(screenCount) || 3));
  const subject = String(topic || "").trim() || "your product";
  const base = buildEmptyScenario(n);
  const screens = base.screens.map((screen, i) => {
    const id = screen.id;
    const isFirst = i === 0;
    const isLast = i === n - 1;
    const isMiddle = !isFirst && !isLast;
    const nextId = i < n - 1 ? screenId(i + 1) : null;

    const elements = [
      { id: "bg", type: "background", textKey: "backgroundGradient" },
      { id: "header", type: "app-header", badge: "App" },
    ];
    const steps = [
      { id: `bg_${id}`, atMs: 0, action: "show", target: "bg", animation: "fade-in" },
      { id: `hdr_${id}`, atMs: 0, action: "show", target: "header", animation: "fade-in" },
    ];

    if (isFirst) {
      elements.push(
        { id: "headline", type: "headline-block", textKey: "problemHeadline", hidden: true },
        { id: "hook_sub", type: "subheadline-block", textKey: "hookSubhead", hidden: true },
      );
      steps.push(
        { id: `hl_${id}`, atMs: 300, action: "show", target: "headline", animation: "fade-up" },
        { id: `sub_${id}`, atMs: 700, action: "show", target: "hook_sub", animation: "fade-up" },
      );
    } else if (isMiddle) {
      elements.push(
        { id: "demo_card", type: "ai-result-card", textKey: "campaignMessage", hidden: true },
      );
      steps.push(
        { id: `demo_${id}`, atMs: 400, action: "show", target: "demo_card", animation: "pop-in" },
      );
    } else if (isLast) {
      elements.push(
        { id: "cta_result", type: "ai-result-card", textKey: "campaignMessage", variant: "primary" },
        { id: "cta_headline", type: "headline-block", textKey: "ctaHeadline" },
        { id: "cta_sub", type: "subheadline-block", textKey: "ctaSubhead" },
        { id: "cta_button", type: "cta-button", textKey: "cta" },
      );
      steps.push(
        { id: `res_${id}`, atMs: 100, action: "show", target: "cta_result", animation: "scale-in" },
        { id: `pulse_${id}`, atMs: 800, action: "pulse", target: "cta_button" },
      );
    }

    const out = {
      ...screen,
      name: isFirst ? "Hook" : isLast ? "CTA" : `Demo — ${subject}`,
      elements,
      steps,
    };

    if (nextId && !isLast) {
      const afterMs = isFirst ? V3_TIMING.hook : isMiddle && i === n - 2 ? V3_TIMING.aiStreaming : V3_TIMING.interaction;
      out.autoNext = { enabled: true, afterMs, target: nextId };
      out.clickNext = { enabled: true, target: nextId };
    }

    return out;
  });

  return {
    id: `${subject.toLowerCase().replace(/\s+/g, "-").slice(0, 24)}-flow`,
    entryScreen: screenId(0),
    screens,
  };
}

export function buildTemplateMeta(templateId, { screenCount, topic, themeId, empty }) {
  const name = titleCase(templateId);
  const n = Math.max(1, Math.min(8, Number(screenCount) || 1));
  const hasTopic = !empty && String(topic || "").trim();

  return {
    id: templateId,
    name,
    description: empty
      ? `Empty ${n}-screen template — add zones in inspector`
      : hasTopic
        ? `Sample flow for: ${String(topic).trim()}`
        : `Custom ${n}-screen studio template`,
    defaultTheme: themeId,
    themes: ALL_THEME_IDS,
    flow: Array.from({ length: n }, (_, i) => (i === 0 ? "hook" : i === n - 1 ? "cta" : "demo")),
    scenarioPreset: `${templateId}-flow`,
    scenarioDoc: "docs/AI_PLAYABLE_USER_CASE_SCENARIOS_V3_SCREEN_DETAIL.md",
    blocks: [
      "background",
      "app-header",
      "headline-block",
      "subheadline-block",
      "problem-card",
      "ai-result-card",
      "cta-button",
    ],
  };
}

export function buildPlayablePreset(templateId, theme) {
  return {
    id: "preview-template",
    name: `${titleCase(templateId)} (template preview)`,
    viewport: { width: 390, height: 844, safeArea: true },
    theme: {
      primaryColor: theme.primaryColor,
      backgroundColor: theme.backgroundColor,
      textColor: theme.textColor,
      fontFamily: "system",
    },
    template: { id: templateId },
    cta: { label: "Get the app", type: "openStore" },
    tracking: { enabled: true },
    layout: { insetX: 20, insetY: 20, insetBottom: 24, gap: 14 },
  };
}

export const DEFAULT_ASSETS_PRESET = {
  assets: [],
};
