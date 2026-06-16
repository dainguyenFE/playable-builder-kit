#!/usr/bin/env node
/**
 * Install full Lucide SVG set (shadcn icons) into studio assets.
 * Usage: pnpm studio:asset:seed:lucide
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  writeFileSync,
  copyFileSync,
  rmSync,
} from "node:fs";
import { resolve, dirname } from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { ASSETS_ROOT, LUCIDE_INDEX_PATH } from "./lib/studio-asset-lib.mjs";

const require = createRequire(import.meta.url);

function resolveLucideIconsDir() {
  try {
    const pkg = require.resolve("lucide-static/package.json");
    return resolve(dirname(pkg), "icons");
  } catch {
    return null;
  }
}

function downloadViaNpmPack() {
  const tmp = resolve(tmpdir(), `lucide-seed-${Date.now()}`);
  mkdirSync(tmp, { recursive: true });
  execSync("npm pack lucide-static@0.469.0 --silent", { cwd: tmp, stdio: "pipe" });
  const tgz = readdirSync(tmp).find((f) => f.endsWith(".tgz"));
  if (!tgz) throw new Error("npm pack failed");
  execSync(`tar -xzf ${tgz}`, { cwd: tmp });
  const iconsDir = resolve(tmp, "package", "icons");
  if (!existsSync(iconsDir)) throw new Error("icons dir missing in package");
  return { iconsDir, tmp };
}

function main() {
  let srcDir = resolveLucideIconsDir();
  let tmpToClean = null;

  if (!srcDir || !existsSync(srcDir)) {
    console.log("Downloading lucide-static via npm pack…");
    const dl = downloadViaNpmPack();
    srcDir = dl.iconsDir;
    tmpToClean = dl.tmp;
  }

  const destDir = resolve(ASSETS_ROOT, "icons/lucide");
  mkdirSync(destDir, { recursive: true });

  const files = readdirSync(srcDir).filter((f) => f.endsWith(".svg"));
  const icons = [];

  for (const file of files) {
    const slug = file.replace(/\.svg$/, "");
    const id = `lucide-${slug}`;
    const relPath = `icons/lucide/${slug}.svg`;
    copyFileSync(resolve(srcDir, file), resolve(ASSETS_ROOT, relPath));
    icons.push({ id, path: relPath, label: slug.replace(/-/g, " "), slug });
  }

  if (tmpToClean) rmSync(tmpToClean, { recursive: true, force: true });

  icons.sort((a, b) => a.slug.localeCompare(b.slug));

  writeFileSync(
    LUCIDE_INDEX_PATH,
    `${JSON.stringify({ version: 1, count: icons.length, icons }, null, 2)}\n`,
  );

  console.log(`✅ Lucide: ${icons.length} icons`);
  console.log(`   Index: ${LUCIDE_INDEX_PATH}`);
}

main();
