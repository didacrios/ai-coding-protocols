#!/usr/bin/env node
/**
 * Merge local OpenCode overlays into a freshly upgraded OAK kit config.
 *
 * The kit rewrites protected root files on every `oak upgrade`. Local deltas
 * live in harness/*-overlay.json and are re-applied here. Keys in each
 * fragment win; everything else in the target is preserved. Arrays replace
 * wholesale so plugin lists never accumulate duplicates.
 *
 * Usage:
 *   node scripts/apply-opencode-overlay.mjs [--dest DIR] [--apply]
 *   node scripts/apply-opencode-overlay.mjs [--target FILE] [--overlay FILE] [--apply]
 *
 * Dry run is the default: nothing is written until --apply is passed.
 * --dest DIR applies all three overlays under that directory (preview/CI).
 * --target/--overlay still mean a single opencode.json pair (compat).
 * Does not write package-lock.json; regenerate with
 *   npm install --ignore-scripts --legacy-peer-deps
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

const apply = flag("--apply");
const defaultConfigDir = process.env.OPENCODE_CONFIG_DIR || join(os.homedir(), ".config", "opencode");
const destDir = option("--dest", "");
const singleTarget = option("--target", "");
const singleOverlay = option("--overlay", "");

const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

function merge(base, addition, trail, changes) {
  for (const [key, value] of Object.entries(addition)) {
    if (key === "$comment") continue;
    const at = trail ? `${trail}.${key}` : key;
    const current = base[key];
    if (isPlainObject(value) && isPlainObject(current)) {
      merge(current, value, at, changes);
    } else {
      const before = JSON.stringify(current);
      const after = JSON.stringify(value);
      if (before === after) continue;
      base[key] = value;
      changes.push({ at, before, after });
    }
  }
}

function applyOne(overlayPath, targetPath) {
  if (!fs.existsSync(overlayPath)) {
    console.error(`apply-opencode-overlay: overlay does not exist: ${overlayPath}`);
    process.exit(2);
  }
  if (!fs.existsSync(targetPath)) {
    console.error(`apply-opencode-overlay: target does not exist: ${targetPath}`);
    process.exit(2);
  }

  const overlay = JSON.parse(fs.readFileSync(overlayPath, "utf8"));
  const target = JSON.parse(fs.readFileSync(targetPath, "utf8"));
  const changes = [];
  merge(target, overlay, "", changes);

  const mode = fs.statSync(targetPath).mode & 0o777;
  console.log(`apply-opencode-overlay: overlay=${overlayPath}`);
  console.log(`apply-opencode-overlay: target=${targetPath} mode=${apply ? "APPLY" : "dry-run"}`);
  console.log("");

  if (!changes.length) {
    console.log("nothing to do: the target already carries this overlay.");
    console.log("");
    return 0;
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
    console.log("");
    return changes.length;
  }

  fs.writeFileSync(targetPath, `${JSON.stringify(target, null, 2)}\n`);
  fs.chmodSync(targetPath, mode);
  console.log(`wrote ${targetPath} (mode ${mode.toString(8)})`);
  console.log("");
  return changes.length;
}

const jobs = [];
if (singleOverlay || singleTarget) {
  jobs.push({
    overlay: path.resolve(singleOverlay || join(root, "harness", "opencode-overlay.json")),
    target: path.resolve(singleTarget || join(defaultConfigDir, "opencode.json")),
  });
} else {
  const configDir = destDir ? path.resolve(destDir) : defaultConfigDir;
  jobs.push(
    { overlay: join(root, "harness", "opencode-overlay.json"), target: join(configDir, "opencode.json") },
    { overlay: join(root, "harness", "package-overlay.json"), target: join(configDir, "package.json") },
    { overlay: join(root, "harness", "tui-overlay.json"), target: join(configDir, "tui.json") },
  );
}

let total = 0;
for (const job of jobs) {
  total += applyOne(job.overlay, job.target);
}

if (!apply) {
  console.log(`Listed ${jobs.length} overlay(s); ${total} key(s) would change. Nothing was written.`);
  console.log("After a real apply, regenerate the lockfile in the config dir:");
  console.log("  npm install --ignore-scripts --legacy-peer-deps");
}

process.exit(0);
