#!/usr/bin/env node
/**
 * Scaffold src/pages/<page>/ from playables/<id>/ composition.
 * Usage: pnpm compose:scaffold <playable-id> [--force]
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  listPlayableIds,
  loadPlayable,
  validatePlayable,
} from "./lib/compose.mjs";
import { COMPOSE_SCAFFOLD, PAGES_ROOT } from "./lib/paths.mjs";

const id = process.argv[2]?.trim();
const force = process.argv.includes("--force");

if (!id) {
  console.error("Usage: pnpm compose:scaffold <playable-id> [--force]");
  process.exit(1);
}

if (!listPlayableIds().includes(id)) {
  console.error(`Unknown playable "${id}". Run: pnpm compose:list`);
  process.exit(1);
}

const validation = validatePlayable(id);
if (validation.errors.length) {
  console.error("\n❌ Fix validation errors first:\n");
  for (const e of validation.errors) console.error(`  · ${e}`);
  process.exit(1);
}

const { composition, copy, config } = loadPlayable(id);
const pageName = (config.pageName || id).toLowerCase();
const routeClass = `route-${pageName}`;
const dest = resolve(PAGES_ROOT, pageName);

if (existsSync(dest) && !force) {
  console.error(`Page exists: src/pages/${pageName}/ — use --force to overwrite scaffold files`);
  process.exit(1);
}

if (!existsSync(COMPOSE_SCAFFOLD)) {
  console.error(`Missing scaffold: ${COMPOSE_SCAFFOLD}`);
  process.exit(1);
}

function replaceAll(text) {
  const title =
    config.product?.name || config.campaign?.cta?.label || pageName;
  return text
    .replaceAll("__ROUTE_NAME__", pageName)
    .replaceAll("__ROUTE_CLASS__", routeClass)
    .replaceAll("__PAGE_TITLE__", title);
}

function copyScaffold(srcDir, dstDir) {
  mkdirSync(dstDir, { recursive: true });
  for (const entry of readdirSync(srcDir, { withFileTypes: true })) {
    const from = resolve(srcDir, entry.name);
    const to = resolve(dstDir, entry.name);
    if (entry.isDirectory()) copyScaffold(from, to);
    else writeFileSync(to, replaceAll(readFileSync(from, "utf8")));
  }
}

copyScaffold(COMPOSE_SCAFFOLD, dest);
mkdirSync(resolve(dest, "assets/images"), { recursive: true });
mkdirSync(resolve(dest, "assets/lottie"), { recursive: true });

writeFileSync(
  resolve(dest, "composition.json"),
  JSON.stringify(composition, null, 2),
);
writeFileSync(resolve(dest, "copy.json"), JSON.stringify(copy, null, 2));

console.log(`\n✅ Scaffolded src/pages/${pageName}/ from playables/${id}`);
console.log(`   Dev:    pnpm dev → http://localhost:5173/${pageName}`);
console.log(`   Build:  pnpm compose:build ${id}\n`);
