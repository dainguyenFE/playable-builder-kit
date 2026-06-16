/**
 * Split independent copy lines into separate inspector zones (one element per line).
 */

export const CTA_BENEFIT_KEYS = ["benefit1", "benefit2", "benefit3", "benefit4"];

/**
 * @param {string[]} keys — context textKey per line
 * @param {{ idPrefix?: string, startMs?: number, staggerMs?: number, hidden?: boolean, animation?: string }} [opts]
 */
export function splitBenefitItemZones(keys, opts = {}) {
  const {
    idPrefix = "ben",
    startMs = 0,
    staggerMs = 160,
    hidden = true,
    animation = "fade-in",
  } = opts;

  const elements = [];
  const steps = [];

  for (const [i, textKey] of (keys ?? []).filter(Boolean).entries()) {
    const id = `${idPrefix}${i + 1}`;
    elements.push({ id, type: "benefit-item", textKey, hidden });
    steps.push({
      id: `step_${id}`,
      atMs: startMs + i * staggerMs,
      action: "show",
      target: id,
      animation,
    });
  }

  return { elements, steps, lastAtMs: startMs + Math.max(0, keys.length - 1) * staggerMs };
}

/**
 * Optional section title + one zone per benefit line.
 * @param {{ keys?: string[], titleKey?: string | null, titleId?: string, idPrefix?: string, startMs?: number, staggerMs?: number, hidden?: boolean }} [opts]
 */
export function splitBenefitBlock(opts = {}) {
  const {
    keys = CTA_BENEFIT_KEYS,
    titleKey = "benefitsTitle",
    titleId = "benefits_title",
    idPrefix = "ben",
    startMs = 0,
    staggerMs = 160,
    hidden = true,
  } = opts;

  const elements = [];
  const steps = [];
  let itemStart = startMs;

  if (titleKey) {
    elements.push({ id: titleId, type: "benefit-title", textKey: titleKey, hidden });
    steps.push({
      id: `step_${titleId}`,
      atMs: startMs,
      action: "show",
      target: titleId,
      animation: "fade-in",
    });
    itemStart = startMs + 120;
  }

  const items = splitBenefitItemZones(keys, { idPrefix, startMs: itemStart, staggerMs, hidden });
  elements.push(...items.elements);
  steps.push(...items.steps);

  const lastAtMs = items.lastAtMs ?? itemStart;
  return { elements, steps, lastAtMs };
}
