import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, existsSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { execFileSync } from "node:child_process"
import test from "node:test"
import assert from "node:assert/strict"
import {
  assertSafeRepoPath,
  parseArgs,
  prepareReviewWorkspace,
  riskFlagsForFile,
  shouldFilterPatch,
} from "./review-preflight.mjs"

function initRepo() {
  const dir = mkdtempSync(join(tmpdir(), "preflight-"))
  execFileSync("git", ["init"], { cwd: dir })
  execFileSync("git", ["config", "user.email", "preflight@test.local"], { cwd: dir })
  execFileSync("git", ["config", "user.name", "Preflight"], { cwd: dir })
  writeFileSync(join(dir, "app.ts"), "export const n = 1\n")
  execFileSync("git", ["add", "."], { cwd: dir })
  execFileSync("git", ["commit", "-m", "init"], { cwd: dir })
  return dir
}

test("parseArgs keeps retain by default and ignores leftover words", () => {
  const options = parseArgs(["--base", "HEAD", "please", "review"])
  assert.equal(options.base, "HEAD")
  assert.equal(options.retain, true)
  assert.equal(options.agents, false)
})

test("parseArgs rejects unknown flags", () => {
  assert.throws(() => parseArgs(["--unknown"]), /Unknown argument/)
})

test("unsafe repo paths are rejected", () => {
  assert.throws(() => assertSafeRepoPath("../secret"), /unsafe_review_path/)
  assert.throws(() => assertSafeRepoPath("/etc/passwd"), /unsafe_review_path/)
  assert.equal(assertSafeRepoPath("src/app.ts"), "src/app.ts")
})

test("risk flags map files onto lenses", () => {
  assert.ok(riskFlagsForFile("src/auth/session.ts").includes("security"))
  assert.ok(riskFlagsForFile("src/foo.test.ts").includes("tests"))
  assert.ok(riskFlagsForFile("src/api/routes.ts").includes("api"))
  assert.equal(shouldFilterPatch("package-lock.json"), true)
  assert.equal(shouldFilterPatch("src/app.ts"), false)
})

test("preflight on a code diff recommends quality and writes wrapped patches", () => {
  const dir = initRepo()
  try {
    writeFileSync(join(dir, "app.ts"), "export const n = 2\n")
    const workspace = join(dir, ".review-preflight", "run-test")
    const manifest = prepareReviewWorkspace({
      base: "HEAD",
      staged: false,
      includeUntracked: false,
      retain: true,
      workspace,
      cwd: dir,
      agents: false,
      fullAgents: false,
    })
    assert.equal(manifest.verdict, "not_run")
    assert.equal(manifest.execution.review_stage, "preflight")
    assert.deepEqual(manifest.recommended_lenses, ["quality"])
    assert.deepEqual(manifest.recommended_agents, ["review_quality"])
    assert.equal(manifest.execution.planned_agents.length, 0)
    assert.ok(manifest.patches.length > 0)
    const patch = readFileSync(join(workspace, manifest.patches[0].path), "utf8")
    assert.match(patch, /BEGIN_UNTRUSTED_PATCH_DATA/)
    assert.match(patch, /END_UNTRUSTED_PATCH_DATA/)
    assert.ok(existsSync(join(workspace, "manifest.json")))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test("docs-only and lockfile diffs skip specialists", () => {
  const dir = initRepo()
  try {
    writeFileSync(join(dir, "NOTES.md"), "notes\n")
    writeFileSync(join(dir, "package-lock.json"), "{}\n")
    const manifest = prepareReviewWorkspace({
      base: "HEAD",
      staged: false,
      includeUntracked: true,
      retain: true,
      workspace: join(dir, ".review-preflight", "docs"),
      cwd: dir,
      agents: false,
      fullAgents: false,
    })
    assert.deepEqual(manifest.recommended_lenses, [])
    assert.equal(manifest.classification, "skipped")
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test("--full-agents plans every recommended specialist and keeps verdict not_run", () => {
  const dir = initRepo()
  try {
    mkdirSync(join(dir, "src", "api"), { recursive: true })
    writeFileSync(join(dir, "src", "api", "routes.ts"), "export {}\n")
    writeFileSync(join(dir, "src", "foo.test.ts"), "export {}\n")
    const manifest = prepareReviewWorkspace({
      base: "HEAD",
      staged: false,
      includeUntracked: true,
      retain: true,
      workspace: join(dir, ".review-preflight", "full"),
      cwd: dir,
      agents: false,
      fullAgents: true,
    })
    assert.equal(manifest.execution.mode, "full-agents")
    assert.equal(manifest.execution.verdict, "not_run")
    assert.ok(manifest.recommended_agents.includes("review_quality"))
    assert.ok(manifest.recommended_agents.includes("review_tests"))
    assert.ok(manifest.recommended_agents.includes("review_api"))
    assert.deepEqual(manifest.execution.planned_agents, manifest.recommended_agents)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
