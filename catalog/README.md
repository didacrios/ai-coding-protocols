# Catalog

Harness-agnostic source of truth for agents, workflows, and commands.

Adapters turn these YAML files into Pi or OpenCode v2 Markdown. Edit the catalog, not the generated files.

## Quick path

1. Change an agent, workflow, or command under `catalog/`.
2. Run `make test-catalog`.
3. Preview with `make render-catalog` (writes `generated/`, gitignored).
4. Copy from `generated/` into a harness only when you mean to install.

## Layout

| Path | What it holds |
|------|----------------|
| `catalog/agents/*.yaml` | Role, capabilities, harness overlays |
| `catalog/agents/*.md` | Shared prompt body |
| `catalog/workflows/*.yaml` | Ordered stages and required agents |
| `catalog/commands/*.yaml` | Slash-command alias: a workflow or a single agent |

## Adapters

| Target | Output | Frontmatter |
|--------|--------|-------------|
| Pi | `agents/*.md`, `prompts/*.md` | `name`, `tools`, `systemPromptMode`, `inheritProjectContext` |
| OpenCode v2 | `agents/*.md`, `commands/*.md` | `mode`, `permissions` list (`action` / `resource` / `effect`) |

Neither adapter pins a model. Live `~/.pi` and `~/.config/opencode` are never the default destination.

## Agents

`lead` orchestrates. `specifier` is the planner. The other six match the development roster: `developer`, `researcher`, `reviewer`, `designer`, `technical-writer`, `publisher`.

## Workflows

| Workflow | Stages |
|----------|--------|
| `lite-development` | lead → specifier → developer |
| `full-development` | lead → designer (optional) → researcher → specifier → developer → reviewer → technical-writer → publisher |

## Commands

| Slash | Binds to | Kind |
|-------|----------|------|
| `/lite` | `lite-development` via `lead` | workflow |
| `/full` | `full-development` via `lead` | workflow |
| `/plan` | `specifier` | agent |
| `/research` | `researcher` | agent |
| `/review` | `reviewer` | agent |
| `/design` | `designer` | agent |
| `/implement` | `developer` | agent |
| `/docs` | `technical-writer` | agent |
| `/publish` | `publisher` | agent |

Workflow ids stay descriptive. Slash names stay short.

## Checklist

- [ ] Catalog tests pass
- [ ] Rendered preview reviewed
- [ ] No live install unless that is the explicit next step

## Attribution

Agent roles and several operational contracts were adapted from
[opencode-agent-orchestration-kit](https://github.com/jcarlosrodicio/opencode-agent-orchestration-kit)
(Apache-2.0). See [`NOTICE`](../NOTICE).
