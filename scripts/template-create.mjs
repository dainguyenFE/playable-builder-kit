#!/usr/bin/env node
/**
 * Create new studio template.
 * V3 screen contract: docs/AI_PLAYABLE_USER_CASE_SCENARIOS_V3_SCREEN_DETAIL.md
 * Catalog templates: pnpm template:catalog:generate
 *
 * Usage:
 *   pnpm template:create --list
 *   pnpm template:create <template-id> --empty [--screens N] [--theme <theme-id>]
 *   pnpm template:create <template-id> --topic "..." [--screens N] [--theme <theme-id>]
 *   pnpm template:create <template-id> --from <source-template-id>   (clone legacy)
 */
import { existsSync, mkdirSync, cpSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { ROOT } from "./lib/paths.mjs";
import { loadThemesCatalog } from "./lib/studio-themes.mjs";
import {
  buildEmptyScenario,
  buildEmptyContext,
  buildTopicContext,
  buildTopicScenario,
  buildTemplateMeta,
  buildPlayablePreset,
  DEFAULT_ASSETS_PRESET,
  listThemeIds,
} from "./lib/template-scaffold.mjs";

const args = process.argv.slice(2);
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function flag(name) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}

function hasFlag(name) {
  return args.includes(name);
}

function registerTemplate(templateId, name) {
  const regPath = resolve(ROOT, "data/registry/playables.json");
  const reg = JSON.parse(readFileSync(regPath, "utf8"));
  if ((reg.templates ?? []).some((t) => t.id === templateId)) return;
  reg.templates.push({
    id: templateId,
    name: name || templateId.replace(/-/g, " "),
    engine: "studio",
    status: "draft",
    category: "custom",
    previewPath: `/preview/template/${templateId}`,
  });
  writeFileSync(regPath, `${JSON.stringify(reg, null, 2)}\n`);
}

function printList() {
  const catalog = loadThemesCatalog();
  console.log("\n📋 Create template — agent should ask Marketing first:\n");
  console.log("  1. Template id (kebab-case)");
  console.log("  2. Số màn hình (1–8)");
  console.log("  3. Theme (màu brand)");
  console.log("  4. Chủ đề / brief — để trống → template rỗng; có chủ đề → AI sinh mẫu\n");
  console.log("Themes (pnpm template:create <id> --theme <id>):\n");
  for (const id of listThemeIds()) {
    const t = catalog.themes[id];
    console.log(`  · ${id} — ${t.name} (${t.primaryColor})`);
  }
  console.log("\nExamples:");
  console.log("  pnpm template:create my-flow --empty --screens 3 --theme slate-minimal");
  console.log('  pnpm template:create fitness-q1 --topic "fitness app launch" --screens 3 --theme emerald-plan');
  console.log("  pnpm template:create my-clone --from ai-chat-assistant\n");
}

if (hasFlag("--list") || args.length === 0) {
  printList();
  process.exit(args.length === 0 ? 1 : 0);
}

const templateId = args.find((a) => !a.startsWith("--"))?.trim();
const fromId = flag("--from");
const empty = hasFlag("--empty");
const topic = flag("--topic");
const screensArg = flag("--screens");
const themeId = flag("--theme") || "slate-minimal";

if (!templateId || !KEBAB.test(templateId)) {
  console.error("Usage: pnpm template:create <template-id> --empty|--topic ...");
  printList();
  process.exit(1);
}

const dest = resolve(ROOT, "data/templates", templateId);
if (existsSync(dest)) {
  console.error(`Template exists: data/templates/${templateId}`);
  process.exit(1);
}

// ── Clone mode (legacy) ──
if (fromId) {
  const source = resolve(ROOT, "data/templates", fromId);
  if (!existsSync(source)) {
    console.error(`Source template not found: ${fromId}`);
    process.exit(1);
  }
  mkdirSync(dest, { recursive: true });
  cpSync(source, dest, { recursive: true });
  const templatePath = resolve(dest, "template.json");
  if (existsSync(templatePath)) {
    const meta = JSON.parse(readFileSync(templatePath, "utf8"));
    meta.id = templateId;
    meta.name = templateId.replace(/-/g, " ");
    meta.description = `Cloned from ${fromId}`;
    delete meta.sourcePlayableId;
    writeFileSync(templatePath, `${JSON.stringify(meta, null, 2)}\n`);
  }
  registerTemplate(templateId, templateId.replace(/-/g, " "));
  console.log(`\n✅ Cloned template data/templates/${templateId}/ (from ${fromId})`);
  console.log(`   Preview: /preview/template/${templateId}\n`);
  process.exit(0);
}

if (!empty && !topic) {
  console.error(
    "Specify --empty (blank screens) or --topic \"...\" (sample copy).\nAgent must ask user before running this command.",
  );
  printList();
  process.exit(1);
}

const screenCount = screensArg ? Number(screensArg) : empty ? 1 : 3;
if (!Number.isFinite(screenCount) || screenCount < 1 || screenCount > 8) {
  console.error("--screens must be between 1 and 8");
  process.exit(1);
}

const catalog = loadThemesCatalog();
let theme;
try {
  theme = catalog.themes[themeId];
  if (!theme) throw new Error(`Unknown theme: ${themeId}`);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}

mkdirSync(dest, { recursive: true });

const meta = buildTemplateMeta(templateId, { screenCount, topic, themeId, empty });
const context = empty
  ? buildEmptyContext(templateId, theme)
  : buildTopicContext(topic, templateId, theme);
const scenario = empty ? buildEmptyScenario(screenCount) : buildTopicScenario(screenCount, topic);
scenario.id = meta.scenarioPreset;

const playable = buildPlayablePreset(templateId, theme);
playable.cta.label = context.cta || "Get the app";

writeFileSync(resolve(dest, "template.json"), `${JSON.stringify(meta, null, 2)}\n`);
writeFileSync(resolve(dest, "context.preset.json"), `${JSON.stringify(context, null, 2)}\n`);
writeFileSync(resolve(dest, "scenario.preset.json"), `${JSON.stringify(scenario, null, 2)}\n`);
writeFileSync(resolve(dest, "playable.preset.json"), `${JSON.stringify(playable, null, 2)}\n`);
writeFileSync(resolve(dest, "assets.preset.json"), `${JSON.stringify(DEFAULT_ASSETS_PRESET, null, 2)}\n`);

registerTemplate(templateId, meta.name);

const mode = empty ? `empty · ${screenCount} screen(s)` : `topic · ${screenCount} screen(s)`;
console.log(`\n✅ Created template data/templates/${templateId}/`);
console.log(`   Mode: ${mode}`);
console.log(`   Theme: ${themeId}`);
if (topic) console.log(`   Topic: ${topic}`);
console.log(`   Edit: /templates/${templateId}`);
console.log(`   Preview: /preview/template/${templateId}?theme=${themeId}`);
console.log(`   Export: pnpm template:export ${templateId}\n`);
