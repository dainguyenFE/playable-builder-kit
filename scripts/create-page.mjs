#!/usr/bin/env node
/**
 * Create a new isolated page: src/pages/<name>/
 * Usage: pnpm new:page <name> [playable|landing|minimal]
 * Aliases: pnpm new:route, pnpm new:playable, pnpm new:landing
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PAGES_ROOT } from "./discover-routes.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const TEMPLATES_ROOT = resolve(ROOT, "templates");

const TEMPLATE_TYPES = ["playable", "landing", "minimal"];

const LIFECYCLE_TEMPLATE = {
  "new:playable": "playable",
  "new:route": "playable",
  "new:landing": "landing",
  "new:minimal": "minimal",
};

const name = process.argv[2]?.trim().toLowerCase();
const templateType =
  process.argv[3]?.trim().toLowerCase() ||
  LIFECYCLE_TEMPLATE[process.env.npm_lifecycle_event] ||
  "playable";

if (!name) {
  console.error("Usage: pnpm new:page <page-name> [playable|landing|minimal]");
  console.error("Example: pnpm new:page hero-screen playable");
  process.exit(1);
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
  console.error("Page name must be kebab-case (e.g. hero-screen, s1-intro).");
  process.exit(1);
}

if (!TEMPLATE_TYPES.includes(templateType)) {
  console.error(`Unknown template "${templateType}". Use: ${TEMPLATE_TYPES.join(", ")}`);
  process.exit(1);
}

const templateDir = resolve(TEMPLATES_ROOT, templateType);
if (!existsSync(templateDir)) {
  console.error(`Template folder missing: ${templateDir}`);
  process.exit(1);
}

const dest = resolve(PAGES_ROOT, name);
if (existsSync(dest)) {
  console.error(`Page already exists: ${dest}`);
  process.exit(1);
}

const className = `route-${name}`;

function copyDir(src, dst) {
  mkdirSync(dst, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const from = resolve(src, entry.name);
    const to = resolve(dst, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else {
      let text = readFileSync(from, "utf8");
      text = text
        .replaceAll("__ROUTE_NAME__", name)
        .replaceAll("__ROUTE_CLASS__", className);
      writeFileSync(to, text);
    }
  }
}

copyDir(templateDir, dest);
mkdirSync(resolve(dest, "assets/images"), { recursive: true });
mkdirSync(resolve(dest, "assets/lottie"), { recursive: true });

console.log(`\n✅ Page created: src/pages/${name}/ (template: ${templateType})`);
console.log(`   Dev:   PLAYABLE_ROUTE=${name} pnpm dev`);
console.log(`   Build: PLAYABLE_ROUTE=${name} pnpm build`);
console.log(`   Single: pnpm build:single ${name}`);
console.log(`   Output: dist/${name}/index.html\n`);
