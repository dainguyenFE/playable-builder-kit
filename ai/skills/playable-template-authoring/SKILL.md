---
name: playable-template-authoring
description: >-
  MANDATORY when user says create template, edit template, save template,
  save playable as template, edit zone N, zone inspector, template authoring mode.
---

# Template Authoring Mode — agent workflow

Read **`docs/TEMPLATE_AUTHORING_MODE_PLAYABLE_STUDIO.md`**, **`docs/AI_PLAYABLE_USER_CASE_SCENARIOS_V3_SCREEN_DETAIL.md`** (screen-level source of truth), and **`ai/CLI-MAP.md`** § Template Authoring.

## V3 screen contract (bắt buộc khi tạo/sửa template)

Mỗi screen phải có đủ: **purpose, layout, main content, visual, animation, transition** theo V3 doc.

| Rule | Chi tiết |
|------|----------|
| Non-final screens | `autoNext` 3–4s + `clickNext` |
| Final CTA screen | **Không** `autoNext` — hero AI result + CTA (không chỉ button) |
| Main content | Copy/result cụ thể — checklist, cards, metrics, itinerary days, before/after text |
| CTA layout | Đa dạng theo result type (§3 + §5 anti-duplication) |

Catalog templates (12 scenarios): `pnpm template:catalog:generate` → `scripts/lib/user-case-catalog.mjs` từ V3 doc.

Custom template `--topic`: scaffold theo V3 timing + final screen có `cta_result` hero.

## Triggers

- "create template", "tạo template mới", "tạo template"
- "edit template", "sửa template"
- "save template", "save playable as template", `template_name_x`
- **"build template XXX"**, "export template XXX"
- "edit zone 3 button1", "đổi text zone", "tăng size nút zone 1"
- Preview with zone inspector / dual preview

---

## Create template workflow (bắt buộc — không bỏ qua)

Khi user nói **tạo template** / **create template**, agent **phải hỏi** trước khi chạy CLI. **Không** tự clone template khác (vd. `ai-writing-generator`) trừ khi user yêu cầu clone.

### Step 1 — Template id

- Format **kebab-case** (`text-campaign`, `fitness-launch-q1`)
- Hỏi nếu user chưa cho

### Step 2 — Số màn hình

- Hỏi: **bao nhiêu screen?** (1–8)
- Mặc định gợi ý: **3** (Hook → Demo → CTA) nếu user không chắc

### Step 3 — Theme (màu brand)

Chạy `pnpm template:create --list` hoặc đọc `data/studio/themes.json`.

| Theme id | Tên | Màu chính |
|----------|-----|-----------|
| `slate-minimal` | Slate Minimal | #64748B |
| `midnight-blue` | Midnight Blue | #3B82F6 |
| `violet-pro` | Violet Pro | #7C3AED |
| `emerald-plan` | Emerald Plan | #10B981 |
| `rose-creative` | Rose Creative | #EC4899 |
| `neon-cyan` | Neon Cyan | #06B6D4 |
| `light-clean` | Light Clean | #2563EB |
| … | Xem `--list` | |

Hỏi user chọn theme — **không** tự chọn trừ khi user đã nói rõ.

### Step 4 — Chủ đề / brief (2 bước — không gộp)

**Bước 4a** — Hỏi mode:
- **Để trống** → `--empty`
- **Có chủ đề** → sang bước 4b (bắt buộc)

**Bước 4b** — Nếu user chọn **có chủ đề**, **phải hỏi tiếp** chủ đề cụ thể (AskQuestion hoặc chat):
- Ví dụ: "app fitness", "ABC thương hiệu tiện ích", "AI chat cho marketer"
- **Không** tự đoán từ tên template (vd. `campaign-abc` ≠ chủ đề)
- **Không** chạy `--topic` cho đến khi có câu trả lời rõ

| User trả lời | Agent làm |
|--------------|-----------|
| **Bỏ trống** / "empty" / "tự thêm sau" | `--empty` — mỗi màn chỉ `background`, user thêm zone + screen sau trong inspector |
| **Có chủ đề** (sau khi hỏi 4b) | `--topic "<câu user trả lời>"` — CLI scaffold mẫu; agent **tinh chỉnh** `context.preset.json` theo brief |

