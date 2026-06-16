const events = [];

export function trackEvent(name, payload = {}) {
  const entry = { name, payload, ts: Date.now() };
  events.push(entry);
  window.__PLAYABLE_EVENTS__ = window.__PLAYABLE_EVENTS__ || [];
  window.__PLAYABLE_EVENTS__.push(entry);
  if (typeof console !== "undefined" && console.debug) {
    console.debug("[playable]", entry);
  }
  return entry;
}

export function getPlayableEvents() {
  return [...events];
}

export function resetPlayableEvents() {
  events.length = 0;
  window.__PLAYABLE_EVENTS__ = [];
}
