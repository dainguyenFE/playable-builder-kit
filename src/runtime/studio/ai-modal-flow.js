/**
 * Interactive AI model picker → response stream → switch modal flow.
 */
import { trackEvent } from "./tracking.js";
import { bindStoreCta } from "../../skills/store-cta.js";
import { findAsset, resolveAssetSrc } from "./assets.js";

const MODEL_META = {
  Gemini: { icon: "✦", color: "#4285F4" },
  Grok: { icon: "𝕏", color: "#F5F5F5" },
  ChatGPT: { icon: "◈", color: "#10A37F" },
  Claude: { icon: "◉", color: "#D97757" },
};

const flowState = {
  models: ["Gemini", "Grok", "ChatGPT", "Claude"],
  question: "",
  selected: [],
};

function modelButtonHtml(name, { disabled = false } = {}) {
  const meta = MODEL_META[name] ?? { icon: "●", color: "#94a3b8" };
  return `<button type="button" class="pb-ai-model${disabled ? " pb-ai-model--disabled" : ""}" data-model="${name}" ${disabled ? "disabled" : ""}>
    <span class="pb-ai-model__icon" style="--model-color:${meta.color}">${meta.icon}</span>
    <span class="pb-ai-model__name">${name}</span>
  </button>`;
}

function renderAnswerBlock(block, assets) {
  switch (block.type) {
    case "card":
      return `<div class="pb-ai-answer-card">
        <p class="pb-ai-answer-card__title">${block.title ?? ""}</p>
        <p class="pb-ai-answer-card__body">${block.text ?? ""}</p>
      </div>`;
    case "list":
      return `<div class="pb-ai-answer-list">
        ${block.title ? `<p class="pb-ai-answer-list__title">${block.title}</p>` : ""}
        <ul>${(block.items ?? []).map((i) => `<li>${i}</li>`).join("")}</ul>
      </div>`;
    case "image": {
      const asset = block.assetId ? findAsset(assets, block.assetId) : null;
      const src = resolveAssetSrc(asset);
      const img = src
        ? `<img src="${src}" alt="" class="pb-ai-answer-img__photo"/>`
        : `<div class="pb-ai-answer-img__placeholder" aria-hidden="true"></div>`;
      return `<figure class="pb-ai-answer-img">${img}${block.caption ? `<figcaption>${block.caption}</figcaption>` : ""}</figure>`;
    }
    case "progress": {
      const pct = Math.min(100, Math.max(0, Number(block.value ?? block.percent ?? 72)));
      const label = block.label ?? block.title ?? "";
      return `<div class="pb-ai-answer-progress">
        ${label ? `<p class="pb-ai-answer-progress__label">${label}</p>` : ""}
        <div class="pb-ai-answer-progress__track"><span class="pb-ai-answer-progress__fill" style="--pb-progress:${pct}%"></span></div>
        <span class="pb-ai-answer-progress__pct">${pct}%</span>
      </div>`;
    }
    default:
      return `<p class="pb-ai-answer-text">${block.text ?? ""}</p>`;
  }
}

async function streamAnswer(container, blocks, assets, clock, speed = 12) {
  container.innerHTML = "";
  for (const block of blocks) {
    if (clock?.waitWhilePaused) await clock.waitWhilePaused();
    if (block.type === "text") {
      const p = document.createElement("p");
      p.className = "pb-ai-answer-text";
      container.appendChild(p);
      const full = block.text ?? "";
      for (let i = 0; i < full.length; i += 1) {
        if (clock?.waitWhilePaused) await clock.waitWhilePaused();
        p.textContent += full[i];
        await new Promise((r) => setTimeout(r, speed));
      }
    } else {
      const wrap = document.createElement("div");
      wrap.className = "pb-ai-answer-block pb-ai-answer-block--enter";
      wrap.innerHTML = renderAnswerBlock(block, assets);
      container.appendChild(wrap);
      await new Promise((r) => setTimeout(r, 180));
    }
  }
}

function initModelPicker(pickerEl, { onSelect, models }) {
  const list = pickerEl.querySelector("[data-ai-model-list]");
  if (!list) return () => {};

  const items = [...list.querySelectorAll(".pb-ai-model:not(.pb-ai-model--disabled)")];
  let index = 0;
  let picked = false;

  const tick = () => {
    if (picked || items.length === 0) return;
    items.forEach((el, i) => el.classList.toggle("pb-ai-model--active", i === index));
    index = (index + 1) % items.length;
  };

  tick();
  const timer = setInterval(tick, 750);

  const onClick = (e) => {
    const btn = e.target.closest(".pb-ai-model:not(.pb-ai-model--disabled)");
    if (!btn || picked) return;
    picked = true;
    clearInterval(timer);
    items.forEach((el) => el.classList.remove("pb-ai-model--active"));
    btn.classList.add("pb-ai-model--picked");
    const model = btn.dataset.model;
    trackEvent("model_selected", { model, step: "picker" });
    onSelect(model);
  };

  list.addEventListener("click", onClick);

  return () => {
    clearInterval(timer);
    list.removeEventListener("click", onClick);
  };
}

