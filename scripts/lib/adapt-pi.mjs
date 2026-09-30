import { renderAgentCommandPrompt, renderWorkflowPrompt } from "./catalog.mjs"

const PI_TOOLS = {
  read: ["read", "grep", "find", "ls"],
  bash: ["bash"],
  edit: ["edit", "write"],
  web: ["web_search", "fetch_content", "nan_web_search"],
  mcp: ["mcp"],
}

export function adaptPiAgent(spec) {
  const tools = []
  for (const cap of spec.capabilities) tools.push(...(PI_TOOLS[cap] ?? []))
  const extra = spec.harness.pi.extra_tools ?? []
  for (const tool of extra) {
    if (!tools.includes(tool)) tools.push(tool)
  }
  const inheritProjectContext = spec.harness.pi.inheritProjectContext !== false
  const inheritSkills = spec.harness.pi.inheritSkills === true
  const acceptanceRole = spec.harness.pi.acceptanceRole ?? spec.role
  const fm = [
    "---",
    `name: ${spec.id}`,
    `description: ${spec.description}`,
    `tools: ${tools.join(", ")}`,
    "systemPromptMode: replace",
    `inheritProjectContext: ${inheritProjectContext}`,
    `inheritSkills: ${inheritSkills}`,
    `acceptanceRole: ${acceptanceRole}`,
    "---",
    "",
  ]
  return `${fm.join("\n")}\n${spec.prompt}`
}

export function adaptPiCommand(command, workflow) {
  const fm = [
    "---",
    `description: ${command.description}`,
    `argument-hint: ${command.argument_hint}`,
    "---",
    "",
  ]
  if (workflow) {
    fm.push(
      "Objective:",
      "",
      "$@",
      "",
      renderWorkflowPrompt(workflow),
      "",
      "Follow the workflow. After the last required stage, synthesize the outcome and the next step.",
      "",
    )
    return fm.join("\n")
  }
  fm.push(renderAgentCommandPrompt(command, "$@"))
  return fm.join("\n")
}

export function dumpPiFrontmatter(text) {
  const m = /^---\n([\s\S]*?)\n---/.exec(text)
  return m ? parseSimpleFrontmatter(m[1]) : {}
}

function parseSimpleFrontmatter(raw) {
  const fm = {}
  for (const line of raw.split("\n")) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line)
    if (kv) fm[kv[1]] = kv[2]
  }
  return fm
}
