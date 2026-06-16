#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ROOT } from "./lib/paths.mjs";
import { listPlayableIds } from "./lib/compose.mjs";

const reg = JSON.parse(
  readFileSync(resolve(ROOT, "data/registry/playables.json"), "utf8"),
);

console.log("\n🎬 Studio playables\n");
for (const p of reg.playables ?? []) {
  console.log(`  · ${p.id} (${p.engine}) — ${p.name}`);
}
console.log("\n📁 playables/ folders:", listPlayableIds().join(", ") || "(none)");
console.log("\nCommands:");
console.log("  pnpm playable:export <id>");
console.log("  pnpm playable:export --list");
console.log("  pnpm dev → / · /preview/<id>\n");
