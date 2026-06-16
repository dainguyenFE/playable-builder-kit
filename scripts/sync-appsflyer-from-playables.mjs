#!/usr/bin/env node
/**
 * Copy AppsFlyer Smart Script from main playable repo (same file all pages use).
 * From playable-builder-kit/: pnpm sync:appsflyer
 */
import { copyFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const kitRoot = resolve(__dirname, "..");
const monorepoJs = resolve(kitRoot, "../src/js/appfly_script.js");
const monorepoCore = resolve(kitRoot, "../src/core/appfly_script.js");
const source = existsSync(monorepoCore) ? monorepoCore : monorepoJs;
const dest = resolve(kitRoot, "src/core/appfly_script.js");

if (!existsSync(source)) {
  console.error("Source not found:", source);
  console.error("Run from playable monorepo or copy appfly_script.js manually.");
  process.exit(1);
}

copyFileSync(source, dest);
console.log("Synced appfly_script.js → playable-builder-kit/src/core/");
