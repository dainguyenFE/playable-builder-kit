# Playable Ads Builder Kit — Project Spec

> Mục tiêu: xây dựng một **builder kit** để Marketing có thể dùng Claude prompt ra nhanh một playable ad dạng mobile preview, dựa trên template sẵn có, biến thể gần giống template, hoặc tạo template mới. Project này tập trung vào playable giới thiệu sản phẩm AI, có chuẩn hoá asset, instruction, skills, rules, validator và quy trình export.

---

## 1. Bối cảnh & mục tiêu

### 1.1. Bối cảnh

Marketing cần tạo nhanh playable ads cho các chiến dịch giới thiệu sản phẩm AI. Thay vì dev phải code từng playable từ đầu, project này cung cấp:

- Bộ template playable có sẵn.
- Bộ rule/instruction để Claude tạo playable đúng chuẩn.
- Hệ thống chuẩn hoá asset: ảnh, icon, font, âm thanh, animation, copy.
- Mobile preview mode để Marketing xem trực tiếp.
- Export package để submit lên ad network hoặc gửi dev kiểm tra.
- Validator để chặn các lỗi thường gặp: asset quá nặng, dùng external network, sai viewport, thiếu CTA, thiếu fallback, sai naming.

### 1.2. Mục tiêu chính

Marketing có thể dùng Claude theo 3 mode:

1. **Create from template**  
   Chọn một template có sẵn, điền product info, visual direction, CTA, tone, assets.

2. **Create similar playable**  
   Chọn một playable/template làm reference, yêu cầu Claude tạo bản gần giống nhưng đổi flow, copy, theme, visual hoặc interaction.

3. **Create new template**  
   Tạo một template mới theo contract bắt buộc để sau này tái sử dụng.

### 1.3. Không phải mục tiêu ở phase đầu

- Không xây low-code editor phức tạp ngay từ đầu.
- Không cần CMS đầy đủ cho playable.
- Không để Marketing tự viết logic JavaScript tự do không qua validator.
- Không phụ thuộc network runtime, CDN hoặc API bên ngoài trong bản export.
- Không tối ưu cho desktop trước. Mobile preview là mặc định.

---

## 2. Nguyên tắc thiết kế project

### 2.1. Prompt-first, nhưng contract-driven

Marketing dùng Claude để prompt, nhưng Claude không được generate tự do hoàn toàn. Mọi output phải đi qua các contract:

- `playable.config.json`
- `template.manifest.json`
- `asset.manifest.json`
- `flow.schema.json`
- `copy.schema.json`
- `validation.report.json`

Ý tưởng: Claude có thể sáng tạo về nội dung, flow, copy, visual direction, nhưng không được phá cấu trúc runtime/export.

### 2.2. Template là source of truth — **hành vi & bố cục, không phải UI cố định**

> **Cập nhật thiết kế:** Template **không** lưu mockup pixel / theme cố định. Template định nghĩa **pattern tương tác** và **bố cục logic**; Marketing/Claude tự do skin (màu, copy, ảnh) trong các slot.

Mỗi playable phải dựa trên **composition** (ghép block + flow), có thể:

- Lấy nguyên một template có sẵn.
- Ghép **màn / block** từ nhiều template (xem **§29**).

Template / block định nghĩa:

| Layer | Nội dung | Không chứa |
|-------|----------|------------|
| **Block** | Vùng UI logic (`header`, `main`, `footer`, `cta-bar`…), `behaviorType`, interaction, slot copy/asset | Màu brand, font cụ thể, ảnh campaign |
| **Scene / step** | Thứ tự flow, chuyển màn (tap, timeout, choice), event tracking | HTML/CSS hoàn chỉnh |
| **Composition** | Block nào + flow nào + ref template nguồn | Logic runtime core |

Chi tiết block, ghép cross-template, prompt Marketing: **§29**.

### 2.3. Runtime càng nhỏ càng tốt

Playable export cần nhẹ, ít dependency, không gọi external API, không require framework runtime lớn nếu không cần.

Khuyến nghị:

- Dùng TypeScript khi authoring.
- Dùng Vite/esbuild để build.
- Có thể dùng React ở preview/studio, nhưng export runtime nên là vanilla/mini runtime hoặc pre-rendered DOM + minimal JS.
- Tách rõ `authoring runtime` và `ad runtime`.

### 2.4. Mobile-first

Mọi template mặc định chạy trong mobile frame:

- Portrait: `390x844`, `375x812`, `360x800`.
- Landscape: optional.
- Safe area support.
- Touch-first interaction.
- Không phụ thuộc hover.
- CTA dễ bấm bằng ngón tay.

### 2.5. Marketing-friendly, Dev-safe

Marketing chỉ cần thao tác với:

- Prompt.
- Brief.
- Assets.
- Template name.
- Brand/product info.
- CTA/campaign info.

Dev chịu trách nhiệm:

- Template contract.
- Runtime.
- Validator.
- Export adapter.
- Asset optimizer.
- Rule pack.

---

## 3. Cấu trúc project đề xuất

