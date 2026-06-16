---
name: playable-create-workflow
description: >-
  MANDATORY when user says create new playable, tạo playable mới, new campaign,
  tạo campaign, delete playable, xóa playable. Ask campaign id + chủ đề (topic);
  auto-match template from registry — do NOT ask studio vs compose vs scaffold.
---

# Create new playable — agent workflow

Read **`ai/CLI-MAP.md`** for prompt ↔ CLI table.

## Triggers (bắt buộc áp dụng skill này)

- "create new playable", "new playable", "new campaign"
- "tạo playable mới", "tạo campaign mới"
- **"delete playable"**, **"xóa playable"**, "remove campaign"

**Không** hỏi user chọn **studio | compose | scaffold**. Engine lấy tự động từ template đã match trong registry.

---

## Step 1 — Campaign id

- Format: **kebab-case** (`nova-chat-q1`, `pa08-ai-models`)
- Nếu user chưa cho tên → **hỏi** trước khi chạy CLI

---

## Step 2 — Template (auto-match — không hỏi mode)

Chạy (hoặc đọc registry):

```bash
pnpm playable:new --list
```

Hoặc đọc `data/registry/playables.json` (mục `templates`).

**Match template** từ user message — template id, tên template, hoặc keyword (bảng § Matching):

| User nói / keyword | Template | Engine (tự động) |
|--------------------|----------|------------------|
| `ai-chat-assistant`, chat, assistant, trò chuyện | `ai-chat-assistant` | studio |
| `ai-chat-simulator`, tap chat flow | `ai-chat-simulator` | compose |
| planning, roadmap, kế hoạch, task | `ai-planning-board` | studio |
| text to image, tạo ảnh, generate art | `ai-text-to-image` | studio |
| image transform, before/after, style transfer | `ai-image-to-image` | studio |
| voice, TTS, text to audio | `ai-text-to-audio` | studio |
| writing, viết content, caption, copy | `ai-writing-generator` | studio |
| `ai-writing-assistant`, chips flow | `ai-writing-assistant` | compose |
| `text-campaign`, text campaign | `text-campaign` | studio |
| `campaign-abc`, AI modal | `campaign-abc` | studio |
| Figma, custom UI, layout đặc biệt, scaffold | `scaffold` → `playable` hoặc `landing` | scaffold |

- **Match được** (id hoặc keyword rõ) → dùng luôn, **không hỏi** template hay engine.
- **Chưa match** → sang Step 3, sau khi có chủ đề infer template từ bảng trên (ưu tiên **studio** khi ambiguous).
- **Scaffold** chỉ khi user nói rõ custom UI / Figma / không dùng template có sẵn.

Theme (studio): dùng `defaultTheme` của template — **không hỏi** trừ khi user đã nói theme cụ thể.

Preview template: `pnpm dev` → `/preview/template/<template-id>?theme=<theme-id>`

---

## Step 3 — Chủ đề (bắt buộc hỏi)

**Hỏi user:** *Chủ đề campaign là gì?* — **text input** (chat hoặc AskQuestion free text).

| Tình huống | Agent làm |
|------------|-----------|
| User **đã gửi** chủ đề trong cùng câu | Dùng luôn — **không hỏi lại** |
| Chưa có chủ đề | **Hỏi** trước khi chạy CLI — **không** tự đoán |
| Có chủ đề + chưa match template (Step 2) | Infer template từ bảng § Matching theo nội dung chủ đề |

**Không** chạy `pnpm playable:new` cho đến khi có **campaign id** + **chủ đề** (trừ user nói "để trống" / "tự thêm sau" → dùng preset mặc định của template).

---

## Step 4 — Chạy lệnh tạo

```bash
pnpm playable:new <campaign-id> studio <template-id> [theme-id]
pnpm playable:new <campaign-id> compose <template-id>
pnpm playable:new <campaign-id> scaffold [playable|landing|minimal]
```

Engine + template đã xác định ở Step 2–3 — agent chọn đúng lệnh theo `templates[].engine` trong registry.

**Không** thay bằng lệnh cũ trừ khi user yêu cầu — `playable:new` là cửa chính.

---

## Step 5 — Điền nội dung theo chủ đề

