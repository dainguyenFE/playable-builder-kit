# AI_PLAYABLE_USER_CASE_SCENARIOS_V3_SCREEN_DETAIL.md

# AI Playable Ads - Detailed Screen-Level Scenario Library

## 0. Mục tiêu bản V3

Bản này thay thế bản `AI_PLAYABLE_USER_CASE_SCENARIOS_V2_DETAILED.md` theo hướng **chi tiết từng màn hình**, không chỉ mô tả kịch bản tổng quát.

Mỗi scenario trong tài liệu này có:

- 2-5 screen.
- Mỗi screen có mục đích rõ ràng.
- Có nội dung mẫu đủ để designer/dev/Claude có thể dựng ngay.
- Có mô tả ảnh/visual cần dùng.
- Có mô tả animation/Lottie cần dùng, không cần file cụ thể.
- Có chuyển tiếp hợp lý giữa các màn hình.
- Mỗi màn đều hỗ trợ 2 chế độ:
  - `autoNext`: tự chuyển sau 3-4 giây.
  - `clickNext`: user tap/click để chuyển ngay.
- Màn cuối là CTA nhưng **không chỉ là button**. Màn cuối phải có một **main content nổi bật** như kết quả AI, ảnh, video preview, dashboard, checklist, score, card deck, route map, plan preview, v.v.
- CTA cuối phải đa dạng, tránh lặp lại kiểu “mũi tên nhỏ + button”.

---

# 1. Screen Contract Chung

Mỗi screen nên được viết theo format này:

```txt
Screen X - Tên màn hình
Purpose:
- Mục đích của màn hình trong flow.

Layout:
- Kiểu layout chính.

Main content:
- Nội dung chính hiển thị trên màn.
- Nếu là AI result thì phải ghi rõ text/image/video/card/checklist nào.

Visual / Image:
- Ảnh cần dùng là gì.
- Nếu không cần ảnh thật thì ghi rõ dùng illustration/icon/card/mock UI.

Animation:
- Mô tả animation hoặc Lottie cần dùng.
- Không cần chỉ định file cụ thể.

Transition:
- Auto: sau 3-4s tự chuyển sang screen tiếp theo.
- Click: user tap vào vùng chính / CTA phụ / card để chuyển ngay.
```

---

# 2. Transition Rule Chung

## 2.1 Auto chuyển

Mỗi screen nên có auto transition:

```json
{
  "autoNext": {
    "enabled": true,
    "afterMs": 3500,
    "target": "next_screen"
  }
}
```

Thời lượng gợi ý:

- Hook screen: 3000ms - 3500ms
- Interaction screen: 3500ms - 4500ms
- AI loading/streaming screen: 4000ms - 6000ms
- Result screen: 4000ms - 6000ms
- Final CTA screen: không auto chuyển, chỉ click CTA ra App Store

## 2.2 Click chuyển

Mỗi screen nên cho user chủ động chuyển:

```json
{
  "clickNext": {
    "enabled": true,
    "target": "next_screen"
  }
}
```

Click target có thể là:

- tap anywhere
- tap card
- tap quick option
- tap AI result
- tap continue pill
- swipe card
- drag before/after slider

---

# 3. Final CTA Rule Mới

Màn cuối không nên chỉ là:

```txt
small arrow → button
```

Màn cuối phải có **1 điểm nổi bật lớn** để kéo mắt user.

Ví dụ:

## 3.1 Result Hero CTA

Dùng khi AI tạo text/list/checklist/report.

Main content:
- 1 result card lớn chiếm 60-70% màn hình.
- Có headline kết quả.
- Có 3-5 bullet/checklist cụ thể.
- CTA nằm dưới hoặc overlay trong card.

## 3.2 Full Image Result CTA

Dùng khi AI tạo ảnh/avatar/photo.

Main content:
- Ảnh kết quả lớn full screen.
- Có badge “AI Generated”.
- CTA dạng floating capsule hoặc bottom glass panel.

## 3.3 Video Preview CTA

Dùng khi AI tạo video/storyboard.

Main content:
- Video thumbnail hoặc 3 frame preview.
- Có play icon lớn.
- CTA dạng “Continue editing in app”.

## 3.4 Dashboard CTA

Dùng khi AI tạo insight/score/budget/travel plan.

Main content:
- Chart/score/progress/ring lớn.
- Có insight cards nhỏ.
- CTA dạng card unlock.

## 3.5 Reward Unlock CTA

Dùng khi user vừa hoàn thành quiz/checklist.

Main content:
- Badge/reward/score lớn.
- Confetti hoặc glow.
- CTA dạng unlock panel.

---

# 4. Detailed User Cases & Scenarios

---

# USER CASE 01 - AI Chat Assistant

## Scenario 1A - Ask & Solve: Weekly Planning Assistant

### Goal
Cho user cảm giác: “AI có thể trả lời ngay và biến câu hỏi mơ hồ thành plan rõ ràng”.

### Screen 1 - Problem Hook: Chaotic Week

Purpose:
- Tạo pain point nhanh: user có quá nhiều việc và không biết bắt đầu từ đâu.

Layout:
- Split layout dọc.
- Phía trên là headline lớn.
- Phía dưới là cụm sticky notes chồng lên nhau.

Main content:
- Headline: `Your week feels messy?`
- Subheadline: `Ask AI to turn chaos into a clear plan.`
- Sticky notes mẫu:
  - `Meeting notes`
  - `Gym?`
  - `Client follow-up`
  - `Finish report`
  - `Plan weekend`
- Small hint pill: `Tap to ask AI`

Visual / Image:
- Illustration người dùng nhìn lịch đầy kín.
- Background có calendar faint grid.
- Sticky notes có icon: calendar, dumbbell, email, document, coffee.

Animation:
- Sticky notes rơi vào màn hình từng cái.
- Một note đỏ rung nhẹ để thể hiện “overload”.
- Hint pill pulse nhẹ.

Transition:
- Auto: sau 3.5s chuyển sang Screen 2.
- Click: tap sticky note hoặc tap hint pill để chuyển ngay.

---

### Screen 2 - User Question Input

Purpose:
- Cho user thấy hành động rất đơn giản: chỉ cần hỏi AI.

Layout:
- Chat input layout.
- Một input box lớn ở giữa.
- Quick suggestion chips nằm dưới.

Main content:
- Input text được type dần:
  - `Help me plan my week in a simple way.`
- Quick chips:
  - `Work priorities`
  - `Workout time`
  - `Focus blocks`
  - `Weekend plan`
- Microcopy: `AI understands messy requests.`

Visual / Image:
- Không cần ảnh thật.
- Dùng mock phone keyboard ở cuối màn hình.
- Có avatar AI nhỏ ở góc input.

Animation:
- Typing cursor chạy từng chữ.
- Chips xuất hiện theo stagger.
- Avatar AI sáng lên khi typing hoàn tất.

Transition:
- Auto: sau 4s chuyển sang Screen 3.
- Click: tap input hoặc chip bất kỳ để chuyển ngay.

---

### Screen 3 - AI Streaming Plan Result

Purpose:
- Chứng minh AI không chỉ trả lời ngắn mà tạo được plan có cấu trúc.

Layout:
- Streaming result layout.
- Result hiển thị thành sections: summary, schedule, checklist, cards.

Main content:
- AI response stream mẫu:

```txt
Here is a simple weekly plan:

Top 3 priorities:
1. Finish the client report by Wednesday
2. Batch all follow-up emails on Tuesday
3. Keep Friday afternoon for review

Focus blocks:
- Mon 9:00 - 10:30: Deep work
- Tue 14:00 - 15:00: Email batch
- Wed 10:00 - 11:30: Report polish

Wellness slots:
- Tue evening: 30-min workout
- Thu morning: short walk
- Sat: reset and grocery planning

Checklist:
[x] Pick top 3 priorities
[x] Add focus blocks
[x] Reserve workout time
[ ] Review on Friday
```

Card details:
- Card 1: `Priority 1 · Client report · Wed`
- Card 2: `Focus block · 90 min · No meetings`
- Card 3: `Wellness · Workout · Tue evening`

Visual / Image:
- Small calendar preview with colored blocks.
- Icons per line: target, clock, dumbbell, checklist.

Animation:
- Text streams line by line.
- Each checklist item gets a checkmark pop.
- Calendar blocks slide in from left.

Transition:
- Auto: sau 5s chuyển sang Screen 4.
- Click: tap calendar preview hoặc result card để chuyển ngay.

---

### Screen 4 - Final CTA: Weekly Plan Preview Unlock

Purpose:
- Giữ main content là kết quả AI đã tạo, sau đó mời user mở app để lấy full plan.

Layout:
- Result Hero CTA.
- Một card lớn `Your AI Weekly Plan is ready`.
- Bên dưới là mini calendar + CTA unlock panel.

Main content:
- Title: `Your AI Weekly Plan is Ready`
- Mini calendar 5 ngày:
  - `Mon · Deep work · 9:00`
  - `Tue · Email batch · 14:00`
  - `Wed · Report finish · 10:00`
  - `Thu · Walk + admin · 8:00`
  - `Fri · Weekly review · 16:00`
- Highlight badge: `Saved 2.5 hours this week`
- CTA: `Open Full Plan`

Visual / Image:
- Mini calendar card chiếm phần lớn màn hình.
- Có avatar AI nhỏ đang cầm checklist.

Animation:
- Calendar được “build” từ các blocks rơi vào đúng ngày.
- Badge `Saved 2.5 hours` phóng to nhẹ.
- CTA panel có glow lan từ trái sang phải.

Transition:
- Không autoNext.
- Click CTA hoặc tap vào calendar hero -> mở `{{appStoreUrl}}`.

---

## Scenario 1B - Quick Q&A Cards: Better Email in 10 Seconds

### Goal
Biến một câu hỏi nhanh thành nhiều card gợi ý dễ scan.

### Screen 1 - Quick Question Picker

Purpose:
- Cho user chọn nhanh nhu cầu mà không cần nhập dài.

Layout:
- Grid 2x2 question cards.
- Header lớn ở trên.

Main content:
- Headline: `What do you want AI to fix?`
- Cards:
  - `Write better emails` · icon envelope
  - `Plan my day` · icon calendar
  - `Summarize notes` · icon document
  - `Learn faster` · icon lightning
- Default selected card sau 1.2s: `Write better emails`

Visual / Image:
- Mock app home screen với 4 feature cards.
- Card email nổi bật hơn bằng border sáng.

Animation:
- Cards bay vào theo thứ tự ziczac.
- Card selected có outline chạy vòng.
- Tap ripple khi user chọn.

Transition:
- Auto: sau 3.5s tự chọn `Write better emails` và chuyển Screen 2.
- Click: tap bất kỳ card nào để chuyển ngay.

---

### Screen 2 - Bad Email Sample

Purpose:
- Tạo before state rõ ràng để AI result có ý nghĩa.

Layout:
- Email draft card lớn.
- Có label `Before` màu cam.

Main content:
- Email before:

```txt
Subject: Update

Hi,
Just checking if you saw my last message.
Can you reply when you can?
Thanks.
```

- Issue chips:
  - `Too vague`
  - `Weak subject`
  - `No clear next step`

Visual / Image:
- Email composer mock UI.
- Warning icon nhỏ cạnh từng issue chip.

Animation:
- Các issue chip được AI scan highlight từng cái.
- Một scan line chạy từ trên xuống email card.

Transition:
- Auto: sau 4s chuyển sang Screen 3.
- Click: tap `Improve with AI` mini pill để chuyển ngay.

---

### Screen 3 - AI Answer Cards Stream

Purpose:
- Hiển thị AI cải thiện email thành nhiều phần: subject, body, checklist, tone.

Layout:
- Card stack vertical.
- Mỗi card xuất hiện như AI đang generate.

Main content:
- Card 1: Subject suggestion

```txt
Subject: Quick follow-up on tomorrow’s demo
```

- Card 2: Improved email

```txt
Hi Alex,

Just following up on my previous message about tomorrow’s demo.
Could you confirm if the 3 PM slot still works for you?

If another time is better, I’m happy to adjust.

Thanks!
```

- Card 3: Improvement checklist
  - `[x] Clear subject`
  - `[x] Polite tone`
  - `[x] One specific CTA`
  - `[x] Easy to reply`

- Card 4: Tone options
  - `Professional`
  - `Friendly`
  - `Shorter`

Visual / Image:
- Không cần ảnh thật.
- Dùng card UI, envelope icon, AI sparkle icon.

Animation:
- Card 1 slide up.
- Card 2 stream text từng dòng.
- Checklist checkmark pop.
- Tone chips bounce nhẹ.

Transition:
- Auto: sau 5s chuyển sang Screen 4.
- Click: tap improved email card để chuyển ngay.

---

### Screen 4 - Final CTA: Email Result Sheet

Purpose:
- Màn cuối vẫn là kết quả email, CTA là hành động tiếp theo.

Layout:
- Bottom sheet CTA nhưng main content là email hoàn chỉnh.
- Email card nằm phía trên, bottom sheet chiếm 30% dưới.

Main content:
- Header: `Your polished email is ready`
- Email preview ngắn:

```txt
Subject: Quick follow-up on tomorrow’s demo

Hi Alex, just following up on my previous message...
```

- Small action row:
  - `Copy`
  - `Make shorter`
  - `Change tone`
