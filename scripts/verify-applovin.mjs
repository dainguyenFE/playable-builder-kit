#!/usr/bin/env node
/**
 * Quick AppLovin-oriented checks on built single HTML.
 * Usage: pnpm verify:applovin <page-name>
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const page = process.argv[2]?.trim().toLowerCase();

if (!page) {
  console.error("Usage: pnpm verify:applovin <page-name>");
  process.exit(1);
}

const htmlPath = resolve(__dirname, "../dist", page, "index.html");
if (!existsSync(htmlPath)) {
  console.error(`Not found: ${htmlPath}\nRun: pnpm build:single ${page}`);
  process.exit(1);
}

const html = readFileSync(htmlPath, "utf8");
const errors = [];
const warnings = [];

if (/\beval\s*\(/.test(html)) {
  errors.push("Contains eval() — use lottie_light only; remove eval from custom code");
}

if (/src=["']https?:\/\//i.test(html)) {
  errors.push('Contains src="http(s)://..." — assets must be base64 inlined');
}

if (/src=["']\/src\//i.test(html)) {
  errors.push('Contains src="/src/..." — run pnpm build:single and ship dist output only');
}

if (!/getState/.test(html)) {
  warnings.push("No mraid.getState reference — ensure bindStoreCta/initStoreLink is used");
}

if (!/addEventListener/.test(html) || !/ready/.test(html)) {
  warnings.push("No MRAID ready listener pattern detected in bundle");
}

if (!/data:image\/(png|jpeg|svg\+xml);base64,/.test(html)) {
  warnings.push("No base64 images found — OK if page has no raster/SVG imports");
}

console.log(`\nAppLovin verify: dist/${page}/index.html\n`);

if (errors.length) {
  console.log("❌ FAILED\n");
  for (const e of errors) console.log(`  · ${e}`);
} else {
  console.log("✅ No critical issues (eval / external src)\n");
}

if (warnings.length) {
  console.log("⚠️  Warnings\n");
  for (const w of warnings) console.log(`  · ${w}`);
}

console.log("");
process.exit(errors.length ? 1 : 0);
