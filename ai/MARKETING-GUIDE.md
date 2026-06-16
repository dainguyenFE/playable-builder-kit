# Hướng dẫn Marketing — Playable Builder Kit

> **Gửi Claude:** dùng `ai/CLAUDE-PACK.md` (đã gom tóm tắt). File này là bản đầy đủ cho Marketing.

Tài liệu này dành cho **Marketing / Creative**: cách brief, dùng AI, và nhận **một file HTML** upload lên AppLovin (hoặc mạng quảng cáo tương tự).

Không cần biết code. Bạn cần: **mô tả rõ campaign**, **tên page**, và (nếu có) **design 390×844**.

---

## 1. Playable Builder Kit là gì?

Công cụ tạo **playable ad** — quảng cáo tương tác trên mobile — xuất ra **đúng một file**:

```text
dist/<tên-campaign>/index.html
```

Trong file đó đã có sẵn: giao diện, nút **Get the app**, AppsFlyer, MRAID (mở store an toàn), ảnh/Lottie (nếu có).

**Cách file hiển thị khi mở / preview:**

| Thiết bị | Hiển thị |
|----------|----------|
| **Điện thoại** | Playable **full chiều rộng và chiều cao** màn hình (như ad thật) |
| **Desktop / màn rộng** | **Cùng giao diện mobile**, khung **390px** giữa màn hình, **hai bên trắng** (kit tự xử lý — AI không thiết kế riêng cho desktop) |

Khi brief và duyệt: **chỉ cần nhìn như mobile** (mockup 390×844). Mở trên desktop chỉ để xem nhanh, không phải layout khác.

| Không phải | Là |
|-----------|-----|
| Website nhiều trang | **Một HTML** / một campaign |
| File zip nhiều asset | Mọi thứ **nhúng trong 1 file** |
| React / app phức tạp | HTML + JS đơn giản, tối ưu ad network |

---

## 2. Ai làm việc gì?

| Vai trò | Việc |
|---------|------|
| **Marketing** | Brief, nhận file HTML, **thử AppLovin Preview**, duyệt, upload campaign |
| **AI (Claude / Cursor / ChatGPT)** | Tạo playable trong kit + `pnpm build:single` → giao `dist/.../index.html` |
| **Dev (nếu có)** | Build, `pnpm verify:applovin`, hỗ trợ upload preview nếu cần |

Marketing **không** cần sửa code — chỉ cần **prompt rõ** và gửi asset (ảnh, Lottie, copy).

---

## 3. Quy trình chuẩn (brief → file HTML → thử AppLovin)

### 3a. Tạo playable mới (AI / Cursor hỏi bạn chọn)

Khi nói **「tạo playable mới」** / **「create new playable」**, AI trong kit sẽ:

1. Hỏi **tên campaign** (viết thường, gạch ngang: `nova-chat-q1`)
2. Hỏi chọn **một trong ba**:
   - **Studio template** — ads tính năng AI (chat, plan, tạo ảnh, giọng nói…) — chỉnh JSON, không code UI từ đầu
   - **Compose template** — flow block (tap → chat → CTA)
   - **Scaffold** — UI theo Figma / thiết kế riêng (code trong `src/pages/`)
3. Chạy lệnh tương ứng (xem **`ai/CLI-MAP.md`**)

```bash
pnpm playable:new --list          # xem template
pnpm playable:new <tên> studio ai-chat-assistant
pnpm playable:new <tên> compose ai-chat-simulator
pnpm playable:new <tên> scaffold landing
```

Xem trước template (chưa tạo campaign): `pnpm dev` → `/preview/template/<template-id>`  
Xem campaign sau khi tạo: `/preview/<tên-campaign>` (studio/compose) hoặc `/<tên>` (scaffold).

---

Mục tiêu Marketing: có **một file `.html`**, mang sang **AppLovin Preview** xem giống user thật, duyệt xong mới đẩy campaign.

