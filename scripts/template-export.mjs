#!/usr/bin/env node
/**
 * Build single-file HTML for a studio template preset (no rebuild on download).
 *
 * Usage:
 *   pnpm template:export <template-id>
 *   pnpm template:export --list
 *
 * Output: data/templates/<id>/exports/<id>.html
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { ROOT } from "./lib/paths.mjs";
import { loadJson } from "./lib/compose.mjs";
import { buildStudioHtml, validateStudioHtml } from "./lib/studio-html-build.mjs";

const TEMPLATES_ROOT = resolve(ROOT, "data/templates");
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function listTemplates() {
  if (!existsSync(TEMPLATES_ROOT)) return [];
  return readdirSync(TEMPLATES_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("_"))
    .map((d) => d.name)
    .filter((id) => existsSync(resolve(TEMPLATES_ROOT, id, "scenario.preset.json")))
    .sort();
}

function loadTemplateBundle(templateId) {
  const dir = resolve(TEMPLATES_ROOT, templateId);
  const required = ["playable.preset.json", "context.preset.json", "scenario.preset.json"];
  for (const f of required) {
    if (!existsSync(resolve(dir, f))) {
      throw new Error(`Missing ${f} for template "${templateId}"`);
    }
  }
  return {
    playable: loadJson(resolve(dir, "playable.preset.json")),
    context: loadJson(resolve(dir, "context.preset.json")),
    scenario: loadJson(resolve(dir, "scenario.preset.json")),
    assets: existsSync(resolve(dir, "assets.preset.json"))
      ? loadJson(resolve(dir, "assets.preset.json"))
      : { assets: [] },
  };
}

const argv = process.argv.slice(2);

if (argv[0] === "--list" || argv[0] === "-l") {
  console.log("\n📤 Studio templates (exportable HTML)\n");
  for (const id of listTemplates()) {
    const out = `data/templates/${id}/exports/${id}.html`;
    const built = existsSync(resolve(ROOT, out));
    console.log(`  · ${id}${built ? "" : " (not built)"}`);
    console.log(`    build:   pnpm template:export ${id}`);
    console.log(`    file:    ${out}`);
  }
  console.log("");
  process.exit(0);
}

const id = argv[0]?.trim();
if (!id || !KEBAB.test(id)) {
  console.error("Usage: pnpm template:export <template-id>");
  console.error("       pnpm template:export --list");
  process.exit(1);
}

if (!existsSync(resolve(TEMPLATES_ROOT, id))) {
  console.error(`\n❌ Unknown template "${id}".`);
  console.error("   Create: pnpm template:create <id>");
  console.error("   List:   pnpm template:export --list\n");
  process.exit(1);
}

let bundle;
try {
  bundle = loadTemplateBundle(id);
} catch (e) {
  console.error(`\n❌ ${e.message}\n`);
  process.exit(1);
}

console.log(`\n📤 Building template HTML: ${id}…\n`);

const html = await buildStudioHtml(bundle, { id });
const errors = validateStudioHtml(html);
if (errors.length) {
  console.error("❌ Export validation:", errors.join(", "));
  process.exit(1);
}

const exportsDir = resolve(TEMPLATES_ROOT, id, "exports");
mkdirSync(exportsDir, { recursive: true });
const outPath = resolve(exportsDir, `${id}.html`);
writeFileSync(outPath, html);

console.log(
  `✅ Template HTML: data/templates/${id}/exports/${id}.html (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB)`,
);
console.log(`   Download (dev): /download/template/${id}\n`);
