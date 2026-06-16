---
name: playable-mkt-response
description: >-
  MANDATORY after any create/edit/delete for Marketing: short reply with what changed,
  preview link, refresh yes/no. No technical jargon. Studio, compose, scaffold, template,
  screen, zone, transition, layout.
---

# Marketing reply format (sau mọi thao tác)

**Áp dụng mọi lúc** user (Marketing) prompt tạo / sửa / xóa:

- playable, campaign, template
- screen, zone, transition, layout, copy, theme, asset
- studio · compose · scaffold

**Không** giải thích kỹ thuật (JSON, patch path, lệnh CLI, file path dài…) trừ khi user hỏi rõ.

---

## Mẫu trả lời (ngắn)

```text
Đã cập nhật: [1 câu — việc vừa làm]

Xem trước: http://localhost:5173/preview/<id>
Tải lại trang: Có — bấm F5 trên tab preview
```

Hoặc khi **không** cần reload:

```text
Đã tạo: campaign "nova-chat-q1" (template Chat)

Xem trước: http://localhost:5173/preview/nova-chat-q1?theme=slate-minimal
Tải lại trang: Không — mở link trên lần đầu
```

Khi **chỉ export file HTML** (upload AppLovin):

```text
Đã xuất file HTML sẵn upload.

File: dist/exports/<id>.html
Xem trước (nếu cần): http://localhost:5173/preview/<id>
Tải lại trang: Có — F5 sau khi sửa nội dung
```

Khi **xóa**:

```text
Đã xóa: campaign "old-id"

Xem trước: —
Tải lại trang: Không
```

---

## Link preview (đủ URL, một dòng)

| Loại | URL |
|------|-----|
| Studio playable | `http://localhost:5173/preview/<playable-id>?theme=<theme-id>` |
| Studio template | `http://localhost:5173/preview/template/<template-id>?theme=<theme-id>` |
| Compose playable | `http://localhost:5173/preview/<playable-id>` |
| Scaffold page | `http://localhost:5173/<page-id>` |

- Dev server: `pnpm dev` (mặc định port **5173**).
- Luôn ghi **URL đầy đủ** để Marketing copy/mở tab mới.
- Theme: lấy từ `playable.json` / `manifest.json` / query hiện tại; nếu không rõ, bỏ `?theme=`.

---

## Tải lại trang — chỉ Có / Không (+ 1 cụm ngắn)

| Tình huống | Trả lời |
|------------|---------|
| Sửa nội dung, tab preview **đang mở** | **Có** — bấm F5 (hoặc Restart trên thanh preview) |
| Vừa **tạo mới**, chưa mở preview | **Không** — mở link lần đầu |
| Chỉ giao file `dist/...html`, không xem dev | **Không** — mở file HTML hoặc upload AppLovin |
| Xóa campaign / template | **Không** |

Không nói: hot reload, Vite, bundle, cache, JSON, scenario…

---

## Câu mở đầu theo hành động

| Hành động | Cụm |
|-----------|-----|
| Tạo | `Đã tạo:` |
| Sửa zone / screen / transition / layout / copy | `Đã cập nhật:` |
| Xóa | `Đã xóa:` |
| Export HTML | `Đã xuất file HTML:` |

Ví dụ zone: `Đã cập nhật: zone hero (Screen 1 zone 3) — ảnh mèo cute.`  
Ví dụ transition: `Đã cập nhật: transition hook-to-plan — auto 2 giây.`  
Ví dụ layout: `Đã cập nhật: padding hai bên 28px.`

---

## Checklist agent

```
[ ] 1–2 câu kết quả (Marketing hiểu được)
[ ] Link preview đầy đủ (nếu còn playable/template)
[ ] Tải lại trang: Có hoặc Không (+ hướng dẫn 3–5 từ)
[ ] Không dump patch / code / lệnh terminal (trừ khi user yêu cầu)
```
