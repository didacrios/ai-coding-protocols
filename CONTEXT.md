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

**Reviewer**:
Read-only final review of a pinned git diff (`diff_base`). Lists every changed file as reviewed or skipped, attacks along nine dimensions, fact-checks findings, and returns a catalog verdict. Does not edit.
_Avoid_: emoji review skill, receipt, lineage, specialist reviewer as this role

**Coverage**:
The reviewer's file accounting: `coverage: files_in_change=<n> reviewed=<n> skipped=<n>`. A skip needs a concrete reason (generated file, lockfile).
_Avoid_: "looked minor", reviewing one file as covering its tests or counterpart

**Lens**:
An optional `/review` focus (`quality`, `security`, `tests`, `api`) declared in `catalog/lenses.yaml`. Adapters copy it into harness commands. It is not an agent and cannot emit a final verdict.
_Avoid_: specialist reviewer, review_quality, coordinator as catalog roster roles

**OpenCode review extra**:
Adapter-only files under `generated/opencode/`: `review_coordinator`, `review_<lens>` specialists, `/review-preflight`, `/review-partial`, and `scripts/review-preflight.mjs`. Specialists must emit `verdict: not_run`. Only catalog `reviewer` may emit a final verdict.
_Avoid_: adding those names to `catalog/agents`, treating preflight as approval

**Harness**:
A runtime that consumes adapter output (Pi, OpenCode v2).
_Avoid_: model, provider

**Own skill**:
A skill authored in this repository, one directory per skill under `skills/`.
Self-contained: its body never references a repository-internal path, so it is
installable on its own with the skills CLI.
_Avoid_: built-in skill, local skill, vendored skill (the last is a third-party dependency)

**Blueprint**:
Tool-specific wiring for a harness (`.cursor/rules/`, `CLAUDE.md`, OpenCode
overlay, Pi setup). It points at own skills; it is not itself a skill.
_Avoid_: adapter (an adapter renders the catalog, a blueprint wires up a tool)

**Template**:
The scaffold at `template/SKILL.template.md`, copied to author a new skill. Not
installable; the skills CLI must not treat it as a skill.
_Avoid_: skeleton skill, example skill

**Skills root**:
The directory holding installed skills: `.agents/skills/` (project scope) or
`~/.agents/skills/` (global). The skills CLI writes there, and vendoring targets
the same path, so there is one convention rather than one per install method.
_Avoid_: `.ai/skills/`, skill folder, per-tool skills directory

**Vendored tree**:
The copy `make vendor <path>` writes to `<path>/.agents/`, containing `skills/`,
`blueprints/`, and `template/`. A plain copy: no network, no CLI, and it does
not overwrite project-specific skills under `skills/project/`.
_Avoid_: `.ai/` (the pre-2026-10-13 name), install, overlay
