#!/usr/bin/env node
/**
 * Remove every gentle-ai / gentle-pi artifact from an OpenCode config tree.
 *
 * The OpenCode harness is owned by the OAK kit (opencode-agent-orchestration-kit).
 * gentle-ai injects its own commands, prompts, skills, plugins and state files on
 * top of that install. This script removes only those injections; it never deletes
 * a path that OAK tracks in `.oak/manifest.json`.
 *
 * Usage:
 *   node scripts/purge-gentle-ai.mjs [--target DIR] [--apply] [--backup DIR]
 *
 * Dry run is the default: nothing is moved until --apply is passed.
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const target = path.resolve(
  option("--target", process.env.OPENCODE_CONFIG_DIR || path.join(os.homedir(), ".config", "opencode")),
);
const apply = flag("--apply");
const backupDir = path.resolve(
  option("--backup", path.join(os.homedir(), "backups", "opencode", `gentle-purge-${new Date().toISOString().replace(/[:.]/g, "-")}`)),
);

if (!fs.existsSync(target)) {
  console.error(`purge-gentle-ai: target does not exist: ${target}`);
  process.exit(2);
}

// Directories never scanned or modified.
const SKIP_DIRS = new Set(["node_modules", ".git", ".oak"]);

// Whole directories injected by gentle-ai: every file below them is residue.
const DIR_RESIDUE = [
  /^\.atl$/,
  /^prompts\/sdd$/,
  /^skills\/_shared$/,
  /^skills\/(sdd-[^/]+|judgment-day|rdd-defect-workflow|gentle-ai-bench|skill-creator|skill-improver|skill-registry|branch-pr|chained-pr|comment-writer|cognitive-doc-design|go-testing|issue-creation|systemic-issue-triage|work-unit-commits)$/,
];

// Individual injected files. Matched against the repository-relative POSIX path.
const FILE_RESIDUE = [
  /^\.gentle-ai-.*\.json$/,
  /^commands\/sdd-.*\.md$/,
  /^commands\/skill-creator\.md$/,
  /^commands\/skill-registry\.md$/,
  /^plugins\/(model-variants\.ts|telemetry-runtime\.ts|opencode-review-transport\.ts|sdd-task-result-artifacts\.ts|skill-registry\.ts)$/,
  /^tui-plugins\/gentle-logo\.tsx$/,
];

// Content marker: any surviving file that still names the tooling.
const CONTENT_SIGNATURE = /gentle-ai|gentle-pi|Gentleman-Programming/i;
const TEXT_EXT = /\.(md|json|jsonc|ts|tsx|js|mjs|sh|txt|ya?ml)$/;

function readOwned() {
  const manifestPath = path.join(target, ".oak", "manifest.json");
  if (!fs.existsSync(manifestPath)) return new Set();
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const owned = new Set();
    for (const entry of manifest.owned_files || []) owned.add(entry.path);
    for (const entry of manifest.preserved_files || []) owned.add(entry.path);
    return owned;
  } catch (error) {
    console.error(`purge-gentle-ai: cannot read ${manifestPath}: ${error.message}`);
    process.exit(2);
  }
}

function walk(dir, out = []) {
  for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(dirent.name)) continue;
    const full = path.join(dir, dirent.name);
    if (dirent.isDirectory()) walk(full, out);
    else if (dirent.isFile()) out.push(full);
  }
  return out;
}

const owned = readOwned();
const files = walk(target);
const remove = [];
const skippedOwned = [];
const flagged = [];

// Ancestors of every residue directory, so each file can be classified once.
const residueDirs = [];
const collectDirs = (dir) => {
  for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!dirent.isDirectory() || SKIP_DIRS.has(dirent.name)) continue;
    const full = path.join(dir, dirent.name);
    const rel = path.relative(target, full).split(path.sep).join("/");
    if (DIR_RESIDUE.some((pattern) => pattern.test(rel))) residueDirs.push(rel);
    else collectDirs(full);
  }
};
collectDirs(target);

for (const full of files) {
  const rel = path.relative(target, full).split(path.sep).join("/");
  const owningDir = residueDirs.find((dir) => rel.startsWith(`${dir}/`));
  const byName = Boolean(owningDir) || FILE_RESIDUE.some((pattern) => pattern.test(rel));
  const reason = owningDir ? `inside ${owningDir}/` : "name-pattern";

  let byContent = false;
  if (!byName && TEXT_EXT.test(rel)) {
    try {
      byContent = CONTENT_SIGNATURE.test(fs.readFileSync(full, "utf8"));
    } catch {
      byContent = false;
    }
  }
  if (!byName && !byContent) continue;

  if (owned.has(rel)) {
    skippedOwned.push(rel);
    continue;
  }
  if (byName) remove.push({ rel, reason });
  else flagged.push({ rel, reason: "content-signature" });
}

remove.sort((a, b) => a.rel.localeCompare(b.rel));
flagged.sort((a, b) => a.rel.localeCompare(b.rel));

console.log(`purge-gentle-ai: target=${target} mode=${apply ? "APPLY" : "dry-run"}`);
console.log(`tracked by OAK: ${owned.size} paths`);
console.log("");
console.log(`will remove (${remove.length}):`);
for (const entry of remove) console.log(`  - ${entry.rel}  [${entry.reason}]`);
console.log("");
console.log(`needs manual review (${flagged.length}):`);
for (const entry of flagged) console.log(`  ? ${entry.rel}  [${entry.reason}]`);
if (skippedOwned.length) {
  console.log("");
  console.log(`kept because OAK owns them (${skippedOwned.length}):`);
  for (const rel of skippedOwned) console.log(`  = ${rel}`);
}

if (!apply) {
  console.log("");
  console.log("dry run only; re-run with --apply to move these files to the backup directory.");
  process.exit(flagged.length ? 1 : 0);
}

fs.mkdirSync(backupDir, { recursive: true });
for (const entry of remove) {
  const from = path.join(target, entry.rel);
  const to = path.join(backupDir, entry.rel);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.renameSync(from, to);
}
// Drop now-empty directories left behind by the moved files.
const pruneEmpty = (dir) => {
  for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!dirent.isDirectory() || SKIP_DIRS.has(dirent.name)) continue;
    const full = path.join(dir, dirent.name);
    pruneEmpty(full);
    if (fs.readdirSync(full).length === 0) fs.rmdirSync(full);
  }
};
pruneEmpty(target);

console.log("");
console.log(`moved ${remove.length} paths to ${backupDir}`);
if (flagged.length) {
  console.log(`${flagged.length} paths need manual review; they were left untouched.`);
}
