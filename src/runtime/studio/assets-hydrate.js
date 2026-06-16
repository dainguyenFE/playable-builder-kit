import { resolveAssetSrc, resolveLottieData } from "./assets.js";

/**
 * Fetch file-based assets into inline data (preview dev).
 * @param {object} assetsBundle
 */
export async function hydrateAssetsBundle(assetsBundle) {
  const list = assetsBundle?.assets ?? [];
  const hydrated = await Promise.all(list.map(hydrateOneAsset));
  return { assets: hydrated };
}

async function hydrateOneAsset(asset) {
  if (!asset?.path || resolveAssetSrc(asset) || resolveLottieData(asset)) {
    return asset;
  }
  const url = asset.path.startsWith("/") ? asset.path : `/studio-assets/${asset.path}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[studio] asset not found: ${url}`);
      return asset;
    }
    if (asset.type === "lottie" || asset.path.endsWith(".json")) {
      return { ...asset, lottie: await res.json() };
    }
    if (asset.path.endsWith(".svg")) {
      const svg = await res.text();
      return { ...asset, dataUrl: `data:image/svg+xml,${encodeURIComponent(svg)}` };
    }
    const buf = await res.arrayBuffer();
    const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
    const mime = res.headers.get("content-type") || "application/octet-stream";
    return { ...asset, dataUrl: `data:${mime};base64,${b64}` };
  } catch (e) {
    console.warn(`[studio] asset load failed: ${url}`, e);
    return asset;
  }
}
