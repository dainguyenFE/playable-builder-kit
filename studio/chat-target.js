/** Where "Add to chat" opens — Cursor or Claude Desktop. */

const STORAGE_KEY = "studio:chat-target";

export const CHAT_TARGETS = {
  cursor: {
    id: "cursor",
    label: "Cursor",
    maxDeeplinkLen: 8000,
    buildUrl(text) {
      const url = new URL("cursor://anysphere.cursor-deeplink/prompt");
      url.searchParams.set("text", text);
      return url.toString();
    },
  },
  claude: {
    id: "claude",
    label: "Claude",
    maxDeeplinkLen: 14000,
    buildUrl(text) {
      const url = new URL("claude://claude.ai/new");
      url.searchParams.set("q", text);
      return url.toString();
    },
  },
};

/** @returns {'cursor'|'claude'} */
export function getChatTarget() {
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "claude" ? "claude" : "cursor";
}

/** @param {'cursor'|'claude'} id */
export function setChatTarget(id) {
  localStorage.setItem(STORAGE_KEY, id === "claude" ? "claude" : "cursor");
}

export function getChatTargetConfig(target = getChatTarget()) {
  return CHAT_TARGETS[target] ?? CHAT_TARGETS.cursor;
}

export function getChatTargetLabel(target = getChatTarget()) {
  return getChatTargetConfig(target).label;
}

/**
 * @param {string} text
 * @param {'cursor'|'claude'} [target]
 */
export function buildPromptUrl(text, target = getChatTarget()) {
  return getChatTargetConfig(target).buildUrl(text);
}

export function notebookHintText(target = getChatTarget()) {
  const label = getChatTargetLabel(target);
  return `Prompt → preview → save. Dùng notebook bên trái để gửi prompt vào ${label}.`;
}

export function inspectorHintText(target = getChatTarget()) {
  const label = getChatTargetLabel(target);
  return `Screens → zones. Click zone → <strong>Add to chat</strong> gửi vào ${label}.`;
}

function dispatchChange(target) {
  document.dispatchEvent(new CustomEvent("studio:chat-target", { detail: { target } }));
}

/** Update elements with data-chat-hint="notebook" | "inspector". */
export function refreshChatTargetHints() {
  const target = getChatTarget();
  document.querySelectorAll("[data-chat-hint='notebook']").forEach((el) => {
    el.innerHTML = notebookHintText(target);
  });
  document.querySelectorAll("[data-chat-hint='inspector']").forEach((el) => {
    el.innerHTML = inspectorHintText(target);
  });
}

/**
 * Segmented toggle — Cursor | Claude
 * @param {HTMLElement} root
 */
export function initChatTargetToggle(root) {
  if (!root) return;

  const render = () => {
    const active = getChatTarget();
    root.innerHTML = `
      <div class="studio-chat-target" role="group" aria-label="Chat destination">
        <div class="studio-chat-target__switch">
          ${Object.values(CHAT_TARGETS)
            .map(
              (t) => `
            <button
              type="button"
              class="studio-chat-target__opt${t.id === active ? " studio-chat-target__opt--active" : ""}"
              data-target="${t.id}"
              aria-pressed="${t.id === active ? "true" : "false"}"
            >${t.label}</button>`,
            )
            .join("")}
        </div>
      </div>`;

    root.querySelectorAll(".studio-chat-target__opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.target;
        if (!id || id === getChatTarget()) return;
        setChatTarget(id);
        render();
        refreshChatTargetHints();
        dispatchChange(id);
      });
    });
  };

  render();
  refreshChatTargetHints();
}
