#!/usr/bin/env node
/**
 * Render catalog YAML into harness Markdown. Never writes $HOME unless
 * --dest points there; the Makefile target uses ./generated.
 *
 *   node scripts/render-catalog.mjs --target pi --dest generated/pi
 *   node scripts/render-catalog.mjs --target opencode --dest generated/opencode
 *   node scripts/render-catalog.mjs --target all --dest generated
 */

import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { loadCatalog } from "./lib/catalog.mjs"
import { adaptPiAgent, adaptPiCommand } from "./lib/adapt-pi.mjs"
import { adaptOpencodeAgent, adaptOpencodeCommand } from "./lib/adapt-opencode.mjs"
import { writeOpencodeReviewExtras } from "./lib/opencode-review-extras.mjs"

const args = process.argv.slice(2)
const option = (name, fallback) => {
  const i = args.indexOf(name)
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback
}

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(here, "..")
const catalogDir = option("--catalog", join(repoRoot, "catalog"))
const target = option("--target", "all")
const dest = option("--dest", "")

if (!dest) {
  console.error("render-catalog: --dest <dir> is required (refusing to guess a live harness path)")
  process.exit(1)
}

if (!["pi", "opencode", "all"].includes(target)) {
  console.error(`render-catalog: unknown target "${target}" (pi | opencode | all)`)
  process.exit(1)
}

const catalog = loadCatalog(catalogDir)
const written = []

if (target === "pi" || target === "all") {
  const root = target === "all" ? join(dest, "pi") : dest
  written.push(...writePi(catalog, root))
}
if (target === "opencode" || target === "all") {
  const root = target === "all" ? join(dest, "opencode") : dest
  written.push(...writeOpencode(catalog, root))
}

for (const file of written) console.log(file)
console.error(`render-catalog: wrote ${written.length} files under ${dest}`)

function writePi(catalog, root) {
  const files = []
  for (const spec of catalog.agents.values()) {
    files.push(write(join(root, "agents", `${spec.id}.md`), adaptPiAgent(spec)))
  }
  for (const command of catalog.commands.values()) {
    const workflow = command.workflow ? catalog.workflows.get(command.workflow) : undefined
    files.push(
      write(join(root, "prompts", `${command.id}.md`), adaptPiCommand(command, workflow, catalog)),
    )
  }
  return files
}

function writeOpencode(catalog, root) {
  const files = []
  for (const spec of catalog.agents.values()) {
    files.push(write(join(root, "agents", `${spec.id}.md`), adaptOpencodeAgent(spec, catalog)))
  }
  for (const command of catalog.commands.values()) {
    const workflow = command.workflow ? catalog.workflows.get(command.workflow) : undefined
    files.push(
      write(
        join(root, "commands", `${command.id}.md`),
        adaptOpencodeCommand(command, workflow, catalog),
      ),
    )
  }
  files.push(...writeOpencodeReviewExtras(catalog, write, root))
  return files
}

function write(path, contents) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, contents)
  return path
}
