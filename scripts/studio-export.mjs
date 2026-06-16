#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateStudioPlayableId } from "./lib/studio.mjs";
import { EXPORTS_DIR } from "./lib/studio-paths.mjs";
import { ROOT } from "./lib/paths.mjs";
import { buildStudioHtml, validateStudioHtml } from "./lib/studio-html-build.mjs";

const id = process.argv[2]?.trim();
if (!id) {
  console.error("Usage: pnpm studio:export <playable-id>");
  process.exit(1);
}

const validation = validateStudioPlayableId(id);
if (validation.errors.length) {
  console.error("\n❌ Validation failed:\n");
  validation.errors.forEach((e) => console.error(`  · ${e}`));
  process.exit(1);
}

const html = await buildStudioHtml(validation.bundle, { id });
const errors = validateStudioHtml(html);
if (errors.length) {
  console.error("❌ Export validation:", errors.join(", "));
  process.exit(1);
}

mkdirSync(EXPORTS_DIR, { recursive: true });
writeFileSync(resolve(EXPORTS_DIR, `${id}.html`), html);

const exportsPlayable = resolve(ROOT, "playables", id, "exports");
mkdirSync(exportsPlayable, { recursive: true });
writeFileSync(resolve(exportsPlayable, `${id}.html`), html);

console.log(`\n✅ Exported: dist/exports/${id}.html (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB)`);
