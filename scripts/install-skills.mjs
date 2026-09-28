#!/usr/bin/env node
/**
 * install-skills.mjs — manifest-driven skill installer.
 *
 * Reads skills.json and installs third-party skill dependencies via the
 * skills CLI (https://github.com/vercel-labs/skills). Own skills live in
 * this repository and are installed with `npx skills add <this-repo>`.
 *
 * Usage:
 *   node scripts/install-skills.mjs            # install all dependencies
 *   node scripts/install-skills.mjs --list     # print what would be installed
 *   node scripts/install-skills.mjs --update   # run `npx skills update` after install
 *
 * The skills CLI keeps a lockfile (~/.agents/.skill-lock.json) with source +
 * content hashes; `npx skills check` / `npx skills update` detect upstream
 * changes for everything installed here.
 */

import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { spawnSync } from "node:child_process"

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const manifest = JSON.parse(readFileSync(join(root, "skills.json"), "utf8"))

const args = new Set(process.argv.slice(2))
const dryRun = args.has("--list")
const withUpdate = args.has("--update")

function run(cmd, cmdArgs) {
  if (dryRun) {
    console.log(`  [dry-run] ${cmd} ${cmdArgs.join(" ")}`)
    return { status: 0 }
  }
  const r = spawnSync(cmd, cmdArgs, { stdio: "inherit" })
  return r
}

let failures = 0

console.log(`Manifest: ${manifest.name}\n`)

for (const dep of manifest.dependencies ?? []) {
  const base = dep.base ? `/${dep.base.replace(/^\/+|\/+$/g, "")}` : ""
  for (const skill of dep.skills ?? []) {
    const ref = dep.ref ?? "main"
    const url = `https://github.com/${dep.source}/tree/${ref}${base}/${skill}`
    console.log(`Installing ${dep.source}/${skill}`)
    const r = run("npx", ["-y", "skills@latest", "add", url])
    if (r.status !== 0) {
      failures++
      console.error(`  ✗ failed: ${url}`)
    }
  }
}

if (withUpdate && !dryRun) {
  console.log("\nUpdating installed skills...")
  run("npx", ["-y", "skills@latest", "update"])
}

console.log(
  failures === 0
    ? "\n✅ All declared skills installed. Own skills: npx skills add didacrios/ai-coding-protocols"
    : `\n⚠ ${failures} install(s) failed — see output above.`
)
process.exit(failures === 0 ? 0 : 1)
