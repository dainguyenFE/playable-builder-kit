/** Allowed scenario actions — docs/PROMPT_PLAYABLE_STUDIO_SINGLE_HTML_SPEC.md §10 */

export const ACTION_REGISTRY = {
  show: "show",
  hide: "hide",
  typeText: "typeText",
  navigateScreen: "navigateScreen",
  trackEvent: "trackEvent",
  pulse: "pulse",
};

export const ANIMATION_CLASSES = {
  "fade-in": "pb-anim-fade-in",
  "fade-up": "pb-anim-fade-up",
  "fade-down": "pb-anim-fade-down",
  "scale-in": "pb-anim-scale-in",
  "pop-in": "pb-anim-pop-in",
  "slide-left": "pb-anim-slide-left",
  "slide-right": "pb-anim-slide-right",
  pulse: "pb-anim-pulse",
  "cta-attention": "pb-anim-cta-attention",
  "cta-glow": "pb-anim-cta-attention",
  shake: "pb-anim-shake",
};

/** Screen-to-screen enter animations (scenario.screens[].transition.animation) */
export const SCREEN_ENTER_ANIMATIONS = {
  slide: "pb-studio__stage--enter-slide",
  fade: "pb-studio__stage--enter-fade",
  "fade-up": "pb-studio__stage--enter-fade-up",
  "fade-down": "pb-studio__stage--enter-fade-down",
  "fade-out": "pb-studio__stage--enter-fade",
  "pop-in": "pb-studio__stage--enter-pop-in",
  modal: "pb-studio__stage--enter-modal",
  popup: "pb-studio__stage--enter-modal",
};

/** CSS timing keywords (scenario.screens[].transition.easing) */
export const SCREEN_ENTER_EASINGS = {
  ease: "ease",
  "ease-in": "ease-in",
  "ease-out": "ease-out",
  "ease-in-out": "ease-in-out",
  linear: "linear",
};
