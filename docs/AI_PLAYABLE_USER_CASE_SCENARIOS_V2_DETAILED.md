# AI_PLAYABLE_USER_CASE_SCENARIOS_V2_DETAILED.md

# AI Playable Ads - Scenario Library V2

## 1. Mục tiêu

File này là bản chi tiết hơn cho thư viện kịch bản playable ads AI.

Mục tiêu cuối:

```txt
Marketing prompt
→ Claude tạo / sửa playable
→ preview mobile
→ approve
→ export single HTML
→ CTA click tới App Store
```

Bản V2 bổ sung các yêu cầu quan trọng:

- Mỗi kịch bản có chuyển tiếp giữa các màn hình hợp lý hơn.
- Mỗi screen có mục đích rõ ràng, content mẫu, mô tả ảnh/visual, mô tả animation.
- Mọi screen, trừ màn CTA cuối, đều có 2 cách chuyển:
  - auto chuyển sau 3-4 giây
  - user click/tap thì chuyển ngay
- Màn cuối không chỉ là button CTA. Nếu kịch bản đang show kết quả AI thì **main content của màn cuối phải là kết quả AI**:
  - Text result
  - Image result
  - Video preview
  - Dashboard/report
  - Checklist/result plan
  - Before/after result
  - Cards/list/recommendations
- CTA cuối phải có một yếu tố nổi bật mạnh để hút user click.

---

# 2. Global Screen Rules

## 2.1 Screen count

Mỗi scenario nên có 2-5 screen.

Flow chuẩn:

```txt
Screen 1: Hook / Problem / Question
Screen 2: Interaction / AI Processing
Screen 3: AI Result / Proof
Screen 4: Final result + CTA
```

Flow ngắn:

```txt
Screen 1: Hook
Screen 2: AI Result
Screen 3: Final result + CTA
```

---

## 2.2 Transition rule

Mọi screen trước CTA cuối nên có:

```json
{
  "autoNext": {
    "enabled": true,
    "afterMs": 3500,
    "target": "next_screen"
  },
  "clickNext": {
    "enabled": true,
    "target": "next_screen"
  }
}
```

Nếu là màn quiz / option:

```json
{
  "autoNext": {
    "enabled": true,
    "afterMs": 4000,
    "defaultSelection": "first_option",
    "target": "next_screen"
  },
  "clickNext": {
    "enabled": true,
    "target": "next_screen"
  }
}
```

Nếu là màn AI loading:

```json
{
  "autoNext": {
    "enabled": true,
    "afterMs": 3500,
    "target": "result_screen"
  },
  "clickNext": {
    "enabled": true,
    "label": "Skip loading",
    "target": "result_screen"
  }
}
```

---

## 2.3 Final CTA rule

Màn cuối phải gồm:

```txt
Main AI result content
+ visual highlight
+ CTA button
+ click to App Store
```

Không nên làm:

```txt
Màn cuối chỉ có logo + button Install Now
```

Nên làm:

```txt
Màn cuối vẫn show kết quả AI chính, ví dụ:
- email AI vừa viết
- caption AI vừa tạo
- ảnh AI vừa generate
- video preview AI vừa dựng
- meal plan AI vừa tạo
- dashboard budget AI vừa tính
- checklist / report / recommendation
```

CTA chỉ là hành động để mở app xem/tạo thêm.

---

## 2.4 CTA click action

```txt
Click CTA -> {{appStoreUrl}}
```

---

# 3. CTA Layout Patterns

## CTA Pattern 01 - Text Result Hero

Dùng cho AI writing, AI chat, AI resume, AI tutor.

```txt
Top: Result ready badge
Middle: Big text/result card
Bottom: Strong CTA button
```

Main content:

```txt
Text result / email / caption / summary / checklist
```

Animation:

```txt
Result card scale-in.
CTA glow pulse.
Arrow/lottie sparkle chỉ vào CTA.
```

---

## CTA Pattern 02 - Full Image Result

Dùng cho AI image, AI avatar, AI photo editor.

```txt
Background: generated image / enhanced image
Overlay: headline + benefit chips
Bottom: floating CTA pill
```

Main content:

```txt
Image result / before-after image / avatar grid
```

Animation:

```txt
Image reveal.
CTA pill floating.
Sparkle/lottie quanh ảnh hoặc CTA.
```

---

## CTA Pattern 03 - Video Preview Result

Dùng cho AI video generator.

```txt
Top: Video ready badge
Middle: vertical video preview card
Bottom: CTA button
```

Main content:

```txt
Video poster / storyboard / video preview frame
```

Animation:

```txt
Play icon pulse.
Storyboard frames slide.
CTA bounce + glow.
```

---

## CTA Pattern 04 - Dashboard Result

Dùng cho finance, agent, productivity, analytics.

```txt
Top: Big metric / score
Middle: chart + cards
Bottom: CTA
```

Main content:

```txt
Score / chart / insight cards / KPI cards
```

Animation:

```txt
Number count-up.
Chart draw.
Progress complete.
CTA glow.
```

---