### Step 5 — Chạy lệnh

```bash
pnpm template:create --list

# Empty — user tự edit screen/zone sau
pnpm template:create <template-id> --empty --screens 3 --theme slate-minimal

# Có chủ đề — mẫu theo topic (+ agent chỉnh copy nếu brief dài)
pnpm template:create <template-id> --topic "fitness app launch" --screens 3 --theme emerald-plan

# Clone (chỉ khi user yêu cầu)
pnpm template:create <template-id> --from ai-chat-assistant

pnpm template:export <template-id>
```

Registry `data/registry/playables.json` được cập nhật tự động (status `draft`).

### Step 6 — Trả lời Marketing

Đọc **`playable-mkt-response`**: preview `/preview/template/<id>?theme=…`, Tải lại trang Không (mở link lần đầu).

---

## Marketing prompt → action

| User nói | Agent làm |
|----------|-----------|
| Create template `my-flow` | **Hỏi** screens + theme + chủ đề → `pnpm template:create` (xem skill § Create template workflow) |
| Edit template | Sửa `data/templates/<id>/*.preset.json` + `template.json` — **không** sửa runtime core |
| Edit zone N `"elementId"` | Mở preview → đọc zone inspector hoặc `window.__PB_ZONE_INDEX__` → patch đúng `patchPaths` |
| Save playable as template | `pnpm template:save-from-playable <playable-id> <new-template-id>` (auto-runs export) |
| **Build template** `XXX` | `pnpm template:export <template-id>` → `data/templates/<id>/exports/<id>.html` |
| Export playable HTML | `pnpm playable:export <playable-id>` (rebuild mỗi lần) |
| Download template (dev) | `/download/template/<id>` — serve file đã build, **không** rebuild |
| Download playable (dev) | `/download/<id>` — **rebuild** rồi download |

---

## Scope isolation (bắt buộc)

**Template = khung sườn.** `pnpm playable:new` / `studio:create` **copy** preset JSON vào `playables/<id>/` — snapshot độc lập.

| Hành động | Ảnh hưởng |
|-----------|-----------|
| Sửa `data/templates/A/**` | Chỉ template A + preview `/preview/template/A` — **không** đổi playable đã tạo |
| Sửa `playables/B/**` | Chỉ campaign B — **không** đổi template gốc hay playable khác |
| `pnpm template:catalog:generate` | Chỉ regenerate `data/templates/*` — **không** chạm `playables/` |

Mỗi template / playable là **sandbox độc lập**.

| Đang sửa | Preview URL | Chỉ được chạm |
|----------|-------------|----------------|
| Template `<id>` | `/preview/template/<id>` | `data/templates/<id>/**` |
| Playable `<id>` | `/preview/<id>` | `playables/<id>/**` |

**Inspector / Add to chat:** scope theo preview URL — playable preview → `playables/<id>/*.json`; template preview → `*.preset.json`. `playable.template.id` trên campaign chỉ là **provenance** (read-only), không phải file cần sửa.

**Không** patch file của template/playable khác. **Không** sửa `src/runtime/**` trừ khi fix engine chung. Sau sửa template → `pnpm template:export <id>`; playable → `pnpm playable:export <id>`.

**Preview = export:** design size từ `playable.json` → `viewport` (390×844). **Mobile (≤768px):** export full 100% màn hình, typography scale theo `cqw` thật. **Desktop:** khung cố định design + scale-to-fit giữa màn — giống device frame preview.

---

## CRUD theo scope

| Entity | Create | Edit | Delete |
|--------|--------|------|--------|
| **Template** | `pnpm template:create <id>` | `data/templates/<id>/*.preset.json` | xóa folder + registry entry (thủ công) |
| **Playable** | `pnpm playable:new <id> studio <template-id>` | `playables/<id>/*.json` | `pnpm playable:delete <id>` |
| **Screen** | thêm object vào `screens[]`, set `entryScreen` nếu cần | `autoNext` / `clickNext` / `transition` | xóa screen + rewire `target` của màn trước |
| **Zone** | thêm `elements[]` + `steps[]` + `context` key | patch theo `patchPaths` inspector | xóa element + mọi `steps[].target` trùng id |

