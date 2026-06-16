#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateStudioPlayableId } from "./lib/studio.mjs";
import { studioPlayableDir } from "./lib/studio-paths.mjs";
import { listPlayableIds } from "./lib/compose.mjs";

const id = process.argv[2]?.trim();
if (!id) {
  console.error("Usage: pnpm studio:validate <playable-id>");
  console.error(`Available: ${listPlayableIds().join(", ")}`);
  process.exit(1);
}

let result;
try {
  result = validateStudioPlayableId(id);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}

const { errors, warnings, report } = result;
console.log(`\nStudio validate: playables/${id}\nStatus: ${report.status}\n`);
errors.forEach((e) => console.log(`  ✗ ${e}`));
warnings.forEach((w) => console.log(`  ⚠ ${w}`));
if (!errors.length && !warnings.length) console.log("  ✅ OK");

const gen = resolve(studioPlayableDir(id), "generated");
mkdirSync(gen, { recursive: true });
writeFileSync(resolve(gen, "validation.report.json"), JSON.stringify(report, null, 2));
process.exit(errors.length ? 1 : 0);