## CTA Pattern 05 - Reward Unlock Result

Dùng cho quiz, recommendation, learning, personalization.

```txt
Top: Personalized badge
Middle: result preview card
Bottom: Unlock CTA
```

Main content:

```txt
Personal result / quiz result / recommended plan
```

Animation:

```txt
Lock opens.
Confetti.
CTA pulse ring.
```

---

# 4. USER CASE 01 - AI Chat Assistant

## Scenario 1A - Ask Anything, Get Structured Answer

### Screen 1 - Hook Question

**Purpose**

Kéo user vào bằng một câu hỏi đời thường.

**Layout**

```txt
Top: AI badge
Middle: Large chat question bubble
Bottom: Tap hint
```

**Content sample**

```txt
Headline:
Ask AI anything.

Question:
How can I plan my week better?

Subtext:
Get a clear plan in seconds.
```

**Image / visual**

```txt
Mobile chat mockup.
AI avatar/orb nhỏ ở góc.
Background gradient nhẹ.
```

**Animation**

```txt
Question bubble slide-up.
Typing cursor blink.
AI avatar glow nhẹ.
Tap hint pulse.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 3500, "target": "ai_stream_answer" },
  "clickNext": { "enabled": true, "target": "ai_stream_answer" }
}
```

---

### Screen 2 - AI Streaming Answer

**Purpose**

Show AI trả lời có cấu trúc: paragraph, list, checklist, cards.

**Layout**

```txt
Top: User question bubble
Middle: AI response stream
Bottom: Typing dots
```

**Content sample**

```txt
AI:
Here’s a simple weekly plan:

1. Pick your top 3 priorities
2. Block 2 focus sessions
3. Batch small tasks together
4. Add recovery time
5. Review progress every evening

Quick checklist:
[x] Monday priorities
[x] Calendar blocks
[x] Focus session
[ ] Workout slot
[ ] Weekly review

Recommended setup:
- Focus Timer
- Task Board
- Daily Review
```

**Image / visual**

```txt
Small icons: calendar, target, timer, checklist.
No large image required.
```

**Animation**

```txt
Text streams line by line.
Checklist ticks one by one.
Recommendation cards fade-up.
Typing dots appear before each block.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 4000, "target": "value_summary" },
  "clickNext": { "enabled": true, "target": "value_summary" }
}
```

---

### Screen 3 - Value Summary

**Purpose**

Tóm tắt kết quả để user hiểu AI vừa tạo được gì.

**Layout**

```txt
Top: Success headline
Middle: 3 result cards
Bottom: Continue hint
```

**Content sample**

```txt
Headline:
Your weekly plan is ready.

Cards:
- 3 priorities organized
- 5 tasks grouped
- 2 focus blocks created

Microcopy:
Less chaos. More clarity.
```

**Image / visual**

```txt
Weekly calendar preview.
Task cards.
Check icons.
```

**Animation**

```txt
Cards stagger fade-up.
Checkmark draw animation.
Calendar slides in.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 3500, "target": "final_cta" },
  "clickNext": { "enabled": true, "target": "final_cta" }
}
```

---

### Screen 4 - Final CTA with Main AI Result

**Purpose**

Màn cuối lấy kết quả AI làm main content, CTA để mở app.

**Layout**

```txt
Top: Headline
Middle: Main AI result card
Bottom: Full-width CTA
```

**Main content type**

```txt
Text result + checklist.
```

**Content sample**

```txt
Headline:
Plan your day with AI.

Main result:
Today’s smart plan:
[x] Top 3 priorities
[x] 2 deep work blocks
[x] 1 recovery break
[x] Evening review

CTA:
Try AI Assistant Free
```

**Image / visual**

```txt
Main result card chiếm phần lớn màn hình.
AI avatar/orb đặt ở góc card.
```

**Animation**

```txt
Result card glow.
CTA pulse ring.
Sparkle lottie quanh AI avatar.
Small arrow points to CTA.
```

**CTA action**

```txt
Click CTA -> {{appStoreUrl}}
```

---

## Scenario 1B - Quick Question Picker

### Screen 1 - Pick A Quick Question

**Purpose**

Tạo interaction nhanh để user cảm giác đang điều khiển playable.

**Layout**

```txt
Top: Headline
Middle: 2x2 question chips
Bottom: Hint text
```

**Content sample**

```txt
Headline:
What do you want AI to help with?

Options:
- Write better emails
- Plan my day
- Summarize notes
- Learn faster
```

**Image / visual**

```txt
Icons: email, calendar, note, book.
```

**Animation**

```txt
Options pop-in one by one.
Default option pulse.
Tap ripple on selected option.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 4000, "defaultSelection": "Write better emails", "target": "ai_card_answer" },
  "clickNext": { "enabled": true, "target": "ai_card_answer" }
}
```

---

### Screen 2 - AI Card Answer

**Purpose**

AI trả lời thành cards dễ đọc.

**Layout**

```txt
Top: Selected question
Middle: Stack answer cards
Bottom: “AI generated 4 improvements”
```

**Content sample**

