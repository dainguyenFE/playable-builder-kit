# TEMPLATE_AUTHORING_MODE_PLAYABLE_STUDIO.md

# Template Authoring Mode cho Prompt Playable Studio

## 1. Mục tiêu

Mục tiêu của project là tạo một **Prompt-driven Playable Ads Studio** để Marketing có thể dùng **Claude Code** prompt trực tiếp trên project, tạo nhanh playable ads dạng mobile preview, chỉnh sửa bằng prompt, approve, sau đó export ra **một file HTML duy nhất**.

Flow cuối cùng:

```txt
Marketing prompt trên Claude Code
→ Claude đọc rule / skill / instruction trong project
→ Claude tạo hoặc sửa template / block / context / playable
→ Chạy preview mobile
→ Marketing xem preview
→ Marketing prompt chỉnh tiếp
→ Approve
→ Export single HTML
```

Output cuối cùng:

```txt
dist/playables/[playableId]/index.html
```

File `index.html` phải là single file:

- Inline CSS
- Inline JavaScript
- Inline data/config
- Inline hoặc embed assets
- Không phụ thuộc file ngoài
- Có thể upload lên ad network như playable HTML

---

## 2. Core idea

Project không nên hoạt động theo kiểu:

```txt
Prompt → generate code tự do → project càng ngày càng rác
```

Mà nên hoạt động theo kiểu:

```txt
Prompt → structured JSON/config → runtime render → preview → export HTML
```

Claude Code có thể sửa file trong project, nhưng phải tuân thủ rule:

- Không sửa runtime core nếu không cần
- Không tạo arbitrary JavaScript tự do
- Không tạo route vật lý mới cho từng playable
- Không hard-code campaign content vào template reusable
- Ưu tiên sinh `json/config/patch`
- Luôn chạy validate trước khi preview/export

---

## 3. Các mode chính

Hệ thống nên có 4 mode chính:

```txt
1. Playable Generation Mode
2. Template Authoring Mode
3. Block Authoring Mode
4. Context Authoring Mode
```

---

# 4. Playable Generation Mode

Dùng khi Marketing muốn tạo một playable cụ thể cho campaign.

Ví dụ prompt:

```txt
Tạo playable cho AI Resume Builder.
Dùng template AI Chat Flow.
Flow gồm: problem → AI typing → result → CTA.
Style sạch, giống LinkedIn, màu xanh.
CTA là Build Resume.
```

Claude sẽ tạo:

```txt
playables/ai-resume-builder/
  playable.json
  scenario.json
  context.json
  assets.json
  manifest.json
  prompts/
  versions/
```

Playable là output cuối có thể preview/export.

---

# 5. Template Authoring Mode

Dùng khi Marketing hoặc team muốn tạo một template reusable để dùng lại cho nhiều campaign.

Ví dụ prompt:

```txt
Tạo một reusable template cho AI SaaS dạng chat.
Flow gồm: intro → typing prompt → AI loading → result → CTA.
Style dark mode, futuristic, mobile-first.
Template này phải reusable cho nhiều sản phẩm AI khác nhau.
```

Claude phải hiểu đây là:

```txt
mode: template-authoring
```

Không phải:

```txt
mode: playable-generation
```

Template không nên chứa content cố định như:

```txt
WriteMate AI
Try Free Now
```

Template nên chứa placeholder/slot:

```txt
{{productName}}
{{headline}}
{{ctaText}}
{{resultText}}
```

---

## 5.1 Template là gì?

Template là cấu trúc tái sử dụng để tạo nhiều playable.

Ví dụ template:

```txt
AI Chat Flow
AI Before After Flow
AI Typing Result Flow
AI Quiz Recommendation Flow
AI Dashboard Insight Flow
AI Agent Task Flow
```

Template định nghĩa:

- Layout
- Editable slots
- Allowed blocks
- Scenario preset
- Theme tokens
- Animation preset
- Mobile safe area
- Export constraint

---

## 5.2 Playable khác Template thế nào?

| Loại | Ý nghĩa | Có content campaign cụ thể không? |
|---|---|---|
| Template | Khung reusable | Không nên |
| Playable | Bản ads cụ thể | Có |
| Block | UI unit nhỏ | Không hoặc rất ít |
| Context | Ngữ cảnh sản phẩm/campaign | Có |

