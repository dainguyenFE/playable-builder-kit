/**
 * Template catalog from docs/AI_PLAYABLE_USER_CASE_SCENARIOS_V3_SCREEN_DETAIL.md
 * 10 user cases · 14 catalog templates · V3 screen-level detail
 */
import { bgGrad, img, icon, SHARED_CONTEXT_CTA } from "./cta-presets.mjs";
import { v3MetaGuide } from "./v3-screen-contract.mjs";
import {
  stickyNotesHookScreen,
  promptWithChipsScreen,
  hookScreen,
  promptScreen,
  streamScreen,
  quizScreen,
  beforeTextScreen,
  scoreScreen,
  aiProcessingScreen,
  valueSummaryScreen,
  resultCardsScreen,
  imageGalleryScreen,
  compareScreen,
  checkpointScreen,
  agentStepsScreen,
  agentOutputScreen,
  ctaWithResult,
} from "./scenario-builders.mjs";

const I2I = [img("img-before", "i2i-before.jpg", "Before"), img("img-after", "i2i-after.jpg", "After")];
const CHAT_IMG = [img("img-chat-hero", "chat-hero.jpg", "Chat"), img("img-chat-answer", "chat-answer.jpg", "Chart")];
const T2I = [img("img-t2i", "t2i-cyberpunk.jpg", "Art")];
const PLAN = [img("img-plan", "plan-board.jpg", "Board")];
const PRODUCT = [img("img-product", "writing-doc.jpg", "Product")];

function meta(id, name, userCase, scenario, screenCount, flow, description, scenarioGuide, theme = "midnight-blue", themes) {
  return {
    id,
    name,
    userCase,
    scenario,
    screenCount,
    flow,
    description,
    scenarioGuide,
    defaultTheme: theme,
    themes: themes ?? [theme, "violet-pro"],
  };
}

function ctx(overrides) {
  return { ...SHARED_CONTEXT_CTA, ...overrides };
}

