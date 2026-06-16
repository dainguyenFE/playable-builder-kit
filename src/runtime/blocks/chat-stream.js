import { track } from "../tracking.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export function renderChatStream(host, { slots, onComplete }) {
  host.classList.add("pb-block", "pb-chat-stream");

  const chips = el("div", "pb-chat-stream__chips");
  const chipLabels = [slots.chip1, slots.chip2, slots.chip3].filter(Boolean);
  if (chipLabels.length === 0) chipLabels.push("Try a prompt");

  const thread = el("div", "pb-chat-stream__thread");
  host.appendChild(chips);
  host.appendChild(thread);

  let done = false;

  async function runChip(label) {
    if (done) return;
    done = true;
    track("first_interaction", { block: "chat-stream", choice: label });

    chips.querySelectorAll("button").forEach((b) => {
      b.disabled = true;
    });

    thread.appendChild(el("div", "pb-bubble pb-bubble--user", slots.userPrompt || label));

    const typing = el("div", "pb-typing", "…");
    thread.appendChild(typing);
    await delay(900);
    typing.remove();

    thread.appendChild(
      el("div", "pb-bubble pb-bubble--ai", slots.aiReply || "Here is your answer."),
    );

    track("demo_completed", { block: "chat-stream" });
    await delay(1200);
    onComplete?.();
  }

  for (const label of chipLabels) {
    const chip = el("button", "pb-chip", label);
    chip.type = "button";
    chip.addEventListener("click", () => runChip(label));
    chips.appendChild(chip);
  }

  if (chipLabels.length === 1) {
    setTimeout(() => runChip(chipLabels[0]), 400);
  }
}
