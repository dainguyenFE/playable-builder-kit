/** Shared scenario fragments for studio templates */

export const DEFAULT_LOTTIE_ASSETS = [];

export function buildHookScreen({
  id = "screen_hook",
  badge,
  heroAssetId,
  durationMs = 4800,
  nextScreen = "screen_demo",
}) {
  const elements = [
    { id: "bg", type: "background", textKey: "backgroundGradient" },
    { id: "header", type: "app-header", badge },
    { id: "headline", type: "headline-block", textKey: "problemHeadline", hidden: true },
    { id: "pills", type: "feature-pills", keys: ["feature1", "feature2", "feature3"], hidden: true },
    { id: "problem_card", type: "problem-card", textKey: "problem", hidden: true },
    { id: "tap_hint", type: "tap-hint", textKey: "tapHint", hidden: true },
  ];
  if (heroAssetId) {
    elements.splice(2, 0, { id: "hero", type: "hero-image", assetId: heroAssetId, hidden: true });
  }
  const steps = [
    { id: "bg", atMs: 0, action: "show", target: "bg", animation: "fade-in" },
    { id: "hdr", atMs: 0, action: "show", target: "header", animation: "fade-in" },
  ];
  let t = 200;
  if (heroAssetId) {
    steps.push({ id: "hero", atMs: t, action: "show", target: "hero", animation: "pop-in" });
    t += 250;
  }
  steps.push(
    { id: "headline", atMs: t, action: "show", target: "headline", animation: "fade-up" },
    { id: "pills", atMs: t + 400, action: "show", target: "pills", animation: "fade-in" },
    { id: "problem", atMs: t + 800, action: "show", target: "problem_card", animation: "scale-in" },
    { id: "hint", atMs: t + 2000, action: "show", target: "tap_hint", animation: "pulse" },
  );
  return {
    id,
    name: "Hook",
    type: "problem",
    durationMs,
    elements,
    steps,
    autoNext: { enabled: true, afterMs: durationMs, target: nextScreen },
    clickNext: { enabled: true, target: nextScreen },
  };
}

export function buildCtaScreen({ nextScreen } = {}) {
  return {
    id: "screen_cta",
    name: "CTA",
    type: "cta",
    durationMs: 60000,
    elements: [
      { id: "bg", type: "background", textKey: "backgroundGradient" },
      { id: "cta_headline", type: "headline-block", textKey: "ctaHeadline" },
      { id: "cta_sub", type: "subheadline-block", textKey: "ctaSubhead" },
      { id: "download_hint", type: "cta-download-hint", textKey: "ctaDownloadHint", hidden: true },
      { id: "cta_arrow", type: "cta-arrow", hidden: true },
      { id: "cta_button", type: "cta-button", textKey: "cta" },
    ],
    steps: [
      { id: "bg", atMs: 0, action: "show", target: "bg", animation: "fade-in" },
      { id: "headline", atMs: 200, action: "show", target: "cta_headline", animation: "fade-up" },
      { id: "sub", atMs: 450, action: "show", target: "cta_sub", animation: "fade-in" },
      { id: "hint", atMs: 700, action: "show", target: "download_hint", animation: "fade-in" },
      { id: "arrow", atMs: 950, action: "show", target: "cta_arrow", animation: "fade-in" },
      { id: "pulse", atMs: 1300, action: "pulse", target: "cta_button" },
    ],
    ...(nextScreen ? { clickNext: { enabled: false } } : {}),
  };
}

export function buildRichDemoScreen({
  id = "screen_demo",
  badge,
  nextScreen = "screen_cta",
  durationMs = 120000,
}) {
  return {
    id,
    name: "AI Demo",
    type: "demo",
    durationMs,
    elements: [
      { id: "bg", type: "background", textKey: "backgroundGradient" },
      { id: "header", type: "app-header", badge },
      { id: "model_response", type: "ai-model-response", variant: "demo", textKey: "userQuestion" },
    ],
    steps: [{ id: "bg", atMs: 0, action: "show", target: "bg", animation: "fade-in" }],
    autoNext: { enabled: true, afterStreamMs: 1800, target: nextScreen },
    clickNext: { enabled: true, target: nextScreen },
  };
}
