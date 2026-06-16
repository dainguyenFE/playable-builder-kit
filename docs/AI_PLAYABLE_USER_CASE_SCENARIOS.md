# AI_PLAYABLE_USER_CASE_SCENARIOS.md

# AI Playable Ads - User Cases & Scenario Library

## 1. Mục tiêu

Tài liệu này tổng hợp các **user case / feature phổ biến của AI** để dùng làm nguồn ý tưởng cho **playable ads**.

Mỗi **user case** nên có từ **2-5 kịch bản**.  
Mỗi **kịch bản** nên có từ **2-5 screen**.  
Screen cuối cùng luôn là **CTA** và khi click sẽ mở:

```txt
{{appStoreUrl}}
```

Tài liệu này ưu tiên các dạng playable cho sản phẩm AI mobile app, với nội dung:

- đa dạng layout
- đa dạng flow
- có hỏi đáp / quick question / quiz
- có AI streaming content
- có list / card / image / checkpoint / checklist
- có CTA đa dạng và bắt mắt
- có gợi ý dùng **Lottie JSON animation** cho CTA

---

# 2. Quy chuẩn chung cho mọi kịch bản

## 2.1 Số lượng screen

- Mỗi kịch bản: **2-5 screen**
- Screen cuối: **CTA screen**
- Tổng thời lượng khuyến nghị: **8s - 25s**

## 2.2 Loại layout nên đa dạng

Nên mix nhiều layout khác nhau:

- Chat layout
- Quiz / question layout
- Card list layout
- Dashboard layout
- Before / after layout
- Checklist layout
- Carousel / swipe layout
- Split screen layout
- Image + result layout
- Agent workflow layout

## 2.3 Loại AI response nên có

AI response không nên chỉ là 1 đoạn text ngắn.  
Nên có response đủ dài và đủ chi tiết, và có thể stream dần theo thời gian.

Thành phần response nên bao gồm:

- Title
- Subtitle
- Paragraph
- Bullet list
- Checklist
- Step list
- Cards
- Tags / chips
- Progress line
- Checkpoints
- Inline image / thumbnail
- Recommendation blocks
- Summary box
- Warning / tip box

## 2.4 CTA rules

Mỗi kịch bản nên có CTA khác nhau về cách hiển thị:

- sticky button
- floating CTA pill
- full-width bottom CTA
- card CTA
- modal CTA
- progress-complete CTA
- pulse CTA
- bounce CTA
- sparkle CTA
- swipe-to-install CTA
- reward CTA

CTA text ví dụ:

- Try Free
- Get Started
- Install Now
- Generate Now
- Create Your Plan
- Build My Resume
- Start Learning
- Open App
- See Full Result
- Unlock More
- Continue in App

CTA click action:

```txt
window.open("{{appStoreUrl}}")
```

## 2.5 Gợi ý Lottie JSON cho CTA

Nên chuẩn bị 1 thư viện CTA animation reusable:

- pulse ring around button
- bouncing arrow
- sparkle burst
- confetti burst
- glow border
- swipe hand indicator
- floating stars
- loading-to-success transition
- gem reward pop
- progress complete checkmark

---

# 3. Common AI Feature User Cases

---

# USER CASE 01 - AI Chat Assistant

## Mô tả

AI chat assistant là user case phổ biến nhất.  
Phù hợp cho:

- general AI app
- AI productivity app
- AI assistant
- AI tutor
- AI customer support
- AI life assistant

## Scenario 1A - Ask & Solve

### Layout
- Screen 1: hook card
- Screen 2: chat input + AI response stream
- Screen 3: CTA

### Screen flow

#### Screen 1 - Hook
- Headline: "Need instant answers?"
- Subtitle: "Ask AI anything in seconds"
- Visual: phone frame + typing cursor
- Interaction: tap to ask question

#### Screen 2 - AI Streaming Answer
- User question bubble:
  - "How can I plan my week better?"
- AI response streams line by line:
  - short intro
  - bullet list
  - checklist
  - recommendation cards

Example streamed content:

```txt
Here’s a simple weekly plan:

1. Define 3 priorities
2. Time-block your calendar
3. Batch similar tasks
4. Add 2 focus sessions
5. Review every evening

Quick checklist:
[x] Monday priorities
[x] Calendar blocks
[x] Deep work session
[ ] Workout slot
[ ] Weekly review

Recommended tools:
- Focus Timer
- Task Board
- Habit Tracker
```

