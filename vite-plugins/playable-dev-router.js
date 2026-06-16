/**
 * Dev-only: index of all pages, short URLs, legacy /src/html/* redirects.
 */
export function playableDevRouter(routes) {
  return {
    name: "playable-dev-router",
    apply: "serve",
    configureServer(server) {
      const list = routes
        .map(
          (name) =>
            `<li><a href="/src/pages/${name}/index.html"><code>${name}</code></a> · <a href="/${name}">/${name}</a></li>`,
        )
        .join("\n");

      const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Playable pages</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 2rem; line-height: 1.5; }
    code { background: #f1f5f9; padding: 0.1em 0.35em; border-radius: 4px; }
    ul { padding-left: 1.25rem; }
  </style>
</head>
<body>
  <h1>Playable pages</h1>
  <p>Dev server — pick a page:</p>
  <ul>${list || "<li><em>No pages under src/pages/</em></li>"}</ul>
</body>
</html>`;

      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? "").split("?")[0];

        const legacy = url.match(/^\/src\/html\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?(?:index\.html)?$/);
        if (legacy) {
          res.writeHead(302, { Location: `/src/pages/${legacy[1]}/index.html` });
          res.end();
          return;
        }

        const short = url.match(/^\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/);
        if (short && routes.includes(short[1])) {
          res.writeHead(302, { Location: `/src/pages/${short[1]}/index.html` });
          res.end();
          return;
        }

        if (url === "/pages" || url === "/pages/") {
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(indexHtml);
          return;
        }

        next();
      });
    },
  };
}
