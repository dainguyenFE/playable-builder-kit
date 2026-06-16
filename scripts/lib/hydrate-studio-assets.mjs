import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ROOT } from "./paths.mjs";

const ASSETS_ROOT = resolve(ROOT, "data/studio/assets");

/**
 * Inline studio assets for single-file export.
 * @param {object} assetsBundle
 */
export function hydrateAssetsBundleSync(assetsBundle) {
  const list = assetsBundle?.assets ?? [];
  return { assets: list.map(hydrateOne) };
}

function hydrateOne(asset) {
  if (!asset?.path || asset.dataUrl || asset.lottie || asset.data) return asset;
  const file = resolve(ASSETS_ROOT, asset.path);
  if (!file.startsWith(ASSETS_ROOT) || !existsSync(file)) return asset;

  if (asset.type === "lottie" || asset.path.endsWith(".json")) {
    return { ...asset, lottie: JSON.parse(readFileSync(file, "utf8")) };
  }
  if (asset.path.endsWith(".svg")) {
    const svg = readFileSync(file, "utf8");
    return { ...asset, dataUrl: `data:image/svg+xml,${encodeURIComponent(svg)}` };
  }
  const ext = asset.path.split(".").pop()?.toLowerCase() ?? "";
  const mime =
    ext === "png"
      ? "image/png"
      : ext === "webp"
        ? "image/webp"
        : ext === "gif"
          ? "image/gif"
          : ext === "jpg" || ext === "jpeg"
            ? "image/jpeg"
            : "application/octet-stream";
  const buf = readFileSync(file);
  return { ...asset, dataUrl: `data:${mime};base64,${buf.toString("base64")}` };
}