```txt
Selected:
Write better emails

AI suggestion:
Use this structure:

Card 1 - Subject
Make it specific and short.

Card 2 - Opening
Start with context in one sentence.

Card 3 - Main message
Use bullets for clarity.

Card 4 - CTA
Ask for one clear action only.
```

**Image / visual**

```txt
Email card mockup.
Envelope icon.
Check icons.
```

**Animation**

```txt
Cards slide from right.
Best card glow.
Checklist ticks.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 4000, "target": "final_cta" },
  "clickNext": { "enabled": true, "target": "final_cta" }
}
```

---

### Screen 3 - Final CTA with Email Result

**Purpose**

Màn cuối hiển thị email draft/result làm main content.

**Layout**

```txt
Background: blurred email draft
Middle: Large email result card
Bottom: Sticky CTA
```

**Main content type**

```txt
Email text result.
```

**Content sample**

```txt
Headline:
Your email draft is ready.

Email result:
Subject: Quick update on tomorrow’s demo

Hi team,
Here’s the updated plan for tomorrow’s product demo:
- 10:00 Intro and goals
- 10:10 Feature walkthrough
- 10:25 Q&A
- 10:35 Next steps

CTA:
Continue in App
```

**Image / visual**

```txt
Email preview card.
Background blur của same email card.
```

**Animation**

```txt
Email card scale-in.
CTA glow border.
Lottie sparkle around “ready” badge.
```

**CTA action**

```txt
Click CTA -> {{appStoreUrl}}
```

---

# 5. USER CASE 02 - AI Writing / Caption Generator

## Scenario 2A - Generate 3 Captions

### Screen 1 - Product Input Hook

**Purpose**

Cho user thấy chỉ cần nhập sản phẩm.

**Layout**

```txt
Top: Headline
Middle: Product input card
Bottom: Generate button
```

**Content sample**

```txt
Headline:
Turn a product into viral captions.

Input:
Matcha Energy Drink

Button:
Generate Captions
```

**Image / visual**

```txt
Product mockup: lon nước matcha / hộp sản phẩm.
Input field mobile.
```

**Animation**

```txt
Product name auto types.
Keyboard slide-up.
Generate button glows when input completes.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 3500, "target": "ai_generating" },
  "clickNext": { "enabled": true, "target": "ai_generating" }
}
```

---

### Screen 2 - AI Generating Captions

**Purpose**

Tạo cảm giác AI đang xử lý thật.

**Layout**

```txt
Top: Product thumbnail
Middle: AI loading card
Bottom: Progress checklist
```

**Content sample**

```txt
AI is creating captions...

[x] Understanding product
[x] Finding emotional hook
[ ] Writing captions
[ ] Optimizing CTA
```

**Image / visual**

```txt
Product thumbnail.
Magic wand icon.
AI sparkle icon.
```

**Animation**

```txt
Progress checklist ticks.
Loading dots.
Light scan over product card.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 3500, "target": "caption_results" },
  "clickNext": { "enabled": true, "target": "caption_results" }
}
```

---

### Screen 3 - Caption Result Cards

**Purpose**

Show nhiều output khác nhau để user thấy app hữu ích.

**Layout**

```txt
Top: “3 captions ready”
Middle: Vertical caption cards
Bottom: Continue hint
```

**Content sample**

```txt
Caption 1 - Short
Clean energy, calm focus, zero crash.

Caption 2 - TikTok Style
POV: you found your 3PM energy fix 🍵⚡

Caption 3 - Conversion
Need focus without jitters? Try Matcha Energy today.
```

**Image / visual**

```txt
Product image ở góc.
Tag chips: Short, TikTok, Conversion.
```

**Animation**

```txt
Cards stream in one by one.
Best caption heart pulse.
Tags pop-in.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 4000, "target": "final_cta" },
  "clickNext": { "enabled": true, "target": "final_cta" }
}
```

---

### Screen 4 - Final CTA with Caption Result

**Purpose**

Màn cuối giữ best caption là main content.

**Layout**

```txt
Top: Result ready badge
Middle: Best caption card large
Bottom: CTA button + benefit chips
```

**Main content type**

```txt
Text result / caption card.
```

**Content sample**

```txt
Headline:
Your next viral caption is ready.

Best caption:
POV: you found your 3PM energy fix 🍵⚡

Benefit chips:
- More tones
- More products
- More caption styles

CTA:
Generate More Captions
```

**Image / visual**

```txt
Product mockup behind caption card.
Caption card floats above product image.
```

**Animation**

```txt
Caption card glow.
Sparkle burst around best caption.
CTA pulse ring.
Arrow points to CTA.
```

**CTA action**

```txt
Click CTA -> {{appStoreUrl}}
```

---

## Scenario 2B - Rewrite Weak Copy

### Screen 1 - Before Copy

**Purpose**

Tạo pain point: copy hiện tại yếu.

**Layout**

```txt
Top: Problem headline
Middle: Before copy card
Bottom: Score meter
```

**Content sample**

