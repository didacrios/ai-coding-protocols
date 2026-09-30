# OpenCode Blueprint

How to preview this repository's portable development roster for OpenCode
(`~/.config/opencode/` or a project `.opencode/` tree).

The roster lives in [`catalog/`](../catalog/README.md). The OpenCode adapter
emits **v2** `permissions:` lists. Preview with `make render-catalog` into
`generated/opencode/`. Copy into `.opencode/agents/` (project) or
`~/.config/opencode/agents/` only after that preview. Matching filenames are
conflicts with whatever is already on the machine.

## Quick path

```bash
make test-catalog
node scripts/render-catalog.mjs --target opencode --dest /tmp/oc-catalog-preview
```

Compare the preview with the live tree. Do not copy over live files until the
diff is acceptable.

Skills are a separate consumer step (`make install-skills` +
`npx skills add didacrios/ai-coding-protocols`).

## What this repo writes

| Component | Source | Destination |
|-----------|--------|-------------|
| Skills (own) | `skills/` | via `npx skills add didacrios/ai-coding-protocols` |
| Third-party skills | `skills.json` | via `make install-skills` (never committed) |
| Catalog agents + commands | `catalog/` via `make render-catalog` | preview in `generated/opencode/`; live copy is a separate decision |
| Local overlay | `harness/{opencode,package,tui}-overlay.json` | merged into `opencode.json`, `package.json`, `tui.json` of a chosen dest |
| pi variant | catalog adapter | see [`pi.md`](pi.md) |

`package-lock.json` is generated, never vendored. After applying the package
overlay, regenerate it in that config dir with
`npm install --ignore-scripts --legacy-peer-deps` if the live tree needs it.

## Local overlay

`scripts/apply-opencode-overlay.mjs` merges the three fragments under
`harness/` into `opencode.json`, `package.json`, and `tui.json`. Dry-run is
the script default; `make install-opencode-overlay` passes `--apply` against
`~/.config/opencode`. Preview without touching `$HOME`:

```bash
mkdir -p /tmp/oc-overlay-preview
# copy the three target files into that dir first, then:
node scripts/apply-opencode-overlay.mjs --dest /tmp/oc-overlay-preview
node scripts/apply-opencode-overlay.mjs --dest /tmp/oc-overlay-preview --apply
```

`--target` / `--overlay` still apply a single `opencode.json` pair.

## Not included (intentionally)

- Live writes to `~/.config/opencode` from `make render-catalog`
- Machine-local plugins such as an orca statusline
- Orchestrated review prepare script and specialist agent files (later OpenCode-only extra; lenses already render into `/review`)

## Notes

- `skills.json` third-party installs use the skills CLI lockfile
  (`~/.agents/.skill-lock.json`); `npx skills check` / `npx skills update`
  detect upstream changes.
- Name collision: both this repository and `mattpocock/skills` have a
  `code-review` skill. Install only one.
- Attribution for adapted agent contracts: [`NOTICE`](../NOTICE).