```text
① Brief campaign (Marketing)
      Gửi: tên campaign, mockup 390×844, copy, CTA, ảnh/Lottie (nếu có)
      ↓
② AI tạo playable + build ra 1 file HTML
      Output: dist/<tên-campaign>/index.html
      ↓
③ Marketing nhận file HTML
      Ví dụ: dist/test-2/index.html (chỉ 1 file, không cần zip asset)
      ↓
④ Thử trên AppLovin Preview
      Upload file HTML vào công cụ preview / test creative của AppLovin
      Xem trên mobile: tap, scroll, nút Get the app
      ↓
⑤ Chưa OK? → brief chỉnh lại → AI build lại → thử preview lại (lặp ②–④)
      ↓
⑥ OK trên preview → upload cùng file HTML lên campaign thật
```

**Marketing tập trung bước ① ③ ④ ⑥.** Bước ② do AI/dev trong kit (`pnpm build:single <tên-campaign>`).

**Thời gian tham khảo:** vòng brief → file HTML → preview thường vài giờ đến 1–2 ngày (tùy số lần chỉnh).

---

## 3b. AI trả lời sau khi chỉnh (bạn cần gì)

Sau mỗi lần prompt **tạo / sửa / xóa** (campaign, template, màn hình, zone, transition, layout…), AI trả lời **ngắn** — không giải thích kỹ thuật:

```text
Đã cập nhật: [1 câu — ví dụ zone hero đổi ảnh mèo]

Xem trước: http://localhost:5173/preview/<tên-campaign>
Tải lại trang: Có — bấm F5
```

| Dòng | Ý nghĩa |
|------|---------|
| **Đã tạo / cập nhật / xóa** | Việc vừa xong |
| **Xem trước** | Link mở trên trình duyệt (cần `pnpm dev` đang chạy) |
| **Tải lại trang** | **Có** = bấm F5 tab preview · **Không** = mở link mới hoặc chỉ cần file HTML |

Link thường gặp:

- Campaign studio: `http://localhost:5173/preview/<tên>?theme=<theme>`
- Template: `http://localhost:5173/preview/template/<template-id>`
- File upload AppLovin: `dist/exports/<tên>.html` (studio)

Chi tiết cho AI: `ai/skills/playable-mkt-response/SKILL.md`

---

## 4. Đặt tên campaign (page name)

Mỗi campaign = **một folder** = **một file HTML**.

| Đúng | Sai |
|------|-----|
| `hero-screen` | `Hero Screen` |
| `onboard-s2` | `onboard_s2` |
| `pa08-ai-models` | `PA08 AIModels` |

Quy tắc: **chữ thường**, nối bằng **dấu gạch ngang** (`kebab-case`).

---

## 5. Chọn loại template

| Template | Khi nào dùng | Lệnh tạo |
|----------|--------------|----------|
| **playable** (mặc định) | Playable thường: hero, CTA, có thể có Lottie | `pnpm new:page <tên>` |
| **landing** | Nhiều chữ: headline, subhead, hero, CTA | `pnpm new:landing <tên>` |
| **minimal** | Shell trống, AI tự dựng layout | `pnpm new:page <tên> minimal` |

Ví dụ campaign PA08 AI Models → có thể dùng **landing** hoặc **playable** tùy layout.

### 5b. Template hành vi (compose — khuyến nghị)

Template **không fix UI** — chỉ định nghĩa **flow** (tap, chat, chọn chip, CTA). Skin (màu, copy) trong `copy.json`.

| Template id | Mô tả |
|-------------|--------|
| `ai-chat-simulator` | Intro tap → chat giả lập → CTA |
| `ai-writing-assistant` | Headline → chọn chip → result card → CTA |

```bash
pnpm compose:list
pnpm compose:create <tên-campaign> ai-chat-simulator
# chỉnh playables/<tên-campaign>/copy.json (+ composition.json nếu ghép template)
pnpm compose:build <tên-campaign>
```

**Ghép template:** sửa `playables/<tên>/composition.json` — ví dụ màn chat từ `ai-chat-simulator`, result từ `ai-writing-assistant` (xem `playables/campaign-nova-mix-v1/`).