Ví dụ:

```txt
Template:
- AI Chat Flow

Context:
- Product: AI Resume Builder
- Audience: Job seeker
- CTA: Build Resume

Playable:
- AI Resume Builder Ad dùng template AI Chat Flow
```

---

# 6. Block Authoring Mode

Dùng khi muốn tạo reusable UI block.

Ví dụ prompt:

```txt
Tạo block AI Loading Card.
Block có icon spark, text loading, animation pulse.
Có thể dùng trong mọi template AI.
```

Claude sẽ tạo:

```txt
blocks/ai-loading-card/
  block.json
  metadata.json
  preview.json
  prompts/
  versions/
```

Block nên reusable và không phụ thuộc campaign.

Ví dụ block:

```txt
headline
typing-input
ai-loading-card
result-card
cta-button
before-after-slider
progress-bar
quiz-option-card
dashboard-metric-card
```

---

# 7. Context Authoring Mode

Dùng khi muốn tạo ngữ cảnh sản phẩm/campaign để inject vào template.

Ví dụ prompt:

```txt
Tạo context cho sản phẩm AI Resume Builder.
Audience là sinh viên và người đi làm.
Pain point là viết CV khó, mất thời gian.
Benefit là tạo CV chuyên nghiệp trong vài giây.
CTA là Build Resume.
```

Claude sẽ tạo:

```txt
contexts/ai-resume-builder/
  context.json
  copy.json
  metadata.json
```

Context có thể chứa:

- Product name
- Audience
- Pain points
- Key benefits
- CTA text
- Tone of voice
- Visual direction
- Brand constraints
- Legal/disclaimer copy nếu cần

---

# 8. Project structure đề xuất

```txt
playable-builder-kit/
  INSTRUCTION.md
  CLAUDE.md

  prompts/
    system/
      claude-code-workflow.md
      playable-generator.md
      template-authoring.md
      block-authoring.md
      context-authoring.md
      single-html-exporter.md

    examples/
      create-playable.md
      update-playable.md
      create-template.md
      update-template.md
      create-block.md
      create-context.md

  rules/
    asset-rules.md
    scenario-rules.md
    template-rules.md
    block-rules.md
    export-rules.md
    ad-network-rules.md

  skills/
    asset-normalization.md
    mobile-preview.md
    conversion-copywriting.md
    playable-qa.md
    single-html-export.md

  apps/
    studio/
      src/
        app/
          page.tsx

          studio/
            page.tsx
            new/
              page.tsx
            playables/
              page.tsx
              [playableId]/
                page.tsx
            templates/
              page.tsx
              new/
                page.tsx
              [templateId]/
                page.tsx
            blocks/
              page.tsx
              new/
                page.tsx
              [blockId]/
                page.tsx
            contexts/
              page.tsx
              new/
                page.tsx
              [contextId]/
                page.tsx

          preview/
            [playableId]/
              page.tsx
            template/
              [templateId]/
                page.tsx

  packages/
    playable-runtime/
      src/
        renderer/
          PlayableRenderer.tsx
          TemplateRenderer.tsx
          ScreenRenderer.tsx
          BlockRenderer.tsx
        timeline/
          timeline-engine.ts
          trigger-engine.ts
          action-runner.ts
        registry/
          block-registry.ts
          action-registry.ts
          animation-registry.ts

    playable-schema/
      src/
        playable.schema.json
        template.schema.json
        block.schema.json
        context.schema.json
        scenario.schema.json
        asset.schema.json
        patch.schema.json

    playable-generator/
      src/
        prompt-engine/
        patch-engine/
        validation-engine/
        template-composer/
        playable-composer/

    playable-exporter/
      src/
        single-html-exporter.ts
        inline-css.ts
        inline-js.ts
        inline-assets.ts
        minify-html.ts
        export-validator.ts

    playable-registry/
      src/
        registry.ts
        file-store.ts
        version-store.ts
        prompt-history-store.ts

  templates/
    ai-chat-flow/
      template.json
      slots.json
      scenario.preset.json
      blocks.json
      theme.tokens.json
      metadata.json
      prompts/
        001-create.md
      versions/
        v1.json

  blocks/
    ai-loading-card/
      block.json
      metadata.json
      prompts/
      versions/

  contexts/
    ai-resume-builder/
      context.json
      copy.json
      metadata.json

  playables/
    ai-resume-builder/
      playable.json
      scenario.json
      context.json
      assets.json
      manifest.json
      prompts/
        001-create.md
        002-update-cta.md
      versions/
        v1.json
        v2.json

  registry/
    playables.json
    templates.json
    blocks.json
    contexts.json

  dist/
    playables/
      ai-resume-builder/
        index.html
```