```txt
playable-builder-kit/
  README.md
  INSTRUCTION.md
  CLAUDE.md
  PLAYABLE_BUILDER_KIT_SPEC.md
  package.json
  turbo.json
  tsconfig.base.json

  docs/
    getting-started.md
    marketing-workflow.md
    template-authoring.md
    asset-standard.md
    validation-rules.md
    export-network-guide.md
    prompt-recipes.md
    qa-checklist.md

  instructions/
    core-instruction.md
    marketing-instruction.md
    developer-instruction.md
    playable-generation-instruction.md
    template-generation-instruction.md
    asset-normalization-instruction.md
    review-instruction.md

  skills/
    template-selector/
      SKILL.md
      examples.md
    playable-brief-analyzer/
      SKILL.md
      examples.md
    copywriter-mobile-ad/
      SKILL.md
      examples.md
    flow-designer/
      SKILL.md
      examples.md
    asset-normalizer/
      SKILL.md
      examples.md
    template-variant-generator/
      SKILL.md
      examples.md
    playable-validator/
      SKILL.md
      examples.md
    export-checker/
      SKILL.md
      examples.md

  rules/
    global.rules.md
    playable.rules.md
    asset.rules.md
    copy.rules.md
    animation.rules.md
    performance.rules.md
    accessibility.rules.md
    tracking.rules.md
    network-adapter.rules.md

  apps/
    studio/
      src/
        app/
        components/
        features/
        pages/
      public/
      package.json
    mobile-preview/
      src/
        app/
        frames/
        preview-runner/
      package.json

  packages/
    core/
      src/
        types/
        schema/
        parser/
        registry/
        errors/
      package.json
    runtime/
      src/
        scene-engine/
        gesture/
        animation/
        sound/
        cta/
        tracking/
        mraid/
        fallback/
      package.json
    templates/
      src/
        registry.ts
        template-contract.ts
      package.json
    asset-pipeline/
      src/
        image-optimizer/
        svg-optimizer/
        audio-optimizer/
        font-checker/
        manifest-builder/
      package.json
    validator/
      src/
        validate-playable.ts
        validate-assets.ts
        validate-copy.ts
        validate-network.ts
        validate-size.ts
      package.json
    exporter/
      src/
        build-html.ts
        inline-assets.ts
        zip-export.ts
        network-profiles/
          generic-html5.ts
          mraid.ts
          google-html5.ts
          meta-playable.ts
          unity-playable.ts
      package.json
    cli/
      src/
        commands/
          create.ts
          preview.ts
          validate.ts
          export.ts
          clone-template.ts
          generate-brief.ts
      package.json

  templates/
    ai-chat-simulator/
      template.manifest.json
      README.md
      scenes/
        intro.scene.json
        demo.scene.json
        result.scene.json
        cta.scene.json
      assets/
        placeholders/
      copy/
        en.json
        vi.json
      preview/
        thumbnail.png
        storyboard.md
    ai-image-before-after/
    ai-workflow-automation/
    ai-writing-assistant/
    ai-agent-task-race/
    ai-dashboard-insight/
    ai-quiz-personalized-recommendation/

  playables/
    _drafts/
    _approved/
    campaign-2026-ai-chatbot-v1/
      playable.config.json
      brief.md
      asset.manifest.json
      copy.json
      generated/
        index.html
        preview.html
        validation.report.json
        export.zip
      assets/
        raw/
        optimized/
      notes/
        prompt.md
        review.md

  examples/
    briefs/
      ai-product-launch.md
      ai-saas-leadgen.md
      ai-tool-education.md
    prompts/
      create-from-template.md
      create-similar-template.md
      create-new-template.md
      review-playable.md

  scripts/
    create-playable.ts
    normalize-assets.ts
    validate-playable.ts
    export-playable.ts
    build-template-registry.ts
```

---

## 4. Vai trò từng phần trong project

### 4.1. `INSTRUCTION.md`

File chính để Claude hoặc bất kỳ AI assistant nào hiểu cách làm việc với project.

Nội dung nên có:

- Project purpose.
- Role của AI khi generate playable.
- Các file được phép sửa.
- Các file không được phép sửa.
- Quy trình bắt buộc khi tạo playable.
- Rule bắt buộc trước khi output.
- Format output chuẩn.

### 4.2. `CLAUDE.md`

File ngắn hơn, tối ưu cho Claude Code hoặc Claude Desktop.

Nội dung nên chỉ rõ:

- Khi Marketing yêu cầu tạo playable, luôn đọc `INSTRUCTION.md` trước.
- Luôn chọn template phù hợp trước khi generate.
- Không generate asset nặng hoặc external dependency.
- Luôn tạo `brief.md`, `playable.config.json`, `copy.json`, `asset.manifest.json`.
- Luôn chạy checklist trong `rules/` trước khi hoàn thành.

### 4.3. `skills/`

Chứa các skill mà bạn đã có hoặc sẽ bổ sung. Mỗi skill nên độc lập, dễ gọi bằng prompt.

Ví dụ:

```txt
skills/template-selector/SKILL.md
```

Nhiệm vụ:

- Đọc brief.
- Xác định campaign goal.
- Chọn template phù hợp.
- Giải thích vì sao chọn template đó.
- Đề xuất variant nếu brief không khớp hoàn toàn.

```txt
skills/asset-normalizer/SKILL.md
```

Nhiệm vụ:

- Kiểm tra asset thô.
- Đổi tên file theo chuẩn.
- Nén ảnh.
- Convert ảnh lớn sang định dạng phù hợp.
- Tạo `asset.manifest.json`.
- Cảnh báo asset không hợp lệ.

### 4.4. `rules/`

Rule là phần bắt buộc, không phụ thuộc sáng tạo của Claude.

Nên chia rule theo domain:

- `global.rules.md`: nguyên tắc chung.
- `playable.rules.md`: cấu trúc playable.
- `asset.rules.md`: chuẩn asset.
- `copy.rules.md`: chuẩn copy marketing.
- `animation.rules.md`: timing, motion, tránh rối.
- `performance.rules.md`: size, load, minify.
- `accessibility.rules.md`: contrast, tap target, readable text.
- `tracking.rules.md`: event name, CTA click, interaction step.
- `network-adapter.rules.md`: rule riêng theo network export.

### 4.5. `templates/`

Mỗi template là một playable pattern có thể tái sử dụng.

Một template phải có:

```txt
templates/<template-name>/
  template.manifest.json
  README.md
  scenes/
  assets/placeholders/
  copy/
  preview/
```

### 4.6. `playables/`

Chứa playable thật theo campaign.

Mỗi playable có:

```txt
playables/<campaign-name>/
  brief.md
  playable.config.json
  copy.json
  asset.manifest.json
  assets/raw/
  assets/optimized/
  notes/prompt.md
  notes/review.md
  generated/index.html
  generated/preview.html
  generated/validation.report.json
  generated/export.zip
```

---

## 5. Template contract

### 5.1. `template.manifest.json`

Mỗi template cần có manifest như sau:

```json
{
  "id": "ai-chat-simulator",
  "name": "AI Chat Simulator",
  "category": "ai-product-intro",
  "version": "1.0.0",
  "description": "Playable mô phỏng người dùng hỏi AI và nhận kết quả nhanh.",
  "goal": ["leadgen", "app-install", "product-awareness"],
  "bestFor": ["AI chatbot", "AI assistant", "AI search", "AI productivity tool"],
  "orientation": ["portrait"],
  "defaultViewport": {
    "width": 390,
    "height": 844
  },
  "duration": {
    "recommendedSeconds": 20,
    "maxSeconds": 30
  },
  "scenes": [
    "intro",
    "interaction",
    "result",
    "cta"
  ],
  "assetSlots": [
    {
      "key": "logo",
      "type": "image",
      "required": true,
      "recommended": "svg/png transparent"
    },
    {
      "key": "productMockup",
      "type": "image",
      "required": false,
      "recommended": "webp/png"
    }
  ],
  "copySlots": [
    "headline",
    "subheadline",
    "inputPrompt",
    "aiResponse",
    "benefit1",
    "benefit2",
    "ctaLabel"
  ],
  "interactions": [
    "tap-to-start",
    "type-simulation",
    "select-chip",
    "cta-click"
  ],
  "allowedComponents": [
    "PhoneFrame",
    "ChatBubble",
    "TypingIndicator",
    "ChoiceChip",
    "CTAButton",
    "ProgressBar"
  ],
  "trackingEvents": [
    "playable_start",
    "first_interaction",
    "demo_completed",
    "cta_click"
  ],
  "constraints": {
    "noExternalNetwork": true,
    "noLocalStorage": true,
    "inlineCriticalAssets": true,
    "maxInitialLoadKb": 600,
    "maxTotalKb": 5000
  }
}
```

### 5.2. Scene contract

Mỗi scene nên là JSON riêng để Claude có thể sửa nội dung mà không phá runtime.

```json
{
  "id": "interaction",
  "type": "chat-simulation",
  "order": 2,
  "durationMs": 7000,
  "layout": "phone-chat",
  "copyRefs": ["inputPrompt", "aiResponse"],
  "assetRefs": ["logo"],
  "interaction": {
    "type": "tap-choice",
    "required": true,
    "choices": [
      {
        "id": "choice-1",
        "labelRef": "choiceLabel1",
        "nextScene": "result"
      }
    ]
  },
  "animation": {
    "enter": "fade-up",
    "main": "typing",
    "exit": "fade"
  }
}
```

---

## 6. Playable config contract

File này được tạo cho từng campaign/playable.

```json
{
  "id": "campaign-2026-ai-chatbot-v1",
  "templateId": "ai-chat-simulator",
  "status": "draft",
  "locale": "en",
  "product": {
    "name": "Nova AI",
    "category": "AI assistant",
    "oneLineValue": "Turn messy notes into clear action plans."
  },
  "campaign": {
    "goal": "app-install",
    "audience": "busy marketers and founders",
    "tone": "fast, helpful, modern",
    "cta": {
      "label": "Try Nova AI",
      "url": "{{APP_STORE_URL}}"
    }
  },
  "viewport": {
    "mode": "mobile",
    "width": 390,
    "height": 844,
    "safeArea": true
  },
  "exportTargets": ["generic-html5", "mraid", "meta-playable"],
  "tracking": {
    "enabled": true,
    "events": [
      "playable_start",
      "first_interaction",
      "demo_completed",
      "cta_click"
    ]
  }
}
```

---

## 7. Asset standard

### 7.1. Folder asset

```txt
assets/
  raw/
    logo-original.png
    hero-image.jpg
  optimized/
    logo.svg
    hero-image.webp
  sprites/
  audio/
  fonts/
```

### 7.2. Naming convention

```txt
<playable-id>__<slot-key>__<variant>.<ext>
```

Ví dụ:

```txt
campaign-2026-ai-chatbot-v1__logo__main.svg
campaign-2026-ai-chatbot-v1__hero__mobile.webp
campaign-2026-ai-chatbot-v1__icon-spark__main.svg
```

### 7.3. Asset manifest

```json
{
  "version": "1.0.0",
  "assets": [
    {
      "key": "logo",
      "path": "assets/optimized/logo.svg",
      "type": "image/svg+xml",
      "sizeKb": 8,
      "required": true,
      "usage": ["intro", "cta"]
    },
    {
      "key": "hero",
      "path": "assets/optimized/hero.webp",
      "type": "image/webp",
      "sizeKb": 92,
      "required": false,
      "usage": ["intro"]
    }
  ]
}
```

### 7.4. Rule chuẩn hoá asset

- Tất cả asset dùng trong export phải nằm trong project, không hotlink external URL.
- Ảnh lớn phải được resize theo kích thước hiển thị thực tế.
- SVG phải được optimize và remove metadata thừa.
- Không embed font quá nặng nếu không cần.
- Không dùng video ở phase đầu, trừ khi có rule riêng.
- Audio phải optional và mặc định muted.
- Mỗi asset phải có `key`, `path`, `type`, `sizeKb`, `usage`.
- Nếu asset không dùng trong scene nào thì phải remove khỏi export.

---

## 8. Copy standard

### 8.1. Copy file

```json
{
  "headline": "Your AI teammate is ready",
  "subheadline": "Tap to see how fast it turns a messy request into a clean answer.",
  "inputPrompt": "Create a 7-day launch plan for my new product",
  "aiResponse": "Done. Here is a clear plan with tasks, channels, and daily goals.",
  "benefit1": "Plan faster",
  "benefit2": "Write better",
  "benefit3": "Launch smarter",
  "ctaLabel": "Try it now"
}
```

### 8.2. Rule copy

- Headline ngắn, dễ hiểu trong 1 giây.
- CTA rõ hành động, không mơ hồ.
- Không claim quá đà nếu chưa có bằng chứng.
- Không dùng quá nhiều text trong một màn mobile.
- Mỗi scene chỉ nên có một thông điệp chính.
- Copy phải có fallback nếu locale chưa dịch.
- Prompt mô phỏng trong playable nên gần với use case thật của sản phẩm.

---

## 9. Runtime architecture

### 9.1. Các layer chính

```txt
Playable Runtime
  ├── Scene Engine
  ├── Component Renderer
  ├── Interaction Controller
  ├── Animation Controller
  ├── Asset Loader
  ├── Tracking Adapter
  ├── CTA Adapter
  ├── MRAID Adapter
  └── Fallback Adapter
```

### 9.2. Scene Engine

Nhiệm vụ:

- Load scene list từ template + config.
- Điều phối scene theo order.
- Cho phép next scene bằng time hoặc interaction.
- Gửi event tracking.
- Không để scene bị loop vô hạn.