```txt
Headline:
This copy sounds too generic.

Before:
Our product is good and helps you work faster.

Score:
42/100
```

**Image / visual**

```txt
Document card.
Warning icon.
Score meter.
```

**Animation**

```txt
Score meter counts from 0 to 42.
Warning icon shakes slightly.
Weak words highlight.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 3500, "target": "ai_rewrite" },
  "clickNext": { "enabled": true, "target": "ai_rewrite" }
}
```

---

### Screen 2 - AI Rewrite Stream

**Purpose**

Show AI cải thiện copy và giải thích.

**Layout**

```txt
Top: AI rewriting label
Middle: Improved copy stream
Bottom: Improvement checklist
```

**Content sample**

```txt
Improved version:
Boost your workflow with a tool designed to help you move faster, stay focused, and get more done in less time.

What improved:
[x] Clearer benefit
[x] Stronger verb
[x] More specific value
[x] Better conversion tone
```

**Image / visual**

```txt
Pen sparkle icon.
Text document preview.
```

**Animation**

```txt
Improved text typewriter.
Checklist ticks.
Improved copy card glows green.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 4000, "target": "final_cta" },
  "clickNext": { "enabled": true, "target": "final_cta" }
}
```

---

### Screen 3 - Final CTA with Before/After Copy

**Purpose**

Màn cuối dùng before/after copy làm main content.

**Layout**

```txt
Top: “Copy improved”
Middle: Before/After text card
Bottom: CTA unlock
```

**Main content type**

```txt
Text before/after result.
```

**Content sample**

```txt
Headline:
Your copy is now stronger.

Before:
Our product is good and helps you work faster.

After:
Boost your workflow with a tool designed to help you move faster, stay focused, and get more done in less time.

CTA:
Rewrite More In App
```

**Image / visual**

```txt
Before/after split text card.
Unlock badge.
```

**Animation**

```txt
Before card fades back.
After card glows forward.
Lock opens.
CTA bounce then pulse.
```

**CTA action**

```txt
Click CTA -> {{appStoreUrl}}
```

---

# 6. USER CASE 03 - AI Image Generator / Editor

## Scenario 3A - Text To Image

### Screen 1 - Prompt Input

**Purpose**

Show user chỉ cần nhập prompt.

**Layout**

```txt
Top: Headline
Middle: Prompt input
Bottom: Style chips
```

**Content sample**

```txt
Headline:
Create images from words.

Prompt:
A futuristic café with neon lights

Style:
Cinematic / Vibrant / 3D
```

**Image / visual**

```txt
Empty canvas placeholder.
Prompt box.
Style chips.
```

**Animation**

```txt
Prompt auto typing.
Style chips pop-in.
Canvas shimmer.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 3500, "target": "ai_rendering" },
  "clickNext": { "enabled": true, "target": "ai_rendering" }
}
```

---

### Screen 2 - AI Rendering

**Purpose**

Tạo suspense trước khi reveal ảnh.

**Layout**

```txt
Top: Rendering label
Middle: Blurred canvas
Bottom: Progress checklist
```

**Content sample**

```txt
Rendering your image...

[x] Understanding prompt
[x] Building composition
[ ] Adding lighting
[ ] Finalizing details
```

**Image / visual**

```txt
Blurred image preview.
Magic brush icon.
```

**Animation**

```txt
Canvas blur becomes clearer.
Progress bar moves.
Light scan over canvas.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 4000, "target": "image_gallery" },
  "clickNext": { "enabled": true, "target": "image_gallery" }
}
```

---

### Screen 3 - Image Gallery Result

**Purpose**

Show nhiều kết quả ảnh để tạo wow moment.

**Layout**

```txt
Top: “4 images ready”
Middle: 2x2 gallery
Bottom: Selected image hint
```

**Content sample**

```txt
Result styles:
- Neon Café
- Cozy Cyberpunk
- Cinematic Night
- Futuristic Interior
```

**Image / visual**

```txt
4 ảnh AI generated về futuristic café.
Ảnh nên có contrast cao, neon rõ, hợp mobile.
```

**Animation**

```txt
Hero image reveal by mask wipe.
Small images fade in by grid.
Selected image gets glow border.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 3500, "target": "final_cta" },
  "clickNext": { "enabled": true, "target": "final_cta" }
}
```

---

### Screen 4 - Final CTA with Image Result

**Purpose**

Màn cuối dùng ảnh AI generated làm main content.

**Layout**

```txt
Background: selected generated image full-screen
Overlay: dark gradient
Bottom: floating CTA pill
```

**Main content type**

```txt
Image result.
```

**Content sample**

```txt
Headline:
Create your own AI image.

Subtext:
Turn any idea into a stunning visual.

CTA:
Generate My Image
```

**Image / visual**

```txt
Generated image đẹp nhất full-screen.
CTA nổi trên overlay gradient.
```

**Animation**

```txt
Image zoom-in slowly.
Floating CTA pill bounces gently.
Hand swipe / arrow lottie points to CTA.
Sparkle around headline.
```

**CTA action**

```txt
Click CTA -> {{appStoreUrl}}
```

