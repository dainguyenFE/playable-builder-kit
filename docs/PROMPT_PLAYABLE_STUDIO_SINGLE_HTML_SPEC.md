# Prompt Playable Studio - Single HTML Export Spec

## 1. Mục tiêu cuối cùng

Project này dùng để build một **Prompt-driven Playable Ads Studio** cho Marketing.

Mục tiêu chính:

```txt
Marketing prompt
  -> hệ thống sinh playable draft
  -> preview mobile mode
  -> Marketing prompt tiếp để chỉnh
  -> approve
  -> export ra 1 file HTML duy nhất
```

File HTML cuối cùng phải là **single file**:

```txt
ai-writing-tool.html
```

Trong file này phải inline toàn bộ:

```txt
HTML
CSS
JavaScript runtime
Playable config JSON
Scenario JSON
Asset base64 hoặc inline SVG
Tracking bridge
CTA handler
```

Không phụ thuộc vào file ngoài như:

```txt
style.css
main.js
image.png
config.json
```

---

## 2. Người dùng chính

### Marketing user

Marketing không cần code. Họ dùng prompt để tạo hoặc chỉnh playable.

Ví dụ:

```txt
Tạo playable giới thiệu AI Writing Tool.
Màn 1 show pain point viết content chậm.
Màn 2 user nhập prompt.
Màn 3 AI generate 3 caption.
Màn 4 CTA Try Free.
Style mobile-first, hiện đại, màu tím xanh.
```

Marketing cần làm được:

```txt
- Prompt tạo playable mới
- Prompt tạo block mới
- Prompt tạo template mới
- Prompt tạo context/ngữ cảnh sản phẩm
- Preview kết quả trên mobile frame
- Chỉnh tiếp bằng prompt
- Lưu version
- Approve bản ổn
- Export single HTML
```

### Developer

Developer quản lý:

```txt
- Runtime renderer
- Schema validation
- Asset normalization scripts
- Export pipeline
- Rule/skill/instruction cho Claude
- Template/block/action registry
- QA validator
```

Developer không nên phải sửa code mỗi lần Marketing tạo playable mới.

---

## 3. Nguyên tắc thiết kế quan trọng

### 3.1 Không generate code runtime tự do

Claude không được sinh arbitrary React/JS runtime cho từng playable.

Claude chỉ được sinh structured artifacts:

```txt
playable.json
context.json
scenario.json
template.json
block.json
assets.json
patch.json
```

Runtime cố định của project sẽ đọc các JSON này để render.

### 3.2 Không tạo route vật lý cho từng playable

Không nên tạo file kiểu:

```txt
app/playables/ai-writing-tool/page.tsx
app/playables/ai-agent-demo/page.tsx
```

Thay vào đó dùng dynamic route:

```txt
app/preview/[playableId]/page.tsx
app/studio/playables/[playableId]/page.tsx
```

Khi prompt tạo playable `ai-writing-tool`, hệ thống chỉ tạo data:

```txt
playables/ai-writing-tool/playable.json
playables/ai-writing-tool/scenario.json
playables/ai-writing-tool/context.json
playables/ai-writing-tool/assets.json
```

Sau đó preview URL tự có:

```txt
/preview/ai-writing-tool
/studio/playables/ai-writing-tool
```

### 3.3 Prompt chỉnh sửa phải sinh patch

Khi Marketing prompt chỉnh sửa, Claude không nên ghi đè toàn bộ playable.

Nên sinh `patch.json`:

```json
{
  "target": "playables/ai-writing-tool",
  "changes": [
    {
      "op": "replace",
      "path": "/theme/primaryColor",
      "value": "#7C3AED"
    },
    {
      "op": "replace",
      "path": "/scenario/screens/2/steps/4/atMs",
      "value": 5200
    }
  ]
}
```

Sau đó hệ thống:

```txt
apply patch
  -> validate schema
  -> create new version
  -> reload preview
```

---

## 4. Flow tổng thể

```txt
┌────────────────────┐
│ Marketing Prompt    │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Claude Generator    │
│ JSON only           │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Schema Validator    │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Save Draft Version  │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Mobile Preview      │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Prompt Edit / OK    │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Approve             │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Export Single HTML  │
└────────────────────┘
```

---

## 5. Project structure đề xuất