### 9.3. Component Renderer

Nhiệm vụ:

- Render component theo `allowedComponents`.
- Không cho Claude tự thêm component ngoài template nếu chưa register.
- Map copy slot và asset slot vào UI.

### 9.4. CTA Adapter

Nhiệm vụ:

- Handle CTA click.
- Với MRAID: ưu tiên `mraid.open(url)` nếu khả dụng.
- Với preview: mở URL giả hoặc log event.
- Không auto redirect khi user chưa tương tác.

### 9.5. Tracking Adapter

Nhiệm vụ:

- Chuẩn hoá event name.
- Log trong preview.
- Export event stub cho ad network.
- Không gửi personal data.

---

## 10. Mobile preview mode

### 10.1. Mục tiêu

Marketing cần xem playable trong khung mobile như thật, không phải nhìn desktop full screen.

### 10.2. UI preview đề xuất

```txt
┌──────────────────────────────────────────────────────────────┐
│ Topbar: Template | Campaign | Locale | Export Target | Status │
├───────────────────────────────┬──────────────────────────────┤
│                               │ Inspector                    │
│       Mobile Frame            │ ├── Scene list                │
│   ┌─────────────────────┐     │ ├── Copy slots                │
│   │                     │     │ ├── Asset slots               │
│   │   Playable running  │     │ ├── Tracking events           │
│   │                     │     │ ├── Size report               │
│   └─────────────────────┘     │ └── Validation warnings       │
│                               │                              │
├───────────────────────────────┴──────────────────────────────┤
│ Timeline: intro → interaction → result → CTA                  │
└──────────────────────────────────────────────────────────────┘
```

### 10.3. Preview features

- Mobile frame selector: iPhone 13, iPhone SE, Android compact, Android large.
- Orientation switch: portrait/landscape.
- Replay scene.
- Jump to scene.
- Show tap target overlay.
- Show safe area overlay.
- Show FPS/performance warning.
- Show asset size report.
- Show tracking event stream.
- Show validation warning ngay trong preview.

---

## 11. CLI workflow

### 11.1. Tạo playable từ template

```bash
pnpm playable create \
  --template ai-chat-simulator \
  --name campaign-2026-ai-chatbot-v1 \
  --locale en
```

Output:

```txt
playables/campaign-2026-ai-chatbot-v1/
  brief.md
  playable.config.json
  copy.json
  asset.manifest.json
  assets/raw/
  assets/optimized/
  notes/prompt.md
```

### 11.2. Preview

```bash
pnpm playable preview campaign-2026-ai-chatbot-v1
```

### 11.3. Normalize assets

```bash
pnpm playable assets:normalize campaign-2026-ai-chatbot-v1
```

### 11.4. Validate

```bash
pnpm playable validate campaign-2026-ai-chatbot-v1
```

### 11.5. Export

```bash
pnpm playable export campaign-2026-ai-chatbot-v1 --target mraid
pnpm playable export campaign-2026-ai-chatbot-v1 --target meta-playable
pnpm playable export campaign-2026-ai-chatbot-v1 --target google-html5
```

---

## 12. Claude/Marketing workflow

### 12.1. Flow tổng quát

```txt
Marketing brief
  ↓
Claude đọc INSTRUCTION + rules + template registry
  ↓
Claude chọn template hoặc đề xuất template mới
  ↓
Claude tạo brief.md + playable.config.json + copy.json
  ↓
Asset normalizer xử lý asset
  ↓
Preview mobile
  ↓
Validator check
  ↓
Marketing review
  ↓
Dev approve nếu cần
  ↓
Export ZIP/HTML
```

### 12.2. Prompt tạo playable từ template

```md
Bạn là Playable Ads Builder Assistant.

Hãy đọc:
- INSTRUCTION.md
- rules/global.rules.md
- rules/playable.rules.md
- rules/asset.rules.md
- templates/ai-chat-simulator/template.manifest.json

Tạo một playable mới từ template `ai-chat-simulator`.

Campaign brief:
- Product: Nova AI
- Category: AI assistant
- Audience: marketers, founders, solo creators
- Goal: app install
- Main value: turn messy ideas into launch-ready plans
- Tone: fast, modern, practical
- CTA: Try Nova AI
- Locale: English

Yêu cầu output:
1. Tạo `playables/campaign-2026-nova-ai-v1/brief.md`
2. Tạo `playables/campaign-2026-nova-ai-v1/playable.config.json`
3. Tạo `playables/campaign-2026-nova-ai-v1/copy.json`
4. Tạo `playables/campaign-2026-nova-ai-v1/notes/prompt.md`
5. Không sửa runtime core.
6. Không thêm dependency mới.
7. Sau khi tạo xong, tự review theo rules và liệt kê warning nếu có.
```

### 12.3. Prompt tạo playable gần giống template

```md
Tạo một playable mới gần giống template `ai-chat-simulator`, nhưng đổi interaction chính từ chat typing sang chọn 3 prompt chips.

Giữ lại:
- Mobile-first layout
- 4 scene: intro, interaction, result, CTA
- CTA cuối
- Tracking events chuẩn

Thay đổi:
- Visual style: brighter, more SaaS landing-page feel
- Interaction: user chọn 1 trong 3 use case chips
- Result scene: show AI output card + 3 benefits

Output theo contract của project, không sửa runtime core.
```

### 12.4. Prompt tạo template mới

```md
Tạo template playable mới tên `ai-workflow-automation`.

Template goal:
- Giới thiệu sản phẩm AI automation
- Người dùng kéo/thả hoặc tap để nối 3 bước workflow
- Sau đó AI tự động hoàn thành workflow và hiện result

Yêu cầu:
1. Tạo folder `templates/ai-workflow-automation/`
2. Tạo `template.manifest.json`
3. Tạo README mô tả use case phù hợp
4. Tạo 4 scene JSON: intro, build-workflow, automation-result, cta
5. Tạo copy mẫu tiếng Anh
6. Tạo storyboard.md
7. Không implement runtime mới nếu có thể dùng component đã có.
8. Nếu cần component mới, đề xuất trong phần `requiredNewComponents`, không tự thêm code.
```

---

## 13. Validation rules

### 13.1. Rule bắt buộc

