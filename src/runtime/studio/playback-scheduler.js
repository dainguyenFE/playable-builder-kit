/**
 * Pausable step timers + auto-advance timeout for studio preview.
 */

function stepKey(step) {
  return step.id ?? `${step.target}-${step.atMs}-${step.action}`;
}

/**
 * @param {object[]} steps
 * @param {(step: object) => void | Promise<void>} runStep
 * @param {{ elapsed: () => number, isPaused: () => boolean }} clock
 */
export function createPausableStepScheduler(steps, runStep, clock) {
  /** @type {ReturnType<typeof setTimeout>[]} */
  let timers = [];
  const fired = new Set();

  function clear() {
    for (const t of timers) clearTimeout(t);
    timers = [];
  }

  function schedule() {
    clear();
    if (clock.isPaused()) return;
    const elapsed = clock.elapsed();
    for (const step of steps ?? []) {
      const key = stepKey(step);
      if (fired.has(key)) continue;
      const delay = Math.max(0, (step.atMs ?? 0) - elapsed);
      const t = setTimeout(async () => {
        fired.add(key);
        if (!clock.isPaused()) await runStep(step);
      }, delay);
      timers.push(t);
    }
  }

  return {
    start: schedule,
    pause: clear,
    resume: schedule,
    cancel() {
      clear();
      fired.clear();
    },
  };
}

/**
 * @param {number} delayMs
 * @param {() => void} callback
 * @param {{ elapsed: () => number, isPaused: () => boolean }} clock
 */
export function createPausableTimeout(delayMs, callback, clock) {
  /** @type {ReturnType<typeof setTimeout> | null} */
  let timer = null;
  let done = false;

  function clear() {
    if (timer) clearTimeout(timer);
    timer = null;
  }

  function schedule() {
    clear();
    if (done || clock.isPaused()) return;
    const remaining = delayMs - clock.elapsed();
    if (remaining <= 0) {
      done = true;
      callback();
      return;
    }
    timer = setTimeout(() => {
      done = true;
      callback();
    }, remaining);
  }

  return {
    start: schedule,
    pause: clear,
    resume: schedule,
    cancel() {
      clear();
      done = false;
    },
  };
}
