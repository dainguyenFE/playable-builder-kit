#!/usr/bin/env node
/**
 * Apply JSON patch to studio playable.
 * Usage: pnpm studio:patch <playable-id> <patch.json>
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadJson } from "./lib/compose.mjs";
import { studioPlayableDir } from "./lib/studio-paths.mjs";
import { validateStudioPlayableId } from "./lib/studio.mjs";

const id = process.argv[2]?.trim();
const patchPath = process.argv[3]?.trim();

if (!id || !patchPath) {
  console.error("Usage: pnpm studio:patch <playable-id> <patch.json>");
  process.exit(1);
}

const patch = loadJson(resolve(patchPath));
const dir = studioPlayableDir(id);

function getByPath(obj, path) {
  const parts = path.replace(/^\//, "").split("/");
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

function setByPath(obj, path, value) {
  const parts = path.replace(/^\//, "").split("/");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const p = parts[i];
    if (typeof cur[p] !== "object") cur[p] = {};
    cur = cur[p];
  }
  cur[parts[parts.length - 1]] = value;
}

const fileMap = {
  "/playable": "playable.json",
  "/context": "context.json",
  "/scenario": "scenario.json",
  "/assets": "assets.json",
  "/theme": "playable.json",
};

for (const change of patch.changes ?? []) {
  if (change.op !== "replace") {
    console.warn(`Skip unsupported op: ${change.op}`);
    continue;
  }
  const top = "/" + change.path.replace(/^\//, "").split("/")[0];
  let file = fileMap[top];
  if (change.path.startsWith("/theme/")) file = "playable.json";
  if (!file) {
    console.error(`Unknown patch path: ${change.path}`);
    process.exit(1);
  }
  const filePath = resolve(dir, file);
  const data = loadJson(filePath);
  if (change.path.startsWith("/theme/")) {
    if (!data.theme) data.theme = {};
    const key = change.path.replace("/theme/", "");
    data.theme[key] = change.value;
  } else {
    setByPath(data, change.path.replace(/^\/(playable|context|scenario|assets)/, ""), change.value);
  }
  writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Patched ${file} ${change.path}`);
}

const v = validateStudioPlayableId(id);
if (v.errors.length) {
  console.error("\nValidation failed after patch:");
  v.errors.forEach((e) => console.error(`  · ${e}`));
  process.exit(1);
}
console.log("\n✅ Patch applied and validated\n");
