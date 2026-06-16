import { initLottie } from "../../skills/lottie.js";
import { findAsset, resolveLottieData } from "./assets.js";

async function loadLottieAsset(asset) {
  let data = resolveLottieData(asset);
  if (data) return data;
  if (asset?.path) {
    const res = await fetch(`/studio-assets/${asset.path}`);
    if (res.ok) return res.json();
  }
  return null;
}

/**
 * @param {{ el: HTMLElement, assetId: string }[]} mounts
 * @param {object} assetsBundle
 */
export async function initLottieMounts(mounts, assetsBundle) {
  /** @type {import('lottie-web').AnimationItem[]} */
  const instances = [];
  await Promise.all(
    mounts.map(async ({ el, assetId }) => {
      const asset = findAsset(assetsBundle, assetId);
      const data = await loadLottieAsset(asset);
      if (data && el) {
        const anim = initLottie(el, data, { loop: true, autoplay: true });
        if (anim) instances.push(anim);
      }
    }),
  );
  return instances;
}