#### Screen 3 - CTA
- Full-width bottom CTA
- Text: "Get Smarter Planning"
- Lottie: pulse ring + sparkle
- Click -> App Store

## Scenario 1B - Quick Q&A Cards

### Layout
- Screen 1: question picker
- Screen 2: answer cards stream in
- Screen 3: CTA modal

### Screen flow

#### Screen 1 - Pick a question
- Quick question chips:
  - "Write better emails"
  - "Plan my day"
  - "Summarize notes"
  - "Learn faster"

#### Screen 2 - Answer Cards
- AI returns card stack:
  - Summary card
  - Checklist card
  - Tip card
  - Example card

Example streamed content:

```txt
Email improvement plan:
- Use a clearer subject line
- Keep opening under 15 words
- Add one CTA only

Checklist:
[x] Short subject
[x] Friendly tone
[x] One CTA

Example:
Subject: Quick update on tomorrow’s demo
Body: Hi team, here’s the updated plan...
```

#### Screen 3 - CTA
- Card CTA
- Text: "Continue in App"
- Lottie: glowing border around CTA card

## Scenario 1C - AI Mentor Conversation

### Layout
- Screen 1: emotional problem hook
- Screen 2: mentor chat stream
- Screen 3: milestone / checkpoint
- Screen 4: CTA

### Screen flow

#### Screen 1
- Headline: "Feeling stuck?"
- Subtitle: "Talk to your AI mentor"

#### Screen 2
- Chat layout
- User: "I keep procrastinating"
- AI response streams with empathy + action plan

Example streamed content:

```txt
That’s okay — let’s make it easier.

Mini action plan:
- Start with 5 minutes only
- Remove one distraction
- Pick one tiny goal
- Reward yourself after completion

Today’s checkpoint:
[ ] Open the task
[ ] Work for 5 min
[ ] Mark progress
```

#### Screen 3
- Progress / checkpoint screen
- 3 checkmarks animate in
- Mini badge: "You can do this"

#### Screen 4
- Sticky CTA
- Text: "Start With AI Coach"
- Lottie: checkmark burst + confetti

---

# USER CASE 02 - AI Writing / Caption Generator

## Mô tả

Phù hợp cho:

- AI writing app
- AI copywriting app
- AI caption generator
- AI social content tool
- AI email writer

## Scenario 2A - Caption Generator

### Layout
- Screen 1: product input
- Screen 2: AI typing + 3 results
- Screen 3: CTA

#### Screen 1
- Prompt box:
  - "Product: Matcha Energy Drink"
- Button: "Generate captions"

#### Screen 2
- AI streams:
  - Caption 1
  - Caption 2
  - Caption 3
- Each caption is a card with tags:
  - "Short"
  - "Funny"
  - "High-conversion"

Example content:

```txt
Caption 1:
Meet your clean energy boost 🍵⚡
No crash. Just focus, calm, and green power.

Caption 2:
Need energy without the jitters?
Try the matcha drink creators love.

Caption 3:
From sleepy to focused in one sip.
Your daily glow-up starts here.
```

#### Screen 3
- CTA: "Generate More Captions"
- Lottie: bouncing stars around button

## Scenario 2B - Rewrite Better

### Layout
- Screen 1: before text
- Screen 2: rewritten text + checklist
- Screen 3: CTA

#### Screen 1
- Before block:
  - "Our product is good and helps you work faster."

#### Screen 2
- AI returns:
  - Improved version
  - Tone options
  - Checklist of improvements

Example content:

```txt
Improved version:
Boost your workflow with a tool designed to help you move faster, stay focused, and get more done in less time.

What changed:
[x] Clearer benefit
[x] Stronger wording
[x] Better flow
[x] More persuasive tone

Tone options:
- Professional
- Friendly
- Premium
```

#### Screen 3
- CTA card
- Text: "Rewrite In App"
- Lottie: progress-to-success check

## Scenario 2C - Email Writer

### Layout
- Screen 1: choose email goal
- Screen 2: AI email stream
- Screen 3: CTA footer

#### Screen 1
- Quick options:
  - "Sales email"
  - "Follow-up email"
  - "Apology email"
  - "Partnership email"

#### Screen 2
- AI email streamed with sections:
  - Subject
  - Greeting
  - Body
  - CTA
- Side chips:
  - concise
  - persuasive
  - polite

Example content:

```txt
Subject: Quick follow-up on our collaboration idea

Hi Sarah,

I wanted to follow up on my previous message regarding a potential collaboration. I believe our audiences are highly aligned, and I’d love to explore a small pilot campaign together.

Key idea:
- co-branded content
- launch within 2 weeks
- measurable outcome

Let me know if you’d be open to a short call this week.
```

