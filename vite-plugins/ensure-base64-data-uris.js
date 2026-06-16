export function ensureBase64DataUris() {
  return {
    name: "ensure-base64-data-uris",
    apply: "build",
    enforce: "post",
    generateBundle(_, bundle) {
      for (const item of Object.values(bundle)) {
        if (item.type !== "asset" || !item.fileName.endsWith(".html")) continue;
        if (typeof item.source !== "string") continue;
        item.source = ensureBase64InHtml(item.source);
      }
    },
  };
}

function ensureBase64InHtml(html) {
  let out = html;

  out = out.replace(/data:image\/svg\+xml,(?!;base64)([^"]+)/g, (match, payload) => {
    try {
      const raw = payload.includes("%") ? decodeURIComponent(payload) : payload;
      return `data:image/svg+xml;base64,${Buffer.from(raw, "utf8").toString("base64")}`;
    } catch {
      return match;
    }
  });

  out = out.replace(/url\(\s*data:image\/svg\+xml,(?!;base64)([^)]+)\)/g, (match, payload) => {
    try {
      const raw = payload.includes("%") ? decodeURIComponent(payload) : payload;
      return `url(data:image/svg+xml;base64,${Buffer.from(raw, "utf8").toString("base64")})`;
    } catch {
      return match;
    }
  });

  return out;
}
