import {
  formatZoneChatPrompt,
  formatZoneShortChatPrompt,
  formatTransitionShortChatPrompt,
  formatLayoutShortChatPrompt,
  screenById,
} from "/src/runtime/studio/zone-index.js";
import { addToChat } from "./add-to-chat.js";
import { getChatTargetLabel } from "./chat-target.js";

/**
 * Inspector: Screens (connected by lines) → Zones (preview sync via pb-screen-change).
 */
export function initZonePanel({ panelEl, copyBtnEl, toggleZonesEl }) {
  if (!panelEl) return;

  /** Screen the user picked in the inspector (zones follow this). */
  let userSelectedScreenId = null;
  let selectedZoneId = null;
  /** Screen currently shown in the preview player. */
  let activeScreenId = null;
  let lastZoneIndex = null;

  function renderZoneCard(zone, isSelected) {
    const steps = zone.steps?.length
      ? zone.steps
          .map(
            (s) =>
              `<li><code>${s.atMs}ms</code> ${s.action}${s.animation ? ` · <em>${s.animation}</em>` : ""}${s.value ? ` · "${escapeHtml(truncate(s.value, 48))}"` : ""}</li>`,
          )
          .join("")
      : "<li class='pb-zone-panel__muted'>No steps</li>";

    return `<div class="pb-zone-card${isSelected ? " pb-zone-card--active" : ""}" data-zone-id="${zone.zoneId}" data-screen-id="${zone.screenId}">
      <div class="pb-zone-card__row">
        <div class="pb-zone-card__main">
          <span class="pb-zone-card__num">Zone ${zone.screenZoneNumber}</span>
          <strong class="pb-zone-card__id">${escapeHtml(zone.zoneId)}</strong>
          <span class="pb-zone-card__type">${escapeHtml(zone.elementType)}</span>
          ${zone.textKey ? `<span class="pb-zone-card__slot">context.${escapeHtml(zone.textKey)}</span>` : ""}
        </div>
        <button type="button" class="pb-zone-card__chat" data-zone-chat="${escapeHtml(zone.zoneId)}" title="Add zone context to chat">Add to chat</button>
      </div>
      ${zone.text ? `<p class="pb-zone-card__text" title="${escapeHtml(zone.text)}">"${escapeHtml(zone.text)}"</p>` : ""}
      <ul class="pb-zone-card__steps">${steps}</ul>
    </div>`;
  }

  function renderLayoutBlock(layout, screen) {
    if (!layout || !screen) return "";
    return `<div class="pb-zone-panel__layout">
      <div class="pb-zone-panel__layout-head">
        <div>
          <span class="pb-zone-panel__label">Layout padding</span>
          <span class="pb-layout-card__screen">Screen ${screen.screenNumber} · ${escapeHtml(screen.name)}</span>
        </div>
        <button type="button" class="pb-zone-card__chat pb-layout-card__chat" data-layout-screen="${escapeHtml(screen.screenId)}" title="Add layout padding context to chat">Add to chat</button>
      </div>
      <p class="pb-zone-panel__layout-values"><code>insetX=${layout.insetX}</code> <code>insetY=${layout.insetY}</code> <code>bottom=${layout.insetBottom}</code> <code>gap=${layout.gap}</code></p>
    </div>`;
  }

  function transitionTypeLabel(type) {
    if (type === "auto") return "auto";
    if (type === "tap") return "tap";
    if (type === "auto-tap") return "auto+tap";
    return "";
  }

  function renderTransitionBlock(screen) {
    const t = screen.transition;
    if (!t?.hasTransition) return "";

    const items = [];
    if (t.estimatedViewMs != null) {
      items.push(
        `<li><strong>View time</strong> <code>${escapeHtml(t.estimatedViewLabel)}</code> <span class="pb-zone-panel__muted">est.</span></li>`,
      );
    } else if (!t.autoNext) {
      items.push(`<li><strong>View time</strong> <code>tap</code></li>`);
    }
    if (t.autoNext) {
      const afterLabel = t.autoNext.viewAfterLabel ?? t.estimatedViewLabel ?? "tap";
      items.push(
        `<li><strong>Auto</strong> → <code>${escapeHtml(t.autoNext.target)}</code> after <code>${escapeHtml(afterLabel)}</code></li>`,
      );
    }
    if (t.clickNext) {
      items.push(
        `<li><strong>Tap</strong> → <code>${escapeHtml(t.clickNext.target)}</code></li>`,
      );
    }
    if (t.enterAnimation) {
      items.push(`<li><strong>Animation</strong> <code>${escapeHtml(t.enterAnimation)}</code></li>`);
    }
    if (t.enterEasing) {
      items.push(`<li><strong>Easing</strong> <code>${escapeHtml(t.enterEasing)}</code></li>`);
    }
    if (t.enterDurationMs != null) {
      items.push(`<li><strong>Anim duration</strong> <code>${t.enterDurationMs}ms</code></li>`);
    }

    const typeLabel = transitionTypeLabel(t.transitionType);

    return `<div class="pb-zone-panel__transition pb-zone-panel__transition--${escapeHtml(t.transitionType || "none")}" data-transition-screen="${screen.screenId}">
      <div class="pb-zone-panel__transition-head">
        <div>
          <span class="pb-zone-panel__label">Transition${typeLabel ? ` · <span class="pb-transition-card__type">${escapeHtml(typeLabel)}</span>` : ""}</span>
          <strong class="pb-transition-card__id">${escapeHtml(t.transitionId)}</strong>
          <span class="pb-transition-card__label">${escapeHtml(t.transitionLabel)}</span>
        </div>
        <button type="button" class="pb-zone-card__chat pb-transition-card__chat" data-transition-chat="${escapeHtml(screen.screenId)}" title="Add transition to chat">Add to chat</button>
      </div>
      <ul class="pb-zone-panel__transition-list">${items.join("")}</ul>
    </div>`;
  }

  function renderScreenConnector() {
    return `<span class="pb-screen-connector" aria-hidden="true"></span>`;
  }

  function renderScreenCard(screen, inspectScreenId, activeScreenId) {
    const isActive = screen.screenId === activeScreenId;
    const isSelected = screen.screenId === inspectScreenId;
    const t = screen.transition;
    const viewLabel = t.estimatedViewLabel ?? (t.autoNext?.viewAfterLabel ?? null);
    const trans = t.autoNext
      ? `auto ${viewLabel ?? "—"}`
      : t.clickNext
        ? "tap"
        : viewLabel ?? "—";
    return `<button type="button" class="pb-screen-card${isSelected ? " pb-screen-card--selected" : ""}${isActive ? " pb-screen-card--live" : ""}" data-screen-id="${screen.screenId}" title="${escapeHtml(screen.screenId)}">
        <span class="pb-screen-card__num">Screen ${screen.screenNumber}${screen.isEntry ? " ★" : ""}</span>
        <strong class="pb-screen-card__name">${escapeHtml(screen.name)}</strong>
        <span class="pb-screen-card__meta">${screen.zoneCount} zones · ${trans}</span>
        ${isActive ? '<span class="pb-screen-card__live">▶ preview</span>' : ""}
      </button>`;
  }

  function renderScreenList(zoneIndex, inspectScreenId, activeScreenId) {
    const parts = [];
    for (let i = 0; i < zoneIndex.screens.length; i += 1) {
      const screen = zoneIndex.screens[i];
      parts.push(renderScreenCard(screen, inspectScreenId, activeScreenId));
      if (screen.transition?.hasTransition) {
        parts.push(renderScreenConnector());
      }
    }
    return parts.join("");
  }

  function getInspectScreenId(zoneIndex) {
    return userSelectedScreenId ?? activeScreenId ?? zoneIndex.screens[0]?.screenId;
  }

  function capturePanelScroll() {
    return {
      zoneList: panelEl.querySelector(".pb-zone-panel__list")?.scrollTop ?? 0,
      screenList: panelEl.querySelector(".pb-zone-panel__screen-list")?.scrollLeft ?? 0,
    };
  }

  function restorePanelScroll(scroll) {
    if (!scroll) return;
    requestAnimationFrame(() => {
      const zoneList = panelEl.querySelector(".pb-zone-panel__list");
      const screenList = panelEl.querySelector(".pb-zone-panel__screen-list");
      if (zoneList) zoneList.scrollTop = scroll.zoneList;
      if (screenList) screenList.scrollLeft = scroll.screenList;
    });
  }

  /** Toggle selected/active styles without rebuilding the panel (keeps zone list scroll). */
  function updateSelectionHighlight(zoneIndex) {
    if (!zoneIndex) return;
    const inspectScreenId = getInspectScreenId(zoneIndex);
    panelEl.querySelectorAll(".pb-zone-card").forEach((card) => {
      card.classList.toggle(
        "pb-zone-card--active",
        card.dataset.zoneId === selectedZoneId && card.dataset.screenId === inspectScreenId,
      );
    });
    panelEl.querySelectorAll(".pb-screen-card").forEach((btn) => {
      btn.classList.toggle("pb-screen-card--selected", btn.dataset.screenId === inspectScreenId);
      btn.classList.toggle("pb-screen-card--live", btn.dataset.screenId === activeScreenId);
    });
  }

  function renderEmpty(message) {
    panelEl.innerHTML = `<p class="pb-zone-panel__empty">${message}</p>`;
  }

  function render() {
    const zoneIndex = lastZoneIndex;
    if (!zoneIndex?.screens?.length) {
      renderEmpty("No screens in scenario.");
      return;
    }

    const inspectScreenId =
      userSelectedScreenId ?? activeScreenId ?? zoneIndex.screens[0]?.screenId;
    const inspectScreen = screenById(zoneIndex, inspectScreenId);

    const screenCards = renderScreenList(
      zoneIndex,
      inspectScreenId,
      activeScreenId,
    );

    const zones = inspectScreen?.zones ?? [];
    const zonesHtml = zones.length
      ? zones
          .map((z) =>
            renderZoneCard(
              z,
              z.zoneId === selectedZoneId && z.screenId === inspectScreenId,
            ),
          )
          .join("")
      : `<p class="pb-zone-panel__empty">No zones on this screen.</p>`;

    const scroll = capturePanelScroll();
    panelEl.innerHTML = `
      <div class="pb-zone-panel__section pb-zone-panel__section--screens">
        <span class="pb-zone-panel__label">Screens (${zoneIndex.screenCount})</span>
        <div class="pb-zone-panel__screen-list" role="list">${screenCards}</div>
      </div>
      ${inspectScreen?.transition?.hasTransition ? renderTransitionBlock(inspectScreen) : ""}
      ${renderLayoutBlock(zoneIndex.layout, inspectScreen)}
      <div class="pb-zone-panel__section pb-zone-panel__section--zones">
        <span class="pb-zone-panel__label">Zones — ${escapeHtml(inspectScreen?.name || "")} <span class="pb-zone-panel__muted">(${zones.length})</span></span>
        <div class="pb-zone-panel__list">${zonesHtml}</div>
      </div>
    `;

    restorePanelScroll(scroll);
    resizeInspector(zoneIndex);
    bindPanelHandlers(zoneIndex);
  }

  function bindPanelHandlers(zoneIndex) {
    panelEl.querySelectorAll(".pb-screen-card").forEach((btn) => {
      btn.addEventListener("click", () => {
        const screenId = btn.dataset.screenId;
        userSelectedScreenId = screenId;
        selectedZoneId = null;
        window.__PB_HIGHLIGHT_ZONE__?.(null);
        window.__PB_GOTO_SCREEN__?.(screenId);
        render();
        if (copyBtnEl) copyBtnEl.disabled = false;
      });
    });

    panelEl.querySelectorAll(".pb-zone-card").forEach((card) => {
      card.addEventListener("click", (ev) => {
        if (ev.target.closest(".pb-zone-card__chat")) return;
        selectedZoneId = card.dataset.zoneId;
        userSelectedScreenId = card.dataset.screenId || userSelectedScreenId;
        window.__PB_HIGHLIGHT_ZONE__?.(selectedZoneId);
        updateSelectionHighlight(zoneIndex);
        if (copyBtnEl) copyBtnEl.disabled = false;
      });
    });

    panelEl.querySelectorAll(".pb-zone-card__chat[data-zone-chat]").forEach((btn) => {
      btn.addEventListener("click", async (ev) => {
        ev.stopPropagation();
        const zoneId = btn.dataset.zoneChat;
        const card = btn.closest(".pb-zone-card");
        const screenId = card?.dataset.screenId;
        const z = screenId
          ? (screenById(zoneIndex, screenId)?.zones ?? []).find((x) => x.zoneId === zoneId)
          : null;
        if (!z) return;
        selectedZoneId = zoneId;
        userSelectedScreenId = z.screenId;
        window.__PB_HIGHLIGHT_ZONE__?.(zoneId);
        updateSelectionHighlight(zoneIndex);
        const text = formatZoneShortChatPrompt(z);
        const method = await addToChat(text);
        const prev = btn.textContent;
        const label = getChatTargetLabel();
        btn.textContent = method === "deeplink" ? `Opened ${label}` : "Copied";
        setTimeout(() => {
          btn.textContent = prev;
        }, 1500);
      });
    });

    panelEl.querySelectorAll(".pb-layout-card__chat[data-layout-screen]").forEach((btn) => {
      btn.addEventListener("click", async (ev) => {
        ev.stopPropagation();
        const screenId = btn.dataset.layoutScreen;
        const screen = screenById(zoneIndex, screenId);
        if (!screen) return;
        userSelectedScreenId = screenId;
        selectedZoneId = null;
        window.__PB_HIGHLIGHT_ZONE__?.(null);
        render();
        const text = formatLayoutShortChatPrompt(zoneIndex, screen);
        const method = await addToChat(text);
        const prev = btn.textContent;
        const label = getChatTargetLabel();
        btn.textContent = method === "deeplink" ? `Opened ${label}` : "Copied";
        setTimeout(() => {
          btn.textContent = prev;
        }, 1500);
      });
    });

    panelEl.querySelectorAll(".pb-transition-card__chat[data-transition-chat]").forEach((btn) => {
      btn.addEventListener("click", async (ev) => {
        ev.stopPropagation();
        const screenId = btn.dataset.transitionChat;
        const screen = screenById(zoneIndex, screenId);
        if (!screen?.transition?.hasTransition) return;
        userSelectedScreenId = screenId;
        selectedZoneId = null;
        window.__PB_HIGHLIGHT_ZONE__?.(null);
        render();
        const text = formatTransitionShortChatPrompt(screen);
        const method = await addToChat(text);
        const prev = btn.textContent;
        const label = getChatTargetLabel();
        btn.textContent = method === "deeplink" ? `Opened ${label}` : "Copied";
        setTimeout(() => {
          btn.textContent = prev;
        }, 1500);
      });
    });
  }

  window.addEventListener("pb-screen-change", (ev) => {
    lastZoneIndex = ev.detail?.zoneIndex ?? null;
    activeScreenId = ev.detail?.screenId ?? null;
    const fromInspector = Boolean(ev.detail?.fromInspector);
    userSelectedScreenId = activeScreenId;
    if (!fromInspector) {
      selectedZoneId = null;
      window.__PB_HIGHLIGHT_ZONE__?.(null);
    }
    render();
    if (copyBtnEl && lastZoneIndex) copyBtnEl.disabled = false;
  });

  copyBtnEl?.addEventListener("click", async () => {
    if (!lastZoneIndex) return;
    const inspectScreenId = userSelectedScreenId ?? activeScreenId;
    const text = formatZoneChatPrompt(lastZoneIndex, {
      selectedZoneId: selectedZoneId || undefined,
      selectedScreenId: selectedZoneId ? undefined : inspectScreenId,
      activeScreenId,
    });
    const method = await addToChat(text);
    const label = getChatTargetLabel();
    copyBtnEl.textContent = method === "deeplink" ? `Opened ${label}` : "Copied!";
    setTimeout(() => {
      copyBtnEl.textContent = "Add to chat";
    }, 1500);
  });

  toggleZonesEl?.addEventListener("change", () => {
    document.getElementById("playable-root")?.classList.toggle("pb-show-zones", toggleZonesEl.checked);
  });

  renderEmpty("Waiting for preview…");
}

/** Inspector width grows with screen count, capped; device scaler refits on resize */
function resizeInspector(zoneIndex) {
  const inspector = document.getElementById("zone-inspector");
  if (!inspector) return;
  const screens = zoneIndex?.screens ?? [];
  const screenCount = screens.length;
  const transitionCount = screens.filter((s) => s.transition?.hasTransition).length;
  const cardW = 108;
  const connectorW = 20;
  const gap = 6;
  const pad = 40;
  const itemCount = screenCount + transitionCount;
  const w = Math.min(
    560,
    Math.max(300, screenCount * cardW + transitionCount * connectorW + Math.max(0, itemCount - 1) * gap + pad),
  );
  inspector.style.setProperty("--inspector-w", `${w}px`);
  window.dispatchEvent(new Event("pb-inspector-resize"));
}

function truncate(s, max) {
  const t = String(s);
  return t.length > max ? `${t.slice(0, max)}…` : t;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
