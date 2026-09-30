# AI Coding Protocols

> Modular skills for high-precision AI coding assistance, combining **Recursive Language Modeling (RLM)** with **Context Engineering** best practices.

A curated set of skills that transform AI coding agents into senior software engineering assistants. These skills force the AI to explore codebases recursively, manage context efficiently, and follow engineering standards rigorously.

**Target tools:** Claude Code, Cursor

## Architecture

The repository uses a skills-based architecture following the [SKILL.md specification](https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering). Each skill is a self-contained file with standardized metadata, activation triggers, and integration references.

```
ai-coding-protocols/
├── skills/                   # Own skill definitions only
├── skills.json               # Third-party skill manifest (declare, don't vendor)
├── harness/                  # Local OpenCode overlay (harness itself: OAK kit)
├── blueprints/               # Tool-specific integration configs
├── template/                 # Canonical SKILL.md template (not an installable skill)
├── scripts/                  # Installers, harness conversion, gentle-ai purge
└── Makefile                  # Install + vendor commands
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
| `plan-initiative` | Initiative framing protocol for Engineering Managers with strict discovery and scope boundaries | initiative, kickoff, scope, framing, epics |

#### Meta Skills

| Skill | Description | Triggers |
|-------|-------------|----------|
| `skill-generator` | Meta-skill for creating new project-specific skills as the codebase evolves | new-skill, generate-skill, new-module, new-pattern |
| `project-bootstrap` | Initial project analysis — detects stack, conventions, generates project-overview skill | bootstrap, init, setup, first-run |

### Blueprints

Pre-assembled configurations for specific tools:
- **`cursor-rules.md`** — Drop-in `.cursor/rules/` content for Cursor
- **`claude-cli.md`** — Drop-in `CLAUDE.md` content for Claude Code
- **`marketing.md`** — Drop-in protocol for marketing agents (product context, skill activation by description, category map)

## Installation

Vendor the skills into any project's `.ai/` directory:

```bash
make ai /path/to/your/project
```

This copies `skills/`, `blueprints/`, and `template/` into `/path/to/your/project/.ai/`.

### Skills manifest (skills.json)

`skills.json` declares what is owned versus what is consumed:

- **Own skills** live in `skills/` (nine authored skills). After this branch
  is pushed, install them with `npx skills add didacrios/ai-coding-protocols`.
  `template/` is a copy-from scaffold (`SKILL.template.md`), not a skill.
- **Third-party dependencies** (`addyosmani/agent-skills`, `mattpocock/skills`,
  `muratcankoylan/Agent-Skills-for-Context-Engineering`,
  `coreyhaines31/marketingskills`) are declared, never committed. Install them with:

  ```bash
  make install-skills        # or: node scripts/install-skills.mjs --list
  ```

  The installer drives [`npx skills add`](https://github.com/vercel-labs/skills)
  per declared skill; the CLI lockfile (`~/.agents/.skill-lock.json`) tracks
  sources and `npx skills check` / `skills update` detect upstream changes.

  Dependencies are pinned to a tag/ref in `skills.json` for reproducibility.
  The engineering skills came from `addyosmani/agent-skills` (MIT, 25-skill
  catalog) — pinned to `0.6.11`. Earlier copies of these skills were vendored
  through `stanfish06/skillquarium` (an unlicensed curated mirror) and adapted
  by the opencode harness; those adapted copies were removed in favor of the
  canonical upstream. Twelve of them are also shipped (adapted) by the OAK kit,
  which owns the OpenCode workflow; `scripts/install-skills.mjs` skips those when the
  kit is present so one skill name never resolves to two different bodies
  (`--include-kit-overlap` installs them on a machine without the kit).
  Context-engineering skills come from
  `muratcankoylan/Agent-Skills-for-Context-Engineering` (MIT, pin
  `6dbe1a1`). Marketing skills come from `coreyhaines31/marketingskills`
  (MIT, pin `5b2c000`, release 2.11.1); former local names such as
  `page-cro` map to current upstream names (`cro`). See
  [`blueprints/marketing.md`](blueprints/marketing.md).

### OpenCode / pi dev workflow

The OpenCode harness (15 agents, 18 commands, kit docs) is owned by the
[OAK kit](https://github.com/jcarlosrodicio/opencode-agent-orchestration-kit),
pinned to `1.1.1` and installed through its own lifecycle (`oak install` /
`oak upgrade`). This repository keeps the local overlay
(`harness/opencode-overlay.json`: MCP servers, provider, skills path, pinned
plugins, permissions, fallback agents) plus the tooling around it:
`make install-oak`, `make install-opencode-overlay`, `make install-pi` and
`make purge-gentle-ai`. See [`blueprints/opencode.md`](blueprints/opencode.md)
for the setup, the upgrade procedure and the gentle-ai purge.

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
cp template/SKILL.template.md skills/my-new-skill/SKILL.md
```

Each SKILL.md includes: frontmatter metadata, activation triggers, detailed guidance, examples, verifiable guidelines, and integration references.

## Credits

- **SKILL.md format** from [Agent-Skills-for-Context-Engineering](https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering) by Muratcan Koylan (MIT License). The seven context-engineering skills are declared in `skills.json`, not vendored.
- **Marketing skills** from [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) by Corey Haines (MIT License), declared in `skills.json`
- **Recursive Language Modeling** inspired by MIT CSAIL research on [Recursive Language Models](https://arxiv.org/pdf/2512.24601)

---
*Maintained by [didacrios].*