```txt
playable-builder-kit/
  README.md
  INSTRUCTION.md
  CLAUDE.md

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
              [templateId]/
                page.tsx
            blocks/
              page.tsx
              [blockId]/
                page.tsx
            contexts/
              page.tsx
              [contextId]/
                page.tsx
          preview/
            [playableId]/
              page.tsx
          export/
            [playableId]/
              page.tsx

        components/
          studio/
            PromptPanel.tsx
            MobilePreviewFrame.tsx
            InspectorPanel.tsx
            VersionHistory.tsx
            ExportPanel.tsx
            AssetPanel.tsx
            ScenarioTimeline.tsx

        server/
          generate-playable.ts
          apply-patch.ts
          save-version.ts
          export-single-html.ts

  packages/
    playable-runtime/
      src/
        PlayableRenderer.tsx
        ScreenRenderer.tsx
        BlockRenderer.tsx
        timeline-engine.ts
        trigger-engine.ts
        action-runner.ts
        action-registry.ts
        animation-registry.ts
        cta-handler.ts

    playable-schema/
      schemas/
        playable.schema.json
        context.schema.json
        scenario.schema.json
        template.schema.json
        block.schema.json
        assets.schema.json
        patch.schema.json
      src/
        validatePlayable.ts
        validateScenario.ts
        validatePatch.ts

    playable-generator/
      src/
        claude-adapter.ts
        prompt-builder.ts
        structured-output-parser.ts
        patch-generator.ts
        generation-guard.ts

    playable-exporter/
      src/
        exportSingleHtml.ts
        inlineCss.ts
        inlineJs.ts
        inlineAssets.ts
        inlineConfig.ts
        minifyHtml.ts
        validateSingleFile.ts

    playable-assets/
      src/
        normalizeAssets.ts
        optimizeImage.ts
        svgToInline.ts
        imageToBase64.ts
        validateAssetSize.ts

    playable-registry/
      src/
        registry.ts
        file-store.ts
        version-store.ts
        template-store.ts
        block-store.ts
        context-store.ts

  data/
    registry/
      playables.json
      templates.json
      blocks.json
      contexts.json

    playables/
      ai-writing-tool/
        manifest.json
        playable.json
        context.json
        scenario.json
        assets.json
        versions/
          v1.initial.json
          v2.change-copy.json
          v3.final.json
        exports/
          ai-writing-tool.html

    templates/
      ai-chat-demo/
        template.json
        scenario.preset.json
        blocks.json
      ai-before-after/
        template.json
        scenario.preset.json
        blocks.json

    blocks/
      ai-chat-message/
        block.json
      ai-loading-card/
        block.json
      ai-result-card/
        block.json
      cta-button/
        block.json

    contexts/
      ai-writing-product/
        context.json

  scripts/
    create-playable.ts
    validate-playable.ts
    export-playable.ts
    normalize-assets.ts
    list-playables.ts

  dist/
    exports/
      ai-writing-tool.html
```

---

## 6. Studio routes

### Home route

```txt
/
```

Màn hình đầu khi chạy dev.

Nội dung:

```txt
Playable Studio

[Create New Playable]

Recent Playables:
- AI Writing Tool       [Preview] [Edit] [Duplicate] [Export]
- AI Image Generator    [Preview] [Edit] [Duplicate] [Export]
- AI Agent Demo         [Preview] [Edit] [Duplicate] [Export]

Templates:
- AI Chat Demo
- AI Before After
- AI Quiz Flow
- AI Agent Task Flow

Reusable Blocks:
- Chat Message
- Prompt Input
- AI Loading
- Result Card
- CTA Button
```

### Create route

```txt
/studio/new
```

Dùng để prompt tạo playable mới.

### Edit route

```txt
/studio/playables/[playableId]
```

Dùng để:

```txt
- Preview playable hiện tại
- Prompt chỉnh sửa
- Xem scenario timeline
- Xem blocks
- Xem assets
- Xem version history
- Approve
- Export
```

### Preview route

```txt
/preview/[playableId]
```

Dùng để xem playable mobile-only.

Route này không có UI editor, chỉ có playable preview.

### Export route

```txt
/export/[playableId]
```

Dùng để export single HTML.

---

## 7. UI layout cho trang edit playable

