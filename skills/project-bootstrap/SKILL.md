---
name: project-bootstrap
description: Bootstrap a project for these skills by scanning the codebase to detect stack, architecture, and conventions, then generating one project-overview skill and tool-specific wiring. Use on the first run in a new project, when a skills directory exists without project-specific skills, or when the user asks to initialize or bootstrap AI protocols.
license: MIT
metadata:
  author: didacrios
  version: 1.1.0
---

# Project Bootstrap

Performs the initial project analysis when these skills are first adopted. Scans the codebase to detect the technology stack, architectural patterns, and key conventions, then generates one project-overview skill plus tool-specific wiring.

## When to activate

- Right after the skills are vendored or installed into a project
- When the agent first encounters a skills root without project-specific skills
- When explicitly asked to bootstrap or initialize the protocol for the project

## Core concepts

- **Idempotent** — checks for existing project skills before generating; never overwrites earlier work.
- **Detection over assumption** — scans actual project files instead of guessing from directory names.
- **Minimal initial output** — one project-overview skill and one wiring suggestion; `skill-generator` handles growth after that.
- **Layout-aware** — reads the skills root from the environment rather than hardcoding one path.

## Layout

Paths are relative to the **skills root**: the directory holding the installed skills. The skills CLI installs to `<project>/.agents/skills/` (project scope) or `~/.agents/skills/` (global), and vendoring writes into the same project path. Detect it; `.agents/skills/` is the one to expect.

Project-specific output belongs under `project/` inside that root:

```
<skills-root>/
├── recursive-exploration/SKILL.md   ← installed generic skills
└── project/                          ← generated here; survives re-install
    └── project-overview/SKILL.md
```

## Process

### 1. Guard clause

1. Does `<skills-root>/project/` exist and contain at least one `SKILL.md`?
2. If yes → **stop**. Report that project skills already exist and point at `skill-generator` for additions.
3. If no → continue.

### 2. Scan

Build a project profile from these sources:

| Source | What to detect |
|--------|----------------|
| `package.json` | JS/TS project, framework (Next.js, Nuxt, Express…), test runner (Jest, Vitest, Playwright), linter/formatter |
| `composer.json` | PHP project, framework (Laravel, Symfony), testing (PHPUnit, Pest), static analysis |
| `pyproject.toml` / `requirements.txt` | Python project, framework (Django, FastAPI, Flask), pytest, ruff, mypy |
| `go.mod` | Go project, major dependencies |
| `Cargo.toml` | Rust project, major crates |
| `Gemfile` | Ruby project, framework (Rails, Sinatra) |
| Top-level directories | `src/`, `app/`, `lib/`, `tests/`, `spec/`, `docs/`, `infra/`, `packages/` — architectural signals |
| Config files | `.eslintrc`, `tsconfig.json`, `phpstan.neon`, `.prettierrc`, `docker-compose.yml`, `Makefile`, `turbo.json` |
| Monorepo indicators | `turbo.json`, `pnpm-workspace.yaml`, `lerna.json`, populated `packages/` |

### 3. Classify patterns

- **Languages** — primary and secondary
- **Framework** — web, CLI, library
- **Architecture** — monorepo, MVC, hexagonal/ports-and-adapters, serverless, microservices
- **Testing** — runner, assertion style, coverage tool
- **Code quality** — linter, formatter, static analysis
- **Key directories** — where source, tests, config, and infrastructure live

*Done when:* each classification cites the file it came from.

### 4. Generate the project-overview skill

Write `<skills-root>/project/project-overview/SKILL.md`:

```markdown
---
name: project-overview
description: Stack, conventions, and key file paths for {project-name}. Use when you need the project's stack, directory layout, or conventions.
license: MIT
metadata:
  author: {project}
  version: 1.0.0
---

# Project Overview: {project-name}

## Stack
- **Language:** {detected}
- **Framework:** {detected}
- **Testing:** {detected}
- **Linting/Formatting:** {detected}
- **Architecture:** {detected}

## Key directories
- `src/` — {purpose}
- `tests/` — {purpose}

## Conventions
- {conventions evidenced by config files and code}

## Related skills
- {generic skills that match this stack, by name}
```

### 5. Suggest tool wiring

Generate one wiring suggestion for the harness in use:

**Claude Code** — content for `CLAUDE.md` at the project root:

```markdown
Follow the engineering standards in <skills-root>.
See the project's blueprint for the full operational protocol.
Project-specific conventions are in <skills-root>/project/.
```

**Cursor** — a rule file in `.cursor/rules/` (not `.cursorrules`, which is deprecated) referencing the vendored skills and the generated stack profile.

If the project ships blueprints, point at them; if it does not, inline the protocol in the wiring file instead.

### 6. Confirm before writing outside `project/`

Never modify files outside `<skills-root>/project/` without explicit user confirmation.

## What not to do

- Don't generate skills for standard language features — the generic skills already cover those.
- Don't guess at conventions that no config file or code sample supports.
- Don't generate multiple project skills — start with the overview and let `skill-generator` handle the rest.
- Don't modify anything outside `<skills-root>/project/` without confirmation.

## Example

**Scenario:** a Next.js project with TypeScript, Vitest, and ESLint.

**Detected profile:** TypeScript 5.x, Next.js 14 App Router, Vitest + Testing Library, ESLint + Prettier, routes in `src/app/`.

**Generated `<skills-root>/project/project-overview/SKILL.md`:**

```markdown
---
name: project-overview
description: Next.js 14 App Router project with TypeScript, Vitest, and ESLint. Use when you need the project's stack, layout, or conventions.
license: MIT
metadata:
  author: my-nextjs-app
  version: 1.0.0
---

# Project Overview: my-nextjs-app

## Stack
- **Language:** TypeScript 5.x (strict)
- **Framework:** Next.js 14 (App Router)
- **Testing:** Vitest + @testing-library/react
- **Linting/Formatting:** ESLint (next/core-web-vitals) + Prettier

## Key directories
- `src/app/` — routes and layouts
- `src/components/` — reusable UI
- `src/lib/` — shared utilities

## Related skills
- `typescript-standard` — TypeScript conventions and TDD patterns
- `recursive-exploration` — codebase navigation
- `code-review` — review protocol
```

## Guidelines

1. Check for existing project skills before generating — never overwrite.
2. Base every detection on an actual file, not an assumption.
3. Generate exactly one project-overview skill and one wiring suggestion.
4. Reference only generic skills the project actually uses.
5. Write all generated skills under `<skills-root>/project/`.
6. For Cursor, use `.cursor/rules/`, not `.cursorrules`.
7. Get confirmation before writing outside `<skills-root>/project/`.

## Related skills

Optional companions, each installed separately.

- [`skill-generator`](../skill-generator/SKILL.md) — ongoing skill creation after bootstrap.
- [`recursive-exploration`](../recursive-exploration/SKILL.md) — used during the scanning phase.
- [`typescript-standard`](../typescript-standard/SKILL.md) and [`php-standard`](../php-standard/SKILL.md) — the stack skills most often surfaced in the generated overview.
