#!/usr/bin/env node
/**
 * Seed free Lucide icons + Lottie JSON into studio asset catalog (dev library only).
 * Usage: pnpm studio:asset:seed
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  ASSETS_ROOT,
  CATALOG_PATH,
  loadCatalog,
  saveCatalog,
} from "./lib/studio-asset-lib.mjs";

const LUCIDE = "https://unpkg.com/lucide-static@0.469.0/icons";

const ICONS = [
  ["icon-sparkles", "sparkles", "Sparkles"],
  ["icon-hand", "hand", "Hand"],
  ["icon-mouse-pointer-click", "mouse-pointer-click", "Tap pointer"],
  ["icon-chevron-right", "chevron-right", "Chevron right"],
  ["icon-star", "star", "Star"],
  ["icon-zap", "zap", "Zap"],
  ["icon-heart", "heart", "Heart"],
  ["icon-circle-check", "circle-check", "Check circle"],
];

/** Public LottieFiles sample animations (free tier CDN). */
const LOTTIES = [
  ["lottie-loading-dots", "https://assets2.lottiefiles.com/packages/lf20_usmfx6bp.json", "Loading dots"],
  ["lottie-success", "https://assets9.lottiefiles.com/packages/lf20_jbrw3hcz.json", "Success check"],
  ["lottie-confetti", "https://assets1.lottiefiles.com/packages/lf20_u4yrau.json", "Confetti burst"],
];

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.text();
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

function upsertCatalog(entry) {
  const catalog = loadCatalog();
  const idx = catalog.assets.findIndex((a) => a.id === entry.id);
  if (idx >= 0) catalog.assets[idx] = entry;
  else catalog.assets.push(entry);
  saveCatalog(catalog);
}

async function seedIcons() {
  mkdirSync(resolve(ASSETS_ROOT, "icons"), { recursive: true });
  for (const [id, slug, label] of ICONS) {
    const url = `${LUCIDE}/${slug}.svg`;
    const svg = await fetchText(url);
    const path = `icons/${id}.svg`;
    writeFileSync(resolve(ASSETS_ROOT, path), svg);
    upsertCatalog({ id, type: "icon", path, label });
    console.log(`  icon: ${id}`);
  }
}

async function seedLotties() {
  mkdirSync(resolve(ASSETS_ROOT, "lottie"), { recursive: true });
  for (const [id, url, label] of LOTTIES) {
    const json = await fetchJson(url);
    const path = `lottie/${id}.json`;
    writeFileSync(resolve(ASSETS_ROOT, path), `${JSON.stringify(json, null, 2)}\n`);
    upsertCatalog({ id, type: "lottie", path, label });
    console.log(`  lottie: ${id}`);
  }
}

async function main() {
  if (!existsSync(CATALOG_PATH)) {
    saveCatalog({ version: 1, assets: [] });
  }
  console.log("Seeding Lucide icons (shadcn uses Lucide)…");
  await seedIcons();
  console.log("Seeding free Lottie samples…");
  await seedLotties();
  console.log("✅ Done — refresh Studio preview Assets panel.");
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
