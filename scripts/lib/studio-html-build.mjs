import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { hydrateAssetsBundleSync } from "./hydrate-studio-assets.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");
const require = createRequire(import.meta.url);

/**
 * Bundle studio JSON → single self-contained HTML string.
 * @param {object} bundle - { playable, context, scenario, assets? }
 * @param {{ id?: string }} [opts]
 */
export async function buildStudioHtml(bundle, opts = {}) {
  const id = opts.id || bundle.playable?.id || "playable";
  const hydrated = {
    ...bundle,
    assets: hydrateAssetsBundleSync(bundle.assets || { assets: [] }),
  };
  const configJson = JSON.stringify(hydrated, null, 0);

  const cssBundle = readStudioStylesBundle();
  const shellCss = buildExportShellCss();

  const esbuild = require("esbuild");
  const entry = resolve(ROOT, "src/runtime/studio/export-entry.js");
  const aliases = {
    "@playable/core": resolve(ROOT, "src/core"),
    "@playable/af": resolve(ROOT, "src/core"),
    "@playable/skills": resolve(ROOT, "src/skills"),
  };
  function resolveAlias(importPath) {
    for (const [key, val] of Object.entries(aliases)) {
      if (importPath === key || importPath.startsWith(key + "/")) {
        return resolve(val, importPath.slice(key.length + 1));
      }
    }
    return importPath;
  }
  const rawPlugin = {
    name: "raw-import",
    setup(build) {
      build.onResolve({ filter: /\?raw$/ }, (args) => {
        const bare = args.path.replace(/\?raw$/, "");
        const resolved = resolveAlias(bare);
        return { path: resolved, namespace: "raw" };
      });
      build.onLoad({ filter: /.*/, namespace: "raw" }, (args) => ({
        contents: readFileSync(args.path, "utf8"),
        loader: "text",
      }));
    },
  };
  const result = await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    write: false,
    format: "iife",
    platform: "browser",
    target: ["es2020"],
    minify: true,
    plugins: [rawPlugin],
    alias: aliases,
  });
  const jsBundle = result.outputFiles[0].text;
  const title = hydrated.playable?.name || id;

  return `<!DOCTYPE html>
<html lang="en" data-playable-mode="export">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"/>
<title>${escapeHtml(title)}</title>
<style>${shellCss}${cssBundle}</style>
</head>
<body>
<div id="playable-shell"><div id="playable-viewport"><div id="playable-root"></div></div></div>
<script id="playable-config" type="application/json">${escapeHtml(configJson)}</script>
<script>${jsBundle}</script>
</body>
</html>`;
}

export function validateStudioHtml(html) {
  const errors = [];
  if (/\bsrc=["']https?:/i.test(html)) errors.push("external src");
  if (/\beval\s*\(/.test(html)) errors.push("eval");
  return errors;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Inline studio CSS once (strip @import when bundled into <style>; append content-boundary). */
function readStudioStylesBundle() {
  const runtime = readFileSync(resolve(ROOT, "src/runtime/styles/runtime.css"), "utf8");
  let studio = readFileSync(resolve(ROOT, "src/runtime/studio/styles/studio.css"), "utf8");
  const boundary = readFileSync(
    resolve(ROOT, "src/runtime/studio/styles/content-boundary.css"),
    "utf8",
  );
  studio = studio.replace(/@import\s+["'][^"']+["']\s*;?\s*/g, "");
  return `${runtime}\n${studio}\n${boundary}`;
}

/** Full-bleed shell + export-layout.css (responsive mobile frame on wide viewports). */
function buildExportShellCss() {
  const exportLayout = readFileSync(
    resolve(ROOT, "src/runtime/studio/styles/export-layout.css"),
    "utf8",
  );
  return `
html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#0f172a;font-family:system-ui,sans-serif}
#playable-shell{position:fixed;inset:0;display:flex;overflow:hidden}
#playable-viewport{display:flex;flex-direction:column;overflow:hidden}
#playable-root{flex:1;min-height:0;width:100%;display:flex;flex-direction:column}
${exportLayout}
`;
}
