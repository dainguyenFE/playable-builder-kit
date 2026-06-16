/**
 * Build-only: raster/SVG imports under src/pages → base64 data URL modules.
 */
import sharp from "sharp";
import { readFile } from "node:fs/promises";

/** Page-local assets: src/pages/<page>/assets/** */
const ASSET_RE = /\/src\/pages\/[^/]+\/assets\/.*\.(png|jpe?g|svg)$/i;
const MAX_EDGE_DEFAULT = 1024;

export function optimizePlayableImages() {
  let totalBefore = 0;
  let totalAfter = 0;
  let fileCount = 0;

  return {
    name: "optimize-playable-images",
    apply: "build",
    enforce: "pre",

    async load(id) {
      if (!ASSET_RE.test(id.replace(/\\/g, "/"))) return null;

      const input = await readFile(id);
      const ext = id.split(".").pop()?.toLowerCase();

      if (ext === "svg") {
        let svgText = input.toString("utf8");
        if (!/\sxmlns\s*=\s*["']http:\/\/www\.w3\.org\/2000\/svg["']/i.test(svgText)) {
          svgText = svgText.replace(/<svg\b/i, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svgText, "utf8").toString("base64")}`;
        return { code: `export default ${JSON.stringify(dataUrl)};`, map: { mappings: "" } };
      }

      let pipeline = sharp(input, { failOn: "none" });
      const meta = await pipeline.metadata();
      if ((meta.width || 0) > MAX_EDGE_DEFAULT || (meta.height || 0) > MAX_EDGE_DEFAULT) {
        pipeline = pipeline.resize({
          width: MAX_EDGE_DEFAULT,
          height: MAX_EDGE_DEFAULT,
          fit: "inside",
          withoutEnlargement: true,
        });
      }

      const output =
        ext === "png"
          ? await pipeline
              .png({ quality: 80, compressionLevel: 9, effort: 10, palette: true })
              .toBuffer()
          : await pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer();

      const finalBuf = output.length < input.length ? output : input;
      totalBefore += input.length;
      totalAfter += finalBuf.length;
      fileCount += 1;

      const mime = ext === "png" ? "image/png" : "image/jpeg";
      const dataUrl = `data:${mime};base64,${finalBuf.toString("base64")}`;
      return { code: `export default ${JSON.stringify(dataUrl)};`, map: { mappings: "" } };
    },

    closeBundle() {
      if (fileCount === 0) return;
      const saved = totalBefore - totalAfter;
      const pct = totalBefore > 0 ? Math.round((saved / totalBefore) * 100) : 0;
      console.log(
        `\n✨ [optimize-playable-images] ${fileCount} file(s), ${(saved / 1024).toFixed(0)} KB saved (~${pct}%)\n`,
      );
    },
  };
}
