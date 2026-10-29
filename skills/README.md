# Skills

The ten skills authored in this repository. Each is self-contained: it has no
dependency on this repository's layout, its blueprints, or its catalog, so it
works the same whether you install it with the skills CLI or vendor it into a
project.

## Install

```bash
# every skill in this repository
npx skills add didacrios/ai-coding-protocols

# one skill
npx skills add didacrios/ai-coding-protocols --skill recursive-exploration

# list what is available first
npx skills add didacrios/ai-coding-protocols --list
```

The skills CLI installs to `.agents/skills/` (project scope) or
`~/.agents/skills/` (global) and keeps a lockfile, so `npx skills check` and
`npx skills update` work afterwards.

Vendoring into a project's `.agents/` tree instead (for the blueprint-based
setup) is documented in the [root README](../README.md#installation). It writes
into the same `.agents/skills/` root the CLI uses.

## Engineering

| Skill | What it does |
|-------|--------------|
| [`recursive-exploration`](./recursive-exploration/SKILL.md) | Trace consumers and dependencies recursively before changing code; land one verified step at a time. |
| [`typescript-standard`](./typescript-standard/SKILL.md) | Strict TypeScript and a test-first loop: no `any`, 10-20 line methods, data builders, Faker, Given-When-Then. |
| [`php-standard`](./php-standard/SKILL.md) | PHP 8.2+ and PHPUnit standards: `strict_types`, PSR-12/PSR-4, value objects, test-first. |
| [`code-review`](./code-review/SKILL.md) | Emoji-tagged review findings that separate blocking bugs from advisory nits, each with a fix. |
| [`refactor`](./refactor/SKILL.md) | Behavior-preserving refactoring: trace, green tests, one method per step. |
| [`documentation`](./documentation/SKILL.md) | Why-not-what comments and Diátaxis-shaped system docs. |
| [`plan-initiative`](./plan-initiative/SKILL.md) | Turn a rough initiative into one scoped, outcome-oriented brief with explicit boundaries. |
| [`plan-diagram`](./plan-diagram/SKILL.md) | Open a plan, spec, or issue with one coarse C4-shaped boxes-and-arrows diagram: files, classes, methods, policies, and the boundaries between them. |

## Meta

| Skill | What it does |
|-------|--------------|
| [`project-bootstrap`](./project-bootstrap/SKILL.md) | Scan a new project, detect stack and conventions, generate one project-overview skill plus tool wiring. |
| [`skill-generator`](./skill-generator/SKILL.md) | Create or update project-specific skills when a convention, module, or integration recurs. |

## How these compose

Most skills are usable alone. Where one builds on another, it says so in a
`Related skills` section and links to a sibling by relative path, which
resolves after installation because the CLI keeps every skill in the same root.
Those links are optional: if a companion is not installed, the skill tells you
to apply the missing rules by hand.

The recurring spine is `recursive-exploration`: `refactor` and `code-review`
require a consumer/dependency trace before acting, and `documentation` reads
the implementation before describing it.

## Invocation

These are **model-invoked**: the agent can reach for them on its own, based on
the `description` in each `SKILL.md`. There is no `disable-model-invocation`
flag, so a user can also invoke them by name.

## Not skills

- [`../template/SKILL.template.md`](../template/SKILL.template.md) — a scaffold to copy from. It is not installable and the skills CLI does not treat it as a skill.
- [`../blueprints/`](../blueprints) — tool-specific wiring (Cursor, Claude Code, OpenCode, Pi, marketing). They point *at* these skills; they are not skills.

## License

MIT. See [`../LICENSE`](../LICENSE).
