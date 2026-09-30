import { mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import test from "node:test"
import assert from "node:assert/strict"
import { parseYaml, dumpYaml } from "./lib/yaml-lite.mjs"
import { loadCatalog, renderWorkflowPrompt } from "./lib/catalog.mjs"
import { adaptPiAgent, adaptPiCommand, dumpPiFrontmatter } from "./lib/adapt-pi.mjs"
import {
  adaptOpencodeAgent,
  adaptOpencodeCommand,
  parseOpencodeFrontmatter,
} from "./lib/adapt-opencode.mjs"

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..")
const catalogDir = join(repoRoot, "catalog")

test("yaml-lite parses maps, lists, and list-of-maps", () => {
  const doc = parseYaml(`
id: sample
flags:
  - read
  - bash
stages:
  - id: plan
    agent: specifier
    required: true
  - id: implement
    agent: developer
quoted: "a: b"
`)
  assert.equal(doc.id, "sample")
  assert.deepEqual(doc.flags, ["read", "bash"])
  assert.equal(doc.stages[0].agent, "specifier")
  assert.equal(doc.stages[0].required, true)
  assert.equal(doc.stages[1].id, "implement")
  assert.equal(doc.quoted, "a: b")
})

test("yaml-lite dump round-trips permission rules", () => {
  const rules = [
    { action: "edit", resource: "*", effect: "deny" },
    { action: "shell", resource: "git status*", effect: "allow" },
  ]
  const parsed = parseYaml(dumpYaml({ permissions: rules }))
  assert.deepEqual(parsed.permissions, rules)
})

test("catalog loads eight agents and two workflows", () => {
  const catalog = loadCatalog(catalogDir)
  assert.deepEqual(
    [...catalog.agents.keys()].sort(),
    [
      "designer",
      "developer",
      "lead",
      "publisher",
      "researcher",
      "reviewer",
      "specifier",
      "technical-writer",
    ],
  )
  assert.ok(catalog.workflows.has("lite-development"))
  assert.ok(catalog.workflows.has("full-development"))
  assert.equal(catalog.commands.get("lite").agent, "lead")
  assert.equal(catalog.commands.get("full").workflow, "full-development")
})

test("specifier is the planner; lite workflow is plan then implement", () => {
  const catalog = loadCatalog(catalogDir)
  const lite = catalog.workflows.get("lite-development")
  assert.equal(lite.entry, "lead")
  assert.deepEqual(
    lite.stages.map((s) => s.agent),
    ["specifier", "developer"],
  )
  assert.match(catalog.agents.get("specifier").description, /Planner/i)
})

test("full workflow keeps designer optional and publisher last", () => {
  const catalog = loadCatalog(catalogDir)
  const full = catalog.workflows.get("full-development")
  const design = full.stages.find((s) => s.id === "design")
  assert.equal(design.required, false)
  assert.equal(full.stages.at(-1).agent, "publisher")
  assert.deepEqual(
    full.stages.filter((s) => s.required).map((s) => s.agent),
    ["researcher", "specifier", "developer", "reviewer", "technical-writer", "publisher"],
  )
})

test("pi developer frontmatter maps capabilities and pins no model", () => {
  const catalog = loadCatalog(catalogDir)
  const md = adaptPiAgent(catalog.agents.get("developer"))
  const fm = dumpPiFrontmatter(md)
  assert.equal(fm.name, "developer")
  assert.match(fm.tools, /edit/)
  assert.match(fm.tools, /write/)
  assert.match(fm.tools, /bash/)
  assert.equal(fm.systemPromptMode, "replace")
  assert.equal(fm.inheritProjectContext, "true")
  assert.equal(fm.acceptanceRole, "writer")
  assert.equal(fm.model, undefined)
})

test("pi researcher gets web tools; reviewer has no edit", () => {
  const catalog = loadCatalog(catalogDir)
  const researcher = dumpPiFrontmatter(adaptPiAgent(catalog.agents.get("researcher")))
  const reviewer = dumpPiFrontmatter(adaptPiAgent(catalog.agents.get("reviewer")))
  assert.match(researcher.tools, /web_search/)
  assert.match(researcher.tools, /nan_web_search/)
  assert.doesNotMatch(reviewer.tools, /\bedit\b/)
  assert.doesNotMatch(reviewer.tools, /\bwrite\b/)
})

test("opencode v2 adapter emits permissions lists, not v1 permission maps", () => {
  const catalog = loadCatalog(catalogDir)
  const md = adaptOpencodeAgent(catalog.agents.get("reviewer"), catalog)
  const fm = parseOpencodeFrontmatter(md)
  assert.equal(fm.mode, "subagent")
  assert.ok(Array.isArray(fm.permissions))
  assert.equal(
    fm.permissions.find((p) => p.action === "edit").effect,
    "deny",
  )
  assert.doesNotMatch(md, /^permission:/m)
  assert.equal(fm.model, undefined)
})

test("opencode lead allows workflow subagents and denies the rest", () => {
  const catalog = loadCatalog(catalogDir)
  const fm = parseOpencodeFrontmatter(adaptOpencodeAgent(catalog.agents.get("lead"), catalog))
  assert.equal(fm.mode, "all")
  const sub = fm.permissions.filter((p) => p.action === "subagent")
  assert.equal(sub.find((p) => p.resource === "*").effect, "deny")
  for (const agent of ["specifier", "developer", "researcher", "publisher"]) {
    assert.equal(sub.find((p) => p.resource === agent).effect, "allow")
  }
})

test("opencode specifier edit is glob-limited to docs", () => {
  const catalog = loadCatalog(catalogDir)
  const fm = parseOpencodeFrontmatter(adaptOpencodeAgent(catalog.agents.get("specifier"), catalog))
  const edits = fm.permissions.filter((p) => p.action === "edit")
  assert.equal(edits[0].effect, "deny")
  assert.ok(edits.some((p) => p.resource === "**/*.md" && p.effect === "allow"))
})

test("slash commands are short aliases plus per-agent entries", () => {
  const catalog = loadCatalog(catalogDir)
  assert.deepEqual(
    [...catalog.commands.keys()].sort(),
    ["design", "docs", "full", "implement", "lite", "plan", "publish", "research", "review"],
  )
  assert.equal(catalog.commands.get("lite").workflow, "lite-development")
  assert.equal(catalog.commands.get("full").workflow, "full-development")
  assert.equal(catalog.commands.get("plan").agent, "specifier")
  assert.equal(catalog.commands.get("plan").workflow, undefined)
  assert.equal(catalog.commands.get("review").agent, "reviewer")
  assert.equal(catalog.commands.get("research").agent, "researcher")
})

test("commands bind workflows to lead for both harnesses", () => {
  const catalog = loadCatalog(catalogDir)
  const workflow = catalog.workflows.get("lite-development")
  const command = catalog.commands.get("lite")
  const pi = adaptPiCommand(command, workflow)
  const oc = adaptOpencodeCommand(command, workflow)
  assert.match(pi, /argument-hint: <objective>/)
  assert.match(pi, /`specifier` \(required\)/)
  assert.match(oc, /^agent: lead$/m)
  assert.match(oc, /\$ARGUMENTS/)
  assert.match(renderWorkflowPrompt(workflow), /Workflow: lite-development/)
})

test("agent commands render without a workflow block", () => {
  const catalog = loadCatalog(catalogDir)
  const research = catalog.commands.get("research")
  const pi = adaptPiCommand(research)
  const oc = adaptOpencodeCommand(research)
  assert.match(pi, /`researcher`/)
  assert.doesNotMatch(pi, /Workflow:/)
  assert.match(oc, /^agent: researcher$/m)
  assert.match(oc, /subtask: true/)
  assert.doesNotMatch(oc, /Workflow:/)
})

test("lead prompt emits a routing decision and dependency rules", () => {
  const prompt = loadCatalog(catalogDir).agents.get("lead").prompt
  assert.match(prompt, /route:/)
  assert.match(prompt, /Never invoke `developer` before/)
  assert.match(prompt, /git status/)
})

test("publisher prompt keeps commit and safety contracts", () => {
  const prompt = loadCatalog(catalogDir).agents.get("publisher").prompt
  assert.match(prompt, /--no-verify/)
  assert.match(prompt, /Conventional Commits/)
  assert.match(prompt, /force-push/)
  assert.match(prompt, /git add -A/)
})

test("researcher prompt includes a delimited spec packet", () => {
  const prompt = loadCatalog(catalogDir).agents.get("researcher").prompt
  assert.match(prompt, /BEGIN_SPEC_INPUT/)
  assert.match(prompt, /END_SPEC_INPUT/)
})

test("reviewer prompt requires causality and a blocked verdict", () => {
  const prompt = loadCatalog(catalogDir).agents.get("reviewer").prompt
  assert.match(prompt, /introduced/)
  assert.match(prompt, /\bblocked\b/)
  assert.match(prompt, /Performance/)
})

test("reviewer prompt requires coverage, pinned candidate, and fact-check", () => {
  const prompt = loadCatalog(catalogDir).agents.get("reviewer").prompt
  assert.match(prompt, /coverage: files_in_change=/)
  assert.match(prompt, /diff_base/)
  assert.match(prompt, /file:line/)
  assert.match(prompt, /Assumptions/)
  assert.match(prompt, /Authorization/)
  assert.match(prompt, /Spec drift/)
  assert.match(prompt, /The construct it names does not exist/)
  assert.match(prompt, /A line of the diff literally contradicts it/)
  assert.match(prompt, /developer summary/)
})

test("lead handoff pins diff_base and never substitutes for reviewer", () => {
  const prompt = loadCatalog(catalogDir).agents.get("lead").prompt
  assert.match(prompt, /diff_base/)
  assert.match(prompt, /Do not review a diff you or `developer` produced/)
})

test("review command pins the git diff candidate", () => {
  const catalog = loadCatalog(catalogDir)
  const command = catalog.commands.get("review")
  assert.match(command.invoke, /pinned/)
  assert.match(command.invoke, /diff_base/)
  assert.match(command.invoke, /git diff/)
})

test("catalog loads four review lenses; reviewer stays the only final verdict", () => {
  const catalog = loadCatalog(catalogDir)
  assert.equal(catalog.lenses.final_verdict, "reviewer")
  assert.deepEqual(
    catalog.lenses.items.map((lens) => lens.id),
    ["quality", "security", "tests", "api"],
  )
  assert.equal(catalog.agents.size, 8)
})

test("reviewer prompt requires optional focus lenses without a partial verdict", () => {
  const prompt = loadCatalog(catalogDir).agents.get("reviewer").prompt
  assert.match(prompt, /## Focus/)
  assert.match(prompt, /quality/)
  assert.match(prompt, /security/)
  assert.match(prompt, /tests/)
  assert.match(prompt, /api/)
  assert.match(prompt, /Do not emit a partial verdict/)
})

test("review command argument hint names the four lenses", () => {
  const hint = loadCatalog(catalogDir).commands.get("review").argument_hint
  assert.match(hint, /quality/)
  assert.match(hint, /security/)
  assert.match(hint, /tests/)
  assert.match(hint, /api/)
})

test("both adapters inject review lenses into the review command", () => {
  const catalog = loadCatalog(catalogDir)
  const command = catalog.commands.get("review")
  const pi = adaptPiCommand(command, undefined, catalog)
  const oc = adaptOpencodeCommand(command, undefined, catalog)
  for (const rendered of [pi, oc]) {
    assert.match(rendered, /quality/)
    assert.match(rendered, /security/)
    assert.match(rendered, /tests/)
    assert.match(rendered, /api/)
    assert.match(rendered, /final verdict/)
  }
})

test("render-catalog writes separate pi and opencode trees without touching HOME", () => {
  const dest = mkdtempSync(join(tmpdir(), "catalog-render-"))
  try {
    const script = join(repoRoot, "scripts", "render-catalog.mjs")
    execFileSync(process.execPath, [script, "--target", "all", "--dest", dest], {
      cwd: repoRoot,
    })
    const piLead = dumpPiFrontmatter(readFileSync(join(dest, "pi", "agents", "lead.md"), "utf8"))
    assert.equal(piLead.name, "lead")
    const oc = parseOpencodeFrontmatter(
      readFileSync(join(dest, "opencode", "agents", "developer.md"), "utf8"),
    )
    assert.ok(Array.isArray(oc.permissions))
  } finally {
    rmSync(dest, { recursive: true, force: true })
  }
})