#### Screen 3
- Footer CTA
- Text: "Write Emails Faster"
- Lottie: swipe hand + pulse glow

---

# USER CASE 03 - AI Image Generator / Editor

## Mô tả

Phù hợp cho:

- AI image generator
- AI avatar creator
- AI photo editor
- AI background remover
- AI product photo enhancer

## Scenario 3A - Text to Image

### Layout
- Screen 1: prompt input
- Screen 2: generating state
- Screen 3: result gallery
- Screen 4: CTA

#### Screen 1
- Prompt:
  - "Generate a futuristic café with neon lights"

#### Screen 2
- AI loading animation
- Progress bar
- Streamed status:
  - "Understanding style..."
  - "Composing layout..."
  - "Rendering image..."

#### Screen 3
- 3 result image cards
- Style tags:
  - cinematic
  - vibrant
  - futuristic

#### Screen 4
- CTA: "Create Your Image"
- Lottie: sparkle burst + glow ring

## Scenario 3B - Before / After Photo Fix

### Layout
- Screen 1: upload blurry image
- Screen 2: compare result
- Screen 3: feature checklist
- Screen 4: CTA

#### Screen 1
- User uploads image
- Badge: "1 tap enhance"

#### Screen 2
- Before / after split view
- Drag slider or tap compare

#### Screen 3
- Checklist:
  - sharpened
  - brighter
  - clearer skin
  - better contrast

#### Screen 4
- CTA: "Enhance In App"
- Lottie: check burst + upward arrow

## Scenario 3C - AI Avatar Pack

### Layout
- Screen 1: choose style
- Screen 2: avatar pack result
- Screen 3: CTA

#### Screen 1
- Style cards:
  - business
  - anime
  - cyberpunk
  - luxury portrait

#### Screen 2
- AI streams result grid
- Each avatar is shown as a card
- Tips card:
  - "Use for profile picture"
  - "Use for portfolio"
  - "Use for social media"

#### Screen 3
- Floating CTA pill
- Text: "Generate My Avatars"
- Lottie: floating stars

---

# USER CASE 04 - AI Resume Builder

## Mô tả

Phù hợp cho:

- AI resume builder
- AI CV creator
- AI job application coach
- AI cover letter tool

## Scenario 4A - Build Resume Fast

### Layout
- Screen 1: choose role
- Screen 2: AI generates resume sections
- Screen 3: CTA

#### Screen 1
- Role picker:
  - Product Manager
  - Designer
  - Frontend Developer
  - Marketer

#### Screen 2
- AI streams sections:
  - Summary
  - Skills
  - Experience
  - Checklist

Example content:

```txt
Professional Summary:
Frontend Developer with 5+ years of experience building scalable web applications.

Top Skills:
- React
- Next.js
- TypeScript
- Performance Optimization

Resume Checklist:
[x] Strong summary
[x] Relevant skills
[x] Quantified impact
[ ] Portfolio link
```

#### Screen 3
- CTA: "Build My Resume"
- Lottie: paper fly + glow

## Scenario 4B - Resume Review

### Layout
- Screen 1: upload resume
- Screen 2: AI score + issue list
- Screen 3: improved bullets
- Screen 4: CTA

#### Screen 1
- Upload CV

#### Screen 2
- Score card: 74/100
- Issues list:
  - weak summary
  - too generic skills
  - missing impact numbers

#### Screen 3
- Improved bullet cards

Example content:

```txt
Before:
Built web pages for company website.

After:
Built and optimized high-traffic web pages, improving load speed by 28% and increasing conversion by 12%.
```

#### Screen 4
- CTA: "Improve Resume Now"
- Lottie: score needle + success check

## Scenario 4C - Cover Letter Helper

### Layout
- Screen 1: job description snapshot
- Screen 2: AI cover letter stream
- Screen 3: CTA

#### Screen 1
- Highlight job role + requirements

#### Screen 2
- AI streams:
  - opening paragraph
  - fit summary
  - bullet strengths
  - closing

#### Screen 3
- Bottom CTA
- Text: "Generate Cover Letter"
- Lottie: bounce arrow

---

# USER CASE 05 - AI Tutor / Learning App

## Mô tả

Phù hợp cho:

- AI tutor
- AI language app
- AI quiz app
- AI study planner
- AI homework assistant

## Scenario 5A - Quick Quiz