```txt
┌─────────────────────────────┬──────────────────────┬─────────────────────────┐
│ Prompt Panel                │ Mobile Preview        │ Inspector               │
│                             │                      │                         │
│ Prompt tạo/chỉnh playable   │  iPhone Frame         │ Overview                │
│                             │                      │ Scenario                │
│ [Generate] [Apply Patch]    │  [Play] [Restart]     │ Blocks                  │
│                             │  [Speed 1x]           │ Assets                  │
│ Prompt history              │                      │ Copy                    │
│                             │                      │ Versions                │
│                             │                      │ Export                  │
└─────────────────────────────┴──────────────────────┴─────────────────────────┘
```

### Prompt Panel

Chức năng:

```txt
- Nhập prompt tạo mới
- Nhập prompt chỉnh sửa
- Xem prompt history
- Xem Claude response summary
- Retry generation
- Apply patch
```

### Mobile Preview

Chức năng:

```txt
- Preview đúng mobile mode
- Play / pause / restart
- Jump to screen
- Speed 0.5x / 1x / 2x
- Show safe area
- Show touch area
- Show timeline debug
```

### Inspector

Tabs:

```txt
Overview
Scenario
Blocks
Assets
Copy
Theme
Versions
Export
```

---

## 8. Data model chính

### 8.1 Playable manifest

```json
{
  "id": "ai-writing-tool",
  "name": "AI Writing Tool",
  "status": "draft",
  "templateId": "ai-chat-demo",
  "contextId": "ai-writing-product",
  "scenarioId": "ai-writing-flow",
  "version": 3,
  "previewUrl": "/preview/ai-writing-tool",
  "editUrl": "/studio/playables/ai-writing-tool",
  "exportPath": "data/playables/ai-writing-tool/exports/ai-writing-tool.html",
  "createdAt": "2026-06-15T10:00:00.000Z",
  "updatedAt": "2026-06-15T10:30:00.000Z"
}
```

### 8.2 Playable config

```json
{
  "id": "ai-writing-tool",
  "name": "AI Writing Tool",
  "viewport": {
    "width": 390,
    "height": 844,
    "safeArea": true
  },
  "theme": {
    "primaryColor": "#7C3AED",
    "backgroundColor": "#0F172A",
    "textColor": "#FFFFFF",
    "fontFamily": "system"
  },
  "template": {
    "id": "ai-chat-demo"
  },
  "context": {
    "id": "ai-writing-product"
  },
  "scenario": {
    "id": "ai-writing-flow"
  },
  "tracking": {
    "enabled": true,
    "events": [
      "playable_start",
      "screen_view",
      "interaction_click",
      "cta_click",
      "playable_complete"
    ]
  }
}
```

### 8.3 Context config

```json
{
  "id": "ai-writing-product",
  "productName": "WriteMate AI",
  "category": "AI Writing Tool",
  "targetUser": "marketer, creator, small business owner",
  "problem": "Writing high-performing marketing content takes too much time.",
  "mainBenefit": "Create high-converting content in seconds.",
  "proofPoints": [
    "Generate captions instantly",
    "Rewrite copy in different tones",
    "Save hours every week"
  ],
  "tone": "modern, friendly, high-conversion",
  "cta": "Try Free"
}
```

### 8.4 Scenario config

```json
{
  "id": "ai-writing-flow",
  "entryScreen": "screen_problem",
  "screens": [
    {
      "id": "screen_problem",
      "name": "Problem Intro",
      "type": "problem",
      "durationMs": 4000,
      "steps": [
        {
          "id": "show_headline",
          "atMs": 0,
          "action": "show",
          "target": "headline",
          "animation": "fade-up"
        },
        {
          "id": "show_problem_card",
          "atMs": 800,
          "action": "show",
          "target": "problem_card",
          "animation": "scale-in"
        },
        {
          "id": "show_tap_hint",
          "atMs": 2500,
          "action": "show",
          "target": "tap_hint",
          "animation": "pulse"
        }
      ],
      "autoNext": {
        "enabled": true,
        "afterMs": 4000,
        "target": "screen_demo"
      },
      "clickNext": {
        "enabled": true,
        "target": "screen_demo"
      }
    },
    {
      "id": "screen_demo",
      "name": "AI Demo",
      "type": "demo",
      "durationMs": 8000,
      "steps": [
        {
          "id": "show_input",
          "atMs": 0,
          "action": "show",
          "target": "prompt_input"
        },
        {
          "id": "type_prompt",
          "atMs": 500,
          "action": "typeText",
          "target": "prompt_text",
          "value": "Write 3 captions for my product launch"
        },
        {
          "id": "show_loading",
          "atMs": 2600,
          "action": "show",
          "target": "ai_loading"
        },
        {
          "id": "hide_loading",
          "atMs": 4200,
          "action": "hide",
          "target": "ai_loading"
        },
        {
          "id": "show_result_1",
          "atMs": 4400,
          "action": "show",
          "target": "result_card_1",
          "animation": "fade-up"
        },
        {
          "id": "show_result_2",
          "atMs": 5200,
          "action": "show",
          "target": "result_card_2",
          "animation": "fade-up"
        },
        {
          "id": "show_result_3",
          "atMs": 6000,
          "action": "show",
          "target": "result_card_3",
          "animation": "fade-up"
        },
        {
          "id": "show_cta",
          "atMs": 7000,
          "action": "show",
          "target": "cta_button",
          "animation": "pulse"
        }
      ],
      "autoNext": {
        "enabled": true,
        "afterMs": 8500,
        "target": "screen_cta"
      }
    }
  ]
}
```

