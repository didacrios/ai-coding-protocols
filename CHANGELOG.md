# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] — 2026-02-26

### Added

- **Skills-based architecture** — Full migration from `protocols/`, `snippets/`, and `stacks/` into a unified `skills/` directory following the [SKILL.md specification](https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering).
- **`template/SKILL.md`** — Canonical template with standardized frontmatter, activation triggers, guidance, examples, and integration references.
- **Engineering skills** (migrated and expanded):
  - `skills/recursive-exploration/SKILL.md` — Codebase exploration using RLM chain of thought.
  - `skills/typescript-standard/SKILL.md` — TypeScript clean code and TDD standards.
  - `skills/php-standard/SKILL.md` — PHP strict typing, PSR compliance, and PHPUnit standards.
  - `skills/refactor/SKILL.md` — Surgical refactoring without behavior changes.
  - `skills/documentation/SKILL.md` — In-code and system docs using the Diataxis framework.
  - `skills/code-review/SKILL.md` — Emoji-driven code review protocol (renamed from `snippets/code-review.md`).
- **Context Engineering skills** (adapted from [Agent-Skills-for-Context-Engineering](https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering)):
  - `skills/context-fundamentals/SKILL.md` — Attention budgets, progressive disclosure, context quality.
  - `skills/filesystem-context/SKILL.md` — Filesystem as persistent context layer.
  - `skills/project-development/SKILL.md` — Task-model fit, pipeline architecture, cost estimation.
  - `skills/context-optimization/SKILL.md` — Compaction, KV-cache optimization, partitioning.
  - `skills/context-compression/SKILL.md` — Anchored summarization, compression timing.
  - `skills/tool-design/SKILL.md` — Designing effective MCP tools.
  - `skills/evaluation/SKILL.md` — Outcome-focused evaluation, multi-dimensional rubrics, LLM-as-judge.
- **Meta skills**:
  - `skills/skill-generator/SKILL.md` — Meta-skill for creating new project-specific skills.
  - `skills/project-bootstrap/SKILL.md` — Initial project analysis, stack detection, and project-overview skill generation.
- **README.md** — Full rewrite documenting the new architecture, skill catalog (engineering, context engineering, meta), installation instructions, and credits.
- **`blueprints/cursor-rules.md`** and **`blueprints/claude-cli.md`** — Updated to reference the new `skills/` structure.
- **`Makefile`** — Updated `vendor` target to copy `skills/`, `blueprints/`, and `template/` into the destination project.

### Removed

- `protocols/recursive-exploration.md` — Superseded by `skills/recursive-exploration/SKILL.md`.
- `snippets/documentation.md` — Superseded by `skills/documentation/SKILL.md`.
- `snippets/refactor.md` — Superseded by `skills/refactor/SKILL.md`.
- `stacks/php-standard` — Superseded by `skills/php-standard/SKILL.md`.
- `stacks/typescript-standard.md` — Superseded by `skills/typescript-standard/SKILL.md`.

---

## [0.1.0] — 2026-02-16 *(initial release)*

### Added

- `protocols/recursive-exploration.md` — Core RLM reasoning protocol.
- `snippets/documentation.md` — Diataxis documentation snippet.
- `snippets/refactor.md` — Refactoring snippet.
- `snippets/code-review.md` — Code review protocol.
- `stacks/typescript-standard.md` — TypeScript stack conventions.
- `stacks/php-standard` — PHP stack conventions.
- `blueprints/cursor-rules.md` — Cursor rules blueprint.
- `blueprints/claude-cli.md` — Claude Code blueprint.
- `Makefile` — Initial vendor command.
