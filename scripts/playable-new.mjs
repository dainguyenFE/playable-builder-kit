#!/usr/bin/env node
/**
 * Unified "create new playable" entry — lists templates/scaffolds and runs the right CLI.
 *
 * Usage:
 *   pnpm playable:new --list
 *   pnpm playable:new <campaign-id> studio <template-id>
 *   pnpm playable:new <campaign-id> compose <template-id>
 *   pnpm playable:new <campaign-id> scaffold [playable|landing|minimal]
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { ROOT } from "./lib/paths.mjs";
import { listTemplateIds, loadTemplateManifest } from "./lib/compose.mjs";
import {
  loadThemesCatalog,
  listTemplateThemes,
} from "./lib/studio-themes.mjs";

const SCAFFOLDS = ["playable", "landing", "minimal"];
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function loadRegistry() {
  return JSON.parse(
    readFileSync(resolve(ROOT, "data/registry/playables.json"), "utf8"),
  );
}

function run(nodeScript, args) {
  const r = spawnSync("node", [resolve(ROOT, "scripts", nodeScript), ...args], {
    cwd: ROOT,
    stdio: "inherit",
  });
  process.exit(r.status ?? 1);
}

function loadStudioTemplateMeta(id) {
  const p = resolve(ROOT, "data/templates", id, "template.json");
  if (!existsSync(p)) return { id };
  return JSON.parse(readFileSync(p, "utf8"));
}

function printList() {
  const reg = loadRegistry();
  const catalog = loadThemesCatalog();
  const studio = (reg.templates ?? []).filter((t) => t.engine === "studio");
  const compose = (reg.templates ?? []).filter((t) => t.engine === "compose");

  console.log("\n🆕 Create new playable — chọn một trong 3 hướng:\n");
  console.log("  A) studio <template-id>   — scenario JSON (AI feature ads, preview /preview/template/…)");
  console.log("  B) compose <template-id> — block flow (playables/<id>/composition.json)");
  console.log("  C) scaffold [type]       — hand-coded page (src/pages/<id>/)\n");

  console.log("📋 Studio templates (pnpm playable:new <id> studio <template-id> [theme-id])\n");
  for (const t of studio) {
    const meta = loadStudioTemplateMeta(t.id);
    console.log(`  · ${t.id} — ${t.name}${t.category ? ` [${t.category}]` : ""}`);
    if (t.previewPath) console.log(`    preview: ${t.previewPath}?theme=<theme-id>`);
    const themes = listTemplateThemes(catalog, meta);
    if (themes.length) {
      console.log(
        `    themes: ${themes.map((th) => `${th.id}${th.id === meta.defaultTheme ? " (default)" : ""}`).join(", ")}`,
      );
    }
  }

  console.log("\n📋 Compose templates (pnpm playable:new <id> compose <template-id>)\n");
  for (const t of compose) {
    console.log(`  · ${t.id} — ${t.name}`);
    if (t.previewPath) console.log(`    preview: ${t.previewPath}`);
  }
  const composeOnly = listTemplateIds().filter(
    (id) => !compose.some((t) => t.id === id),
  );
  for (const id of composeOnly) {
    const m = loadTemplateManifest(id);
    console.log(`  · ${id} — ${m?.name ?? id}`);
  }

  console.log("\n📋 Scaffolds (pnpm playable:new <id> scaffold <playable|landing|minimal>)\n");
  for (const s of SCAFFOLDS) {
    console.log(`  · ${s}`);
  }

  console.log("\nExamples:");
  console.log("  pnpm playable:new my-ai-chat studio ai-chat-assistant midnight-blue");
  console.log("  pnpm playable:new my-mix compose ai-chat-simulator");
  console.log("  pnpm playable:new pa08-hero scaffold landing");
  console.log("");
}

const argv = process.argv.slice(2);

if (argv[0] === "--list" || argv[0] === "-l") {
  printList();
  process.exit(0);
}

if (argv.length < 2) {
  printList();
  console.error("Usage: pnpm playable:new <campaign-id> <studio|compose|scaffold> [template-or-type]");
  console.error("       pnpm playable:new --list");
  process.exit(1);
}

const [campaignId, mode, third, fourth] = argv;

if (!KEBAB.test(campaignId)) {
  console.error("Campaign id must be kebab-case, e.g. my-ai-launch");
  process.exit(1);
}

if (mode === "studio") {
  const templateId = third || "ai-writing-generator";
  const themeId = fourth;
  const args = [campaignId, templateId];
  if (themeId) args.push(themeId);
  run("studio-create.mjs", args);
}

if (mode === "compose") {
  if (!third) {
    console.error(`Usage: pnpm playable:new ${campaignId} compose <template-id>`);
    console.error(`Templates: ${listTemplateIds().join(", ")}`);
    process.exit(1);
  }
  run("compose-create.mjs", [campaignId, third]);
}

if (mode === "scaffold") {
  const type = third || "playable";
  if (!SCAFFOLDS.includes(type)) {
    console.error(`Scaffold type must be one of: ${SCAFFOLDS.join(", ")}`);
    process.exit(1);
  }
  run("create-page.mjs", [campaignId, type]);
}

console.error(`Unknown mode "${mode}". Use: studio | compose | scaffold`);
console.error("Run: pnpm playable:new --list");
process.exit(1);
