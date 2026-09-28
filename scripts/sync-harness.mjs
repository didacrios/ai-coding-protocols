#!/usr/bin/env node
/**
 * sync-harness.mjs — generate pi variants from the opencode harness sources.
 *
 * OpenCode (harness/opencode/) is the single source of truth. This script
 * converts agents and commands into pi-compatible files (frontmatter mapping)
 * and installs them into ~/.pi/agent/ (copies, not symlinks — frontmatter
 * differs between harnesses).
 *
 * Usage:
 *   node scripts/sync-harness.mjs --target pi                 # install to ~/.pi/agent
 *   node scripts/sync-harness.mjs --target pi --dest <dir>    # dry-run into a directory
 *
 * Mapping (opencode -> pi):
 *   agents:    permission read/glob/grep/list/edit/bash -> tools read/find/grep/ls/edit/bash
 *              (edit:allow also grants write; edit:deny excludes edit and write)
 *   commands:  description -> description; agent/subtask dropped (pi prompts
 *              are templates; delegation is stated in the template body)
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join, basename } from "node:path"
import { homedir } from "node:os"

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const args = process.argv.slice(2)
const targetIdx = args.indexOf("--target")
const target = targetIdx >= 0 ? args[targetIdx + 1] : "pi"
const destIdx = args.indexOf("--dest")
const dest = destIdx >= 0 ? args[destIdx + 1] : join(homedir(), ".pi", "agent")

if (target !== "pi") {
  console.error(`Unknown target "${target}" (supported: pi)`)
  process.exit(1)
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

const src = join(root, "harness", "opencode")
const agentsDir = join(dest, "agents")
const promptsDir = join(dest, "prompts")
mkdirSync(agentsDir, { recursive: true })
mkdirSync(promptsDir, { recursive: true })

let n = 0
for (const f of readdirSync(join(src, "agents")).filter((f) => f.endsWith(".md"))) {
  const out = convertAgent(readFileSync(join(src, "agents", f), "utf8"), f)
  writeFileSync(join(agentsDir, f), out)
  console.log(`agent   ${f}`)
  n++
}
for (const f of readdirSync(join(src, "commands")).filter((f) => f.endsWith(".md"))) {
  const out = convertCommand(readFileSync(join(src, "commands", f), "utf8"))
  writeFileSync(join(promptsDir, f), out)
  console.log(`command ${f} -> prompts/${f}`)
  n++
}

console.log(`\n✅ ${n} files installed to ${dest}`)
console.log("⚠ AGENTS.md is not merged automatically: review harness/opencode/AGENTS.md into your ~/.pi/agent/AGENTS.md manually.")
console.log("⚠ Model routing: pi resolves models via ~/.pi/agent/subagents.json (model_profiles); no model pins are written.")
