/**
 * Resolve playable id → engine + export output path.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { ROOT, PLAYABLES_ROOT, PAGES_ROOT } from "./paths.mjs";
import { loadJson } from "./compose.mjs";

const REGISTRY_PATH = resolve(ROOT, "data/registry/playables.json");

export function loadPlayablesRegistry() {
  if (!existsSync(REGISTRY_PATH)) return { playables: [], templates: [] };
  return loadJson(REGISTRY_PATH);
}

/**
 * Add or update a playable entry in data/registry/playables.json.
 */
export function registerPlayableInRegistry({ id, name, engine, status = "draft" }) {
  const reg = loadPlayablesRegistry();
  reg.playables = reg.playables ?? [];
  const idx = reg.playables.findIndex((p) => p.id === id);
  const entry = { id, name: name || id, engine, status };
  if (idx >= 0) {
    reg.playables[idx] = { ...reg.playables[idx], ...entry };
  } else {
    reg.playables.push(entry);
    reg.playables.sort((a, b) => a.id.localeCompare(b.id));
  }
  writeFileSync(REGISTRY_PATH, JSON.stringify(reg, null, 2) + "\n");
  return entry;
}

/**
 * @returns {"studio"|"compose"|"scaffold"}
 */
export function resolvePlayableEngine(id) {
  const reg = loadPlayablesRegistry();
  const fromReg = (reg.playables ?? []).find((p) => p.id === id);
  if (fromReg?.engine) return fromReg.engine;

  const dir = resolve(PLAYABLES_ROOT, id);
  const manifestPath = resolve(dir, "manifest.json");
  if (existsSync(manifestPath)) {
    const m = loadJson(manifestPath);
    if (m.engine) return m.engine;
    if (existsSync(resolve(dir, "scenario.json"))) return "studio";
  }

  if (existsSync(resolve(dir, "scenario.json")) && existsSync(resolve(dir, "playable.json"))) {
    return "studio";
  }

  if (existsSync(resolve(dir, "composition.json"))) {
    return "compose";
  }

  if (existsSync(resolve(ROOT, "src/pages", id, "index.html"))) {
    return "scaffold";
  }

  return null;
}

export function getExportTarget(id, engine) {
  const eng = engine || resolvePlayableEngine(id);
  if (!eng) return null;

  if (eng === "studio") {
    return {
      engine: eng,
      command: `pnpm playable:export ${id}`,
      outputPath: `dist/exports/${id}.html`,
      copyPath: `playables/${id}/exports/${id}.html`,
    };
  }

  if (eng === "compose") {
    let pageName = id;
    const configPath = resolve(PLAYABLES_ROOT, id, "playable.config.json");
    if (existsSync(configPath)) {
      const cfg = loadJson(configPath);
      pageName = (cfg.pageName || id).toLowerCase();
    }
    return {
      engine: eng,
      command: `pnpm playable:export ${id}`,
      outputPath: `dist/${pageName}/index.html`,
      copyPath: null,
    };
  }

  return {
    engine: eng,
    command: `pnpm playable:export ${id}`,
    outputPath: `dist/${id}/index.html`,
    copyPath: null,
  };
}

export function listExportablePlayables() {
  const ids = new Set();
  for (const p of loadPlayablesRegistry().playables ?? []) {
    ids.add(p.id);
  }
  if (existsSync(PLAYABLES_ROOT)) {
    for (const d of readdirSync(PLAYABLES_ROOT, { withFileTypes: true })) {
      if (!d.isDirectory() || d.name.startsWith("_")) continue;
      const dir = resolve(PLAYABLES_ROOT, d.name);
      if (
        existsSync(resolve(dir, "scenario.json")) ||
        existsSync(resolve(dir, "composition.json"))
      ) {
        ids.add(d.name);
      }
    }
  }
  return [...ids]
    .sort()
    .map((id) => {
      const engine = resolvePlayableEngine(id);
      const target = getExportTarget(id, engine);
      return { id, engine, ...target };
    })
    .filter((p) => p.engine);
}

/**
 * Playables that can be deleted (registry + folders + scaffold pages).
 */
export function listDeletablePlayables() {
  const reg = loadPlayablesRegistry();
  const byId = new Map();

  for (const p of reg.playables ?? []) {
    byId.set(p.id, {
      id: p.id,
      name: p.name || p.id,
      engine: p.engine || resolvePlayableEngine(p.id),
      inRegistry: true,
    });
  }

  for (const p of listExportablePlayables()) {
    if (!byId.has(p.id)) {
      byId.set(p.id, {
        id: p.id,
        name: p.id,
        engine: p.engine,
        inRegistry: false,
      });
    }
  }

  if (existsSync(PAGES_ROOT)) {
    for (const d of readdirSync(PAGES_ROOT, { withFileTypes: true })) {
      if (!d.isDirectory() || d.name.startsWith("_")) continue;
      if (existsSync(resolve(PAGES_ROOT, d.name, "index.html"))) {
        const eng = resolvePlayableEngine(d.name);
        if (eng === "scaffold" && !byId.has(d.name)) {
          byId.set(d.name, {
            id: d.name,
            name: d.name,
            engine: "scaffold",
            inRegistry: false,
          });
        }
      }
    }
  }

  return [...byId.values()]
    .filter((p) => p.engine)
    .sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Paths to remove when deleting a playable (for --dry-run and delete).
 * @param {string} id
 */
export function planPlayableDelete(id) {
  const engine = resolvePlayableEngine(id);
  if (!engine) return null;

  const reg = loadPlayablesRegistry();
  const regEntry = (reg.playables ?? []).find((p) => p.id === id);
  const paths = [];

  const playableDir = resolve(PLAYABLES_ROOT, id);
  if (existsSync(playableDir)) {
    paths.push({ type: "directory", rel: `playables/${id}` });
  }

  const target = getExportTarget(id, engine);
  if (target?.outputPath) {
    const out = resolve(ROOT, target.outputPath);
    if (existsSync(out)) paths.push({ type: "file", rel: target.outputPath });
  }
  if (target?.copyPath) {
    const copy = resolve(ROOT, target.copyPath);
    if (existsSync(copy)) paths.push({ type: "file", rel: target.copyPath });
  }

  if (engine === "scaffold") {
    const pageDir = resolve(PAGES_ROOT, id);
    if (existsSync(pageDir)) paths.push({ type: "directory", rel: `src/pages/${id}` });
    const distDir = resolve(ROOT, "dist", id);
    if (existsSync(distDir)) paths.push({ type: "directory", rel: `dist/${id}` });
  }

  return {
    id,
    name: regEntry?.name || id,
    engine,
    inRegistry: Boolean(regEntry),
    paths,
  };
}
