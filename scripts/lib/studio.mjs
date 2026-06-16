import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateStudioPlayable } from "../../src/studio-schema/validate.mjs";
import { studioPlayableDir } from "./studio-paths.mjs";
import { loadJson } from "./compose.mjs";

export function loadStudioBundle(playableId) {
  const dir = studioPlayableDir(playableId);
  const required = ["playable.json", "context.json", "scenario.json"];
  for (const f of required) {
    if (!existsSync(resolve(dir, f))) {
      throw new Error(`Missing ${f} for studio playable "${playableId}"`);
    }
  }

  const bundle = {
    manifest: existsSync(resolve(dir, "manifest.json"))
      ? loadJson(resolve(dir, "manifest.json"))
      : { id: playableId },
    playable: loadJson(resolve(dir, "playable.json")),
    context: loadJson(resolve(dir, "context.json")),
    scenario: loadJson(resolve(dir, "scenario.json")),
    assets: existsSync(resolve(dir, "assets.json"))
      ? loadJson(resolve(dir, "assets.json"))
      : { assets: [] },
  };

  return { dir, bundle };
}

export function validateStudioPlayableId(playableId) {
  const errors = [];
  const warnings = [];

  let bundle;
  try {
    ({ bundle } = loadStudioBundle(playableId));
  } catch (e) {
    return {
      errors: [e.message],
      warnings: [],
      report: { playableId, status: "error", summary: { errors: 1, warnings: 0 } },
    };
  }

  errors.push(...validateStudioPlayable(bundle));

  const screenIds = new Set(bundle.scenario.screens.map((s) => s.id));
  let hasCta = false;
  for (const screen of bundle.scenario.screens) {
    for (const el of screen.elements ?? []) {
      if (el.type === "cta-button" || el.type === "cta_button") hasCta = true;
    }
    if (screen.autoNext?.enabled && screen.autoNext.target && !screenIds.has(screen.autoNext.target)) {
      errors.push(`autoNext target unknown: ${screen.autoNext.target}`);
    }
  }
  if (!hasCta && !bundle.playable.cta?.label) {
    warnings.push("No CTA element or playable.cta.label — export may fail QA");
  }

  const report = {
    playableId,
    status: errors.length ? "error" : warnings.length ? "warning" : "ok",
    summary: { errors: errors.length, warnings: warnings.length },
    errors: errors.map((message) => ({ message })),
    warnings: warnings.map((message) => ({ message })),
  };

  return { errors, warnings, report, bundle };
}