function showSwitchModal(overlay, { models, exclude, onPick }) {
  const remaining = models.filter((m) => m !== exclude);
  const modal = document.createElement("div");
  modal.className = "pb-ai-modal-switch";
  modal.innerHTML = `
    <div class="pb-ai-modal-switch__backdrop"></div>
    <div class="pb-ai-modal-switch__panel" role="dialog" aria-label="Compare models">
      <p class="pb-ai-modal-switch__title">Try another model</p>
      <p class="pb-ai-modal-switch__sub">See how a different AI answers the same prompt</p>
      <div class="pb-ai-modal-switch__list">
        ${remaining.map((m) => modelButtonHtml(m)).join("")}
      </div>
    </div>`;

  overlay.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add("pb-ai-modal-switch--visible"));

  const onClick = (e) => {
    const btn = e.target.closest(".pb-ai-model");
    if (!btn) return;
    const model = btn.dataset.model;
    trackEvent("model_selected", { model, step: "switch_modal" });
    modal.remove();
    onPick(model);
  };

  modal.addEventListener("click", onClick);
  return () => modal.remove();
}

async function initModelResponse(responseEl, opts) {
  const {
    model,
    question,
    blocks,
    assets,
    clock,
    overlay,
    models,
    showSwitchModal: withModal,
    onSwitch,
    content,
  } = opts;

  const badge = responseEl.querySelector("[data-selected-model]");
  const questionEl = responseEl.querySelector("[data-question-text]");
  const streamEl = responseEl.querySelector("[data-answer-stream]");

  if (badge) {
    const meta = MODEL_META[model] ?? { icon: "●", color: "#94a3b8" };
    badge.innerHTML = `<span class="pb-ai-model__icon" style="--model-color:${meta.color}">${meta.icon}</span><span>${model}</span>`;
  }
  if (questionEl) questionEl.textContent = question;

  responseEl.classList.remove("pb-el--hidden");
  const host = responseEl.closest(".pb-el") ?? responseEl;
  host.classList.remove("pb-el--hidden");
  await streamAnswer(streamEl, blocks, assets, clock, 10);

  if (withModal && overlay && onSwitch) {
    await new Promise((r) => setTimeout(r, 400));
    showSwitchModal(overlay, { models, exclude: model, onPick: onSwitch });
  } else if (content) {
    const cta = content.querySelector(".pb-el--cta-button");
    cta?.classList.remove("pb-el--hidden");
    const btn = content.querySelector("#cta");
    if (btn) {
      btn.classList.add("pb-btn--cta-live", "pb-anim-cta-attention");
      bindStoreCta("#cta");
    }
  }

  opts.onComplete?.();
}

export function resetAiModalFlow() {
  flowState.selected = [];
}

export function initAiModalFlow({
  screen,
  content,
  overlayLayer,
  context,
  assets,
  navigate,
  clock,
}) {
  const models = context.aiModels ?? flowState.models;
  const question = context.userQuestion ?? "";
  const blocks = context.aiAnswerBlocks ?? [];
  flowState.models = models;
  flowState.question = question;

  const picker = content.querySelector(".pb-ai-modal-picker");
  const responseWrap = content.querySelector(".pb-el--ai-model-response");
  const response = responseWrap?.querySelector(".pb-ai-modal-response");
  const cleanups = [];

  if (picker) {
    cleanups.push(
      initModelPicker(picker, {
        models,
        onSelect: (model) => {
          flowState.selected = [model];
          navigate(screen.clickNext?.target || "screen_2");
        },
      }),
    );
  }

  if (response && responseWrap) {
    const variant = responseWrap.dataset.variant || "primary";
    const model = flowState.selected[flowState.selected.length - 1] ?? models[0];
    const hasPicker = Boolean(picker);
    const showSwitchModal = variant === "primary" && hasPicker;

    initModelResponse(response, {
      model,
      question,
      blocks,
      assets,
      clock,
      overlay: overlayLayer,
      models,
      content,
      showSwitchModal,
      onSwitch: (nextModel) => {
        flowState.selected.push(nextModel);
        navigate(screen.clickNext?.target || "screen_3");
      },
      onComplete: () => {
        if (!showSwitchModal && screen.autoNext?.enabled && screen.autoNext.target) {
          const delay = screen.autoNext.afterStreamMs ?? screen.autoNext.afterMs ?? 1200;
          setTimeout(() => navigate(screen.autoNext.target), delay);
        }
      },
    });
  }

  return () => cleanups.forEach((fn) => fn());
}
