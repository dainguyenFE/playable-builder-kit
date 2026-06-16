import { resolve } from "node:path";
import { PLAYABLES_ROOT, ROOT } from "../../scripts/lib/paths.mjs";

export const STUDIO_SCHEMA_ROOT = resolve(ROOT, "src/studio-schema");
export const DATA_REGISTRY = resolve(ROOT, "data/registry");
export const STUDIO_UI = resolve(ROOT, "studio");
export const EXPORTS_DIR = resolve(ROOT, "dist/exports");

export function studioPlayableDir(id) {
  return resolve(PLAYABLES_ROOT, id);
}

export const STUDIO_FILES = [
  "manifest.json",
  "playable.json",
  "context.json",
  "scenario.json",
  "assets.json",
];
