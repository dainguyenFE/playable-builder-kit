# Playable Builder Kit — Claude pack (upload file này)

> **Claude Project:** upload **chỉ file này** (+ repo code khi implement). Thay thế toàn bộ `ai/README.md`, `INSTRUCTIONS.md`, `SKILLS-INDEX.md`, `skills/*`, `PROMPTS.md`, `MARKETING-GUIDE.md`.

Bạn build **mobile ad playable** → **một file** `dist/<page>/index.html` (CSS/JS/ảnh base64 inlined).

---

## Môi trường (chạy trước mọi lệnh `pnpm`)

| Cần | Phiên bản |
|-----|-----------|
| Node.js | >= 20.19 (khuyến nghị LTS 22) |
| pnpm | 9.x |
| Dependencies | `pnpm install` (script tự chạy) |

**User nói install / setup / cài đặt / cài môi trường:**

1. **Hỏi quyền** — giải thích sẽ cài Node / pnpm / `node_modules` nếu thiếu.
2. Sau khi user đồng ý: `bash scripts/setup-env.sh --yes` (hoặc `pnpm setup:yes`).
3. Kiểm tra `node -v`, `pnpm -v` rồi mới chạy `pnpm dev`, build, playable CLI.

Không chạy `pnpm install` riêng khi chưa có Node hoặc pnpm — dùng `scripts/setup-env.sh`.

---

## Deliverable & workflow

**「Create new playable」** — agent đọc `skills/playable-create-workflow`, **hỏi chủ đề** (text), **auto-match template** (không hỏi studio | compose | scaffold), chạy:

```bash
pnpm playable:new --list
pnpm playable:new <id> studio|compose|scaffold [template]
```

Chi tiết prompt → CLI: **`CLI-MAP.md`**.

**A — Studio (scenario JSON — khuyến nghị AI feature ads):**

```bash
pnpm studio:list
pnpm studio:create <id> ai-writing-generator
# edit playables/<id>/*.json only
pnpm studio:export <id>
# → dist/exports/<id>.html
```

**B — Compose (blocks flow):**

```bash
pnpm compose:create <id> ai-chat-simulator
pnpm compose:build <id>
```

**C — Hand-coded page:**

```bash
pnpm new:page <kebab> [playable|landing|minimal]
# implement src/pages/<kebab>/
pnpm build:single <kebab>
pnpm verify:applovin <kebab>
```

| Command | Mục đích |
|---------|----------|
| `pnpm compose:list` | Blocks, templates, playables |
| `pnpm studio:export <id>` | Single HTML `dist/exports/<id>.html` |
| `pnpm compose:build <id>` | Compose → `dist/<id>/index.html` |
| `pnpm pages` | Liệt kê page (src/pages) |
| `pnpm dev` | `http://localhost:5173/<name>` |

Default page name: `playable` nếu user không nói.

---

## Trả lời Marketing (bắt buộc sau mọi thao tác)

Sau **tạo / sửa / xóa** (playable, template, screen, zone, transition, layout, copy…): đọc skill **`playable-mkt-response`** — trả lời **ngắn**, không kỹ thuật:

```text
Đã cập nhật: [1 câu]

Xem trước: http://localhost:5173/preview/<id>
Tải lại trang: Có — F5   (hoặc Không)
```

Studio: `/preview/<id>?theme=…` · Template: `/preview/template/<id>` · Scaffold: `/<id>`

---

## Layout repo

```
blocks/                    behavior manifests
playable-templates/        default compositions
playables/<campaign>/      composition.json + copy.json (source)
src/runtime/               scene engine + block UI
src/core/                  store-link, MRAID
src/skills/                store-cta.js, lottie.js
src/pages/<name>/          built pages (compose scaffold or hand-coded)
templates/                 page scaffolds (pnpm new:page)
```

Vite auto-discovers `src/pages/*/index.html` — **không** sửa vite.config khi thêm page.

**Hard rules:** No React/Vue. No CDN (Lottie/MRAID/AppsFlyer). No `src/global.css`. No shared CSS giữa page. Prefix CSS `.route-<name>`. Không `eval`. Store → `bindStoreCta()` only.

---

## UI: mobile only (390×844)

- Implement **chỉ theo mockup mobile 390×844** — không layout desktop riêng, không `@media` cho component.
- Desktop preview = **cùng UI mobile** trong cột 390px giữa, hai bên trắng (shell tự lo).

### HTML

```html
<body class="route-<name>">
  <main class="route-<name>__app" id="app"><!-- UI --></main>
</body>
```

### Shell CSS (copy 1 lần / page — `@media` duy nhất được phép)

```css
.route-<name> { box-sizing: border-box; margin: 0; min-height: 100%; background: #fff; }
.route-<name>__app {
  container-type: size; container-name: page;
  box-sizing: border-box; width: 100%; max-width: 100%;
  min-height: 100dvh; margin: 0 auto;
  /* background campaign, color, padding scaled */
}
@media (min-width: 391px) { .route-<name>__app { max-width: 390px; } }
```