- CTA bottom sheet:
  - `Open AI Writer`
  - Subtext: `Edit tone, length, and send faster.`

Visual / Image:
- Email card có icon copy/check.
- Bottom sheet glass style.

Animation:
- Bottom sheet trượt lên từ dưới.
- Email card thu nhỏ nhẹ để nhường chỗ CTA.
- CTA có shimmer chạy ngang.

Transition:
- Không autoNext.
- Click CTA / tap bottom sheet -> mở `{{appStoreUrl}}`.

---

## Scenario 1C - AI Mentor Conversation: Stop Procrastinating

### Goal
Tạo cảm giác AI hiểu vấn đề cá nhân và đưa ra hành động nhỏ dễ làm.

### Screen 1 - Emotional Hook

Purpose:
- Chạm vào cảm xúc “mình đang trì hoãn”.

Layout:
- Dark soft gradient.
- Một nhân vật ngồi trước laptop, xung quanh là task bubbles.

Main content:
- Headline: `Stuck again?`
- Subheadline: `Your AI mentor can help you start.`
- Floating tasks:
  - `Open document`
  - `Reply later`
  - `Too much to do`

Visual / Image:
- Illustration người dùng ngồi lặng trước laptop.
- Task bubble mờ phía sau.

Animation:
- Task bubbles xoay chậm quanh nhân vật.
- Headline fade in.
- Một bubble `Too much to do` rung nhẹ.

Transition:
- Auto: sau 3.5s chuyển Screen 2.
- Click: tap nhân vật hoặc headline để chuyển.

---

### Screen 2 - Mentor Chat

Purpose:
- Cho AI phản hồi bằng giọng đồng cảm, không chỉ đưa checklist máy móc.

Layout:
- Chat layout với avatar mentor.
- Background ấm, ít noise.

Main content:
- User bubble:

```txt
I keep procrastinating. I don’t know where to start.
```

- AI stream:

```txt
That’s okay. Let’s make the first step tiny.

For the next 5 minutes:
1. Open the task
2. Write one messy sentence
3. Stop judging the result
4. Mark it as started

You don’t need motivation first.
You need one easy action.
```

Visual / Image:
- AI mentor avatar hình tròn.
- Tiny timer icon `5 min`.

Animation:
- Chat bubble AI type dần.
- Timer circle bắt đầu fill 5 phút giả lập.
- Các step xuất hiện như checklist mini.

Transition:
- Auto: sau 5s chuyển Screen 3.
- Click: tap timer/checklist để chuyển.

---

### Screen 3 - Checkpoint Commitment

Purpose:
- Biến lời khuyên thành hành động, làm user cảm giác đã bắt đầu.

Layout:
- Checklist lớn ở giữa.
- 3 checkpoint cards.

Main content:
- Title: `Your tiny start plan`
- Cards:
  - `1 · Open the document` · icon folder
  - `2 · Write one rough line` · icon pencil
  - `3 · Save progress` · icon check
- Encouragement: `Small starts count.`

Visual / Image:
- Illustration nhỏ của document đang mở.
- Progress ring 0 → 100%.

Animation:
- Checkpoint 1-3 lần lượt được tick.
- Progress ring fill dần.
- Text `Small starts count` xuất hiện sau tick cuối.

Transition:
- Auto: sau 4s chuyển Screen 4.
- Click: tap bất kỳ checkpoint nào để chuyển.

---

### Screen 4 - Final CTA: Mentor Achievement Card

Purpose:
- Màn cuối là một “achievement” nổi bật, không chỉ CTA.

Layout:
- Reward Unlock CTA.
- Achievement badge lớn trên cùng.
- CTA nằm trong card hoàn thành.

Main content:
- Badge lớn: `Momentum Started`
- Summary:
  - `1 tiny action plan created`
  - `3 checkpoints ready`
  - `5-minute focus timer unlocked`
- CTA: `Start With AI Mentor`
- Secondary microcopy: `Open the app and begin your first 5-minute session.`

Visual / Image:
- Badge tròn lớn với icon lightning/check.
- Mini focus timer bên dưới.

Animation:
- Badge scale in mạnh.
- Confetti nhỏ nhưng tập trung quanh badge.
- CTA glow theo nhịp tim nhẹ.

Transition:
- Không autoNext.
- Click badge hoặc CTA -> mở `{{appStoreUrl}}`.

---

# USER CASE 02 - AI Writing / Caption Generator

## Scenario 2A - Caption Generator: Product to 3 Captions

### Goal
Cho user thấy AI tạo ra nhiều caption khác tone, có thể dùng ngay.

### Screen 1 - Product Input

Purpose:
- Cho user nhập input đơn giản để AI hiểu sản phẩm.

Layout:
- Product card + prompt input.
- Có mock product image bên trái, input bên phải hoặc phía dưới.

Main content:
- Headline: `Turn a product into viral captions`
- Input label: `Product name`
- Input text type dần: `Matcha Energy Drink`
- Attribute chips:
  - `clean energy`
  - `no crash`
  - `creator friendly`
- Mini button: `Generate`

Visual / Image:
- Ảnh sản phẩm: lon nước matcha màu xanh, background studio đơn giản.
- Nếu không có ảnh thật: dùng product mock can.

Animation:
- Input type từng chữ.
- Chips xuất hiện sau khi nhập xong.
- Product can xoay nhẹ 3D.

Transition:
- Auto: sau 3.8s chuyển Screen 2.
- Click: tap button `Generate` hoặc tap product card.

---

### Screen 2 - AI Generating Captions

Purpose:
- Tạo cảm giác AI đang xử lý thật và output có nhiều hướng dùng được.

Layout:
- AI loading panel phía trên.
- 3 caption cards xuất hiện theo thứ tự.

Main content:
- Loading status:
  - `Reading product benefits...`
  - `Finding TikTok hooks...`
  - `Writing caption options...`
- Caption Card 1 · Short:

```txt
Clean energy, calm focus, zero crash. 🍵⚡
```

- Caption Card 2 · Funny:

```txt
Coffee made me shake. Matcha made me create.
```

- Caption Card 3 · Conversion:

```txt
Need focus without the crash? Try your daily matcha boost today.
```

Visual / Image:
- Mỗi card có icon tone khác nhau: bolt, smile, target.
- Product can mini thumbnail nằm cạnh từng caption.

Animation:
- Loading dots morph thành checkmark.
- Caption cards slide lên từng cái.
- Tag `High-conversion` pop nổi bật ở card 3.

Transition:
- Auto: sau 5s chuyển Screen 3.
- Click: tap caption card bất kỳ để chuyển.

---

### Screen 3 - Compare & Pick Best Caption

Purpose:
- Cho user cảm giác có thể chọn/điều chỉnh kết quả.

Layout:
- Carousel 3 cards ngang.
- Score chips trên mỗi card.

Main content:
- Card 1:
  - Text: `Clean energy, calm focus, zero crash.`
  - Score: `Best for Instagram`
- Card 2:
  - Text: `Coffee made me shake. Matcha made me create.`
  - Score: `Best for TikTok`
- Card 3:
  - Text: `Need focus without the crash? Try your daily matcha boost today.`
  - Score: `Best for sales`
- Selected badge: `AI recommends Card 2`

Visual / Image:
- Carousel có product thumbnail ở background.
- Score icon: Instagram-like square, play icon, cart icon.

Animation:
- Carousel auto center vào Card 2.
- Card 2 phóng to 1.08x.
- Badge recommendation glow nhẹ.

Transition:
- Auto: sau 4s chuyển Screen 4.
- Click: tap selected card hoặc swipe carousel.

---

### Screen 4 - Final CTA: Caption Deck Result

Purpose:
- Màn cuối main content là caption deck hoàn chỉnh, CTA mời mở app để generate thêm.

Layout:
- Card deck fan-out.
- CTA là một “generate more” panel đặt sau card cuối.

Main content:
- Title: `3 captions ready`
- Fan cards:
  - `TikTok Hook`
  - `Instagram Caption`
  - `Sales Caption`
- Selected caption lớn:

```txt
Coffee made me shake. Matcha made me create.
```

- CTA: `Generate More Captions`
- Microcopy: `Try 20+ tones inside the app.`

Visual / Image:
- Product can lớn phía sau card deck.
- Floating tag chips: `Funny`, `Short`, `Sales`, `Creator`.

Animation:
- Cards bung ra như bộ bài.
- Product can có glow xanh.
- CTA panel có sparkle chạy vòng quanh viền.

Transition:
- Không autoNext.
- Click selected caption, card deck hoặc CTA -> mở `{{appStoreUrl}}`.

---

## Scenario 2B - Rewrite Better: Weak Copy to High-Converting Copy

### Goal
Cho user thấy AI biến câu viết yếu thành bản copy thuyết phục, có checklist giải thích.

### Screen 1 - Before Copy

Purpose:
- Tạo sự khác biệt rõ ràng giữa before và after.

Layout:
- Before text card lớn.
- Side panel nhỏ hiển thị issue.

Main content:
- Headline: `This copy feels weak...`
- Before text:

```txt
Our product is good and helps you work faster.
```

- Issue list:
  - `Generic benefit`
  - `No emotion`
  - `No clear outcome`

Visual / Image:
- Document card trắng đơn giản.
- Warning icons cạnh issue.

Animation:
- AI scan line đi qua text.
- Issue list xuất hiện theo từng dòng.
- Một chữ `good` bị highlight vàng để chỉ generic word.

Transition:
- Auto: sau 3.5s sang Screen 2.
- Click: tap text card để AI rewrite ngay.

---

### Screen 2 - AI Rewrite Stream

Purpose:
- Cho AI rewrite với cấu trúc rõ: headline, body, CTA.

Layout:
- Split before/after.
- After side stream dần.

Main content:
- After text stream:

```txt
Move faster with an AI workspace that turns scattered ideas into clear, ready-to-use content in seconds.
```

- Alternative headline:

```txt
Create better content before your coffee gets cold.
```

- CTA suggestion:

```txt
Start Creating Now
```

Visual / Image:
- Before card mờ dần bên trái.
- After card sáng rõ bên phải.

Animation:
- Text after type dần.
- Before card giảm opacity.
- After card có glow nhẹ khi hoàn tất.

Transition:
- Auto: sau 4.5s sang Screen 3.
- Click: tap after card để chuyển.

---

### Screen 3 - Improvement Checklist

Purpose:
- Tăng trust bằng cách giải thích AI đã cải thiện những gì.

Layout:
- Checklist + score meter.

Main content:
- Score: `Copy Score: 42 → 91`
- Checklist:
  - `[x] Clearer benefit`
  - `[x] Stronger verb`
  - `[x] Specific outcome`
  - `[x] Better CTA`
- Tone chips:
  - `Bold`
  - `Friendly`
  - `Premium`
  - `Short`

Visual / Image:
- Score meter bán nguyệt.
- Copy document icon.

Animation:
- Score meter chạy từ 42 lên 91.
- Checkmarks pop theo score.
- Tone chips trượt vào theo hàng.

Transition:
- Auto: sau 4s sang Screen 4.
- Click: tap score meter hoặc tone chip.

---

### Screen 4 - Final CTA: Copy Transformation Card

Purpose:
- Màn cuối là before/after transformation, CTA không tách rời khỏi kết quả.

Layout:
- Before/After card stack.
- After card lớn nổi trên before card.
- CTA nằm dưới dạng “use this copy” action bar.

Main content:
- Label: `Before`

```txt
Our product is good and helps you work faster.
```

- Label: `After`

```txt
Move faster with an AI workspace that turns scattered ideas into clear, ready-to-use content in seconds.
```

- Highlight badge: `+49 copy score`
- CTA: `Rewrite My Copy`

Visual / Image:
- Text cards, không cần ảnh thật.
- Spark highlight trên câu after.

Animation:
- Before card lùi xuống và mờ.
- After card nổi lên như “upgrade”.
- Badge `+49` bắn sáng một lần.

Transition:
- Không autoNext.
- Click after card hoặc CTA action bar -> mở `{{appStoreUrl}}`.

---

## Scenario 2C - Email Writer: Follow-Up Email Generator

### Goal
Cho user thấy AI viết email hoàn chỉnh theo mục tiêu đã chọn.

### Screen 1 - Choose Email Goal

Purpose:
- Biến việc viết email thành chọn mục tiêu nhanh.

Layout:
- Email goal cards dạng list.

Main content:
- Headline: `What email do you need?`
- Cards:
  - `Follow-up email` · `After a meeting`
  - `Sales email` · `Pitch a product`
  - `Apology email` · `Fix a mistake`
  - `Partnership email` · `Start collaboration`
- Selected: `Follow-up email`

Visual / Image:
- Inbox mock UI phía sau.
- Icon từng card: clock, megaphone, heart, handshake.

Animation:
- Cards slide in từ phải.
- Selected card có checkmark và border sáng.

Transition:
- Auto: sau 3.5s chọn Follow-up và sang Screen 2.
- Click: tap card bất kỳ để chuyển.

---

### Screen 2 - Add Context Chips

Purpose:
- Cho AI có ngữ cảnh cụ thể để email có chất lượng.

Layout:
- Context builder với chips.

Main content:
- Selected context:
  - `Recipient: Sarah`
  - `Topic: Demo call`
  - `Tone: polite`
  - `Goal: confirm time`
- Prompt preview:

```txt
Write a polite follow-up email to Sarah about tomorrow’s demo call. Ask her to confirm the time.
```

Visual / Image:
- Small contact avatar `S`.
- Calendar icon `Tomorrow · 3 PM`.

Animation:
- Chips được “attach” vào prompt box.
- Prompt box mở rộng khi đủ context.

Transition:
- Auto: sau 4s sang Screen 3.
- Click: tap prompt preview để generate.

---

### Screen 3 - AI Email Stream

Purpose:
- Hiển thị email có đủ subject/body/CTA, không chỉ một dòng.

Layout:
- Email composer mock.
- AI typing vào các field.

Main content:
- Subject:

```txt
Quick follow-up on tomorrow’s demo
```

- Body:

```txt
Hi Sarah,

I wanted to quickly follow up on our demo scheduled for tomorrow.
Could you confirm whether 3 PM still works for you?

If another time is better, I’m happy to adjust.

Thanks,
Alex
```

- AI suggestions:
  - `Make shorter`
  - `More formal`
  - `Add agenda`

Visual / Image:
- Mock email compose screen.
- Contact avatar, subject field, body field.

Animation:
- Subject được type trước.
- Body type theo paragraph.
- Suggestion chips xuất hiện sau body.

Transition:
- Auto: sau 5s sang Screen 4.
- Click: tap suggestion chip hoặc email body.

---

### Screen 4 - Final CTA: Ready-to-Send Email Composer

Purpose:
- Màn cuối main content là email hoàn chỉnh sẵn sàng gửi, CTA mời mở app để chỉnh/sao chép/gửi.

Layout:
- Full email composer preview.
- CTA dạng floating toolbar bên dưới email.

Main content:
- Header: `Email ready to send`
- Email preview đầy đủ subject + body.
- Toolbar actions:
  - `Copy`
  - `Shorten`
  - `Change tone`
- CTA primary: `Write Emails Faster`

Visual / Image:
- Email compose mock lớn chiếm 75% màn hình.
- Small success toast: `Draft created`.

Animation:
- Toast `Draft created` trượt xuống từ top.
- Floating toolbar nổi lên từ dưới.
- CTA button có glow chạy theo đường viền, không dùng arrow nhỏ.

Transition:
- Không autoNext.
- Click toolbar hoặc CTA -> mở `{{appStoreUrl}}`.

---

# USER CASE 03 - AI Image Generator / Editor

## Scenario 3A - Text to Image: Futuristic Café

### Goal
Cho user thấy text prompt biến thành ảnh, có quá trình AI tạo ảnh rõ ràng.

### Screen 1 - Image Prompt Input

Purpose:
- Tạo cảm giác chỉ cần mô tả bằng text là có ảnh đẹp.

Layout:
- Prompt box lớn + style chips.

Main content:
- Headline: `Describe it. AI creates it.`
- Prompt typed:

```txt
A futuristic café with neon lights, rainy window, cinematic mood
```

- Style chips:
  - `Cinematic`
  - `Neon`
  - `Cozy`
  - `4K`

Visual / Image:
- Background là grid trống như canvas.
- Prompt box floating ở giữa.

Animation:
- Typing prompt dần.
- Style chips snap vào prompt box.
- Canvas phía sau sáng lên nhẹ.

Transition:
- Auto: sau 4s sang Screen 2.
- Click: tap prompt box hoặc chip style.

---

### Screen 2 - AI Rendering Process

Purpose:
- Giải thích quá trình tạo ảnh bằng các step dễ hiểu.

Layout:
- Vertical pipeline.
- Mỗi step có icon và progress.

Main content:
- Steps:
  - `1. Reading prompt` · icon text
  - `2. Building scene` · icon layout
  - `3. Adding neon light` · icon spark
  - `4. Rendering final image` · icon image
- Progress: `0% → 100%`
- Mini status text:
  - `Balancing colors...`
  - `Adding rainy reflections...`
  - `Sharpening details...`

Visual / Image:
- Blurry image placeholder dần rõ.
- Không cần ảnh thật ở step đầu.

Animation:
- Progress bar chạy.
- Placeholder từ blur chuyển dần thành màu neon.
- Mỗi step hoàn thành có checkmark.

Transition:
- Auto: sau 4.5s sang Screen 3.
- Click: tap progress area để skip.

---

### Screen 3 - Result Gallery

Purpose:
- Hiển thị nhiều ảnh kết quả, user cảm giác có lựa chọn.

Layout:
- 3 image cards dạng gallery.
- Card chính lớn, 2 card phụ nhỏ.

Main content:
- Image 1: `Neon café interior, rainy glass, purple-blue lighting`
- Image 2: `Street view café, glowing sign, cinematic rain`
- Image 3: `Cozy futuristic booth, warm neon, laptop on table`
- Tags:
  - `Cinematic`
  - `Rainy`
  - `Neon`
  - `AI Generated`

Visual / Image:
- Cần 3 ảnh AI/mock liên quan prompt.
- Có thể dùng placeholder gradient + illustration nếu chưa có asset.

Animation:
- Ảnh chính scale in.
- Ảnh phụ trượt vào hai bên.
- Tag `AI Generated` shimmer nhẹ.

Transition:
- Auto: sau 4.5s sang Screen 4.
- Click: tap ảnh chính hoặc swipe gallery.

---

### Screen 4 - Final CTA: Full Image Hero

Purpose:
- Màn cuối main content là ảnh AI đẹp full screen, CTA nằm như glass overlay.

Layout:
- Full Image Result CTA.
- Ảnh chiếm toàn bộ background.
- Glass panel phía dưới.

Main content:
- Background image: ảnh café đẹp nhất.
- Overlay title: `Your AI image is ready`
- Detail chips:
  - `Cinematic`
  - `Neon lights`
  - `Rainy mood`
- CTA: `Create Your Image`
- Secondary: `Generate unlimited styles in app`

Visual / Image:
- Ảnh neon café full screen.
- Badge `AI Generated` top-right.

Animation:
- Background image zoom in chậm.
- Glass panel slide up.
- CTA có particle sparkle xung quanh, không dùng arrow.

Transition:
- Không autoNext.
- Click CTA, glass panel hoặc image hero -> mở `{{appStoreUrl}}`.

---

## Scenario 3B - Before / After Photo Fix

### Goal
Cho user thấy ảnh kém chất lượng được AI cải thiện rõ ràng.

### Screen 1 - Upload Blurry Photo

Purpose:
- Thiết lập before state rõ ràng.

Layout:
- Upload card + ảnh blurry.

Main content:
- Headline: `Fix blurry photos in one tap`
- Upload card text: `Photo uploaded`
- Before label: `Before · Low quality`
- Mini issues:
  - `Blurry`
  - `Low light`
  - `Flat colors`

Visual / Image:
- Ảnh chân dung hoặc ảnh sản phẩm bị mờ/thiếu sáng.
- Nếu không có ảnh thật: dùng mock portrait blur.

Animation:
- Upload icon chuyển thành checkmark.
- Ảnh blur xuất hiện từ thumbnail.
- Issue chips bật lên cạnh ảnh.

Transition:
- Auto: sau 3.5s sang Screen 2.
- Click: tap ảnh before hoặc upload card.

---

### Screen 2 - AI Enhancement Scan

Purpose:
- Cho user thấy AI đang phân tích và sửa từng vấn đề.

Layout:
- Ảnh lớn với scan overlay.
- Checklist bên dưới.

Main content:
- Status:
  - `Detecting blur...`
  - `Boosting light...`
  - `Restoring details...`
  - `Balancing skin tone...`
- Checklist:
  - `[x] Sharpen edges`
  - `[x] Improve brightness`
  - `[x] Restore contrast`
  - `[x] Clean noise`

Visual / Image:
- Ảnh before được phủ scan line.
- Các vùng mặt/sản phẩm được khoanh highlight.

Animation:
- Scan line chạy từ trên xuống.
- Khi mỗi status complete, vùng ảnh tương ứng sáng rõ hơn.
- Checklist tick lần lượt.

Transition:
- Auto: sau 4s sang Screen 3.
- Click: tap scan overlay để skip.

---

### Screen 3 - Before / After Comparison

Purpose:
- Cho user tự cảm nhận khác biệt qua split view.

Layout:
- Before/after slider.
- Left before, right after.

Main content:
- Left label: `Before`
- Right label: `After`
- Improvement chips:
  - `Sharper details`
  - `Brighter face`
  - `Better contrast`
  - `Natural color`

Visual / Image:
- Cần 2 ảnh cùng chủ thể: một blurry, một enhanced.
- Slider handle ở giữa.

Animation:
- Slider tự kéo từ trái sang phải một lần.
- After side glow nhẹ khi xuất hiện.
- Improvement chips pop quanh ảnh.

Transition:
- Auto: sau 4.5s sang Screen 4.
- Click/drag slider -> chuyển sau khi drag hoặc tap after.

---

### Screen 4 - Final CTA: Enhanced Photo Showcase

Purpose:
- Màn cuối main content là ảnh after lớn, CTA như action panel chỉnh tiếp.

Layout:
- Full image after + floating edit controls.

Main content:
- Main image: ảnh đã enhance.
- Title: `Photo enhanced by AI`
- Floating controls:
  - `Sharpen +38%`
  - `Light +24%`
  - `Noise -41%`
- CTA: `Enhance My Photos`

Visual / Image:
- Ảnh after full screen hoặc gần full screen.
- Control chips đặt quanh ảnh như app editor.

Animation:
- Ảnh after reveal bằng wipe sáng.
- Control chips count up số %.
- CTA panel có glow mở rộng từ trung tâm.

Transition:
- Không autoNext.
- Click image, control chip hoặc CTA -> mở `{{appStoreUrl}}`.

---

## Scenario 3C - AI Avatar Pack

### Goal
Cho user thấy AI tạo nhiều avatar đa phong cách từ 1 ảnh.

### Screen 1 - Choose Avatar Style

Purpose:
- Cho user tự chọn style, tăng tương tác.

Layout:
- Style card grid 2x2.

Main content:
- Headline: `Pick your AI avatar style`
- Style cards:
  - `Business Portrait` · suit icon
  - `Anime Hero` · star icon
  - `Cyberpunk` · neon icon
  - `Luxury Editorial` · diamond icon
- Selected sau auto: `Cyberpunk`

Visual / Image:
- Mỗi card có sample avatar thumbnail.
- Dùng ảnh người giả lập/avatar mẫu.

Animation:
- Cards flip nhẹ khi xuất hiện.
- Selected card có neon border.
- Background chuyển màu theo style selected.

Transition:
- Auto: sau 3.5s chọn Cyberpunk và sang Screen 2.
- Click: tap card bất kỳ để chuyển.

---

### Screen 2 - Upload Face / AI Mapping

Purpose:
- Giải thích AI dùng khuôn mặt để tạo avatar pack.

Layout:
- Face upload circle ở giữa.
- Mapping points quanh khuôn mặt.

Main content:
- Text: `AI maps your face shape, lighting, and style.`
- Mapping items:
  - `Face shape`
  - `Hair outline`
  - `Lighting direction`
  - `Style match`

Visual / Image:
- Ảnh portrait mẫu dạng tròn.
- Dot points trên mặt như face mapping.

Animation:
- Dots xuất hiện quanh mặt.
- Line nối dots nhẹ.
- Style aura chuyển từ ảnh thật sang cyberpunk palette.

Transition:
- Auto: sau 4s sang Screen 3.
- Click: tap face circle để chuyển.

---

### Screen 3 - Avatar Pack Result Grid

Purpose:
- Hiển thị nhiều kết quả để tăng perceived value.

Layout:
- Grid 2x3 avatar cards.

Main content:
- 6 avatar cards:
  - `Neon profile`
  - `Dark hero`
  - `Street cyber`
  - `Luxury tech`
  - `Gaming avatar`
  - `Professional neon`
- Tip card:
  - `Use for social profile, portfolio, and creator branding.`

Visual / Image:
- Cần 6 avatar cùng khuôn mặt, khác background/style.
- Nếu chưa có asset: dùng gradient avatar placeholder.

Animation:
- Grid fill từng avatar như AI rendering.
- Card hover/tap scale nhẹ.
- Tip card slide lên cuối cùng.

Transition:
- Auto: sau 5s sang Screen 4.
- Click: tap avatar card bất kỳ.

---

### Screen 4 - Final CTA: Avatar Wheel Showcase

Purpose:
- Màn cuối main content là avatar pack đẹp, CTA là unlock/download pack.

Layout:
- Avatar wheel/fan layout.
- 1 avatar lớn ở giữa, 5 avatar nhỏ quay quanh.

Main content:
- Title: `Your AI avatar pack is ready`
- Center avatar: Cyberpunk profile.
- Small labels:
  - `6 styles`
  - `HD export`
  - `Profile ready`
- CTA: `Generate My Avatars`

Visual / Image:
- Avatar chính lớn, các avatar phụ dạng orbit.
- Background neon radial.

Animation:
- Avatar phụ xoay chậm quanh avatar chính.
- Center avatar có neon rim light.
- CTA xuất hiện như unlock badge, không dùng arrow.

Transition:
- Không autoNext.
- Click avatar wheel hoặc CTA -> mở `{{appStoreUrl}}`.

---

# USER CASE 04 - AI Resume Builder

