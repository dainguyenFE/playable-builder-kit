/**
 * Local tracking (preview). No PII.
 */
const events = [];

export function track(event, payload = {}) {
  const entry = { event, ...payload, timestamp: Date.now() };
  events.push(entry);
  if (typeof console !== "undefined" && console.debug) {
    console.debug("[playable]", entry);
  }
  return entry;
}

export function getEvents() {
  return [...events];
}
