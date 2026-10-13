# 0002 — Own skills use a flat layout under skills/

- **Status:** Accepted
- **Date:** 2026-10-13

## Context

`mattpocock/skills` — a reference for how a public skills repository is
organised — buckets its skills into `skills/engineering/`, `skills/productivity/`,
`skills/in-progress/`, and `skills/deprecated/`. Copying that shape here was
considered.

This repository already separates work along a different axis, and documents it:

- own skills live in `skills/` (this repository's authored work),
- third-party skills are declared in `skills.json` and installed, never
  committed,
- tool wiring lives in `blueprints/`.

Bucketing would add a second, overlapping axis. It would also break the
`.agents/skills/<name>/SKILL.md` paths that `blueprints/`, `project-bootstrap`, and
`skill-generator` depend on.

The skills CLI discovers `skills/<name>/SKILL.md` natively; it walks the
container up to three levels, so flat and bucketed layouts both work.

## Decision

Keep own skills flat: `skills/<name>/SKILL.md`. Categorisation is expressed in
[`skills/README.md`](../../skills/README.md) tables rather than in the
directory tree. Do not introduce bucket directories under `skills/`.

## Consequences

- Every existing path reference in `blueprints/` and the meta-skills stays
  valid; no churn.
- `npx skills add didacrios/ai-coding-protocols` discovers all nine skills.
- If the set ever grows past the point where a README table is hard to scan,
  revisit this decision then — not pre-emptively.
