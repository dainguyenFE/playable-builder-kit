/**
 * Resolve studio assets for preview (URL) and export (inline data).
 */

/**
 * @param {object} assetsBundle - { assets: [] }
 * @param {string} assetId
 */
export function findAsset(assetsBundle, assetId) {
  if (!assetId || !assetsBundle?.assets) return null;
  return assetsBundle.assets.find((a) => a.id === assetId) ?? null;
}

/**
 * @param {object} asset
 * @param {string} [templateId]
 */
export function resolveAssetSrc(asset, templateId) {
  if (!asset) return "";
  if (asset.dataUrl) return asset.dataUrl;
  if (asset.data && asset.mime) {
    return `data:${asset.mime};base64,${asset.data}`;
  }
  if (asset.type === "image" && asset.data && asset.data.startsWith("<svg")) {
    return `data:image/svg+xml,${encodeURIComponent(asset.data)}`;
  }
  if (asset.path) {
    if (asset.path.startsWith("/") || asset.path.startsWith("data:")) return asset.path;
    return `/studio-assets/${asset.path}`;
  }
  return "";
}

/**
 * @param {object} asset
 */
export function resolveLottieData(asset) {
  if (!asset) return null;
  if (asset.lottie) return asset.lottie;
  if (asset.type === "lottie" && asset.data && typeof asset.data === "object") return asset.data;
  return null;
}
