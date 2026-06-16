/**
 * V3 screen contract — docs/AI_PLAYABLE_USER_CASE_SCENARIOS_V3_SCREEN_DETAIL.md
 * Used by template:catalog:generate and template:create (--topic scaffold).
 */

export const V3_DOC = "docs/AI_PLAYABLE_USER_CASE_SCENARIOS_V3_SCREEN_DETAIL.md";

/** Suggested autoNext durations (ms) per screen role — §2.1 */
export const V3_TIMING = {
  hook: 3500,
  interaction: 4000,
  aiLoading: 4500,
  aiStreaming: 5000,
  result: 4500,
  travelStream: 6000,
  mealStream: 5500,
};

/** Non-final screens: autoNext + clickNext. Final CTA: click only → app store. */
export function v3Nav(afterMs, target, anim = "fade-up") {
  return {
    autoNext: { enabled: true, afterMs, target },
    clickNext: { enabled: true, target },
    transition: { animation: anim, easing: "ease-out", durationMs: 420 },
  };
}

export function v3MetaGuide(scenario, keys) {
  return `V3 Scenario ${scenario}. ${keys}`;
}