### Layout
- Screen 1: question
- Screen 2: answer explanation
- Screen 3: CTA

#### Screen 1
- Quick question:
  - "What is the capital of Canada?"
- Options:
  - Toronto
  - Vancouver
  - Ottawa
  - Montreal

#### Screen 2
- AI reveals answer + explanation
- Mini fact card
- Memory checklist

Example content:

```txt
Correct answer: Ottawa

Why?
Ottawa is the capital of Canada, while Toronto is the largest city.

Remember:
[x] Ottawa = capital
[x] Toronto = largest city
Tip:
Use “O” for Ottawa = Official capital.
```

#### Screen 3
- CTA: "Keep Learning"
- Lottie: coin reward burst

## Scenario 5B - AI Explains Anything

### Layout
- Screen 1: choose topic
- Screen 2: AI explanation stream
- Screen 3: summary cards
- Screen 4: CTA

#### Screen 1
- Topics:
  - Photosynthesis
  - Algebra
  - Grammar
  - History

#### Screen 2
- AI explanation streamed paragraph by paragraph
- Includes:
  - simple definition
  - key points
  - example

#### Screen 3
- Summary cards:
  - Key idea
  - Example
  - Checklist

#### Screen 4
- CTA: "Study With AI"
- Lottie: glowing bulb animation

## Scenario 5C - Language Practice

### Layout
- Screen 1: phrase prompt
- Screen 2: corrected answer
- Screen 3: checklist + next steps
- Screen 4: CTA

#### Screen 1
- User writes:
  - "I goed to school yesterday"

#### Screen 2
- AI correction:
  - "I went to school yesterday"
- Explanation:
  - "Go" is irregular; past tense is "went"

#### Screen 3
- Checklist:
  - irregular verb
  - past tense
  - example sentence

#### Screen 4
- CTA: "Practice Daily"
- Lottie: progress bar complete

---

# USER CASE 06 - AI Fitness / Meal Planner

## Mô tả

Phù hợp cho:

- AI meal planner
- AI calorie tracker
- AI fitness coach
- AI wellness app

## Scenario 6A - Build My Meal Plan

### Layout
- Screen 1: choose goal
- Screen 2: AI meal plan stream
- Screen 3: checklist
- Screen 4: CTA

#### Screen 1
- Goal options:
  - lose weight
  - gain muscle
  - eat healthier
  - high protein

#### Screen 2
- AI streams plan:
  - breakfast
  - lunch
  - dinner
  - snacks
- Card layout

Example content:

```txt
Breakfast:
Greek yogurt + berries + granola

Lunch:
Chicken rice bowl with vegetables

Dinner:
Salmon, sweet potato, green beans

Daily checklist:
[x] Protein in each meal
[x] Fiber source
[x] Water target
```

#### Screen 3
- Healthy habits checklist
- 4 checkpoints animate in

#### Screen 4
- CTA: "Get My Full Plan"
- Lottie: healthy sparkle + arrow

## Scenario 6B - Workout Generator

### Layout
- Screen 1: ask fitness level
- Screen 2: AI routine stream
- Screen 3: progress / reward
- Screen 4: CTA

#### Screen 1
- Beginner / Intermediate / Advanced

#### Screen 2
- AI streams:
  - warmup
  - workout steps
  - rest time
  - tips

#### Screen 3
- Progress bar + badge:
  - "7-day plan ready"

#### Screen 4
- CTA: "Start Training"
- Lottie: flame pulse

## Scenario 6C - Quick Nutrition Q&A

### Layout
- Screen 1: quick question
- Screen 2: AI answer cards
- Screen 3: CTA

#### Screen 1
- "What should I eat after a workout?"

#### Screen 2
- AI answer in cards:
  - best foods
  - what to avoid
  - ideal timing
  - checklist

#### Screen 3
- Floating CTA
- Text: "Ask More In App"
- Lottie: chat sparkle

---

# USER CASE 07 - AI Travel Planner

## Mô tả

Phù hợp cho:

- AI travel planning
- itinerary builder
- local recommendation app
- trip assistant

## Scenario 7A - 3-Day Itinerary

### Layout
- Screen 1: destination input
- Screen 2: itinerary stream
- Screen 3: map / places cards
- Screen 4: CTA

#### Screen 1
- Input: "Tokyo, 3 days"

#### Screen 2
- AI streams itinerary:
  - Day 1
  - Day 2
  - Day 3

#### Screen 3
- Place cards:
  - food
  - sightseeing
  - shopping
  - photo spots

