# Skills index — single-file playable ads

Pick skills by task. Always read **`INSTRUCTIONS.md`** first.

## By user intent

| User says… | Read these skills (in order) |
|------------|------------------------------|
| **Create new playable** / tạo campaign | `playable-create-workflow` → `ai/CLI-MAP.md` → auto-match template + chủ đề |
| **Delete playable** / xóa campaign | `playable-create-workflow` (§ Delete) → `pnpm playable:delete --json` → AskQuestion |
| **Reply to Marketing** (sau tạo/sửa/xóa) | `playable-mkt-response` (**bắt buộc**) |
| **Template authoring** / edit zone / save as template | `playable-template-authoring` → `playable-data-isolation` → `docs/TEMPLATE_AUTHORING_MODE_PLAYABLE_STUDIO.md` |
| Studio fluid UI / background zone / assets | `playable-studio-fluid` |
| Build / export **single HTML** | `playable-single-file-deliver` → `playable-applovin-compliance` |
| **Template / compose** / mix A+B | `playable-compose` → `playable-applovin-compliance` |
| **Figma / CSS** — font, margin, padding theo 390×844 | `playable-mobile-scaling` (**bắt buộc** trước khi viết CSS) |
| Add **images** or **icons** | `playable-assets` |
| **Lottie** animation | `playable-lottie` |
| **Get the app** / store click | `playable-store-cta` |
| **Quiz / steps / tap** flow | `playable-interactions` |
| Upload to **AppLovin** | `playable-applovin-compliance` + `playable-single-file-deliver` |

## Full list

| Skill | Folder |
|-------|--------|
| **Create playable (ask template/scaffold)** | `skills/playable-create-workflow/` |
| **Marketing reply (short, preview link)** | `skills/playable-mkt-response/` |
| **Template authoring / zone inspector** | `skills/playable-template-authoring/` |
| **Data isolation (template vs playable sandbox)** | `skills/playable-data-isolation/` |
| Single-file deliverable | `skills/playable-single-file-deliver/` |
| New page scaffold | `skills/playable-new-route/` |
| Studio / scenario JSON | `skills/playable-studio/` |
| Studio fluid scale + bg + assets | `skills/playable-studio-fluid/` |
| Compose / blocks | `skills/playable-compose/` |
| Mobile full / desktop 390px frame | `skills/playable-viewport-shell/` |
| 390×844 CSS scaling | `skills/playable-mobile-scaling/` |
| Images & Lucide icons | `skills/playable-assets/` |
| Lottie | `skills/playable-lottie/` |
| Store / AppsFlyer CTA | `skills/playable-store-cta/` |
| Tap & multi-step UX | `skills/playable-interactions/` |
| AppLovin rules | `skills/playable-applovin-compliance/` |

## Minimum set for a typical playable

1. `playable-compose` (or `playable-new-route` for hand-coded)
2. `playable-viewport-shell`
3. `playable-mobile-scaling`
4. `playable-assets` (if images/icons)
5. `playable-lottie` (if motion)
6. `playable-store-cta`
7. `playable-interactions` (if multi-step)
8. `playable-applovin-compliance`
9. `playable-single-file-deliver`

## Commands cheat sheet

```bash
pnpm playable:new --list
pnpm playable:new my-campaign studio ai-chat-assistant
pnpm playable:new my-campaign compose ai-chat-simulator
pnpm playable:new my-campaign scaffold landing
pnpm playable:export my-campaign
pnpm build:single my-campaign
pnpm verify:applovin my-campaign
```

Full prompt ↔ CLI: **`ai/CLI-MAP.md`**
