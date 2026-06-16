import { renderTapToStart } from "./blocks/tap-to-start.js";
import { renderIntroHeadline } from "./blocks/intro-headline.js";
import { renderChatStream } from "./blocks/chat-stream.js";
import { renderChipPicker } from "./blocks/chip-picker.js";
import { renderResultCard } from "./blocks/result-card.js";
import { renderStoreCta } from "./blocks/store-cta.js";

const BLOCK_RENDERERS = {
  "tap-to-start": renderTapToStart,
  "intro-headline": renderIntroHeadline,
  "chat-stream": renderChatStream,
  "chip-picker": renderChipPicker,
  "result-card": renderResultCard,
  "store-cta": renderStoreCta,
};

function blockIdFromRef(blockRef) {
  const parts = String(blockRef || "").split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

function mergeSlots(copy, overrides = {}) {
  return { ...(copy?.slots ?? {}), ...overrides };
}

function applyTheme(root, theme = {}) {
  if (!theme || typeof theme !== "object") return;
  const el = root instanceof HTMLElement ? root : document.documentElement;
  if (theme.bg) el.style.setProperty("--pb-bg", theme.bg);
  if (theme.fg) el.style.setProperty("--pb-fg", theme.fg);
  if (theme.accent) el.style.setProperty("--pb-accent", theme.accent);
  if (theme.muted) el.style.setProperty("--pb-muted", theme.muted);
  if (theme.card) el.style.setProperty("--pb-card", theme.card);
}

/**
 * @param {{ root: HTMLElement, composition: object, copy: object, routeClass: string }} opts
 */
export function createPlayableEngine({ root, composition, copy, routeClass }) {
  if (!root) throw new Error("createPlayableEngine: root element required");

  applyTheme(root.closest(`.${routeClass}__app`) || root, copy.theme);

  const mode = composition.mode || (composition.screens ? "regions" : "flow");

  if (mode === "regions" && composition.screens?.length) {
    runRegions({ root, composition, copy, routeClass });
  } else {
    runFlow({ root, composition, copy, routeClass });
  }
}

function runFlow({ root, composition, copy, routeClass }) {
  const flow = composition.flow ?? [];
  let index = 0;

  function renderAt(i) {
    const step = flow[i];
    if (!step) return;

    const blockId = blockIdFromRef(step.blockRef);
    const render = BLOCK_RENDERERS[blockId];
    if (!render) {
      root.innerHTML = `<p class="pb-error">Unknown block: ${blockId}</p>`;
      return;
    }

    root.innerHTML = "";
    const host = document.createElement("div");
    host.className = `pb-step ${routeClass}__step ${routeClass}__step--${step.id}`;
    host.dataset.stepId = step.id;
    host.dataset.blockId = blockId;
    root.appendChild(host);

    const slots = mergeSlots(copy, step.copyOverrides);

    render(host, {
      step,
      slots,
      routeClass,
      onComplete: () => {
        index += 1;
        if (index < flow.length) renderAt(index);
      },
    });
  }

  renderAt(0);
}

function runRegions({ root, composition, copy, routeClass }) {
  const screen = composition.screens[0];
  root.innerHTML = "";

  const layout = document.createElement("div");
  layout.className = `pb-regions ${routeClass}__regions`;
  root.appendChild(layout);

  const order = ["header", "main", "footer"];
  const regions = screen.regions ?? {};

  for (const region of order) {
    const step = regions[region];
    if (!step) continue;

    const blockId = blockIdFromRef(step.blockRef);
    const render = BLOCK_RENDERERS[blockId];
    if (!render) continue;

    const host = document.createElement("div");
    host.className = `pb-region pb-region--${region} ${routeClass}__region ${routeClass}__region--${region}`;
    layout.appendChild(host);

    render(host, {
      step: { ...step, id: `${screen.id}:${region}` },
      slots: mergeSlots(copy, step.copyOverrides),
      routeClass,
      onComplete: () => {},
    });
  }
}
