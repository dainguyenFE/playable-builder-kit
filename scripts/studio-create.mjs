#!/usr/bin/env node
/**
 * Create studio playable from data/templates/<template-id>/ presets.
 * Copies JSON into playables/<id>/ — a snapshot; later template edits do not affect this playable.
 * Usage: pnpm studio:create <playable-id> [template-id] [theme-id]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { ROOT } from "./lib/paths.mjs";
import { registerPlayableInRegistry } from "./lib/playable-resolve.mjs";
import { loadThemesCatalog, resolveThemeForTemplate } from "./lib/studio-themes.mjs";

const id = process.argv[2]?.trim();
const templateId = process.argv[3]?.trim() || "ai-writing-generator";
const themeIdArg = process.argv[4]?.trim();

if (!id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
  console.error("Usage: pnpm studio:create <playable-id> [template-id] [theme-id]");
  process.exit(1);
}

const tplDir = resolve(ROOT, "data/templates", templateId);
if (!existsSync(tplDir)) {
  console.error(`Unknown template: data/templates/${templateId}`);
  process.exit(1);
}

const dest = resolve(ROOT, "playables", id);
if (existsSync(dest)) {
  console.error(`Exists: playables/${id}`);
  process.exit(1);
}

function readPreset(name) {
  const p = resolve(tplDir, name);
  if (!existsSync(p)) throw new Error(`Missing ${p}`);
  return JSON.parse(readFileSync(p, "utf8"));
}

const templateMeta = existsSync(resolve(tplDir, "template.json"))
  ? JSON.parse(readFileSync(resolve(tplDir, "template.json"), "utf8"))
  : { id: templateId };

const catalog = loadThemesCatalog();
const theme = resolveThemeForTemplate(catalog, templateMeta, themeIdArg);

const playable = readPreset("playable.preset.json");
const context = readPreset("context.preset.json");
const scenario = readPreset("scenario.preset.json");
let assets = { assets: [] };
try {
  assets = readPreset("assets.preset.json");
} catch {
  /* optional */
}

playable.id = id;
playable.name = id.replace(/-/g, " ");
playable.template = { id: templateId };
playable.themeId = theme.id;
playable.theme = { ...theme };

mkdirSync(resolve(dest, "notes"), { recursive: true });
mkdirSync(resolve(dest, "versions"), { recursive: true });

writeFileSync(
  resolve(dest, "manifest.json"),
  JSON.stringify(
    {
      id,
      name: playable.name,
      engine: "studio",
      templateId,
      themeId: theme.id,
      defaultTheme: theme.id,
      themes: templateMeta.themes ?? [theme.id],
      status: "draft",
    },
    null,
    2,
  ),
);
writeFileSync(resolve(dest, "playable.json"), JSON.stringify(playable, null, 2));
writeFileSync(resolve(dest, "context.json"), JSON.stringify(context, null, 2));
writeFileSync(resolve(dest, "scenario.json"), JSON.stringify(scenario, null, 2));
writeFileSync(resolve(dest, "assets.json"), JSON.stringify(assets, null, 2));
writeFileSync(
  resolve(dest, "brief.md"),
  `# ${id}\n\nTemplate: \`${templateId}\` · Theme: \`${theme.id}\` (${theme.name})\n`,
);

registerPlayableInRegistry({
  id,
  name: playable.name,
  engine: "studio",
  status: "draft",
});

console.log(`\n✅ Created studio playable playables/${id}/`);
console.log(`   Template: ${templateId}`);
console.log(`   Theme:    ${theme.id} (${theme.name})`);
console.log(`   Preview:  pnpm dev → /preview/${id}`);
console.log(`   Export:   pnpm studio:export ${id}\n`);
