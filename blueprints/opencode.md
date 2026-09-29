# OpenCode Blueprint

How to install this repository's portable development workflow on an OpenCode
setup (`~/.config/opencode/`).

The OpenCode harness itself is **not vendored here**. It belongs to the
[OAK kit](https://github.com/jcarlosrodicio/opencode-agent-orchestration-kit)
(`opencode-agent-orchestration-kit`), which owns its agents, commands and docs and
upgrades them through its own lifecycle (`oak install` / `oak upgrade`). This
repository keeps only what is ours: the local overlay, the pi conversion, the
purge tooling and the skill manifest.

## What gets installed

| Component | Source | Destination |
|-----------|--------|-------------|
| Skills (own + adapted) | `skills/` | via `npx skills add didacrios/ai-coding-protocols` |
| Third-party skills | `skills.json` dependencies | via `npx skills add <upstream>` (never committed) |
| Agents (15) + commands (18) | OAK kit payload | `~/.config/opencode/{agents,commands}/` via `oak install` |
| Kit docs + contracts | OAK kit payload | `~/.config/opencode/docs/ai/` via `oak install` |
| Local overlay (mcp, provider, skills path, pinned plugins, permissions, fallback agents) | `harness/opencode-overlay.json` | merged into `~/.config/opencode/opencode.json` |
| pi variant | `make install-pi` | `~/.pi/agent/{agents,prompts}/` (converted copies) |

## Setup on a new machine

```bash
git clone git@github.com:didacrios/ai-coding-protocols.git
cd ai-coding-protocols

# 1. Skills (own + third-party from skills.json)
make install-skills                                # dependencies
npx skills add didacrios/ai-coding-protocols       # own skills (choose global)

# 2. OpenCode harness: the OAK kit owns the agents, commands and docs
make install-oak                                   # npm i -g opencode-agent-orchestration-kit@1.1.1
cd ~/.config/opencode && oak install               # materialise the kit into the config tree
cd - && make install-opencode-overlay              # re-apply the local overlay

#    ...and/or pi (converted copies; frontmatter mapped to pi format)
make install-pi

# 3. Environment
cp .env.dist ~/.config/opencode/.env               # then fill in real values
cd ~/.config/opencode && npm install --ignore-scripts --legacy-peer-deps
```

`--legacy-peer-deps` is required because the pinned `@opencode-ai/plugin` wants
`@opentui/solid >= 0.4.5` while the kit pins `0.2.5` (the pairing that ships with
the kit). Without the flag npm aborts on an unresolvable peer conflict.

## Upgrading the kit

`oak upgrade` fails closed on any file the kit owns that was edited locally
(`owned-modified`), and `oak doctor --accept-preserved` only applies to files the
kit already tracks as *preserved* — not to owned files. Protected root files
(`AGENTS.md`, `opencode.json`, `package.json`, `package-lock.json`, `tui.json`)
become *preserved* only when they **pre-exist** a fresh `oak install`. So there are
two ways to keep a local customisation:

1. **Overlay (recommended, used here).** Keep customisations in
   `harness/opencode-overlay.json`, restore the kit's originals before upgrading,
   then re-apply:
   ```bash
   cp ~/.config/opencode/opencode.json /tmp/keep.json       # safety copy
   cp <kit>/opencode/opencode.json ~/.config/opencode/       # restore the kit original
   chmod 664 ~/.config/opencode/opencode.json                # oak compares bytes AND mode
   oak upgrade
   make install-opencode-overlay
   ```
   `tui.json` and `package.json` are reconciled the same way; `package.json` keeps
   `@opencode-ai/plugin ^1.18.x` and `opencode-subagent-statusline`, and drops
   `opencode-sdd-engram-manage` (a gentle-ai dependency).
2. **Preserved root files.** Install the kit into an empty config directory: the
   five protected root files are then adopted as *preserved* and never block an
   upgrade again, at the cost of not tracking kit changes to them.

`oak doctor` is the source of truth for health: `pass` findings must stay green,
`action-required` findings need a decision. Two findings are accepted on purpose
here — `dependencies` (we pin a newer plugin than the kit's baseline) and
`optional-plugins` (our own plugin references).

## Removing gentle-ai from an OpenCode tree

`scripts/purge-gentle-ai.mjs` removes every gentle-ai / gentle-pi injection
(SDD commands, prompts, skills, plugins, telemetry state) from any OpenCode config
tree while leaving kit-owned and user-owned files alone:

```bash
node scripts/purge-gentle-ai.mjs                      # dry run (default)
node scripts/purge-gentle-ai.mjs --apply              # move them to ~/backups/opencode/gentle-purge-<ts>/
node scripts/purge-gentle-ai.mjs --target /path/to/config --apply
```

It never deletes a path listed in `.oak/manifest.json`, moves files instead of
deleting them, and reports anything that only *mentions* gentle-ai for manual
review.

### pi specifics

- `make install-pi` runs `scripts/sync-harness.mjs`, which reads the agents and
  commands from the **installed kit** (`npm root -g`/opencode-agent-orchestration-kit/opencode,
  or a live config tree, or `--source`), converts opencode frontmatter
  (`permission` blocks) to pi agent format (`tools:` allowlist) and commands to pi
  prompt templates. Copies, not symlinks — re-run after a kit upgrade.
- pi model routing stays in `~/.pi/agent/subagents.json` (`model_profiles`);
  no model pins are written by the converter.
- The kit's `AGENTS.md` is not merged automatically; reconcile it by hand into
  `~/.pi/agent/AGENTS.md`.
- Skills: pi discovers `SKILL.md` files from `~/.pi/agent/skills/` (same spec).

## Not included (intentionally)

- **gentle-ai**: this workflow runs without the gentle-ai binary. SDD
  (`/sdd-*`), orchestrated judgment-day review, telemetry and the
  review-transport plugin are excluded. pi on this machine still runs gentle-pi;
  the two config trees are independent.
- **Plugins**: `plugins/*.ts` in `~/.config/opencode` are runtime-specific
  (engram, mission-runtime, open-design, orca status, token tree). Port them
  separately if the new setup needs them.

## Notes

- `skills.json` third-party installs use the skills CLI lockfile
  (`~/.agents/.skill-lock.json`); `npx skills check` / `npx skills update`
  detect upstream changes.
- Name collision: both this repo and `mattpocock/skills` have a `code-review`
  skill. Install only one.
- The kit also ships skills named like the `addyosmani/agent-skills` ones
  (adapted bodies). For OpenCode the kit wins; the declared dependency matters
  for harnesses without the kit (pi).
