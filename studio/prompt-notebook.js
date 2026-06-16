import { addToChat } from "./add-to-chat.js";
import { getChatTargetLabel } from "./chat-target.js";

/**
 * Prompt examples — every prompt names template/playable · screen · zone
 * so AI knows exactly where to edit.
 *
 * Pattern:
 *   Edit template "<id>" screen N "<name>" (screen_id) zone N "<name>" (zone_id): …
 *   Edit playable "<id>" screen N "<name>" (screen_id): …
 *   Add / Delete zone | screen | template | playable …
 */
export const PROMPT_NOTEBOOK = [
  {
    id: "template",
    title: "Template",
    items: [
      {
        label: "Create template",
        prompt:
          'Create template "nova-chat-flow" from template "ai-chat-assistant". Register in registry if needed.',
      },
      {
        label: "Edit template (multi-request)",
        prompt: `Edit template "ai-chat-assistant":
1. screen 1 "Hook" (screen_hook) zone 4 "headline" (headline) — shorter copy, playful tone
2. screen 1 "Hook" (screen_hook) transition — auto-advance to screen 2 after 2000ms
3. layout — increase insetX to 28px (all screens)`,
      },
      {
        label: "Edit theme / background",
        prompt:
          'Edit template "ai-text-to-image" screen 1 "Hook" (screen_hook) zone 1 "bg" (bg): gradient purple-pink background. Theme: rose-creative.',
      },
      {
        label: "Build template",
        prompt: 'Build template "ai-chat-assistant" (export single HTML after preview OK).',
      },
      {
        label: "Save template from playable",
        prompt:
          'Save playable "my-campaign" as template "my-campaign-v2".',
      },
    ],
  },
  {
    id: "playable",
    title: "Playable",
    items: [
      {
        label: "Create playable",
        prompt:
          'Create playable "nova-chat-spring" from template "ai-chat-assistant", theme midnight-blue.',
      },
      {
        label: "Clone playable",
        prompt:
          'Clone playable "nova-chat-v2" from playable "nova-chat-v1".',
      },
      {
        label: "Clone playable (list sources)",
        prompt:
          'Clone playable — list available playables (pnpm playable:clone --list), ask user to pick source, then: pnpm playable:clone <new-id> <source-id>',
      },
      {
        label: "Edit playable copy",
        prompt: `Edit playable "nova-chat-spring":
1. screen 1 "Hook" (screen_hook) — update product name and CTA copy
2. screen 2 "Chat" (screen_chat) zone 2 "user_bubble" (user_bubble) — change demo user question
3. Keep 3-screen flow unchanged`,
      },
      {
        label: "Export HTML",
        prompt:
          'Export playable "nova-chat-spring" to single HTML for AppLovin.',
      },
      {
        label: "Delete playable",
        prompt: 'Delete playable "nova-chat-spring".',
      },
    ],
  },
  {
    id: "zones",
    title: "Zones",
    items: [
      {
        label: "Add zone",
        prompt: `Add zone to template "ai-chat-assistant" screen 1 "Hook" (screen_hook):
New zone "promo_strip" type subheadline-block, textKey promoStrip, hidden true.
Step: show promo_strip at 1600ms animation fade-up.
Add context.promoStrip = "Limited offer — try free today".`,
      },
      {
        label: "Add benefit lines (split zones)",
        prompt: `Add zones to template "ai-chat-assistant" screen 1 "Hook" (screen_hook):
benefit-title (benefitsTitle) + benefit-item ben1…ben3 (benefit1…benefit3) — one zone per line, stagger show steps 800ms/960ms/1120ms.`,
      },
      {
        label: "Add zone (image / Lottie)",
        prompt: `Add zone to template "ai-text-to-image" screen 2 "Demo" (screen_demo):
New zone "hero_result" type hero-image, assetId img-t2i-cyberpunk, hidden true.
Step: show hero_result at 1200ms pop-in. Ensure asset exists in assets.preset.json.`,
      },
      {
        label: "Edit zone (copy + timing)",
        prompt: `Edit template "ai-chat-assistant" screen 1 "Hook" (screen_hook) zone 1 "headline" (headline):
1. context.problemHeadline → "Get instant AI answers"
2. step show headline: atMs 450ms → 600ms, animation fade-up
Preview: /preview/template/ai-chat-assistant`,
      },
      {
        label: "Edit zone (from inspector)",
        prompt:
          'Preview template "ai-chat-assistant" → inspector: pick screen + zone → Add to chat → edit copy / steps / assetId per patch paths in context.',
      },
      {
        label: "Delete zone",
        prompt: `Delete zone from template "ai-chat-assistant" screen 1 "Hook" (screen_hook):
Remove zones "tap_hint" and "hand_tap" from elements[] and all steps with target tap_hint or hand_tap.`,
      },
      {
        label: "Split large list zone",
        prompt: `Edit template "ai-travel-itinerary" screen 3 "Summary" (s3):
Replace single benefit-list "cards" with benefit-item zones sum1…sum4 (summary1…summary4) — one inspector zone per bullet, staggered show steps.`,
      },
      {
        label: "Hide zone (keep element)",
        prompt:
          'Edit template "ai-chat-assistant" screen 1 "Hook" (screen_hook) zone "pills" (pills): set elements[].hidden true and remove show steps for pills.',
      },
    ],
  },
  {
    id: "screens",
    title: "Screens",
    items: [
      {
        label: "Add screen",
        prompt: `Add screen to template "ai-chat-assistant" after screen 2 "Demo" (screen_demo):
New screen "screen_cta" name "CTA", transition slide-left.
Zones: headline (textKey ctaHeadline), cta_button (type cta-button).
context.ctaHeadline = "Start free today".
Rewire screen 2 autoNext.target → screen_cta.`,
      },
      {
        label: "Edit screen transition",
        prompt:
          'Edit playable "test-1" screen 1 "Hook" (screen_hook) transition: autoNext after 2500ms → screen_demo, clickNext enabled.',
      },
      {
        label: "Delete screen",
        prompt: `Delete screen from template "ai-chat-assistant":
Remove screen "screen_extra" — rewire previous screen autoNext/clickNext to next screen, remove steps for zones only on screen_extra.`,
      },
    ],
  },
  {
    id: "assets",
    title: "Assets",
    items: [
      {
        label: "Save image (attach in chat)",
        prompt: `Save image "abc" for template "ai-chat-assistant"
(attach image in chat — agent runs: pnpm studio:asset save abc --image <file>)`,
      },
      {
        label: "Save Lottie (attach in chat)",
        prompt: `Save lottie "abc" for template "ai-chat-assistant"
(attach .json in chat — agent runs: pnpm studio:asset save abc --lottie <file>)`,
      },
      {
        label: "Use asset — zone",
        prompt:
          'Use asset image "abc" for template "ai-chat-assistant" screen 2 "Demo" (screen_demo) zone 3 "hero_result" (hero_result).',
      },
      {
        label: "Use asset — background",
        prompt:
          'Use asset image "abc" for template "ai-chat-assistant" screen 1 "Hook" (screen_hook) zone 1 "bg" (bg) background.',
      },
      {
        label: "Delete image / Lottie",
        prompt: 'Delete asset image "abc" from template "ai-chat-assistant".',
      },
      {
        label: "Add icon",
        prompt: `Add icon "icon-sparkles" for template "ai-chat-assistant"
(attach .svg Lucide — agent: pnpm studio:asset save icon-sparkles --icon <file>)`,
      },
      {
        label: "Use icon",
        prompt:
          'Use icon "icon-sparkles" for template "ai-chat-assistant" screen 1 "Hook" (screen_hook) zone 2 "badge" (free_badge).',
      },
      {
        label: "Delete icon",
        prompt: 'Delete icon "icon-sparkles" from template "ai-chat-assistant".',
      },
    ],
  },
  {
    id: "preview",
    title: "Preview & flow",
    items: [
      {
        label: "Standard flow",
        prompt:
          'Preview template "ai-chat-assistant" → edit per brief → preview again → build template when OK.',
      },
      {
        label: "Add Lottie / image",
        prompt:
          'Edit template "ai-chat-assistant" screen 1 "Hook" (screen_hook): add hand-tap Lottie on tap-hint zone, sharper hero image on zone hero.',
      },
      {
        label: "Screen transition",
        prompt:
          'Edit template "ai-planning-board" screen 2 "Board" (screen_board) transition: tap anywhere → screen 3, auto after 8s.',
      },
    ],
  },
];

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * @param {HTMLElement} root
 */