Validator phải check:

- Có `playable.config.json`.
- Có `templateId` hợp lệ.
- Template tồn tại trong registry.
- Tất cả scene hợp lệ.
- Tất cả copy slot required đã có.
- Tất cả asset required đã có.
- Không có external URL trong export.
- Không có `localStorage` hoặc API browser bị cấm.
- Không có auto redirect.
- CTA chỉ trigger sau user action.
- Asset không vượt size limit theo target.
- Không có file unused trong export.
- Không có text quá dài gây overflow mobile.
- Tap target đủ lớn.
- Có fallback nếu MRAID không tồn tại.

### 13.2. Validation report

```json
{
  "playableId": "campaign-2026-ai-chatbot-v1",
  "status": "warning",
  "target": "mraid",
  "summary": {
    "errors": 0,
    "warnings": 2,
    "sizeKb": 482
  },
  "warnings": [
    {
      "code": "COPY_TOO_LONG",
      "scene": "intro",
      "message": "Headline may wrap into 3 lines on 360px viewport."
    },
    {
      "code": "ASSET_LARGE",
      "asset": "hero",
      "message": "Hero image is 180KB. Recommended under 120KB."
    }
  ],
  "errors": []
}
```

---

## 14. Export targets

### 14.1. Generic HTML5

Dùng để preview, gửi nội bộ hoặc chạy trên landing test.

Output:

```txt
generated/generic-html5/
  index.html
  assets/
  report.json
```

### 14.2. Single-file HTML

Dùng cho network yêu cầu inline toàn bộ asset.

Output:

```txt
generated/single-file/
  index.html
  report.json
```

### 14.3. MRAID

Dùng cho mobile in-app ad network hỗ trợ MRAID.

Yêu cầu:

- Có MRAID adapter.
- Chờ `mraid` ready/viewable nếu môi trường có MRAID.
- CTA dùng `mraid.open(url)` khi khả dụng.
- Có fallback khi chạy browser preview.

### 14.4. Google HTML5

Yêu cầu adapter riêng vì Google HTML5 có giới hạn về ZIP, file count, local asset, meta size, external reference.

Checklist:

- Có `<!DOCTYPE html>`.
- Có `<html>`, `<body>`.
- Có `<meta name="ad.size" content="width=W,height=H">`.
- Asset local trong ZIP.
- Không dùng absolute external URL cho code/assets.
- Không dùng localStorage.

### 14.5. Meta playable

Yêu cầu adapter riêng vì Meta playable thường yêu cầu HTML5 package tự chứa, không external network, và phải hoạt động không phụ thuộc MRAID.

Checklist:

- HTML5 playable package.
- Không network call.
- Không phụ thuộc MRAID để playable chạy.
- CTA rõ ràng.
- Tương tác hoạt động trên mobile webview.

---

## 15. Template playable mẫu cho sản phẩm AI

### 15.1. Template 1 — `ai-chat-simulator`

**Use case:** AI chatbot, AI assistant, AI search, AI support.

Flow:

```txt
Intro
  → user tap Start
  → Chat simulation: user prompt appears
  → AI typing indicator
  → AI response/result card
  → CTA
```

Interaction:

- Tap to start.
- Tap prompt chip.
- Watch AI response.
- Tap CTA.

Copy slots:

- headline
- subheadline
- promptChip1
- promptChip2
- promptChip3
- aiResponse
- resultTitle
- ctaLabel

### 15.2. Template 2 — `ai-image-before-after`

**Use case:** AI image generator, AI design tool, AI photo editor.

Flow:

```txt
Intro before image
  → user swipe/tap enhance
  → AI processing animation
  → after image reveal
  → benefit cards
  → CTA
```

Interaction:

- Swipe before/after.
- Tap enhance.
- Result reveal.

Asset slots:

- beforeImage
- afterImage
- logo
- effectOverlay

### 15.3. Template 3 — `ai-workflow-automation`

**Use case:** AI automation, agent workflow, no-code AI tool.

Flow:

```txt
Intro problem
  → user taps 3 workflow blocks
  → AI connects workflow
  → automation result
  → CTA
```

Interaction:

- Tap blocks in order.
- Progress line animation.
- Completion state.

Copy slots:

- painPoint
- step1Label
- step2Label
- step3Label
- resultText
- ctaLabel

### 15.4. Template 4 — `ai-writing-assistant`

**Use case:** AI writing, email assistant, content generator.

Flow:

```txt
Messy draft
  → user taps Improve
  → AI rewrites
  → polished version
  → CTA
```

Interaction:

- Tap Improve.
- Text transforms line by line.
- User sees final copy.

### 15.5. Template 5 — `ai-agent-task-race`

**Use case:** AI agent, productivity assistant, task automation.

Flow:

```txt
User has 5 tasks
  → tap Start AI Agent
  → tasks complete quickly
  → time saved result
  → CTA
```

Interaction:

- Tap start.
- Task checklist animation.
- Result counter.

### 15.6. Template 6 — `ai-dashboard-insight`

**Use case:** AI analytics, business intelligence, AI report tool.

Flow:

```txt
Messy dashboard
  → user taps Ask AI
  → AI highlights insight
  → recommended action appears
  → CTA
```

Interaction:

- Tap chart area.
- Insight card appears.
- Action recommendation.

### 15.7. Template 7 — `ai-quiz-personalized-recommendation`

**Use case:** AI recommendation, onboarding, personalized product.

Flow:

```txt
Question 1
  → user chooses answer
  → Question 2
  → AI generates recommendation
  → CTA
```

Interaction:

- Tap answer cards.
- Progress indicator.
- Personalized result.

---

## 16. Template registry

`packages/templates/src/registry.ts`

```ts
export const templateRegistry = {
  "ai-chat-simulator": {
    manifestPath: "templates/ai-chat-simulator/template.manifest.json",
    status: "ready",
    category: "ai-product-intro"
  },
  "ai-image-before-after": {
    manifestPath: "templates/ai-image-before-after/template.manifest.json",
    status: "ready",
    category: "ai-visual-product"
  },
  "ai-workflow-automation": {
    manifestPath: "templates/ai-workflow-automation/template.manifest.json",
    status: "draft",
    category: "ai-automation"
  }
} as const;
```

---

## 17. Component system

