/**
 * Resolve playable by id or display name; clone playables across engines.
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";
import { ROOT, PLAYABLES_ROOT, PAGES_ROOT } from "./paths.mjs";
import { loadJson } from "./compose.mjs";
import {
  listDeletablePlayables,
  registerPlayableInRegistry,
  resolvePlayableEngine,
  loadPlayablesRegistry,
} from "./playable-resolve.mjs";

const SKIP_DIR_NAMES = new Set(["exports", "versions", "generated", "node_modules"]);

/** @param {string} ref */
export function normalizePlayableRef(ref) {
  return String(ref)
    .trim()
    .replace(/^["']|["']$/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");
}

/** @param {string} ref */
export function normalizePlayableName(ref) {
  return String(ref)
    .trim()
    .replace(/^["']|["']$/g, "")
    .toLowerCase();
}

/**
 * @param {string} ref — id, kebab-case, or display name
 * @returns {{ status: 'ok', playable: object } | { status: 'ambiguous', candidates: object[] } | { status: 'not_found', candidates: object[] }}
 */
export function resolvePlayableRef(ref) {
  const all = listDeletablePlayables();
  if (!all.length) {
    return { status: "not_found", candidates: [] };
  }

  const raw = String(ref).trim().replace(/^["']|["']$/g, "");
  const normalizedId = normalizePlayableRef(raw);
  const normalizedName = normalizePlayableName(raw);

  const exactId = all.filter((p) => p.id === normalizedId);
  if (exactId.length === 1) return { status: "ok", playable: exactId[0] };

  const exactName = all.filter(
    (p) =>
      normalizePlayableName(p.name || "") === normalizedName ||
      normalizePlayableRef(p.name || "") === normalizedId,
  );
  if (exactName.length === 1) return { status: "ok", playable: exactName[0] };

  const fuzzy = all.filter((p) => {
    const name = (p.name || "").toLowerCase();
    const id = p.id.toLowerCase();
    return (
      id.includes(normalizedId) ||
      normalizedId.includes(id) ||
      name.includes(normalizedName) ||
      normalizedName.includes(name)
    );
  });

  const unique = [...new Map(fuzzy.map((p) => [p.id, p])).values()];
  if (unique.length === 1) return { status: "ok", playable: unique[0] };
  if (unique.length > 1) return { status: "ambiguous", candidates: unique };

  return { status: "not_found", candidates: all };
}

function shouldCopyPath(absPath, srcRoot) {
  const rel = absPath.slice(srcRoot.length + 1);
  if (!rel) return true;
  const parts = rel.split(/[/\\]/);
  if (parts.some((p) => SKIP_DIR_NAMES.has(p))) return false;
  const base = parts[parts.length - 1];
  if (base === ".DS_Store") return false;
  if (base.endsWith(".html")) return false;
  return true;
}

function copyTreeFiltered(src, dest) {
  cpSync(src, dest, {
    recursive: true,
    filter: (srcPath) => shouldCopyPath(srcPath, src),
  });
}

function writeJson(path, data) {
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
}

function defaultDisplayName(newId, sourceName) {
  if (sourceName && sourceName !== newId) {
    return `${sourceName} (copy)`;
  }
  return newId.replace(/-/g, " ");
}

function patchStudioClone(dest, newId, newName, sourceId) {
  const manifestPath = resolve(dest, "manifest.json");
  if (existsSync(manifestPath)) {
    const manifest = loadJson(manifestPath);
    manifest.id = newId;
    manifest.name = newName;
    writeJson(manifestPath, manifest);
  }

  const playablePath = resolve(dest, "playable.json");
  if (existsSync(playablePath)) {
    const playable = loadJson(playablePath);
    playable.id = newId;
    playable.name = newName;
    writeJson(playablePath, playable);
  }

  const briefPath = resolve(dest, "brief.md");
  if (existsSync(briefPath)) {
    const prev = readFileSync(briefPath, "utf8");
    const header = `# ${newId}\n\nCloned from \`${sourceId}\`.\n\n`;
    const body = prev.replace(/^#[^\n]*\n+/, "");
    writeFileSync(briefPath, header + body);
  } else {
    writeFileSync(briefPath, `# ${newId}\n\nCloned from \`${sourceId}\`.\n`);
  }

  const notesPrompt = resolve(dest, "notes/prompt.md");
  if (existsSync(resolve(dest, "notes"))) {
    writeFileSync(
      notesPrompt,
      `Cloned from \`${sourceId}\` → \`${newId}\` via pnpm playable:clone\n`,
    );
  }
}

function patchComposeClone(dest, newId, newName, sourceId) {
  const configPath = resolve(dest, "playable.config.json");
  if (existsSync(configPath)) {
    const cfg = loadJson(configPath);
    cfg.id = newId;
    cfg.pageName = newId;
    writeJson(configPath, cfg);
  }

  const compositionPath = resolve(dest, "composition.json");
  if (existsSync(compositionPath)) {
    const composition = loadJson(compositionPath);
    composition.id = newId;
    writeJson(compositionPath, composition);
  }

  const briefPath = resolve(dest, "brief.md");
  writeFileSync(briefPath, `# ${newId}\n\nCloned from \`${sourceId}\`.\n`);

  const notesPrompt = resolve(dest, "notes/prompt.md");
  if (existsSync(resolve(dest, "notes"))) {
    writeFileSync(
      notesPrompt,
      `Cloned from \`${sourceId}\` → \`${newId}\` via pnpm playable:clone\n`,
    );
  }
}

function cloneScaffold(newId, sourceId, newName) {
  const src = resolve(PAGES_ROOT, sourceId);
  const dest = resolve(PAGES_ROOT, newId);
  if (!existsSync(src)) {
    throw new Error(`Missing scaffold source: src/pages/${sourceId}`);
  }
  if (existsSync(dest)) {
    throw new Error(`Exists: src/pages/${newId}`);
  }
  copyTreeFiltered(src, dest);
  return { engine: "scaffold", paths: [`src/pages/${newId}`] };
}

function clonePlayableFolder(newId, sourceId, engine, newName, patchFn) {
  const src = resolve(PLAYABLES_ROOT, sourceId);
  const dest = resolve(PLAYABLES_ROOT, newId);
  if (!existsSync(src)) {
    throw new Error(`Missing source: playables/${sourceId}`);
  }
  if (existsSync(dest)) {
    throw new Error(`Exists: playables/${newId}`);
  }
  copyTreeFiltered(src, dest);
  patchFn(dest, newId, newName, sourceId);
  return { engine, paths: [`playables/${newId}`] };
}

/**
 * @param {{ newId: string, sourceId: string, newName?: string }} opts
 */
export function clonePlayable({ newId, sourceId, newName }) {
  const engine = resolvePlayableEngine(sourceId);
  if (!engine) {
    throw new Error(`Unknown source playable "${sourceId}"`);
  }

  const reg = loadPlayablesRegistry();
  const sourceEntry = (reg.playables ?? []).find((p) => p.id === sourceId);
  const displayName = newName || defaultDisplayName(newId, sourceEntry?.name);

  if (existsSync(resolve(PLAYABLES_ROOT, newId))) {
    throw new Error(`Playable id already exists: playables/${newId}`);
  }
  if (existsSync(resolve(PAGES_ROOT, newId))) {
    throw new Error(`Page id already exists: src/pages/${newId}`);
  }

  let result;
  if (engine === "studio") {
    result = clonePlayableFolder(newId, sourceId, engine, displayName, patchStudioClone);
  } else if (engine === "compose") {
    result = clonePlayableFolder(newId, sourceId, engine, displayName, patchComposeClone);
  } else if (engine === "scaffold") {
    result = cloneScaffold(newId, sourceId, displayName);
  } else {
    throw new Error(`Unsupported engine: ${engine}`);
  }

  registerPlayableInRegistry({
    id: newId,
    name: displayName,
    engine,
    status: "draft",
  });

  return {
    newId,
    sourceId,
    engine,
    name: displayName,
    previewPath: engine === "studio" ? `/preview/${newId}` : `/preview/${newId}`,
    paths: result.paths,
  };
}

export function listClonablePlayables() {
  return listDeletablePlayables();
}
