#!/usr/bin/env node
/**
 * Clone a playable from an existing one (studio / compose / scaffold).
 *
 * Usage:
 *   pnpm playable:clone --list
 *   pnpm playable:clone --resolve <source-ref> [--json]
 *   pnpm playable:clone <new-id> <source-ref> [--name "Display name"] [--dry-run]
 *
 * User prompt (agent):
 *   Clone playable "my-campaign-v2" from playable "spring-launch"
 *   → pnpm playable:clone my-campaign-v2 spring-launch
 *
 * If source does not match uniquely, run --resolve or --list and ask user to pick.
 */
import {
  clonePlayable,
  listClonablePlayables,
  normalizePlayableRef,
  resolvePlayableRef,
} from "./lib/playable-clone.mjs";

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function printHumanList(items) {
  console.log("\n📋 Playables available to clone\n");
  if (!items.length) {
    console.log("  (none — create one with pnpm playable:new)\n");
    return;
  }
  for (const p of items) {
    console.log(`  · ${p.id} — ${p.name} [${p.engine}]`);
    console.log(`    clone: pnpm playable:clone <new-id> ${p.id}`);
  }
  console.log("");
}

function printJsonResolve(result, ref) {
  const payload = {
    ref,
    status: result.status,
    message:
      result.status === "ok"
        ? `Matched source playable "${result.playable.id}".`
        : result.status === "ambiguous"
          ? `Multiple playables match "${ref}". Ask the user to pick one id.`
          : `No playable matches "${ref}". Ask the user to pick from the list.`,
    playable: result.status === "ok" ? result.playable : undefined,
    candidates: result.status !== "ok" ? result.candidates : undefined,
    cloneCommand:
      result.status === "ok"
        ? `pnpm playable:clone <new-kebab-id> ${result.playable.id}`
        : undefined,
    listCommand: "pnpm playable:clone --list",
  };
  console.log(JSON.stringify(payload, null, 2));
}

const argv = process.argv.slice(2);
const jsonMode = argv.includes("--json");
const dryRun = argv.includes("--dry-run");
const listMode = argv.includes("--list") || argv.includes("-l");
const resolveMode = argv.includes("--resolve");

const nameIdx = argv.indexOf("--name");
const displayName = nameIdx >= 0 ? argv[nameIdx + 1]?.trim() : undefined;

const positional = argv.filter((a, i) => {
  if (a.startsWith("-")) return false;
  if (nameIdx >= 0 && i === nameIdx + 1) return false;
  return true;
});

if (listMode) {
  const items = listClonablePlayables();
  if (jsonMode) {
    console.log(JSON.stringify({ playables: items }, null, 2));
  } else {
    printHumanList(items);
  }
  process.exit(0);
}

if (resolveMode) {
  const ref = positional[0];
  if (!ref) {
    console.error("Usage: pnpm playable:clone --resolve <source-ref> [--json]");
    process.exit(1);
  }
  const result = resolvePlayableRef(ref);
  if (jsonMode) {
    printJsonResolve(result, ref);
    process.exit(result.status === "ok" ? 0 : 2);
  }
  if (result.status === "ok") {
    console.log(`\n✓ Source: ${result.playable.id} (${result.playable.name}) [${result.playable.engine}]\n`);
    process.exit(0);
  }
  if (result.status === "ambiguous") {
    console.error(`\n❌ Multiple matches for "${ref}":\n`);
    for (const p of result.candidates) {
      console.error(`  · ${p.id} — ${p.name}`);
    }
    console.error("\n   Ask user to pick an id, then: pnpm playable:clone <new-id> <source-id>\n");
    process.exit(2);
  }
  console.error(`\n❌ No playable matches "${ref}".\n`);
  printHumanList(result.candidates);
  process.exit(2);
}

const [newIdRaw, sourceRef] = positional;

if (!newIdRaw || !sourceRef) {
  console.error("\nUsage: pnpm playable:clone <new-id> <source-ref> [--name \"Display name\"]");
  console.error("       pnpm playable:clone --list");
  console.error("       pnpm playable:clone --resolve <source-ref> [--json]");
  console.error("\nExample: pnpm playable:clone nova-chat-v2 nova-chat-v1\n");
  process.exit(1);
}

const newId = normalizePlayableRef(newIdRaw);
if (!KEBAB.test(newId)) {
  console.error(`\n❌ Invalid new playable id "${newIdRaw}" (use kebab-case, e.g. my-campaign-v2).\n`);
  process.exit(1);
}

const resolved = resolvePlayableRef(sourceRef);
if (resolved.status === "ambiguous") {
  console.error(`\n❌ Multiple playables match "${sourceRef}":\n`);
  for (const p of resolved.candidates) {
    console.error(`  · ${p.id} — ${p.name} [${p.engine}]`);
  }
  console.error("\n   Ask user which source id to use.\n");
  if (jsonMode) printJsonResolve(resolved, sourceRef);
  process.exit(2);
}

if (resolved.status === "not_found") {
  console.error(`\n❌ No playable matches "${sourceRef}".\n`);
  if (jsonMode) {
    printJsonResolve(resolved, sourceRef);
  } else {
    printHumanList(resolved.candidates);
  }
  process.exit(2);
}

const sourceId = resolved.playable.id;

if (dryRun) {
  console.log(`\n🔍 Dry run — would clone:`);
  console.log(`   new:    ${newId}${displayName ? ` ("${displayName}")` : ""}`);
  console.log(`   from:   ${sourceId} (${resolved.playable.name}) [${resolved.playable.engine}]`);
  console.log(`   folder: playables/${newId} or src/pages/${newId}\n`);
  process.exit(0);
}

try {
  const result = clonePlayable({
    newId,
    sourceId,
    newName: displayName,
  });

  console.log(`\n✅ Cloned playable "${result.newId}" from "${result.sourceId}" (${result.engine})`);
  console.log(`   Name:    ${result.name}`);
  for (const p of result.paths) console.log(`   Path:    ${p}`);
  console.log(`   Preview: pnpm dev → ${result.previewPath}`);
  console.log(`   Export:  pnpm playable:export ${result.newId}\n`);
} catch (e) {
  console.error(`\n❌ ${e.message}\n`);
  process.exit(1);
}
