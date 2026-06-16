/**
 * Load blocks, templates, validate composition + copy.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import {
  BLOCKS_ROOT,
  PLAYABLES_ROOT,
  TEMPLATES_ROOT,
} from "./paths.mjs";

export function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function listBlockIds() {
  const regPath = resolve(BLOCKS_ROOT, "registry.json");
  if (existsSync(regPath)) {
    return loadJson(regPath).blocks ?? [];
  }
  return readdirSync(BLOCKS_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

export function loadBlockManifest(blockId) {
  const path = resolve(BLOCKS_ROOT, blockId, "block.manifest.json");
  if (!existsSync(path)) return null;
  return loadJson(path);
}

export function blockIdFromRef(blockRef) {
  if (!blockRef || typeof blockRef !== "string") return null;
  const parts = blockRef.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? null;
}

export function listTemplateIds() {
  const regPath = resolve(TEMPLATES_ROOT, "registry.json");
  if (!existsSync(regPath)) return [];
  return (loadJson(regPath).templates ?? []).map((t) =>
    typeof t === "string" ? t : t.id,
  );
}

export function loadTemplateManifest(templateId) {
  const path = resolve(TEMPLATES_ROOT, templateId, "template.manifest.json");
  if (!existsSync(path)) return null;
  return loadJson(path);
}

export function listPlayableIds() {
  if (!existsSync(PLAYABLES_ROOT)) return [];
  return readdirSync(PLAYABLES_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("_"))
    .filter((d) =>
      existsSync(resolve(PLAYABLES_ROOT, d.name, "composition.json")),
    )
    .map((d) => d.name)
    .sort();
}

export function loadPlayable(playableId) {
  const dir = resolve(PLAYABLES_ROOT, playableId);
  const compositionPath = resolve(dir, "composition.json");
  const copyPath = resolve(dir, "copy.json");
  const configPath = resolve(dir, "playable.config.json");

  if (!existsSync(compositionPath)) {
    throw new Error(`Missing composition.json for playable "${playableId}"`);
  }

  const composition = loadJson(compositionPath);
  const copy = existsSync(copyPath) ? loadJson(copyPath) : { slots: {} };
  const config = existsSync(configPath)
    ? loadJson(configPath)
    : { id: playableId, pageName: playableId };

  return { dir, composition, copy, config };
}

function mergeSlots(copy, overrides = {}) {
  return { ...(copy.slots ?? {}), ...overrides };
}

function requiredCopySlots(blockId) {
  const manifest = loadBlockManifest(blockId);
  return manifest?.copySlots ?? [];
}

/**
 * @returns {{ errors: string[], warnings: string[], report: object }}
 */
export function validateComposition(composition, copy = { slots: {} }) {
  const errors = [];
  const warnings = [];
  const templateIds = new Set(listTemplateIds());
  const blockIds = new Set(listBlockIds());

  if (!composition.viewport?.width || !composition.viewport?.height) {
    warnings.push("composition.viewport should define width/height (390×844)");
  }

  if (composition.mode === "regions" || composition.screens) {
    validateRegions(composition, copy, { errors, warnings, templateIds, blockIds });
  } else {
    validateFlow(composition, copy, { errors, warnings, templateIds, blockIds });
  }

  const report = {
    compositionId: composition.id,
    status: errors.length ? "error" : warnings.length ? "warning" : "ok",
    summary: { errors: errors.length, warnings: warnings.length },
    errors: errors.map((message) => ({ message })),
    warnings: warnings.map((message) => ({ message })),
  };

  return { errors, warnings, report };
}

function validateFlow(composition, copy, ctx) {
  const flow = composition.flow;
  if (!Array.isArray(flow) || flow.length === 0) {
    ctx.errors.push("composition.flow must be a non-empty array");
    return;
  }

  const ids = new Set();
  for (const step of flow) {
    if (!step.id) ctx.errors.push("Each flow step needs an id");
    if (step.id && ids.has(step.id)) ctx.errors.push(`Duplicate flow step id: ${step.id}`);
    if (step.id) ids.add(step.id);

    validateStep(step, copy, ctx);
  }
}

function validateRegions(composition, copy, ctx) {
  const screens = composition.screens;
  if (!Array.isArray(screens) || screens.length === 0) {
    ctx.errors.push("composition.screens must be a non-empty array");
    return;
  }

  for (const screen of screens) {
    if (!screen.regions || typeof screen.regions !== "object") {
      ctx.errors.push(`Screen "${screen.id}" missing regions object`);
      continue;
    }
    for (const [region, step] of Object.entries(screen.regions)) {
      validateStep({ ...step, id: `${screen.id}:${region}` }, copy, ctx);
    }
  }
}

function validateStep(step, copy, ctx) {
  const blockId = blockIdFromRef(step.blockRef);
  if (!blockId) {
    ctx.errors.push(`Step "${step.id}": invalid blockRef`);
    return;
  }
  if (!ctx.blockIds.has(blockId)) {
    ctx.errors.push(`Step "${step.id}": unknown block "${blockId}"`);
  }

  if (step.fromTemplate && !ctx.templateIds.has(step.fromTemplate)) {
    ctx.errors.push(
      `Step "${step.id}": unknown template "${step.fromTemplate}"`,
    );
  }

  const manifest = loadBlockManifest(blockId);
  if (!manifest) return;

  const slots = mergeSlots(copy, step.copyOverrides);
  for (const key of manifest.copySlots ?? []) {
    if (slots[key] === undefined || slots[key] === "") {
      ctx.warnings.push(
        `Step "${step.id}" block "${blockId}": missing copy slot "${key}"`,
      );
    }
  }
}

export function validatePlayable(playableId) {
  const { composition, copy, config } = loadPlayable(playableId);
  const result = validateComposition(composition, copy);

  if (config.templateId && !listTemplateIds().includes(config.templateId)) {
    result.warnings.push(`playable.config templateId "${config.templateId}" not in registry`);
  }

  result.report.playableId = playableId;
  result.report.pageName = config.pageName ?? playableId;
  return result;
}
