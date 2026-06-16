#!/usr/bin/env node
/**
 * Build one page as a single self-contained HTML file.
 * Usage: pnpm build:single <page-name>
 */
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assertRouteExists } from "./discover-routes.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const route = process.argv[2]?.trim().toLowerCase();

if (!route) {
  console.error("Usage: pnpm build:single <page-name>");
  console.error("Example: pnpm build:single hero-screen");
  process.exit(1);
}

assertRouteExists(route);

console.log(`\n📦 Building single HTML for page: ${route}\n`);

const result = spawnSync("pnpm", ["exec", "vite", "build"], {
  cwd: ROOT,
  env: { ...process.env, PLAYABLE_ROUTE: route },
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 1);
