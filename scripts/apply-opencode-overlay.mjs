#!/usr/bin/env node
/**
 * Merge the local OpenCode overlay into a freshly upgraded OAK kit config.
 *
 * The kit rewrites `opencode.json` (and its sibling protected root files) on every
 * `oak upgrade`. Anything the user added by hand — MCP servers, the provider block,
 * the skills path, pinned plugins, the permission policy, personal fallback agents —
 * lives here instead, so an upgrade can be followed by one command instead of a manual
 * merge. Keys present in this fragment win over the kit's defaults; everything else in
 * the target file is preserved.
 *
 * Usage:
 *   node scripts/apply-opencode-overlay.mjs [--target FILE] [--overlay FILE] [--apply]
 *
 * Dry run is the default: nothing is written until --apply is passed.
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const overlayPath = path.resolve(option("--overlay", join(root, "harness", "opencode-overlay.json")));
const targetPath = path.resolve(
  option("--target", join(process.env.OPENCODE_CONFIG_DIR || join(os.homedir(), ".config", "opencode"), "opencode.json")),
);
const apply = flag("--apply");

for (const [label, file] of [["overlay", overlayPath], ["target", targetPath]]) {
  if (!fs.existsSync(file)) {
    console.error(`apply-opencode-overlay: ${label} does not exist: ${file}`);
    process.exit(2);
  }
}

const overlay = JSON.parse(fs.readFileSync(overlayPath, "utf8"));
const target = JSON.parse(fs.readFileSync(targetPath, "utf8"));

// Plain objects merge recursively; arrays and scalars from the overlay replace the
// kit's value wholesale, so a pinned plugin list never accumulates duplicates.
const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

function merge(base, addition, trail = "") {
  for (const [key, value] of Object.entries(addition)) {
    if (key === "$comment") continue;
    const at = trail ? `${trail}.${key}` : key;
    const current = base[key];
    if (isPlainObject(value) && isPlainObject(current)) {
      merge(current, value, at);
    } else {
      const before = JSON.stringify(current);
      const after = JSON.stringify(value);
      if (before === after) continue;
      base[key] = value;
      changes.push({ at, before, after });
    }
  }
}

const changes = [];
merge(target, overlay);

const mode = fs.statSync(targetPath).mode & 0o777;
console.log(`apply-opencode-overlay: overlay=${overlayPath}`);
console.log(`apply-opencode-overlay: target=${targetPath} mode=${apply ? "APPLY" : "dry-run"}`);
console.log("");
if (!changes.length) {
  console.log("nothing to do: the target already carries this overlay.");
  process.exit(0);
}
for (const change of changes) {
  const summarize = (value) => (value && value.length > 120 ? `${value.slice(0, 117)}...` : value);
  console.log(`  ~ ${change.at}`);
  if (change.before !== undefined) console.log(`      was: ${summarize(change.before)}`);
  console.log(`      now: ${summarize(change.after)}`);
}
console.log("");
console.log(`${changes.length} keys differ.`);

if (!apply) {
  console.log("dry run only; re-run with --apply to write the merged file.");
  process.exit(0);
}

// Preserve the file mode the kit expects (0o664): oak compares bytes and mode.
fs.writeFileSync(targetPath, `${JSON.stringify(target, null, 2)}\n`);
fs.chmodSync(targetPath, mode);
console.log(`wrote ${targetPath} (mode ${mode.toString(8)})`);