---

# 9. Studio routes

## Home

```txt
/
```

Hiển thị dashboard:

```txt
Playable Studio

Recent Playables:
- AI Resume Builder      [Preview] [Edit] [Export]
- AI Caption Generator   [Preview] [Edit] [Export]

Templates:
- AI Chat Flow           [Preview] [Use] [Edit]
- AI Before After        [Preview] [Use] [Edit]

Blocks:
- AI Loading Card
- Result Card
- CTA Button
```

---

## Create new playable

```txt
/studio/new
```

Dùng khi MKT muốn tạo playable mới bằng prompt.

---

## Edit playable

```txt
/studio/playables/[playableId]
```

Dùng để prompt chỉnh tiếp playable hiện tại.

---

## Preview playable

```txt
/preview/[playableId]
```

Route này đọc config từ:

```txt
playables/[playableId]/
```

Không tạo route vật lý mới cho từng playable.

---

## Create template

```txt
/studio/templates/new
```

Dùng để prompt tạo template reusable mới.

---

## Edit template

```txt
/studio/templates/[templateId]
```

Dùng để prompt chỉnh template.

---

## Preview template

```txt
/preview/template/[templateId]
```

Dùng để preview template bằng dummy context hoặc sample context.

---

# 10. UI layout cho Studio

## Playable editor

```txt
┌────────────────────────────┬──────────────────────┬─────────────────────┐
│ Prompt Panel               │ Mobile Preview       │ Inspector           │
│                            │                      │                     │
│ "Create playable..."       │ iPhone Frame         │ Overview            │
│                            │                      │ Scenario            │
│ [Generate]                 │ [Play] [Restart]     │ Blocks              │
│ [Apply Change]             │ [Export HTML]        │ Assets              │
│                            │                      │ Versions            │
└────────────────────────────┴──────────────────────┴─────────────────────┘
```

---

## Template editor

```txt
┌────────────────────────────┬──────────────────────┬─────────────────────┐
│ Prompt Panel               │ Template Preview     │ Template Inspector  │
│                            │                      │                     │
│ "Create template..."       │ iPhone Frame         │ Slots               │
│                            │                      │ Editable Zones      │
│ [Generate Template]        │ [Play Preview]       │ Allowed Blocks      │
│ [Apply Patch]              │                      │ Scenario Preset     │
│ [Save Template]            │                      │ Theme Tokens        │
└────────────────────────────┴──────────────────────┴─────────────────────┘
```

---

# 11. Prompt nên nằm ở đâu?

Có 3 loại prompt.

## 11.1 Prompt của Marketing trong UI hoặc Claude Code

Đây là prompt tự nhiên.

Ví dụ:

```txt
Tạo playable cho AI Caption Generator.
Audience là TikTok seller.
Flow: nhập tên sản phẩm → AI generate caption → hiện 3 caption → CTA.
Style: dark mode, neon purple, nhanh giống TikTok ads.
CTA: Generate Caption.
```

---

## 11.2 System prompt trong project

Nằm trong:

```txt
prompts/system/
```

Ví dụ:

```txt
prompts/system/template-authoring.md
prompts/system/playable-generator.md
prompts/system/single-html-exporter.md
```

System prompt giúp Claude biết:

- Được sinh file nào
- Không được sinh file nào
- Schema cần tuân theo
- Rule single HTML
- Rule mobile preview
- Rule không external network
- Rule không hardcode template

---

## 11.3 Prompt history theo từng entity

Mỗi lần MKT prompt, lưu lại:

```txt
playables/[playableId]/prompts/
templates/[templateId]/prompts/
blocks/[blockId]/prompts/
contexts/[contextId]/prompts/
```

Ví dụ:

```txt
playables/ai-resume-builder/prompts/
  001-create.md
  002-update-cta.md
  003-change-style.md
```

---

# 12. Claude Code workflow

Marketing dùng Claude Code trực tiếp trên repo.

Ví dụ command dev:

```bash
pnpm dev
```

Claude Code có thể:

- Đọc `CLAUDE.md`
- Đọc `INSTRUCTION.md`
- Đọc `rules/*`
- Đọc `skills/*`
- Tạo file config
- Sửa file config
- Chạy validate
- Chạy dev preview
- Chạy export

Nhưng Claude Code phải hỏi/được approve khi:

- Sửa nhiều file
- Chạy command build/export
- Xoá file
- Sửa runtime core
- Thêm dependency

---

# 13. CLAUDE.md rule đề xuất

```md
# CLAUDE.md

You are working inside a Prompt Playable Studio project.

The main users are Marketing users who create playable ads by prompting.

Default behavior:
- Prefer generating structured JSON/config artifacts.
- Do not modify runtime core unless explicitly requested.
- Do not create physical routes for each playable.
- Use dynamic preview routes.
- Keep all generated output mobile-first.
- Keep templates reusable.
- Keep final export compatible with single-file HTML.
- Do not use external network requests in exported playable.
- Do not add unsupported animation/action/block types.
- Run validation after every generation.
- Store prompt history and version history for every edit.

Allowed generated artifacts:
- playable.json
- template.json
- block.json
- context.json
- scenario.json
- assets.json
- theme.tokens.json
- patch.json
- metadata.json
- manifest.json

Avoid:
- arbitrary React components
- custom DOM scripts
- external CDN scripts
- remote image URLs in final export
- hardcoded campaign copy inside reusable templates
```

---

# 14. Template artifact structure

## 14.1 template.json

```json
{
  "id": "ai-chat-flow",
  "name": "AI Chat Flow",
  "description": "Reusable AI chat-based playable template",
  "category": "ai-saas",
  "mobileFirst": true,
  "supportedFormats": ["single-html"],
  "slots": [
    "productName",
    "headline",
    "subheadline",
    "promptText",
    "resultText",
    "ctaText"
  ],
  "allowedBlocks": [
    "headline",
    "typing-input",
    "chat-message",
    "ai-loading-card",
    "result-card",
    "cta-button"
  ],
  "defaultScenarioPreset": "ai-chat-flow-default",
  "defaultTheme": "dark-neon"
}
```

---

## 14.2 slots.json

```json
{
  "productName": {
    "type": "text",
    "required": true,
    "default": "{{productName}}"
  },
  "headline": {
    "type": "text",
    "required": true,
    "default": "{{headline}}"
  },
  "ctaText": {
    "type": "text",
    "required": true,
    "default": "{{ctaText}}"
  },
  "themeColor": {
    "type": "color",
    "required": false
  }
}
```

---

## 14.3 editable-zones.json

```json
{
  "editableZones": [
    {
      "id": "hero_headline",
      "slot": "headline",
      "type": "text",
      "required": true
    },
    {
      "id": "chat_area",
      "type": "block-zone",
      "allowedBlocks": [
        "typing-input",
        "chat-message",
        "ai-loading-card"
      ]
    },
    {
      "id": "result_area",
      "type": "block-zone",
      "allowedBlocks": [
        "result-card"
      ]
    },
    {
      "id": "cta_area",
      "type": "block-zone",
      "allowedBlocks": [
        "cta-button"
      ]
    }
  ]
}
```

---

## 14.4 scenario.preset.json

