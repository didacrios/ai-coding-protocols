---
name: skill-generator
description: Create or update a project-specific skill when a convention, module, or integration recurs across the codebase. Use when a new module introduces conventions no existing skill covers, when the same pattern appears in two or more places, when a new library or framework is adopted, or when the user asks for a project skill.
license: MIT
metadata:
  author: didacrios
  version: 1.1.0
---

# Skill Generator

A meta-skill for creating project-specific skills as a codebase evolves. New modules, recurring patterns, and adopted libraries each carry conventions worth capturing; this skill decides whether to capture them, and how.

## When to activate

- A significant new module or feature introduces conventions no existing skill covers
- A pattern recurs across two or more files and is likely to recur again
- A new integration, library, or framework is adopted
- The user asks to generate or create a skill

## Core concepts

- **Skills are instructional, not executable** — they steer agent behavior through precise prose, not runnable code.
- **Recurrence threshold** — do not create a skill for a one-off pattern; wait until it appears in at least two or three places.
- **Composition over duplication** — reference existing skills instead of restating them.
- **Generated once, maintained after** — a skill that drifts from the code is worse than no skill.

## Layout

Paths below are relative to the **skills root**: the directory that holds the installed skills. The skills CLI installs to `<project>/.agents/skills/` (project scope) or `~/.agents/skills/` (global), and vendoring writes into the same project path. Detect the root from the environment rather than assuming it, but `.agents/skills/` is the one to expect.

Project-specific skills live in a `project/` subdirectory of that root:

```
<skills-root>/
├── recursive-exploration/SKILL.md   ← installed generic skills
├── typescript-standard/SKILL.md
└── project/                          ← yours; survives re-install and re-vendoring
    └── {domain}/SKILL.md
```

Keeping project skills under `project/` is what makes re-installing or re-vendoring the generic skills safe.

## Process

### 1. Verify the trigger

Confirm at least one holds:

- **New module or feature** — a distinct area (an API layer, a component system, a queue worker) with its own conventions.
- **Recurring pattern** — the same approach has appeared in 2+ places and will likely appear again.
- **New dependency** — a library or service that requires specific usage patterns.

*Done when:* the trigger is named, and the pattern is quoted from real files.

### 2. Analyze before writing

1. **Read the code** where the pattern lives. Extract the conventions: naming, structure, error handling, testing.
2. **Check existing skills** for overlap. If an existing skill covers 80% or more, extend that skill instead of creating one.
3. **Pull real examples** from the project.
4. **Write for an agent**, not a human reader — precision over narrative.

*Done when:* for each section you plan to write, you have a concrete file and line range behind it.

### 3. Generate the skill

Write `<skills-root>/project/{domain}/SKILL.md`.

**Naming:** lowercase, hyphenated, descriptive — `api-layer`, `queue-workers`, `auth-flow`.

**Required sections:**

- Frontmatter: `name`, `description`, `license`, `metadata` (author, version)
- `When to activate` — project-specific triggers
- `Core concepts` — 3-5 conventions
- `Detailed guidance` — the patterns themselves
- `Examples` — real code from the project, never hypothetical
- `Guidelines` — numbered, verifiable rules
- `Related skills` — links to sibling skills it builds on

Start `metadata.version` at `1.1.0` only if reusing the upstream shape; a brand-new skill starts at `1.0.0`.

### 4. Validate

- No duplication: the skill does not restate an existing skill.
- At least one real code example from the project.
- Every guideline is checkable against code.
- The file is under `project/`, never in the generic skills root.

*Done when:* all four hold.

## Update versus create

- **Update** an existing project skill when its pattern evolves: new edge cases, changed conventions, more examples.
- **Create** a new skill only when the pattern is clearly distinct from every existing one.
- **Retire** a skill that references files, functions, or patterns that no longer exist.

## Example

**Trigger:** a new event-driven module with a custom event bus.

**Generated `<skills-root>/project/event-bus/SKILL.md`:**

```markdown
---
name: event-bus
description: Conventions for the project's custom event bus — event naming, handler structure, and testing. Use when adding an event, writing a handler, or testing an event-driven flow.
license: MIT
metadata:
  author: <project>
  version: 1.0.0
---

# Event Bus Conventions

## When to activate
- Adding a new event or handler
- Changing dispatch behavior
- Testing an event-driven flow

## Core concepts
- Events are past-tense domain actions: `OrderPlaced`, `UserRegistered`
- One handler per side effect
- Every handler is idempotent

## Examples
// from src/events/OrderPlaced.ts
...
```

## Guidelines

1. Only generate a skill when a pattern recurs across 2+ files or a significant module is introduced.
2. Check existing skills for overlap first; extend rather than duplicate.
3. Put project skills under `project/` in the skills root — never beside the generic skills.
4. Include at least one real project code example.
5. Keep one domain per skill; no catch-alls.
6. Increment `metadata.version` on every update.
7. Retire skills whose subject no longer exists.

## Related skills

Optional companions, each installed separately.

- [`project-bootstrap`](../project-bootstrap/SKILL.md) — generates the first project skill; this skill handles everything after.
- [`recursive-exploration`](../recursive-exploration/SKILL.md) — the tracing model used in the analysis phase.
