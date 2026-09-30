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
| `catalog/lenses.yaml` | Optional `/review` focus lenses; `reviewer` stays the only final verdict |

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

`/review` accepts an optional first token `quality`, `security`, `tests`, or `api` (see `catalog/lenses.yaml`). Default is all nine dimensions. Coverage and one catalog verdict still apply.

Workflow ids stay descriptive. Slash names stay short.

## Review surfaces

`/review` and the `review` stage in `/full` use the catalog `reviewer`: coverage of every changed file, a pinned `diff_base`, nine attack dimensions, and a fact-check. Optional focus lenses (`quality`, `security`, `tests`, `api`) narrow the attack; they do not create specialist agents and they do not emit a partial verdict. Adapters inject the lens list into the rendered `/review` command. An OpenCode-only prepare script plus specialist files can be a later adapter extra; it is not in this catalog roster.

Verdicts are `approved`, `approved with observations`, `requires changes`, or `blocked`. Only introduced or worsened issues block.

`skills/code-review` is a separate GitHub-comment protocol (emoji prefixes). It is not the catalog agent verdict. Do not mix the two in one pass.

## Checklist

- [ ] Catalog tests pass
- [ ] Rendered preview reviewed
- [ ] No live install unless that is the explicit next step

## Attribution

Agent roles and several operational contracts were adapted from
[opencode-agent-orchestration-kit](https://github.com/jcarlosrodicio/opencode-agent-orchestration-kit)
(Apache-2.0). See [`NOTICE`](../NOTICE).