Background campaign trên `__app`, không chỉ `body`. Ref: `src/pages/test-2/style.css`.

---

## CSS scaling (bắt buộc mọi px từ Figma)

`N` = px trên artboard 390×844:

| Trục | CSS |
|------|-----|
| Ngang: font-size, padding/margin L/R, width, gap ngang, border-radius, border-width | `calc(N / 390 * 100cqw)` |
| Dọc: padding/margin T/B, height, gap dọc, translateY, shadow Y | `calc(N / 844 * 100cqh)` |
| Shorthand padding/margin | `calc(Y/844*100cqh) calc(X/390*100cqw)` |

**Cấm:** `16px`, `rem`, `vw`/`vh` cho giá trị design. **OK:** `line-height: 1.2`, màu, `0`, `100dvh` trên `__app`, shell `@media` trên.

```css
.route-x__title { font-size: calc(28/390*100cqw); margin-bottom: calc(24/844*100cqh); }
.route-x__cta { padding: calc(14/844*100cqh) calc(28/390*100cqw); border-radius: calc(12/390*100cqw); }
```

---

## New page

1. `pnpm new:page <kebab>` hoặc `pnpm new:landing <kebab>`
2. Chỉ sửa `src/pages/<kebab>/`
3. Assets: `assets/images/`, `assets/lottie/` trong page folder
4. Shell + scaling CSS như trên
5. `pnpm build:single <kebab>`

---

## Store CTA

```js
import { bindStoreCta } from "../../skills/store-cta.js";
bindStoreCta("#cta");
```

```html
<button type="button" id="cta" class="route-x__cta">Get the app</button>
```

**Không** gọi `mraid.open` / `window.open` trực tiếp trong `page.js`. OneLink fallback: `src/core/store-link.js` → `FALLBACK_URL`.

---

## Lottie

```js
import { initLottie } from "../../skills/lottie.js";
import anim from "./assets/lottie/cta.json";
initLottie(document.getElementById("ctaLottie"), anim, { loop: true, autoplay: true });
```

**Chỉ** `lottie_light` (qua helper). **Không** full `lottie-web` (có `eval`).

---

## Assets

```js
import hero from "./assets/images/hero.png";
document.getElementById("hero").src = hero; // → base64 in build
```

Icons: inline Lucide SVG trong HTML hoặc import SVG. **Không** `src="https://..."` trong dist.

---

## Interactions (vanilla)

```js
function showScreen(n) {
  document.querySelectorAll(".route-x__screen").forEach((el) => {
    const on = el.dataset.screen === String(n);
    el.hidden = !on;
    el.classList.toggle("route-x__screen--active", on);
  });
}
```

---

## AppLovin (trước khi giao file)

1. **MRAID:** `bindStoreCta` → `whenMraidReady`, `getState()`, không API khi `loading`
2. **Assets:** chỉ base64 trong HTML sau build
3. **No `eval`:** lottie_light only
4. **Icons:** inline SVG / import

```
pnpm build:single <name>
pnpm verify:applovin <name>
```

Checklist dist: không `eval(`, không `src="https://`, không `src="/src/`.

---

## Prompt mẫu

```text
Tạo page pa08-ai-models theo mockup 390×844:
- Tiêu đề + 3 bước + CTA Get the app
- Dark theme, CSS .route-pa08-ai-models, scale cqw/cqh
- bindStoreCta("#cta")
pnpm build:single pa08-ai-models → giao dist/pa08-ai-models/index.html
```

```text
Create new page hero-screen: hero + CTA Get the app, build single HTML.
```

---

## Marketing (brief — tóm tắt)

**Output:** `dist/<tên-campaign>/index.html` (1 file, không zip).

**Quy trình:** Brief 390×844 → AI build → Marketing upload **AppLovin Preview** (mobile) → OK → upload campaign.

**Brief gửi AI:** tên kebab-case, mockup/screenshot 390×844, copy, CTA, ảnh/Lottie. **Chỉ thiết kế mobile** — desktop xem giống phone.

**Tên page:** kebab-case, ví dụ `pa08-ai-models`.

**Không cần:** brief desktop full màn, React, nhiều file HTML.

---

## Verification (AI)

```
[ ] src/pages/<name>/ only, .route-<name> CSS
[ ] mobile 390×844, shell CSS once, scaling calc() for design px
[ ] bindStoreCta, lottie_light if Lottie
[ ] pnpm build:single + verify:applovin pass
[ ] hand user dist/<name>/index.html
```

---

## Roadmap

**Phase 1 ✅:** `blocks/`, `playable-templates/`, `playables/`, `pnpm compose:*`, `src/runtime/`.  
Spec: **`docs/PLAYABLE_BUILDER_KIT_SPEC.md` §29** · **`docs/COMPOSE.md`**
