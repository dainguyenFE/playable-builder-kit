#!/usr/bin/env node
/**
 * Alias CLI per spec §23: pnpm playable <cmd> [args]
 */
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const [cmd, ...rest] = process.argv.slice(2);

const map = {
  list: ["studio-list.mjs"],
  validate: ["studio-validate.mjs"],
  export: ["playable-export.mjs"],
  create: ["studio-create.mjs"],
  patch: ["studio-patch.mjs"],
  new: ["playable-new.mjs"],
};

if (!cmd || !map[cmd]) {
  console.log(`Usage: pnpm playable <command>

Commands:
  new [--list] | new <id> studio|compose|scaffold [template] [theme]
  export <id> | export --list
  list
  create <id> [template]
  validate <id>
  export <id>
  patch <id> <patch.json>
`);
  process.exit(cmd ? 1 : 0);
}

const args = [...map[cmd], ...rest];
if (cmd === "export") {
  // --single-html is default
  const filtered = args.filter((a) => a !== "--single-html");
  args.length = 0;
  args.push(...filtered);
}

const r = spawnSync("node", ["scripts/" + args[0], ...args.slice(1)], {
  cwd: ROOT,
  stdio: "inherit",
  shell: false,
});
process.exit(r.status ?? 1);
