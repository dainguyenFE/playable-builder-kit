import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { optimizePlayableImages } from "./vite-plugins/optimize-playable-images.js";
import { inlineHtmlAssets } from "./vite-plugins/inline-html-assets.js";
import { ensureBase64DataUris } from "./vite-plugins/ensure-base64-data-uris.js";
import { playableAdSanitize } from "./vite-plugins/playable-ad-sanitize.js";
import { playableDevRouter } from "./vite-plugins/playable-dev-router.js";
import { studioDevRouter } from "./vite-plugins/studio-dev-router.js";
import {
  assertRouteExists,
  discoverRoutes,
  resolveRouteEntry,
} from "./scripts/discover-routes.mjs";
import { existsSync } from "node:fs";
import { resolve, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const KIT_CORE = resolve(__dirname, "src/core");
const MONOREPO_JS = resolve(__dirname, "../src/js");
const MONOREPO_CORE = resolve(__dirname, "../src/core");

function resolveAppsFlyerCore() {
  if (existsSync(resolve(MONOREPO_JS, "appfly_script.js"))) return MONOREPO_JS;
  if (existsSync(resolve(MONOREPO_CORE, "appfly_script.js"))) return MONOREPO_CORE;
  return KIT_CORE;
}

const APPSFLYER_CORE = resolveAppsFlyerCore();

const routes = discoverRoutes();
const requestedRoute = (process.env.PLAYABLE_ROUTE || "playable").toLowerCase();
const activeRoute = routes.includes(requestedRoute) ? requestedRoute : routes[0];
const keepDist = process.env.PLAYABLE_KEEP_DIST === "1";

function rollupInputForCommand(command) {
  if (command === "serve") {
    return Object.fromEntries(
      routes.map((name) => [name, resolveRouteEntry(name)]),
    );
  }
  assertRouteExists(requestedRoute);
  return resolveRouteEntry(requestedRoute);
}

function entryPathForDevServer(entryAbs) {
  const rel = relative(__dirname, entryAbs);
  const urlPath = rel.split(sep).join("/");
  return urlPath.startsWith("/") ? urlPath : `/${urlPath}`;
}

function logRoutesPlugin(command) {
  return {
    name: "log-playable-routes",
    configureServer() {
      if (command !== "serve") return;
      const lines = routes.map(
        (name) => `   · http://localhost:5173/${name}  →  /src/pages/${name}/index.html`,
      );
      console.log(
        `\n📍 Dev — scaffold pages (${routes.length}):\n${lines.join("\n")}\n   · http://localhost:5173/pages\n`,
      );
    },
  };
}

const bundleFrom = `src/pages/${requestedRoute}/index.html`;
const bundleTo = `${requestedRoute}/index.html`;

export default defineConfig(({ command }) => {
  const isServe = command === "serve";
  const buildRoute = isServe ? activeRoute : requestedRoute;
  const openPath = isServe
    ? "/"
    : entryPathForDevServer(resolveRouteEntry(buildRoute));

  return {
    resolve: {
      alias: {
        "lottie-web/build/player/lottie_svg": "lottie-web/build/player/lottie_light.js",
        "@playable/core": KIT_CORE,
        "@playable/js": KIT_CORE,
        "@playable/af": APPSFLYER_CORE,
        "@playable/skills": resolve(__dirname, "src/skills"),
        "@playable/runtime": resolve(__dirname, "src/runtime"),
      },
    },
    plugins: [
      logRoutesPlugin(command),
      ...(isServe ? [studioDevRouter(), playableDevRouter(routes)] : []),
      optimizePlayableImages(),
      inlineHtmlAssets(__dirname),
      ViteImageOptimizer({
        includePublic: false,
        logStats: true,
        png: { quality: 80, compressionLevel: 9, palette: true },
        jpeg: { quality: 82 },
        jpg: { quality: 82 },
      }),
      viteSingleFile(),
      ensureBase64DataUris(),
      playableAdSanitize(),
      renameHtmlOutput(bundleFrom, bundleTo),
    ],
    server: {
      open: openPath,
    },
    build: {
      emptyOutDir: !keepDist,
      rollupOptions: {
        input: rollupInputForCommand(command),
      },
    },
  };
});

function renameHtmlOutput(fromFileName, toFileName) {
  return {
    name: "rename-html-output",
    apply: "build",
    enforce: "post",
    generateBundle(_, bundle) {
      for (const [key, item] of Object.entries(bundle)) {
        if (item.type === "asset" && item.fileName === fromFileName) {
          item.fileName = toFileName;
          delete bundle[key];
          bundle[toFileName] = item;
          break;
        }
      }
    },
  };
}