---

## 6. Design & kích thước

- Khung thiết kế chuẩn: **390 × 844** — **chỉ mobile**; AI implement theo mockup này, không làm layout desktop riêng.
- Gửi số **px** trên mockup (font, margin, padding, gap, bo góc…) — AI scale theo tỷ lệ màn (`playable-mobile-scaling`).
- Mở file trên desktop: vẫn **giống mobile** (cột 390px giữa, hai bên trắng) — Marketing **không cần** brief thêm cho desktop full màn hình.

Gửi cho AI kèm brief:

- Screenshot / Figma link (nếu có)
- Màu nút CTA, copy tiếng Anh/Việt
- Danh sách bước màn hình (step 1, 2, 3…)

---

## 7. Mẫu brief & prompt (copy cho AI)

### A. Tạo campaign mới (trống + làm theo design)

```text
Tạo playable mới tên pa08-ai-models.

Layout theo design 390x844 (font/margin/padding scale theo tỷ lệ màn):
- Tiêu đề: Build a Marketing Plan for App Launch
- 3 bước: Claude (research) → ChatGPT (plan) → Gemini (finalize)
- Nút CTA cuối: Get the app → mở store
- Dark theme, giống mockup đính kèm

Sau khi xong: pnpm build:single pa08-ai-models và giao dist/pa08-ai-models/index.html
```

### B. Chỉ tạo folder (dev tiếp sau)

```text
Tạo page mới tên summer-sale-2026, template landing.
```

### C. Chỉnh campaign đã có

```text
Trên page test-2:
- Đổi headline thành ...
- Thêm ảnh hero từ assets/images/hero.png
- Build lại: pnpm build:single test-2
```

### D. Build tất cả campaign trong repo

```text
Chạy pnpm build cho tất cả page và báo danh sách file trong dist/
```

### E. Một campaign cụ thể

```text
Build single HTML cho page test-2, verify AppLovin, gửi path file output.
```

**Gợi ý:** Đính kèm ảnh mockup + ghi rõ tên page (`test-2`, `pa08-ai-models`).

---

## 8. Thử trên AppLovin Preview (bước chính cho Marketing)

Sau khi có `dist/<tên-campaign>/index.html`:

1. Đăng nhập **AppLovin** (hoặc MAX dashboard của team).
2. Vào mục **Playable / HTML / Creative preview** (tên menu có thể khác tùng account).
3. **Upload** file `index.html` (một file duy nhất).
4. Mở **preview trên điện thoại** (QR code / link preview / in-app test) — ưu tiên cách AppLovin cung cấp.
5. Kiểm tra nhanh:
   - Layout đúng mockup (390×844)
   - Tap / scroll mượt
   - CTA **Get the app** hoạt động
   - Không màn trắng, không lỗi load asset

| Nên | Không nên |
|-----|-----------|
| Duyệt bằng **AppLovin Preview** | Chỉ mở file HTML bằng double-click trên máy tính (không có MRAID, khác môi trường ad) |
| Giữ đúng file từ `dist/` | Sửa tay trong file HTML rồi upload (dễ lỗi, mất lần build sau) |

**Tùy chọn (dev):** xem sớm trên `pnpm dev` trước khi build — không thay thế preview AppLovin.

---

## 9. Build & file bàn giao

| Lệnh | Kết quả |
|------|---------|
| **`pnpm playable:export <id>`** | **Một file HTML** — tự chọn engine (khuyến nghị Marketing) |
| `pnpm playable:export --list` | Liệt kê playable + đường dẫn file output |
| `pnpm studio:export <id>` | Studio only → `dist/exports/<id>.html` |
| `pnpm compose:build <id>` | Compose only → `dist/<id>/index.html` |
| `pnpm build:single <id>` | Scaffold only → `dist/<id>/index.html` |
| `pnpm build` | **Tất cả** page trong project → nhiều file trong `dist/` |

**File upload lên ad network:** chỉ lấy từ `dist/`, **không** upload folder `src/`.