#### Screen 4
- CTA: "Plan My Trip"
- Lottie: location pin bounce

## Scenario 7B - Quick Travel Quiz

### Layout
- Screen 1: choose travel style
- Screen 2: AI recommendations
- Screen 3: CTA

#### Screen 1
- Style options:
  - budget
  - luxury
  - foodie
  - family

#### Screen 2
- AI gives recommendation cards:
  - hotel style
  - transport tips
  - must-do activity
  - checklist

#### Screen 3
- CTA: "Get Full Itinerary"
- Lottie: suitcase pop

## Scenario 7C - Travel Assistant Chat

### Layout
- Screen 1: ask travel question
- Screen 2: AI answer stream
- Screen 3: CTA

#### Screen 1
- User asks:
  - "What should I pack for Bali in July?"

#### Screen 2
- AI answer includes:
  - essentials checklist
  - weather note
  - tip box
  - image thumbnails for outfit ideas

#### Screen 3
- CTA: "Ask AI Travel Guide"
- Lottie: beach sparkle

---

# USER CASE 08 - AI Finance / Budget Planner

## Mô tả

Phù hợp cho:

- budgeting app
- finance coach
- spending planner
- saving goal assistant

## Scenario 8A - Monthly Budget Plan

### Layout
- Screen 1: income input
- Screen 2: AI budget breakdown
- Screen 3: checklist
- Screen 4: CTA

#### Screen 1
- Input:
  - income: $2500

#### Screen 2
- AI streams allocation:
  - essentials
  - savings
  - fun
  - emergency fund
- Pie-style summary cards

#### Screen 3
- Checklist:
  - savings target
  - spending cap
  - recurring bills
  - emergency goal

#### Screen 4
- CTA: "Create My Budget"
- Lottie: wallet pulse

## Scenario 8B - Spending Review

### Layout
- Screen 1: connect spending categories
- Screen 2: AI insight cards
- Screen 3: CTA

#### Screen 1
- Categories:
  - food
  - transport
  - shopping
  - subscriptions

#### Screen 2
- AI returns insights:
  - biggest spend area
  - quick savings idea
  - weekly challenge
  - recommendation checklist

#### Screen 3
- CTA: "See Full Insights"
- Lottie: upward graph glow

## Scenario 8C - Savings Goal Coach

### Layout
- Screen 1: choose goal
- Screen 2: AI savings plan
- Screen 3: milestone tracker
- Screen 4: CTA

#### Screen 1
- Goal:
  - new phone
  - emergency fund
  - vacation
  - laptop

#### Screen 2
- AI plan:
  - monthly target
  - cut suggestions
  - checkpoint list

#### Screen 3
- Milestone progress:
  - 25%
  - 50%
  - 75%
  - complete

#### Screen 4
- CTA: "Start Saving"
- Lottie: coin stack burst

---

# USER CASE 09 - AI Agent / Automation

## Mô tả

Phù hợp cho:

- AI agent
- AI workflow automation
- AI business assistant
- task automation app

## Scenario 9A - Delegate a Task

### Layout
- Screen 1: task input
- Screen 2: agent plan stream
- Screen 3: task output cards
- Screen 4: CTA

#### Screen 1
- User task:
  - "Create a weekly content plan"

#### Screen 2
- Agent streams steps:
  - understand goal
  - research ideas
  - organize topics
  - build calendar

#### Screen 3
- Output cards:
  - Monday idea
  - Wednesday idea
  - Friday idea
  - KPI checklist

#### Screen 4
- CTA: "Automate With AI"
- Lottie: robot pulse + checkmark

## Scenario 9B - Multi-Step Workflow

### Layout
- Screen 1: choose workflow
- Screen 2: step runner
- Screen 3: result summary
- Screen 4: CTA

#### Screen 1
- Options:
  - summarize leads
  - write outreach
  - create report
  - organize tasks

#### Screen 2
- Agent workflow visual:
  - input
  - process
  - review
  - output

#### Screen 3
- Summary with cards and checklist

#### Screen 4
- CTA: "Run This Workflow"
- Lottie: circular progress complete

---

# USER CASE 10 - AI Personal Recommendation / Quick Questions

## Mô tả

Phù hợp cho:

- recommendation apps
- quiz-based AI apps
- onboarding personalization
- AI lifestyle assistant

## Scenario 10A - 3 Quick Questions

### Layout
- Screen 1: quick question 1
- Screen 2: quick question 2
- Screen 3: AI personalized result
- Screen 4: CTA

