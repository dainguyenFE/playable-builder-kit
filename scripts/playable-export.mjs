#!/usr/bin/env node
/**
 * Export final single HTML for any playable (auto-detect engine).
 *
 * Usage:
 *   pnpm playable:export <playable-id>
 *   pnpm playable:export --list
 *
 * Output:
 *   studio  → dist/exports/<id>.html
 *   compose → dist/<page>/index.html (+ verify AppLovin)
 *   scaffold → dist/<id>/index.html (+ verify AppLovin)
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { ROOT } from "./lib/paths.mjs";
import {
  getExportTarget,
  listExportablePlayables,
  resolvePlayableEngine,
} from "./lib/playable-resolve.mjs";

function run(nodeScript, args) {
  const r = spawnSync("node", [resolve(ROOT, "scripts", nodeScript), ...args], {
    cwd: ROOT,
    stdio: "inherit",
  });
  if ((r.status ?? 1) !== 0) process.exit(r.status ?? 1);
}

function runPnpm(args) {
  const r = spawnSync("pnpm", args, { cwd: ROOT, stdio: "inherit", shell: true });
  if ((r.status ?? 1) !== 0) process.exit(r.status ?? 1);
}

const argv = process.argv.slice(2);

if (argv[0] === "--list" || argv[0] === "-l") {
  console.log("\n📤 Exportable playables (single HTML deliverable)\n");
  const items = listExportablePlayables();
  if (!items.length) {
    console.log("  (none — create with pnpm playable:new)\n");
    process.exit(0);
  }
  for (const p of items) {
    console.log(`  · ${p.id} (${p.engine})`);
    console.log(`    export: pnpm playable:export ${p.id}`);
    console.log(`    file:   ${p.outputPath}`);
  }
  console.log("");
  process.exit(0);
}

const id = argv[0]?.trim();
if (!id) {
  console.error("Usage: pnpm playable:export <playable-id>");
  console.error("       pnpm playable:export --list");
  process.exit(1);
}

const engine = resolvePlayableEngine(id);
if (!engine) {
  console.error(`\n❌ Unknown playable "${id}".`);
  console.error("   Create: pnpm playable:new <id> studio|compose|scaffold …");
  console.error("   List:   pnpm playable:export --list\n");
  process.exit(1);
}

const target = getExportTarget(id, engine);
console.log(`\n📤 Exporting "${id}" (${engine})…\n`);

if (engine === "studio") {
  run("studio-export.mjs", [id]);
} else if (engine === "compose") {
  run("compose-build.mjs", [id]);
} else if (engine === "scaffold") {
  runPnpm(["build:single", id]);
  run("verify-applovin.mjs", [id]);
} else {
  console.error(`Unsupported engine: ${engine}`);
  process.exit(1);
}

if (!existsSync(resolve(ROOT, target.outputPath))) {
  console.error(`\n⚠️  Expected output missing: ${target.outputPath}\n`);
  process.exit(1);
}

console.log(`\n✅ Deliverable ready for AppLovin / ad network upload:`);
console.log(`   ${target.outputPath}`);
if (target.copyPath && existsSync(resolve(ROOT, target.copyPath))) {
  console.log(`   (copy: ${target.copyPath})`);
}
console.log(`\n   Marketing: upload this single .html file to AppLovin Preview.\n`);
