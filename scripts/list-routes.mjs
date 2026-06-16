#!/usr/bin/env node
import { discoverRoutes } from "./discover-routes.mjs";

const routes = discoverRoutes();
if (!routes.length) {
  console.log("No pages found under src/pages/*/index.html");
  process.exit(0);
}

console.log("Pages:\n");
for (const r of routes) {
  console.log(`  ${r}`);
  console.log(`    dev:    PLAYABLE_ROUTE=${r} pnpm dev`);
  console.log(`    build:  pnpm build:single ${r} → dist/${r}/index.html`);
  console.log(`    all:    pnpm build (every page)\n`);
}