```json
{
  "id": "ai-chat-flow-default",
  "entryScreen": "intro",
  "screens": [
    {
      "id": "intro",
      "type": "intro",
      "steps": [
        {
          "id": "show_headline",
          "atMs": 0,
          "action": "show",
          "target": "headline",
          "animation": "fade-up"
        },
        {
          "id": "show_subheadline",
          "atMs": 700,
          "action": "show",
          "target": "subheadline",
          "animation": "fade-up"
        }
      ],
      "autoNext": {
        "afterMs": 3000,
        "target": "demo"
      },
      "clickNext": {
        "target": "demo"
      }
    },
    {
      "id": "demo",
      "type": "demo",
      "steps": [
        {
          "id": "show_input",
          "atMs": 0,
          "action": "show",
          "target": "typing_input"
        },
        {
          "id": "type_prompt",
          "atMs": 600,
          "action": "typeText",
          "target": "typing_input",
          "slot": "promptText"
        },
        {
          "id": "show_loading",
          "atMs": 2200,
          "action": "show",
          "target": "ai_loading_card"
        },
        {
          "id": "show_result",
          "atMs": 4200,
          "action": "show",
          "target": "result_card",
          "animation": "scale-in"
        },
        {
          "id": "show_cta",
          "atMs": 6200,
          "action": "show",
          "target": "cta_button",
          "animation": "pulse"
        }
      ]
    }
  ]
}
```

---

## 14.5 theme.tokens.json

```json
{
  "colors": {
    "background": "#080812",
    "surface": "#151528",
    "primary": "#7B61FF",
    "text": "#FFFFFF",
    "mutedText": "#A7A7C7"
  },
  "radius": {
    "card": 18,
    "button": 999
  },
  "spacing": {
    "screenPadding": 16,
    "cardGap": 12
  },
  "typography": {
    "headlineSize": 28,
    "bodySize": 14,
    "buttonSize": 16
  }
}
```

---

# 15. Playable artifact structure

```txt
playables/ai-resume-builder/
  playable.json
  context.json
  scenario.json
  assets.json
  manifest.json
  prompts/
  versions/
```

## playable.json

```json
{
  "id": "ai-resume-builder",
  "name": "AI Resume Builder",
  "templateId": "ai-chat-flow",
  "contextId": "ai-resume-builder",
  "scenarioId": "ai-resume-builder-scenario",
  "themeId": "linkedin-blue",
  "status": "draft",
  "version": 1,
  "previewUrl": "/preview/ai-resume-builder",
  "exportTarget": "single-html"
}
```

---

# 16. Context artifact structure

## context.json

```json
{
  "id": "ai-resume-builder",
  "productName": "AI Resume Builder",
  "audience": [
    "job seekers",
    "students",
    "young professionals"
  ],
  "painPoints": [
    "Writing a resume takes too much time",
    "Users do not know how to make resumes look professional"
  ],
  "benefits": [
    "Generate a professional resume in seconds",
    "Improve resume clarity and structure"
  ],
  "tone": "clean, professional, helpful",
  "ctaText": "Build Resume"
}
```

---

# 17. Scenario rules

Every scenario must follow these rules:

```txt
1. Must have entryScreen.
2. Must have at least one CTA.
3. CTA should appear within 8–15 seconds.
4. Every screen should have timeout fallback.
5. Click trigger and auto trigger can coexist.
6. Total playable duration should usually be 8–25 seconds.
7. No unsupported action.
8. No custom JS in scenario.
9. Timing must use milliseconds.
10. Final screen must include CTA or install/open action.
```

Allowed actions:

```txt
show
hide
replace
typeText
countUp
progress
shake
pulse
confetti
navigate
openStore
```

Allowed triggers:

```txt
autoNext
clickNext
tap
swipe
drag
timeout
```

---

# 18. Template generation rules

Templates must:

```txt
1. Be reusable.
2. Avoid hardcoded campaign content.
3. Define slots.
4. Define editable zones.
5. Define allowed blocks.
6. Include scenario preset.
7. Include theme tokens.
8. Support mobile-first layout.
9. Support single HTML export.
10. Avoid arbitrary runtime logic.
```

Templates must not:

```txt
1. Reference remote assets.
2. Depend on external scripts.
3. Hardcode specific campaign copy.
4. Use custom unsupported actions.
5. Create new runtime behavior without registry update.
```

---

# 19. Prompt examples for Marketing

## 19.1 Create new playable

```txt
Tạo playable cho AI Caption Generator.

Audience:
- TikTok seller
- creator

Goal:
- cho user thấy AI generate caption rất nhanh

Flow:
- user nhập tên sản phẩm
- AI typing
- hiện 3 caption
- CTA tải app

Style:
- TikTok ads
- dark mode
- neon purple

CTA:
- Generate Caption

Use template:
- AI Chat Flow
```