---

## Scenario 3B - Before / After Photo Fix

### Screen 1 - Problem Photo

**Purpose**

Show ảnh đầu vào xấu/mờ để tạo nhu cầu.

**Layout**

```txt
Top: Problem headline
Middle: Blurry photo card
Bottom: Tap to enhance
```

**Content sample**

```txt
Headline:
Blurry photo?

Subtext:
Fix it with one tap.
```

**Image / visual**

```txt
Ảnh chân dung hoặc sản phẩm bị mờ.
Label “Before”.
```

**Animation**

```txt
Blur photo shakes slightly.
Enhance button glows.
Tap hint pulses.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 3500, "target": "ai_enhancing" },
  "clickNext": { "enabled": true, "target": "ai_enhancing" }
}
```

---

### Screen 2 - AI Enhancing

**Purpose**

Show AI đang cải thiện ảnh.

**Layout**

```txt
Middle: Same photo with scanning overlay
Bottom: Enhancement checklist
```

**Content sample**

```txt
AI is enhancing...

[x] Sharpening details
[x] Fixing lighting
[ ] Improving contrast
[ ] Cleaning noise
```

**Image / visual**

```txt
Ảnh before với scan line chạy qua.
```

**Animation**

```txt
Scan line moves top to bottom.
Checklist ticks.
Photo becomes clearer over time.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 3500, "target": "final_cta" },
  "clickNext": { "enabled": true, "target": "final_cta" }
}
```

---

### Screen 3 - Final CTA with Before/After Result

**Purpose**

Màn cuối giữ before/after là main content để user thấy giá trị.

**Layout**

```txt
Top: Headline
Middle: Large before/after comparison
Bottom: CTA
```

**Main content type**

```txt
Image before/after result.
```

**Content sample**

```txt
Headline:
Your photo looks clearer.

Feature chips:
- Sharper
- Brighter
- Cleaner

CTA:
Enhance My Photo
```

**Image / visual**

```txt
Before/after card lớn.
After side phải sáng, rõ, khác biệt mạnh.
```

**Animation**

```txt
Before/after slider loops slowly.
CTA glow pulse.
Checkmark burst near “After”.
```

**CTA action**

```txt
Click CTA -> {{appStoreUrl}}
```

---

# 7. USER CASE 04 - AI Video Generator

## Scenario 4A - Product To Video Ad

### Screen 1 - Product Brief

**Purpose**

Show user chỉ cần nhập sản phẩm là có video ad.

**Layout**

```txt
Top: Headline
Middle: Product card + brief
Bottom: Generate video button
```

**Content sample**

```txt
Headline:
Turn any product into a video ad.

Product:
Matcha Energy Drink

Goal:
Make a 10-second TikTok ad
```

**Image / visual**

```txt
Product image.
Mini video frame placeholder.
```

**Animation**

```txt
Product card slide-in.
Brief fields auto-fill.
Generate button glow.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 3500, "target": "ai_storyboard" },
  "clickNext": { "enabled": true, "target": "ai_storyboard" }
}
```

---

### Screen 2 - AI Storyboard

**Purpose**

Show AI đang tạo cấu trúc video.

**Layout**

```txt
Top: “AI builds your video”
Middle: 3 storyboard cards
Bottom: Progress line
```

**Content sample**

```txt
Scene 1:
Hook with product close-up

Scene 2:
Show energy benefit

Scene 3:
CTA with product packshot
```

**Image / visual**

```txt
3 storyboard thumbnails:
- close-up product
- lifestyle shot
- CTA packshot
```

**Animation**

```txt
Storyboard cards appear one by one.
Progress line connects scenes.
Loading dots on final scene.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 4000, "target": "final_cta" },
  "clickNext": { "enabled": true, "target": "final_cta" }
}
```

---

### Screen 3 - Final CTA with Video Preview Result

**Purpose**

Màn cuối dùng video preview/storyboard làm main content.

**Layout**

```txt
Top: Video ready badge
Middle: Vertical video preview card
Bottom: CTA button
```

**Main content type**

```txt
Video preview / storyboard result.
```

**Content sample**

```txt
Headline:
Your video ad is ready.

Video overlay:
10s product ad generated

Scene chips:
- Hook
- Benefit
- CTA

CTA:
Create My Video
```

**Image / visual**

```txt
Vertical video poster.
Play icon lớn.
Storyboard mini frames bên dưới.
```

**Animation**

```txt
Play icon pulse.
Video frame glow.
Storyboard frames slide loop.
CTA bounce + glow.
```

**CTA action**

```txt
Click CTA -> {{appStoreUrl}}
```

---

# 8. USER CASE 05 - AI Resume Builder

## Scenario 5A - Resume Review

### Screen 1 - Upload Resume

**Purpose**

Tạo vấn đề: CV cần được review.

**Layout**

```txt
Top: Headline
Middle: Resume document preview
Bottom: Upload/check button
```

**Content sample**

```txt
Headline:
Is your resume strong enough?

Subtext:
AI can review it in seconds.
```

