#!/usr/bin/env node
/**
 * sync-harness.mjs — generate pi variants from the OAK kit agents and commands.
 *
 * The OpenCode harness is owned by the OAK kit (opencode-agent-orchestration-kit),
 * installed globally and materialised into ~/.config/opencode by `oak install`.
 * Its pristine payload ships the agent and command sources; this script reads them
 * from the installed kit, converts them to pi's frontmatter dialect and copies them
 * into ~/.pi/agent/ (copies, not symlinks — the frontmatter differs per harness).
 *
 * Usage:
 *   node scripts/sync-harness.mjs --target pi                 # install to ~/.pi/agent
 *   node scripts/sync-harness.mjs --target pi --dest <dir>    # dry-run into a directory
 *   node scripts/sync-harness.mjs --source <kit>/opencode     # explicit source
 *   node scripts/sync-harness.mjs --prefix oak-               # namespace the files
 *
 * Existing destination files are never overwritten unless --force is passed:
 * pi already ships agents named developer, reviewer, researcher and friends, and
 * clobbering them by accident changes an unrelated harness.
 *
 * Mapping (opencode -> pi):
 *   agents:    permission read/glob/grep/list/edit/bash -> tools read/find/grep/ls/edit/bash
 *              (edit:allow also grants write; edit:deny excludes edit and write)
 *   commands:  description -> description; agent/subtask dropped (pi prompts
 *              are templates; delegation is stated in the template body)
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { homedir } from "node:os"
import { execFileSync } from "node:child_process"

const args = process.argv.slice(2)
const option = (name, fallback) => {
  const i = args.indexOf(name)
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback
}
const target = option("--target", "pi")
const dest = option("--dest", join(homedir(), ".pi", "agent"))
const prefix = option("--prefix", "")
const force = args.includes("--force")

if (target !== "pi") {
  console.error(`Unknown target "${target}" (supported: pi)`)
  process.exit(1)
}

// The kit payload is the single source of truth: `oak upgrade` rewrites it, so
// converting from the installed copy keeps pi in step with the kit version.
function resolveSource() {
  const explicit = option("--source", process.env.OAK_SOURCE)
  if (explicit) return explicit
  const candidates = []
  try {
    const globalRoot = execFileSync("npm", ["root", "-g"], { encoding: "utf8" }).trim()
    candidates.push(join(globalRoot, "opencode-agent-orchestration-kit", "opencode"))
  } catch {
    /* npm not available: fall through to the other candidates */
  }
  candidates.push(join(homedir(), ".config", "opencode"))
  for (const candidate of candidates) {
    if (existsSync(join(candidate, "agents")) && existsSync(join(candidate, "commands"))) return candidate
  }
  console.error("sync-harness: cannot find the opencode harness sources.")
  console.error("  Install the kit (npm i -g opencode-agent-orchestration-kit) or pass --source <dir>.")
  process.exit(2)
}

// ── frontmatter helpers ──────────────────────────────────────────────────────

function parseFrontmatter(text) {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(text)
  if (!m) return { fm: {}, body: text }
  const fm = {}
  for (const line of m[1].split("\n")) {
    const kv = /^([a-z_-]+):\s*(.*)$/.exec(line.trim())
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, "")
  }
  return { fm, body: text.slice(m[0].length) }
}

const TOOL_MAP = { read: "read", glob: "find", grep: "grep", list: "ls", bash: "bash" }

function piTools(fm) {
  const tools = new Set()
  const perm = fm.permission ?? ""
  // permission: scalar ("allow"/"deny") or block with per-tool entries
  const block = /^\s+(read|glob|grep|list|lsp|edit|bash):/gm
  if (typeof fm.permission === "string" || (perm && !block.test(perm))) {
    // simple scalar handled below via raw frontmatter scan
  }
  const raw = fm.__raw ?? ""
  const toolAllow = /edit:\s*allow/.test(raw)
  const toolDeny = /edit:\s*deny/.test(raw)
  for (const [oc, pi] of Object.entries(TOOL_MAP)) {
    if (new RegExp(`${oc}:\\s*allow`).test(raw)) tools.add(pi)
  }
  // granular bash blocks ("*": ask + specific allows) still mean the agent uses bash
  if (/^\s*bash:/m.test(raw)) tools.add("bash")
  if (toolAllow) { tools.add("edit"); tools.add("write") }
  if (toolDeny) { tools.delete("edit"); tools.delete("write") }
  if (/bash:\s*allow/.test(raw)) tools.add("bash")
  return [...tools]
}

function convertAgent(text, filename) {
  const { fm, body } = parseFrontmatter(text)
  const raw = /^---\n([\s\S]*?)\n---/.exec(text)?.[1] ?? ""
  const tools = piTools({ ...fm, __raw: raw })
  const name = fm.name || filename.replace(/\.md$/, "")
  const lines = ["---", `name: ${name}`, `description: ${fm.description ?? ""}`]
  if (tools.length) lines.push(`tools: ${tools.join(", ")}`)
  lines.push("systemPromptMode: replace", "---", "")
  return lines.join("\n") + body
}

function convertCommand(text) {
  const { fm, body } = parseFrontmatter(text)
  const lines = ["---", `description: ${fm.description ?? ""}`]
  if (fm["argument-hint"]) lines.push(`argument-hint: ${fm["argument-hint"]}`)
  lines.push("---", "")
  return lines.join("\n") + body
}

// ── run ──────────────────────────────────────────────────────────────────────

const src = resolveSource()
console.log(`source  ${src}`)
const agentsDir = join(dest, "agents")
const promptsDir = join(dest, "prompts")
mkdirSync(agentsDir, { recursive: true })
mkdirSync(promptsDir, { recursive: true })

// A destination file that already exists and differs is a conflict: it usually
// belongs to another harness, so refuse to clobber it unless --force says so.
const conflicts = []
let n = 0
function install(dir, file, content, label) {
  const to = join(dir, file)
  if (!force && existsSync(to) && readFileSync(to, "utf8") !== content) {
    conflicts.push(file)
    return
  }
  writeFileSync(to, content)
  console.log(`${label} ${file}`)
  n++
}

for (const f of readdirSync(join(src, "agents")).filter((f) => f.endsWith(".md"))) {
  const out = convertAgent(readFileSync(join(src, "agents", f), "utf8"), f)
  install(agentsDir, prefix + f, out, "agent  ")
}
for (const f of readdirSync(join(src, "commands")).filter((f) => f.endsWith(".md"))) {
  const out = convertCommand(readFileSync(join(src, "commands", f), "utf8"))
  install(promptsDir, prefix + f, out, "command")
}

console.log(`\n✅ ${n} files installed to ${dest}`)
if (conflicts.length) {
  console.log(`⚠ ${conflicts.length} file(s) left untouched because they already exist with different content:`)
  for (const file of conflicts) console.log(`    ${file}`)
  console.log("  Re-run with --force to overwrite them, or with --prefix <p> to install alongside.")
}
console.log(`⚠ AGENTS.md is not merged automatically: review ${join(src, "AGENTS.md")} and reconcile it into your ~/.pi/agent/AGENTS.md manually.`)
console.log("⚠ Model routing: pi resolves models via ~/.pi/agent/subagents.json (model_profiles); no model pins are written.")
