# Playable Builder Kit (AI-native Vite template)

Self-contained template to build **one single HTML file** per mobile ad playable or marketing page (AppLovin / MRAID / AppsFlyer).

Designed for **AI agents** (Claude, Cursor, ChatGPT). Works **without** the main `playable` monorepo — zip and share.

## Structure

```
blocks/                # behavior modules (tap, chat, CTA…)
playable-templates/    # default compositions
playables/<campaign>/  # composition.json + copy.json
ai/                    # AI rules + skills
src/runtime/           # scene engine
src/core/              # AppsFlyer, MRAID
src/pages/<name>/      # built pages
templates/             # hand-coded page scaffolds (pnpm new:page)
```

See **[docs/STUDIO.md](docs/STUDIO.md)** and **[docs/COMPOSE.md](docs/COMPOSE.md)**.

## Marketing

**[ai/MARKETING-GUIDE.md](ai/MARKETING-GUIDE.md)** — hướng dẫn tiếng Việt: brief campaign, mẫu prompt AI, build, upload AppLovin.

## Quick start

**First time?** Bootstrap Node.js, pnpm, and dependencies:

```bash
bash scripts/setup-env.sh
# or: pnpm setup
```

Requires **Node.js >= 20.19** and **pnpm 9.x** (script installs them when missing on macOS/Linux).

```bash
cd playable-builder-kit
pnpm install   # skip if you already ran setup-env.sh
pnpm compose:list
pnpm studio:export ai-writing-tool  # dist/exports/ai-writing-tool.html
pnpm compose:build campaign-nova-mix-v1
pnpm dev                                  # http://localhost:5173/<page>
pnpm build:single <page>
```

## AI setup (Claude / ChatGPT / Cursor)

All rules + skills live in **`ai/`** (shareable — not `.cursor/rules` alone).

| File | Purpose |
|------|---------|
| `ai/README.md` | Read first |
| `ai/INSTRUCTIONS.md` | Full rules |
| `ai/SKILLS-INDEX.md` | Which skill to use when |
| `ai/skills/playable-single-file-deliver/` | **Build one HTML** end-to-end |
| `ai/skills/playable-applovin-compliance/` | AppLovin MRAID / base64 / no eval |

Root `CLAUDE.md` → `ai/`. Cursor `.cursor/rules/` points to same `ai/` folder.

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm pages` | List pages |
| `pnpm new:page <name>` | Scaffold page |
| `pnpm dev` | All pages — `/`, `/<name>` |
| `pnpm build` | All pages → `dist/*/index.html` |
| `pnpm build:single <name>` | One page only |
| `pnpm verify:applovin <name>` | Quick AppLovin checks |

## Deliverable

`pnpm build:single <name>` → **`dist/<name>/index.html`** — one file, base64 images, inlined JS/CSS.
