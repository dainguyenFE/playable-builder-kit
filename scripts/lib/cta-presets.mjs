/** CTA screen presets — bottom | center | overlay (continues from previous screen button). */

const BG = { id: "bg", type: "background", textKey: "backgroundGradient" };

export function ctaBottom() {
  return {
    id: "screen_cta",
    name: "CTA",
    type: "cta",
    ctaLayout: "bottom",
    durationMs: 60000,
    transition: { animation: "fade-up", easing: "ease-out", durationMs: 450 },
    elements: [
      BG,
      { id: "free_badge", type: "free-badge", textKey: "freeBadge" },
      { id: "cta_headline", type: "headline-block", textKey: "ctaHeadline" },
      { id: "cta_sub", type: "subheadline-block", textKey: "ctaSubhead" },
      { id: "benefits", type: "benefit-list", hidden: true },
      { id: "download_hint", type: "cta-download-hint", textKey: "ctaDownloadHint", hidden: true },
      { id: "cta_arrow", type: "cta-arrow", hidden: true },
      { id: "cta_button", type: "cta-button", textKey: "cta" },
    ],
    steps: [
      { id: "bg", atMs: 0, action: "show", target: "bg", animation: "fade-in" },
      { id: "badge", atMs: 150, action: "show", target: "free_badge", animation: "pop-in" },
      { id: "hl", atMs: 350, action: "show", target: "cta_headline", animation: "fade-up" },
      { id: "sub", atMs: 550, action: "show", target: "cta_sub", animation: "fade-in" },
      { id: "ben", atMs: 750, action: "show", target: "benefits", animation: "fade-up" },
      { id: "hint", atMs: 950, action: "show", target: "download_hint", animation: "fade-in" },
      { id: "arrow", atMs: 1150, action: "show", target: "cta_arrow", animation: "fade-in" },
      { id: "pulse", atMs: 1450, action: "pulse", target: "cta_button" },
    ],
  };
}

export function ctaCenter() {
  return {
    id: "screen_cta",
    name: "CTA",
    type: "cta",
    ctaLayout: "center",
    durationMs: 60000,
    transition: { animation: "modal", easing: "ease-out", durationMs: 500 },
    elements: [
      BG,
      { id: "confetti", type: "lottie", assetId: "lottie-ai-confetti" },
      { id: "free_badge", type: "free-badge", textKey: "freeBadge" },
      { id: "cta_headline", type: "headline-block", textKey: "ctaHeadline" },
      { id: "cta_sub", type: "subheadline-block", textKey: "ctaSubhead" },
      { id: "benefits", type: "benefit-list" },
      { id: "cta_button", type: "cta-button", textKey: "cta" },
    ],
    steps: [
      { id: "bg", atMs: 0, action: "show", target: "bg", animation: "fade-in" },
      { id: "badge", atMs: 200, action: "show", target: "free_badge", animation: "scale-in" },
      { id: "hl", atMs: 400, action: "show", target: "cta_headline", animation: "fade-up" },
      { id: "sub", atMs: 600, action: "show", target: "cta_sub", animation: "fade-in" },
      { id: "ben", atMs: 800, action: "show", target: "benefits", animation: "fade-up" },
      { id: "pulse", atMs: 1200, action: "pulse", target: "cta_button" },
    ],
  };
}

/** Overlay CTA — dim screen, hand points at store button (matches prior cta-teaser). */
export function ctaOverlay() {
  return {
    id: "screen_cta",
    name: "Install",
    type: "cta",
    ctaLayout: "overlay",
    durationMs: 60000,
    transition: { animation: "modal", easing: "ease-out", durationMs: 480 },
    elements: [
      BG,
      { id: "benefits", type: "benefit-list", hidden: true },
      { id: "free_badge", type: "free-badge", textKey: "freeBadge", hidden: true },
      { id: "download_hint", type: "cta-download-hint", textKey: "ctaDownloadHint", hidden: true },
      { id: "arrow_lottie", type: "lottie", assetId: "lottie-ai-stars", variant: "cta-arrow-lottie", hidden: true },
      { id: "cta_button", type: "cta-button", textKey: "cta" },
    ],
    steps: [
      { id: "bg", atMs: 0, action: "show", target: "bg", animation: "fade-in" },
      { id: "ben", atMs: 300, action: "show", target: "benefits", animation: "fade-up" },
      { id: "badge", atMs: 500, action: "show", target: "free_badge", animation: "pop-in" },
      { id: "hint", atMs: 700, action: "show", target: "download_hint", animation: "fade-in" },
      { id: "arrow", atMs: 900, action: "show", target: "arrow_lottie", animation: "fade-in" },
      { id: "pulse", atMs: 1100, action: "pulse", target: "cta_button" },
    ],
  };
}

export const SHARED_CONTEXT_CTA = {
  freeBadge: "Free to try",
  ctaDownloadHint: "👇 Tap to download — no card required",
  benefit1: "Unlimited AI requests during trial",
  benefit2: "Export & share in one tap",
  benefit3: "Works offline for saved chats",
  benefit4: "Cancel anytime in Settings",
  benefitsTitle: "What you'll get",
};

export const DEFAULT_LOTTIE_ASSETS = [
  { id: "lottie-ai-confetti", type: "lottie", path: "lottie/lottie-ai-confetti.json" },
  { id: "lottie-ai-chat", type: "lottie", path: "lottie/lottie-ai-chat.json" },
  { id: "lottie-ai-loading", type: "lottie", path: "lottie/lottie-ai-loading.json" },
  { id: "lottie-ai-stars", type: "lottie", path: "lottie/lottie-ai-stars.json" },
  { id: "lottie-ai-robot", type: "lottie", path: "lottie/lottie-ai-robot.json" },
  { id: "lottie-ai-scan", type: "lottie", path: "lottie/lottie-ai-scan.json" },
  { id: "lottie-ai-brain", type: "lottie", path: "lottie/lottie-ai-brain.json" },
];

export function assetsPreset(extra = []) {
  return { assets: [...extra, ...DEFAULT_LOTTIE_ASSETS] };
}

export function img(id, file, label) {
  return { id, type: "image", path: `images/${file}`, label };
}

export function icon(slug) {
  return { id: `lucide-${slug}`, type: "icon", path: `icons/lucide/${slug}.svg`, label: slug };
}

export function bgGrad(color = "#3B82F6") {
  return `radial-gradient(ellipse 120% 80% at 50% -12%, color-mix(in srgb, ${color} 38%, transparent), transparent 58%), linear-gradient(180deg, #0b1220 0%, #0f172a 100%)`;
}
