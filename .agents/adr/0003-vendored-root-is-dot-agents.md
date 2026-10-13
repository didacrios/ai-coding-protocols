# 0003 — The vendored root is `.agents/`, not `.ai/`

- **Status:** Accepted
- **Date:** 2026-10-13
- **Corrects:** the `.ai/` naming used earlier in this same unshipped pass

## Context

`make ai <path>` vendored `skills/`, `blueprints/`, and `template/` into
`<path>/.ai/`. `skills/skill-generator` and `skills/project-bootstrap` repeated
that path as the example vendored root.

Meanwhile the tooling in this repository had already moved to `.agents/`
without anyone noticing the split:

- `scripts/install-skills.mjs` installs through the skills CLI, which places
  skills at `.agents/skills/` (project) or `~/.agents/skills/` (global).
- Its lockfile is `~/.agents/.skill-lock.json`.
- `blueprints/marketing.md` already documented `~/.agents/skills/<name>/`.

So the repository shipped two competing layouts for the same concept:

| Writer | Destination |
|---|---|
| `make ai` | `.ai/skills/` |
| `npx skills add` | `.agents/skills/` |

`.agents/` is the interoperable choice, not merely the newer one:

- `vercel-labs/skills` — the CLI this repository uses — hardcodes
  `AGENTS_DIR = ".agents"` and `SKILLS_SUBDIR = "skills"`, and treats
  `.agents/skills/` as the **canonical** copy that per-agent directories
  symlink to.
- The Agent Skills client-implementation guide lists `/.agents/skills/` as the
  "cross-client interoperability" path, alongside each client's native location.
- `AGENTS.md` is the established agent-instruction file, so `.agents/` sits
  beside an existing convention rather than inventing one.

The broader `.agents/` *config* layout (beyond `skills/`) is still splintered
across several competing proposals — `dotagentsprotocol.com`,
`agentsfolder/spec`, `dot-agents` — and none is authoritative. That is the
limit of the claim: **`.agents/skills/` is standard; the rest of the tree is a
reasonable use of it.**

## Decision

The vendored root is `<path>/.agents/`, holding `skills/`, `blueprints/`, and
`template/`:

```bash
make vendor /path/to/your/project     # alias: make ai
```

- `make vendor` is the primary target name; `make ai` is kept as an alias.
- Skill bodies state the skills root as `.agents/skills/` (project) or
  `~/.agents/skills/` (global) — one convention, not two.
- `make vendor` warns when a legacy `.ai/` directory is present, but never
  deletes it.

## Consequences

- Vendoring and `npx skills add` converge on one canonical directory, so
  `npx skills check` / `update` operate on a vendored tree too.
- Existing vendored `.ai/` trees are not migrated automatically; the warning
  tells the user to remove theirs by hand after verifying. A silent rename
  would have been the more dangerous choice.
- `.agents/adr/` in this repository now shares a directory name with the
  installed tree, which is intentional and consistent.
