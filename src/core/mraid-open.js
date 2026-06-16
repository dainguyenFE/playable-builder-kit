/**
 * MRAID-safe open — AppLovin requires getState(), ready listener, no APIs while loading.
 */

export function getMraid() {
  return typeof window.mraid !== "undefined" ? window.mraid : null;
}

/** Register getState + ready for scanners; safe to call on page load */
export function ensureMraidReadyHooks() {
  const mraid = getMraid();
  if (!mraid) return;

  try {
    mraid.getState();
  } catch {
    /* SDK may not be ready yet */
  }

  try {
    mraid.addEventListener("ready", () => {});
  } catch {
    /* ignore */
  }
}

export function whenMraidReady(cb) {
  const mraid = getMraid();
  if (!mraid) {
    cb(null);
    return;
  }

  const invoke = () => {
    try {
      const state = mraid.getState?.();
      if (state === "loading") return;
    } catch {
      /* fall through if getState unavailable */
    }
    cb(mraid);
  };

  let state;
  try {
    state = mraid.getState?.();
  } catch {
    state = undefined;
  }

  if (state && state !== "loading") {
    invoke();
    return;
  }

  const onReady = () => {
    mraid.removeEventListener?.("ready", onReady);
    invoke();
  };

  try {
    mraid.addEventListener("ready", onReady);
  } catch {
    invoke();
  }
}

export function openUrlWithMraid(url, fallbackOpen) {
  const target = (url || "").trim();
  if (!target) return;

  whenMraidReady((mraid) => {
    if (mraid?.open) {
      try {
        mraid.open(target);
        return;
      } catch {
        /* fall through */
      }
    }
    if (fallbackOpen) fallbackOpen(target);
    else window.open(target, "_blank", "noopener,noreferrer");
  });
}
