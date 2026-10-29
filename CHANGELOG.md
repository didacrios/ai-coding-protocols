# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- `skills/plan-diagram/SKILL.md` — plan, spec, and issue diagrams: one coarse
  C4-shaped `flowchart` per artifact, nodes limited to real repository paths,
  symbols and policies, `subgraph` for every boundary, and a fixed shape lexicon
  (file, class/contract, method, policy, store, external) with verb-labelled
  edges. Level 2 for cross-container changes, level 3 for work inside one.
  Assets: `assets/skeletons.md` with copy-paste L2, L3 and ASCII skeletons. The
  Mermaid C4 extensions are rejected on purpose — GitHub's bundled renderer has
  no C4 support and prints those blocks as raw text.
- `skills/plan-diagram` hardening: a `Guards` section naming the three ways a
  plan diagram turns quietly false — a container drawn as a component or the
  reverse, a shared library boxed as a container, a bus drawn as one box — plus
  a twelve-node gate that splits the question instead of shrinking the labels,
  and a `%% assumed: <reason>` marker so every inferred node or edge can be
  grepped and argued with.

## [2.0.0] — 2026-10-29

### Added

- `LICENSE` (MIT) — the repository had no license, which blocked community use. Covers the own skills, catalog, and adapters; third-party material keeps its own terms (`NOTICE`, `licenses/`).
- `skills/README.md` — index of the nine own skills, with the skills-CLI install commands and the model-invoked invocation model.
- `.agents/adr/` — architecture decision records. `0001-skills-are-self-contained` and `0002-flat-skills-layout` record the decisions behind this pass.
- `make install-own-skills` — installs this repository's own skills via `npx skills add $(OWN_REPO)` (override with `OWN_REPO=...`).
- `catalog/` — harness-agnostic YAML for eight development agents (`lead` plus developer, researcher, reviewer, specifier, designer, technical-writer, publisher), lite and full workflows, short slash aliases (`/lite`, `/full`, `/plan`, `/research`, `/review`, `/design`, `/implement`, `/docs`, `/publish`), and Pi/OpenCode v2 adapters. `make test-catalog` / `make render-catalog` preview into `generated/` and do not write live harness trees.
- `skills/plan-initiative/SKILL.md` — Initiative framing protocol for Engineering Managers with strict-stop discovery, explicit scope boundaries, and a single initiative-brief output.
- `blueprints/pi.md` — Pi catalog adapter: preview under `generated/pi/`; `subagents.json`, `models.json`, and `extensions/` stay machine-local.
- `blueprints/opencode.md` — OpenCode catalog adapter plus local overlays in `harness/`. `package-lock.json` stays generated.
- `harness/package-overlay.json` and `harness/tui-overlay.json` — local deltas for live `package.json` / `tui.json`. `scripts/apply-opencode-overlay.mjs` merges all three overlays; `--dest` previews without touching `~/.config/opencode`.
- `NOTICE` and `licenses/opencode-agent-orchestration-kit.Apache-2.0.txt` — Apache-2.0 attribution for adapted agent contracts (see README Credits).
- OpenCode adapter extra: `review_coordinator`, lens specialists `review_quality|security|tests|api`, `/review-preflight` and `/review-partial`, and `scripts/review-preflight.mjs`. Specialists emit `verdict: not_run`. Pi keeps `/review` plus focus only.

### Changed

- `skills/recursive-exploration` is now `1.2.0`. Trace the consumers and dependencies the current step touches, and name anything deferred. When a structural index exists, rank entry points before reading file bodies. A runtime-behavior claim needs a run, a test, or a trace. A symbol whose body is not in the repo is resolved from docs, tests, or a probe; its name is not evidence. One logical change may span interface, implementation, and test. State the plan before code, in the harness's reasoning block when it has one. The `Related skills` footer is gone; composition stays in `skills/README.md`.
- **Vendored root renamed `.ai/` → `.agents/`.** `make ai` became `make vendor` (alias `make ai` kept) and now writes `<path>/.agents/{skills,blueprints,template}`. The repository previously shipped two competing layouts for one concept: `make ai` wrote `.ai/skills/` while `npx skills add` wrote `.agents/skills/`, and `blueprints/marketing.md` already documented the latter. `.agents/skills/` is the canonical cross-client location the skills CLI itself uses, so a vendored tree and a CLI-installed tree are now the same tree and `npx skills check` / `update` work on either. `make vendor` warns when a legacy `.ai/` is present but never deletes it — remove yours by hand after verifying. See `.agents/adr/0003-vendored-root-is-dot-agents.md`.
- **Own skills are now self-contained and installable one at a time.** Every `skills/*/SKILL.md` dropped its repository-internal references (`.ai/` paths, `blueprints/`, `catalog/`), replaced the `Integration` section with optional `Related skills` relative links, and moved metadata out of a duplicated bottom `## Skill Metadata` block into frontmatter.
- **Skill frontmatter rewritten to the Agent Skills shape.** `name`, a rich model-facing `description` (what it does, when to use it, and the adjacent case it is not for), `license: MIT`, and `metadata: {author, version}`. The non-standard `triggers:` array and top-level `version:` are gone; the `description` is the trigger. All nine skills bump to `1.1.0`.
- `skills/skill-generator` and `skills/project-bootstrap` no longer hardcode a vendored path. They define a **skills root** (`.agents/skills/`, project or user scope — the same path the CLI and vendoring both use) and keep project skills under `project/`. `project-bootstrap` inlines the skill structure it previously pointed at in the template file.
- `template/SKILL.template.md` — updated to the new frontmatter, a `Process` section with `Done when:` completion criteria, and a `Related skills` section.
- `CONTEXT.md` — adds **Own skill**, **Blueprint**, and **Template** to the domain language.
- `README.md` — the install section now leads with the skills CLI and separates it from the vendored `.agents/` blueprint path.
- Catalog `reviewer` now requires file coverage, a pinned `diff_base`, nine attack dimensions, and a fact-check. `/review` and `lead` handoffs pin the git diff; `lead` must not review a diff it or `developer` produced. `skills/code-review` stays a separate emoji comment protocol.
- `catalog/lenses.yaml` plus `/review` optional focus (`quality`, `security`, `tests`, `api`). Pi and OpenCode adapters inject the lens list into the review command; the roster stays eight agents.
- Community skills are declared in `skills.json` (consumer step: `make install-skills`), matching addyosmani and mattpocock. `muratcankoylan/Agent-Skills-for-Context-Engineering` (7 skills, pin `6dbe1a1`) and `coreyhaines31/marketingskills` (35 skills, pin `5b2c000`) are dependencies, not copies in `skills/`.
- `template/SKILL.md` renamed to `template/SKILL.template.md` so the skills CLI does not treat the scaffold as an installable skill named `skill-name`.
- Portable agents come only from `catalog/`. Attribution for adapted contracts is in README Credits and `NOTICE`.

### Removed

- Third-party kit installer, Pi converter script, and skill-skip based on a local kit copy.
- OpenCode residue-purge Makefile target and script.
- Vendored copies of seven context-engineering skills under `skills/` (`context-fundamentals`, `context-compression`, `context-optimization`, `filesystem-context`, `project-development`, `tool-design`, `evaluation`).
- Vendored `skills/marketing/` tree (36 local directories). Upstream names differ; see `former_local_name_map` in `skills.json`.

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
