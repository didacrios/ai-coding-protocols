#!/usr/bin/env node
/**
 * install-skills.mjs — manifest-driven skill installer.
 *
 * Reads skills.json and installs third-party skill dependencies via the
 * skills CLI (https://github.com/vercel-labs/skills). Own skills live in
 * this repository and are installed with `npx skills add <this-repo>`.
 *
 * Usage:
 *   node scripts/install-skills.mjs                      # install all dependencies
 *   node scripts/install-skills.mjs --list               # print what would be installed
 *   node scripts/install-skills.mjs --update             # run `npx skills update` after install
 *   node scripts/install-skills.mjs --include-kit-overlap
 *
 * The skills CLI keeps a lockfile (~/.agents/.skill-lock.json) with source +
 * content hashes; `npx skills check` / `npx skills update` detect upstream
 * changes for everything installed here.
 *
 * OAK kit overlap: the kit ships adapted copies of several addyosmani skills.
 * opencode reads both its own skills directory and every path in skills.paths,
 * so installing a same-named raw copy would leave two skills sharing one name.
 * The manifest still declares them — a harness without the kit needs them — but
 * they are skipped here whenever the kit already provides them.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join, basename } from "node:path"
import { homedir } from "node:os"
import { spawnSync, execFileSync } from "node:child_process"

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const manifest = JSON.parse(readFileSync(join(root, "skills.json"), "utf8"))

const args = new Set(process.argv.slice(2))
const dryRun = args.has("--list")
const withUpdate = args.has("--update")
const includeOverlap = args.has("--include-kit-overlap")

function run(cmd, cmdArgs) {
  if (dryRun) {
    console.log(`  [dry-run] ${cmd} ${cmdArgs.join(" ")}`)
    return { status: 0 }
  }
  return spawnSync(cmd, cmdArgs, { stdio: "inherit" })
}

// The kit's own skill names, from the globally installed package and from a live
// opencode config tree (a machine may have one, the other, or both).
function kitSkills() {
  const candidates = []
  try {
    const npmRoot = execFileSync("npm", ["root", "-g"], { encoding: "utf8" }).trim()
    candidates.push(join(npmRoot, "opencode-agent-orchestration-kit", "opencode", "skills"))
  } catch {
    /* npm unavailable: fall back to the config tree */
  }
  candidates.push(join(homedir(), ".config", "opencode", "skills"))

  const names = new Set()
  const sources = []
  for (const dir of candidates) {
    if (!existsSync(dir)) continue
    sources.push(dir)
    for (const entry of readdirSync(dir)) names.add(entry)
  }
  return { names, sources }
}

const kit = kitSkills()
if (kit.sources.length) {
  console.log(`OAK kit skills found in: ${kit.sources.join(", ")} (${kit.names.size} skills)`)
} else {
  console.log("OAK kit not detected: every declared skill will be installed.")
}

let failures = 0
const skipped = []

console.log(`\nManifest: ${manifest.name}\n`)

for (const dep of manifest.dependencies ?? []) {
  const base = dep.base ? `/${dep.base.replace(/^\/+|\/+$/g, "")}` : ""
  for (const skill of dep.skills ?? []) {
    const name = basename(skill)
    if (!includeOverlap && kit.names.has(name)) {
      skipped.push({ source: dep.source, name })
      console.log(`Skipping ${dep.source}/${name} — the OAK kit already provides it`)
      continue
    }
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

if (skipped.length) {
  console.log(`\n${skipped.length} declared skill(s) left to the OAK kit:`)
  for (const s of skipped) console.log(`    ${s.name}  (${s.source})`)
  console.log("  Pass --include-kit-overlap to install them anyway (harness without the kit).")
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
