# AI instructions: single-file HTML playable builder

You are helping build a **mobile ad playable** that ships as **one HTML file**. This project is an **AI-native Vite template**: Vite + vanilla JS, **core** + **skills** + **pages**, generators, and single-file build.

**Entry point:** read **`ai/README.md`** and **`ai/SKILLS-INDEX.md`** for which skills to load.

## Environment setup (before any `pnpm` command)

**Prerequisites:** Node.js **>= 20.19** (LTS 22 recommended) · **pnpm 9.x** · then `pnpm install`.

| Trigger | Action |
|---------|--------|
| User says **install**, **setup**, **cài đặt**, **cài môi trường**, **bootstrap** | Ask permission → run `bash scripts/setup-env.sh --yes` |
| Before first `pnpm dev` / build / playable CLI | If `node` or `pnpm` missing → same setup flow |

The script checks and installs (when approved):

1. **Node.js** — via Homebrew, nvm, or fnm on macOS/Linux
2. **pnpm** — via corepack or `npm i -g pnpm`
3. **Dependencies** — `pnpm install`

```bash
bash scripts/setup-env.sh          # interactive (asks before each step)
bash scripts/setup-env.sh --yes    # non-interactive (user already approved)
pnpm setup                         # same as interactive script
```

If auto-install fails, tell the user to install [Node.js LTS](https://nodejs.org/) manually, then re-run the script.

**Do not** run project commands until setup succeeds (`node -v`, `pnpm -v`).

## Reply to Marketing (MANDATORY after create / edit / delete)

After **any** playable work (create, edit, delete — template, screen, zone, transition, layout, copy, theme…), read **`ai/skills/playable-mkt-response/SKILL.md`** and reply **short, non-technical**:

- **Đã tạo / cập nhật / xóa:** one sentence
- **Xem trước:** full preview URL (`http://localhost:5173/preview/...`)
- **Tải lại trang:** **Có** (F5) or **Không** — no jargon

Do **not** paste JSON paths, CLI, or long technical context unless the user asks.

## "Create new playable" (MANDATORY workflow)

When the user says **create new playable**, **tạo playable mới**, **new campaign**, or similar:

1. Read **`ai/skills/playable-create-workflow/SKILL.md`** and **`ai/CLI-MAP.md`**.
2. Ask for **campaign id** (kebab-case) if missing.
3. **Auto-match template** from user message — **do not ask** studio | compose | scaffold (engine comes from registry).
4. **Ask chủ đề** (topic, text input) if not already provided — do not run CLI without topic unless user says leave empty.
5. Run `pnpm playable:new --list` then `pnpm playable:new <id> <engine> <template> [theme-id]`.
6. Fill copy/JSON from topic; continue with `playable-studio`, `playable-compose`, or `playable-new-route`.

Do **not** ask template when user already named one or keywords match an existing template.

## Your deliverable

After implementation, export the **single HTML file**:

```bash
pnpm playable:export <playable-id>
```

| Engine | Output |
|--------|--------|
| studio | `dist/exports/<id>.html` |
| compose / scaffold | `dist/<id>/index.html` |

Give Marketing that file for AppLovin upload. List playables: `pnpm playable:export --list`.

Hand-coded scaffold only (legacy): `pnpm build:single <page-name>` then `pnpm verify:applovin <page-name>`.

**Viewport:** implement **UI for mobile only** (390×844). Desktop preview = same mobile UI in a centered 390px column (shell CSS only) — **`ai/skills/playable-viewport-shell/SKILL.md`**.

Default page name: `playable` if the user does not specify one.

---

## When the user sends a Marketing / playable prompt

1. Read **`ai/README.md`** and this file.
2. Read **`ai/skills/playable-new-route/SKILL.md`** if creating a page.
3. Choose template: **`playable`** (hero + Lottie + CTA), **`landing`** (headline + hero + CTA), **`minimal`** (empty shell).
4. Create page: `pnpm new:page <kebab-name>` or `pnpm new:landing <kebab-name>`.
5. Implement only in `src/pages/<kebab-name>/`.
6. Reuse **`src/core/`** and **`src/skills/`** — never duplicate store/MRAID/Lottie logic.
7. **Before any CSS:** read **`ai/skills/playable-mobile-scaling/SKILL.md`** — all font-size, margin, padding, gap, border, radius, and layout px from the 390×844 mockup must use `calc(N/390*100cqw)` or `calc(N/844*100cqh)`.
8. Read **`ai/skills/playable-applovin-compliance/SKILL.md`** — MRAID, base64 assets, no `eval`.
9. Build with `pnpm build:single <kebab-name>` then `pnpm verify:applovin <kebab-name>` (see **`ai/skills/playable-single-file-deliver/SKILL.md`**).

---

## Skills quick map

| Need | Skill |
|------|--------|
| One HTML file output | `playable-single-file-deliver` |
| New page | `playable-new-route` |
| CSS from design | `playable-mobile-scaling` |
| Mobile full / desktop 390px frame | `playable-viewport-shell` |
| Images / icons | `playable-assets` |
| Lottie | `playable-lottie` |
| Store CTA | `playable-store-cta` |
| Steps / taps | `playable-interactions` |
| AppLovin upload | `playable-applovin-compliance` |
| Template / playable sandbox isolation | `playable-data-isolation` |

Full index: **`ai/SKILLS-INDEX.md`**

---

## Template & playable isolation (mandatory)

When editing **`data/templates/<id>/`** or **`playables/<id>/`**:

1. Read **`ai/skills/playable-data-isolation/SKILL.md`**.
2. Edit **only** the sandbox matching the preview URL — no cross-template or cross-playable patches.
3. UI differences = JSON config + theme in that folder — do **not** fork `src/runtime/**` for one template.
4. Bad JSON → preview shows error in the device frame only; Studio home and other previews keep working.

---

## Project layout

```
src/
  core/                 # shared infrastructure (all pages)
  skills/               # JS helpers: lottie.js, store-cta.js
  pages/<page-name>/    # one campaign per folder
templates/
  playable/ | landing/ | minimal/
ai/                     # AI rules + skills (markdown) — share with Claude
```

Vite **auto-discovers** any `src/pages/*/index.html` — no config edit when adding a page.

---

## Pages (one folder per campaign) — REQUIRED

```
src/pages/<page-name>/
  index.html
  page.js
  style.css
  assets/images/
  assets/lottie/
```

### Create a new page

See **`ai/skills/playable-new-route/SKILL.md`** and **`ai/PROMPTS.md`**.

### CSS rules (no cross-page pollution)

- **Never** use global/shared stylesheet for page UI.
- Prefix every selector with `.route-<page-name>`.
- **UI = mobile only (390×844).** No desktop layouts, no extra `@media` for components. Shell: **`ai/skills/playable-viewport-shell/SKILL.md`** (copy once).
- **Sizing (390×844, mandatory):** every design px → proportional `cqw`/`cqh` — **`ai/skills/playable-mobile-scaling/SKILL.md`**. No raw Figma `px` in page CSS.

### Asset rules

- Images/Lottie only in **`src/pages/<page>/assets/`**.
- Import: `import img from "./assets/images/foo.png"` (from `page.js`).

### Shared code (do not duplicate)

| Path | Purpose |
|------|---------|
| `src/core/store-link.js` | `initStoreLink`, `openAppStore` |
| `src/skills/store-cta.js` | `bindStoreCta("#cta")` |
| `src/skills/lottie.js` | `initLottie(container, data)` |

---

## Hard rules

1. **No React, Vue, Svelte, or JSX.**
2. **No CDN scripts** for Lottie, MRAID, or AppsFlyer.
3. **Store clicks** → `bindStoreCta()` or `initStoreLink()` + `openAppStore()`.
4. **Lottie** → `lottie-web/build/player/lottie_light`; JSON from `./assets/lottie/`.
5. **One HTML per build** — `pnpm build:single <name>`.
6. **AppLovin** — `bindStoreCta` only (no direct `mraid.*`); assets base64 in dist; **no `eval`**; Lottie **`lottie_light` only**; icons via **inline Lucide SVG** (see compliance skill).

---

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm pages` | List pages |
| `pnpm new:page <name> [template]` | Scaffold page |
| `pnpm new:landing <name>` | Landing template |
| `pnpm dev` | All pages — `/`, `/<name>`, `/src/pages/<name>/index.html` |
| `pnpm build` | **All pages** → `dist/<each-name>/index.html` |
| `pnpm build:single <name>` | One page only |
| `pnpm verify:applovin <name>` | Check dist HTML for eval / external assets |

---

## Store CTA (preferred)

```js
import { bindStoreCta } from "../../skills/store-cta.js";

bindStoreCta("#cta");
```

---

## Lottie

```js
import { initLottie } from "../../skills/lottie.js";
import animData from "./assets/lottie/button.json";

initLottie(document.getElementById("ctaLottie"), animData);
```

---

## Verification

```
[ ] Read ai/README.md + this file (+ task skill if any)
[ ] Page under src/pages/<name>/
[ ] style.css uses only .route-<name> prefixes
[ ] style.css follows playable-mobile-scaling (390×844, no raw design px)
[ ] UI is mobile-only — no extra @media for desktop layout
[ ] Read ai/skills/playable-applovin-compliance/SKILL.md
[ ] pnpm build:single <name> succeeds
[ ] pnpm verify:applovin <name> passes
```

---

## What NOT to do

- Do not design UI for desktop full screen — only mobile 390×844; desktop is automatic preview framing.
- Do not add `@media` breakpoints for layout/typography (except the single `__app` shell block).
- Do not add `src/global.css` or shared page CSS.
- Do not register pages in `vite.config.js`.
- Do not hand-merge HTML instead of `pnpm build:single`.

See `docs/06-routes-css-assets.md` for detail.
