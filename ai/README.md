# AI — Playable Builder Kit

## Gửi lên Claude (1 file — khuyến nghị)

Upload **`ai/CLAUDE-PACK.md`** vào **Project knowledge** (~200 dòng, gom rules + skills + marketing tóm tắt).

**Project instructions** (paste):

```text
Build playables in playable-builder-kit per ai/CLAUDE-PACK.md.
First time / "install" → ask permission, run bash scripts/setup-env.sh --yes (Node >=20.19, pnpm 9).
"Create new playable" → hỏi chủ đề, auto-match template, run pnpm playable:new.
Deliver: export single HTML (studio:export / compose:build / build:single).
UI mobile 390×844 only; AppLovin: bindStoreCta, lottie_light, no eval.
```

Không cần upload cả folder `ai/skills/` trừ khi muốn bản chi tiết.

---

## Cursor / dev (đầy đủ)

| # | File |
|---|------|
| 1 | `INSTRUCTIONS.md` |
| 2 | `MARKETING-GUIDE.md` (Marketing) |
| 3 | `CLI-MAP.md` (prompt → lệnh CLI) |
| 4 | `SKILLS-INDEX.md` + `skills/*` |
| 5 | `PROMPTS.md` |

`.cursor/rules/` trỏ vào `ai/`.

## Code vs AI docs

| Folder | Purpose |
|--------|---------|
| `ai/skills/` | Markdown cho AI |
| `src/skills/` | JS (`lottie.js`, `store-cta.js`) |
| `src/core/` | AppsFlyer, store-link, MRAID |
