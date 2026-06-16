#!/usr/bin/env node
/**
 * Build every page under src/pages/ as dist/<name>/index.html
 * Usage: pnpm build
 */
import { spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { discoverRoutes } from "./discover-routes.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");

const routes = discoverRoutes();

if (!routes.length) {
  console.error("No pages found under src/pages/*/index.html");
  process.exit(1);
}

if (existsSync(DIST)) {
  rmSync(DIST, { recursive: true, force: true });
}

console.log(`\n📦 Building ${routes.length} page(s): ${routes.join(", ")}\n`);

for (const route of routes) {
  console.log(`—— ${route} ——\n`);
  const result = spawnSync("pnpm", ["exec", "vite", "build"], {
    cwd: ROOT,
    env: {
      ...process.env,
      PLAYABLE_ROUTE: route,
      PLAYABLE_KEEP_DIST: "1",
    },
    stdio: "inherit",
    shell: true,
  });

  if (result.status !== 0) {
    console.error(`\n❌ Build failed for page: ${route}\n`);
    process.exit(result.status ?? 1);
  }
}

console.log("\n✅ All pages built:\n");
for (const name of routes) {
  console.log(`   dist/${name}/index.html`);
}
console.log("");