---

## 19.2 Update current playable

```txt
Update playable hiện tại:
- intro nhanh hơn
- CTA hiện sau 6 giây
- loading ngắn còn 1.5s
- button có animation pulse
- result hiện 3 card thay vì 1
```

---

## 19.3 Create new reusable template

```txt
Tạo reusable template cho AI SaaS dạng chat.

Flow:
- intro
- user prompt
- AI loading
- result
- CTA

Template phải reusable cho nhiều sản phẩm AI.
Không hardcode tên sản phẩm.
Có các slot: productName, headline, promptText, resultText, ctaText.
Style: dark mode, futuristic, mobile-first.
```

---

## 19.4 Save current playable as template

```txt
Lưu playable hiện tại thành reusable template.
Tên template: AI Fast Typing Result.
Loại bỏ các content quá specific.
Giữ lại layout, flow, animation, editable slots.
```

---

## 19.5 Create new block

```txt
Tạo block reusable tên AI Result Card.
Block hiển thị title, description, icon.
Có animation scale-in.
Có thể dùng trong nhiều template AI.
```

---

# 20. Versioning

Mỗi lần prompt làm thay đổi entity thì phải tạo version.

Ví dụ:

```txt
playables/ai-caption-generator/versions/
  v1.initial.json
  v2.update-cta.json
  v3.update-style.json

templates/ai-chat-flow/versions/
  v1.initial.json
  v2.update-slots.json
```

Mục tiêu:

- Rollback được
- Compare được
- Biết prompt nào tạo ra version nào
- Tránh mất bản tốt khi prompt sai

---

# 21. Prompt history

Mỗi prompt nên được lưu lại.

Ví dụ:

```txt
playables/ai-caption-generator/prompts/
  001-create.md
  002-update-cta.md
  003-update-style.md
```

Format:

```md
# Prompt 001 - Create

## Type

playable-generation

## User Prompt

Tạo playable cho AI Caption Generator...

## Result

Generated version: v1.initial.json

## Created At

2026-06-15T10:00:00Z
```

---

# 22. Registry

Registry giúp Studio home biết có những template/playable/block/context nào.

## registry/playables.json

```json
{
  "playables": [
    {
      "id": "ai-caption-generator",
      "name": "AI Caption Generator",
      "status": "draft",
      "templateId": "ai-chat-flow",
      "previewUrl": "/preview/ai-caption-generator",
      "updatedAt": "2026-06-15T10:00:00Z"
    }
  ]
}
```

## registry/templates.json

```json
{
  "templates": [
    {
      "id": "ai-chat-flow",
      "name": "AI Chat Flow",
      "category": "ai-saas",
      "previewUrl": "/preview/template/ai-chat-flow",
      "updatedAt": "2026-06-15T10:00:00Z"
    }
  ]
}
```

---

# 23. Preview behavior

Preview phải hỗ trợ:

```txt
Mobile frame
Play
Pause
Restart
Jump to screen
Speed 0.5x / 1x / 2x
Show safe area
Show touch area
Show timeline debug
```

Preview playable:

```txt
/preview/[playableId]
```

Preview template:

```txt
/preview/template/[templateId]
```

Template preview dùng sample context.

Ví dụ:

```txt
Sample product: AI Writing Tool
Sample CTA: Try Free
Sample style: dark neon
```

---

# 24. Export single HTML

Final export command:

```bash
pnpm export:playable ai-caption-generator
```

Output:

```txt
dist/playables/ai-caption-generator/index.html
```

Single HTML export pipeline:

```txt
Load playable config
→ Resolve template
→ Resolve blocks
→ Resolve context
→ Resolve scenario
→ Resolve assets
→ Render static shell
→ Inline CSS
→ Inline JS
→ Inline JSON data
→ Inline/embed assets
→ Minify
→ Validate standalone HTML
→ Write dist/playables/[id]/index.html
```

---

## 24.1 Single HTML requirements

The exported HTML must:

