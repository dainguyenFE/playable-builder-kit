#!/usr/bin/env node
/**
 * Save studio playable as reusable template preset.
 * Usage: pnpm template:save-from-playable <playable-id> <new-template-id>
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, cpSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { ROOT } from "./lib/paths.mjs";
import { buildZoneIndex } from "../src/runtime/studio/zone-index.js";

const playableId = process.argv[2]?.trim();
const templateId = process.argv[3]?.trim();
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

if (!playableId || !templateId || !KEBAB.test(playableId) || !KEBAB.test(templateId)) {
  console.error("Usage: pnpm template:save-from-playable <playable-id> <new-template-id>");
  process.exit(1);
}

const src = resolve(ROOT, "playables", playableId);
const dest = resolve(ROOT, "data/templates", templateId);

if (!existsSync(src)) {
  console.error(`Playable not found: playables/${playableId}`);
  process.exit(1);
}
if (existsSync(dest)) {
  console.error(`Template exists: data/templates/${templateId}`);
  process.exit(1);
}

function readJson(name) {
  return JSON.parse(readFileSync(resolve(src, name), "utf8"));
}

const playable = readJson("playable.json");
const context = readJson("context.json");
const scenario = readJson("scenario.json");
let assets = { assets: [] };
try {
  assets = readJson("assets.json");
} catch {
  /* optional */
}

const manifest = existsSync(resolve(src, "manifest.json"))
  ? readJson("manifest.json")
  : {};

const zoneIndex = buildZoneIndex(scenario, context, playable);

mkdirSync(dest, { recursive: true });

const presetPlayable = {
  ...playable,
  id: "preview-template",
  name: `${playable.name || templateId} (template)`,
  template: { id: templateId },
};
delete presetPlayable.themeId;

writeFileSync(resolve(dest, "playable.preset.json"), JSON.stringify(presetPlayable, null, 2));
writeFileSync(resolve(dest, "context.preset.json"), JSON.stringify(context, null, 2));
writeFileSync(resolve(dest, "scenario.preset.json"), JSON.stringify(scenario, null, 2));
writeFileSync(resolve(dest, "assets.preset.json"), JSON.stringify(assets, null, 2));

const templateMeta = {
  id: templateId,
  name: playable.name || templateId.replace(/-/g, " "),
  description: `Saved from playable ${playableId}`,
  defaultTheme: playable.themeId || manifest.themeId || "midnight-blue",
  themes: playable.themeId ? [playable.themeId] : ["midnight-blue"],
  slots: [...new Set(zoneIndex.zones.map((z) => z.textKey).filter(Boolean))],
  flow: scenario.screens?.map((s) => s.type || s.id) ?? [],
  sourcePlayableId: playableId,
};

writeFileSync(resolve(dest, "template.json"), JSON.stringify(templateMeta, null, 2));
writeFileSync(
  resolve(dest, "editable-zones.preset.json"),
  JSON.stringify({ editableZones: zoneIndex.zones }, null, 2),
);

console.log(`\n✅ Template saved: data/templates/${templateId}/`);
console.log(`   From playable: ${playableId}`);
console.log(`   Zones: ${zoneIndex.zoneCount}`);
console.log(`   Preview: pnpm dev → /preview/template/${templateId}`);
console.log(`   Build HTML: pnpm template:export ${templateId}`);
console.log(`   Add to data/registry/playables.json templates[] if needed.\n`);

const r = spawnSync("node", ["scripts/template-export.mjs", templateId], {
  cwd: ROOT,
  stdio: "inherit",
});
if ((r.status ?? 1) !== 0) {
  console.warn(`⚠️  template:export failed — run manually: pnpm template:export ${templateId}`);
}
