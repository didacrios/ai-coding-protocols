# AI Coding Protocols

> Modular skills for high-precision AI coding assistance, combining **Recursive Language Modeling (RLM)** with **Context Engineering** best practices.

A curated set of skills that transform AI coding agents into senior software engineering assistants. These skills force the AI to explore codebases recursively, manage context efficiently, and follow engineering standards rigorously.

**Target tools:** Claude Code, Cursor

## Architecture

The repository uses a skills-based architecture following the [SKILL.md specification](https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering). Each skill is a self-contained file with standardized metadata, activation triggers, and integration references.

```
ai-coding-protocols/
├── skills/           # Self-contained skill definitions
├── blueprints/       # Tool-specific integration configs
├── template/         # Canonical SKILL.md template
└── Makefile          # Vendor command
```

### Skills

#### Engineering Skills (original)

| Skill | Description | Triggers |
|-------|-------------|----------|
| `recursive-exploration` | Codebase exploration and iterative development using RLM | explore, trace, investigate, dependency |
| `typescript-standard` | TypeScript clean code and TDD standards | typescript, jest, playwright, tdd |
| `php-standard` | PHP strict typing, PSR compliance, and PHPUnit standards | php, phpunit, laravel, psr |
| `code-review` | Emoji-driven code review protocol | review, pr, pull-request, diff |
| `refactor` | Surgical refactoring without behavior changes | refactor, cleanup, simplify, extract |
| `documentation` | In-code and system docs using Diataxis framework | docs, documentation, tsdoc, phpdoc |

#### Context Engineering Skills (adapted from [Agent-Skills-for-Context-Engineering](https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering))

| Skill | Description | Triggers |
|-------|-------------|----------|
| `context-fundamentals` | Attention budgets, progressive disclosure, context quality vs quantity | context, attention, progressive-disclosure |
| `filesystem-context` | Filesystem as persistent context layer: scratch pads, plan persistence, offloading | filesystem, scratch-pad, plan-persistence |
| `project-development` | Task-model fit, pipeline architecture, cost estimation, agent-assisted dev | project, pipeline, task-model-fit |
| `context-optimization` | Compaction, observation masking, KV-cache optimization, partitioning | context-limit, optimization, compaction |
| `context-compression` | Anchored summarization, compression timing, artifact trail preservation | compression, summarization, long-session |
| `tool-design` | Designing effective MCP tools, descriptions as prompts, consolidation principle | tool-design, mcp, agent-tools |
| `evaluation` | Outcome-focused evaluation, multi-dimensional rubrics, LLM-as-judge | evaluation, testing, quality, metrics |

#### Meta Skills

| Skill | Description | Triggers |
|-------|-------------|----------|
| `skill-generator` | Meta-skill for creating new project-specific skills as the codebase evolves | new-skill, generate-skill, new-module, new-pattern |
| `project-bootstrap` | Initial project analysis — detects stack, conventions, generates project-overview skill | bootstrap, init, setup, first-run |

### Blueprints

Pre-assembled configurations for specific tools:
- **`cursor-rules.md`** — Drop-in `.cursor/rules/` content for Cursor
- **`claude-cli.md`** — Drop-in `CLAUDE.md` content for Claude Code

## Installation

Vendor the skills into any project's `.ai/` directory:

```bash
make ai /path/to/your/project
```

This copies `skills/`, `blueprints/`, and `template/` into `/path/to/your/project/.ai/`.

### Claude Code

Add to your project's `CLAUDE.md`:

```
Follow the engineering standards vendored in ./.ai/skills/.
See ./.ai/blueprints/claude-cli.md for the full operational protocol.
```

### Cursor

Create a rule file in `.cursor/rules/` (`.cursorrules` is deprecated) with the content of `blueprints/cursor-rules.md`, or reference it:

```
Follow the engineering standards vendored in ./.ai/skills/.
See ./.ai/blueprints/cursor-rules.md for the full operational protocol.
```

### Project Bootstrap (optional)

After vendoring, ask your AI agent to run the bootstrap process. It will scan your project, detect the stack and conventions, and generate an initial project-specific skill in `.ai/skills/project/`:

```
Bootstrap this project using .ai/skills/project-bootstrap/SKILL.md
```

As the project evolves, the `skill-generator` skill guides the agent to create additional project-specific skills automatically.

## Creating New Skills

Use the template:

```bash
mkdir skills/my-new-skill
cp template/SKILL.md skills/my-new-skill/SKILL.md
```

Each SKILL.md includes: frontmatter metadata, activation triggers, detailed guidance, examples, verifiable guidelines, and integration references.

## Credits

- **SKILL.md format and Context Engineering skills** adapted from [Agent-Skills-for-Context-Engineering](https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering) by Muratcan Koylan (MIT License)
- **Recursive Language Modeling** inspired by MIT CSAIL research on [Recursive Language Models](https://arxiv.org/pdf/2512.24601)

---
*Maintained by [didacrios].*
