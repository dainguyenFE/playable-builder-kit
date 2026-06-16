# Prompt examples — new page / marketing playable

Marketing brief workflow: **`MARKETING-GUIDE.md`**.  
Prompt → CLI: **`CLI-MAP.md`**.  
**Create new playable:** agent must read **`skills/playable-create-workflow/SKILL.md`**.

## Create new playable (agent)

```text
Create new playable
```

Agent should: ask campaign name → ask chủ đề (topic) → auto-match template → `pnpm playable:new …`

```text
Tạo playable mới tên nova-chat-q1, dùng studio template AI chat.
```

→ `pnpm playable:new nova-chat-q1 studio ai-chat-assistant`

```text
New campaign pa08-hero — custom Figma layout, landing scaffold.
```

→ `pnpm playable:new pa08-hero scaffold landing`

## English

**Scaffold only**
```text
Create new page hero-screen.
```

**Scaffold + UI (playable)**
```text
Create new page onboard-s2:
- Full-screen hero, title, CTA "Get the app"
- Use bindStoreCta from src/skills/store-cta.js
- Images in src/pages/onboard-s2/assets/images/
- CSS scoped .route-onboard-s2 only
- Build: pnpm build:single onboard-s2
```

**Landing campaign**
```text
New landing page english-office for office workers English course.
Use pnpm playable:new english-office scaffold landing, headline + hero + CTA, build single HTML.
```

## Tiếng Việt

**Tạo playable — để agent hỏi chọn template**
```text
Tạo playable mới.
```

**Tạo page trống**
```text
Tạo page mới tên hero-screen.
```

**Tạo page + giao diện**
```text
Tạo page mới onboard-s2:
- Màn hero, nút CTA "Get the app"
- Dùng bindStoreCta từ src/skills/store-cta.js
- Ảnh trong src/pages/onboard-s2/assets/images/
- CSS prefix .route-onboard-s2
- Build: pnpm build:single onboard-s2
```

## Page naming

- ✅ `hero-screen`, `onboard-s2`, `s1-intro`
- ❌ `Hero Screen`, `onboard_s2`, `S1Intro`

## Build

```text
Build single HTML cho page test-2.
```

```text
pnpm build — build tất cả page và liệt kê file trong dist/
```

## Commands

```bash
pnpm playable:new --list
pnpm playable:new <id> studio <template-id>
pnpm playable:new <id> compose <template-id>
pnpm playable:new <id> scaffold [playable|landing|minimal]
pnpm new:page <tên-page>
pnpm dev
pnpm build:single <tên-page>
pnpm studio:export <id>
pnpm compose:build <id>
```
