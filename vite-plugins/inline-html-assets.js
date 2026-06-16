import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const ATTR_RE =
  /(\s(?:src|href)=)(["'])(\/src\/(?:assets|html|pages)\/[^"']+\.(?:png|jpe?g|svg|webp))\2/gi;

function mimeFor(filePath) {
  const ext = filePath.split(".").pop()?.toLowerCase();
  if (ext === "svg") return "image/svg+xml";
  if (ext === "webp") return "image/webp";
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  return "image/png";
}

async function toDataUri(absPath) {
  const buf = await readFile(absPath);
  return `data:${mimeFor(absPath)};base64,${buf.toString("base64")}`;
}

export function inlineHtmlAssets(rootDir) {
  return {
    name: "inline-html-assets",
    apply: "build",
    enforce: "post",

    async transformIndexHtml(html) {
      const tasks = [];
      const out = html.replace(ATTR_RE, (full, prefix, quote, urlPath) => {
        const abs = resolve(rootDir, urlPath.slice(1));
        const token = `__INLINE_HTML_ASSET_${tasks.length}__`;
        tasks.push({ token, abs, prefix, quote });
        return `${prefix}${quote}${token}${quote}`;
      });

      if (!tasks.length) return html;

      let result = out;
      for (const { token, abs, prefix, quote } of tasks) {
        let dataUri;
        try {
          dataUri = await toDataUri(abs);
        } catch (e) {
          console.warn(`[inline-html-assets] skip ${abs}:`, e.message);
          dataUri = abs;
        }
        result = result.replace(
          `${prefix}${quote}${token}${quote}`,
          `${prefix}${quote}${dataUri}${quote}`,
        );
      }
      return result;
    },
  };
}
