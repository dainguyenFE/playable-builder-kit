#!/usr/bin/env node
/**
 * Download real photos + free Lottie JSON (AI-themed) for studio catalog.
 * Usage: pnpm studio:asset:fetch:media
 */
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  ASSETS_ROOT,
  CATALOG_PATH,
  loadCatalog,
  saveCatalog,
} from "./lib/studio-asset-lib.mjs";

/** Mobile-friendly photos (picsum seeds — reliable CDN). */
const PHOTOS = [
  ["img-chat-hero", "images/chat-hero.jpg", "https://picsum.photos/seed/nova-chat/480/320", "AI chat hero"],
  ["img-chat-answer", "images/chat-answer.jpg", "https://picsum.photos/seed/analytics/480/280", "Analytics dashboard"],
  ["img-writing-doc", "images/writing-doc.jpg", "https://picsum.photos/seed/writing/480/320", "Writing workspace"],
  ["img-t2i-cyberpunk", "images/t2i-cyberpunk.jpg", "https://picsum.photos/seed/cyberpunk/480/360", "Neon city art"],
  ["img-plan-board", "images/plan-board.jpg", "https://picsum.photos/seed/planboard/480/320", "Planning board"],
  ["img-audio-cover", "images/audio-cover.jpg", "https://picsum.photos/seed/podcast/480/480", "Podcast mic"],
  ["img-i2i-before", "images/i2i-before.jpg", "https://picsum.photos/seed/portrait-before/360/440", "Portrait before"],
  ["img-i2i-after", "images/i2i-after.jpg", "https://picsum.photos/seed/portrait-after/360/440", "Portrait styled"],
  ["img-text-hero", "images/text-campaign-hero.jpg", "https://picsum.photos/seed/productivity/480/300", "Productivity desk"],
];

/** Free LottieFiles CDN — AI / UI themed. */
const LOTTIES = [
  ["lottie-ai-loading", "https://assets2.lottiefiles.com/packages/lf20_usmfx6bp.json", "AI loading"],
  ["lottie-ai-success", "https://assets9.lottiefiles.com/packages/lf20_jbrw3hcz.json", "Success check"],
  ["lottie-ai-confetti", "https://assets1.lottiefiles.com/packages/lf20_u4yrau.json", "Confetti"],
  ["lottie-ai-robot", "https://assets3.lottiefiles.com/packages/lf20_swnrn2oy.json", "AI robot"],
  ["lottie-ai-brain", "https://assets3.lottiefiles.com/packages/lf20_swnrn2oy.json", "AI brain"],
  ["lottie-ai-chat", "https://assets4.lottiefiles.com/packages/lf20_1pxqjqps.json", "Chat bubbles"],
  ["lottie-ai-scan", "https://assets10.lottiefiles.com/packages/lf20_qp1q7mct.json", "AI scan"],
  ["lottie-ai-stars", "https://assets5.lottiefiles.com/packages/lf20_rovf9gzu.json", "Magic stars"],
];

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  const data = await res.json();
  if (!data?.v) throw new Error(`Not valid Lottie JSON: ${url}`);
  return data;
}

function upsertCatalog(entry) {
  const catalog = loadCatalog();
  const idx = catalog.assets.findIndex((a) => a.id === entry.id);
  if (idx >= 0) catalog.assets[idx] = entry;
  else catalog.assets.push(entry);
  saveCatalog(catalog);
}

async function main() {
  if (!existsSync(CATALOG_PATH)) {
    saveCatalog({ version: 1, assets: [] });
  }
  mkdirSync(resolve(ASSETS_ROOT, "images"), { recursive: true });
  mkdirSync(resolve(ASSETS_ROOT, "lottie"), { recursive: true });

  console.log("Downloading real photos…");
  for (const [id, relPath, url, label] of PHOTOS) {
    const buf = await fetchBuffer(url);
    writeFileSync(resolve(ASSETS_ROOT, relPath), buf);
    upsertCatalog({ id, type: "image", path: relPath, label });
    console.log(`  photo: ${id}`);
  }

  console.log("Downloading Lottie (AI theme)…");
  for (const [id, url, label] of LOTTIES) {
    try {
      const json = await fetchJson(url);
      const relPath = `lottie/${id}.json`;
      writeFileSync(resolve(ASSETS_ROOT, relPath), `${JSON.stringify(json, null, 2)}\n`);
      upsertCatalog({ id, type: "lottie", path: relPath, label });
      console.log(`  lottie: ${id}`);
    } catch (e) {
      console.warn(`  skip ${id}: ${e.message}`);
    }
  }


  console.log("✅ Done — refresh Assets panel.");
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