| Engine | File sửa | Skill thêm |
|--------|----------|------------|
| studio | `playables/<id>/context.json`, `scenario.json`, `playable.json` | `playable-studio` |
| compose | `playables/<id>/copy.json`, `composition.json` | `playable-compose` |
| scaffold | `src/pages/<id>/` | `playable-new-route`, `playable-mobile-scaling`, `playable-viewport-shell` |

Cập nhật copy, headline, scenario theo **chủ đề** user đã trả lời — không để preset mẫu chung chung.

Studio: **chỉ JSON**, không tạo `src/pages/<id>/` trừ khi user đổi sang scaffold.

---

## Step 6 — Preview & bàn giao Marketing

```bash
pnpm dev
pnpm playable:export <id>    # ← file HTML cuối
```

| Engine | Preview URL | Export (1 lệnh) | File output |
|--------|-------------|-------------------|-------------|
| studio | `/preview/<id>?theme=…` | `pnpm playable:export <id>` | `dist/exports/<id>.html` |
| compose | `/preview/<id>` | `pnpm playable:export <id>` | `dist/<id>/index.html` |
| scaffold | `/<id>` | `pnpm playable:export <id>` | `dist/<id>/index.html` |

Nói rõ với Marketing: upload file output lên **AppLovin Preview**.

**Trả lời user:** đọc **`playable-mkt-response`** — ngắn, có link preview + Tải lại trang Có/Không.

---

## Ví dụ hội thoại agent

**User:** Create new playable aaa

**Agent:**  
1. Chủ đề campaign là gì? (ví dụ: "app fitness AI chat")  
2. User: "AI chat cho marketer" → match `ai-chat-assistant` (studio)  
3. `pnpm playable:new aaa studio ai-chat-assistant`  
4. Cập nhật `context.json` / `scenario.json` theo chủ đề → preview → export

**User:** Tạo playable nova-chat-q1 theo template chat, chủ đề: lên kế hoạch content Q2

**Agent:**  
1. Match `ai-chat-assistant` — không hỏi template  
2. Chủ đề đã có — không hỏi lại  
3. `pnpm playable:new nova-chat-q1 studio ai-chat-assistant`  
4. Điền JSON theo brief → export

---

## Delete playable — agent workflow

**Triggers:** "delete playable", "xóa playable", "remove campaign" — **không** áp dụng cho **template** (`data/templates/`).

### Step 1 — Có id chưa?

| User nói | Agent làm |
|----------|-----------|
| `Delete playable ai-writing-tool` | `pnpm playable:delete ai-writing-tool --dry-run` → xác nhận → `pnpm playable:delete ai-writing-tool` |
| `Delete playable` / `Xóa playable` (không có tên) | Chạy `pnpm playable:delete --json` → **AskQuestion** để user chọn |

### Step 2 — Liệt kê (khi thiếu id)

```bash
pnpm playable:delete --json
```

JSON trả về `needsSelection: true` + mảng `playables[]` (`id`, `name`, `engine`).

**Bắt buộc:** dùng **AskQuestion** (Cursor) với label `id — name [engine]` cho từng playable. **Không** tự đoán hoặc xóa playable đầu tiên.

### Step 3 — Xác nhận & xóa

```bash
pnpm playable:delete <id> --dry-run   # show paths
pnpm playable:delete <id>             # xóa folder + registry + exports
```

Xóa: `playables/<id>/`, export HTML, `src/pages/<id>/` (scaffold), entry trong `data/registry/playables.json`.

**Không xóa** template gốc trong `data/templates/`.

---

## Anti-patterns

- ❌ Hỏi user chọn **studio | compose | scaffold**
- ❌ Hỏi template khi đã **match** được từ user message hoặc chủ đề
- ❌ Chạy CLI **trước khi** có chủ đề (trừ user nói để trống)
- ❌ Tự đoán chủ đề từ tên campaign id
- ❌ Tạo `src/pages/` khi engine là **studio**
- ❌ Gọi `pnpm new:page` khi user muốn template studio/compose
- ❌ `pnpm dev` thay cho export khi Marketing cần file `.html`
- ❌ Xóa playable khi user chỉ nói "delete playable" mà chưa chọn id
- ❌ Nhầm **playable** (`playables/<id>`) với **template** (`data/templates/<id>`)
