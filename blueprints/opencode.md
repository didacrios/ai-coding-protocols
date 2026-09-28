# OpenCode Blueprint

How to install this repository's portable development workflow on an OpenCode
setup (`~/.config/opencode/`).

## What gets installed

| Component | Source | Destination |
|-----------|--------|-------------|
| Skills (own + adapted) | `skills/` | via `npx skills add didacrios/ai-coding-protocols` |
| Third-party skills | `skills.json` dependencies | via `npx skills add <upstream>` (never committed) |
| Agents (10 core) | `harness/opencode/agents/` | `~/.config/opencode/agents/` (symlink) |
| Commands (14 core) | `harness/opencode/commands/` | `~/.config/opencode/commands/` (symlink) |
| Harness contracts | `harness/opencode/docs/harness/` | `~/.config/opencode/docs/ai/harness/` (symlink) |
| Global rules | `harness/opencode/AGENTS.md` | merge manually into `~/.config/opencode/AGENTS.md` |
| pi variant | `make install-pi` | `~/.pi/agent/{agents,prompts}/` (converted copies) |

## Setup on a new machine

```bash
git clone git@github.com:didacrios/ai-coding-protocols.git
cd ai-coding-protocols

# 1. Skills (own + third-party from skills.json)
make install-skills                                # dependencies
npx skills add didacrios/ai-coding-protocols       # own skills (choose global)

# 2. Dev workflow — OpenCode (symlinks; repo stays the source of truth)
make install-opencode

#    ...or pi (converted copies; frontmatter mapped to pi format)
make install-pi

# 3. Environment
cp .env.dist ~/.config/opencode/.env   # then fill in real values
npm install                            # plugin deps, in ~/.config/opencode
```

### pi specifics

- `make install-pi` runs `scripts/sync-harness.mjs`, which converts opencode
  frontmatter (`permission` blocks) to pi agent format (`tools:` allowlist) and
  commands to pi prompt templates. Copies, not symlinks — re-run after edits.
- pi model routing stays in `~/.pi/agent/subagents.json` (`model_profiles`);
  no model pins are written by the converter.
- Skills: pi discovers `SKILL.md` files from `~/.pi/agent/skills/` (same spec).

## Not included (intentionally)

- **gentle-ai**: this workflow runs without the gentle-ai binary. SDD
  (`/sdd-*`), orchestrated review (`review-*` agents), telemetry and the
  review-transport plugin are excluded from the portable set.
- **Plugins**: `plugins/*.ts` in `~/.config/opencode` are runtime-specific
  (engram, telemetry, TUI). Port them separately if the new setup needs them.

## Notes

- Agents are symlinks, so edits in this repository propagate immediately.
- `skills.json` third-party installs use the skills CLI lockfile
  (`~/.agents/.skill-lock.json`); `npx skills check` / `npx skills update`
  detect upstream changes.
- Name collision: both this repo and `mattpocock/skills` have a `code-review`
  skill. Install only one.
