import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { parseYaml } from "./yaml-lite.mjs"

export const CAPABILITIES = Object.freeze(["read", "bash", "edit", "web", "mcp"])
export const ROLES = Object.freeze(["writer", "read-only"])
export const MODES = Object.freeze(["primary", "subagent", "all"])

const REQUIRED_AGENT_FIELDS = ["id", "description", "role", "mode", "capabilities"]
const REQUIRED_WORKFLOW_FIELDS = ["id", "description", "entry", "stages"]
const REQUIRED_COMMAND_FIELDS = ["id", "description", "agent"]
const AGENT_COMMAND_INVOKE = {
  specifier: "Specify this work:",
  researcher: "Research this:",
  reviewer: "Review this:",
  designer: "Design this:",
  developer: "Implement this approved task:",
  "technical-writer": "Document this:",
  publisher: "Deliver this:",
  lead: "Coordinate this:",
}

export function loadCatalog(root) {
  const agents = loadAgents(join(root, "agents"))
  const workflows = loadNamed(join(root, "workflows"), loadWorkflow)
  const commands = loadNamed(join(root, "commands"), loadCommand)
  validateCatalog({ agents, workflows, commands })
  return { root, agents, workflows, commands }
}

function loadAgents(dir) {
  const files = readdirSync(dir).filter((name) => name.endsWith(".yaml")).sort()
  const agents = new Map()
  for (const file of files) {
    const spec = parseYaml(readFileSync(join(dir, file), "utf8"))
    assertFields(spec, REQUIRED_AGENT_FIELDS, file)
    if (spec.id !== file.replace(/\.yaml$/, "")) {
      throw new Error(`${file}: id "${spec.id}" must match filename`)
    }
    if (!ROLES.includes(spec.role)) throw new Error(`${file}: invalid role`)
    if (!MODES.includes(spec.mode)) throw new Error(`${file}: invalid mode`)
    if (!Array.isArray(spec.capabilities) || spec.capabilities.length === 0) {
      throw new Error(`${file}: capabilities must be a non-empty list`)
    }
    for (const cap of spec.capabilities) {
      if (!CAPABILITIES.includes(cap)) throw new Error(`${file}: unknown capability "${cap}"`)
    }
    if (spec.role === "read-only" && spec.capabilities.includes("edit")) {
      throw new Error(`${file}: read-only agents cannot declare edit`)
    }
    const promptFile = join(dir, `${spec.id}.md`)
    spec.prompt = readFileSync(promptFile, "utf8").trim() + "\n"
    spec.delegates = spec.delegates ?? []
    spec.harness = spec.harness ?? {}
    spec.harness.pi = spec.harness.pi ?? {}
    spec.harness.opencode = spec.harness.opencode ?? {}
    agents.set(spec.id, spec)
  }
  return agents
}

function loadNamed(dir, loadOne) {
  const files = readdirSync(dir).filter((name) => name.endsWith(".yaml")).sort()
  const items = new Map()
  for (const file of files) {
    const spec = loadOne(parseYaml(readFileSync(join(dir, file), "utf8")), file)
    items.set(spec.id, spec)
  }
  return items
}

function loadWorkflow(spec, file) {
  assertFields(spec, REQUIRED_WORKFLOW_FIELDS, file)
  if (spec.id !== file.replace(/\.yaml$/, "")) {
    throw new Error(`${file}: id must match filename`)
  }
  if (!Array.isArray(spec.stages) || spec.stages.length === 0) {
    throw new Error(`${file}: stages must be a non-empty list`)
  }
  spec.stages = spec.stages.map((stage, index) => {
    if (!stage.id || !stage.agent) {
      throw new Error(`${file}: stage ${index} needs id and agent`)
    }
    return { ...stage, required: stage.required !== false }
  })
  return spec
}

function loadCommand(spec, file) {
  assertFields(spec, REQUIRED_COMMAND_FIELDS, file)
  if (spec.id !== file.replace(/\.yaml$/, "")) {
    throw new Error(`${file}: id must match filename`)
  }
  spec.argument_hint = spec.argument_hint ?? "<objective>"
  spec.subtask = spec.subtask === true
  spec.invoke = spec.invoke ?? AGENT_COMMAND_INVOKE[spec.agent] ?? `Do this as \`${spec.agent}\`:`
  return spec
}

function validateCatalog({ agents, workflows, commands }) {
  if (!agents.has("lead")) throw new Error("catalog: missing lead agent")
  for (const workflow of workflows.values()) {
    if (!agents.has(workflow.entry)) {
      throw new Error(`workflow ${workflow.id}: unknown entry agent ${workflow.entry}`)
    }
    for (const stage of workflow.stages) {
      if (!agents.has(stage.agent)) {
        throw new Error(`workflow ${workflow.id}: unknown stage agent ${stage.agent}`)
      }
    }
  }
  for (const command of commands.values()) {
    if (command.workflow && !workflows.has(command.workflow)) {
      throw new Error(`command ${command.id}: unknown workflow ${command.workflow}`)
    }
    if (!agents.has(command.agent)) {
      throw new Error(`command ${command.id}: unknown agent ${command.agent}`)
    }
  }
}

function assertFields(spec, fields, file) {
  for (const field of fields) {
    if (spec[field] === undefined || spec[field] === null || spec[field] === "") {
      throw new Error(`${file}: missing ${field}`)
    }
  }
}

export function workflowAgents(catalog) {
  const names = new Set()
  for (const workflow of catalog.workflows.values()) {
    names.add(workflow.entry)
    for (const stage of workflow.stages) names.add(stage.agent)
  }
  const lead = catalog.agents.get("lead")
  for (const name of lead?.delegates ?? []) names.add(name)
  return [...names]
}

export function renderAgentCommandPrompt(command, argumentToken) {
  return [
    `Delegate this work to \`${command.agent}\`. Do not do that agent's job yourself unless you are \`${command.agent}\`.`,
    "",
    command.invoke,
    "",
    argumentToken,
    "",
    "Wait for the full result when this runs as a subagent. Then synthesize the outcome and the next step.",
    "",
  ].join("\n")
}

export function renderWorkflowPrompt(workflow) {
  const lines = [
    `## Workflow: ${workflow.id}`,
    "",
    workflow.description,
    "",
    `Entry agent: \`${workflow.entry}\`. Delegate each required stage in order. Do not skip a required stage. Do not implement a stage yourself.`,
    "",
    "Stages:",
  ]
  workflow.stages.forEach((stage, index) => {
    const flag = stage.required ? "required" : "optional"
    lines.push(`${index + 1}. \`${stage.agent}\` (${flag}) — ${stage.id}`)
  })
  lines.push("")
  return lines.join("\n")
}
