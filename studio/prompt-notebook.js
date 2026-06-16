import { addToChat } from "./add-to-chat.js";
import { getChatTargetLabel } from "./chat-target.js";

/** Prompt examples for Studio home sidebar — copy / Add to chat. */
export const PROMPT_NOTEBOOK = [
  {
    id: "template",
    title: "Template",
    items: [
      {
        label: "Tạo template mới",
        prompt:
          "Create template nova-chat-flow from ai-chat-assistant. Đăng ký registry nếu cần.",
      },
      {
        label: "Edit template (nhiều yêu cầu)",
        prompt: `Edit template ai-chat-assistant:
1. Đổi headline zone 4 — copy ngắn hơn, tone playful
2. Screen 1 auto chuyển screen 2 sau 2000ms
3. Tăng padding 2 bên lên 28px (layout.insetX)`,
      },
      {
        label: "Đổi theme / background",
        prompt:
          "Edit template ai-text-to-image: đổi background zone sang gradient tím hồng, theme rose-creative",
      },
      {
        label: "Build template (sau khi OK preview)",
        prompt: "Build template ai-chat-assistant",
      },
      {
        label: "Save template (từ playable)",
        prompt:
          "Save playable my-campaign as template my-campaign-v2",
      },
    ],
  },
  {
    id: "playable",
    title: "Playable",
    items: [
      {
        label: "Tạo playable mới",
        prompt:
          "Create new playable nova-chat-spring — studio template ai-chat-assistant, theme midnight-blue",
      },
      {
        label: "Clone playable",
        prompt:
          'Clone playable "nova-chat-v2" from playable "nova-chat-v1"',
      },
      {
        label: "Clone playable (list nguồn)",
        prompt:
          "Clone playable — list playables có sẵn (pnpm playable:clone --list), hỏi user chọn nguồn nếu tên không khớp, rồi chạy: pnpm playable:clone <new-id> <source-id>",
      },
      {
        label: "Edit copy playable",
        prompt: `Edit playable nova-chat-spring:
1. Đổi product name và CTA
2. Screen chat — đổi câu hỏi user demo
3. Giữ nguyên flow 3 màn`,
      },
      {
        label: "Export HTML (campaign)",
        prompt: "Export playable nova-chat-spring to single HTML for AppLovin",
      },
      {
        label: "Xóa playable",
        prompt: "Delete playable nova-chat-spring",
      },
    ],
  },
  {
    id: "zones",
    title: "Zones",
    items: [
      {
        label: "Create zone mới",
        prompt: `Edit template ai-chat-assistant — screen screen_hook:
Thêm zone mới "promo_strip" type subheadline-block, textKey promoStrip, hidden true.
Step: show promo_strip at 1600ms animation fade-up.
Thêm context.promoStrip = "Limited offer — try free today".`,
      },
      {
        label: "Create zone (image / Lottie)",
        prompt: `Edit template ai-text-to-image — screen screen_demo:
Thêm zone hero_result type hero-image, assetId img-t2i-cyberpunk, hidden true.
Step show at 1200ms pop-in. Đảm bảo asset có trong assets.preset.json.`,
      },
      {
        label: "Edit zone (copy + timing)",
        prompt: `Edit template ai-chat-assistant zone headline (screen Hook):
1. context.problemHeadline → "Get instant AI answers"
2. Step show headline: đổi atMs từ 450ms → 600ms, animation fade-up
Preview /preview/template/ai-chat-assistant để kiểm tra.`,
      },
      {
        label: "Edit zone (từ inspector)",
        prompt:
          "Preview template ai-chat-assistant → inspector chọn zone → Add to chat → chỉnh theo patch paths trong context (đổi text / steps / assetId).",
      },
      {
        label: "Delete zone",
        prompt: `Edit template ai-chat-assistant — screen screen_hook:
Xóa zone tap_hint và hand_tap: remove khỏi elements[] và mọi steps có target là 2 id đó.`,
      },
      {
        label: "Ẩn zone (không xóa)",
        prompt:
          "Edit template ai-chat-assistant zone pills on screen Hook: set elements[].hidden true và remove các steps show pills.",
      },
    ],
  },
  {
    id: "screens",
    title: "Screens",
    items: [
      {
        label: "Thêm screen mới",
        prompt: `Edit template ai-chat-assistant:
Thêm screen screen_cta sau screen_result với transition slide-left.
Elements: headline (textKey ctaHeadline), cta (type cta-button).
context.ctaHeadline = "Start free today".
Screen trước: autoNext.target = screen_cta.`,
      },
      {
        label: "Sửa transition screen",
        prompt:
          "Edit playable test-1 screen screen_hook: autoNext sau 2500ms sang screen_demo, clickNext enabled.",
      },
      {
        label: "Xóa screen",
        prompt: `Edit template ai-chat-assistant:
Xóa screen screen_extra — rewire screen trước autoNext/clickNext sang màn kế tiếp, remove mọi steps target zones chỉ thuộc screen đó.`,
      },
    ],
  },
  {
    id: "assets",
    title: "Assets",
    items: [
      {
        label: "Save image (từ file đính kèm chat)",
        prompt: `Save image with name "abc"
(đính kèm ảnh trong chat — agent chạy: pnpm studio:asset save abc --image <file>)`,
      },
      {
        label: "Save Lottie (từ file đính kèm chat)",
        prompt: `Save lottie with name "abc"
(đính kèm file .json trong chat — agent chạy: pnpm studio:asset save abc --lottie <file>)`,
      },
      {
        label: "Dùng asset — zone",
        prompt: `Use asset image "abc" for zone <zone-id> on screen <screen-id>`,
      },
      {
        label: "Dùng asset — background",
        prompt: `Use asset image "abc" for background on screen <screen-id>`,
      },
      {
        label: "Delete image / Lottie",
        prompt: `Delete image "abc"`,
      },
      {
        label: "Add icon",
        prompt: `asset add icon "icon-sparkles"
(đính kèm file .svg Lucide — agent: pnpm studio:asset save icon-sparkles --icon <file>)`,
      },
      {
        label: "Use icon",
        prompt: `asset use icon "icon-sparkles" for zone <zone-id> on screen <screen-id>`,
      },
      {
        label: "Delete icon",
        prompt: `asset delete icon "icon-sparkles"`,
      },
    ],
  },
  {
    id: "preview",
    title: "Preview & flow",
    items: [
      {
        label: "Flow chuẩn",
        prompt:
          "Preview template ai-chat-assistant → chỉnh theo brief → preview lại → build template khi OK",
      },
      {
        label: "Thêm Lottie / ảnh",
        prompt:
          "Edit template ai-chat-assistant: thêm hand-tap Lottie trên màn có tap-hint, hero image rõ hơn",
      },
      {
        label: "Transition giữa screens",
        prompt:
          "Edit template ai-planning-board screen 2: tap anywhere chuyển screen 3, auto sau 8s",
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
