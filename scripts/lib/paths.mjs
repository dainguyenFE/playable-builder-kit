/**
 * Shared paths for blocks, templates, playables.
 */
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const ROOT = resolve(__dirname, "../..");
export const BLOCKS_ROOT = resolve(ROOT, "blocks");
export const TEMPLATES_ROOT = resolve(ROOT, "playable-templates");
export const PLAYABLES_ROOT = resolve(ROOT, "playables");
export const PAGES_ROOT = resolve(ROOT, "src/pages");
export const COMPOSE_SCAFFOLD = resolve(ROOT, "scaffolds/compose");
