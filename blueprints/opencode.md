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
| Skills (own) | `skills/` | via `npx skills add didacrios/ai-coding-protocols` |
| Third-party skills | `skills.json` dependencies | via `npx skills add <upstream>` (never committed) |
| Agents (15) + commands (18) | OAK kit payload | `~/.config/opencode/{agents,commands}/` via `oak install` |
| Kit docs + contracts | OAK kit payload | `~/.config/opencode/docs/ai/` via `oak install` |
| Local overlay | `harness/{opencode,package,tui}-overlay.json` | merged into `~/.config/opencode/{opencode.json,package.json,tui.json}` |
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

# 3. Environment (names only; the values stay yours and never enter the repo)
cp harness/opencode.env.dist ~/.config/opencode/.env      # then fill in real values
cd ~/.config/opencode && npm install --ignore-scripts --legacy-peer-deps
```

`--legacy-peer-deps` is required because the pinned `@opencode-ai/plugin` wants
`@opentui/solid >= 0.4.5` while the kit pins `0.2.5` (the pairing that ships with
the kit). Without the flag npm aborts on an unresolvable peer conflict.

## Ownership of kit-managed root files

`oak doctor` on a machine that applied this overlay reports **pass=8,
action-required=4**. The four drifted files are kit-**owned** (hash mismatch,
mode `0o664` matches). None are *preserved*. `AGENTS.md` is the fifth
protected root and currently matches the kit — leave it alone.

`--accept-preserved` cannot adopt them: it only flips files the kit already
tracks as preserved. On this install `preserved_files` is empty, so the
flag refuses the four owned-modified files. That is expected, not a bug.

| File | In this repo | Delta vs kit 1.1.1 | How to keep it across `oak upgrade` |
|------|--------------|--------------------|--------------------------------------|
| `opencode.json` | `harness/opencode-overlay.json` | Overlay keys: `mcp`, `provider.nan`, `skills.paths`, `plugin` (superpowers hash-pin + `openrtk@0.1.0`), `permission`, fallback agents `explore`/`general`. Kit keys (`model`, `default_agent`, `compaction`, …) stay in the file. | Restore kit original → upgrade → `make install-opencode-overlay`. |
| `package.json` | `harness/package-overlay.json` | Kit pins `@opencode-ai/plugin` `1.14.41`. Overlay sets `^1.18.23` and adds `opencode-subagent-statusline` `^1.3.0`. `@opentui/*` stay on the kit pin. Dropped: `opencode-sdd-engram-manage` (gentle-ai). | Restore kit original → upgrade → `make install-opencode-overlay`. |
| `package-lock.json` | **Not overlayed.** Generated. | Lock of the merged `package.json` after `npm install --ignore-scripts --legacy-peer-deps`. | Never vendor. Restore kit lock → upgrade → regenerate with the flag below. |
| `tui.json` | `harness/tui-overlay.json` | Kit: `./plugins/token-tree-usage.tsx` only. Overlay keeps that path and adds `opencode-subagent-statusline`. The machine-local orca statusline plugin stays out of the repo. | Restore kit original → upgrade → `make install-opencode-overlay`. |
| `AGENTS.md` | None | No drift. | Do not restore or overlay. |

Preview without touching `~/.config/opencode`:

```bash
KIT="$(npm root -g)/opencode-agent-orchestration-kit/opencode"
mkdir -p /tmp/oak-overlay-preview
cp "$KIT"/{opencode.json,package.json,tui.json} /tmp/oak-overlay-preview/
node scripts/apply-opencode-overlay.mjs --dest /tmp/oak-overlay-preview          # dry-run
node scripts/apply-opencode-overlay.mjs --dest /tmp/oak-overlay-preview --apply  # write the preview dir only
```

### Why `oak doctor` stays amber

| Finding | Cause | Decision |
|---------|--------|----------|
| `file-drift` (4 files) | Owned content differs from the kit payload. | Accept. The three overlays plus a regenerated lockfile are the source of truth. |
| `dependencies` (2) | `@opencode-ai/plugin` `^1.18.x` vs kit `1.14.41`, plus `opencode-subagent-statusline`. Plugin 1.18 wants `@opentui/solid >= 0.4.5`; the kit pins `0.2.5`. | Accept. Install with `--legacy-peer-deps`. Do not bump `@opentui/*` off the kit pin. |
| `optional-plugins` (2) | oak wants hash-pinned or local `./` refs. Failures: `openrtk@0.1.0` (semver) in `opencode.json` and bare `opencode-subagent-statusline` in `tui.json`. `superpowers@…#d884ae04` and `./plugins/token-tree-usage.tsx` already satisfy the rule. | Accept until those two refs are hash-pinned. |
| `compatibility` | Umbrella of the findings above. | Follows the three decisions. |

`oak doctor` is the health check. Green `pass` findings must stay green.
Amber findings above are recorded, not something to "fix" with
`--accept-preserved` or by copying this laptop's lockfile into git.

### Two strategies (only one is in use)

1. **Overlay + restore (this repo).** Before `oak upgrade`, copy the kit
   originals over the four drifted files so oak sees no owned-modified
   conflict, then put the local deltas back. `oak` compares **bytes and
   mode** (`0o664`); a `cp` that leaves `0o644` still blocks the upgrade.

   ```bash
   KIT="$(npm root -g)/opencode-agent-orchestration-kit/opencode"
   CFG="$HOME/.config/opencode"
   for f in opencode.json package.json package-lock.json tui.json; do
     cp "$CFG/$f" "/tmp/keep-$f"
     cp "$KIT/$f" "$CFG/$f"
     chmod 664 "$CFG/$f"
   done
   oak upgrade
   make install-opencode-overlay
   cd "$CFG" && npm install --ignore-scripts --legacy-peer-deps
   ```

2. **Preserved roots (not chosen).** `oak install` into an **empty**
   config directory adopts the five protected roots as *preserved*.
   Later upgrades skip them, so kit changes to those files are never
   pulled. Do not mix this with the overlay dance on an existing tree.

### What `make install-opencode-overlay` does

`scripts/apply-opencode-overlay.mjs` merges the three fragments under
`harness/` into `opencode.json`, `package.json`, and `tui.json` of the
config dir (default `~/.config/opencode`, or `--dest DIR`). Dry-run is
the script default; the Makefile target passes `--apply`. It does **not**
write `package-lock.json` or `AGENTS.md`. After `--apply`, regenerate the
lockfile in that config dir with `npm install --ignore-scripts --legacy-peer-deps`.

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
- **gentle-ai provenance, purged from the live config as well**: `plugins/engram.ts`,
  the `mcp.engram` entry in `opencode.json` and `themes/gentleman{,-cute}.json`. The
  engram bridge belongs to the `gentle-engram` package (its Go binary lives outside the
  config tree, at `~/.local/bin/engram`), which a portable setup does not install, and
  the themes came from the gentle-ai persona without any config file referencing them.
  Purging them costs OpenCode its memory tools; pi keeps its own gentle-engram memory.
- **`plugins/orca-opencode-status.js`**: the user's own statusline, machine-specific.
  It stays in the live config and is deliberately not portable.
- **Kit-owned plugins** — `mission-runtime.ts`, `mission-runtime.test.mjs`,
  `oak-tui/`, `open-design.ts`, `shell-export-guard.ts`, `token-tree-usage.tsx` —
  arrive with `make install-oak`. They are not local files to preserve; an earlier
  revision of this note wrongly listed some of them as user plugins.

## Notes

- `skills.json` third-party installs use the skills CLI lockfile
  (`~/.agents/.skill-lock.json`); `npx skills check` / `npx skills update`
  detect upstream changes.
- Name collision: both this repository and `mattpocock/skills` have a `code-review`
  skill. Install only one.
- **OAK kit overlap**: the kit ships adapted copies of twelve `addyosmani/agent-skills`
  skills (`api-and-interface-design`, `code-review-and-quality`, `code-simplification`,
  `context-engineering`, `debugging-and-error-recovery`, `documentation-and-adrs`,
  `doubt-driven-development`, `performance-optimization`, `security-and-hardening`,
  `source-driven-development`, `test-driven-development`, `using-agent-skills`).
  They stay declared in `skills.json` (a harness without the kit needs them), but
  `scripts/install-skills.mjs` skips them whenever the kit is present — opencode reads
  both its own skills directory and every path in `skills.paths`, so a raw copy next to
  the kit's adapted one would leave two skills sharing one name. Use
  `--include-kit-overlap` on a machine without the kit.
- The kit's skills are coupled to the kit's workflow: its agents consult
  `docs/ai/harness/skill_registry.md`, and skills like `oak-adversarial-review` or
  `iterative-retrieval` reference `subagent`/opencode conventions. This repository's own
  skills reference no harness at all, so they layer on top of any workflow.
