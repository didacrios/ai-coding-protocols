---
tool: Pi coding agent
capabilities: [Agents, Prompts, Skills]
mode: Setup
---

# Pi Blueprint

How this repository talks to a Pi install (`~/.pi/agent/`). It documents the
conversion, the files this repo **never** writes, and the overwrite traps.
It does **not** vendor Pi's live config.

The OpenCode harness (agents + commands) is owned by the
[OAK kit](https://github.com/jcarlosrodicio/opencode-agent-orchestration-kit).
`make install-pi` converts that kit payload into Pi's frontmatter dialect
and copies the result next to whatever Pi already has.

## Quick path

1. Install the OAK kit first (`make install-oak`, then `oak install` in
   `~/.config/opencode`). The converter reads the kit, not this repo's
   `skills/` tree.
2. **Preview, do not clobber.** Stage into a throwaway directory:

   ```bash
   node scripts/sync-harness.mjs --target pi --dest /tmp/pi-harness-preview
   ```

3. Compare that preview with `~/.pi/agent/{agents,prompts}/`. Same filenames
   as Pi's built-in agents (`developer`, `researcher`, `reviewer`, …) are
   conflicts. Default behaviour: leave the live file untouched.
4. Install for real only after that diff is acceptable:

   ```bash
   make install-pi
   # equivalent: node scripts/sync-harness.mjs --target pi
   ```

   Use `--prefix oak-` to install *alongside* existing names, or `--force`
   only when you intend to replace Pi's copies.

5. Skills are a separate consumer step (`make install-skills` +
   `npx skills add didacrios/ai-coding-protocols`). Pi discovers `SKILL.md`
   from its own skills path (`~/.pi/agent/skills/` and/or `~/.agents/skills/`).
   This blueprint does not install them.

## What this repo writes

| Component | Source | Destination | Notes |
|-----------|--------|-------------|-------|
| Converted agents | OAK kit `agents/*.md` | `~/.pi/agent/agents/` | Copies, not symlinks. Re-run after `oak upgrade`. |
| Converted commands | OAK kit `commands/*.md` | `~/.pi/agent/prompts/` | Pi prompt templates. `agent` / `subtask` frontmatter is dropped. |
| Own skills | `skills/` | via `npx skills add` | Not copied by `make install-pi`. |
| Third-party skills | `skills.json` | via `make install-skills` | Declared, never committed. |

`scripts/sync-harness.mjs` resolves the kit in this order: `--source` /
`OAK_SOURCE`, then the global npm package
`opencode-agent-orchestration-kit/opencode`, then `~/.config/opencode`.

## What stays only on the machine

These live under `~/.pi/agent/` with **no counterpart in this repository**.
`make install-pi` does not generate, merge, or overwrite them.

| File | Role |
|------|------|
| `subagents.json` | `model_profiles` — Pi routes each agent name to a model. The converter writes **no** model pins. Kit names that Pi does not already list (`lead`, `scoper`, `debugger`, `evaluator`, `evolver`, and the `review_*` kit agents) fall back to the parent model until you add profiles. |
| `models.json` | Provider registry (on this machine: `providers.nan`). |
| `extensions/nan-provider.ts` | Registers the Nan provider with Pi's model registry (`NAN_BASE_URL` / `NAN_API_KEY`). Other extensions (`nan-web-search.ts`, Orca helpers, …) are likewise local. |
| `settings.json` | Default model, provider, theme, packages. |
| `AGENTS.md` | Pi system prompt. The kit's `AGENTS.md` is **not** merged; reconcile by hand if you want kit contracts in Pi. |
| `auth.json` | Secrets. Never copy into the repo. |

Keeping them out of the repo is deliberate: they are machine- and
persona-specific (this laptop's Pi tree also holds gentle-pi / academic
agents that this portable workflow excludes).

## Frontmatter mapping (OpenCode → Pi)

| OpenCode | Pi |
|----------|-----|
| filename (no `name:`) | `name:` from the filename |
| `permission.read/glob/grep/list: allow` | `tools:` `read`, `find`, `grep`, `ls` |
| `permission.edit: allow` | `tools:` `edit`, `write` |
| `permission.bash` (including `"*": ask` plus allow-lists) | `tools:` `bash` |
| — | `systemPromptMode: replace` (always) |

The converter does **not** copy Pi-native fields that a live agent may already
have: `inheritProjectContext`, `inheritSkills`, `acceptanceRole`, or extra
tools (`web_search`, `fetch_content`, `nan_web_search`, `mcp`).

That drop is why `--force` is dangerous. Example: a live `researcher.md` that
declares `inheritProjectContext: true` and web tools becomes a kit-shaped
file with `tools: read, find, grep, ls, bash` only. Web research then
silently disappears.

## Safety

| Flag | Effect |
|------|--------|
| *(default)* | Skip destination files that already exist **and** differ. Print the conflict list. |
| `--dest <dir>` | Write somewhere else (preview / CI). Safe. |
| `--prefix oak-` | `oak-developer.md` next to `developer.md`. Safe coexistence. |
| `--force` | Overwrite conflicts. Use only when replacing Pi's agents is the goal. |

`make install-pi` calls the script **without** `--force` and **without**
`--dest`. On a Pi that already has `developer.md` / `researcher.md` /
`reviewer.md` / `specifier.md` / `designer.md`, the first run typically
installs only kit-only names (e.g. `lead`, `scoper`) and leaves the rest
untouched.

## Not included (intentionally)

- Pi `subagents.json`, `models.json`, `extensions/`, `settings.json`, `AGENTS.md`
- gentle-pi / SDD / judgment-day agents that this machine's Pi may already ship
- Skills materialisation (`make install-skills`) — consumer step, not repo prep
- Merging the kit `AGENTS.md` into Pi

## Checklist

- [ ] Kit is installed and readable (`oak install` or `--source`)
- [ ] Previewed with `--dest` and compared filenames against `~/.pi/agent/agents/`
- [ ] Chose default (skip conflicts), `--prefix`, or an explicit `--force`
- [ ] After install: added `model_profiles` for any new kit agent names you will invoke
- [ ] After install: confirmed live agents that you skipped still have the tools they need
- [ ] Reconciled `AGENTS.md` by hand if kit contracts should apply in Pi

## Next step

OpenCode overlay, env template, and skill manifest: [`opencode.md`](opencode.md).
Vendoring skills into a project: `make ai <path>`.