### 17.1. Base components

Nên có một bộ component nhỏ cho playable:

```txt
PhoneFrame
SceneContainer
SafeArea
LogoMark
Headline
Subheadline
CTAButton
ProgressBar
ChoiceChip
ChatBubble
TypingIndicator
ResultCard
BeforeAfterSlider
TaskCard
WorkflowNode
InsightCard
ConfettiLite
```

### 17.2. Component rule

- Component phải responsive trong mobile frame.
- Không dùng layout quá phức tạp.
- Không phụ thuộc CSS framework ở bản export nếu không cần.
- Animation phải có duration rõ ràng.
- Mỗi component phải có fallback text/asset.
- Component phải nhận data từ contract, không hardcode campaign copy.

---

## 18. Tracking event standard

### 18.1. Event names

```txt
playable_loaded
playable_start
scene_view
first_interaction
choice_selected
demo_completed
cta_visible
cta_click
playable_error
```

### 18.2. Event payload

```json
{
  "event": "choice_selected",
  "playableId": "campaign-2026-ai-chatbot-v1",
  "templateId": "ai-chat-simulator",
  "sceneId": "interaction",
  "choiceId": "promptChip1",
  "timestamp": 1710000000000
}
```

### 18.3. Rule tracking

- Không gửi email, phone, user id, device id, personal data.
- Preview mode chỉ log local trong inspector.
- Export mode dùng adapter theo network.
- CTA click phải được track trước khi gọi open URL.

---

## 19. File instruction mẫu

### 19.1. `INSTRUCTION.md` mẫu