#### Screen 1
- "What’s your goal?"
  - save time
  - learn faster
  - create content
  - stay organized

#### Screen 2
- "How much time do you have daily?"
  - 10 min
  - 20 min
  - 30 min
  - 1 hour

#### Screen 3
- AI generates a personalized recommendation
- Includes:
  - summary
  - 3 action cards
  - 1 checklist
  - 1 next step

#### Screen 4
- CTA: "Unlock My Full Plan"
- Lottie: confetti reveal

## Scenario 10B - Swipe Choice Experience

### Layout
- Screen 1: swipe card choice
- Screen 2: result cards
- Screen 3: CTA

#### Screen 1
- Swipe left / right on preference cards

#### Screen 2
- AI returns:
  - top match
  - reasons
  - checklist
  - one image card

#### Screen 3
- CTA: "See More In App"
- Lottie: swipe hand indicator

---

# 4. CTA Pattern Library

## CTA Pattern 1 - Sticky Footer CTA
- full width
- always visible
- good for direct conversion
- Lottie: glow border

## CTA Pattern 2 - Floating Pill CTA
- rounded pill
- floating above content
- Lottie: gentle pulse

## CTA Pattern 3 - Reward CTA
- after result success
- text: "Unlock Full Result"
- Lottie: confetti burst

## CTA Pattern 4 - Progress Complete CTA
- appears after 100% progress
- Lottie: checkmark complete

## CTA Pattern 5 - Swipe CTA
- user swipes or taps
- Lottie: hand swipe

## CTA Pattern 6 - Card CTA
- shows inside a content card
- good for “continue in app”
- Lottie: shimmer edge

## CTA Pattern 7 - Modal CTA
- appears after AI result
- can dim background
- Lottie: bounce entrance

---

# 5. AI Streaming Content Blocks Library

Nên chuẩn hóa các block sau để reuse trong playable:

## Text blocks
- heading
- subheading
- paragraph
- bullet list
- numbered list

## Decision blocks
- quick options
- chips
- quiz options
- yes/no cards

## Rich response blocks
- summary box
- checklist
- step card
- recommendation cards
- warning/tip box
- tag pills

## Visual blocks
- image thumbnail
- before/after comparison
- mini chart
- icon row
- avatar pack
- gallery grid

## Progress blocks
- loading state
- progress bar
- checkpoint tracker
- completion badge
- score meter

## CTA blocks
- button
- card CTA
- floating pill
- sticky footer CTA
- reward CTA

---

# 6. Gợi ý data structure cho scenario

```json
{
  "userCaseId": "ai-writing",
  "scenarioId": "caption-generator",
  "screens": [
    {
      "id": "screen_1",
      "type": "input",
      "layout": "prompt-box",
      "content": {
        "headline": "Generate better captions",
        "promptPlaceholder": "Enter your product name"
      }
    },
    {
      "id": "screen_2",
      "type": "stream-result",
      "layout": "card-list",
      "content": {
        "streamBlocks": [
          "paragraph",
          "card",
          "card",
          "checklist"
        ]
      }
    },
    {
      "id": "screen_3",
      "type": "cta",
      "layout": "sticky-footer",
      "content": {
        "ctaText": "Generate More In App",
        "ctaUrl": "{{appStoreUrl}}",
        "lottie": "pulse-ring.json"
      }
    }
  ]
}
```

---

# 7. Danh sách rút gọn để build trước

Nếu muốn build nhanh version đầu tiên, nên ưu tiên 8 flow sau:

1. AI Chat Assistant - Ask & Solve
2. AI Writing - Caption Generator
3. AI Writing - Rewrite Better
4. AI Image - Before / After Fix
5. AI Resume Builder - Resume Review
6. AI Tutor - Quick Quiz
7. AI Fitness - Meal Plan
8. AI Agent - Delegate a Task

---

# 8. Kết luận

Thư viện user case AI cho playable nên ưu tiên:

- feature phổ biến, dễ hiểu
- flow ngắn, rõ, có conversion
- AI response stream đủ dài và chi tiết
- nhiều loại layout
- nhiều loại CTA
- CTA có animation nổi bật
- screen cuối luôn dẫn về App Store

Công thức tốt nhất:

```txt
Hook
→ interaction
→ AI streaming result
→ trust / utility proof
→ CTA to App Store
```

Với mỗi user case, team có thể tiếp tục mở rộng thêm:

- more quiz variants
- more chat variants
- more visual variants
- more CTA variants
- more industry-specific content
