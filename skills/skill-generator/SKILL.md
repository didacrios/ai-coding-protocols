---
name: skill-generator
version: 1.0.0
description: Meta-skill for creating new project-specific skills as the codebase evolves.
triggers: [new-skill, generate-skill, skill-creation, new-module, new-pattern]
---

# Skill Generator

A meta-skill that instructs the agent when and how to create new project-specific skills. As a project evolves — new modules, recurring patterns, adopted libraries — this skill guides the generation of tailored SKILL.md files that capture those conventions.

## When to Activate
- After implementing a significant new module or feature that introduces conventions not covered by existing skills
- When the agent notices recurring patterns across multiple files that aren't captured by any current skill
- When a new integration, library, or framework is adopted into the project
- When explicitly asked to generate or create a new skill

## Core Concepts
- **Project-specific skills live in `.ai/skills/project/`** — separated from vendored generic skills so `make ai` re-vendoring won't overwrite them
- **Skills are instructional, not executable** — they guide agent behavior through clear prose, not runnable code
- **Minimum complexity threshold** — don't create a skill for a one-off pattern; wait until it recurs across at least 2-3 files or modules
- **Skills should be composable** — reference existing skills rather than duplicating their content

## Detailed Guidance

### Trigger Detection

Before generating a skill, verify one of these conditions holds:

1. **New module or feature:** A distinct area of the codebase was created (e.g., a new API layer, a new UI component system, a queue worker) with its own conventions.
2. **Recurring pattern:** The same pattern has appeared in 2+ places and is likely to appear again (e.g., a specific error handling approach, a data transformation pipeline).
3. **New dependency:** A library or service was integrated that requires specific usage patterns (e.g., an ORM, a message broker, a third-party SDK).

### Analysis Phase

Before writing the skill file:

1. **Scan relevant code** — read the files where the pattern exists. Identify the conventions: naming, structure, error handling, testing approach.
2. **Check existing skills** — search `.ai/skills/` for overlap. If an existing skill covers 80%+ of the pattern, extend it instead of creating a new one.
3. **Extract concrete examples** — pull real code snippets from the project to use as examples in the skill.
4. **Identify the audience** — the skill is read by an AI agent, not a human developer. Write for clarity and precision.

### Generation

Create the skill file at `.ai/skills/project/{domain}/SKILL.md` using the canonical template from `.ai/template/SKILL.md`.

**Naming convention:**
- Use the domain name as the directory: `.ai/skills/project/{domain}/SKILL.md`
- Domain names should be lowercase, hyphenated, and descriptive: `api-layer`, `queue-workers`, `auth-flow`

**Required sections:**
- Frontmatter with `name`, `version`, `description`, `triggers`
- `When to Activate` — specific to the project context
- `Core Concepts` — 3-5 key conventions
- `Detailed Guidance` — the main content with project-specific patterns
- `Examples` — real code from the project (not hypothetical)
- `Guidelines` — numbered, verifiable rules
- `Integration` — references to related generic and project skills

### Validation Checklist

Before finalizing the new skill:

1. **No duplication** — the skill doesn't restate what an existing skill already covers
2. **Has real examples** — includes at least one code example from the actual project
3. **Proper frontmatter** — `name`, `version` (start at `1.0.0`), `description`, `triggers` are all present
4. **Actionable guidelines** — each guideline is something an agent can verify against code
5. **Correct output path** — file is in `.ai/skills/project/`, not in the vendored `.ai/skills/` root

### Update vs Create

- **Update** an existing project skill when the pattern it describes has evolved (new edge cases, changed conventions, additional examples).
- **Create** a new skill when the pattern is clearly distinct from all existing skills.
- **Detect staleness** — if a skill references files, functions, or patterns that no longer exist in the codebase, update or retire it.

## Examples

**Trigger:** A new event-driven module was added using a custom event bus.

**Generated skill at `.ai/skills/project/event-bus/SKILL.md`:**

```markdown
---
name: event-bus
version: 1.0.0
description: Conventions for the project's custom event bus — event naming, handler structure, and testing.
triggers: [event, event-bus, handler, listener, dispatch]
---

# Event Bus Conventions

## When to Activate
- Creating a new event or event handler
- Modifying existing event dispatching logic
- Writing tests for event-driven flows

## Core Concepts
- Events are named as past-tense domain actions: `OrderPlaced`, `UserRegistered`
- Handlers are single-responsibility: one handler per side-effect
- All handlers must be idempotent

## Detailed Guidance
...

## Examples
// Real code from src/events/OrderPlaced.ts
...
```

## Guidelines
1. Only generate a skill when a pattern recurs across 2+ files or a significant new module is introduced
2. Always check existing skills for overlap before creating a new one
3. Place project-specific skills in `.ai/skills/project/`, never in the vendored skills root
4. Include at least one real code example from the project
5. Use the canonical template structure from `.ai/template/SKILL.md`
6. Start version at `1.0.0` and increment on updates
7. Keep skills focused — one domain per skill, not a catch-all

## Integration
- Depends on: `recursive-exploration` (for codebase scanning during analysis phase)
- Related: `project-bootstrap` (generates the initial project skill; skill-generator handles ongoing evolution)
- Template: `.ai/template/SKILL.md` (canonical structure for all generated skills)

## Skill Metadata
- Created: 2025-07-01
- Last Updated: 2025-07-01
- Author: didacrios
- Version: 1.0.0