### 8.5 Block config

```json
{
  "id": "ai-result-card",
  "name": "AI Result Card",
  "type": "result",
  "propsSchema": {
    "title": "string",
    "description": "string",
    "icon": "string"
  },
  "defaultProps": {
    "title": "Generated Result",
    "description": "Your AI result is ready.",
    "icon": "sparkle"
  },
  "allowedAnimations": [
    "fade-up",
    "scale-in",
    "pulse"
  ]
}
```

---

## 9. Claude instruction cần có

File nên đặt tại:

```txt
CLAUDE.md
```

Nội dung rule chính:

```md
# Claude Rules for Prompt Playable Studio

You are generating playable ads for mobile preview and single HTML export.

You must only generate structured JSON artifacts.

Allowed artifacts:

- playable.json
- context.json
- scenario.json
- template.json
- block.json
- assets.json
- patch.json

You must not generate arbitrary runtime JavaScript unless the user is explicitly creating a new approved runtime action and developer mode is enabled.

You must follow these rules:

1. All output must be mobile-first.
2. Every playable must have a CTA.
3. Every playable must be previewable using the shared renderer.
4. Every playable must be exportable as one single HTML file.
5. Do not reference external URLs for runtime assets.
6. Do not require external CSS, JS, image, or font files.
7. Use only allowed blocks from block registry.
8. Use only allowed actions from action registry.
9. Use only allowed animations from animation registry.
10. Every screen should have a timeout fallback.
11. CTA should appear within 15 seconds.
12. Scenario timing must use milliseconds.
13. Do not create React components directly.
14. Do not create route files.
15. When modifying an existing playable, generate patch.json instead of replacing the entire playable.
16. After generation, summarize what changed.
```

---

## 10. Action registry

Claude chỉ được dùng các action có trong registry.

```txt
show
hide
replace
move
scale
fade
typeText
countUp
progress
shake
pulse
confetti
navigateScreen
openStore
trackEvent
```

Ví dụ action:

```json
{
  "id": "type_prompt",
  "atMs": 500,
  "action": "typeText",
  "target": "prompt_text",
  "value": "Generate 3 captions for my product",
  "speed": 32
}
```

---

## 11. Animation registry

```txt
fade-in
fade-up
fade-down
scale-in
slide-left
slide-right
pulse
shake
bounce
pop
blur-in
```

Không cho Claude tự viết custom keyframe trong playable config.

Nếu cần animation mới:

```txt
Developer thêm vào animation-registry
  -> update schema
  -> update preview
  -> update exporter
```

---

## 12. Template preset ban đầu cho sản phẩm AI

### 12.1 AI Chat Demo

Flow:

```txt
Intro
  -> user asks question
  -> AI typing
  -> AI answer
  -> CTA
```

Dùng cho:

```txt
AI assistant
AI chatbot
AI tutor
AI customer support
```

### 12.2 AI Writing Generator

Flow:

```txt
Problem
  -> prompt input
  -> AI generating
  -> 3 copy results
  -> CTA
```

Dùng cho:

```txt
AI writing tool
AI caption generator
AI email writer
AI blog assistant
```

### 12.3 AI Image Before After

Flow:

```txt
Before image
  -> AI enhancing
  -> after image
  -> comparison
  -> CTA
```