## Scenario 4A - Build Resume Fast

### Goal
Cho user thấy chỉ chọn role là AI có thể tạo resume section chi tiết.

### Screen 1 - Choose Target Role

Purpose:
- Thu thập đầu vào đơn giản và tạo cảm giác cá nhân hóa.

Layout:
- Role picker cards.

Main content:
- Headline: `Build a resume for your dream role`
- Role cards:
  - `Frontend Developer` · code icon
  - `Product Manager` · roadmap icon
  - `Designer` · pen icon
  - `Marketer` · megaphone icon
- Selected: `Frontend Developer`
- Small context chips:
  - `5 years experience`
  - `React`
  - `Next.js`

Visual / Image:
- Resume document mock ở background.
- Role card icon riêng từng nghề.

Animation:
- Role cards slide lên.
- Selected role card expand nhẹ.
- Context chips attach vào selected role.

Transition:
- Auto: sau 3.8s sang Screen 2.
- Click: tap role card để chuyển.

---

### Screen 2 - AI Generates Resume Sections

Purpose:
- Cho AI tạo các phần resume cụ thể, không chỉ headline.

Layout:
- Document builder layout.
- Các section xuất hiện như được fill vào CV.

Main content:
- Section 1: Professional Summary

```txt
Frontend Developer with 5+ years of experience building scalable web applications, optimizing performance, and delivering user-focused product experiences.
```

- Section 2: Skills
  - `React`
  - `Next.js`
  - `TypeScript`
  - `Performance Optimization`
  - `SEO`
- Section 3: Experience bullet

```txt
Improved page load speed by optimizing rendering, image loading, and bundle size across high-traffic pages.
```

Visual / Image:
- CV paper mock with sections.
- AI pen cursor writing into document.

Animation:
- Section headers appear first.
- AI writing line fills each section.
- Skill tags pop in as chips.

Transition:
- Auto: sau 5s sang Screen 3.
- Click: tap document section.

---

### Screen 3 - Resume Quality Checklist

Purpose:
- Tăng độ tin tưởng bằng checklist chất lượng.

Layout:
- Checklist + strength score.

Main content:
- Score: `Resume Strength: 86/100`
- Checklist:
  - `[x] Strong summary`
  - `[x] Relevant skills`
  - `[x] Action verbs`
  - `[x] Impact-focused bullet`
  - `[ ] Add portfolio link`
- Suggestion card:

```txt
Tip: Add one measurable result to make your experience stronger.
```

Visual / Image:
- Score ring lớn.
- Resume thumbnail ở góc.

Animation:
- Score ring tăng từ 0 tới 86.
- Checklist tick từng item.
- Missing item highlight nhẹ.

Transition:
- Auto: sau 4s sang Screen 4.
- Click: tap score ring hoặc suggestion card.

---

### Screen 4 - Final CTA: One-Page Resume Preview

Purpose:
- Màn cuối main content là resume preview thực tế.

Layout:
- Resume document full card.
- CTA là sticky document footer.

Main content:
- Title: `Your resume draft is ready`
- Resume preview:
  - Name placeholder: `Alex Nguyen`
  - Role: `Frontend Developer`
  - Summary 2 dòng.
  - Top skills chips.
  - One strong bullet.
- CTA: `Build My Resume`
- Secondary: `Export PDF in the app`

Visual / Image:
- Resume document trắng rõ, có shadow.
- Background gradient xanh chuyên nghiệp.

Animation:
- Resume paper trượt lên như được in ra.
- Skill chips highlight từng cái.
- CTA footer dán vào document, glow nhẹ.

Transition:
- Không autoNext.
- Click resume preview hoặc CTA -> mở `{{appStoreUrl}}`.

---

## Scenario 4B - Resume Review

### Goal
Cho user thấy AI chấm điểm CV và sửa bullet yếu thành bullet mạnh.

### Screen 1 - Upload Resume

Purpose:
- Bắt đầu từ hành động quen thuộc: upload CV.

Layout:
- Upload dropzone + CV thumbnail.

Main content:
- Headline: `Is your resume strong enough?`
- Upload status: `resume.pdf uploaded`
- File details:
  - `2 pages`
  - `Frontend role`
  - `Last updated: today`

Visual / Image:
- CV thumbnail mờ.
- Upload cloud icon.

Animation:
- File card rơi vào dropzone.
- Upload progress 0 → 100.
- CV thumbnail mở ra nhẹ.

Transition:
- Auto: sau 3.5s sang Screen 2.
- Click: tap file card.

---

### Screen 2 - AI Score & Issue List

Purpose:
- Chỉ ra vấn đề cụ thể để tạo nhu cầu sửa.

Layout:
- Score meter lớn + issue cards.

Main content:
- Score: `74/100`
- Issues:
  - `Summary is too generic`
  - `Skills are not prioritized`
  - `Experience bullets lack numbers`
  - `Missing portfolio link`
- Severity chips:
  - `High impact`
  - `Quick fix`
  - `Recommended`

Visual / Image:
- Resume scan background.
- Score meter dạng dashboard.

Animation:
- Scan line trên resume thumbnail.
- Score needle chạy tới 74.
- Issue cards stack lên từng cái.

Transition:
- Auto: sau 4s sang Screen 3.
- Click: tap issue `Experience bullets lack numbers`.

---

### Screen 3 - Before / After Bullet Rewrite

Purpose:
- Cho user thấy giá trị AI review qua một ví dụ cụ thể.

Layout:
- Before/after bullet cards.

Main content:
- Before:

```txt
Built web pages for company website.
```

- After:

```txt
Built and optimized high-traffic landing pages, improving load speed by 28% and increasing signup conversion by 12%.
```

- Why better:
  - `[x] Strong action verb`
  - `[x] Clear impact`
  - `[x] Measurable result`

Visual / Image:
- 2 cards, before gray, after bright.
- Small chart icon next to `+12%`.

Animation:
- Before card bị gạch nhẹ.
- After card type dần.
- Numbers `28%` và `12%` pop mạnh.

Transition:
- Auto: sau 4.5s sang Screen 4.
- Click: tap after card.

---

### Screen 4 - Final CTA: Resume Score Upgrade Dashboard

Purpose:
- Màn cuối là score improvement dashboard, CTA gắn với nâng điểm CV.

Layout:
- Dashboard CTA.
- Score meter lớn ở giữa.
- Issues fixed cards xung quanh.

Main content:
- Header: `Resume score can improve to 92/100`
- Score: `74 → 92`
- Fix preview:
  - `Rewrite summary`
  - `Add impact numbers`
  - `Prioritize top skills`
  - `Add portfolio link`
- CTA: `Improve Resume Now`

Visual / Image:
- Score meter nổi bật chiếm trung tâm.
- Resume thumbnail before/after nhỏ ở dưới.

Animation:
- Score meter count up từ 74 tới 92.
- Cards fixed bay vào quanh meter.
- CTA unlock panel mở ra như “upgrade”.

Transition:
- Không autoNext.
- Click score meter hoặc CTA -> mở `{{appStoreUrl}}`.

---

## Scenario 4C - Cover Letter Helper

### Goal
Cho user thấy AI có thể đọc job requirement và viết cover letter phù hợp.

### Screen 1 - Job Description Snapshot

Purpose:
- Tạo ngữ cảnh rõ: có job, có requirements.

Layout:
- Job post card.
- Requirements highlighted.

Main content:
- Job title: `Marketing Specialist`
- Company: `BrightLabs`
- Requirements:
  - `2+ years content marketing`
  - `SEO experience`
  - `Campaign reporting`
  - `Strong writing skills`
- CTA nhỏ: `Generate cover letter`

Visual / Image:
- Mock job listing page.
- Highlight marker trên requirements.

Animation:
- Job card slide in.
- AI highlighter quét từng requirement.
- Highlighted words glow nhẹ.

Transition:
- Auto: sau 4s sang Screen 2.
- Click: tap highlighted requirement.

---

### Screen 2 - Match Candidate Strengths

Purpose:
- Cho AI mapping job requirement với điểm mạnh ứng viên.

Layout:
- Match table 2 cột.

Main content:
- Left: Job needs.
- Right: Candidate strengths.
- Rows:
  - `SEO experience` → `Managed blog SEO calendar`
  - `Campaign reporting` → `Built weekly performance dashboards`
  - `Strong writing` → `Created landing page copy`
- Match score: `89% role fit`

Visual / Image:
- Match lines nối giữa 2 cột.
- Candidate avatar đơn giản.

Animation:
- Lines vẽ từ trái sang phải.
- Match score count up.
- Rows tick khi matched.

Transition:
- Auto: sau 4s sang Screen 3.
- Click: tap match score.

---

### Screen 3 - AI Cover Letter Draft

Purpose:
- Hiển thị cover letter có cấu trúc và cá nhân hóa.

Layout:
- Document writer layout.

Main content:
- Draft excerpt:

```txt
Dear BrightLabs team,

I’m excited to apply for the Marketing Specialist role. My experience in SEO content planning, landing page copy, and campaign reporting aligns closely with what your team is looking for.

In my previous work, I helped organize content initiatives, improve page performance, and turn campaign data into clear next steps for growth.
```

- Structure cards:
  - `Opening`
  - `Role fit`
  - `Proof`
  - `Closing`

Visual / Image:
- Cover letter document mock.
- AI pen cursor.

Animation:
- Draft text streams paragraph by paragraph.
- Structure cards light up as sections complete.

Transition:
- Auto: sau 5s sang Screen 4.
- Click: tap document.

---

### Screen 4 - Final CTA: Cover Letter Document Preview

Purpose:
- Màn cuối là document preview, CTA mời app để hoàn thiện/export.

Layout:
- Document preview with signature area.
- CTA as bottom document action rail.

Main content:
- Header: `Cover letter draft ready`
- Document preview:
  - Opening paragraph.
  - 2 bullet strengths.
  - Closing line.
- Action rail:
  - `Make shorter`
  - `More confident`
  - `Export PDF`
- CTA: `Generate Cover Letter`

Visual / Image:
- Document có signature line.
- Small job card pinned trên góc.

Animation:
- Document page lật nhẹ vào màn hình.
- Action rail trượt lên.
- CTA có ink underline animation.

Transition:
- Không autoNext.
- Click document/action rail/CTA -> mở `{{appStoreUrl}}`.

---

# USER CASE 05 - AI Tutor / Learning App

## Scenario 5A - Quick Quiz: Capital of Canada

### Goal
Tạo một quiz nhanh, có giải thích và reward CTA.

### Screen 1 - Quiz Question

Purpose:
- Bắt user tương tác bằng câu hỏi đơn giản.

Layout:
- Quiz card + 4 options.

Main content:
- Question: `What is the capital of Canada?`
- Options:
  - `Toronto`
  - `Vancouver`
  - `Ottawa`
  - `Montreal`
- Hint: `Pick one to reveal AI explanation`

Visual / Image:
- Map outline Canada mờ ở background.
- Option cards có icon pin.

Animation:
- Question card bounce nhẹ.
- Options xuất hiện từ dưới lên.
- Option `Ottawa` có subtle glow sau 2.5s nếu user chưa chọn.

Transition:
- Auto: sau 3.8s auto chọn `Ottawa` và sang Screen 2.
- Click: tap option để chuyển ngay.

---

### Screen 2 - Answer Reveal

Purpose:
- Cho đáp án đúng và giải thích ngắn.

Layout:
- Correct answer card lớn.
- Explanation bên dưới.

Main content:
- Answer: `Correct: Ottawa`
- Explanation:

```txt
Ottawa is the capital of Canada.
Toronto is the largest city, but it is not the capital.
```

- Mini fact card:
  - `Country: Canada`
  - `Capital: Ottawa`
  - `Largest city: Toronto`

Visual / Image:
- Map pin trên Ottawa.
- Flag Canada nhỏ.

Animation:
- Correct answer card flip từ option.
- Map pin drop xuống vị trí Ottawa.
- Fact card slide up.

Transition:
- Auto: sau 4s sang Screen 3.
- Click: tap fact card.

---

### Screen 3 - Memory Checklist

Purpose:
- Giúp user ghi nhớ bằng mnemonic/checklist.

Layout:
- Memory card + checklist.

Main content:
- Memory trick:

```txt
Remember: Ottawa = Official capital.
Both start with “O”.
```

- Checklist:
  - `[x] Ottawa = capital`
  - `[x] Toronto = largest city`
  - `[x] Canada = country`
- Next question preview:
  - `Want another quick quiz?`

Visual / Image:
- Brain icon hoặc lightbulb.
- Letter `O` lớn làm visual.

Animation:
- Letter `O` zoom in rồi biến thành Ottawa.
- Checklist tick lần lượt.
- Next question preview pulse nhẹ.

Transition:
- Auto: sau 3.8s sang Screen 4.
- Click: tap checklist hoặc next question.

---

### Screen 4 - Final CTA: Quiz Streak Reward

Purpose:
- Màn cuối là reward/streak, CTA mở app để tiếp tục học.

Layout:
- Reward Unlock CTA.
- Coin/streak badge lớn.

Main content:
- Badge: `1 Question Mastered`
- Streak preview:
  - `Day 1 · Geography`
  - `+10 XP`
  - `Next: World capitals`
- CTA: `Keep Learning`

Visual / Image:
- Coin XP lớn.
- Mini map icon.