```md
# Playable Builder Kit Instruction

You are working inside a Playable Ads Builder Kit.

Your job is to help Marketing create mobile-first playable ads from existing templates, variants, or new template contracts.

## Must follow

1. Always read template manifest before generating a playable.
2. Always create or update files through the project contracts.
3. Never add external runtime dependencies unless explicitly approved by developer.
4. Never use external network calls in exported playable.
5. Never auto redirect users without interaction.
6. Always keep playable mobile-first.
7. Always produce `brief.md`, `playable.config.json`, `copy.json`, and `asset.manifest.json` for a campaign playable.
8. Always validate against rules before final response.
9. If a requested idea does not fit any template, propose a new template contract instead of hacking an existing one.

## Allowed files for Marketing generation

- `playables/**/brief.md`
- `playables/**/playable.config.json`
- `playables/**/copy.json`
- `playables/**/asset.manifest.json`
- `playables/**/notes/**`
- `templates/**/template.manifest.json` only when creating a new template
- `templates/**/scenes/**` only when creating or updating template structure

## Restricted files

Do not edit without developer approval:

- `packages/runtime/**`
- `packages/exporter/**`
- `packages/validator/**`
- `packages/core/**`
- `package.json`
- `turbo.json`
- build scripts

## Output expectation

When completing a playable task, return:

1. What template was used.
2. What files were created/updated.
3. Scene flow summary.
4. Asset requirements.
5. Validation result or warnings.
6. Next action for Marketing.
```

---

## 20. Developer implementation plan

### Phase 1 — Foundation

- Tạo monorepo structure.
- Tạo `INSTRUCTION.md`, `CLAUDE.md`, `rules/`, `skills/`.
- Tạo `packages/core` với schema/type.
- Tạo `packages/templates` với registry.
- Tạo 3 template đầu: `ai-chat-simulator`, `ai-image-before-after`, `ai-writing-assistant`.
- Tạo CLI command `create`, `preview`, `validate`.

### Phase 2 — Mobile Preview

- Build `apps/mobile-preview`.
- Có mobile frame selector.
- Render playable từ `playable.config.json`.
- Hiện scene timeline.
- Hiện inspector: copy, asset, event, warning.

### Phase 3 — Asset pipeline

- Image optimize.
- SVG optimize.
- Audio optional.
- Generate `asset.manifest.json`.
- Remove unused assets.
- Size report.

### Phase 4 — Exporter

- Generic HTML5 export.
- Single-file HTML export.
- MRAID adapter.
- Google HTML5 profile.
- Meta playable profile.
- ZIP build.

### Phase 5 — Template expansion

- Thêm các template AI còn lại.
- Thêm template variant generator.
- Thêm prompt recipes.
- Thêm QA checklist.

---

## 21. Acceptance criteria

Project được xem là đạt phase đầu khi:

- Marketing có thể tạo playable mới từ ít nhất 3 template AI có sẵn.
- Claude có instruction rõ ràng để không phá runtime.
- Mỗi playable có `brief.md`, `playable.config.json`, `copy.json`, `asset.manifest.json`.
- Có mobile preview chạy được.
- Có validator report.
- Có export HTML/ZIP cơ bản.
- Có asset standard và copy standard.
- Có template registry.
- Có prompt mẫu cho 3 mode: from template, similar template, new template.

---

## 22. QA checklist cho Marketing

Trước khi gửi playable đi review:

- [ ] Playable chạy tốt trong mobile preview.
- [ ] Scene đầu hiểu được trong 1–2 giây.
- [ ] Người dùng biết cần tap/swipe vào đâu.
- [ ] CTA rõ và dễ bấm.
- [ ] Không có text bị tràn.
- [ ] Không có asset lỗi hoặc mờ.
- [ ] Không có loading quá lâu.
- [ ] Không có redirect tự động.
- [ ] Copy đúng brand tone.
- [ ] Validation không có error.
- [ ] Export đúng target network.

---

## 23. QA checklist cho Developer

Trước khi approve export:

- [ ] Bundle size đúng target.
- [ ] Không có external network call ngoài rule được phép.
- [ ] Không có dependency thừa.
- [ ] Không dùng localStorage/sessionStorage nếu target cấm.
- [ ] MRAID fallback hoạt động.
- [ ] CTA adapter đúng target.
- [ ] Tracking event đúng schema.
- [ ] Tap target đạt chuẩn mobile.
- [ ] Safe area không che CTA.
- [ ] Export ZIP mở được độc lập.
- [ ] Không có console error runtime.

---

## 24. Quy tắc khi Claude tạo code hoặc config

Claude phải ưu tiên thứ tự sau:

1. Sửa config/copy trước.
2. Sửa scene JSON nếu cần.
3. Chỉ đề xuất component mới nếu template hiện tại không đủ.
4. Không sửa runtime core nếu không được yêu cầu.
5. Không thêm package nếu không có lý do rõ ràng.
6. Không tạo creative vượt quá rule performance.
7. Không tạo hidden claim hoặc misleading claim.
8. Không tự ý thay CTA URL thật nếu chưa được cung cấp.

---

## 25. Roadmap mở rộng

Sau phase đầu có thể mở rộng:

- Web UI để Marketing chọn template và nhập brief thay vì prompt thuần.
- Versioning playable.
- Compare variants A/B.
- Auto screenshot storyboard.
- Auto generate preview video/GIF.
- Multi-locale copy generation.
- Brand kit support.
- Campaign library.
- Template marketplace nội bộ.
- AI review score: clarity, interaction, CTA strength, asset risk.
- Import Figma frame làm asset/template reference.

---

## 26. Gợi ý stack kỹ thuật

### Authoring/Studio

- Next.js hoặc Vite React cho Studio.
- TypeScript.
- Zod cho schema validation.
- pnpm workspace/turborepo.
- Sharp/SVGO cho asset optimization.
- esbuild/Vite/Rollup cho export.

### Runtime export

- Vanilla TypeScript output.
- Minimal CSS.
- Inline critical CSS.
- Optional single-file HTML mode.
- No external dependency by default.

### Validator

- Zod schema validation.
- AST/string scan cho forbidden API.
- Asset size check.
- Export profile check.
- HTML check.

---

## 27. Reference constraints cần cập nhật định kỳ

Các ad network có thể thay đổi spec. Nên có file:

```txt
docs/export-network-guide.md
```

Trong đó lưu:

- Target network.
- Max package size.
- Single-file hay ZIP.
- Có cho external asset không.
- Có cần MRAID không.
- CTA/open rule.
- Tracking rule.
- Last checked date.
- Link official docs.

Khuyến nghị cập nhật mỗi khi campaign chạy trên network mới.

---

## 28. Kết luận

Cấu trúc tốt nhất cho project này là:

```txt
Instruction + Skills + Rules
          ↓
Template Registry + Template Contract
          ↓
Marketing Brief + Claude Prompt
          ↓
Playable Config + Copy + Asset Manifest
          ↓
Mobile Preview + Validator
          ↓
Exporter theo network
```

Điểm quan trọng là **không để Claude generate playable một cách tự do**. Claude nên hoạt động như một assistant tạo biến thể dựa trên contract. Project càng contract-driven thì Marketing càng tạo nhanh, còn Dev vẫn kiểm soát được chất lượng, size, runtime và khả năng submit lên ad network.

---

## 29. Block-based templates & ghép cross-template

Phần này bổ sung cho **§2.2, §5, §12** — phản ánh yêu cầu Marketing: prompt theo template, tạo template mới, **ghép phần** từ template A/B/C mà **không fix UI**.

### 29.1. Ba lớp khái niệm

```txt
Block (hành vi + vùng)     →  đơn vị nhỏ nhất, tái sử dụng
Template (bộ mặc định)    →  composition.default + README + preview
Playable (campaign)       →  composition.json + copy + assets → build → dist/*.html
```

| Khái niệm | Ví dụ | Marketing thấy gì |
|-----------|--------|-------------------|
| **Block** | `chat-stream`, `chip-picker`, `tap-to-start`, `store-cta` | “Phần chat”, “Phần chọn chip”, “Nút Get the app” |
| **Template** | `ai-chat-simulator` | “Playable kiểu chat AI” — 3–4 bước mặc định |
| **Composition** | flow + block refs | “Màn 1 template A, màn 2 template B, footer template C” |

**Block ≠ màn hình đẹp sẵn.** Block = **kịch bản** khi user tap / chọn / xem stream giả lập + **slot** để điền copy & asset.

### 29.2. Cấu trúc folder (bổ sung §3)

```txt
playable-builder-kit/
  blocks/                          # thư viện hành vi (shared)
    tap-to-start/
      block.manifest.json
      behavior.schema.json         # interaction contract
      preview.md                   # mô tả cho MKT, không phải UI cố định
    chat-stream/
    chip-picker/
    result-card/
    store-cta/                     # wrap bindStoreCta + MRAID rules

  templates/                       # bundle mặc định (composition + docs)
    ai-chat-simulator/
      template.manifest.json
      composition.default.json     # block refs + flow
      README.md
      preview/storyboard.md
      copy/en.sample.json

  playables/                       # campaign thật
    campaign-nova-ai-v1/
      brief.md
      playable.config.json
      composition.json             # có thể override/ghép block
      copy.json
      asset.manifest.json
      assets/
      generated/index.html         # sau pnpm build / export

  packages/runtime/                # scene-engine đọc composition → render
  ai/                              # skills + rules (giữ, map xuống §29.6)
```

**Khác kit hiện tại (`src/pages/<name>/`):** Phase 1 vẫn **compile ra** `src/pages/<name>/` hoặc `dist/`; contract JSON là source, HTML là output.

### 29.3. `block.manifest.json`

```json
{
  "id": "chat-stream",
  "name": "AI chat stream (simulated)",
  "region": ["main", "fullscreen"],
  "behaviorType": "chat-stream",
  "description": "User taps chip or send → simulated typing → AI reply bubbles.",
  "interactions": ["tap-chip", "tap-send", "auto-advance"],
  "copySlots": ["userPrompt", "aiReply", "chip1", "chip2", "chip3"],
  "assetSlots": [{ "key": "avatar", "required": false }],
  "trackingEvents": ["first_interaction", "demo_completed"],
  "constraints": {
    "maxDurationMs": 15000,
    "requiresUserGestureBeforeCTA": false
  },
  "skills": ["playable-mobile-scaling", "playable-interactions"]
}
```

`behaviorType` là enum cố định (dev mở rộng), không phải CSS class.

### 29.4. `composition.json` — ghép A + B + C

**Theo màn (flow):**

```json
{
  "id": "campaign-nova-mix-v1",
  "viewport": { "width": 390, "height": 844 },
  "flow": [
    {
      "id": "step-1",
      "blockRef": "blocks/tap-to-start",
      "fromTemplate": "ai-chat-simulator",
      "copyOverrides": { "headline": "Meet Nova AI" }
    },
    {
      "id": "step-2",
      "blockRef": "blocks/chat-stream",
      "fromTemplate": "ai-chat-simulator"
    },
    {
      "id": "step-3",
      "blockRef": "blocks/result-card",
      "fromTemplate": "ai-writing-assistant"
    },
    {
      "id": "step-4",
      "blockRef": "blocks/store-cta",
      "fromTemplate": "ai-chat-simulator"
    }
  ]
}
```

**Theo vùng (cùng một màn):**

```json
{
  "id": "campaign-layout-mix-v1",
  "screens": [
    {
      "id": "single-screen-demo",
      "regions": {
        "header": { "blockRef": "blocks/intro-headline", "fromTemplate": "ai-chat-simulator" },
        "main": { "blockRef": "blocks/chip-picker", "fromTemplate": "ai-quiz-personalized" },
        "footer": { "blockRef": "blocks/store-cta", "fromTemplate": "ai-dashboard-insight" }
      }
    }
  ]
}
```

Validator bắt buộc:

- Mọi `blockRef` + `fromTemplate` tồn tại trong registry.
- `flow[].next` / `interaction.choices[].nextScene` hợp lệ.
- Đủ `copySlots` + `assetSlots` required của **tất cả** block được dùng.
- Export vẫn pass `pnpm verify:applovin` (rules hiện tại).

### 29.5. Ba mode Marketing (map prompt → file)

| Mode | Prompt ví dụ | Output contract |
|------|----------------|-----------------|
| **Từ template** | “Tạo playable từ `ai-chat-simulator`, product Nova AI…” | `playable.config.json` + `composition.json` = copy `composition.default.json` |
| **Ghép template** | “Màn 1 `ai-chat-simulator`, màn 2 `ai-writing-assistant`, CTA giữ từ chat” | `composition.json` custom `flow[]` |
| **Tạo template mới** | “Template mới `ai-workflow-automation`: tap 3 block nối workflow…” | `templates/<id>/` + đăng ký registry; **chỉ thêm block mới** nếu `behaviorType` chưa có |

**Xem template mẫu:** `templates/<id>/preview/storyboard.md` + `pnpm preview <id>` (Phase 2) — không cần mở code.

### 29.6. Giữ `ai/skills` & rules hiện tại — map rõ ràng

Kit hiện tại (`ai/CLAUDE-PACK.md`, `verify:applovin`, mobile 390×844) **vẫn áp dụng cho lớp HTML export**:

| Skill / rule hiện tại | Áp dụng khi |
|----------------------|-------------|
| `playable-viewport-shell` | Mọi playable / block render ra `__app` |
| `playable-mobile-scaling` | Mọi CSS từ mockup 390×844 |
| `playable-store-cta` | Block `store-cta` |
| `playable-applovin-compliance` | Trước giao `dist/.../index.html` |
| `playable-lottie`, `playable-assets` | Block có animation / ảnh |

Claude workflow:

```txt
1. Đọc ai/CLAUDE-PACK.md (hoặc INSTRUCTIONS)
2. Đọc template.manifest + composition (default hoặc custom)
3. Chỉ sửa: playables/**, copy.json, composition.json, assets
4. Generate / cập nhật src/pages/<campaign>/ (Phase 1) hoặc để codegen (Phase 2)
5. pnpm build:single + verify:applovin
6. Trả validation.report.json + dist path
```

### 29.7. Lộ trình migrate (không big-bang)

| Phase | Trạng thái | Việc làm |
|-------|-----------|----------|
| **0 — Hiện tại** | ✅ | `src/pages/`, `ai/skills`, `pnpm build:single`, 1 HTML |
| **1 — Contract** | Tiếp theo | Thêm `blocks/`, `templates/*/composition.default.json`, `playables/*/composition.json`; script `pnpm compose <campaign>` validate JSON |
| **1b — Compile** | | `composition.json` → scaffold `src/pages/<campaign>/` (Claude hoặc script); skills CSS/MRAID giữ nguyên |
| **2 — Runtime** | | `packages/runtime` scene-engine; ít hand-code `page.js` hơn |
| **3 — Studio** | | Preview template, xem block, timeline flow |

**Nguyên tắc:** Marketing prompt luôn nói **template id + composition**; validator chặn trước build; HTML export vẫn một file AppLovin.

### 29.8. Prompt recipe — ghép cross-template

```md
Đọc ai/CLAUDE-PACK.md và templates/*/template.manifest.json.

