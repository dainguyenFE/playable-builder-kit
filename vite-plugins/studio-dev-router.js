/**
 * Dev: Studio UI, preview, download export, template/playable data
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { getExportTarget, resolvePlayableEngine, listExportablePlayables, loadPlayablesRegistry } from "../scripts/lib/playable-resolve.mjs";
import {
  deleteCatalogAsset,
  loadCatalog,
  listCatalogAssets,
  saveCatalogAsset,
} from "../scripts/lib/studio-asset-lib.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const STUDIO = resolve(ROOT, "studio");
const PLAYABLES = resolve(ROOT, "playables");
const DATA = resolve(ROOT, "data");
const TEMPLATES_STUDIO = resolve(DATA, "templates");
const TEMPLATES_COMPOSE = resolve(ROOT, "playable-templates");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
};

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

function sendFile(res, filePath, opts = {}) {
  const ext = filePath.slice(filePath.lastIndexOf("."));
  res.setHeader("Content-Type", MIME[ext] || "application/octet-stream");
  if (opts.downloadAs) {
    res.setHeader("Content-Disposition", `attachment; filename="${opts.downloadAs}"`);
  }
  res.end(readFileSync(filePath));
}

function handleTemplateDownload(res, templateId) {
  const filePath = resolve(TEMPLATES_STUDIO, templateId, "exports", `${templateId}.html`);
  if (!existsSync(filePath)) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end(
      `Template HTML not built yet.\nRun: pnpm template:export ${templateId}\n`,
    );
    return;
  }
  console.log(`\n📥 Serving template export: ${templateId} (no rebuild)\n`);
  sendFile(res, filePath, { downloadAs: `${templateId}.html` });
}

function sendExportHtml(res, filePath, opts = {}) {
  if (!existsSync(filePath)) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end(`Export not found: ${filePath}`);
    return false;
  }
  const bytes = readFileSync(filePath).byteLength;
  if (bytes < 10_000) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end(`Export looks invalid (${bytes} bytes). Re-run: pnpm playable:export`);
    return false;
  }
  if (!opts.quiet) {
    console.log(`\n📄 Export HTML: ${filePath} (${(bytes / 1024).toFixed(1)} KB)\n`);
  }
  sendFile(res, filePath, opts.downloadAs ? { downloadAs: opts.downloadAs } : {});
  return true;
}

function ensureExport(playableId) {
  const engine = resolvePlayableEngine(playableId);
  if (!engine) return null;
  const target = getExportTarget(playableId, engine);
  const filePath = resolve(ROOT, target.outputPath);
  if (existsSync(filePath) && readFileSync(filePath).byteLength >= 10_000) {
    return { engine, target, filePath };
  }
  console.log(`\n📤 Building export: ${playableId} (${engine})…`);
  const r = spawnSync("node", ["scripts/playable-export.mjs", playableId], {
    cwd: ROOT,
    stdio: "inherit",
  });
  if ((r.status ?? 1) !== 0) return null;
  if (!existsSync(filePath) || readFileSync(filePath).byteLength < 10_000) return null;
  return { engine, target, filePath };
}

function handleDownload(res, playableId) {
  const built = ensureExport(playableId);
  if (!built) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Export failed — check terminal");
    return;
  }
  sendExportHtml(res, built.filePath, { downloadAs: `${playableId}.html` });
}

function handleOpenExport(res, playableId) {
  const built = ensureExport(playableId);
  if (!built) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Export failed — check terminal");
    return;
  }
  sendExportHtml(res, built.filePath);
}

export function studioDevRouter() {
  return {
    name: "studio-dev-router",
    apply: "serve",
    configureServer(server) {
      console.log(
        "\n🎬 Studio — http://localhost:5173/\n" +
          "   Playable: /preview/ai-writing-tool\n" +
          "   Template: /preview/template/ai-writing-generator\n" +
          "   Scaffold pages: /pages\n",
      );
      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? "").split("?")[0];

        if (url === "/" || url === "/index.html") {
          sendFile(res, resolve(STUDIO, "index.html"));
          return;
        }

        if (url === "/studio" || url === "/studio/") {
          res.writeHead(302, { Location: "/" });
          res.end();
          return;
        }

        if (url === "/studio/api/assets") {
          if (req.method === "GET") {
            sendJson(res, 200, { version: 1, assets: listCatalogAssets() });
            return;
          }
          if (req.method === "POST") {
            readJsonBody(req)
              .then((body) => {
                const entry = saveCatalogAsset(body);
                sendJson(res, 201, { ok: true, asset: entry });
              })
              .catch((e) => sendJson(res, 400, { error: e.message }));
            return;
          }
        }

        const deleteAsset = url.match(/^\/studio\/api\/assets\/([a-z0-9][a-z0-9_-]*)$/);
        if (deleteAsset && req.method === "DELETE") {
          try {
            const removed = deleteCatalogAsset(deleteAsset[1]);
            sendJson(res, 200, { ok: true, asset: removed });
          } catch (e) {
            sendJson(res, 400, { error: e.message });
          }
          return;
        }

        if (url === "/studio/api/playables.json") {
          const reg = loadPlayablesRegistry();
          const playables = listExportablePlayables().map((p) => {
            const regEntry = (reg.playables ?? []).find((r) => r.id === p.id);
            return {
              id: p.id,
              name: regEntry?.name || p.id,
              engine: p.engine,
            };
          });
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify({ playables }));
          return;
        }

        const downloadTemplate = url.match(
          /^\/(?:studio\/)?download\/template\/([a-z0-9-]+)\/?$/,
        );
        if (downloadTemplate) {
          handleTemplateDownload(res, downloadTemplate[1]);
          return;
        }

        const download = url.match(/^\/(?:studio\/)?download\/([a-z0-9-]+)\/?$/);
        if (download) {
          handleDownload(res, download[1]);
          return;
        }

        const openExport = url.match(/^\/(?:studio\/)?open-export\/([a-z0-9-]+)\/?$/);
        if (openExport) {
          handleOpenExport(res, openExport[1]);
          return;
        }

        const studioAsset = url.match(/^\/studio\/(.+)$/);
        if (studioAsset) {
          const file = resolve(STUDIO, studioAsset[1]);
          if (existsSync(file) && !studioAsset[1].includes("..")) {
            sendFile(res, file);
            return;
          }
        }

        const edit = url.match(/^\/(?:studio\/)?playables\/([a-z0-9-]+)\/?$/);
        if (edit) {
          sendFile(res, resolve(STUDIO, "playable-edit.html"));
          return;
        }

        const tplEdit = url.match(/^\/(?:studio\/)?templates\/([a-z0-9-]+)\/?$/);
        if (tplEdit) {
          sendFile(res, resolve(STUDIO, "template-edit.html"));
          return;
        }

        const previewTemplate = url.match(/^\/preview\/template\/([a-z0-9-]+)\/?$/);
        if (previewTemplate) {
          sendFile(res, resolve(STUDIO, "preview.html"));
          return;
        }

        const preview = url.match(/^\/preview\/([a-z0-9-]+)\/?$/);
        if (preview) {
          sendFile(res, resolve(STUDIO, "preview.html"));
          return;
        }

        const studioTpl = url.match(/^\/template-data\/studio\/([a-z0-9-]+)\/([a-z0-9_.-]+)$/);
        if (studioTpl) {
          const file = resolve(TEMPLATES_STUDIO, studioTpl[1], studioTpl[2]);
          if (existsSync(file)) {
            sendFile(res, file);
            return;
          }
        }

        const composeTpl = url.match(/^\/template-data\/compose\/([a-z0-9-]+)\/(.+)$/);
        if (composeTpl) {
          const file = resolve(TEMPLATES_COMPOSE, composeTpl[1], composeTpl[2]);
          if (existsSync(file) && file.startsWith(TEMPLATES_COMPOSE)) {
            sendFile(res, file);
            return;
          }
        }

        const pdata = url.match(/^\/playables-data\/([a-z0-9-]+)\/([a-z0-9_.-]+)$/);
        if (pdata) {
          const file = resolve(PLAYABLES, pdata[1], pdata[2]);
          if (existsSync(file)) {
            sendFile(res, file);
            return;
          }
        }

        const ddata = url.match(/^\/data\/(.+)$/);
        if (ddata) {
          const file = resolve(DATA, ddata[1]);
          if (existsSync(file) && file.startsWith(DATA)) {
            sendFile(res, file);
            return;
          }
        }

        const studioAssets = url.match(/^\/studio-assets\/(.+)$/);
        if (studioAssets) {
          const file = resolve(ROOT, "data/studio/assets", studioAssets[1]);
          const assetsRoot = resolve(ROOT, "data/studio/assets");
          if (existsSync(file) && file.startsWith(assetsRoot) && !studioAssets[1].includes("..")) {
            sendFile(res, file);
            return;
          }
        }

        next();
      });
    },
  };
}