Animation:
- Coin reward pop vào giữa màn hình.
- XP number count up.
- CTA nằm trong reward card với glow vàng.

Transition:
- Không autoNext.
- Click reward badge hoặc CTA -> mở `{{appStoreUrl}}`.

---

## Scenario 5B - AI Explains Anything: Photosynthesis

### Goal
Cho user thấy AI giải thích bài học dài thành phần dễ hiểu.

### Screen 1 - Choose Topic

Purpose:
- User chọn topic học.

Layout:
- Topic cards horizontal.

Main content:
- Headline: `What should AI explain?`
- Topics:
  - `Photosynthesis` · leaf icon
  - `Algebra` · x icon
  - `Grammar` · book icon
  - `History` · scroll icon
- Selected: `Photosynthesis`

Visual / Image:
- Background classroom/notebook nhẹ.
- Topic card Photosynthesis có leaf illustration.

Animation:
- Cards swipe tự động nhẹ.
- Selected topic card nâng lên.
- Leaf icon xoay nhẹ.

Transition:
- Auto: sau 3.5s chọn Photosynthesis sang Screen 2.
- Click: tap topic card.

---

### Screen 2 - Simple Explanation Stream

Purpose:
- AI giải thích từng lớp: simple definition → key idea → example.

Layout:
- Teaching board layout.
- Text stream + diagram đơn giản.

Main content:
- AI explanation:

```txt
Photosynthesis is how plants make food using sunlight.

Plants take in:
- sunlight
- water
- carbon dioxide

They produce:
- sugar for energy
- oxygen released into the air
```

- Formula simplified:

```txt
Sunlight + Water + CO₂ → Sugar + Oxygen
```

Visual / Image:
- Diagram cây: mặt trời, giọt nước, CO2 đi vào lá, O2 đi ra.
- Icon mặt trời, nước, khí, đường.

Animation:
- Arrows đi vào lá.
- Oxygen bubbles bay ra.
- Text stream theo từng bullet.

Transition:
- Auto: sau 5s sang Screen 3.
- Click: tap diagram.

---

### Screen 3 - Summary Cards

Purpose:
- Tóm tắt kiến thức thành card dễ nhớ.

Layout:
- 3 summary cards.

Main content:
- Card 1: `Key idea`
  - `Plants turn sunlight into food.`
- Card 2: `Inputs`
  - `Sunlight, water, carbon dioxide.`
- Card 3: `Outputs`
  - `Sugar and oxygen.`
- Quick check:
  - `What gas do plants release?` → `Oxygen`

Visual / Image:
- Cards màu theo nhóm: vàng, xanh, xanh dương.
- Mini icon từng card.

Animation:
- Cards flip như flashcards.
- Quick check answer reveal bằng slide.

Transition:
- Auto: sau 4s sang Screen 4.
- Click: tap quick check hoặc flashcard.

---

### Screen 4 - Final CTA: Flashcard Study Pack

Purpose:
- Màn cuối là study pack có nội dung học, CTA mở app để học tiếp.

Layout:
- Flashcard stack CTA.
- 1 card chính + 2 card phía sau.

Main content:
- Title: `Your study pack is ready`
- Flashcard front:
  - `Photosynthesis`
- Flashcard back preview:
  - `Plants make food using sunlight.`
- Pack includes:
  - `3 flashcards`
  - `1 quiz`
  - `1 diagram`
- CTA: `Study With AI`

Visual / Image:
- Stack flashcards với leaf icon.
- Diagram cây mini phía sau.

Animation:
- Flashcard flip một nửa để tease answer.
- Stack cards fan out.
- CTA có lightbulb glow.

Transition:
- Không autoNext.
- Click flashcard stack hoặc CTA -> mở `{{appStoreUrl}}`.

---

## Scenario 5C - Language Practice: Correct My Sentence

### Goal
Cho user thấy AI sửa lỗi, giải thích và tạo luyện tập tiếp theo.

### Screen 1 - User Sentence Input

Purpose:
- Tạo before state có lỗi rõ ràng.

Layout:
- Chat/input practice card.

Main content:
- Headline: `Practice English with AI`
- User sentence typed:

```txt
I goed to school yesterday.
```

- Hint: `AI will correct grammar and explain why.`

Visual / Image:
- Notebook background.
- Pencil cursor.

Animation:
- Sentence type dần.
- Word `goed` underline đỏ.
- Hint shimmer nhẹ.

Transition:
- Auto: sau 3.5s sang Screen 2.
- Click: tap underlined word.

---

### Screen 2 - AI Correction

Purpose:
- Sửa câu và giải thích lỗi.

Layout:
- Correction card với before/after.

Main content:
- Before:

```txt
I goed to school yesterday.
```

- Correct:

```txt
I went to school yesterday.
```

- Explanation:

```txt
“Go” is an irregular verb.
The past tense is “went”, not “goed”.
```

Visual / Image:
- Before/after sentence cards.
- Grammar icon `irregular verb`.

Animation:
- `goed` morph thành `went`.
- Correct sentence glow xanh.
- Explanation lines appear one by one.

Transition:
- Auto: sau 4.5s sang Screen 3.
- Click: tap correct sentence.

---

### Screen 3 - Practice Checklist + New Example

Purpose:
- Biến sửa lỗi thành bài luyện tập.

Layout:
- Checklist + mini exercise.

Main content:
- Checklist:
  - `[x] Find verb`
  - `[x] Check tense`
  - `[x] Use irregular form`
- New example:

```txt
Try: I ___ to the park yesterday.
Answer: went
```

- Mini rule card:
  - `go → went`
  - `eat → ate`
  - `see → saw`

Visual / Image:
- Flashcard nhỏ cho irregular verbs.
- Check icon từng rule.

Animation:
- Checklist tick.
- Blank line fill with `went`.
- Rule card scroll mini.

Transition:
- Auto: sau 4s sang Screen 4.
- Click: tap blank answer.

---

### Screen 4 - Final CTA: Practice Streak Card

Purpose:
- Màn cuối là kết quả học + streak, CTA mở app để luyện tiếp.

Layout:
- Progress streak CTA.
- Card lớn có sentence corrected.

Main content:
- Title: `1 grammar mistake fixed`
- Corrected sentence:

```txt
I went to school yesterday.
```

- Streak panel:
  - `Practice goal: 5 min/day`
  - `Today: 1 correction`
  - `Next: Past tense quiz`
- CTA: `Practice Daily`

Visual / Image:
- Streak flame nhỏ.
- Correct sentence card lớn.

Animation:
- Flame icon bật sáng.
- Correct sentence card stamp `Fixed`.
- CTA progress bar fill 100% rồi hiện button.

Transition:
- Không autoNext.
- Click corrected sentence/streak card/CTA -> mở `{{appStoreUrl}}`.

---

# USER CASE 06 - AI Fitness / Meal Planner

## Scenario 6A - Build My Meal Plan

### Goal
Cho user thấy AI tạo meal plan cụ thể theo mục tiêu, có món ăn từng bữa.

### Screen 1 - Choose Health Goal

Purpose:
- Tạo input cá nhân hóa đơn giản.

Layout:
- Goal selection cards.

Main content:
- Headline: `What’s your meal goal?`
- Options:
  - `Lose weight` · scale icon
  - `Gain muscle` · dumbbell icon
  - `Eat healthier` · leaf icon
  - `High protein` · egg icon
- Selected: `High protein`
- Preference chips:
  - `No pork`
  - `Quick meals`
  - `Budget friendly`

Visual / Image:
- Food bowl illustration.
- Goal icons rõ ràng.

Animation:
- Goal cards pop vào như app onboarding.
- Selected card có checkmark.
- Food bowl nhẹ nhàng scale.

Transition:
- Auto: sau 3.8s sang Screen 2.
- Click: tap goal card.

---

### Screen 2 - AI Meal Plan Stream

Purpose:
- Tạo plan chi tiết từng bữa, không chỉ danh sách chung.

Layout:
- Daily meal timeline.

Main content:
- AI stream:

```txt
High-protein day plan:

Breakfast · 8:00
Greek yogurt bowl with berries, granola, and chia seeds
Protein: 28g

Lunch · 12:30
Chicken rice bowl with broccoli, avocado, and light sauce
Protein: 42g

Snack · 16:00
Boiled eggs + banana
Protein: 14g

Dinner · 19:00
Salmon, sweet potato, and green beans
Protein: 38g
```

Visual / Image:
- 4 food cards có ảnh minh họa:
  - yogurt bowl
  - chicken rice bowl
  - eggs + banana
  - salmon dinner
- Icon bữa: sunrise, sun, snack, moon.

Animation:
- Meal cards xuất hiện theo timeline từ sáng tới tối.
- Protein number count up.
- Food images zoom nhẹ.

Transition:
- Auto: sau 5.5s sang Screen 3.
- Click: tap bất kỳ meal card nào.

---

### Screen 3 - Grocery & Habit Checklist

Purpose:
- Biến meal plan thành việc có thể hành động.

Layout:
- Checklist + grocery mini list.

Main content:
- Grocery list:
  - `Greek yogurt`
  - `Chicken breast`
  - `Broccoli`
  - `Eggs`
  - `Salmon`
  - `Sweet potato`
- Habit checklist:
  - `[x] Protein each meal`
  - `[x] 2 vegetable servings`
  - `[x] Water reminder`
  - `[ ] Prep lunch box`
- Summary: `122g protein planned`

Visual / Image:
- Grocery bag illustration.
- Icons for each food category.

Animation:
- Grocery items drop into bag.
- Checklist tick.
- `122g protein` number rolls up.

Transition:
- Auto: sau 4.5s sang Screen 4.
- Click: tap grocery bag/checklist.

---

### Screen 4 - Final CTA: Meal Calendar + Grocery Unlock

Purpose:
- Màn cuối là meal plan kết quả, CTA mở app để lấy full weekly plan.

Layout:
- Meal calendar card + grocery bag CTA.

Main content:
- Title: `Your high-protein day is ready`
- Calendar preview:
  - `8:00 · Yogurt bowl · 28g`
  - `12:30 · Chicken bowl · 42g`
  - `16:00 · Eggs + banana · 14g`
  - `19:00 · Salmon plate · 38g`
- Badge: `122g protein`
- CTA: `Get My Full Plan`

Visual / Image:
- Meal timeline card lớn.
- Grocery bag icon có items nhô ra.

Animation:
- Timeline line vẽ từ trên xuống.
- Badge protein bounce.
- Grocery bag mở ra, CTA nằm bên trong như unlock item.

Transition:
- Không autoNext.
- Click timeline/grocery bag/CTA -> mở `{{appStoreUrl}}`.

---

## Scenario 6B - Workout Generator

### Goal
Cho AI tạo routine theo level và biến thành buổi tập dễ bắt đầu.

### Screen 1 - Fitness Level

Purpose:
- Chọn trình độ để cá nhân hóa workout.

Layout:
- 3 big cards.

Main content:
- Headline: `Build a workout for your level`
- Options:
  - `Beginner · 15 min`
  - `Intermediate · 25 min`
  - `Advanced · 40 min`
- Selected: `Beginner · 15 min`
- Equipment chips:
  - `No equipment`
  - `Home workout`

Visual / Image:
- Illustration người tập tại nhà.
- Level cards có icon khác nhau.

Animation:
- Cards bounce nhẹ.
- Selected beginner card kéo vào center.
- `No equipment` chip lock-in.

Transition:
- Auto: sau 3.5s sang Screen 2.
- Click: tap level.

---

### Screen 2 - AI Routine Stream

Purpose:
- Tạo routine cụ thể: warmup, moves, rest, tip.

Layout:
- Workout step list.

Main content:
- Routine:

```txt
15-Min Beginner Workout

Warm-up · 3 min
- March in place
- Arm circles
- Light squats

Main set · 10 min
1. Squats · 30 sec
2. Wall push-ups · 30 sec
3. Glute bridges · 30 sec
4. Rest · 30 sec
Repeat 3 rounds

Cooldown · 2 min
- Slow breathing
- Hamstring stretch
```

Visual / Image:
- Exercise icons for squat, push-up, bridge, rest.
- Timer blocks.

Animation:
- Each step card slides into vertical list.
- Timer numbers pulse.
- Repeat loop icon rotates once.

Transition:
- Auto: sau 5s sang Screen 3.
- Click: tap any exercise card.

---

### Screen 3 - Progress Preview

Purpose:
- Cho user cảm giác routine đã sẵn sàng bắt đầu.

Layout:
- Timer card lớn + progress ring.

Main content:
- Title: `Workout ready`
- Timer: `15:00`
- Progress segments:
  - `Warm-up`
  - `Round 1`
  - `Round 2`
  - `Round 3`
  - `Cooldown`
- Tip:

```txt
Keep a pace where you can still talk.
```

Visual / Image:
- Timer ring lớn.
- Exercise icon ở giữa ring.

Animation:
- Ring vẽ đầy theo segments.
- Timer flash 15:00.
- Tip card slide up.

Transition:
- Auto: sau 4s sang Screen 4.
- Click: tap timer ring.

---

### Screen 4 - Final CTA: Workout Timer Start Card

Purpose:
- Màn cuối là workout timer ready state, CTA mở app để bắt đầu.

Layout:
- Timer hero + start panel.

Main content:
- Big timer: `15:00`
- Routine summary:
  - `No equipment`
  - `Beginner friendly`
  - `3 rounds`