**Image / visual**

```txt
Resume document mockup.
Upload icon.
```

**Animation**

```txt
Resume card drop-in.
Scan border runs around document.
Button pulse.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 3500, "target": "ai_reviewing" },
  "clickNext": { "enabled": true, "target": "ai_reviewing" }
}
```

---

### Screen 2 - AI Reviewing

**Purpose**

Show AI đang phân tích CV.

**Layout**

```txt
Middle: Resume scan animation
Bottom: Review checklist
```

**Content sample**

```txt
AI is reviewing...

[x] Checking summary
[x] Scanning skills
[ ] Finding weak bullets
[ ] Suggesting improvements
```

**Image / visual**

```txt
Resume preview với highlighted lines.
```

**Animation**

```txt
Line scanner moves top to bottom.
Checklist ticks.
Score meter loading.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 3500, "target": "review_result" },
  "clickNext": { "enabled": true, "target": "review_result" }
}
```

---

### Screen 3 - Review Result

**Purpose**

Show insight cụ thể.

**Layout**

```txt
Top: Resume score
Middle: Issue cards
Bottom: Improved bullet preview
```

**Content sample**

```txt
Resume Score:
74/100

Issues found:
- Summary is too generic
- Skills need better grouping
- Missing impact numbers

Before:
Built web pages for company website.

After:
Built and optimized high-traffic pages, improving load speed by 28%.
```

**Image / visual**

```txt
Score meter.
Issue cards.
Before/after bullet card.
```

**Animation**

```txt
Score counts up to 74.
Issue cards fade-up.
After bullet glows.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 4000, "target": "final_cta" },
  "clickNext": { "enabled": true, "target": "final_cta" }
}
```

---

### Screen 4 - Final CTA with Resume Result

**Purpose**

Màn cuối dùng score + improved bullet làm main content.

**Layout**

```txt
Top: Large score meter
Middle: Improved bullet card
Bottom: CTA
```

**Main content type**

```txt
Resume review report / text result.
```

**Content sample**

```txt
Headline:
Your resume can be stronger.

Score:
74 → Improve to 90+

Best improvement:
Built and optimized high-traffic pages, improving load speed by 28%.

CTA:
Improve My Resume
```

**Image / visual**

```txt
Resume document preview behind score.
Large score meter.
```

**Animation**

```txt
Score meter previews 74 to 90+.
CTA pulse.
Success check lottie.
```

**CTA action**

```txt
Click CTA -> {{appStoreUrl}}
```

---

# 9. USER CASE 06 - AI Tutor / Learning App

## Scenario 6A - Quick Quiz With Explanation

### Screen 1 - Quick Question

**Purpose**

Tạo tương tác nhanh bằng quiz.

**Layout**

```txt
Top: Topic badge
Middle: Question card
Bottom: 4 option buttons
```

**Content sample**

```txt
Question:
What is the capital of Canada?

Options:
- Toronto
- Vancouver
- Ottawa
- Montreal
```

**Image / visual**

```txt
Map icon hoặc flag icon.
Quiz card.
```

**Animation**

```txt
Question card pop-in.
Options stagger.
Default option pulse.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 4000, "defaultSelection": "Ottawa", "target": "ai_explanation" },
  "clickNext": { "enabled": true, "target": "ai_explanation" }
}
```

---

### Screen 2 - AI Explanation

**Purpose**

Show AI không chỉ cho đáp án mà còn giải thích.

**Layout**

```txt
Top: Correct answer
Middle: Explanation text
Bottom: Memory checklist
```

**Content sample**

```txt
Correct answer:
Ottawa

Why?
Ottawa is the capital of Canada, while Toronto is the largest city.

Remember:
[x] Ottawa = capital
[x] Toronto = largest city
[x] Vancouver = west coast city
```

**Image / visual**

```txt
Small Canada map card.
Check icons.
```

**Animation**

```txt
Correct answer highlight green.
Explanation stream.
Checklist ticks.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 4000, "target": "final_cta" },
  "clickNext": { "enabled": true, "target": "final_cta" }
}
```

---

### Screen 3 - Final CTA with Lesson Result

**Purpose**

Màn cuối dùng lesson summary làm main content.

**Layout**

```txt
Top: Reward badge
Middle: Lesson summary card
Bottom: CTA
```

**Main content type**

```txt
Quiz answer + explanation + learning progress.
```

**Content sample**

```txt
Headline:
You learned something new.

Lesson card:
Ottawa = Capital of Canada
Toronto = Largest city

Reward:
+1 Geography Skill

CTA:
Keep Learning
```

**Image / visual**

```txt
Reward coin / skill badge.
Map mini card.
```

**Animation**

```txt
Coin reward burst.
Lesson card glow.
CTA bounce nhẹ.
```

**CTA action**

```txt
Click CTA -> {{appStoreUrl}}
```

---

# 10. USER CASE 07 - AI Travel Planner

## Scenario 7A - 3-Day Itinerary

### Screen 1 - Destination Input

**Purpose**

Show user nhập điểm đến và số ngày.

**Layout**

