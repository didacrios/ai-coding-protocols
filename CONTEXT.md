# AI Coding Protocols

Harness-agnostic catalog of agents, workflows, and commands, plus skills
that any coding agent can load.

## Language

**Catalog**:
The YAML and Markdown source of truth for agents, workflows, and commands.
_Avoid_: kit payload, live config, generated Markdown as the original

**Adapter**:
A renderer that turns catalog files into one harness's native Markdown.
_Avoid_: kit converter, installer, overlay as the source of truth

**Agent**:
A named role with capabilities and a prompt body.
_Avoid_: persona, subagent (unless the harness mode is subagent)

**Workflow**:
An ordered list of stages, each requiring an agent. The entry agent is `lead`.
_Avoid_: pipeline, mission

**Command**:
A user-invoked slash alias. Either binds a workflow to `lead` (`/lite`, `/full`) or calls one agent (`/plan`, `/research`, `/review`, ...).
_Avoid_: skill, slash command as a synonym for skill

**Capability**:
An abstract tool grant (`read`, `bash`, `edit`, `web`, `mcp`) mapped by adapters.
_Avoid_: permission key copied from one harness

**Specifier**:
The planner. Writes specs, tasks, and acceptance criteria; does not implement.
_Avoid_: planner as a second agent name

**Lead**:
The orchestrator. Routes and synthesizes; does not implement.
_Avoid_: parent session, gentleman as the catalog entry agent

**Harness**:
A runtime that consumes adapter output (Pi, OpenCode v2).
_Avoid_: model, provider
