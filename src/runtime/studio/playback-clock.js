/**
 * Elapsed time for a screen timeline — excludes paused intervals.
 */
export function createPlaybackClock() {
  let anchor = performance.now();
  let pausedAt = null;
  let totalPaused = 0;
  /** @type {Set<() => void>} */
  const waiters = new Set();

  function notifyWaiters() {
    for (const fn of waiters) fn();
    waiters.clear();
  }

  return {
    elapsed() {
      const now = performance.now();
      if (pausedAt) return pausedAt - anchor - totalPaused;
      return now - anchor - totalPaused;
    },
    isPaused() {
      return pausedAt !== null;
    },
    pause() {
      if (pausedAt) return;
      pausedAt = performance.now();
    },
    resume() {
      if (!pausedAt) return;
      totalPaused += performance.now() - pausedAt;
      pausedAt = null;
      notifyWaiters();
    },
    reset() {
      anchor = performance.now();
      pausedAt = null;
      totalPaused = 0;
      notifyWaiters();
    },
    async waitWhilePaused() {
      while (pausedAt) {
        await new Promise((resolve) => {
          waiters.add(resolve);
        });
      }
    },
  };
}

/** Delay that excludes time spent paused (for streaming / async flows). */
export async function delayWithClock(clock, ms) {
  if (!clock?.waitWhilePaused || !clock?.elapsed) {
    await new Promise((resolve) => setTimeout(resolve, ms));
    return;
  }
  const target = clock.elapsed() + ms;
  while (clock.elapsed() < target) {
    await clock.waitWhilePaused();
    const left = target - clock.elapsed();
    if (left <= 0) break;
    await new Promise((resolve) => setTimeout(resolve, Math.min(48, left)));
  }
}