```txt
Top: Travel headline
Middle: Destination input
Bottom: Generate itinerary button
```

**Content sample**

```txt
Headline:
Plan your trip in seconds.

Destination:
Tokyo

Duration:
3 days
```

**Image / visual**

```txt
Ảnh Tokyo skyline / temple / street food.
Map pin icon.
```

**Animation**

```txt
Destination typing.
Map pin bounce.
Button glow.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 3500, "target": "ai_itinerary" },
  "clickNext": { "enabled": true, "target": "ai_itinerary" }
}
```

---

### Screen 2 - AI Itinerary Stream

**Purpose**

Show AI tạo lịch trình có cấu trúc.

**Layout**

```txt
Top: “Tokyo 3-day plan”
Middle: Day cards stream
Bottom: Progress route line
```

**Content sample**

```txt
Day 1:
Shibuya crossing, Harajuku, ramen dinner

Day 2:
Asakusa temple, Ueno park, sushi night

Day 3:
TeamLab, shopping, night view

Tips:
- Start early
- Book popular spots
- Use train pass
```

**Image / visual**

```txt
Mini place thumbnails:
Shibuya, temple, sushi, city night.
```

**Animation**

```txt
Day cards slide-up.
Route line draws between cards.
Place thumbnails fade-in.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 4000, "target": "final_cta" },
  "clickNext": { "enabled": true, "target": "final_cta" }
}
```

---

### Screen 3 - Final CTA with Itinerary Result

**Purpose**

Màn cuối dùng itinerary làm main content.

**Layout**

```txt
Top: Destination hero image
Middle: 3-day itinerary card
Bottom: Floating CTA
```

**Main content type**

```txt
Travel itinerary / place cards.
```

**Content sample**

```txt
Headline:
Your Tokyo trip is planned.

Itinerary:
Day 1: Shibuya + Harajuku
Day 2: Asakusa + Ueno
Day 3: TeamLab + night view

CTA:
Get Full Itinerary
```

**Image / visual**

```txt
Tokyo hero image.
Small map route background.
```

**Animation**

```txt
Map pin bounce.
Route line draw.
Floating CTA pill pulse.
Suitcase pop lottie near CTA.
```

**CTA action**

```txt
Click CTA -> {{appStoreUrl}}
```

---

# 11. USER CASE 08 - AI Finance / Budget Planner

## Scenario 8A - Monthly Budget Plan

### Screen 1 - Income Input

**Purpose**

Show user nhập income để AI tạo budget.

**Layout**

```txt
Top: Headline
Middle: Income input card
Bottom: Goal chip
```

**Content sample**

```txt
Headline:
Plan your monthly budget.

Income:
$2,500/month

Goal:
Save more without stress
```

**Image / visual**

```txt
Wallet icon.
Money card UI.
```

**Animation**

```txt
Number count-up to 2500.
Wallet icon pulse.
Category chips pop-in.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 3500, "target": "ai_budget_breakdown" },
  "clickNext": { "enabled": true, "target": "ai_budget_breakdown" }
}
```

---

### Screen 2 - AI Budget Breakdown

**Purpose**

Show AI phân bổ tiền thành categories.

**Layout**

```txt
Top: “AI budget breakdown”
Middle: Allocation cards
Bottom: Mini chart
```

**Content sample**

```txt
Suggested budget:
- Essentials: $1,250
- Savings: $500
- Food: $350
- Fun: $200
- Emergency fund: $200

Quick insight:
You can save $500/month with this plan.
```

**Image / visual**

```txt
Pie chart mini.
Budget category icons.
```

**Animation**

```txt
Numbers count-up.
Pie chart segments draw.
Cards fade-up.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 4000, "target": "final_cta" },
  "clickNext": { "enabled": true, "target": "final_cta" }
}
```

---

### Screen 3 - Final CTA with Budget Dashboard Result

**Purpose**

Màn cuối dùng budget dashboard làm main content.

**Layout**

```txt
Top: Big savings number
Middle: Budget chart + category cards
Bottom: CTA
```

**Main content type**

```txt
Budget dashboard / finance report.
```

**Content sample**

```txt
Headline:
Your budget is ready.

Main result:
Save $500/month

Breakdown:
- Essentials: $1,250
- Savings: $500
- Food: $350

CTA:
Create My Budget
```

**Image / visual**

```txt
Mini dashboard với chart.
Coin / wallet icon.
```

**Animation**

```txt
Savings number count-up.
Chart draws.
CTA glow border.
Coin burst lottie.
```

**CTA action**

```txt
Click CTA -> {{appStoreUrl}}
```

---

# 12. USER CASE 09 - AI Agent / Automation

## Scenario 9A - Delegate A Task

### Screen 1 - Task Input

**Purpose**

Show user có thể giao việc cho AI agent.

**Layout**

```txt
Top: Headline
Middle: Task input
Bottom: Run agent button
```

**Content sample**

```txt
Headline:
Delegate work to AI.

Task:
Create a weekly content plan

Button:
Run AI Agent
```

**Image / visual**

