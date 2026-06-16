# Prompt → CLI map (Marketing & agents)

Bảng chuyển **ý Marketing / câu nói tự nhiên** → **lệnh kit**. AI (Claude / Cursor) đọc file này khi user nói *create playable*, *tạo campaign*, *build HTML*, v.v.

**Luôn chạy `pnpm playable:new --list` trước** nếu cần liệt kê template mới nhất.

---

## Export — file HTML cuối (Marketing upload)

**Một lệnh cho mọi engine** — tự nhận studio / compose / scaffold:

```bash
pnpm playable:export --list
pnpm playable:export <playable-id>
```

| Engine | File bàn giao |
|--------|----------------|
| **studio** | `dist/exports/<id>.html` |
| **compose** | `dist/<id>/index.html` (+ verify AppLovin) |
| **scaffold** | `dist/<id>/index.html` (+ verify AppLovin) |

Alias: `pnpm playable export <id>`

| User / Marketing nói | CLI |
|----------------------|-----|
| "Build ra file HTML upload AppLovin" | `pnpm playable:export <id>` |
| "Export playable" | `pnpm playable:export <id>` |
| "File cuối cùng đâu?" | Xem output sau lệnh export ở trên |

Sau export → upload **đúng file** lên **AppLovin Preview** (xem `MARKETING-GUIDE.md` §8).

---

| User nói | Agent làm |
|----------|-----------|
| "Create new playable" / "Tạo playable mới" | **Hỏi** campaign id (nếu thiếu) + **hỏi chủ đề** (text) → auto-match template → chạy lệnh §2 |
| Đã có tên + "dùng template chat" | Match `ai-chat-assistant` — **không hỏi** engine → hỏi chủ đề nếu thiếu |
| Đã có tên + chủ đề "AI lập kế hoạch" | Match `ai-planning-board` từ chủ đề → `pnpm playable:new <id> studio ai-planning-board` |
| Đã có tên + "theo Figma / custom UI" | `pnpm playable:new <id> scaffold playable` (hoặc `landing`) + chủ đề |

### Lệnh tạo (một cửa)

```bash
pnpm playable:new --list

# A — Studio (scenario JSON, AI feature ads)
pnpm playable:new <campaign-id> studio <template-id> [theme-id]

# B — Compose (block flow)
pnpm playable:new <campaign-id> compose <template-id>

# C — Hand-coded scaffold
pnpm playable:new <campaign-id> scaffold [playable|landing|minimal]

# Delete (agent: --json khi user chưa nói tên playable)
pnpm playable:delete --list
pnpm playable:delete --json
pnpm playable:delete <playable-id> --dry-run
pnpm playable:delete <playable-id>

# Clone (copy playable → new id; agent resolve tên nguồn nếu không khớp)
pnpm playable:clone --list
pnpm playable:clone --resolve <source-ref> --json
pnpm playable:clone <new-id> <source-ref> [--name "Display name"]
```

| User / Marketing nói | CLI |
|----------------------|-----|
| `Clone playable "ABC" from playable "DEF"` | `pnpm playable:clone --resolve DEF --json` → nếu OK: `pnpm playable:clone abc def` |
| Tên nguồn không khớp / nhiều kết quả | `pnpm playable:clone --list` hoặc `--resolve` → hỏi user chọn `id` |
| "Nhân bản campaign" | Cùng flow clone; `ABC` = id mới (kebab-case), `DEF` = id hoặc tên playable gốc |

| Sau khi tạo | Preview dev | Export single HTML |
|-------------|-------------|-------------------|
| **studio** | `pnpm dev` → `/preview/<campaign-id>?theme=<theme-id>` | `pnpm studio:export <campaign-id>` → `dist/exports/<id>.html` |
| **compose** | `pnpm dev` → `/preview/<campaign-id>` | `pnpm compose:build <campaign-id>` → `dist/<id>/index.html` |
| **scaffold** | `pnpm dev` → `/<campaign-id>` | `pnpm build:single <campaign-id>` → `dist/<id>/index.html` |

**Chỉnh nội dung sau khi tạo:**

| Engine | File Marketing / AI sửa |
|--------|------------------------|
| studio | `playables/<id>/context.json`, `scenario.json`, `playable.json` |
| compose | `playables/<id>/copy.json`, `composition.json` |
| scaffold | `src/pages/<id>/` (HTML/CSS/JS) |

---

## 2. Studio templates (`engine: studio`)

Catalog themes: **`data/studio/themes.json`** (`midnight-blue`, `violet-pro`, `emerald-plan`, `rose-creative`, `amber-remix`, `aurora-voice`, `neon-cyan`, `slate-minimal`, `light-clean`).

Mỗi template có `defaultTheme` + `themes[]` trong `data/templates/<id>/template.json`.

| Template id | Dùng khi ads tính năng | Default theme |
|-------------|------------------------|---------------|
| `ai-writing-generator` | AI viết content | `violet-pro` |
| `ai-chat-assistant` | AI chat | `midnight-blue` |
| `ai-planning-board` | AI lập kế hoạch | `emerald-plan` |
| `ai-text-to-image` | Text → ảnh | `rose-creative` |
| `ai-image-to-image` | Ảnh → ảnh / style | `amber-remix` |
| `ai-text-to-audio` | Text → giọng nói | `aurora-voice` |

```bash
pnpm playable:new nova-chat-launch studio ai-chat-assistant midnight-blue
# preview theme: /preview/template/ai-chat-assistant?theme=neon-cyan
pnpm studio:export nova-chat-launch
```

---

## 3. Compose templates (`engine: compose`)

