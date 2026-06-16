/**
 * Estimate how long a screen stays visible in preview (inspector display).
 * Not frame-perfect — avoids showing placeholder caps like 120000ms.
 */

const TYPE_SPEED_MS = 28;
const STREAM_CHAR_MS = 10;
const BLOCK_ENTER_MS = 200;
const STEP_ANIM_MS = 400;
const HOLD_MS = 500;
const ABSURD_CAP_MS = 30000;

function hasElementType(screen, type) {
  return (screen.elements ?? []).some((el) => el.type === type);
}

export function estimateStreamBlocksMs(blocks, charMs = STREAM_CHAR_MS) {
  if (!blocks?.length) return 1500;
  let ms = 0;
  for (const block of blocks) {
    if (block.type === "text") {
      ms += String(block.text ?? "").length * charMs;
    } else {
      ms += BLOCK_ENTER_MS;
    }
  }
  return ms + 300;
}

export function estimateFromStepsMs(screen) {
  const steps = screen.steps ?? [];
  if (!steps.length) return 0;

  let end = 0;
  for (const step of steps) {
    const at = step.atMs ?? 0;
    if (step.action === "typeText" && step.value) {
      const speed = step.speed ?? TYPE_SPEED_MS;
      end = Math.max(end, at + step.value.length * speed);
    } else if (step.action === "show" || step.action === "hide" || step.action === "pulse") {
      end = Math.max(end, at + STEP_ANIM_MS);
    } else {
      end = Math.max(end, at + 200);
    }
  }
  return end + HOLD_MS;
}

/**
 * @param {object} screen — scenario screen
 * @param {object} [context]
 * @returns {number|null} null = user-driven (quiz / tap-only)
 */
export function estimateScreenViewMs(screen, context = {}) {
  if (!screen) return null;

  if (hasElementType(screen, "quiz-options")) return null;

  const fromSteps = estimateFromStepsMs(screen);
  const auto = screen.autoNext;
  const click = screen.clickNext;
  const hasAiStream = hasElementType(screen, "ai-model-response");

  if (hasAiStream) {
    const streamMs = estimateStreamBlocksMs(context.aiAnswerBlocks);
    const post = auto?.afterStreamMs ?? 1800;
    return streamMs + post + 400;
  }

  if (auto?.enabled) {
    if (auto.afterStreamMs != null) {
      return fromSteps + auto.afterStreamMs;
    }
    if (auto.afterMs != null && auto.afterMs < ABSURD_CAP_MS) {
      return Math.max(fromSteps, auto.afterMs);
    }
    if (screen.durationMs != null && screen.durationMs < ABSURD_CAP_MS) {
      return Math.max(fromSteps, screen.durationMs);
    }
    return fromSteps || 5000;
  }

  if (click?.enabled && !auto?.enabled) {
    return screen.type === "cta" ? fromSteps || 2500 : null;
  }

  if (screen.type === "cta") {
    return fromSteps || 3000;
  }

  return fromSteps || null;
}

/** @param {number|null} ms */
export function formatEstimatedViewTime(ms) {
  if (ms == null) return "tap";
  if (ms < 1000) return `~${ms}ms`;
  const s = ms / 1000;
  if (s < 10) {
    const rounded = Math.round(s * 10) / 10;
    return rounded % 1 === 0 ? `~${rounded}s` : `~${rounded.toFixed(1)}s`;
  }
  return `~${Math.round(s)}s`;
}

export function estimateAutoAdvanceMs(screen, context = {}) {
  const auto = screen.autoNext;
  if (!auto?.enabled) return null;
  return estimateScreenViewMs(screen, context);
}