Dùng cho:

```txt
AI image enhancer
AI avatar app
AI photo editor
AI product image generator
```

### 12.4 AI Agent Task Flow

Flow:

```txt
User gives task
  -> AI agent breaks task into steps
  -> steps completed one by one
  -> success result
  -> CTA
```

Dùng cho:

```txt
AI agent
AI automation
AI workflow assistant
AI productivity tool
```

### 12.5 AI Quiz Recommendation

Flow:

```txt
Question 1
  -> Question 2
  -> AI analyzing
  -> personalized recommendation
  -> CTA
```

Dùng cho:

```txt
AI learning app
AI finance app
AI product recommendation
AI health coach
```

### 12.6 AI Dashboard Insight

Flow:

```txt
Dashboard appears
  -> data loading
  -> AI detects insight
  -> recommendation card
  -> CTA
```

Dùng cho:

```txt
AI analytics
AI business dashboard
AI report generator
AI sales assistant
```

---

## 13. Block preset ban đầu

```txt
headline-block
subheadline-block
problem-card
chat-message
prompt-input
ai-loading-card
ai-result-card
before-after-card
progress-bar
step-checklist
quiz-option
dashboard-card
insight-card
cta-button
bottom-cta-bar
```

Mỗi block cần có:

```txt
id
name
type
propsSchema
defaultProps
allowedAnimations
mobileRules
exportRules
```

---

## 14. Asset normalization

Trước khi preview/export, asset phải qua normalize.

Script:

```txt
scripts/normalize-assets.ts
```

Nhiệm vụ:

```txt
- Rename file theo slug
- Convert ảnh nhỏ sang base64
- Optimize PNG/JPG/WebP
- Inline SVG nếu có thể
- Check kích thước file
- Check asset không dùng
- Check external URL
- Generate assets.json
```

Rule:

```txt
1. Không dùng asset từ URL ngoài khi export.
2. Icon nên dùng inline SVG.
3. Ảnh nhỏ có thể base64 inline.
4. Ảnh lớn phải được optimize trước khi inline.
5. Không dùng font remote.
6. Font ưu tiên system font.
7. Nếu cần custom font thì phải inline base64, nhưng chỉ dùng khi thật cần.
```

Ví dụ `assets.json`:

```json
{
  "assets": [
    {
      "id": "hero-image",
      "type": "image",
      "source": "data:image/webp;base64,...",
      "originalPath": "assets/raw/hero.png",
      "normalizedPath": "assets/normalized/hero.webp",
      "sizeBytes": 42000,
      "inline": true
    },
    {
      "id": "sparkle-icon",
      "type": "svg",
      "source": "<svg>...</svg>",
      "inline": true
    }
  ]
}
```

---

## 15. Single HTML export pipeline

Khi Marketing bấm:

```txt
[Export HTML]
```

Hệ thống chạy pipeline:

```txt
1. Load playable manifest
2. Load playable.json
3. Load context.json
4. Load scenario.json
5. Load assets.json
6. Validate schema
7. Validate playable rules
8. Normalize assets
9. Build runtime bundle
10. Inline CSS
11. Inline JS
12. Inline config JSON
13. Inline assets
14. Minify HTML
15. Validate single-file output
16. Save ai-writing-tool.html
```

Output:

```txt
dist/exports/ai-writing-tool.html
```

File này phải chạy độc lập khi mở trực tiếp trên browser:

```txt
open dist/exports/ai-writing-tool.html
```

---

## 16. Single HTML structure

HTML export nên có dạng:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <title>AI Writing Tool Playable</title>
    <style>
      /* inline reset css */
      /* inline playable css */
      /* inline animation css */
    </style>
  </head>
  <body>
    <div id="playable-root"></div>

    <script id="playable-config" type="application/json">
      {
        "playable": {},
        "context": {},
        "scenario": {},
        "assets": {}
      }
    </script>

    <script>
      // inline playable runtime
      // timeline engine
      // action runner
      // renderer
      // CTA handler
      // tracking bridge
    </script>
  </body>
</html>
```

---

## 17. Export validation rules

Trước khi export thành công, phải pass các rule:

```txt
Single HTML Rules:

