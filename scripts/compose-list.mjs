#!/usr/bin/env node
/**
 * List blocks, templates, playables.
 * Usage: pnpm compose:list
 */
import {
  listBlockIds,
  listPlayableIds,
  listTemplateIds,
  loadBlockManifest,
  loadTemplateManifest,
} from "./lib/compose.mjs";

console.log("\n📦 Blocks\n");
for (const id of listBlockIds()) {
  const m = loadBlockManifest(id);
  console.log(`  · ${id} — ${m?.behaviorType ?? "?"}`);
}

console.log("\n📋 Playable templates\n");
for (const id of listTemplateIds()) {
  const m = loadTemplateManifest(id);
  console.log(`  · ${id} — ${m?.name ?? id}`);
}

console.log("\n🎯 Playables (campaigns)\n");
const playables = listPlayableIds();
if (!playables.length) console.log("  (none)");
for (const id of playables) {
  console.log(`  · ${id}`);
}
console.log("");
