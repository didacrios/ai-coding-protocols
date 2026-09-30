import { dumpYaml, parseYaml } from "./yaml-lite.mjs"
import {
  lensAgentIds,
  renderReviewLensBlock,
  renderWorkflowPrompt,
  workflowAgents,
} from "./catalog.mjs"

export function adaptOpencodeAgent(spec, catalog) {
  const permissions = opencodePermissions(spec, catalog)
  const frontmatter = {
    description: spec.description,
    mode: spec.mode,
    permissions,
  }
  return `---\n${dumpYaml(frontmatter)}\n---\n\n${spec.prompt}`
}

export function adaptOpencodeCommand(command, workflow, catalog) {
  const frontmatter = {
    description: command.description,
    agent: command.agent,
  }
  if (command.subtask) frontmatter.subtask = true
  if (workflow) {
    const body = [
      "Objective:",
      "",
      "$ARGUMENTS",
      "",
      renderWorkflowPrompt(workflow),
      "",
      "Follow the workflow. After the last required stage, synthesize the outcome and the next step.",
      "",
    ].join("\n")
    return `---\n${dumpYaml(frontmatter)}\n---\n\n${body}`
  }
  const extra = command.id === "review" ? renderReviewLensBlock(catalog?.lenses) : ""
  const body = [command.invoke, "", "$ARGUMENTS", "", extra].join("\n")
  return `---\n${dumpYaml(frontmatter)}\n---\n\n${body}`
}

export function opencodePermissions(spec, catalog) {
  const oc = spec.harness.opencode
  const rules = []
  rules.push({ action: "external_directory", resource: "*", effect: "deny" })

  if (spec.capabilities.includes("read")) {
    for (const action of ["read", "glob", "grep"]) {
      rules.push({ action, resource: "*", effect: "allow" })
    }
  }

  if (spec.capabilities.includes("edit")) {
    const globs = oc.edit_allow
    if (Array.isArray(globs) && globs.length > 0) {
      rules.push({ action: "edit", resource: "*", effect: "deny" })
      for (const resource of globs) {
        rules.push({ action: "edit", resource, effect: "allow" })
      }
    } else {
      rules.push({ action: "edit", resource: "*", effect: "allow" })
    }
  } else {
    rules.push({ action: "edit", resource: "*", effect: "deny" })
  }

  if (spec.capabilities.includes("bash")) {
    const shellDefault = oc.shell_default ?? "ask"
    rules.push({ action: "shell", resource: "*", effect: shellDefault })
    for (const resource of oc.shell_allow ?? defaultShellAllow(spec)) {
      rules.push({ action: "shell", resource, effect: "allow" })
    }
    for (const resource of oc.shell_deny ?? []) {
      rules.push({ action: "shell", resource, effect: "deny" })
    }
  }

  if (spec.capabilities.includes("web")) {
    const webEffect = oc.web_effect ?? "allow"
    rules.push({ action: "webfetch", resource: "*", effect: webEffect })
    rules.push({ action: "websearch", resource: "*", effect: webEffect })
  }

  if (spec.id === "lead" && catalog) {
    rules.push({ action: "subagent", resource: "*", effect: "deny" })
    const allow = new Set([...(spec.delegates ?? []), ...workflowAgents(catalog)])
    allow.delete("lead")
    for (const agent of [...allow].sort()) {
      rules.push({ action: "subagent", resource: agent, effect: "allow" })
    }
  }

  if (spec.id === "review_coordinator" && catalog) {
    rules.push({ action: "subagent", resource: "*", effect: "deny" })
    for (const agent of lensAgentIds(catalog).sort()) {
      rules.push({ action: "subagent", resource: agent, effect: "allow" })
    }
  } else if (spec.id.startsWith("review_")) {
    rules.push({ action: "subagent", resource: "*", effect: "deny" })
  }

  for (const extra of oc.permissions_extra ?? []) rules.push(extra)
  return rules
}

function defaultShellAllow(spec) {
  const gitRead = ["git status*", "git diff*", "git log*"]
  if (spec.id === "developer") {
    return [
      ...gitRead,
      "npm test*",
      "pnpm test*",
      "bun test*",
      "npm run test*",
      "pnpm run test*",
      "npm run lint*",
      "pnpm run lint*",
      "npm run typecheck*",
      "pnpm run typecheck*",
      "node --test*",
    ]
  }
  if (spec.id === "reviewer" || spec.id === "review_tests") {
    return [
      ...gitRead,
      "npm test*",
      "pnpm test*",
      "npm run test*",
      "pnpm run test*",
      "npm run lint*",
      "pnpm run lint*",
      "npm run typecheck*",
      "pnpm run typecheck*",
      "node --test*",
    ]
  }
  return gitRead
}

export function parseOpencodeFrontmatter(text) {
  const m = /^---\n([\s\S]*?)\n---/.exec(text)
  if (!m) return {}
  return parseYaml(m[1])
}