/** @returns {Record<string, { meta, context, scenario, assets }>} */
export function buildUserCaseCatalog() {
  const catalog = {};

  // ─── UC01 Chat · 1A (4 screens) — Weekly Planning Assistant ───
  catalog["ai-chat-ask-solve"] = {
    meta: meta(
      "ai-chat-ask-solve",
      "Chat · Ask & Solve (1A)",
      "chat",
      "1A",
      4,
      ["hook-sticky", "input", "stream", "cta-calendar"],
      "Chaotic week hook → user question → AI weekly plan stream → CTA with mini calendar hero.",
      v3MetaGuide("1A", "problemHeadline, stickyNote1-5, userQuestion, aiAnswerBlocks, ctaMon-Fri, ctaBadge."),
      "midnight-blue",
      ["midnight-blue", "neon-cyan"],
    ),
    context: ctx({
      productName: "MindLoop",
      backgroundGradient: bgGrad("#3B82F6"),
      problemHeadline: "Your week feels messy?",
      problemSubhead: "Ask AI to turn chaos into a clear plan.",
      stickyNote1: "Meeting notes",
      stickyNote2: "Gym?",
      stickyNote3: "Client follow-up",
      stickyNote4: "Finish report",
      stickyNote5: "Plan weekend",
      hintPill: "Tap to ask AI",
      userQuestion: "Help me plan my week in a simple way.",
      chip1: "Work priorities",
      chip2: "Workout time",
      chip3: "Focus blocks",
      chip4: "Weekend plan",
      inputMicrocopy: "AI understands messy requests.",
      aiAnswerBlocks: [
        { type: "text", text: "Here is a simple weekly plan:" },
        {
          type: "list",
          title: "Top 3 priorities",
          items: [
            "Finish the client report by Wednesday",
            "Batch all follow-up emails on Tuesday",
            "Keep Friday afternoon for review",
          ],
        },
        {
          type: "list",
          title: "Focus blocks",
          items: ["Mon 9:00 - 10:30: Deep work", "Tue 14:00 - 15:00: Email batch", "Wed 10:00 - 11:30: Report polish"],
        },
        {
          type: "list",
          title: "Wellness slots",
          items: ["Tue evening: 30-min workout", "Thu morning: short walk", "Sat: reset and grocery planning"],
        },
        {
          type: "list",
          title: "Checklist",
          items: ["✓ Pick top 3 priorities", "✓ Add focus blocks", "✓ Reserve workout time", "○ Review on Friday"],
        },
        { type: "card", title: "Priority 1 · Client report · Wed", text: "Focus block · 90 min · No meetings" },
        { type: "card", title: "Wellness · Workout · Tue evening", text: "Recommended recovery slot." },
        { type: "progress", label: "Plan readiness", value: 78 },
      ],
      ctaHeadline: "Your AI Weekly Plan is Ready",
      ctaSubhead: "Open the full plan with calendar blocks and reminders.",
      ctaMon: "Mon · Deep work · 9:00",
      ctaTue: "Tue · Email batch · 14:00",
      ctaWed: "Wed · Report finish · 10:00",
      ctaThu: "Thu · Walk + admin · 8:00",
      ctaFri: "Fri · Weekly review · 16:00",
      ctaBadge: "Saved 2.5 hours this week",
      cta: "Open Full Plan",
    }),
    scenario: {
      id: "chat-1a-v3",
      entryScreen: "s1",
      screens: [
        stickyNotesHookScreen({
          headlineKey: "problemHeadline",
          subheadKey: "problemSubhead",
          stickyKeys: ["stickyNote1", "stickyNote2", "stickyNote3", "stickyNote4", "stickyNote5"],
          hintKey: "hintPill",
          next: "s2",
        }),
        promptWithChipsScreen({
          id: "s2",
          promptText: "Help me plan my week in a simple way.",
          chipKeys: ["chip1", "chip2", "chip3", "chip4"],
          microcopyKey: "inputMicrocopy",
          next: "s3",
          durationMs: 4000,
        }),
        streamScreen({ id: "s3", name: "AI plan stream", next: "screen_cta", afterStreamMs: 5000 }),
        ctaWithResult({
          layout: "bottom",
          resultMode: "checklist",
          resultKeys: ["ctaMon", "ctaTue", "ctaWed", "ctaThu", "ctaFri"],
        }),
      ],
    },
    assets: CHAT_IMG,
  };

  // ─── UC01 Chat · 1B (4 screens) — Better Email in 10 Seconds ───
  catalog["ai-chat-qa-cards"] = {
    meta: meta(
      "ai-chat-qa-cards",
      "Chat · Quick Q&A Cards (1B)",
      "chat",
      "1B",
      4,
      ["quiz", "before-email", "stream", "cta-email"],
      "Question picker → bad email before → AI improvement cards → CTA email result sheet.",
      v3MetaGuide("1B", "quizOptions, beforeEmail, aiAnswerBlocks, ctaResult."),
      "neon-cyan",
    ),
    context: ctx({
      productName: "MindLoop",
      backgroundGradient: bgGrad("#06B6D4"),
      quizQuestion: "What do you want AI to fix?",
      quizOptions: [
        { label: "Write better emails", iconId: "lucide-mail", resultText: "Analyzing your email…", targetScreen: "s2" },
        { label: "Plan my day", iconId: "lucide-calendar", resultText: "Structuring your day…", targetScreen: "s2" },
        { label: "Summarize notes", iconId: "lucide-file-text", resultText: "Summarizing key points…", targetScreen: "s2" },
        { label: "Learn faster", iconId: "lucide-zap", resultText: "Creating a study sprint…", targetScreen: "s2" },
      ],
      beforeEmail:
        "Subject: Update\n\nHi,\nJust checking if you saw my last message.\nCan you reply when you can?\nThanks.\n\nIssues: Too vague · Weak subject · No clear next step",
      userQuestion: "Improve this follow-up email",
      aiAnswerBlocks: [
        { type: "card", title: "Subject", text: "Quick follow-up on tomorrow's demo" },
        {
          type: "text",
          text: "Hi Alex,\n\nJust following up on my previous message about tomorrow's demo.\nCould you confirm if the 3 PM slot still works for you?\n\nIf another time is better, I'm happy to adjust.\n\nThanks!",
        },
        {
          type: "list",
          title: "Improvements",
          items: ["✓ Clear subject", "✓ Polite tone", "✓ One specific CTA", "✓ Easy to reply"],
        },
        { type: "list", title: "Tone options", items: ["Professional", "Friendly", "Shorter"] },
      ],
      ctaHeadline: "Your polished email is ready",
      ctaSubhead: "Edit tone, length, and send faster in the app.",
      ctaResult:
        "Subject: Quick follow-up on tomorrow's demo\n\nHi Alex, just following up on my previous message about tomorrow's demo.\nCould you confirm if the 3 PM slot still works for you?",
      cta: "Open AI Writer",
    }),
    scenario: {
      id: "chat-1b-v3",
      entryScreen: "s1",
      screens: [
        quizScreen({ badge: "Quick Q" }),
        beforeTextScreen({ id: "s2", textKey: "beforeEmail", next: "s3", durationMs: 4000, badge: "Before" }),
        streamScreen({ id: "s3", name: "AI email cards", next: "screen_cta", afterStreamMs: 5000 }),
        ctaWithResult({ layout: "overlay", resultMode: "card", resultKey: "ctaResult" }),
      ],
    },
    assets: [icon("mail"), icon("calendar"), icon("file-text"), icon("zap")],
  };

  // ─── UC02 Writing · 2A (4 screens) — Product to 3 Captions ───
  catalog["ai-writing-captions"] = {
    meta: meta(
      "ai-writing-captions",
      "Writing · 3 Captions (2A)",
      "writing",
      "2A",
      4,
      ["input", "generating", "compare", "cta-deck"],
      "Product input → AI generating 3 captions → compare & pick → CTA caption deck.",
      v3MetaGuide("2A", "productInput, result1-3, bestCaption, ctaResult."),
      "rose-creative",
    ),
    context: ctx({
      productName: "CaptionAI",
      backgroundGradient: bgGrad("#EC4899"),
      problemHeadline: "Turn a product into viral captions",
      productInput: "Matcha Energy Drink",
      processingNote: "Finding TikTok hooks…",
      resultsHeadline: "AI recommends Card 2",
      result1: "Short — Clean energy, calm focus, zero crash. 🍵⚡",
      result2: "TikTok — Coffee made me shake. Matcha made me create.",
      result3: "Conversion — Need focus without the crash? Try Matcha Energy today.",
      ctaHeadline: "3 captions ready",
      ctaSubhead: "Try 20+ tones inside the app.",
      ctaResult: "Coffee made me shake. Matcha made me create.",
      ctaDeck1: "TikTok Hook",
      ctaDeck2: "Instagram Caption",
      ctaDeck3: "Sales Caption",
      cta: "Generate More Captions",
    }),
    scenario: {
      id: "write-2a-v3",
      entryScreen: "s1",
      screens: [
        promptScreen({ label: "Product name", promptText: "Matcha Energy Drink", next: "s2", badge: "Captions", durationMs: 3800 }),
        aiProcessingScreen({ id: "s2", badge: "Generating", promptText: "Matcha Energy Drink", promptLabel: "Product", next: "s3", durationMs: 5000 }),
        resultCardsScreen({
          id: "s3",
          name: "Compare captions",
          headlineKey: "resultsHeadline",
          resultKeys: ["result1", "result2", "result3"],
          next: "screen_cta",
          durationMs: 4000,
        }),
        ctaWithResult({ layout: "bottom", resultMode: "card", resultKey: "ctaResult" }),
      ],
    },
    assets: PRODUCT,
  };

  // ─── UC02 Writing · 2B (4 screens) — Weak Copy Rewrite ───
  catalog["ai-writing-rewrite"] = {
    meta: meta(
      "ai-writing-rewrite",
      "Writing · Rewrite Copy (2B)",
      "writing",
      "2B",
      4,
      ["before", "stream", "score", "cta-transform"],
      "Weak copy + issues → AI rewrite stream → score checklist → CTA before/after card.",
      v3MetaGuide("2B", "beforeCopy, aiAnswerBlocks, scoreValue, ctaResult."),
      "violet-pro",
    ),
    context: ctx({
      productName: "CopyLift",
      backgroundGradient: bgGrad("#7C3AED"),
      problemHeadline: "This copy feels weak...",
      beforeCopy: "Our product is good and helps you work faster.\n\nIssues: Generic benefit · No emotion · No clear outcome",
      userQuestion: "Rewrite this for conversion",
      aiAnswerBlocks: [
        { type: "text", text: "Improved version:" },
        {
          type: "text",
          text: "Move faster with an AI workspace that turns scattered ideas into clear, ready-to-use content in seconds.",
        },
        { type: "text", text: "Alternative headline: Create better content before your coffee gets cold." },
        {
          type: "list",
          title: "What improved",
          items: ["✓ Clearer benefit", "✓ Stronger verb", "✓ Specific outcome", "✓ Better CTA"],
        },
      ],
      scoreValue: "Copy Score: 42 → 91",
      issueList: "✓ Clearer benefit\n✓ Stronger verb\n✓ Specific outcome\n✓ Better CTA",
      ctaHeadline: "Your copy is now stronger",
      ctaSubhead: "Unlock unlimited rewrites in the app.",
      ctaResult:
        "Before:\nOur product is good and helps you work faster.\n\nAfter:\nMove faster with an AI workspace that turns scattered ideas into clear, ready-to-use content in seconds.",
      ctaBadge: "+49 copy score",
      cta: "Rewrite My Copy",
    }),
    scenario: {
      id: "write-2b-v3",
      entryScreen: "s1",
      screens: [
        beforeTextScreen({ textKey: "beforeCopy", next: "s2", durationMs: 3500 }),
        streamScreen({ id: "s2", name: "AI rewrite", next: "s3", afterStreamMs: 4500 }),
        scoreScreen({ id: "s3", scoreKey: "scoreValue", issuesKey: "issueList", next: "screen_cta", durationMs: 4000 }),
        ctaWithResult({ layout: "center", resultMode: "card", resultKey: "ctaResult" }),
      ],
    },
    assets: [],
  };

  // ─── UC03 Image · 3A (4 screens) — Futuristic Café ───
  catalog["ai-image-t2i"] = {
    meta: meta(
      "ai-image-t2i",
      "Image · Text To Image (3A)",
      "image",
      "3A",
      4,
      ["prompt", "rendering", "gallery", "cta-image-hero"],
      "Prompt + styles → AI rendering pipeline → 3-image gallery → full image hero CTA.",
      v3MetaGuide("3A", "promptText, style1-4, img-t2i on CTA."),
      "neon-cyan",
    ),
    context: ctx({
      productName: "PixelForge",
      backgroundGradient: bgGrad("#06B6D4"),
      problemHeadline: "Describe it. AI creates it.",
      promptText: "A futuristic café with neon lights, rainy window, cinematic mood",
      galleryHeadline: "4 images ready",
      style1: "Neon café interior",
      style2: "Street view · glowing sign",
      style3: "Cozy futuristic booth",
      style4: "Cinematic rain mood",
      ctaHeadline: "Your AI image is ready",
      ctaSubhead: "Generate unlimited styles in app",
      ctaChip1: "Cinematic",
      ctaChip2: "Neon lights",
      ctaChip3: "Rainy mood",
      cta: "Create Your Image",
    }),
    scenario: {
      id: "image-3a-v3",
      entryScreen: "s1",
      screens: [
        promptScreen({
          label: "Prompt",
          promptText: "A futuristic café with neon lights, rainy window, cinematic mood",
          next: "s2",
          lotte: "lottie-ai-scan",
          badge: "T2I",
          durationMs: 4000,
        }),
        aiProcessingScreen({ id: "s2", badge: "Rendering", next: "s3", durationMs: 4500 }),
        imageGalleryScreen({
          assetId: "img-t2i",
          headlineKey: "galleryHeadline",
          styleKeys: ["style1", "style2", "style3", "style4"],
          next: "screen_cta",
          durationMs: 4500,
        }),
        ctaWithResult({ layout: "bottom", resultMode: "image", assetId: "img-t2i" }),
      ],
    },
    assets: T2I,
  };

  // ─── UC03 Image · 3B (4 screens) — Before / After Photo Fix ───
  catalog["ai-image-before-after"] = {
    meta: meta(
      "ai-image-before-after",
      "Image · Photo Enhance (3B)",
      "image",
      "3B",
      4,
      ["upload", "enhancing", "compare", "cta-showcase"],
      "Blurry upload → AI enhancement scan → before/after slider → enhanced photo hero CTA.",
      v3MetaGuide("3B", "problemHeadline, img-before/after, ctaChip1-3."),
      "emerald-plan",
    ),
    context: ctx({
      productName: "PhotoGlow",
      backgroundGradient: bgGrad("#10B981"),
      problemHeadline: "Fix blurry photos in one tap",
      problemSubhead: "Photo uploaded · Before · Low quality",
      enhanceStatus: "Detecting blur… Boosting light… Restoring details…",
      ctaHeadline: "Photo enhanced by AI",
      ctaSubhead: "Sharper · Brighter · Cleaner",
      ctaChip1: "Sharpen +38%",
      ctaChip2: "Light +24%",
      ctaChip3: "Noise -41%",
      cta: "Enhance My Photos",
    }),
    scenario: {
      id: "image-3b-v3",
      entryScreen: "s1",
      screens: [
        hookScreen({
          headlineKey: "problemHeadline",
          subheadKey: "problemSubhead",
          badge: "Enhance",
          heroAssetId: "img-before",
          next: "s2",
          durationMs: 3500,
        }),
        aiProcessingScreen({ id: "s2", badge: "Enhancing", next: "s3", durationMs: 4000 }),
        compareScreen({ id: "s3", next: "screen_cta", durationMs: 4500 }),
        ctaWithResult({ layout: "bottom", resultMode: "compare" }),
      ],
    },
    assets: I2I,
  };

  // ─── Video · Product Ad (V3 principles — Video Preview CTA §3.3) ───
  catalog["ai-video-product-ad"] = {
    meta: meta(
      "ai-video-product-ad",
      "Video · Product Ad (4A)",
      "video",
      "4A",
      3,
      ["brief", "storyboard", "cta-video-preview"],
      "Product brief → AI storyboard frames → CTA with video preview card.",
      v3MetaGuide("Video §3.3", "productInput, scene1-3, ctaResult video preview."),
      "rose-creative",
    ),
    context: ctx({
      productName: "ClipForge",
      backgroundGradient: bgGrad("#EC4899"),
      problemHeadline: "Turn any product into a video ad",
      productInput: "Matcha Energy Drink",
      goalInput: "Make a 10-second TikTok ad",
      storyboardHeadline: "AI builds your video",
      scene1: "Scene 1 — Hook with product close-up",
      scene2: "Scene 2 — Show energy benefit",
      scene3: "Scene 3 — CTA with product packshot",
      ctaHeadline: "Your video ad is ready",
      ctaSubhead: "10s product ad · Hook · Benefit · CTA",
      ctaResult: "10-second TikTok ad ready to export.\n\nFrame 1: Product close-up\nFrame 2: Energy benefit\nFrame 3: Packshot CTA",
      ctaScene1: "Hook · Product close-up",
      ctaScene2: "Benefit · Energy boost",
      ctaScene3: "CTA · Packshot",
      cta: "Continue editing in app",
    }),
    scenario: {
      id: "video-4a-v3",
      entryScreen: "s1",
      screens: [
        promptScreen({ label: "Product", promptText: "Matcha Energy Drink", next: "s2", badge: "Video", durationMs: 3800 }),
        resultCardsScreen({
          id: "s2",
          name: "Storyboard",
          headlineKey: "storyboardHeadline",
          resultKeys: ["scene1", "scene2", "scene3"],
          next: "screen_cta",
          durationMs: 5000,
        }),
        ctaWithResult({ layout: "bottom", resultMode: "checklist", resultKeys: ["ctaScene1", "ctaScene2", "ctaScene3"] }),
      ],
    },
    assets: PRODUCT,
  };

  // ─── UC04 Resume · 4B (4 screens) — Resume Review ───
  catalog["ai-resume-review"] = {
    meta: meta(
      "ai-resume-review",
      "Resume · Review (4B)",
      "resume",
      "4B",
      4,
      ["upload", "score", "rewrite", "cta-dashboard"],
      "Upload CV → AI score + issues → before/after bullet → CTA score upgrade dashboard.",
      v3MetaGuide("4B", "scoreValue, issueList, ctaResult bullet, ctaScore."),
      "slate-minimal",
    ),
    context: ctx({
      productName: "ResumePro",
      backgroundGradient: bgGrad("#64748B"),
      problemHeadline: "Is your resume strong enough?",
      problemSubhead: "resume.pdf uploaded · 2 pages · Frontend role",
      scoreValue: "74/100",
      issueList:
        "Issues found:\n• Summary is too generic\n• Skills are not prioritized\n• Experience bullets lack numbers\n• Missing portfolio link",
      beforeBullet: "Before:\nBuilt web pages for company website.",
      afterBullet:
        "After:\nBuilt and optimized high-traffic landing pages, improving load speed by 28% and increasing signup conversion by 12%.",
      ctaHeadline: "Resume score can improve to 92/100",
      ctaSubhead: "Rewrite summary · Add impact numbers · Prioritize skills",
      ctaResult: "Best fix:\nBuilt and optimized high-traffic landing pages, improving load speed by 28%.",
      ctaScore: "74 → 92",
      ctaFix1: "Rewrite summary",
      ctaFix2: "Add impact numbers",
      ctaFix3: "Prioritize top skills",
      cta: "Improve Resume Now",
    }),
    scenario: {
      id: "resume-4b-v3",
      entryScreen: "s1",
      screens: [
        hookScreen({ headlineKey: "problemHeadline", subheadKey: "problemSubhead", badge: "Review", next: "s2", durationMs: 3500 }),
        scoreScreen({ id: "s2", scoreKey: "scoreValue", issuesKey: "issueList", next: "s3", durationMs: 4000 }),
        beforeTextScreen({ id: "s3", textKey: "afterBullet", next: "screen_cta", durationMs: 4500, badge: "Rewrite" }),
        ctaWithResult({ layout: "bottom", resultMode: "stat", statKeys: ["ctaScore"], resultKey: "ctaResult" }),
      ],
    },
    assets: [img("img-resume", "writing-doc.jpg", "Resume")],
  };

  // ─── UC05 Tutor · 5A (4 screens) — Capital of Canada Quiz ───
  catalog["ai-tutor-quiz"] = {
    meta: meta(
      "ai-tutor-quiz",
      "Tutor · Quiz + Explain (5A)",
      "tutor",
      "5A",
      4,
      ["quiz", "answer", "memory", "cta-reward"],
      "Geography quiz → answer reveal → memory checklist → CTA streak reward.",
      v3MetaGuide("5A", "quizQuestion/Options, aiAnswerBlocks, lesson1-3, ctaBadge."),
      "midnight-blue",
    ),
    context: ctx({
      productName: "StudyPal",
      backgroundGradient: bgGrad("#3B82F6"),
      quizQuestion: "What is the capital of Canada?",
      quizOptions: [
        { label: "Toronto", iconId: "lucide-map-pin", resultText: "Checking…", targetScreen: "s2" },
        { label: "Vancouver", iconId: "lucide-map-pin", resultText: "Checking…", targetScreen: "s2" },
        { label: "Ottawa", iconId: "lucide-map-pin", resultText: "Correct!", targetScreen: "s2" },
        { label: "Montreal", iconId: "lucide-map-pin", resultText: "Checking…", targetScreen: "s2" },
      ],
      userQuestion: "Why is Ottawa the capital?",
      aiAnswerBlocks: [
        { type: "text", text: "Correct answer: Ottawa" },
        { type: "text", text: "Ottawa is the capital of Canada. Toronto is the largest city, but it is not the capital." },
        { type: "card", title: "Country", text: "Canada" },
        { type: "card", title: "Capital", text: "Ottawa" },
        { type: "card", title: "Largest city", text: "Toronto" },
        {
          type: "list",
          title: "Remember",
          items: ["✓ Ottawa = capital", "✓ Toronto = largest city", "✓ Both start with O"],
        },
      ],
      memoryHeadline: "Remember: Ottawa = Official capital",
      lesson1: "✓ Ottawa = capital",
      lesson2: "✓ Toronto = largest city",
      lesson3: "✓ Canada = country",
      ctaHeadline: "1 Question Mastered",
      ctaSubhead: "Day 1 · Geography · +10 XP · Next: World capitals",
      ctaBadge: "+10 XP",
      cta: "Keep Learning",
    }),
    scenario: {
      id: "tutor-5a-v3",
      entryScreen: "s1",
      screens: [
        quizScreen({ badge: "Geography" }),
        streamScreen({ id: "s2", name: "Answer reveal", next: "s3", afterStreamMs: 4000 }),
        checkpointScreen({
          id: "s3",
          keys: ["lesson1", "lesson2", "lesson3"],
          badgeKey: "memoryHeadline",
          next: "screen_cta",
          durationMs: 3800,
        }),
        ctaWithResult({ layout: "center", resultMode: "checklist", resultKeys: ["lesson1", "lesson2", "lesson3"] }),
      ],
    },
    assets: [icon("map-pin")],
  };

  // ─── UC07 Travel · 7A (4 screens) — Tokyo 3-Day Itinerary ───
  catalog["ai-travel-itinerary"] = {
    meta: meta(
      "ai-travel-itinerary",
      "Travel · 3-Day Plan (7A)",
      "travel",
      "7A",
      4,
      ["input", "itinerary", "route-summary", "cta-board"],
      "Destination input → detailed day cards → route & budget summary → CTA travel board.",
      v3MetaGuide("7A", "destination, aiAnswerBlocks days, ctaDay1-3, ctaSpend."),
      "emerald-plan",
    ),
    context: ctx({
      productName: "TripMind",
      backgroundGradient: bgGrad("#10B981"),
      problemHeadline: "Plan a 3-day Tokyo trip in seconds",
      destinationInput: "Tokyo · 3 days · Foodie · Mid-range",
      userQuestion: "Tokyo 3-day itinerary",
      aiAnswerBlocks: [
        { type: "text", text: "Tokyo 3-day itinerary:" },
        {
          type: "card",
          title: "Day 1 · Shibuya + Harajuku",
          text: "Morning: check in · Afternoon: Shibuya Crossing, Hachiko, Harajuku · Evening: ramen · Food ¥3,000-4,500",
        },
        {
          type: "card",
          title: "Day 2 · Asakusa + Ueno",
          text: "Morning: Senso-ji Temple · Afternoon: Nakamise, Ueno Park · Evening: izakaya · Food ¥3,500-5,000",
        },
        {
          type: "card",
          title: "Day 3 · Shinjuku + Shopping",
          text: "Morning: Shinjuku Gyoen · Afternoon: Lumine, Don Quijote · Evening: sushi dinner · Shopping ¥5,000-15,000",
        },
        {
          type: "list",
          title: "AI Tip",
          items: ["Keep Day 2 slower — more walking", "Use JR/Yamanote line", "Hotel return before 22:00"],
        },
      ],
      summaryHeadline: "Route & budget summary",
      summarySubhead: "Food ¥10,500-15,500 · Transport ¥2,000-3,600",
      summary1: "Day 1: Shibuya → Harajuku",
      summary2: "Day 2: Asakusa → Ueno",
      summary3: "Day 3: Shinjuku → Airport prep",
      summary4: "Rest: hotel before 22:00",
      ctaHeadline: "Your Tokyo 3-Day Plan is Ready",
      ctaSubhead: "Estimated ¥7,000 - ¥15,000/day",
      ctaDay1: "Day 1 · Shibuya + Harajuku · ramen + street snacks",
      ctaDay2: "Day 2 · Asakusa + Ueno · Senso-ji + izakaya",
      ctaDay3: "Day 3 · Shinjuku · shopping + sushi dinner",
      ctaSpend: "Estimated daily spend: ¥7,000 - ¥15,000/day",
      cta: "Open Full Itinerary",
    }),
    scenario: {
      id: "travel-7a-v3",
      entryScreen: "s1",
      screens: [
        promptScreen({ label: "Destination", promptText: "Tokyo · 3 days", next: "s2", badge: "Travel", lotte: "lottie-ai-chat", durationMs: 3800 }),
        streamScreen({ id: "s2", name: "Itinerary", next: "s3", afterStreamMs: 6000 }),
        valueSummaryScreen({
          headlineKey: "summaryHeadline",
          subheadKey: "summarySubhead",
          keys: ["summary1", "summary2", "summary3", "summary4"],
          next: "screen_cta",
          durationMs: 5000,
        }),
        ctaWithResult({ layout: "bottom", resultMode: "checklist", resultKeys: ["ctaDay1", "ctaDay2", "ctaDay3"] }),
      ],
    },
    assets: PLAN,
  };

  // ─── UC08 Finance · 8A (4 screens) — Monthly Budget Plan ───
  catalog["ai-finance-budget"] = {
    meta: meta(
      "ai-finance-budget",
      "Finance · Monthly Budget (8A)",
      "finance",
      "8A",
      4,
      ["income", "breakdown", "checklist", "cta-dashboard"],
      "Income input → AI budget breakdown → budget checklist → CTA ring dashboard.",
      v3MetaGuide("8A", "incomeInput, aiAnswerBlocks categories, ctaSave, ctaEssentials."),
      "slate-minimal",
    ),
    context: ctx({
      productName: "BudgetAI",
      backgroundGradient: bgGrad("#64748B"),
      problemHeadline: "Build a smarter monthly budget",
      incomeInput: "$2,500/month · Save more",
      userQuestion: "Monthly budget for $2,500",
      aiAnswerBlocks: [
        { type: "text", text: "Suggested budget for $2,500/month:" },
        {
          type: "list",
          items: [
            "Essentials: $1,250 · rent, bills, groceries",
            "Savings: $500 · emergency fund",
            "Flexible: $450 · food out, shopping",
            "Debt/Goals: $200 · extra payments",
            "Buffer: $100 · unexpected costs",
          ],
        },
        { type: "text", text: "AI suggests saving 20% first, then limiting flexible spending." },
        { type: "progress", label: "Savings rate", value: 20 },
      ],
      checkpoint1: "✓ Move $500 to savings first",
      checkpoint2: "✓ Set food-out cap to $180",
      checkpoint3: "✓ Review subscriptions this week",
      checkpoint4: "○ Add emergency fund goal",
      ctaHeadline: "Your monthly budget is ready",
      ctaSubhead: "$2,500 planned · Save $500/month",
      ctaSave: "Save: $500/month",
      ctaEssentials: "Essentials: $1,250",
      ctaFlexible: "Flexible cap: $450",
      ctaBuffer: "Emergency buffer: $100",
      cta: "Create My Budget",
    }),
    scenario: {
      id: "finance-8a-v3",
      entryScreen: "s1",
      screens: [
        promptScreen({ label: "Income", promptText: "$2,500/month", next: "s2", badge: "Budget", durationMs: 3500 }),
        streamScreen({ id: "s2", name: "Breakdown", next: "s3", afterStreamMs: 5000 }),
        checkpointScreen({
          id: "s3",
          keys: ["checkpoint1", "checkpoint2", "checkpoint3", "checkpoint4"],
          next: "screen_cta",
          durationMs: 4000,
        }),
        ctaWithResult({
          layout: "bottom",
          resultMode: "checklist",
          resultKeys: ["ctaSave", "ctaEssentials", "ctaFlexible", "ctaBuffer"],
        }),
      ],
    },
    assets: [icon("wallet"), icon("piggy-bank")],
  };

  // ─── UC09 Agent · 9A (4 screens) — Weekly Content Plan ───
  catalog["ai-agent-delegate"] = {
    meta: meta(
      "ai-agent-delegate",
      "Agent · Delegate Task (9A)",
      "agent",
      "9A",
      4,
      ["task", "steps", "output", "cta-calendar"],
      "Task input → agent planning steps → content calendar cards → CTA agent calendar board.",
      v3MetaGuide("9A", "taskInput, agent steps, agentMon-Fri, ctaMon-Wed-Fri."),
      "violet-pro",
    ),
    context: ctx({
      productName: "AgentFlow",
      backgroundGradient: bgGrad("#7C3AED"),
      problemHeadline: "Delegate work to your AI agent",
      taskInput: "Create a weekly content plan for my product.",
      userQuestion: "Weekly content plan for social",
      aiAnswerBlocks: [
        { type: "text", text: "Agent is working…" },
        {
          type: "list",
          title: "Agent steps",
          items: [
            "✓ Understand product goal",
            "✓ Pick 3 content angles",
            "✓ Create post schedule",
            "✓ Draft hooks",
            "✓ Add KPI checklist",
          ],
        },
      ],
      outputHeadline: "Content plan ready",
      agentMon: "Mon · TikTok hook: 3 mistakes slowing your workflow",
      agentWed: "Wed · Carousel: Before/after using AI assistant",
      agentFri: "Fri · Email + post: Weekly productivity checklist",
      agentKpi1: "✓ Clear hook",
      agentKpi2: "✓ Platform matched",
      agentKpi3: "✓ CTA included",
      ctaHeadline: "Your content week is ready",
      ctaSubhead: "3 posts planned · 3 hooks drafted · 1 KPI checklist",
      ctaMon: "Mon · TikTok hook",
      ctaWed: "Wed · Carousel idea",
      ctaFri: "Fri · Email + post",
      cta: "Automate With AI",
    }),
    scenario: {
      id: "agent-9a-v3",
      entryScreen: "s1",
      screens: [
        promptScreen({ label: "Task", promptText: "Create a weekly content plan for my product.", next: "s2", badge: "Agent", lotte: "lottie-ai-robot", durationMs: 3800 }),
        agentStepsScreen({ id: "s2", next: "s3", durationMs: 4500 }),
        agentOutputScreen({
          headlineKey: "outputHeadline",
          resultKeys: ["agentMon", "agentWed", "agentFri"],
          checklistKeys: ["agentKpi1", "agentKpi2", "agentKpi3"],
          next: "screen_cta",
          durationMs: 5000,
        }),
        ctaWithResult({
          layout: "bottom",
          resultMode: "checklist",
          resultKeys: ["ctaMon", "ctaWed", "ctaFri"],
        }),
      ],
    },
    assets: [icon("bot"), icon("calendar")],
  };

  // ─── UC06 Fitness · 6A (4 screens) — Build My Meal Plan ───
  catalog["ai-fitness-meal"] = {
    meta: meta(
      "ai-fitness-meal",
      "Fitness · Meal Plan (6A)",
      "fitness",
      "6A",
      4,
      ["goal", "meal-stream", "grocery", "cta-calendar"],
      "Health goal picker → high-protein day stream → grocery checklist → meal timeline CTA.",
      v3MetaGuide("6A", "goalOptions, aiAnswerBlocks meals, grocery1-6, ctaMeal1-4, ctaProtein."),
      "emerald-plan",
      ["emerald-plan", "neon-cyan"],
    ),
    context: ctx({
      productName: "NutriAI",
      backgroundGradient: bgGrad("#10B981"),
      quizQuestion: "What's your meal goal?",
      quizOptions: [
        { label: "Lose weight", iconId: "lucide-scale", resultText: "Building plan…", targetScreen: "s2" },
        { label: "Gain muscle", iconId: "lucide-dumbbell", resultText: "Building plan…", targetScreen: "s2" },
        { label: "Eat healthier", iconId: "lucide-leaf", resultText: "Building plan…", targetScreen: "s2" },
        { label: "High protein", iconId: "lucide-egg", resultText: "High-protein day…", targetScreen: "s2" },
      ],
      pref1: "No pork",
      pref2: "Quick meals",
      pref3: "Budget friendly",
      userQuestion: "High-protein day plan",
      aiAnswerBlocks: [
        { type: "text", text: "High-protein day plan:" },
        { type: "card", title: "Breakfast · 8:00", text: "Greek yogurt bowl with berries, granola, chia · Protein: 28g" },
        { type: "card", title: "Lunch · 12:30", text: "Chicken rice bowl with broccoli, avocado · Protein: 42g" },
        { type: "card", title: "Snack · 16:00", text: "Boiled eggs + banana · Protein: 14g" },
        { type: "card", title: "Dinner · 19:00", text: "Salmon, sweet potato, green beans · Protein: 38g" },
        { type: "progress", label: "Total protein", value: 122 },
      ],
      grocery1: "Greek yogurt",
      grocery2: "Chicken breast",
      grocery3: "Broccoli",
      grocery4: "Eggs",
      grocery5: "Salmon",
      grocery6: "Sweet potato",
      checkpoint1: "✓ Protein each meal",
      checkpoint2: "✓ 2 vegetable servings",
      checkpoint3: "✓ Water reminder",
      checkpoint4: "○ Prep lunch box",
      proteinSummary: "122g protein planned",
      ctaHeadline: "Your high-protein day is ready",
      ctaSubhead: "Full weekly plan + grocery list in app",
      ctaMeal1: "8:00 · Yogurt bowl · 28g",
      ctaMeal2: "12:30 · Chicken bowl · 42g",
      ctaMeal3: "16:00 · Eggs + banana · 14g",
      ctaMeal4: "19:00 · Salmon plate · 38g",
      ctaProtein: "122g protein",
      cta: "Get My Full Plan",
    }),
    scenario: {
      id: "fitness-6a-v3",
      entryScreen: "s1",
      screens: [
        quizScreen({ badge: "Meals", next: "s2", durationMs: 3800 }),
        streamScreen({ id: "s2", name: "Meal timeline", next: "s3", afterStreamMs: 5500 }),
        checkpointScreen({
          id: "s3",
          keys: ["grocery1", "grocery2", "grocery3", "grocery4", "grocery5", "grocery6", "checkpoint1", "checkpoint2", "checkpoint3", "checkpoint4"],
          badgeKey: "proteinSummary",
          next: "screen_cta",
          durationMs: 4500,
        }),
        ctaWithResult({
          layout: "bottom",
          resultMode: "checklist",
          resultKeys: ["ctaMeal1", "ctaMeal2", "ctaMeal3", "ctaMeal4"],
        }),
      ],
    },
    assets: [icon("scale"), icon("dumbbell"), icon("leaf"), img("img-meal", "plan-board.jpg", "Meals")],
  };

  // ─── UC10 Recommendation · 10A (4 screens) — Personalized AI Plan ───
  catalog["ai-reco-questions"] = {
    meta: meta(
      "ai-reco-questions",
      "Reco · Quick Questions (10A)",
      "reco",
      "10A",
      4,
      ["goal-quiz", "time-quiz", "plan-stream", "cta-unlock"],
      "Goal question → time available → 10-min AI plan → personalized unlock CTA.",
      v3MetaGuide("10A", "goalOptions, timeOptions, aiAnswerBlocks, ctaGoal, ctaTime, ctaFeature."),
      "light-clean",
      ["light-clean", "midnight-blue"],
    ),
    context: ctx({
      productName: "AI Planner",
      backgroundGradient: bgGrad("#2563EB"),
      quizQuestion: "What do you want AI to help with?",
      quizOptions: [
        { label: "Save time", iconId: "lucide-clock", resultText: "Saving time…", targetScreen: "s2" },
        { label: "Learn faster", iconId: "lucide-zap", resultText: "Learning plan…", targetScreen: "s2" },
        { label: "Create content", iconId: "lucide-pen", resultText: "Content plan…", targetScreen: "s2" },
        { label: "Stay organized", iconId: "lucide-calendar", resultText: "Organizing…", targetScreen: "s2" },
      ],
      timeQuestion: "How much time do you have daily?",
      timeOptions: [
        { label: "5 min", iconId: "lucide-clock", resultText: "5 min plan…", targetScreen: "s3" },
        { label: "10 min", iconId: "lucide-clock", resultText: "10 min plan…", targetScreen: "s3" },
        { label: "20 min", iconId: "lucide-clock", resultText: "20 min plan…", targetScreen: "s3" },
        { label: "30 min", iconId: "lucide-clock", resultText: "30 min plan…", targetScreen: "s3" },
      ],
      timeMicrocopy: "AI will build a realistic plan.",
      userQuestion: "10-minute productivity plan",
      aiAnswerBlocks: [
        { type: "text", text: "Your 10-minute AI productivity plan:" },
        { type: "card", title: "Minute 0-2", text: "Brain dump tasks" },
        { type: "card", title: "Minute 2-5", text: "AI groups them by priority" },
        { type: "card", title: "Minute 5-8", text: "Pick top 3 actions" },
        { type: "card", title: "Minute 8-10", text: "Start first tiny task" },
        {
          type: "list",
          title: "Checklist",
          items: ["✓ Daily plan", "✓ Priority grouping", "✓ First action selected"],
        },
        { type: "text", text: "Best feature for you: AI Daily Planner" },
      ],
      ctaHeadline: "Your AI plan is ready",
      ctaSubhead: "Unlock 7-day plan, reminders, and progress tracking",
      ctaGoal: "Goal: Save time",
      ctaTime: "Daily time: 10 minutes",
      ctaFeature: "Recommended: AI Daily Planner",
      ctaExtra1: "7-day plan",
      ctaExtra2: "Task reminders",
      ctaExtra3: "Progress tracking",
      cta: "Unlock My Full Plan",
    }),
    scenario: {
      id: "reco-10a-v3",
      entryScreen: "s1",
      screens: [
        quizScreen({ id: "s1", badge: "Goal", next: "s2", durationMs: 3500 }),
        quizScreen({ id: "s2", badge: "Time", questionKey: "timeQuestion", optionsKey: "timeOptions", next: "s3", durationMs: 3500 }),
        streamScreen({ id: "s3", name: "Personalized plan", next: "screen_cta", afterStreamMs: 5000 }),
        ctaWithResult({
          layout: "center",
          resultMode: "checklist",
          resultKeys: ["ctaGoal", "ctaTime", "ctaFeature", "ctaExtra1", "ctaExtra2", "ctaExtra3"],
        }),
      ],
    },
    assets: [icon("clock"), icon("zap"), icon("pen"), icon("calendar")],
  };

  return catalog;
}

/** Legacy templates removed when regenerating catalog. */
export const OLD_TEMPLATE_IDS = [
  "campaign-abc",
  "text-campaign",
  "ai-chat-assistant",
  "ai-chat-quiz",
  "ai-chat-vs-manual",
  "ai-chat-mentor",
  "ai-writing-generator",
  "ai-write-overlay",
  "ai-writing-email",
  "ai-text-to-image",
  "ai-image-story",
  "ai-image-to-image",
  "ai-image-avatar",
  "ai-photo-quiz",
  "ai-text-to-audio",
  "ai-voice-quiz",
  "ai-planning-board",
  "ai-plan-quiz",
  "ai-code-copilot",
  "ai-code-quiz",
  "ai-translate-live",
  "ai-translate-overlay",
  "ai-doc-summary",
  "ai-summary-compare",
  "ai-model-arena",
  "ai-future-quiz",
  "ai-resume-build",
  "ai-resume-cover-letter",
  "ai-tutor-explains",
  "ai-tutor-language",
  "ai-fitness-workout",
  "ai-fitness-nutrition",
  "ai-travel-quiz",
  "ai-travel-chat",
  "ai-finance-spending",
  "ai-finance-savings",
  "ai-agent-workflow",
  "ai-reco-swipe",
];
