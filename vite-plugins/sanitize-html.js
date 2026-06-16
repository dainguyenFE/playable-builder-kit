export function sanitizePlayableHtml(html) {
  let out = html;

  out = out.replace(
    /Function\("return this"\)/g,
    "((function(){return this}).call(null))",
  );

  out = out.replace(
    /if\s*\(\s*window\.Worker\s*&&\s*window\.Blob\s*&&\s*getWebWorker\s*\(\s*\)\s*\)/g,
    "if(false&&window.Worker",
  );

  out = out.replace(/<svg\b([^>]*)>/gi, (match, attrs) => {
    const cleaned = attrs
      .replace(/\s*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/gi, "")
      .replace(/\s*xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/gi, "");
    return `<svg${cleaned}>`;
  });

  return out;
}
