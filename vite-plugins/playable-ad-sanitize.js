import { sanitizePlayableHtml } from "./sanitize-html.js";

export function playableAdSanitize() {
  return {
    name: "playable-ad-sanitize",
    apply: "build",
    enforce: "post",
    generateBundle(_, bundle) {
      for (const item of Object.values(bundle)) {
        if (item.type !== "asset" || !item.fileName.endsWith(".html")) continue;
        if (typeof item.source !== "string") continue;
        item.source = sanitizePlayableHtml(item.source);
      }
    },
  };
}