```txt
1. Run standalone.
2. Include all CSS inline.
3. Include all JS inline.
4. Include all playable data inline.
5. Include assets as base64/data URI or embedded SVG.
6. Avoid external network requests.
7. Avoid external CDN scripts.
8. Be mobile-first.
9. Be optimized for file size.
10. Include CTA handler.
```

---

## 24.2 Export validation

Validation should check:

```txt
No external script src
No external stylesheet link
No remote image URL
No missing asset
No unsupported action
No unsupported animation
CTA exists
Playable can start
Playable can finish
Total size below configured limit
```

---

# 25. CLI commands đề xuất

```bash
pnpm dev
pnpm validate
pnpm validate:playable ai-caption-generator
pnpm validate:template ai-chat-flow
pnpm preview ai-caption-generator
pnpm export:playable ai-caption-generator
pnpm export:all
```

---

# 26. Initial template library

Nên tạo sẵn các template liên quan AI product:

```txt
1. AI Chat Flow
2. AI Typing Result Flow
3. AI Before After Flow
4. AI Quiz Recommendation Flow
5. AI Agent Task Flow
6. AI Dashboard Insight Flow
7. AI Image Generator Flow
8. AI Writing Assistant Flow
```

---

## 26.1 AI Chat Flow

```txt
Intro
→ User prompt
→ AI loading
→ AI response
→ CTA
```

Phù hợp cho:

```txt
AI assistant
AI customer support
AI tutor
AI writing app
```

---

## 26.2 AI Before After Flow

```txt
Problem
→ Before
→ AI processing
→ After
→ CTA
```

Phù hợp cho:

```txt
AI image enhancer
AI resume builder
AI writing optimizer
AI productivity app
```

---

## 26.3 AI Quiz Recommendation Flow

```txt
Question 1
→ Question 2
→ AI analyzing
→ Personalized result
→ CTA
```

Phù hợp cho:

```txt
AI learning app
AI finance advisor
AI health coach
AI recommender
```

---

## 26.4 AI Agent Task Flow

```txt
User gives task
→ Agent breaks task into steps
→ Agent completes steps
→ Success result
→ CTA
```

Phù hợp cho:

```txt
AI automation
AI agent
AI workflow tool
AI business assistant
```

---

# 27. Developer implementation plan

## Phase 1: Foundation

```txt
- Setup Studio app
- Setup dynamic preview route
- Setup schema package
- Setup runtime renderer
- Setup registry
```

---

## Phase 2: Template system

```txt
- Implement template.json
- Implement slots
- Implement editable zones
- Implement template preview
- Implement save as template
```

---

## Phase 3: Playable generation

```txt
- Implement playable artifact structure
- Implement context injection
- Implement scenario runner
- Implement block rendering
- Implement version history
```

---

## Phase 4: Claude Code workflow

```txt
- Add CLAUDE.md
- Add prompts/system
- Add rules
- Add skills
- Add prompt examples
- Add validation command
```

---

## Phase 5: Single HTML export

```txt
- Render playable to HTML
- Inline CSS
- Inline JS
- Inline assets
- Minify
- Validate standalone
- Output index.html
```

---

# 28. Acceptance checklist

Marketing can:

```txt
- Prompt create playable
- Prompt update playable
- Preview mobile
- Save playable
- Export single HTML
- Prompt create reusable template
- Preview template
- Save template
- Reuse template for new playable
- Rollback to previous version
```

Developer can:

```txt
- Add new block
- Add new action
- Add new animation
- Add new schema rule
- Validate playable
- Validate template
- Export single HTML
- Debug scenario timeline
```

System guarantees:

```txt
- Template reusable
- Playable campaign-specific
- Prompt history saved
- Version history saved
- Preview route dynamic
- Export output single HTML
- No external dependency in final HTML
```

---

# 29. Final principle

The core principle of the system is:

```txt
Marketing describes the ad experience.
Claude converts it into structured artifacts.
Runtime renders the playable.
Exporter produces one standalone HTML file.
```

Marketing should not need to think about:

```txt
React component
setTimeout
DOM manipulation
asset bundling
HTML minification
ad network constraints
```

Marketing only needs to think about:

```txt
Campaign
Audience
Flow
Emotion
Visual style
CTA
Conversion goal
```
