import { buildPromptUrl, getChatTarget, getChatTargetConfig } from "./chat-target.js";

/**
 * Open Cursor or Claude with prompt pre-filled (+ clipboard fallback).
 * @param {string} text
 * @param {{ target?: 'cursor'|'claude' }} [opts]
 * @returns {Promise<'deeplink'|'clipboard'>}
 */
export async function addToChat(text, opts = {}) {
  const target = opts.target ?? getChatTarget();
  const config = getChatTargetConfig(target);

  let copied = false;
  try {
    await navigator.clipboard.writeText(text);
    copied = true;
  } catch {
    /* clipboard may be blocked */
  }

  const deeplink = buildPromptUrl(text, target);
  if (deeplink.length <= config.maxDeeplinkLen) {
    try {
      const a = document.createElement("a");
      a.href = deeplink;
      a.rel = "noopener";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
      return "deeplink";
    } catch {
      /* fall through */
    }
  }

  if (!copied) {
    window.prompt(`Copy this prompt into ${config.label} chat:`, text);
  }
  return "clipboard";
}

/** @deprecated use buildPromptUrl from chat-target.js */
export function buildCursorPromptUrl(text, opts = {}) {
  if (opts.web) {
    const url = new URL("https://cursor.com/link/prompt");
    url.searchParams.set("text", text);
    return url.toString();
  }
  return buildPromptUrl(text, "cursor");
}