```txt
Task input UI.
Small robot/agent avatar.
```

**Animation**

```txt
Task text type-in.
Agent avatar wakes up.
Button glow.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 3500, "target": "agent_steps" },
  "clickNext": { "enabled": true, "target": "agent_steps" }
}
```

---

### Screen 2 - Agent Step Runner

**Purpose**

Show AI agent làm nhiều bước, tạo cảm giác powerful.

**Layout**

```txt
Top: Agent status
Middle: Step timeline
Bottom: Progress bar
```

**Content sample**

```txt
Agent is working...

[x] Understand campaign goal
[x] Generate topic ideas
[ ] Organize weekly calendar
[ ] Write post outlines
```

**Image / visual**

```txt
Agent avatar.
Timeline with nodes.
```

**Animation**

```txt
Timeline node active one by one.
Progress bar moves.
Agent avatar pulses on each step.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 4000, "target": "agent_output" },
  "clickNext": { "enabled": true, "target": "agent_output" }
}
```

---

### Screen 3 - Agent Output Cards

**Purpose**

Show output cụ thể từ agent.

**Layout**

```txt
Top: “Content plan ready”
Middle: Weekly cards
Bottom: KPI checklist
```

**Content sample**

```txt
Monday:
Educational post — “3 ways AI saves time”

Wednesday:
Product demo — “From idea to caption”

Friday:
Customer story — “How creators use AI”

KPI checklist:
[x] Hook included
[x] CTA included
[x] Platform fit
```

**Image / visual**

```txt
Weekly calendar cards.
Social post thumbnails.
```

**Animation**

```txt
Cards slide-in by day.
KPI checklist ticks.
Calendar grid highlights.
```

**Transition**

```json
{
  "autoNext": { "enabled": true, "afterMs": 4000, "target": "final_cta" },
  "clickNext": { "enabled": true, "target": "final_cta" }
}
```

---

### Screen 4 - Final CTA with Agent Output

**Purpose**

Màn cuối dùng content plan làm main content.

**Layout**

```txt
Top: 100% task complete
Middle: Generated weekly content plan
Bottom: CTA
```

**Main content type**

```txt
Agent output cards / task result.
```

**Content sample**

```txt
Headline:
Your weekly plan is ready.

Generated plan:
- Monday: Educational post
- Wednesday: Product demo
- Friday: Customer story

CTA:
Automate With AI
```

**Image / visual**

```txt
Agent complete badge.
Calendar cards.
```

**Animation**

```txt
Progress reaches 100%.
Confetti small burst.
CTA pulse ring.
Robot checkmark lottie.
```

**CTA action**

```txt
Click CTA -> {{appStoreUrl}}
```

---

# 13. Implementation JSON Structure

## 13.1 Screen JSON

```json
{
  "id": "screen_id",
  "purpose": "Why this screen exists",
  "type": "hook | question | processing | result | cta",
  "layout": "chat | card-list | gallery | dashboard | before-after | video-preview",
  "content": {
    "headline": "Main headline",
    "body": "Main text",
    "items": []
  },
  "visual": {
    "assetType": "image | icon | video | lottie | illustration",
    "description": "What the asset should show"
  },
  "animation": {
    "description": "Describe motion, timing, attention focus"
  },
  "transition": {
    "autoNext": {
      "enabled": true,
      "afterMs": 3500,
      "target": "next_screen"
    },
    "clickNext": {
      "enabled": true,
      "target": "next_screen"
    }
  }
}
```

---

## 13.2 Final CTA JSON

```json
{
  "id": "final_cta",
  "type": "cta",
  "layout": "result-hero-bottom-button",
  "mainContent": {
    "type": "text | image | video | dashboard | cards | checklist | before-after",
    "description": "The AI result must be the main visible content",
    "content": {}
  },
  "cta": {
    "text": "Try Free",
    "url": "{{appStoreUrl}}",
    "animation": "glow pulse with arrow attention"
  }
}
```

---

# 14. Build Priority

Nên build trước các scenario sau:

```txt
1. AI Chat Assistant - Ask Anything
2. AI Writing - Generate 3 Captions
3. AI Writing - Rewrite Weak Copy
4. AI Image - Text To Image
5. AI Image - Before/After Photo Fix
6. AI Video - Product To Video Ad
7. AI Resume - Resume Review
8. AI Tutor - Quick Quiz
9. AI Travel - 3-Day Itinerary
10. AI Finance - Monthly Budget
11. AI Agent - Delegate Task
```

---

# 15. Final Principle

Playable tốt không phải:

```txt
Hook -> Button
```

Playable tốt nên là:

```txt
Hook
→ Small interaction
→ AI processing
→ Meaningful AI result
→ Final screen with result as main content
→ Strong CTA to App Store
```

Marketing nên mô tả:

```txt
User problem
Desired AI result
Content type: text / image / video / dashboard / checklist
Screen flow
CTA style
```

Claude nên convert thành:

```txt
scenario.json
screens.json
content blocks
visual asset descriptions
animations
transition rules
final CTA layout
```