1. Output chỉ có 1 file .html.
2. Không có link rel="stylesheet" trỏ file ngoài.
3. Không có script src trỏ file ngoài.
4. Không có img src trỏ file ngoài.
5. Không có fetch/ajax request trong runtime.
6. Không có import dynamic.
7. Không có font remote.
8. Config phải được embed trong script application/json.
9. Assets phải inline bằng base64 hoặc inline SVG.
10. CTA click phải dùng export-safe handler.
11. File phải chạy được khi mở trực tiếp bằng browser.
12. Viewport phải mobile-first.
13. Không có console error lúc load.
14. Playable phải có CTA.
15. Playable phải có timeout fallback.
```

---

## 18. CTA handler

Trong preview mode:

```txt
CTA click -> log event + show preview message
```

Trong export mode:

```txt
CTA click -> call network bridge nếu có
          -> fallback window.open/store URL nếu được config
```

Config:

```json
{
  "cta": {
    "label": "Try Free",
    "type": "openStore",
    "url": "https://example.com/download",
    "fallbackUrl": "https://example.com"
  }
}
```

Export-safe handler:

```js
function handleCtaClick() {
  trackEvent('cta_click')

  if (window.mraid && typeof window.mraid.open === 'function') {
    window.mraid.open(CTA_URL)
    return
  }

  window.open(CTA_URL, '_blank')
}
```

---

## 19. Tracking events

Playable nên có tracking cơ bản:

```txt
playable_start
screen_view
step_view
interaction_click
cta_view
cta_click
playable_complete
```

Trong preview mode:

```txt
- Hiển thị event log ở Inspector
```

Trong export mode:

```txt
- Không phụ thuộc external analytics SDK
- Dùng bridge hoặc no-op fallback
```

Ví dụ:

```js
function trackEvent(name, payload) {
  window.__PLAYABLE_EVENTS__ = window.__PLAYABLE_EVENTS__ || []
  window.__PLAYABLE_EVENTS__.push({ name, payload, ts: Date.now() })
}
```

---

## 20. Version history

Mỗi lần prompt tạo/chỉnh phải lưu version.

```txt
data/playables/ai-writing-tool/versions/
  v1.initial.json
  v2.change-theme.json
  v3.update-scenario.json
  v4.final-approved.json
```

Version record:

```json
{
  "version": 4,
  "label": "final-approved",
  "prompt": "Make CTA appear earlier and improve result cards",
  "summary": "CTA appears at 7s, result cards now use stronger copy.",
  "createdAt": "2026-06-15T10:30:00.000Z",
  "snapshot": {
    "playable": {},
    "context": {},
    "scenario": {},
    "assets": {}
  }
}
```

UI cần có:

```txt
[Preview v3]
[Restore v3]
[Compare v3 vs v4]
```

---

## 21. Save as Template / Save as Block

Sau khi Marketing tạo playable tốt, có thể lưu lại để tái sử dụng.

### Save as Template

```txt
AI Writing Tool playable
  -> Save as Template
  -> Template name: AI Text Generator Flow
```

Lần sau prompt:

```txt
Tạo playable AI Resume Builder giống template AI Text Generator Flow,
nhưng nội dung là tạo resume chuyên nghiệp.
```

### Save as Block

User có thể chọn một block trong preview hoặc inspector:

```txt
AI Result Card
  -> Save as reusable block
```

Sau đó block xuất hiện ở:

```txt
/studio/blocks
```

---

## 22. Prompt examples cho Marketing

### 22.1 Tạo playable mới

```txt
Tạo playable giới thiệu AI Email Reply Tool.
Dùng style hiện đại, mobile-first.
Màn 1 show vấn đề: trả lời email mất thời gian.
Màn 2 mô phỏng user nhập email cần trả lời.
Màn 3 AI generate reply chuyên nghiệp.
Màn 4 show CTA Try Free.
Thời lượng khoảng 12 giây.
```

### 22.2 Tạo gần giống template có sẵn

```txt
Tạo playable giống template AI Chat Demo,
nhưng đổi thành AI Image Generator.
Màn demo cần show prompt tạo ảnh,
sau đó loading,
sau đó hiện ảnh result và CTA Download.
```

### 22.3 Chỉnh playable hiện tại

```txt
Giữ layout hiện tại.
Đổi màu chính sang xanh neon.
CTA hiện sớm hơn sau 7 giây.
Màn result thêm hiệu ứng pop cho từng card.
Copy headline ngắn hơn và mạnh hơn.
```

### 22.4 Tạo block mới

```txt
Tạo reusable block tên AI Score Card.
Block này hiển thị điểm AI analysis từ 0 đến 100,
có label, description, progress ring và badge.
Dùng được trong AI dashboard playable.
```

### 22.5 Tạo context sản phẩm

```txt
Tạo context cho sản phẩm AI Sales Assistant.
Target user là sales team và founder.
Pain point là mất thời gian follow up lead.
Benefit chính là tự động tạo email follow up và ưu tiên lead nóng.
Tone chuyên nghiệp, nhanh, hiệu quả.
CTA là Start Free Trial.
```

---

## 23. CLI commands

```bash
# chạy studio
pnpm dev

