# 0001 — Skills are self-contained and distributed via the skills CLI

- **Status:** Accepted
- **Date:** 2026-10-13

## Context

The nine authored skills began life as protocols wired into a specific
vendored layout (`.ai/skills/`) and referenced each other, the blueprints, and
the catalog by repository path. That coupling meant a skill could not be
installed on its own: `npx skills add` would copy a `SKILL.md` whose body
pointed at files that were not installed with it.

Community distribution needs the opposite property. A skill has to work when it
is the only thing installed.

## Decision

Every authored skill is self-contained:

- No skill body references a repository-internal path (`blueprints/`,
  `catalog/`, or a hardcoded vendored root).
- Cross-skill references are optional, phrased as such, and resolved by
  relative link to a sibling (`../<name>/SKILL.md`), which holds after
  installation because the skills CLI keeps every installed skill under one
  root.
- Where a layout must be named, the skill says "skills root" and gives the CLI
  location (`.agents/skills/`, project or user scope) as the canonical one,
  then tells the agent to detect it.
- The blueprint layer, not the skill layer, is what pins a concrete path.

## Consequences

- `npx skills add didacrios/ai-coding-protocols --skill <name>` yields a usable
  skill with no dangling references.
- A skill is slightly less specific than before when it needs a path; it asks
  the agent to detect the root instead of hardcoding one.
- Adding a new skill means keeping it free of repository-internal paths, which
  is now a reviewable rule rather than a preference.