---

## Hierarchy

```
Playable
  └── Screen 1, 2, 3… (scenario.screens[])
        ├── Transition (autoNext, clickNext, durationMs)
        └── Zones (elements[] on that screen)
```

Preview inspector: **Screens** list → **Transition** block → **Zones** list.

| User prompt | Patch |
|-------------|-------|
| Edit screen 1 — auto sang screen 2 sau 2 giây | `scenario.json` → `screens[id=screen_hook].autoNext.afterMs` = 2000 |
| Thêm màn hình sau screen 1 | New object in `screens[]`, wire `autoNext.target` / `clickNext.target` |
| Create template 3 màn hình | `scenario.preset.json` with 3 screens + `entryScreen` |
| Edit zone 3 on screen 2 | Zone = `elements[]` on that screen; copy uses `screenZoneNumber` |

## Add to chat

- **Zone card** → **Add to chat** — opens Cursor chat with zone edit prompt pre-filled (via `cursor://` deeplink)
- **Header** → **Add to chat** — current screen/zone selection
- Fallback: copies to clipboard if deeplink blocked (paste ⌘V in chat)

Event: `pb-screen-change` — `window.__PB_GOTO_SCREEN__(screenId)` jumps preview.

Example `autoNext` patch:

```json
{
  "op": "replace",
  "path": "/screens/0/autoNext/afterMs",
  "value": 2000
}
```

Or edit `scenario.preset.json`:

```json
"autoNext": { "enabled": true, "afterMs": 2000, "target": "screen_chat" },
"clickNext": { "enabled": true, "target": "screen_chat" }
```

---

`pnpm dev` → `/preview/template/<id>` hoặc `/preview/<playable-id>`

| Khung | Mục đích |
|-------|----------|
| **Trái — device frame** | Gần như HTML export thật |
| **Phải — zone inspector** | Zone number, `elementId`, type, `context.*` slot, timeline steps (animation, `atMs`) |

- Click zone → highlight trên device + **Add to chat** (fills Cursor chat với zone context)
- Checkbox **Show zone labels** → overlay `data-target` trên preview

Event: `pb-screen-change` — detail `{ screenId, screen, zoneIndex, zones }`.

---

## Edit zone — patch rules

1. Lấy zone từ inspector (zone number = thứ tự element trên toàn scenario, hoặc `zoneId` = `element.id`).
2. **Đổi copy/text** → `context.json` / `context.preset.json` key trong `textKey`, hoặc `elements[].text`.
3. **Animation / timing** → `scenario.json` → `screens[id].steps[]` (`target`, `atMs`, `action`, `animation`).
4. **Ẩn/hiện element** → `elements[].hidden`.
5. **Variant/style** → `elements[].variant` (nếu renderer hỗ trợ).

Sau sửa → refresh preview; chạy `pnpm studio:validate <playable-id>` nếu là playable.

**Trả lời Marketing:** đọc **`playable-mkt-response`** (ngắn — link preview + Tải lại trang Có/Không).

---

## Files

```
data/templates/<template-id>/
  template.json
  playable.preset.json
  context.preset.json
  scenario.preset.json
  assets.preset.json
  editable-zones.preset.json   # generated on save-from-playable
```

Runtime zone index: `src/runtime/studio/zone-index.js` — `buildZoneIndex()`, `formatZoneIndexForAI()`.

---

## CLI

```bash
pnpm template:create --list
pnpm template:create <template-id> --empty --screens <N> --theme <theme-id>
pnpm template:create <template-id> --topic "<chủ đề>" --screens <N> --theme <theme-id>
pnpm template:create <template-id> --from <source-template-id>   # clone — chỉ khi user yêu cầu
pnpm template:save-from-playable <playable-id> <new-template-id>
pnpm playable:new <campaign-id> studio <template-id> [theme-id]
```

Studio UI: `/templates/<id>` — file list + link preview.
