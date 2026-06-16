import { ANIMATION_CLASSES } from "./registries.js";
import { findAsset, resolveAssetSrc } from "./assets.js";
import { appHeaderIconHtml } from "./brand-icons.js";
import { delayWithClock } from "./playback-clock.js";

function resolveText(el, context, playable) {
  if (el.text) return el.text;
  if (el.textKey && context[el.textKey] != null) return String(context[el.textKey]);
  if (el.textKey === "ctaLabel" && playable?.cta?.label) return playable.cta.label;
  if (el.textKey === "productName" && context.productName) return context.productName;
  return "";
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Plain copy from JSON — undo entities if bundle was HTML-embedded twice. */
function normalizeCopyText(s) {
  return String(s)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/** Plain CTA label — no per-character animation. */
function ctaLabelHtml(text) {
  return escapeHtml(text || "Get the app");
}

/** Theme-tinted Lucide icon (mask + accent color — readable on any background). */
function themedIconHtml(src, extraClass = "") {
  if (!src) {
    return `<span class="pb-icon-themed pb-icon-themed--dot ${extraClass}" aria-hidden="true"></span>`;
  }
  const safe = escapeHtml(src);
  return `<span class="pb-icon-themed ${extraClass}" style="-webkit-mask-image:url('${safe}');mask-image:url('${safe}')" aria-hidden="true"></span>`;
}

function resolveBackgroundStyle(el, context, assets) {
  const fill = el.fill || {};
  const type = fill.type || el.bgType || "mesh";

  if (el.textKey && context[el.textKey]) {
    return { background: context[el.textKey] };
  }

  if (type === "gradient") {
    const g = fill.value || el.gradient || context.backgroundGradient;
    if (g) return { background: g };
  }
  if (type === "solid") {
    const c = fill.color || el.color || context.backgroundColor;
    if (c) return { background: c };
  }
  if (type === "image" && (fill.assetId || el.assetId)) {
    const asset = findAsset(assets, fill.assetId || el.assetId);
    const src = resolveAssetSrc(asset);
    if (src) {
      return {
        backgroundImage: `url("${src}")`,
        backgroundSize: fill.size || "cover",
        backgroundPosition: fill.position || "center",
      };
    }
  }
  /* mesh — accent glow + base (prompt-friendly default) */
  const mesh = fill.value || el.gradient || context.backgroundMesh;
  if (mesh) return { background: mesh };
  return {
    background: `radial-gradient(ellipse 130% 90% at 50% -15%, color-mix(in srgb, var(--pb-accent, #7c3aed) 38%, transparent), transparent 58%), radial-gradient(ellipse 80% 50% at 100% 100%, color-mix(in srgb, var(--pb-accent, #7c3aed) 18%, transparent), transparent 50%), var(--pb-bg, #0f172a)`,
  };
}

function applyElementTypography(node, el) {
  const t = el.typography;
  if (!t) return;
  let hasCustom = false;
  if (t.fontSize != null) {
    node.style.setProperty(
      "--pb-zone-font-size",
      `calc(${Number(t.fontSize)} / var(--pb-design-w) * 100cqw)`,
    );
    hasCustom = true;
  }
  if (t.color) {
    node.style.setProperty("--pb-zone-color", t.color);
    hasCustom = true;
  }
  if (hasCustom) node.classList.add("pb-el--custom-typography");
}

function createElement(el, context, playable, assets) {
  const text = resolveText(el, context, playable);
  const node = document.createElement("div");
  node.dataset.target = el.id;
  node.className = `pb-el pb-el--${el.type}`;
  if (el.hidden) node.classList.add("pb-el--hidden");
  if (el.variant) node.dataset.variant = el.variant;

  switch (el.type) {
    case "background": {
      const style = resolveBackgroundStyle(el, context, assets);
      Object.assign(node.style, style);
      if (el.overlay) {
        node.style.boxShadow = `inset 0 0 calc(120 / var(--pb-design-w) * 100cqw) color-mix(in srgb, var(--pb-bg) 40%, transparent)`;
      }
      break;
    }
    case "lottie": {
      if (el.variant === "overlay" || el.variant === "cta-hand") node.classList.add("pb-el--overlay");
      const lottieCls =
        el.variant === "overlay"
          ? "pb-lottie pb-lottie--overlay"
          : el.variant === "cta-hand"
            ? "pb-lottie pb-lottie--cta-hand"
            : el.variant === "cta-arrow-lottie"
              ? "pb-lottie pb-lottie--cta-arrow"
              : el.variant === "cta"
                ? "pb-lottie pb-lottie--cta"
                : "pb-lottie";
      node.innerHTML = `<div class="${lottieCls}" data-lottie-asset="${escapeHtml(el.assetId || "")}"></div>`;
      break;
    }
    case "image":
    case "hero-image": {
      const asset = findAsset(assets, el.assetId);
      const src = resolveAssetSrc(asset);
      const alt = el.alt || context.productName || "";
      node.innerHTML = "";
      const wrap = document.createElement("div");
      wrap.className = `pb-image pb-image--${el.variant || "hero"}`;
      if (src) {
        const img = document.createElement("img");
        img.src = src;
        img.alt = alt;
        img.loading = "eager";
        wrap.appendChild(img);
      } else {
        wrap.classList.add("pb-image--placeholder");
      }
      node.appendChild(wrap);
      break;
    }
    case "headline":
    case "headline-block":
      node.innerHTML = `<h1 class="pb-headline">${escapeHtml(text)}</h1>`;
      break;
    case "subheadline":
    case "subheadline-block":
      node.innerHTML = `<p class="pb-subhead">${escapeHtml(text)}</p>`;
      break;
    case "problem-card":
      node.innerHTML = `<div class="pb-card pb-card--glass"><p class="pb-body">${escapeHtml(text)}</p></div>`;
      break;
    case "app-header": {
      const headerName =
        el.name ??
        (el.nameKey && context[el.nameKey] != null ? String(context[el.nameKey]) : null) ??
        context.productName ??
        "AI App";
      node.innerHTML = `<div class="pb-app-header">
        ${appHeaderIconHtml(el)}
        <span class="pb-app-header__name">${escapeHtml(headerName)}</span>
        <span class="pb-app-header__badge">${escapeHtml(el.badge || context.featureBadge || "AI")}</span>
      </div>`;
      break;
    }
    case "feature-pills": {
      const pills = (el.keys || ["feature1", "feature2", "feature3"])
        .map((k) => context[k])
        .filter(Boolean);
      node.innerHTML = `<div class="pb-pills">${pills
        .map((p) => `<span class="pb-pill">${escapeHtml(p)}</span>`)
        .join("")}</div>`;
      break;
    }
    case "prompt-input":
      node.innerHTML = `<div class="pb-input-wrap pb-input-wrap--accent">
        <span class="pb-input-label">${escapeHtml(el.label || "Prompt")}</span>
        <div class="pb-input" data-typewriter></div>
      </div>`;
      break;
    case "ai-loading":
    case "ai-loading-card":
      node.innerHTML = `<div class="pb-loading-card">
        <div class="pb-loading-card__shimmer"></div>
        <p class="pb-loading-card__text">${escapeHtml(el.loadingText || context.loadingText || "AI generating…")}</p>
      </div>`;
      break;
    case "ai-result-card":
      node.innerHTML = `<div class="pb-result-card pb-result-card--studio">
        <span class="pb-result-card__dot"></span>
        <p class="pb-result-card__body">${escapeHtml(text)}</p>
      </div>`;
      break;
    case "chat-bubble-user":
      node.innerHTML = `<div class="pb-bubble pb-bubble--user"><span data-typewriter>${escapeHtml(text)}</span></div>`;
      break;
    case "chat-bubble-ai":
      node.innerHTML = `<div class="pb-bubble pb-bubble--ai"><span data-typewriter>${escapeHtml(text)}</span></div>`;
      break;
    case "typing-indicator":
      node.innerHTML = `<div class="pb-typing" aria-label="AI typing"><span></span><span></span><span></span></div>`;
      break;
    case "plan-board": {
      const tasks = [
        { col: "todo", text: context.planTask1 },
        { col: "doing", text: context.planTask2 },
        { col: "doing", text: context.planTask3 },
        { col: "done", text: context.planTask4 },
      ].filter((t) => t.text);
      const cols = [
        { id: "todo", label: context.planColTodo || "To do" },
        { id: "doing", label: context.planColDoing || "In progress" },
        { id: "done", label: context.planColDone || "Done" },
      ];
      node.innerHTML = `<div class="pb-plan-board">${cols
        .map(
          (c) => `<div class="pb-plan-col pb-plan-col--${c.id}">
            <span class="pb-plan-col__label">${escapeHtml(c.label)}</span>
            ${tasks
              .filter((t) => t.col === c.id)
              .map((t, i) => `<div class="pb-plan-task" style="--task-i:${i}">${escapeHtml(t.text)}</div>`)
              .join("")}
          </div>`,
        )
        .join("")}</div>`;
      break;
    }
    case "image-canvas": {
      const prompt = context.imagePrompt || text || "A sunset over mountains";
      const variant = el.variant || context.imageVariant || "dream";
      const asset = findAsset(assets, el.assetId || context.imageAssetId);
      const src = resolveAssetSrc(asset);
      const art = src
        ? `<img class="pb-image-canvas__img" src="${escapeHtml(src)}" alt=""/>`
        : `<div class="pb-image-canvas__art"></div>`;
      node.innerHTML = `<div class="pb-image-canvas pb-image-canvas--${variant}">
        ${art}
        <div class="pb-image-canvas__meta">
          <span class="pb-image-canvas__tag">Generated</span>
          <p class="pb-image-canvas__prompt">${escapeHtml(prompt)}</p>
        </div>
      </div>`;
      break;
    }
    case "image-compare": {
      const beforeAsset = findAsset(assets, el.beforeAssetId || context.beforeAssetId);
      const afterAsset = findAsset(assets, el.afterAssetId || context.afterAssetId);
      const beforeSrc = resolveAssetSrc(beforeAsset);
      const afterSrc = resolveAssetSrc(afterAsset);
      const beforeVar = el.beforeVariant || "photo";
      const afterVar = el.afterVariant || "art";
      node.innerHTML = `<div class="pb-image-compare">
        <div class="pb-image-compare__pane pb-image-compare__pane--before" data-variant="${beforeVar}"${beforeSrc ? ` style="background-image:url('${beforeSrc}')"` : ""}>
          <span class="pb-image-compare__label">${escapeHtml(context.beforeLabel || "Before")}</span>
        </div>
        <div class="pb-image-compare__pane pb-image-compare__pane--after" data-variant="${afterVar}"${afterSrc ? ` style="background-image:url('${afterSrc}')"` : ""}>
          <span class="pb-image-compare__label">${escapeHtml(context.afterLabel || "After")}</span>
        </div>
        <div class="pb-image-compare__divider" aria-hidden="true"></div>
      </div>`;
      break;
    }
    case "audio-player":
      node.innerHTML = `<div class="pb-audio-player">
        <div class="pb-audio-player__cover" aria-hidden="true">♪</div>
        <div class="pb-audio-player__info">
          <p class="pb-audio-player__title">${escapeHtml(context.audioTitle || text || "Voice preview")}</p>
          <p class="pb-audio-player__meta">${escapeHtml(context.audioMeta || "Neural voice · HD")}</p>
        </div>
        <div class="pb-audio-player__wave" aria-hidden="true">${Array.from({ length: 24 })
          .map((_, i) => `<span style="--bar-i:${i}"></span>`)
          .join("")}</div>
        <div class="pb-audio-player__progress"><span class="pb-audio-player__progress-fill"></span></div>
        <span class="pb-audio-player__time">${escapeHtml(context.audioDuration || "0:12")}</span>
      </div>`;
      break;
    case "cta-button":
    case "cta_button": {
      const ctaLabel = text || "Get the app";
      node.innerHTML = `<button type="button" class="pb-btn pb-btn--cta" id="cta" aria-label="${escapeHtml(ctaLabel)}"><span class="pb-cta-label">${ctaLabelHtml(ctaLabel)}</span></button>`;
      break;
    }
    case "tap-hint":
      node.innerHTML = `<p class="pb-tap-hint">${escapeHtml(text || "Tap to continue")}</p>`;
      break;
    case "cta-arrow":
      node.innerHTML = `<div class="pb-cta-arrow" aria-hidden="true">
        <span class="pb-cta-arrow__line"></span>
        <span class="pb-cta-arrow__head">▼</span>
      </div>`;
      break;
    case "cta-download-hint":
      node.innerHTML = `<p class="pb-cta-download-hint">${escapeHtml(resolveText(el, context, playable) || "Tap below to get the app")}</p>`;
      break;
    case "stat-strip": {
      const stats = (el.keys || ["stat1", "stat2", "stat3"]).map((k, i) => ({
        value: context[k] || context[`stat${i + 1}`],
        label: context[`${k}Label`] || context[`statLabel${i + 1}`] || "",
      }));
      node.innerHTML = `<div class="pb-stat-strip">${stats
        .filter((s) => s.value)
        .map(
          (s) => `<div class="pb-stat-strip__item">
            <span class="pb-stat-strip__value">${escapeHtml(s.value)}</span>
            <span class="pb-stat-strip__label">${escapeHtml(s.label)}</span>
          </div>`,
        )
        .join("")}</div>`;
      break;
    }
    case "feature-grid": {
      const items = el.items || [
        { iconKey: "featureIcon1", titleKey: "feature1", textKey: "feature1Text" },
        { iconKey: "featureIcon2", titleKey: "feature2", textKey: "feature2Text" },
        { iconKey: "featureIcon3", titleKey: "feature3", textKey: "feature3Text" },
        { iconKey: "featureIcon4", titleKey: "feature4", textKey: "feature4Text" },
      ];
      node.innerHTML = `<div class="pb-feature-grid">${items
        .map((item) => {
          const assetId = el[item.iconKey] || context[item.iconKey];
          const asset = assetId ? findAsset(assets, assetId) : null;
          const src = resolveAssetSrc(asset);
          const title = context[item.titleKey] || "";
          const body = context[item.textKey] || "";
          if (!title && !body) return "";
          const icon = src
            ? themedIconHtml(src, "pb-feature-grid__icon")
            : `<span class="pb-feature-grid__icon pb-icon-themed pb-icon-themed--dot" aria-hidden="true"></span>`;
          return `<div class="pb-feature-grid__cell">${icon}<p class="pb-feature-grid__title">${escapeHtml(title)}</p><p class="pb-feature-grid__text">${escapeHtml(body)}</p></div>`;
        })
        .join("")}</div>`;
      break;
    }
    case "quote-card":
      node.innerHTML = `<blockquote class="pb-quote-card">
        <p class="pb-quote-card__text">${escapeHtml(text || context.quoteText || "")}</p>
        <cite class="pb-quote-card__cite">${escapeHtml(context.quoteAuthor || "")}</cite>
      </blockquote>`;
      break;
    case "benefit-list": {
      const keys = el.keys || ["benefit1", "benefit2", "benefit3", "benefit4"];
      const title = context.benefitsTitle || el.title || "What you'll get";
      node.innerHTML = `<div class="pb-benefit-list">
        <p class="pb-benefit-list__title">${escapeHtml(title)}</p>
        <ul>${keys
          .map((k) => context[k])
          .filter(Boolean)
          .map((item) => `<li><span class="pb-benefit-list__check" aria-hidden="true">✓</span><span class="pb-benefit-list__text">${escapeHtml(normalizeCopyText(item))}</span></li>`)
          .join("")}</ul>
      </div>`;
      break;
    }
    case "benefit-title":
      node.innerHTML = `<p class="pb-benefit-title">${escapeHtml(normalizeCopyText(text || context.benefitsTitle || "What you'll get"))}</p>`;
      break;
    case "benefit-item":
      node.innerHTML = `<div class="pb-benefit-item"><span class="pb-benefit-item__check" aria-hidden="true">✓</span><span class="pb-benefit-item__text">${escapeHtml(normalizeCopyText(text || context[el.textKey] || ""))}</span></div>`;
      break;
    case "free-badge":
      node.innerHTML = `<span class="pb-free-badge">${escapeHtml(text || context.freeBadge || "Free to try")}</span>`;
      break;
    case "compare-bars": {
      const rows = context.compareRows || el.rows || [
        { label: "Manual", value: 28, variant: "manual" },
        { label: "With AI", value: 92, variant: "ai" },
      ];
      node.innerHTML = `<div class="pb-compare-bars">
        ${context.compareTitle ? `<p class="pb-compare-bars__title">${escapeHtml(context.compareTitle)}</p>` : ""}
        ${rows
          .map(
            (r) => `<div class="pb-compare-bars__row pb-compare-bars__row--${r.variant || "ai"}">
            <span class="pb-compare-bars__label">${escapeHtml(r.label)}</span>
            <div class="pb-compare-bars__track"><span class="pb-compare-bars__fill" style="--bar-pct:${r.value}%"></span></div>
            <span class="pb-compare-bars__pct">${r.value}%</span>
          </div>`,
          )
          .join("")}
      </div>`;
      break;
    }
    case "quiz-options": {
      const question = context[el.questionKey || "quizQuestion"] || text || "Pick one";
      const options = context[el.optionsKey || "quizOptions"] || [];
      node.innerHTML = `<div class="pb-quiz" data-quiz-options data-options-key="${escapeHtml(el.optionsKey || "quizOptions")}" data-question-key="${escapeHtml(el.questionKey || "quizQuestion")}">
        <p class="pb-quiz__question">${escapeHtml(question)}</p>
        <div class="pb-quiz__options">${options
          .map(
            (o, i) => `<button type="button" class="pb-quiz__opt" data-quiz-index="${i}" data-quiz-target="${escapeHtml(o.targetScreen || "")}">
              ${o.iconId ? themedIconHtml(resolveAssetSrc(findAsset(assets, o.iconId)) || "", "pb-quiz__opt-icon") : ""}
              <span>${escapeHtml(o.label || o.text || "")}</span>
            </button>`,
          )
          .join("")}</div>
        <div class="pb-quiz__result pb-el--hidden" data-quiz-result></div>
      </div>`;
      break;
    }
    case "cta-teaser": {
      const label = text || context.ctaTeaser || context.cta || "Try free";
      node.innerHTML = `<button type="button" class="pb-btn pb-btn--cta pb-btn--teaser" id="cta-teaser" aria-hidden="true"><span>${escapeHtml(label)}</span></button>`;
      break;
    }
    case "model-compare-cards": {
      const models = context.modelCompare || [
        { name: "Manual", score: "12 min", sub: "Average research time" },
        { name: "NovaChat", score: "18 sec", sub: "Same question answered" },
      ];
      node.innerHTML = `<div class="pb-model-compare">${models
        .map(
          (m, i) => `<div class="pb-model-compare__card${i === models.length - 1 ? " pb-model-compare__card--winner" : ""}">
            <span class="pb-model-compare__name">${escapeHtml(m.name)}</span>
            <span class="pb-model-compare__score">${escapeHtml(m.score)}</span>
            <span class="pb-model-compare__sub">${escapeHtml(m.sub || "")}</span>
          </div>`,
        )
        .join("")}</div>`;
      break;
    }
    case "ai-model-picker": {
      const models = el.models ?? context.aiModels ?? ["Gemini", "Grok", "ChatGPT", "Claude"];
      const question = el.textKey && context[el.textKey] != null ? String(context[el.textKey]) : text;
      node.innerHTML = `<div class="pb-ai-modal-picker">
        <p class="pb-ai-modal-picker__question">${escapeHtml(question)}</p>
        <div class="pb-ai-model-list" data-ai-model-list>
          ${models.map((m) => {
            const meta = { Gemini: "✦", Grok: "𝕏", ChatGPT: "◈", Claude: "◉" };
            const colors = { Gemini: "#4285F4", Grok: "#F5F5F5", ChatGPT: "#10A37F", Claude: "#D97757" };
            const icon = meta[m] ?? "●";
            const color = colors[m] ?? "#94a3b8";
            return `<button type="button" class="pb-ai-model" data-model="${escapeHtml(m)}">
              <span class="pb-ai-model__icon" style="--model-color:${color}">${icon}</span>
              <span class="pb-ai-model__name">${escapeHtml(m)}</span>
            </button>`;
          }).join("")}
        </div>
      </div>`;
      break;
    }
    case "ai-model-response": {
      const variant = el.variant || "primary";
      node.dataset.variant = variant;
      node.innerHTML = `<div class="pb-ai-modal-response">
        <div class="pb-ai-modal-response__top">
          <div class="pb-ai-model-badge" data-selected-model></div>
        </div>
        <div class="pb-ai-modal-response__chat">
          <div class="pb-ai-modal-response__question">
            <div class="pb-bubble pb-bubble--user"><span data-question-text></span></div>
          </div>
          <div class="pb-ai-modal-response__answer" data-answer-stream></div>
        </div>
      </div>`;
      break;
    }
    default:
      node.innerHTML = `<p class="pb-body">${escapeHtml(text)}</p>`;
  }
  applyElementTypography(node, el);
  return node;
}

export function renderScreenElements(screen, context, playable, assets = { assets: [] }) {
  const bgFrag = document.createDocumentFragment();
  const contentFrag = document.createDocumentFragment();
  const overlayFrag = document.createDocumentFragment();
  const map = new Map();
  const lottieMounts = [];

  const sorted = [...(screen.elements ?? [])].sort((a, b) => {
    if (a.type === "background") return -1;
    if (b.type === "background") return 1;
    return 0;
  });

  for (const el of sorted) {
    const node = createElement(el, context, playable, assets);
    map.set(el.id, node);
    if (el.type === "lottie" && el.assetId) {
      const mount = node.querySelector(".pb-lottie");
      if (mount) lottieMounts.push({ el: mount, assetId: el.assetId });
    }
    if (el.type === "background") {
      bgFrag.appendChild(node);
    } else if (
      el.type === "lottie" &&
      (el.variant === "overlay" || el.variant === "cta-hand" || el.variant === "cta-arrow-lottie")
    ) {
      overlayFrag.appendChild(node);
    } else if (screen.ctaLayout === "overlay" && el.type === "cta-button") {
      overlayFrag.appendChild(node);
    } else {
      contentFrag.appendChild(node);
    }
  }
  return { bgFrag, contentFrag, overlayFrag, map, lottieMounts };
}

export function applyAnimation(node, animation) {
  if (!animation || !node) return;
  const cls = ANIMATION_CLASSES[animation];
  if (cls) {
    node.classList.remove("pb-el--hidden");
    node.classList.add(cls);
  }
}

export async function runTypeText(node, value, speed = 28, clock) {
  const target = node.querySelector("[data-typewriter]") || node;
  target.textContent = "";
  node.classList.remove("pb-el--hidden");
  for (let i = 0; i < value.length; i += 1) {
    if (clock?.waitWhilePaused) await clock.waitWhilePaused();
    target.textContent += value[i];
    await delayWithClock(clock, speed);
  }
}
