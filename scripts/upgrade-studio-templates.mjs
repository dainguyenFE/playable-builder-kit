#!/usr/bin/env node
/**
 * Upgrade all studio templates with diverse scenarios (2–5 screens).
 * Prerequisite: pnpm studio:asset:fetch:media
 * Run: pnpm template:upgrade
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { TEMPLATE_PACKS } from "./lib/template-packs-diverse.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TEMPLATES = resolve(ROOT, "data/templates");

function writeJson(path, data) {
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
}

function main() {
  const registryPath = resolve(ROOT, "data/registry/playables.json");
  const registry = JSON.parse(readFileSync(registryPath, "utf8"));

  for (const [id, pack] of Object.entries(TEMPLATE_PACKS)) {
    const dir = resolve(TEMPLATES, id);
    if (!existsSync(dir)) {
      console.warn(`skip ${id} — folder missing`);
      continue;
    }
    writeJson(resolve(dir, "template.json"), pack.template);
    writeJson(resolve(dir, "context.preset.json"), pack.context);
    writeJson(resolve(dir, "scenario.preset.json"), pack.scenario);
    writeJson(resolve(dir, "assets.preset.json"), pack.assets);

    const idx = registry.templates?.findIndex((t) => t.id === id);
    if (idx >= 0) {
      registry.templates[idx] = {
        ...registry.templates[idx],
        name: pack.template.name,
        description: pack.template.description,
        screenCount: pack.template.screenCount,
        scenarioGuide: pack.template.scenarioGuide,
      };
    }
    console.log(`✅ ${id} (${pack.template.screenCount} screens)`);
  }

  writeJson(registryPath, registry);
  console.log("\nDone — run: pnpm template:export <id>");
}

main();
