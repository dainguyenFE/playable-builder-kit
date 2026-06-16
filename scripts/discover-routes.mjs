import { existsSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const PAGES_ROOT = resolve(__dirname, "../src/pages");

/** @returns {string[]} page folder names that contain index.html */
export function discoverRoutes() {
  if (!existsSync(PAGES_ROOT)) return [];

  return readdirSync(PAGES_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("_"))
    .map((d) => d.name)
    .filter((name) => existsSync(resolve(PAGES_ROOT, name, "index.html")))
    .sort();
}

export function resolveRouteEntry(route) {
  return resolve(PAGES_ROOT, route, "index.html");
}

export function assertRouteExists(route) {
  const routes = discoverRoutes();
  if (!routes.includes(route)) {
    throw new Error(
      `[playable-builder-kit] Unknown page "${route}". Available: ${routes.join(", ") || "(none)"}`,
    );
  }
}