Ví dụ:

```text
dist/test-2/index.html   → upload file này cho campaign test-2
```

---

## 10. Checklist trên AppLovin Preview

Trước khi **upload campaign chính thức**, đã pass preview:

- [ ] Đã upload đúng file `dist/<tên-campaign>/index.html`
- [ ] Preview trên **mobile** (qua AppLovin), không chỉ desktop
- [ ] CTA **Get the app** / mở store OK trong môi trường preview
- [ ] Copy, ảnh, animation đúng brief
- [ ] Không reject message kiểu MRAID / base64 / eval (dev chạy `pnpm verify:applovin <tên>` trước khi giao file)

---

## 11. Asset Marketing cần chuẩn bị

| Asset | Định dạng | Ghi chú |
|-------|-----------|---------|
| Ảnh hero, banner | PNG / JPG / WebP | Gửi file hoặc đặt vào brief |
| Icon UI | SVG (khuyên Lucide) | AI nhúng inline, không link ngoài |
| Animation nút | Lottie JSON | File `.json`, đặt tên rõ (vd. `cta.json`) |
| Copy | Text trong brief | Headline, body, CTA |
| OneLink / store | URL campaign | Dev cập nhật `FALLBACK_URL` trong kit nếu đổi app |

**Không** dùng ảnh host trên URL ngoài trong bản production — phải nằm trong file HTML sau build.

---

## 12. Setup AI (một lần cho team)

### Claude (khuyên dùng cho campaign dài)

1. Zip folder **playable-builder-kit** (bỏ `node_modules`, `dist`).
2. Upload vào **Project knowledge**: folder `ai/` + file `CLAUDE.md`.
3. **Project instructions** (dán):

```text
Bạn build playable ad trong playable-builder-kit.
Luôn đọc ai/README.md và ai/INSTRUCTIONS.md trước khi làm.
Đọc ai/MARKETING-GUIDE.md khi nhận brief từ Marketing.
Deliverable: pnpm build:single <page> → dist/<page>/index.html (một file).
Trước upload: tuân thủ ai/skills/playable-applovin-compliance/SKILL.md.
```

### Cursor (team dev / creative kỹ thuật)

Mở repo trong Cursor — rules tự trỏ `ai/`. Marketing có thể chat trong project đã clone.

---

## 13. Câu hỏi thường gặp

**Hỏi: Một kit làm được bao nhiêu campaign?**  
Trả lời: Không giới hạn — mỗi campaign một folder `src/pages/<tên>/`, build ra một HTML.

**Hỏi: Sửa copy sau khi build được không?**  
Trả lời: Sửa trong source rồi **build lại** — không sửa trực tiếp file `dist/*.html`.

**Hỏi: Campaign cũ `playable` có xóa không?**  
Trả lời: Không tự xóa. Mỗi campaign tên riêng; `pnpm build` build hết tất cả page đang có.

**Hỏi: Khác gì playable làm tay trên repo chính?**  
Trả lời: Cùng chuẩn output (1 HTML, MRAID, AppsFlyer). Kit này tối ưu cho **AI + template + quy trình Marketing**.

**Hỏi: Tiếng Việt trên playable được không?**  
Trả lời: Được — copy trong brief; không giới hạn ngôn ngữ UI.

---

## 14. Tài liệu kỹ thuật (cho AI / dev)

| File | Nội dung |
|------|----------|
| `ai/README.md` | AI đọc đầu tiên |
| `ai/INSTRUCTIONS.md` | Quy tắc đầy đủ |
| `ai/SKILLS-INDEX.md` | Chọn skill theo việc |
| `ai/PROMPTS.md` | Thêm ví dụ prompt |
| `ai/skills/` | Chi tiết: MRAID, Lottie, build, v.v. |

---

## 15. Tóm tắt một dòng cho Marketing

> **Brief rõ → AI giao `dist/<tên>/index.html` → upload file đó vào AppLovin Preview → duyệt mobile → OK thì đẩy campaign.**
