#!/usr/bin/env node
/**
 * Delete a playable campaign (folder + registry + exports).
 *
 * Usage:
 *   pnpm playable:delete --list
 *   pnpm playable:delete --list --json
 *   pnpm playable:delete <playable-id> [--dry-run]
 *
 * Exit 2 when no id — agent should ask user to pick from --list.
 */
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { ROOT } from "./lib/paths.mjs";
import {
  listDeletablePlayables,
  planPlayableDelete,
  loadPlayablesRegistry,
} from "./lib/playable-resolve.mjs";

const REGISTRY_PATH = resolve(ROOT, "data/registry/playables.json");
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function printHumanList(items) {
  console.log("\n🗑️  Deletable playables\n");
  if (!items.length) {
    console.log("  (none)\n");
    return;
  }
  for (const p of items) {
    const reg = p.inRegistry ? "" : " (folder only, not in registry)";
    console.log(`  · ${p.id} — ${p.name} [${p.engine}]${reg}`);
    console.log(`    delete: pnpm playable:delete ${p.id}`);
  }
  console.log("");
}

function printJsonList(items, needsSelection) {
  const payload = {
    needsSelection,
    message: needsSelection
      ? "No playable id provided. Ask the user which playable to delete."
      : "Deletable playables.",
    playables: items.map((p) => ({
      id: p.id,
      name: p.name,
      engine: p.engine,
      inRegistry: p.inRegistry,
      deleteCommand: `pnpm playable:delete ${p.id}`,
    })),
  };
  console.log(JSON.stringify(payload, null, 2));
}

function removeFromRegistry(id) {
  const reg = loadPlayablesRegistry();
  const before = reg.playables?.length ?? 0;
  reg.playables = (reg.playables ?? []).filter((p) => p.id !== id);
  if (reg.playables.length === before) return false;
  writeFileSync(REGISTRY_PATH, JSON.stringify(reg, null, 2) + "\n");
  return true;
}

function executeDelete(plan) {
  for (const item of plan.paths) {
    const abs = resolve(ROOT, item.rel);
    if (!existsSync(abs)) continue;
    if (item.type === "directory") {
      rmSync(abs, { recursive: true, force: true });
    } else {
      rmSync(abs, { force: true });
    }
  }
  if (plan.inRegistry) removeFromRegistry(plan.id);
}

const argv = process.argv.slice(2);
const jsonMode = argv.includes("--json");
const dryRun = argv.includes("--dry-run");
const listMode = argv.includes("--list") || argv.includes("-l");
const id = argv.find((a) => !a.startsWith("-"))?.trim();

if (listMode || !id) {
  const items = listDeletablePlayables();
  if (jsonMode) {
    printJsonList(items, !id && !listMode);
  } else {
    printHumanList(items);
    if (!id && !listMode) {
      console.log("Pick an id: pnpm playable:delete <playable-id>");
      console.log("Dry run:    pnpm playable:delete <playable-id> --dry-run\n");
    }
  }
  process.exit(!id && !listMode ? 2 : 0);
}

if (!KEBAB.test(id)) {
  console.error(`\n❌ Invalid playable id "${id}" (use kebab-case).\n`);
  process.exit(1);
}

const plan = planPlayableDelete(id);
if (!plan) {
  console.error(`\n❌ Unknown playable "${id}".`);
  console.error("   List: pnpm playable:delete --list\n");
  process.exit(1);
}

if (!plan.paths.length && !plan.inRegistry) {
  console.error(`\n❌ Nothing to delete for "${id}".\n`);
  process.exit(1);
}

if (dryRun) {
  console.log(`\n🔍 Dry run — would delete "${id}" (${plan.engine}):\n`);
  for (const p of plan.paths) console.log(`  · ${p.type}: ${p.rel}`);
  if (plan.inRegistry) console.log(`  · registry: data/registry/playables.json → remove "${id}"`);
  console.log("");
  process.exit(0);
}

console.log(`\n🗑️  Deleting playable "${id}" (${plan.engine})…\n`);
executeDelete(plan);
for (const p of plan.paths) console.log(`  ✓ removed ${p.rel}`);
if (plan.inRegistry) console.log(`  ✓ removed from registry`);
console.log(`\n✅ Deleted: ${id}\n`);