- CTA: `Start Training`
- Secondary: `AI will guide each move`

Visual / Image:
- Workout silhouette hoặc simple trainer avatar.
- Ring timer chiếm trung tâm.

Animation:
- Timer ring pulse như chờ start.
- Trainer avatar wave nhẹ.
- CTA là big start pad, glow từ trong ra ngoài.

Transition:
- Không autoNext.
- Click timer/start pad/CTA -> mở `{{appStoreUrl}}`.

---

## Scenario 6C - Quick Nutrition Q&A

### Goal
Cho user hỏi một câu nutrition và nhận answer cards cụ thể.

### Screen 1 - Quick Question

Purpose:
- Hook bằng câu hỏi phổ biến.

Layout:
- Question bubble lớn.

Main content:
- Headline: `Ask AI about nutrition`
- Question:

```txt
What should I eat after a workout?
```

- Quick chips:
  - `Muscle gain`
  - `Weight loss`
  - `Fast recovery`

Visual / Image:
- Gym bag + food icons.
- Chat bubble style.

Animation:
- Question type dần.
- Chips slide in.
- Gym bag icon bounce nhẹ.

Transition:
- Auto: sau 3.5s sang Screen 2.
- Click: tap chip/question.

---

### Screen 2 - AI Nutrition Answer Cards

Purpose:
- Trả lời bằng nhiều card: timing, foods, avoid, checklist.

Layout:
- Card carousel vertical.

Main content:
- Card 1: `Best timing`

```txt
Eat within 30-90 minutes after training.
```

- Card 2: `Best foods`
  - `Greek yogurt + fruit`
  - `Chicken rice bowl`
  - `Eggs + toast`
  - `Protein smoothie`
- Card 3: `Avoid`
  - `Only sugary snacks`
  - `Skipping water`
  - `Very greasy meals`
- Card 4: `Recovery checklist`
  - `[x] Protein`
  - `[x] Carbs`
  - `[x] Water`

Visual / Image:
- Food icons hoặc thumbnails.
- Plate illustration.

Animation:
- Cards xuất hiện như answer stack.
- Food thumbnails pop.
- Checklist tick.

Transition:
- Auto: sau 5s sang Screen 3.
- Click: tap best foods card.

---

### Screen 3 - Final CTA: Smart Recovery Plate

Purpose:
- Màn cuối main content là plate visual + answer summary.

Layout:
- Nutrition plate CTA.
- Plate chia 3 phần: protein, carbs, hydration.

Main content:
- Title: `Your recovery plate`
- Plate labels:
  - `Protein · Greek yogurt / chicken`
  - `Carbs · banana / rice / toast`
  - `Hydration · water + electrolytes`
- Tip: `Best window: 30-90 minutes`
- CTA: `Ask More In App`

Visual / Image:
- Plate top-view illustration.
- Icons: protein, banana/rice, water bottle.

Animation:
- Plate sections fill lần lượt.
- Labels fly out from plate segments.
- CTA appears as nutrition tag sticker.

Transition:
- Không autoNext.
- Click plate/tag/CTA -> mở `{{appStoreUrl}}`.

---

# USER CASE 07 - AI Travel Planner

## Scenario 7A - 3-Day Plan: Tokyo Itinerary

### Goal
Đây là ví dụ cần chi tiết nhiều nhất: mỗi ngày phải có hoạt động, tiêu sài, travel, shopping, nghỉ ngơi, icon rõ.

### Screen 1 - Destination & Trip Style Input

Purpose:
- Cho user thấy chỉ cần nhập điểm đến + số ngày + style là AI lập plan.

Layout:
- Travel search card.
- Destination input + trip style chips.

Main content:
- Headline: `Plan a 3-day Tokyo trip in seconds`
- Input:
  - `Tokyo`
  - `3 days`
- Style chips:
  - `Foodie`
  - `Shopping`
  - `Culture`
  - `Relaxed pace`
- Budget chip:
  - `Mid-range`

Visual / Image:
- Ảnh/illustration Tokyo skyline có Tokyo Tower hoặc Shibuya crossing.
- Small map pin icon.
- Suitcase icon.

Animation:
- Destination text type dần.
- Chips attach vào search card.
- Map pin drop vào Tokyo.

Transition:
- Auto: sau 3.8s chuyển Screen 2.
- Click: tap search card/chip bất kỳ để chuyển.

---

### Screen 2 - AI Builds 3-Day Itinerary

Purpose:
- Cho user thấy AI đang build plan theo từng ngày, không chỉ hiện text chung.

Layout:
- 3-column mini itinerary cards hoặc vertical day cards.
- Mỗi ngày có icon và timeline ngắn.

Main content:
- AI status:
  - `Balancing food, shopping, culture, and rest...`
  - `Grouping places by area...`
  - `Estimating travel time and daily spend...`

Day 1 · Shibuya + Harajuku · Icon: city walk
- Morning:
  - `Arrive and check in near Shibuya`
  - `Light breakfast: convenience store onigiri + coffee`
- Afternoon:
  - `Explore Shibuya Crossing`
  - `Visit Hachiko statue`
  - `Walk to Harajuku Takeshita Street`
- Evening:
  - `Dinner: ramen in Shibuya`
  - `Rest at hotel by 21:30`
- Travel:
  - `Use JR/Yamanote line or walk between nearby areas`
- Spend estimate:
  - `Food: ¥3,000 - ¥4,500`
  - `Transport: ¥500 - ¥900`
  - `Shopping: optional ¥3,000+`

Day 2 · Asakusa + Ueno · Icon: temple
- Morning:
  - `Visit Senso-ji Temple early`
  - `Try melon pan or taiyaki street snack`
- Afternoon:
  - `Walk Nakamise Shopping Street`
  - `Move to Ueno Park / museum area`
- Evening:
  - `Izakaya dinner near Ueno`
  - `Slow walk, return hotel early`
- Travel:
  - `Subway Ginza line: Shibuya → Asakusa / Ueno`
- Spend estimate:
  - `Food: ¥3,500 - ¥5,000`
  - `Transport: ¥800 - ¥1,200`
  - `Museum/shopping: ¥1,000 - ¥4,000`

Day 3 · Shinjuku + Shopping · Icon: shopping bag
- Morning:
  - `Coffee + slow start`
  - `Visit Shinjuku Gyoen if weather is good`
- Afternoon:
  - `Shopping around Shinjuku / Lumine / Don Quijote`
  - `Buy souvenirs and skincare/snacks`
- Evening:
  - `Final dinner: sushi or tonkatsu`
  - `Pack luggage and prepare airport route`
- Travel:
  - `JR to Shinjuku, airport train planning at night`
- Spend estimate:
  - `Food: ¥4,000 - ¥6,000`
  - `Transport: ¥700 - ¥1,500`
  - `Shopping: ¥5,000 - ¥15,000`

Visual / Image:
- 3 day cards with icons:
  - Day 1: city/shibuya crossing icon
  - Day 2: temple/lantern icon
  - Day 3: shopping bag/garden icon
- Mini map route line nối Shibuya → Asakusa/Ueno → Shinjuku.

Animation:
- AI build từng day card theo thứ tự.
- Route line vẽ giữa các khu vực.
- Spend estimate count up nhẹ.

Transition:
- Auto: sau 6s chuyển Screen 3.
- Click: tap Day 1/2/3 card để chuyển ngay.

---

### Screen 3 - Detailed Route & Budget Summary

Purpose:
- Tóm gọn plan thành bản dễ quyết định: route, spend, rest, shopping.

Layout:
- Dashboard itinerary summary.
- Top: route map.
- Bottom: 4 summary cards.

Main content:
- Route summary:
  - `Day 1: Shibuya → Harajuku`
  - `Day 2: Asakusa → Ueno`
  - `Day 3: Shinjuku → Airport prep`
- Summary cards:
  - `Food budget` · `¥10,500 - ¥15,500` · icon bowl
  - `Transport` · `¥2,000 - ¥3,600` · icon train
  - `Shopping` · `Flexible ¥8,000+` · icon bag
  - `Rest time` · `Hotel return before 22:00` · icon moon
- Smart tip:

```txt
AI Tip: Keep Day 2 slower because Asakusa + Ueno involves more walking.
```

Visual / Image:
- Simple Tokyo route map illustration.
- Icons for food/train/shopping/rest.
- Mini weather chip optional: `Check rain before Day 3`.

Animation:
- Route path draws across map.
- Budget cards flip in.
- Rest card moon icon dims background slightly.

Transition:
- Auto: sau 5s chuyển Screen 4.
- Click: tap map route or budget card.

---

### Screen 4 - Final CTA: Interactive 3-Day Travel Board

Purpose:
- Màn cuối main content là 3-day plan đầy đủ dạng board, CTA mời mở app để xem full plan/edit/bookmark.

Layout:
- Travel board CTA.
- 3 ngày dạng vertical itinerary cards, có icon lớn riêng từng ngày.
- CTA dạng “passport stamp” hoặc “trip ticket”, không dùng arrow nhỏ.

Main content:
- Header: `Your Tokyo 3-Day Plan is Ready`
- Day cards:
  - `Day 1 · Shibuya + Harajuku`
    - `Food: ramen + street snacks`
    - `Travel: mostly walking + JR`
    - `Shopping: Harajuku small shops`
    - `Rest: back by 21:30`
  - `Day 2 · Asakusa + Ueno`
    - `Culture: Senso-ji Temple`
    - `Food: taiyaki + izakaya`
    - `Travel: subway route grouped by area`
    - `Rest: slower walking day`
  - `Day 3 · Shinjuku + Souvenirs`
    - `Relax: garden or coffee morning`
    - `Shopping: Don Quijote / Lumine`
    - `Food: sushi or tonkatsu dinner`
    - `Travel: airport prep route`
- Total estimate badge:
  - `Estimated daily spend: ¥7,000 - ¥15,000/day`
- CTA: `Open Full Itinerary`

Visual / Image:
- Background: soft Tokyo map.
- Day icons:
  - city crossing
  - temple lantern
  - shopping bag / garden leaf
- CTA visual: passport stamp card hoặc boarding pass style.

Animation:
- 3 day cards fold out như travel brochure.
- Passport stamp hits card with a thump.
- CTA ticket glows and slightly lifts.

Transition:
- Không autoNext.
- Click any day card, passport stamp, or CTA -> mở `{{appStoreUrl}}`.

---

## Scenario 7B - Quick Travel Quiz: Find My Trip Style

### Goal
Dùng quick questions để AI recommend trip style.

### Screen 1 - Choose Travel Style

Purpose:
- Tương tác nhanh và cá nhân hóa.

Layout:
- 4 large option cards.

Main content:
- Question: `What kind of trip do you want?`
- Options:
  - `Budget explorer` · coin icon
  - `Luxury escape` · diamond icon
  - `Foodie trip` · bowl icon
  - `Family friendly` · family icon
- Auto selected: `Foodie trip`

Visual / Image:
- Collage nhỏ: street food, hotel, museum, family park.

Animation:
- Cards appear as postcards.
- Selected card gets stamp `Picked`.

Transition:
- Auto: sau 3.5s chọn Foodie và sang Screen 2.
- Click: tap option card.

---

### Screen 2 - AI Recommendation Cards

Purpose:
- Hiển thị trip recommendation có chỗ ăn, khu vực, giờ nghỉ.

Layout:
- Recommendation cards stack.

Main content:
- Card 1: `Best area to stay`
  - `Shinjuku or Shibuya for easy food access and transport.`
- Card 2: `Food route`
  - `Morning: café`
  - `Lunch: ramen`
  - `Snack: taiyaki`
  - `Dinner: izakaya`
- Card 3: `Shopping add-on`
  - `Don Quijote for snacks and souvenirs.`
- Card 4: `Rest plan`
  - `Add one slow morning after a late food night.`

Visual / Image:
- Food thumbnails: ramen, taiyaki, izakaya table.
- Map pin per area.

Animation:
- Food cards slide up like menu items.
- Map pin bounces on Shinjuku/Shibuya.
- Rest card dims warm night mode.

Transition:
- Auto: sau 5s sang Screen 3.
- Click: tap food route card.

---

### Screen 3 - Final CTA: Personalized Foodie Trip Board

Purpose:
- Màn cuối main content là food route board.

Layout:
- Menu-board style CTA.
- Main content là daily food route.

Main content:
- Title: `Your Foodie Trip Match`
- Route:
  - `Breakfast · café near station`
  - `Lunch · ramen street`
  - `Snack · taiyaki / melon pan`
  - `Dinner · izakaya alley`
- Travel note:
  - `Stay near Shinjuku for late-night food + easy train access.`
- CTA: `Get Full Itinerary`

Visual / Image:
- Food route board giống menu nhà hàng.
- Icons: coffee, ramen, snack, dinner lantern.

Animation:
- Menu items được viết như chalkboard.
- Food icons pop.
- CTA hiện như reservation ticket.

Transition:
- Không autoNext.
- Click menu board/reservation ticket/CTA -> mở `{{appStoreUrl}}`.

---

## Scenario 7C - Travel Assistant Chat: Bali Packing List

### Goal
Cho user hỏi một câu travel cụ thể và nhận packing checklist chi tiết.

### Screen 1 - Travel Question

Purpose:
- Hook bằng câu hỏi du lịch thực tế.