export function initPromptNotebook(root) {
  if (!root) return;

  root.innerHTML = PROMPT_NOTEBOOK.map(
    (section) => `
    <section class="studio-notebook__section studio-notebook__section--open" data-section="${section.id}">
      <button type="button" class="studio-notebook__section-toggle" aria-expanded="true" aria-controls="notebook-panel-${section.id}">
        <span class="studio-notebook__chevron" aria-hidden="true"></span>
        <span class="studio-notebook__section-title">${escapeHtml(section.title)}</span>
        <span class="studio-notebook__count">${section.items.length}</span>
      </button>
      <div class="studio-notebook__panel" id="notebook-panel-${section.id}">
        <ul class="studio-notebook__list">
        ${section.items
          .map(
            (item, i) => `
          <li class="studio-notebook__card">
            <span class="studio-notebook__label">${escapeHtml(item.label)}</span>
            <pre class="studio-notebook__prompt">${escapeHtml(item.prompt)}</pre>
            <button type="button" class="studio-notebook__chat" data-section="${section.id}" data-index="${i}">Add to chat</button>
          </li>`,
          )
          .join("")}
        </ul>
      </div>
    </section>`,
  ).join("");

  root.querySelectorAll(".studio-notebook__section-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = btn.closest(".studio-notebook__section");
      if (!section) return;
      const open = section.classList.toggle("studio-notebook__section--open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  root.querySelectorAll(".studio-notebook__chat").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const section = PROMPT_NOTEBOOK.find((s) => s.id === btn.dataset.section);
      const item = section?.items[Number(btn.dataset.index)];
      if (!item) return;
      const method = await addToChat(item.prompt);
      const label = getChatTargetLabel();
      const prev = btn.textContent;
      btn.textContent =
        method === "deeplink" ? `Opened ${label}` : `Copied`;
      setTimeout(() => {
        btn.textContent = prev;
      }, 1400);
    });
  });
}
