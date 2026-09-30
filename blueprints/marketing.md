---
tool: Marketing AI Agents (Claude Code / Cursor / Codex / Windsurf)
capabilities: [Marketing, CRO, Copywriting, SEO, Paid Ads, Growth]
mode: Agentic
---

# Marketing Operational Protocol

Drop-in protocol for AI agents performing marketing work — copywriting, CRO, SEO, paid ads, growth, sales enablement, and strategy — using the [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) catalog declared in `skills.json`.

Install them with `make install-skills`. They land in `~/.agents/skills/` under the **upstream names** (not the old local names such as `page-cro`).

## 1. Foundation Skill

The `product-marketing` skill is the **foundation**. Every other marketing skill reads it first to understand the product, audience, and positioning before acting.

1. Check for a project-level context file first: `.agents/product-marketing-context.md` (or `.claude/product-marketing-context.md` in legacy setups).
2. If missing, activate `product-marketing` from the installed skills to generate one with the user.
3. Only then proceed with task-specific skills (`copywriting`, `cro`, `seo-audit`, etc.).

## 2. Format Note (Agent Skills Spec)

Marketing skills follow the [Agent Skills specification](https://agentskills.io/specification.md), which differs from the engineering skills in this repo:

| Field | Engineering skills (this repo) | Marketing skills (Agent Skills spec) |
|-------|-------------------------------|--------------------------------------|
| `name` | Required | Required (must match directory) |
| `version` | Top-level key | Under `metadata.version` |
| `triggers` | Explicit array `[kw1, kw2]` | Embedded in the `description` text |

Activation is discovery-driven: the agent matches the user's request against the `description` field rather than a keyword array.

## 3. Skill Layout

Installed globally (not copied into `.ai/`):

```
~/.agents/skills/<upstream-name>/
├── SKILL.md              # Main instructions (<500 lines)
├── references/           # Loaded on demand (frameworks, checklists, templates)
└── evals/evals.json      # Quality evaluations
```

Read the `references/*.md` files only when the SKILL.md points to them — progressive disclosure keeps the attention budget tight.

## 4. Skills by Category

Names below are the **upstream** names that `make install-skills` installs. Former local names (`page-cro`, `form-cro`, `paid-ads`, …) are recorded in `skills.json` as `former_local_name_map`. `form-cro` and `page-cro` both map to `cro`.

| Category | Skills |
|----------|--------|
| **SEO & Content** | `seo-audit`, `ai-seo`, `site-architecture`, `programmatic-seo`, `schema`, `content-strategy` |
| **CRO** | `cro`, `signup`, `onboarding`, `popups`, `paywalls` |
| **Content & Copy** | `copywriting`, `copy-editing`, `cold-email`, `emails`, `social` |
| **Paid & Measurement** | `ads`, `ad-creative`, `ab-testing`, `analytics` |
| **Growth & Retention** | `referrals`, `free-tools`, `churn-prevention`, `community-marketing`, `lead-magnets` |
| **Sales & GTM** | `revops`, `sales-enablement`, `launch`, `pricing`, `competitors`, `aso` |
| **Strategy & Research** | `marketing-ideas`, `marketing-psychology`, `customer-research`, `product-marketing` |

## 5. Execution Loop

For every marketing task:

1. **Context check:** Load `product-marketing` (or the project context file).
2. **Skill selection:** Match the request to one primary skill by scanning the `description` fields of the installed marketing skills.
3. **Progressive disclosure:** Read the selected `SKILL.md`. Only fetch `references/*.md` when the SKILL.md links to them.
4. **Cross-reference:** Check the `Related Skills` section at the bottom of each SKILL.md — marketing skills compose (e.g. `copywriting` ↔ `cro` ↔ `ab-testing`).
5. **Deliver:** Produce the output format specified in the skill (page copy, ad variants, audit report, etc.).

## 6. Interaction with Engineering Skills

Marketing skills live in the global skills store. When a marketing task requires code (landing page markup, tracking snippets, A/B test wiring), hand off to the relevant **own** engineering skill (vendored via `make ai` or installed from this repo):

- HTML/CSS/JS implementation → `typescript-standard`
- Backend/server code → `php-standard` or `typescript-standard`
- Reviewing generated code → `code-review`

## 7. What This Protocol Does NOT Cover

- Tool integrations (GA4, Stripe, Mailchimp CLIs) — not shipped by this repo.
- Claude Code plugin marketplace installation — use `make install-skills`.
- Manual vendoring of marketing skills into `.ai/` — they are declared in `skills.json`, not copied.
- Version updates — `npx skills check` / `npx skills update` against the pin in `skills.json`.

---
*Credits: Marketing skills from [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) by Corey Haines (MIT License).*
