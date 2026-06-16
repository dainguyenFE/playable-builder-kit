#!/usr/bin/env node
/**
 * Validate → scaffold → build → verify AppLovin.
 * Usage: pnpm compose:build <playable-id>
 */
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadPlayable } from "./lib/compose.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const id = process.argv[2]?.trim();
if (!id) {
  console.error("Usage: pnpm compose:build <playable-id>");
  process.exit(1);
}

function run(cmd, args) {
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: "inherit", shell: true });
  if ((r.status ?? 1) !== 0) process.exit(r.status ?? 1);
}

run("node", ["scripts/compose-validate.mjs", id]);
run("node", ["scripts/compose-scaffold.mjs", id, "--force"]);

const { config } = loadPlayable(id);
const pageName = (config.pageName || id).toLowerCase();

run("pnpm", ["build:single", pageName]);
run("node", ["scripts/verify-applovin.mjs", pageName]);

console.log(`\n✅ Deliverable: dist/${pageName}/index.html\n`);