Layout:
- Chat prompt over suitcase image.

Main content:
- User question:

```txt
What should I pack for Bali in July?
```

- Context chips:
  - `Beach`
  - `Warm weather`
  - `7 days`
  - `Carry-on only`

Visual / Image:
- Suitcase mở, có đồ bơi/kính mát/hộ chiếu.
- Bali beach illustration.

Animation:
- Chips rơi vào suitcase.
- Question bubble type dần.

Transition:
- Auto: sau 3.8s sang Screen 2.
- Click: tap suitcase or chip.

---

### Screen 2 - AI Packing Answer Stream

Purpose:
- Tạo packing list có nhóm đồ, weather note, tips.

Layout:
- Checklist grouped by category.

Main content:
- Weather note:

```txt
Bali in July is warm and relatively dry, but you should still prepare for sun, beach, and light rain.
```

- Packing list:
  - Clothing:
    - `Light shirts x5`
    - `Shorts x3`
    - `Swimwear x2`
    - `Light jacket x1`
  - Essentials:
    - `Sunscreen`
    - `Reusable water bottle`
    - `Travel adapter`
    - `Passport copy`
  - Beach:
    - `Sandals`
    - `Dry bag`
    - `Sunglasses`
  - Health:
    - `Basic medicine`
    - `Mosquito repellent`

Visual / Image:
- Category icons: shirt, sun, plug, medicine, beach.
- Suitcase sections.

Animation:
- Items fly into suitcase by category.
- Checklist ticks as items land.
- Weather note slides in as info card.

Transition:
- Auto: sau 5.5s sang Screen 3.
- Click: tap suitcase/checklist group.

---

### Screen 3 - Final CTA: Smart Suitcase Checklist

Purpose:
- Màn cuối là suitcase checklist result, CTA mở app để customize/download.

Layout:
- Suitcase open view + checklist side panel.

Main content:
- Title: `Your Bali packing list is ready`
- Checklist summary:
  - `12 clothing items`
  - `7 essentials`
  - `4 beach items`
  - `3 health items`
- Must-have highlight:
  - `Sunscreen`
  - `Travel adapter`
  - `Mosquito repellent`
- CTA: `Ask AI Travel Guide`

Visual / Image:
- Suitcase illustration filled with items.
- Highlight icons for must-have.

Animation:
- Suitcase closes halfway then opens to reveal organized packing.
- Must-have icons bounce one by one.
- CTA appears as luggage tag attached to suitcase handle.

Transition:
- Không autoNext.
- Click luggage tag/suitcase/CTA -> mở `{{appStoreUrl}}`.

---

# USER CASE 08 - AI Finance / Budget Planner

## Scenario 8A - Monthly Budget Plan

### Goal
Cho user thấy AI chia ngân sách cụ thể, có category và checklist.

### Screen 1 - Income Input

Purpose:
- Thu thập income và mục tiêu đơn giản.

Layout:
- Number input + goal chips.

Main content:
- Headline: `Build a smarter monthly budget`
- Input:
  - `Monthly income: $2,500`
- Goal chips:
  - `Save more`
  - `Cut subscriptions`
  - `Emergency fund`
- Selected: `Save more`

Visual / Image:
- Wallet illustration.
- Coin stack icon.

Animation:
- Number `$2,500` count up.
- Goal chip `Save more` locks in.

Transition:
- Auto: sau 3.5s sang Screen 2.
- Click: tap income input or chip.

---

### Screen 2 - AI Budget Breakdown

Purpose:
- Tạo breakdown cụ thể theo category.

Layout:
- Ring chart + category cards.

Main content:
- Budget allocation:
  - `Essentials: $1,250 · rent, bills, groceries`
  - `Savings: $500 · emergency fund`
  - `Flexible: $450 · food out, shopping`
  - `Debt/Goals: $200 · extra payments`
  - `Buffer: $100 · unexpected costs`
- AI note:

```txt
AI suggests saving 20% first, then limiting flexible spending to avoid overspending late in the month.
```

Visual / Image:
- Ring/pie chart.
- Icons: home, piggy bank, shopping bag, target, shield.

Animation:
- Ring chart fills segment by segment.
- Category cards slide in matching chart colors.
- Savings segment pulses.

Transition:
- Auto: sau 5s sang Screen 3.
- Click: tap savings segment/category card.

---

### Screen 3 - Budget Checklist

Purpose:
- Biến budget thành tasks cụ thể.

Layout:
- Checklist + spending caps.

Main content:
- Checklist:
  - `[x] Move $500 to savings first`
  - `[x] Set food-out cap to $180`
  - `[x] Review subscriptions this week`
  - `[ ] Add emergency fund goal`
- Spending caps:
  - `Groceries: $350`
  - `Dining out: $180`
  - `Shopping: $120`
  - `Transport: $150`

Visual / Image:
- Ledger/notebook card.
- Cap icons per category.

Animation:
- Checklist tick.
- Caps appear like labels on a budget envelope.

Transition:
- Auto: sau 4s sang Screen 4.
- Click: tap checklist/cap card.

---

### Screen 4 - Final CTA: Budget Ring Dashboard

Purpose:
- Màn cuối là dashboard budget hoàn chỉnh.

Layout:
- Dashboard CTA với ring chart lớn.

Main content:
- Title: `Your monthly budget is ready`
- Ring chart center: `$2,500 planned`
- Insight cards:
  - `Save: $500/month`
  - `Flexible cap: $450`
  - `Emergency buffer: $100`
- CTA: `Create My Budget`

Visual / Image:
- Ring chart large center.
- Category cards around chart.

Animation:
- Ring chart completes 360 độ.
- Savings card floats forward.
- CTA appears as “budget card” with lock/unlock animation.

Transition:
- Không autoNext.
- Click chart/card/CTA -> mở `{{appStoreUrl}}`.

---

## Scenario 8B - Spending Review

### Goal
Cho user thấy AI tìm ra chỗ tiêu tiền lãng phí.

### Screen 1 - Spending Categories

Purpose:
- Setup các category spending.

Layout:
- Category bubbles.

Main content:
- Headline: `Where did your money go?`
- Categories:
  - `Food · $420`
  - `Transport · $160`
  - `Shopping · $310`
  - `Subscriptions · $96`
- Prompt: `AI reviews your spending patterns.`

Visual / Image:
- Bank card / receipt illustration.
- Category icons.

Animation:
- Category bubbles rise like bubbles.
- Highest spend `Food` grows larger.

Transition:
- Auto: sau 3.5s sang Screen 2.
- Click: tap category bubble.

---

### Screen 2 - AI Insight Cards

Purpose:
- AI phân tích và đưa insight cụ thể.

Layout:
- Insight card list.

Main content:
- Insight 1:
  - `Food spending is 28% higher than last month.`
- Insight 2:
  - `You have 4 overlapping subscriptions.`
- Insight 3:
  - `Shopping spikes every weekend.`
- Quick saving ideas:
  - `Cancel 1 unused subscription: save $12/month`
  - `Set weekend shopping cap: save $60/month`
  - `Meal prep 2 days/week: save $80/month`

Visual / Image:
- Small bar chart.
- Warning + idea icons.

Animation:
- Bar chart grows.
- Insight cards slide in from bottom.
- Savings amounts count up.

Transition:
- Auto: sau 5s sang Screen 3.
- Click: tap saving idea card.

---

### Screen 3 - Final CTA: Money Leak Finder

Purpose:
- Màn cuối là dashboard “money leaks found”, CTA mở app để xem full review.

Layout:
- Leak finder dashboard.

Main content:
- Title: `AI found 3 money leaks`
- Leak cards:
  - `Subscriptions · Save $12/mo`
  - `Weekend shopping · Save $60/mo`
  - `Food delivery · Save $80/mo`
- Total potential saving:
  - `$152/month`
- CTA: `See Full Insights`

Visual / Image:
- Dashboard with leak icons: dripping coin, subscription icon, shopping bag.
- Big `$152/month` center.

Animation:
- Coin leak drops into savings jar.
- `$152` count up strongly.
- CTA appears as savings jar lid opening.

Transition:
- Không autoNext.
- Click savings jar/leak cards/CTA -> mở `{{appStoreUrl}}`.

---

## Scenario 8C - Savings Goal Coach

### Goal
Cho user thấy AI tạo roadmap tiết kiệm theo mục tiêu.

### Screen 1 - Choose Savings Goal

Purpose:
- Cá nhân hóa mục tiêu.

Layout:
- Goal cards.

Main content:
- Question: `What are you saving for?`
- Goal cards:
  - `New phone · $900`
  - `Emergency fund · $2,000`
  - `Vacation · $1,500`
  - `Laptop · $1,200`
- Selected: `Vacation · $1,500`

Visual / Image:
- Vacation icon: plane/beach.
- Coin stack.

Animation:
- Goal cards appear as goal tickets.
- Selected vacation card gets destination stamp.

Transition:
- Auto: sau 3.5s sang Screen 2.
- Click: tap goal.

---

### Screen 2 - AI Savings Plan

Purpose:
- AI chia mục tiêu thành monthly/weekly action.

Layout:
- Roadmap timeline.

Main content:
- Plan:

```txt
Goal: Vacation fund · $1,500
Timeline: 6 months
Monthly target: $250
Weekly target: $63
```

- Cut suggestions:
  - `Reduce delivery food by $25/week`
  - `Pause unused subscription: $12/month`
  - `Move savings on payday automatically`
- Checkpoints:
  - `Month 1: $250`
  - `Month 3: $750`
  - `Month 6: $1,500`

Visual / Image:
- Roadmap with plane moving toward beach.
- Checkpoint flags.

Animation:
- Plane moves from checkpoint 1 to 3.
- Target numbers count up.
- Suggestions cards flip in.

Transition:
- Auto: sau 5s sang Screen 3.
- Click: tap roadmap/checkpoint.

---

### Screen 3 - Final CTA: Savings Roadmap

Purpose:
- Màn cuối là roadmap đạt mục tiêu, CTA mở app để track.

Layout:
- Savings roadmap CTA.

Main content:
- Title: `Your $1,500 vacation plan`
- Roadmap:
  - `Week 1 · Save $63`
  - `Month 1 · Reach $250`
  - `Month 3 · Reach $750`
  - `Month 6 · Vacation ready`
- CTA: `Start Saving`
- Highlight: `AI will track your weekly progress.`

Visual / Image:
- Plane/road path to beach.
- Coin checkpoints.

Animation:
- Path draws across screen.
- Coin checkpoints pop.
- Final beach flag waves, CTA embedded as final flag.

Transition:
- Không autoNext.
- Click final flag/roadmap/CTA -> mở `{{appStoreUrl}}`.

---

# USER CASE 09 - AI Agent / Automation

## Scenario 9A - Delegate a Task: Weekly Content Plan

### Goal
Cho user thấy AI agent có thể chia task lớn thành output cụ thể.

### Screen 1 - Task Input

Purpose:
- User giao việc cho agent.

Layout:
- Command input + task examples.

Main content:
- Headline: `Delegate work to your AI agent`
- Task input:

```txt
Create a weekly content plan for my product.
```

- Chips:
  - `Instagram`
  - `TikTok`
  - `Email`
  - `Product launch`

Visual / Image:
- Agent robot/avatar nhỏ.
- Command terminal-style card.

Animation:
- Command type dần.
- Agent avatar wake up.
- Chips attach to task input.

Transition:
- Auto: sau 3.8s sang Screen 2.
- Click: tap command input.

---

### Screen 2 - Agent Planning Steps

Purpose:
- Hiển thị agent không trả lời ngay mà lập plan có step.

Layout:
- Agent workflow timeline.

Main content:
- Agent steps:
  - `1. Understand product goal`
  - `2. Pick 3 content angles`
  - `3. Create post schedule`
  - `4. Draft hooks`
  - `5. Add KPI checklist`
- Status per step:
  - `done`
  - `running`
  - `queued`

Visual / Image:
- Workflow nodes nối nhau.
- Agent avatar đi qua từng node.

Animation:
- Nodes light up sequentially.
- Agent avatar moves along path.
- Running node has subtle spinner.

Transition:
- Auto: sau 4.5s sang Screen 3.
- Click: tap workflow node.

---

### Screen 3 - Output Cards

Purpose:
- Hiển thị kết quả agent cụ thể: content calendar.

Layout:
- Calendar/card grid.

Main content:
- Monday card:
  - `Hook: 3 mistakes slowing your workflow`
  - `Format: TikTok short`
- Wednesday card:
  - `Hook: Before/after using AI assistant`
  - `Format: Carousel`
- Friday card:
  - `Hook: Weekly productivity checklist`
  - `Format: Email + post`
- KPI checklist:
  - `[x] Clear hook`
  - `[x] Platform matched`
  - `[x] CTA included`
  - `[ ] Add brand image`

Visual / Image:
- Calendar grid with platform icons.
- Mini content thumbnails.

Animation:
- Calendar cells fill one by one.
- Platform icons pop.
- KPI checklist ticks.

Transition:
- Auto: sau 5s sang Screen 4.
- Click: tap Monday/Wednesday/Friday card.

---

### Screen 4 - Final CTA: Agent Content Calendar

Purpose:
- Màn cuối main content là content calendar ready.

Layout:
- Calendar board CTA.
- CTA là agent “run more tasks” panel.