# tạo playable bằng prompt file
pnpm playable create --prompt ./prompts/ai-writing-tool.txt

# validate playable
pnpm playable validate ai-writing-tool

# preview playable
pnpm playable preview ai-writing-tool

# normalize assets
pnpm playable assets normalize ai-writing-tool

# export single HTML
pnpm playable export ai-writing-tool --single-html

# list playable đã tạo
pnpm playable list
```

Output export:

```txt
dist/exports/ai-writing-tool.html
```

---

## 24. Implementation phases

### Phase 1 - Studio MVP

```txt
- Studio home
- Create playable by prompt
- Save JSON artifacts
- Dynamic preview route
- Basic mobile renderer
- Basic template presets
- Basic block registry
```

### Phase 2 - Prompt edit + version

```txt
- Apply patch flow
- Version history
- Restore version
- Prompt history
- Scenario timeline inspector
```

### Phase 3 - Single HTML exporter

```txt
- Inline runtime
- Inline CSS
- Inline config
- Inline assets
- Minify HTML
- Validate no external dependency
```

### Phase 4 - Marketing polish

```txt
- Save as template
- Save as block
- Duplicate playable
- Export panel
- QA checklist UI
- Event debug panel
```

### Phase 5 - Network-specific export profiles

```txt
- Generic single HTML
- MRAID-compatible single HTML
- Google HTML5 profile
- Meta playable profile
- Unity playable profile
```

Network-specific rules nên để ở profile riêng vì mỗi network có constraint khác nhau.

---

## 25. QA checklist cho Marketing trước khi export

```txt
[ ] Playable chạy ổn trong mobile preview
[ ] CTA xuất hiện rõ
[ ] CTA xuất hiện trong 15 giây
[ ] User hiểu sản phẩm trong 3 giây đầu
[ ] Không có màn nào bị đứng
[ ] Có auto-next fallback
[ ] Click/tap hoạt động đúng
[ ] Text không bị tràn mobile frame
[ ] Asset hiển thị đúng
[ ] Animation không quá rối
[ ] File export là single HTML
[ ] Mở file HTML trực tiếp vẫn chạy
```

---

## 26. QA checklist cho Developer

```txt
[ ] Schema validation pass
[ ] Scenario validation pass
[ ] Asset validation pass
[ ] Single HTML validation pass
[ ] Không có external CSS
[ ] Không có external JS
[ ] Không có external image
[ ] Không có runtime fetch
[ ] Không có console error
[ ] HTML size nằm trong giới hạn profile export
[ ] CTA handler hoạt động
[ ] Tracking no-op fallback hoạt động
[ ] Preview và export render giống nhau
```

---

## 27. Definition of Done

Một playable được xem là hoàn thành khi:

```txt
1. Marketing có thể mở trong Studio.
2. Playable có thể preview bằng mobile frame.
3. Marketing có thể prompt chỉnh sửa thêm.
4. Mỗi lần chỉnh sửa có version history.
5. Playable pass schema validation.
6. Playable pass QA checklist.
7. Marketing bấm export được.
8. Output là 1 file HTML duy nhất.
9. File HTML chạy độc lập khi mở trực tiếp.
10. File HTML không cần asset hoặc script bên ngoài.
```

---

## 28. Tóm tắt kiến trúc

```txt
Marketing không tạo code.
Marketing tạo intent bằng prompt.
Claude sinh JSON artifact.
Studio preview bằng runtime chung.
User approve bản ổn.
Exporter đóng gói mọi thứ thành một file HTML duy nhất.
```

Core principle:

```txt
Prompt creates data, not runtime code.
Runtime renders data.
Exporter freezes runtime + data + assets into one HTML file.
```
