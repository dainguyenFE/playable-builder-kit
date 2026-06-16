import { trackEvent } from "./tracking.js";
import { applyAnimation, runTypeText } from "./screen-renderer.js";

export function createActionRunner({ elementMap, onNavigate, clock }) {
  return async function runStep(step) {
    const node = elementMap.get(step.target);
    switch (step.action) {
      case "show":
        if (node) {
          node.classList.remove("pb-el--hidden");
          applyAnimation(node, step.animation);
        }
        break;
      case "hide":
        node?.classList.add("pb-el--hidden");
        break;
      case "typeText":
        if (node && step.value) await runTypeText(node, step.value, step.speed ?? 28, clock);
        break;
      case "pulse":
        if (node) {
          node.classList.remove("pb-el--hidden");
          const ctaBtn = node.querySelector?.("#cta") || node.querySelector?.(".pb-btn--cta");
          if (ctaBtn) {
            ctaBtn.classList.add("pb-anim-cta-attention");
          } else {
            node.classList.add("pb-anim-pulse");
          }
        }
        break;
      case "trackEvent":
        trackEvent(step.value || step.target || "step", { step: step.id });
        break;
      case "navigateScreen":
        onNavigate(step.target);
        break;
      default:
        break;
    }
  };
}

export function scheduleSteps(steps, runStep) {
  const timers = [];
  for (const step of steps ?? []) {
    const t = setTimeout(() => {
      runStep(step);
    }, step.atMs ?? 0);
    timers.push(t);
  }
  return () => timers.forEach(clearTimeout);
}
