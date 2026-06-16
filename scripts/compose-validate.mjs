#!/usr/bin/env node
/**
 * Validate playable composition + copy.
 * Usage: pnpm compose:validate <playable-id>
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { listPlayableIds, validatePlayable } from "./lib/compose.mjs";
import { PLAYABLES_ROOT } from "./lib/paths.mjs";

const id = process.argv[2]?.trim();

if (!id) {
  console.error("Usage: pnpm compose:validate <playable-id>");
  console.error(`Available: ${listPlayableIds().join(", ") || "(none)"}`);
  process.exit(1);
}

let result;
try {
  result = validatePlayable(id);
} catch (e) {
  console.error(`\n❌ ${e.message}\n`);
  process.exit(1);
}

const { errors, warnings, report } = result;

console.log(`\nValidate: playables/${id}\n`);
console.log(`Status: ${report.status}\n`);

if (errors.length) {
  console.log("Errors:");
  for (const e of errors) console.log(`  ✗ ${e}`);
}
if (warnings.length) {
  console.log("Warnings:");
  for (const w of warnings) console.log(`  ⚠ ${w}`);
}
if (!errors.length && !warnings.length) {
  console.log("✅ OK — no issues");
}

const genDir = resolve(PLAYABLES_ROOT, id, "generated");
mkdirSync(genDir, { recursive: true });
writeFileSync(
  resolve(genDir, "validation.report.json"),
  JSON.stringify(report, null, 2),
);
console.log(`\nReport: playables/${id}/generated/validation.report.json\n`);

process.exit(errors.length ? 1 : 0);
