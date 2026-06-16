/**
 * Shared studio asset catalog CRUD + clone-for-playable (inline copy).
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  unlinkSync,
} from "node:fs";
import { resolve, extname } from "node:path";
import { ROOT } from "./paths.mjs";
import { hydrateAssetsBundleSync } from "./hydrate-studio-assets.mjs";

export const ASSETS_ROOT = resolve(ROOT, "data/studio/assets");
export const CATALOG_PATH = resolve(ASSETS_ROOT, "catalog.json");
export const LUCIDE_INDEX_PATH = resolve(ASSETS_ROOT, "icons/lucide-index.json");

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"]);
const ID_RE = /^[a-z0-9][a-z0-9_-]*$/;

export function loadLucideIndex() {
  if (!existsSync(LUCIDE_INDEX_PATH)) return [];
  try {
    const data = JSON.parse(readFileSync(LUCIDE_INDEX_PATH, "utf8"));
    return data.icons ?? [];
  } catch {
    return [];
  }
}

function lucideAsCatalogEntries() {
  return loadLucideIndex().map((icon) => ({
    id: icon.id,
    type: "icon",
    path: icon.path,
    label: icon.label,
    lucide: true,
  }));
}

export function loadCatalog() {
  if (!existsSync(CATALOG_PATH)) {
    return { version: 1, assets: [] };
  }
  return JSON.parse(readFileSync(CATALOG_PATH, "utf8"));
}

export function saveCatalog(catalog) {
  mkdirSync(ASSETS_ROOT, { recursive: true });
  writeFileSync(CATALOG_PATH, `${JSON.stringify(catalog, null, 2)}\n`);
}

export function findCatalogAsset(id) {
  const lucide = loadLucideIndex().find((i) => i.id === id);
  if (lucide) {
    return { id: lucide.id, type: "icon", path: lucide.path, label: lucide.label, lucide: true };
  }
  const catalog = loadCatalog();
  return catalog.assets.find((a) => a.id === id) ?? null;
}

export function listCatalogAssets(type) {
  const catalog = loadCatalog();
  const custom = type ? catalog.assets.filter((a) => a.type === type) : catalog.assets;
  if (type === "icon" || !type) {
    const lucide = lucideAsCatalogEntries();
    if (type === "icon") return [...custom.filter((a) => a.type === "icon"), ...lucide];
    if (!type) return [...custom, ...lucide];
  }
  return custom;
}

function assertId(id) {
  const s = String(id || "").trim();
  if (!ID_RE.test(s)) {
    throw new Error(`Asset id must match ${ID_RE}: got "${s}"`);
  }
  return s;
}

function extForImage(filename) {
  const ext = extname(filename || "").toLowerCase();
  if (IMAGE_EXT.has(ext)) return ext;
  return ".png";
}

/**
 * Clone catalog asset with inlined data (no shared path) — playable survives catalog delete.
 */
export function cloneAssetEntry(catalogAsset) {
  const [hydrated] = hydrateAssetsBundleSync({ assets: [catalogAsset] }).assets;
  const entry = {
    id: hydrated.id,
    type: hydrated.type,
    label: hydrated.label || hydrated.id,
  };
  if (hydrated.dataUrl) entry.dataUrl = hydrated.dataUrl;
  if (hydrated.lottie) entry.lottie = hydrated.lottie;
  return entry;
}

/**
 * @param {{ id: string, type: "image"|"lottie"|"icon", filename?: string, dataBase64?: string, json?: object, label?: string }} opts
 */
export function saveCatalogAsset(opts) {
  const id = assertId(opts.id);
  const type =
    opts.type === "lottie" ? "lottie" : opts.type === "icon" ? "icon" : "image";
  const catalog = loadCatalog();
  if (catalog.assets.some((a) => a.id === id)) {
    throw new Error(`Asset id already exists: ${id}`);
  }

  mkdirSync(resolve(ASSETS_ROOT, "images"), { recursive: true });
  mkdirSync(resolve(ASSETS_ROOT, "lottie"), { recursive: true });
  mkdirSync(resolve(ASSETS_ROOT, "icons"), { recursive: true });

  let relPath;
  if (type === "lottie") {
    const json = opts.json ?? JSON.parse(Buffer.from(opts.dataBase64, "base64").toString("utf8"));
    relPath = `lottie/${id}.json`;
    writeFileSync(resolve(ASSETS_ROOT, relPath), `${JSON.stringify(json, null, 2)}\n`);
  } else if (type === "icon") {
    relPath = `icons/${id}.svg`;
    const buf = Buffer.from(opts.dataBase64, "base64");
    writeFileSync(resolve(ASSETS_ROOT, relPath), buf);
  } else {
    const ext = extForImage(opts.filename);
    relPath = `images/${id}${ext}`;
    const buf = Buffer.from(opts.dataBase64, "base64");
    writeFileSync(resolve(ASSETS_ROOT, relPath), buf);
  }

  const entry = {
    id,
    type,
    path: relPath,
    label: opts.label?.trim() || id.replace(/-/g, " "),
  };
  catalog.assets.push(entry);
  saveCatalog(catalog);
  return entry;
}

export function saveCatalogAssetFromFile(id, type, filePath, label) {
  const abs = resolve(filePath);
  if (!existsSync(abs)) throw new Error(`File not found: ${filePath}`);
  const buf = readFileSync(abs);
  const ext = extname(abs).toLowerCase();
  if (type === "lottie") {
    return saveCatalogAsset({
      id,
      type: "lottie",
      json: JSON.parse(buf.toString("utf8")),
      label,
    });
  }
  if (type === "icon") {
    return saveCatalogAsset({
      id,
      type: "icon",
      dataBase64: buf.toString("base64"),
      label,
    });
  }
  return saveCatalogAsset({
    id,
    type: "image",
    filename: `file${ext || ".png"}`,
    dataBase64: buf.toString("base64"),
    label,
  });
}

export function deleteCatalogAsset(id) {
  const assetId = assertId(id);
  const lucide = loadLucideIndex().find((i) => i.id === assetId);
  if (lucide) {
    throw new Error("Lucide library icons cannot be deleted — remove custom icons only");
  }
  const catalog = loadCatalog();
  const idx = catalog.assets.findIndex((a) => a.id === assetId);
  if (idx < 0) throw new Error(`Unknown asset: ${assetId}`);
  const [removed] = catalog.assets.splice(idx, 1);
  saveCatalog(catalog);
  const file = resolve(ASSETS_ROOT, removed.path);
  if (existsSync(file) && file.startsWith(ASSETS_ROOT)) {
    unlinkSync(file);
  }
  return removed;
}

/**
 * Embed cloned asset into playable or template manifest (inline copy).
 */
export function embedAssetInBundle(bundlePath, assetId) {
  const catalogAsset = findCatalogAsset(assetId);
  if (!catalogAsset) throw new Error(`Unknown catalog asset: ${assetId}`);
  if (!existsSync(bundlePath)) throw new Error(`Bundle not found: ${bundlePath}`);
  const bundle = JSON.parse(readFileSync(bundlePath, "utf8"));
  const cloned = cloneAssetEntry(catalogAsset);
  const list = bundle.assets ?? [];
  const idx = list.findIndex((a) => a.id === assetId);
  if (idx >= 0) list[idx] = cloned;
  else list.push(cloned);
  bundle.assets = list;
  writeFileSync(bundlePath, `${JSON.stringify(bundle, null, 2)}\n`);
  return cloned;
}
