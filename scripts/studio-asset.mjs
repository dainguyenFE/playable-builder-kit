#!/usr/bin/env node
/**
 * Studio asset catalog — save / delete / embed (clone into playable).
 *
 * Usage:
 *   pnpm studio:asset list [--type image|lottie]
 *   pnpm studio:asset save <id> --image <file>
 *   pnpm studio:asset save <id> --lottie <file>
 *   pnpm studio:asset delete <id>
 *   pnpm studio:asset embed <id> --playable <playable-id>
 *   pnpm studio:asset embed <id> --template <template-id>
 */
import { resolve } from "node:path";
import { ROOT } from "./lib/paths.mjs";
import {
  deleteCatalogAsset,
  embedAssetInBundle,
  listCatalogAssets,
  saveCatalogAssetFromFile,
} from "./lib/studio-asset-lib.mjs";

const argv = process.argv.slice(2);

function flag(name) {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
}

function usage() {
  console.log(`
Studio assets (data/studio/assets/)

  pnpm studio:asset list [--type image|lottie|icon]
  pnpm studio:asset save <id> --image <file> [--label "…"]
  pnpm studio:asset save <id> --lottie <file> [--label "…"]
  pnpm studio:asset save <id> --icon <file> [--label "…"]
  pnpm studio:asset delete <id>
  pnpm studio:asset embed <id> --playable <playable-id>
  pnpm studio:asset embed <id> --template <template-id>

Embed clones inline data into assets.json — playable keeps working if catalog asset is deleted.
`);
}

const cmd = argv[0];

if (!cmd || cmd === "--help" || cmd === "-h") {
  usage();
  process.exit(0);
}

if (cmd === "list") {
  const type = flag("--type");
  const assets = listCatalogAssets(type);
  if (!assets.length) {
    console.log("No assets in catalog.");
    process.exit(0);
  }
  for (const a of assets) {
    console.log(`  ${a.id} [${a.type}] — ${a.label || a.id} (${a.path})`);
  }
  process.exit(0);
}

if (cmd === "save") {
  const id = argv[1];
  const imageFile = flag("--image");
  const lottieFile = flag("--lottie");
  const iconFile = flag("--icon");
  const label = flag("--label");
  if (!id) {
    console.error("Usage: pnpm studio:asset save <id> --image|--lottie|--icon <file>");
    process.exit(1);
  }
  try {
    if (imageFile) {
      const entry = saveCatalogAssetFromFile(id, "image", imageFile, label);
      console.log(`✅ Saved image asset "${entry.id}" → ${entry.path}`);
    } else if (lottieFile) {
      const entry = saveCatalogAssetFromFile(id, "lottie", lottieFile, label);
      console.log(`✅ Saved lottie asset "${entry.id}" → ${entry.path}`);
    } else if (iconFile) {
      const entry = saveCatalogAssetFromFile(id, "icon", iconFile, label);
      console.log(`✅ Saved icon asset "${entry.id}" → ${entry.path}`);
    } else {
      console.error("Specify --image, --lottie, or --icon <file>");
      process.exit(1);
    }
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
  process.exit(0);
}

if (cmd === "delete") {
  const id = argv[1];
  if (!id) {
    console.error("Usage: pnpm studio:asset delete <id>");
    process.exit(1);
  }
  try {
    const removed = deleteCatalogAsset(id);
    console.log(`✅ Deleted catalog asset "${removed.id}" (${removed.path})`);
    console.log("   Playables with embedded copies are unaffected.");
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
  process.exit(0);
}

if (cmd === "embed") {
  const assetId = argv[1];
  const playableId = flag("--playable");
  const templateId = flag("--template");
  if (!assetId || (!playableId && !templateId)) {
    console.error("Usage: pnpm studio:asset embed <id> --playable <id> | --template <id>");
    process.exit(1);
  }
  const bundlePath = playableId
    ? resolve(ROOT, "playables", playableId, "assets.json")
    : resolve(ROOT, "data/templates", templateId, "assets.preset.json");
  try {
    const cloned = embedAssetInBundle(bundlePath, assetId);
    console.log(`✅ Embedded "${cloned.id}" (inline) in ${bundlePath}`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
  process.exit(0);
}

usage();
process.exit(1);