Tạo playable `campaign-nova-mix-v1`:

Flow:
- Step 1: intro từ template `ai-chat-simulator` (block tap-to-start)
- Step 2: interaction từ template `ai-chat-simulator` (block chat-stream)
- Step 3: result từ template `ai-writing-assistant` (block result-card)
- Footer CTA: block store-cta từ `ai-chat-simulator`

Product: Nova AI. Locale EN. Mockup 390×844 dark theme.
Tạo playables/campaign-nova-mix-v1/composition.json + copy.json + brief.md.
Build → dist/campaign-nova-mix-v1/index.html. Chạy verify:applovin.
```

### 29.9. Tạo template mới (Marketing → dev review)

Template mới **không** bắt đầu từ Figma pixel-perfect. Bắt đầu từ:

1. **Goal** + **behaviorTypes** cần có.
2. Liệt kê **block** dùng lại vs **block mới** (`requiredNewBlocks` trong PR).
3. `composition.default.json` + `storyboard.md` (kịch bản tap/chat/stream).
4. Dev implement block renderer (nếu mới) + đăng ký validator.
5. Marketing dùng template id trong prompt sau khi `status: ready`.

---

## 30. Kết luận (cập nhật)

Cấu trúc mục tiêu:

```txt
ai/skills + rules (export HTML, MRAID, 390×844)
          ↓
blocks/ (hành vi) + templates/ (bundle mặc định)
          ↓
composition.json (ghép A/B/C — flow hoặc regions)
          ↓
playables/ (brief, copy, assets)
          ↓
build → dist/<campaign>/index.html
          ↓
verify:applovin + validation.report.json
```

**Template = kịch bản tương tác + slot, không phải UI đóng băng.** Marketing sáng tạo copy/visual trong slot; Claude ghép block an toàn; validator + skills giữ chuẩn ad network.