| Template id | Flow |
|-------------|------|
| `ai-chat-simulator` | Tap → chat → CTA |
| `ai-writing-assistant` | Headline → chips → result → CTA |

```bash
pnpm playable:new nova-mix compose ai-chat-simulator
pnpm compose:validate nova-mix   # nếu có
pnpm compose:build nova-mix
```

---

## 4. Scaffold (hand-coded)

| Scaffold | Khi nào |
|----------|---------|
| `playable` | Hero + Lottie + CTA (mặc định) |
| `landing` | Headline + hero + CTA, nhiều chữ |
| `minimal` | Shell trống, AI tự dựng |

```bash
pnpm playable:new pa08-ai-models scaffold landing
# implement src/pages/pa08-ai-models/
pnpm build:single pa08-ai-models
pnpm verify:applovin pa08-ai-models
```

---

## 5. Marketing — sau khi có brief

| User / Marketing nói | CLI |
|----------------------|-----|
| "Build ra file HTML upload AppLovin" (studio) | `pnpm studio:export <id>` |
| "Build ra file HTML" (compose) | `pnpm compose:build <id>` |
| "Build ra file HTML" (scaffold) | `pnpm build:single <id>` |
| "Kiểm tra AppLovin" | `pnpm verify:applovin <id>` |
| "Xem trước trên máy" | `pnpm dev` + URL preview ở bảng §1 |
| "Liệt kê campaign" | `pnpm compose:list` hoặc `pnpm studio:list` |
| "Lưu ảnh / Lottie vào thư viện" | `pnpm studio:asset save <id> --image <file>` hoặc `--lottie <file>` |
| "Xóa asset khỏi thư viện" | `pnpm studio:asset delete <id>` |
| "Gắn asset vào playable (clone inline)" | `pnpm studio:asset embed <id> --playable <playable-id>` |
| "Đổi màu / copy" (studio) | `pnpm studio:patch <id> patch.json` |

---

## Template Authoring Mode

Preview **2 khung**: device (trái) + **zone inspector** (phải) — `/preview/template/<id>` hoặc `/preview/<playable-id>`.

| User / Marketing nói | CLI / action |
|----------------------|--------------|
| "Create template `my-flow`" | **Hỏi** id + số screen + theme + chủ đề → `pnpm template:create` (§ skill) |
| "Edit template" / "edit zone 3 button1" | Sửa `data/templates/<id>/*.preset.json`; inspector → **Add to chat** trên zone |
| **"Build template `XXX`"** / sau khi sửa template | `pnpm template:export <template-id>` → `data/templates/<id>/exports/<id>.html` |
| "Save template" (sau chỉnh) | Commit JSON + chạy `pnpm template:export <id>` |
| "Save playable as template `template_name_x`" | `pnpm template:save-from-playable <playable-id> template_name_x` (auto export) |
| "Export playable HTML" | `pnpm playable:export <playable-id>` (rebuild mỗi lần) |
| Download template (dev) | `/download/template/<id>` — file đã build, không rebuild |
| Download playable (dev) | `/download/<id>` — rebuild rồi download |
| "New playable với template X theme Y" | `pnpm playable:new <id> studio <template-id> [theme-id]` |
| **"Delete playable"** / **"Xóa playable"** (không có tên) | `pnpm playable:delete --json` → **AskQuestion** chọn `id` → `--dry-run` → xóa |
| **"Delete playable &lt;id&gt;"** | `pnpm playable:delete <id> --dry-run` → xác nhận → `pnpm playable:delete <id>` |

```bash
pnpm template:catalog:generate   # regenerate 12 catalog templates from V3 doc
pnpm template:create --list
pnpm template:create my-flow --empty --screens 3 --theme slate-minimal
pnpm template:create fitness-q1 --topic "fitness app" --screens 3 --theme emerald-plan
pnpm template:create nova-chat-flow --from ai-chat-assistant   # clone only if asked
pnpm template:export nova-chat-flow
pnpm template:save-from-playable nova-chat-launch nova-chat-flow-v2
# UI: /templates/nova-chat-flow
# Preview + zones: /preview/template/nova-chat-flow?theme=midnight-blue
```

Skill: **`ai/skills/playable-template-authoring/SKILL.md`** · Spec: **`docs/TEMPLATE_AUTHORING_MODE_PLAYABLE_STUDIO.md`** · Screen scenarios: **`docs/AI_PLAYABLE_USER_CASE_SCENARIOS_V3_SCREEN_DETAIL.md`**

---

## 6. Câu prompt mẫu (copy cho Claude)

```text
Tạo playable mới tên nova-chat-spring.

Hỏi chủ đề campaign (text). Auto-match template AI chat. Sau khi tạo: chỉnh context.json
theo chủ đề, preview trên dev, export single HTML.
```

```text
Create new playable for AI text-to-image feature.
Campaign id: dreamframe-q2.
Use studio template. Export dist when done.
```

---

## 7. Agent checklist

1. [ ] Campaign id **kebab-case** (hỏi nếu thiếu)
2. [ ] Chạy `pnpm playable:new --list` hoặc đọc `data/registry/playables.json`
3. [ ] **Auto-match template** — không hỏi studio | compose | scaffold
4. [ ] **Hỏi chủ đề** (text) nếu user chưa gửi
5. [ ] Chạy `pnpm playable:new <id> <engine> <template>`
6. [ ] Điền copy từ chủ đề vào đúng file (bảng §1)
7. [ ] `pnpm dev` → preview URL
8. [ ] Export + `pnpm verify:applovin` (scaffold/compose) nếu cần bàn giao Marketing

Skill chi tiết: **`ai/skills/playable-create-workflow/SKILL.md`**
