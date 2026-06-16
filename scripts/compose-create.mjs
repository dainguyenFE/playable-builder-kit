#!/usr/bin/env node
/**
 * Create playables/<id>/ from a playable-template default composition.
 * Usage: pnpm compose:create <playable-id> <template-id>
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadJson, listTemplateIds } from "./lib/compose.mjs";
import { registerPlayableInRegistry } from "./lib/playable-resolve.mjs";
import { PLAYABLES_ROOT, TEMPLATES_ROOT } from "./lib/paths.mjs";

const playableId = process.argv[2]?.trim();
const templateId = process.argv[3]?.trim();

if (!playableId || !templateId) {
  console.error("Usage: pnpm compose:create <playable-id> <template-id>");
  console.error(`Templates: ${listTemplateIds().join(", ")}`);
  process.exit(1);
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(playableId)) {
  console.error("Playable id must be kebab-case");
  process.exit(1);
}

if (!listTemplateIds().includes(templateId)) {
  console.error(`Unknown template "${templateId}"`);
  process.exit(1);
}

const dest = resolve(PLAYABLES_ROOT, playableId);
if (existsSync(dest)) {
  console.error(`Playable already exists: playables/${playableId}`);
  process.exit(1);
}

const tplDir = resolve(TEMPLATES_ROOT, templateId);
const composition = loadJson(resolve(tplDir, "composition.default.json"));
const copyPath = resolve(tplDir, "copy/en.sample.json");
const copy = existsSync(copyPath)
  ? loadJson(copyPath)
  : { locale: "en", slots: {} };

composition.id = playableId;

mkdirSync(resolve(dest, "notes"), { recursive: true });
mkdirSync(resolve(dest, "assets/raw"), { recursive: true });
mkdirSync(resolve(dest, "assets/optimized"), { recursive: true });

writeFileSync(
  resolve(dest, "brief.md"),
  `# ${playableId}\n\nCreated from template \`${templateId}\`.\n`,
);
writeFileSync(
  resolve(dest, "playable.config.json"),
  JSON.stringify(
    {
      id: playableId,
      templateId,
      status: "draft",
      locale: copy.locale || "en",
      pageName: playableId,
      viewport: composition.viewport || { width: 390, height: 844 },
    },
    null,
    2,
  ),
);
writeFileSync(resolve(dest, "composition.json"), JSON.stringify(composition, null, 2));
writeFileSync(resolve(dest, "copy.json"), JSON.stringify(copy, null, 2));
writeFileSync(
  resolve(dest, "asset.manifest.json"),
  JSON.stringify({ version: "1.0.0", assets: [] }, null, 2),
);
writeFileSync(
  resolve(dest, "notes/prompt.md"),
  `Created via pnpm compose:create ${playableId} ${templateId}\n`,
);

registerPlayableInRegistry({
  id: playableId,
  name: playableId.replace(/-/g, " "),
  engine: "compose",
  status: "draft",
});

console.log(`\n✅ Created playables/${playableId}/ from template ${templateId}`);
console.log(`   Edit composition.json + copy.json`);
console.log(`   pnpm compose:build ${playableId}\n`);
