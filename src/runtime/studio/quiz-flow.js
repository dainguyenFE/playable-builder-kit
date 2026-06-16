/**
 * Interactive quiz option picker → result text → navigate.
 */
import { trackEvent } from "./tracking.js";

export function initQuizFlow({ screen, content, context, navigate, clock }) {
  const root = content.querySelector("[data-quiz-options]");
  if (!root) return () => {};

  const optionsKey = root.dataset.optionsKey || "quizOptions";
  const options = context[optionsKey] ?? [];
  const resultEl = root.querySelector("[data-quiz-result]");
  let picked = false;

  const onClick = async (e) => {
    const btn = e.target.closest(".pb-quiz__opt");
    if (!btn || picked) return;
    picked = true;
    const index = Number(btn.dataset.quizIndex);
    const opt = options[index];
    if (!opt) return;

    trackEvent("quiz_choice", { index, label: opt.label });
    root.querySelectorAll(".pb-quiz__opt").forEach((b) => {
      b.disabled = true;
      b.classList.toggle("pb-quiz__opt--picked", b === btn);
    });

    const resultText = opt.resultText || context[opt.resultKey] || opt.label;
    if (resultEl && resultText) {
      resultEl.textContent = resultText;
      resultEl.classList.remove("pb-el--hidden");
    }

    const target = opt.targetScreen || screen.clickNext?.target || screen.autoNext?.target;
    await new Promise((r) => setTimeout(r, opt.delayMs ?? 1400));
    if (target) navigate(target);
  };

  root.addEventListener("click", onClick);
  return () => root.removeEventListener("click", onClick);
}