Main content:
- Title: `Your content week is ready`
- Calendar:
  - `Mon · TikTok hook`
  - `Wed · Carousel idea`
  - `Fri · Email + post`
- Agent summary:
  - `3 posts planned`
  - `3 hooks drafted`
  - `1 KPI checklist created`
- CTA: `Automate With AI`

Visual / Image:
- Calendar board chiếm phần lớn màn hình.
- Agent avatar đứng cạnh như đã hoàn thành task.

Animation:
- Agent avatar stamp `Done` lên calendar.
- Calendar cards fan out.
- CTA như command button lớn có terminal glow.

Transition:
- Không autoNext.
- Click calendar/agent/CTA -> mở `{{appStoreUrl}}`.

---

## Scenario 9B - Multi-Step Workflow: Outreach Automation

### Goal
Cho user thấy một workflow nhiều bước từ input đến output.

### Screen 1 - Choose Workflow

Purpose:
- User chọn workflow muốn tự động hóa.

Layout:
- Workflow cards.

Main content:
- Headline: `What should your AI agent run?`
- Workflows:
  - `Summarize leads`
  - `Write outreach`
  - `Create report`
  - `Organize tasks`
- Selected: `Write outreach`

Visual / Image:
- Workflow icons: leads, email, chart, task board.

Animation:
- Cards enter as app tiles.
- Selected workflow expands into pipeline preview.

Transition:
- Auto: sau 3.5s sang Screen 2.
- Click: tap workflow card.

---

### Screen 2 - Step Runner

Purpose:
- Hiển thị workflow chạy qua từng step.

Layout:
- Horizontal pipeline.

Main content:
- Pipeline:
  - `Input leads`
  - `Segment audience`
  - `Draft messages`
  - `Review tone`
  - `Ready to send`
- Current status:
  - `Drafting 3 personalized messages...`

Visual / Image:
- Pipeline nodes và moving dot.
- Email envelope icons.

Animation:
- Moving dot chạy qua pipeline.
- Mỗi node hoàn thành đổi sang check.
- Email draft cards xuất hiện nhỏ phía dưới.

Transition:
- Auto: sau 4.5s sang Screen 3.
- Click: tap moving dot/pipeline.

---

### Screen 3 - Result Summary

Purpose:
- Hiển thị output workflow chi tiết.

Layout:
- 3 email preview cards.

Main content:
- Email 1:
  - `For startup founder`
  - Subject: `Quick idea to save your team 5 hours/week`
- Email 2:
  - `For marketing manager`
  - Subject: `Turn campaign notes into ready-to-send content`
- Email 3:
  - `For operations lead`
  - Subject: `Automate repetitive follow-ups with AI`
- Quality checklist:
  - `[x] Personalized opener`
  - `[x] Clear value prop`
  - `[x] Soft CTA`

Visual / Image:
- Email cards with recipient avatars.
- Quality checklist badge.

Animation:
- Email cards stack in.
- Subjects type dần.
- Checklist ticks.

Transition:
- Auto: sau 5s sang Screen 4.
- Click: tap email preview.

---

### Screen 4 - Final CTA: Automation Pipeline Complete

Purpose:
- Màn cuối main content là workflow complete board, CTA mở app để chạy workflow thật.

Layout:
- Pipeline dashboard CTA.

Main content:
- Title: `Outreach workflow complete`
- Stats:
  - `3 messages drafted`
  - `3 audience segments`
  - `1 review checklist`
- Pipeline shown as complete:
  - `Input → Segment → Draft → Review → Ready`
- CTA: `Run This Workflow`

Visual / Image:
- Pipeline line lớn với all green check.
- Email stack ở cuối pipeline.

Animation:
- Pipeline nodes glow all at once.
- Email stack lifts up.
- CTA appears as “Run again” command block.

Transition:
- Không autoNext.
- Click pipeline/email stack/CTA -> mở `{{appStoreUrl}}`.

---

# USER CASE 10 - AI Personal Recommendation / Quick Questions

## Scenario 10A - 3 Quick Questions: Personalized AI Plan

### Goal
Dùng quiz 2-3 câu để tạo personalized plan, cuối có plan preview.

### Screen 1 - Goal Question

Purpose:
- Thu thập mục tiêu chính.

Layout:
- Question card + option chips.

Main content:
- Question: `What do you want AI to help with?`
- Options:
  - `Save time`
  - `Learn faster`
  - `Create content`
  - `Stay organized`
- Selected: `Save time`

Visual / Image:
- Abstract productivity icons.
- Selected option có timer icon.

Animation:
- Options bounce in.
- Selected chip grows and locks.

Transition:
- Auto: sau 3.5s chọn Save time sang Screen 2.
- Click: tap option.

---

### Screen 2 - Time Available Question

Purpose:
- Làm plan cảm giác cá nhân hóa hơn.

Layout:
- Time picker cards.

Main content:
- Question: `How much time do you have daily?`
- Options:
  - `5 min`
  - `10 min`
  - `20 min`
  - `30 min`
- Selected: `10 min/day`
- Microcopy: `AI will build a realistic plan.`

Visual / Image:
- Clock ring.
- Time cards around ring.

Animation:
- Clock hand rotates to 10.
- Selected time card snaps into center.

Transition:
- Auto: sau 3.5s sang Screen 3.
- Click: tap time card.

---

### Screen 3 - AI Personalized Result

Purpose:
- Generate plan có action cards rõ ràng.

Layout:
- Personalized plan cards.

Main content:
- Result title: `Your 10-minute AI productivity plan`
- Action cards:
  - `Minute 0-2 · Brain dump tasks`
  - `Minute 2-5 · AI groups them by priority`
  - `Minute 5-8 · Pick top 3 actions`
  - `Minute 8-10 · Start first tiny task`
- Checklist:
  - `[x] Daily plan`
  - `[x] Priority grouping`
  - `[x] First action selected`
- Recommendation:

```txt
Best feature for you: AI Daily Planner
```

Visual / Image:
- Timeline card with 10-minute ring.
- AI planner icon.

Animation:
- Timeline fills minute by minute.
- Cards appear as segments.
- Best feature card glow.

Transition:
- Auto: sau 5s sang Screen 4.
- Click: tap best feature card.

---

### Screen 4 - Final CTA: Personalized Plan Unlock

Purpose:
- Màn cuối main content là plan cá nhân hóa, CTA unlock full.

Layout:
- Personal plan card + unlock layer.

Main content:
- Title: `Your AI plan is ready`
- Plan summary:
  - `Goal: Save time`
  - `Daily time: 10 minutes`
  - `Recommended feature: AI Daily Planner`
- Locked extras preview:
  - `7-day plan`
  - `Task reminders`
  - `Progress tracking`
- CTA: `Unlock My Full Plan`

Visual / Image:
- Plan card lớn với locked sections mờ.
- Lock icon chuyển thành open icon.

Animation:
- Locked sections shimmer.
- Lock opens, revealing CTA.
- CTA card rises like premium unlock.

Transition:
- Không autoNext.
- Click unlock layer/plan card/CTA -> mở `{{appStoreUrl}}`.

---

## Scenario 10B - Swipe Choice Experience: Find Best AI Feature

### Goal
Tạo interaction kiểu swipe để chọn preference, cuối ra feature recommendation.

### Screen 1 - Swipe Preference Cards

Purpose:
- Tạo tương tác vui, không phải form truyền thống.

Layout:
- Swipe card stack.

Main content:
- Headline: `Swipe what you need most`
- Cards:
  - `Write faster`
  - `Plan better`
  - `Learn daily`
  - `Edit images`
- Instruction: `Swipe right if useful`
- Auto selected:
  - `Write faster`
  - `Plan better`

Visual / Image:
- Cards giống dating app nhưng cho AI feature.
- Icons: pencil, calendar, book, image.

Animation:
- Top card wiggle left/right.
- Auto swipe right sau 2s nếu user không thao tác.
- Accepted card bay sang phải với check.

Transition:
- Auto: sau 4s sang Screen 2.
- Click/swipe card để chuyển sau 2 accepted choices.

---

### Screen 2 - AI Matching Result

Purpose:
- AI phân tích choices và đề xuất feature phù hợp.

Layout:
- Match score card.

Main content:
- Match result:
  - `Best match: AI Writing + Daily Planner`
- Match score: `94% match`
- Reasons:
  - `You want faster writing`
  - `You need clearer daily structure`
  - `You prefer quick wins`
- Recommended starter actions:
  - `Generate 3 captions`
  - `Plan tomorrow in 5 minutes`
  - `Rewrite one email`

Visual / Image:
- Match radar / score circle.
- Feature icons combined.

Animation:
- Score circle fills to 94%.
- Reasons appear as check chips.
- Recommended actions slide up as stack.

Transition:
- Auto: sau 5s sang Screen 3.
- Click: tap score circle/action card.

---

### Screen 3 - Final CTA: Feature Match Stack

Purpose:
- Màn cuối main content là recommended feature stack, CTA mở app để dùng feature phù hợp.

Layout:
- Match stack CTA.
- Feature cards xếp tầng.

Main content:
- Title: `Your best AI feature match`
- Main card: `AI Writing Assistant`
  - `Generate captions, emails, and posts faster.`
- Second card: `AI Daily Planner`
  - `Turn messy tasks into a simple day plan.`
- Third card: `Quick Rewrite`
  - `Improve weak text instantly.`
- CTA: `See More In App`

Visual / Image:
- Feature cards stacked with icons.
- Score badge `94% match` pinned on top.

Animation:
- Cards fan out vertically.
- Score badge lands with bounce.
- CTA appears as large matching result pill, not arrow/button combo.

Transition:
- Không autoNext.
- Click match stack/score badge/CTA -> mở `{{appStoreUrl}}`.

---

# 5. CTA Layout Anti-Duplication Guide

Để tránh trùng lặp, khi tạo scenario mới hãy chọn CTA layout khác nhau theo loại kết quả:

| Result type | CTA layout nên dùng | Main content bắt buộc |
|---|---|---|
| AI text/email | Document preview, result card, copy sheet | Text result đầy đủ hoặc excerpt rõ |
| AI list/checklist | Checklist board, task board, roadmap | Checklist có item cụ thể |
| AI image/avatar | Full image hero, gallery, avatar wheel | Ảnh lớn / grid ảnh |
| AI travel/plan | Itinerary board, map route, ticket/passport | Plan từng ngày/tuyến cụ thể |
| AI dashboard/finance | Score/ring/chart dashboard | Metric/score/insight rõ |
| AI quiz/learning | Reward badge, flashcard stack, streak card | Answer/lesson/streak result |
| AI agent/workflow | Pipeline complete, calendar board, output stack | Workflow output cụ thể |
| AI fitness/meal | Timer hero, meal calendar, plate visual | Routine/meal plan cụ thể |

Không nên lặp lại quá nhiều:

```txt
small arrow → button
button dưới cùng giống nhau
chỉ có text “Install now”
CTA không có main result
```

---

# 6. JSON Pattern cho mỗi Screen

```json
{
  "id": "screen_2_ai_streaming_result",
  "purpose": "Show AI result with detailed structured output",
  "layout": "streaming-card-list",
  "mainContent": {
    "title": "Your plan is ready",
    "sections": [
      {
        "type": "checklist",
        "items": ["Item 1", "Item 2", "Item 3"]
      },
      {
        "type": "cards",
        "items": ["Card 1", "Card 2"]
      }
    ]
  },
  "visual": {
    "imageDescription": "Mock calendar with colored blocks and small AI avatar",
    "icons": ["calendar", "clock", "check"]
  },
  "animation": {
    "description": "Text streams line by line; cards slide in; checkmarks pop when each item appears"
  },
  "transition": {
    "autoNext": {
      "enabled": true,
      "afterMs": 4000,
      "target": "screen_3"
    },
    "clickNext": {
      "enabled": true,
      "target": "screen_3",
      "clickArea": "main_result_card"
    }
  }
}
```

---

# 7. Implementation Notes cho Claude / Builder

Khi Claude generate playable từ tài liệu này:

1. Không được chỉ ghi “AI shows result”. Phải ghi rõ result gồm gì.
2. Nếu là travel plan, phải có từng ngày, hoạt động, di chuyển, chi phí, nghỉ ngơi, icon.
3. Nếu là finance, phải có số tiền, category, saving estimate, chart/score.
4. Nếu là fitness/meal, phải có món/bài tập/timeline cụ thể.
5. Nếu là writing, phải có text before/after hoặc output mẫu hoàn chỉnh.
6. Nếu là image, phải mô tả rõ ảnh cần tạo/hiển thị.
7. Màn cuối phải dùng main result làm nội dung chính.
8. CTA cuối phải visually strong và khác nhau giữa các scenario.
9. Mỗi non-final screen phải có auto chuyển sau 3-4s hoặc click/tap chuyển ngay.
10. Không dùng cùng một CTA layout quá 2 lần liên tiếp trong cùng một campaign pack.

---

# 8. Final Principle

Playable tốt không chỉ là kịch bản.

Playable tốt phải là:

```txt
một chuỗi màn hình có logic
→ mỗi màn có nội dung đủ rõ
→ chuyển tiếp có lý do
→ AI result đủ chi tiết để thấy giá trị
→ màn cuối dùng chính kết quả đó làm điểm thu hút
→ CTA nổi bật và khác biệt
```
