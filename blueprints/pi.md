---
tool: Pi coding agent
capabilities: [Agents, Prompts, Skills]
mode: Setup
---

# Pi Blueprint

How this repository talks to a Pi install (`~/.pi/agent/`). It documents the
catalog adapter and the files this repo **never** writes. It does **not**
vendor Pi's live config.

The portable development agents live in [`catalog/`](../catalog/README.md).
`make render-catalog` writes Pi Markdown under `generated/pi/`. Copy those
files into `~/.pi/agent/{agents,prompts}/` only after a preview. Same
filenames as Pi's current agents (`developer`, `researcher`, …) are
conflicts.

## Quick path

1. Preview the catalog:

   ```bash
   make test-catalog
   node scripts/render-catalog.mjs --target pi --dest /tmp/pi-catalog-preview
   ```

2. Compare that preview with `~/.pi/agent/{agents,prompts}/`. Do not copy
   over live files until the diff is acceptable.

3. Skills are a separate consumer step (`make install-skills` +
   `npx skills add didacrios/ai-coding-protocols`). Pi discovers `SKILL.md`
   from its own skills path (`~/.pi/agent/skills/` and/or `~/.agents/skills/`).
   This blueprint does not install them.

## What this repo writes

| Component | Source | Destination | Notes |
|-----------|--------|-------------|-------|
| Catalog agents | `catalog/agents/` via adapter | `generated/pi/agents/` (preview) | Copy to `~/.pi/agent/agents/` only after diff. |
| Catalog prompts | `catalog/commands/` via adapter | `generated/pi/prompts/` (preview) | `/lite` `/full` plus per-agent aliases. |
| Own skills | `skills/` | via `npx skills add` | Not copied by render. |
| Third-party skills | `skills.json` | via `make install-skills` | Declared, never committed. |

## What stays only on the machine

These live under `~/.pi/agent/` with **no counterpart in this repository**.
Rendering the catalog does not generate, merge, or overwrite them.

| File | Role |
|------|------|
| `subagents.json` | `model_profiles` — Pi routes each agent name to a model. The catalog writes **no** model pins. Names without a profile fall back to the parent model until you add one. |
| `models.json` | Provider registry. |
| `extensions/` | Local provider and tool extensions. |
| `settings.json` | Default model, provider, theme, packages. |
| `AGENTS.md` | Pi system prompt. Reconcile by hand if you want catalog contracts in the parent prompt. |
| `auth.json` | Secrets. Never copy into the repo. |

Keeping them out of the repo is deliberate: they are machine- and
persona-specific.

## Safety

Catalog render never writes `$HOME` unless `--dest` points there. Diff
before replacing a live agent: a generated `researcher.md` may not carry
every extra tool a live file already has (`web_search`, `mcp`, …).

## Not included (intentionally)

- Pi `subagents.json`, `models.json`, `extensions/`, `settings.json`, `AGENTS.md`
- Skills materialisation (`make install-skills`) — consumer step, not repo prep

## Checklist

- [ ] Previewed with `--dest` and compared filenames against `~/.pi/agent/agents/`
- [ ] Diffed extra tools and `inheritProjectContext` on agents you will replace
- [ ] Added `model_profiles` for any new agent names you will invoke
- [ ] Reconciled `AGENTS.md` by hand if catalog contracts should apply in Pi

## Next step

OpenCode overlay, env template, and skill manifest: [`opencode.md`](opencode.md).
Vendoring skills into a project: `make ai <path>`.
Attribution: [`NOTICE`](../NOTICE).
