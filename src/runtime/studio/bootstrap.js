import { bindStoreCta } from "../../skills/store-cta.js";
import { trackEvent } from "./tracking.js";
import { createActionRunner } from "./action-runner.js";
import {
  createPausableInterval,
  createPausableStepScheduler,
  createPausableTimeout,
} from "./playback-scheduler.js";
import { createPlaybackClock } from "./playback-clock.js";
import { renderScreenElements } from "./screen-renderer.js";
import { applyStudioTheme } from "./theme.js";
import { applyFluidViewport } from "./fluid-scale.js";
import { initLottieMounts } from "./lottie-mount.js";
import { buildZoneIndex } from "./zone-index.js";
import { SCREEN_ENTER_ANIMATIONS, SCREEN_ENTER_EASINGS } from "./registries.js";
import { initAiModalFlow, resetAiModalFlow } from "./ai-modal-flow.js";
import { initQuizFlow } from "./quiz-flow.js";

/**
 * @param {{ root: HTMLElement, bundle: object, mode?: 'preview'|'export', previewKind?: 'template'|'playable' }} opts
 */
export function bootPlayableStudio({ root, bundle, mode = "preview", previewKind = "playable" }) {
  const { playable, context, scenario, assets } = bundle;
  const app = document.createElement("div");
  app.className = "pb-studio__app";
  root.appendChild(app);

  applyStudioTheme(app, playable.theme);
  applyFluidViewport(app, playable);

  const clock = createPlaybackClock();
  let stepScheduler = null;
  let autoNextTimer = null;
  /** @type {Set<{ pause?: () => void, resume?: () => void, cancel?: () => void }>} */
  const playbackHooks = new Set();
  /** @type {import('lottie-web').AnimationItem[]} */
  let lottieInstances = [];
  let screenIndex = 0;
  let previousScreenId = null;
  const screenOrder = scenario.screens?.map((s) => s.id) ?? [];
  const screensById = new Map(scenario.screens.map((s) => [s.id, s]));

  function resolveEnterAnimation(fromScreenId) {
    if (!fromScreenId) return "slide";
    const anim = screensById.get(fromScreenId)?.transition?.animation;
    return anim && SCREEN_ENTER_ANIMATIONS[anim] ? anim : "slide";
  }

  function emitScreenChange(screenId, screen, meta = {}) {
    const zoneIndex = buildZoneIndex(scenario, context, playable, { previewKind });
    window.__PB_ZONE_INDEX__ = zoneIndex;
    window.dispatchEvent(
      new CustomEvent("pb-screen-change", {
        detail: {
          screenId,
          screen,
          zoneIndex,
          zones: zonesForScreen(zoneIndex, screenId),
          fromInspector: Boolean(meta.fromInspector),
        },
      }),
    );
  }

  function applyEnterTransitionStyle(stage, fromScreenId) {
    const config = fromScreenId ? screensById.get(fromScreenId)?.transition : null;
    if (config?.durationMs != null) {
      stage.style.setProperty("--pb-enter-duration", `${config.durationMs}ms`);
    }
    const easing = config?.easing;
    if (easing && SCREEN_ENTER_EASINGS[easing]) {
      stage.style.setProperty("--pb-enter-easing", SCREEN_ENTER_EASINGS[easing]);
    }
  }

  function emitPlaybackState() {
    window.dispatchEvent(
      new CustomEvent("pb-playback-state", { detail: { paused: clock.isPaused() } }),
    );
  }

  function zonesForScreen(zoneIndex, screenId) {
    return (zoneIndex?.zones ?? []).filter((z) => z.screenId === screenId);
  }

  function highlightZone(zoneId) {
    app.querySelectorAll("[data-target]").forEach((n) => {
      n.classList.toggle("pb-zone-highlight", Boolean(zoneId && n.dataset.target === zoneId));
    });
  }

  function setPausedVisual(paused) {
    app.classList.toggle("pb-studio--paused", paused);
    for (const anim of lottieInstances) {
      try {
        if (paused) anim.pause();
        else anim.play();
      } catch {
        /* destroyed */
      }
    }
  }

  function registerPlaybackHook(hook) {
    playbackHooks.add(hook);
    return () => playbackHooks.delete(hook);
  }

  function clearPlaybackHooks() {
    for (const hook of playbackHooks) hook.cancel?.();
    playbackHooks.clear();
  }

  function teardownScreenPlayback() {
    stepScheduler?.cancel();
    stepScheduler = null;
    autoNextTimer?.cancel();
    autoNextTimer = null;
    clearPlaybackHooks();
    if (typeof teardownScreenPlayback._cleanupAiModal === "function") {
      teardownScreenPlayback._cleanupAiModal();
      teardownScreenPlayback._cleanupAiModal = null;
    }
    if (typeof teardownScreenPlayback._cleanupQuiz === "function") {
      teardownScreenPlayback._cleanupQuiz();
      teardownScreenPlayback._cleanupQuiz = null;
    }
    for (const anim of lottieInstances) {
      try {
        anim.destroy();
      } catch {
        /* noop */
      }
    }
    lottieInstances = [];
  }

  window.__PB_HIGHLIGHT_ZONE__ = highlightZone;
  window.__PB_GOTO_SCREEN__ = (screenId) => {
    if (screensById.has(screenId)) mountScreen(screenId, { fromInspector: true });
  };

  function mountScreen(screenId, opts = {}) {
    const fromInspector = Boolean(opts.fromInspector);

    teardownScreenPlayback();
    clock.reset();
    app.classList.remove("pb-studio--paused");

    const screen = screensById.get(screenId);
    if (!screen) return;

    const prevIdx = screenOrder.indexOf(screenId);
    const direction = prevIdx >= screenIndex ? "forward" : "back";
    const enterFromScreenId = fromInspector ? null : previousScreenId;
    const enterAnim = resolveEnterAnimation(enterFromScreenId);
    const enterClass =
      SCREEN_ENTER_ANIMATIONS[enterAnim] ?? SCREEN_ENTER_ANIMATIONS.slide;
    screenIndex = prevIdx;
    previousScreenId = screenId;

    trackEvent("screen_view", { screenId });
    app.innerHTML = "";
    const stage = document.createElement("div");
    stage.className = `pb-studio__stage ${enterClass} pb-studio__stage--${direction}`;
    applyEnterTransitionStyle(stage, enterFromScreenId);

    const bgLayer = document.createElement("div");
    bgLayer.className = "pb-studio__bg";
    const content = document.createElement("div");
    content.className = "pb-studio__content";
    if (screen.ctaLayout === "center") content.classList.add("pb-studio__content--cta-center");
    if (screen.ctaLayout === "overlay") {
      stage.classList.add("pb-studio__stage--cta-overlay");
      content.classList.add("pb-studio__content--cta-overlay");
    }
    const overlayLayer = document.createElement("div");
    overlayLayer.className = "pb-studio__overlay";

    const { bgFrag, contentFrag, overlayFrag, map, lottieMounts } = renderScreenElements(
      screen,
      context,
      playable,
      assets,
    );
    bgLayer.appendChild(bgFrag);
    content.appendChild(contentFrag);
    overlayLayer.appendChild(overlayFrag);
    stage.appendChild(bgLayer);
    stage.appendChild(content);
    stage.appendChild(overlayLayer);
    app.appendChild(stage);

    initLottieMounts(lottieMounts, assets).then((instances) => {
      lottieInstances = instances;
      if (clock.isPaused()) setPausedVisual(true);
    });

    const ctaBtn = content.querySelector("#cta");
    if (ctaBtn) {
      bindStoreCta("#cta");
      ctaBtn.classList.add("pb-btn--cta-live");
      trackEvent("cta_view", { screenId });
    }

    const hasAiModal = content.querySelector(".pb-ai-modal-picker, .pb-el--ai-model-response");
    let cleanupAiModal = null;
    if (hasAiModal) {
      cleanupAiModal = initAiModalFlow({
        screen,
        content,
        overlayLayer,
        context,
        assets,
        navigate: (target) => mountScreen(target),
        clock,
        registerPlaybackHook,
        createPausableTimeout,
        createPausableInterval,
      });
      teardownScreenPlayback._cleanupAiModal = cleanupAiModal;
    }

    const hasQuiz = content.querySelector("[data-quiz-options]");
    if (hasQuiz) {
      teardownScreenPlayback._cleanupQuiz = initQuizFlow({
        screen,
        content,
        context,
        navigate: (target) => mountScreen(target),
        clock,
      });
    }

    const runStep = createActionRunner({
      elementMap: map,
      onNavigate: (target) => mountScreen(target),
      clock,
    });

    stepScheduler = createPausableStepScheduler(screen.steps, runStep, clock);
    stepScheduler.start();

    if (screen.clickNext?.enabled && screen.clickNext.target && !hasAiModal && !hasQuiz) {
      stage.style.cursor = "pointer";
      const go = () => mountScreen(screen.clickNext.target);
      stage.addEventListener("click", go, { once: true });
    }

    if (screen.autoNext?.enabled && screen.autoNext.target && !hasAiModal && !hasQuiz) {
      const delay = screen.autoNext.afterMs ?? screen.durationMs ?? 4000;
      autoNextTimer = createPausableTimeout(delay, () => mountScreen(screen.autoNext.target), clock);
      autoNextTimer.start();
    }

    emitScreenChange(screenId, screen, { fromInspector });
    emitPlaybackState();
  }

  function pause() {
    if (mode !== "preview" || clock.isPaused()) return;
    clock.pause();
    stepScheduler?.pause();
    autoNextTimer?.pause();
    for (const hook of playbackHooks) hook.pause?.();
    setPausedVisual(true);
    emitPlaybackState();
  }

  function resume() {
    if (mode !== "preview" || !clock.isPaused()) return;
    clock.resume();
    stepScheduler?.resume();
    autoNextTimer?.resume();
    for (const hook of playbackHooks) hook.resume?.();
    setPausedVisual(false);
    emitPlaybackState();
  }

  trackEvent("playable_start", { playableId: playable.id, mode });
  mountScreen(scenario.entryScreen);

  return {
    restart() {
      trackEvent("playable_complete", { playableId: playable.id });
      screenIndex = 0;
      previousScreenId = null;
      resetAiModalFlow();
      clock.reset();
      app.classList.remove("pb-studio--paused");
      mountScreen(scenario.entryScreen);
    },
    pause,
    resume,
    isPaused: () => clock.isPaused(),
  };
}

/**
 * Read bundle from inline script (export) or argument (preview).
 */
export function bootFromDom(root = document.getElementById("playable-root")) {
  const el = document.getElementById("playable-config");
  if (!el?.textContent) throw new Error("Missing #playable-config JSON");
  const bundle = JSON.parse(el.textContent);
  const mode = document.documentElement.dataset.playableMode || "export";
  return bootPlayableStudio({ root, bundle, mode });
}
