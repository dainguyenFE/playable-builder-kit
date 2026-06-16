#!/usr/bin/env node
/**
 * Generate template catalog from docs/AI_PLAYABLE_USER_CASE_SCENARIOS_V3_SCREEN_DETAIL.md
 * Writes only data/templates/<id>/** and registry template entries — never playables/.
 * Run: pnpm template:catalog:generate
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadThemesCatalog } from "./lib/studio-themes.mjs";
import { buildPlayablePreset } from "./lib/template-scaffold.mjs";
import { assetsPreset } from "./lib/cta-presets.mjs";
import { buildUserCaseCatalog, OLD_TEMPLATE_IDS } from "./lib/user-case-catalog.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TEMPLATES = resolve(ROOT, "data/templates");
const REGISTRY = resolve(ROOT, "data/registry/playables.json");
const themes = loadThemesCatalog().themes ?? {};

function pack(entry) {
  const { meta, context, scenario, assets } = entry;
  const theme = themes[meta.defaultTheme] ?? themes["midnight-blue"];
  return {
    template: {
      id: meta.id,
      name: meta.name,
      description: meta.description,
      screenCount: meta.screenCount,
      scenarioGuide: meta.scenarioGuide,
      scenarioDoc: "docs/AI_PLAYABLE_USER_CASE_SCENARIOS_V3_SCREEN_DETAIL.md",
      defaultTheme: meta.defaultTheme,
      themes: meta.themes,
      flow: meta.flow,
      userCase: meta.userCase,
      scenario: meta.scenario,
    },
    context,
    scenario,
    assets: assetsPreset(assets?.assets ? assets.assets : assets ?? []),
    playable: buildPlayablePreset(meta.id, theme),
  };
}

function writeTemplate(id, packData) {
  const dir = resolve(TEMPLATES, id);
  mkdirSync(dir, { recursive: true });
  mkdirSync(resolve(dir, "exports"), { recursive: true });
  writeFileSync(resolve(dir, "template.json"), `${JSON.stringify(packData.template, null, 2)}\n`);
  writeFileSync(resolve(dir, "context.preset.json"), `${JSON.stringify(packData.context, null, 2)}\n`);
  writeFileSync(resolve(dir, "scenario.preset.json"), `${JSON.stringify(packData.scenario, null, 2)}\n`);
  writeFileSync(resolve(dir, "assets.preset.json"), `${JSON.stringify(packData.assets, null, 2)}\n`);
  writeFileSync(resolve(dir, "playable.preset.json"), `${JSON.stringify(packData.playable, null, 2)}\n`);
}

function main() {
  const catalog = buildUserCaseCatalog();
  const newIds = new Set(Object.keys(catalog));

  for (const id of OLD_TEMPLATE_IDS) {
    const dir = resolve(TEMPLATES, id);
    if (existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true });
      console.log(`🗑  deleted ${id}`);
    }
  }

  // Remove any other ai-* folders not in new catalog
  if (existsSync(TEMPLATES)) {
    for (const name of readdirSync(TEMPLATES, { withFileTypes: true })) {
      if (!name.isDirectory() || name.name === "README.md") continue;
      if (!newIds.has(name.name) && name.name.startsWith("ai-")) {
        rmSync(resolve(TEMPLATES, name.name), { recursive: true, force: true });
        console.log(`🗑  removed legacy ${name.name}`);
      }
    }
  }

  for (const [id, entry] of Object.entries(catalog)) {
    const data = pack(entry);
    writeTemplate(id, data);
    console.log(`✅ ${id} (${data.template.screenCount} screens · ${data.template.name})`);
  }

  const reg = JSON.parse(readFileSync(REGISTRY, "utf8"));
  reg.templates = (reg.templates ?? []).filter((t) => !OLD_TEMPLATE_IDS.includes(t.id) && (newIds.has(t.id) || !t.id?.startsWith("ai-")));

  for (const [id, entry] of Object.entries(catalog)) {
    const data = pack(entry);
    const regEntry = {
      id,
      name: data.template.name,
      engine: "studio",
      status: "ready",
      category: entry.meta.userCase,
      scenario: entry.meta.scenario,
      previewPath: `/preview/template/${id}`,
      description: data.template.description,
      screenCount: data.template.screenCount,
      scenarioGuide: data.template.scenarioGuide,
      flow: data.template.flow,
    };
    const idx = reg.templates.findIndex((t) => t.id === id);
    if (idx >= 0) reg.templates[idx] = { ...reg.templates[idx], ...regEntry };
    else reg.templates.push(regEntry);
  }

  writeFileSync(REGISTRY, `${JSON.stringify(reg, null, 2)}\n`);
  console.log(`\n📚 ${Object.keys(catalog).length} templates from AI_PLAYABLE_USER_CASE_SCENARIOS_V3_SCREEN_DETAIL.md`);
  console.log("   Run: pnpm template:export <id>");
}

main();
