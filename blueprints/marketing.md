---
tool: Marketing AI Agents (Claude Code / Cursor / Codex / Windsurf)
capabilities: [Marketing, CRO, Copywriting, SEO, Paid Ads, Growth]
mode: Agentic
---

# Marketing Operational Protocol

Drop-in protocol for AI agents performing marketing work — copywriting, CRO, SEO, paid ads, growth, sales enablement, and strategy — using the vendored skills at `./.ai/skills/marketing/`.

## 1. Foundation Skill

The `product-marketing-context` skill is the **foundation**. Every other marketing skill reads it first to understand the product, audience, and positioning before acting.

1. Check for a project-level context file first: `.agents/product-marketing-context.md` (or `.claude/product-marketing-context.md` in legacy setups).
2. If missing, activate `./.ai/skills/marketing/product-marketing-context/SKILL.md` to generate one with the user.
3. Only then proceed with task-specific skills (copywriting, page-cro, seo-audit, etc.).

## 2. Format Note (Agent Skills Spec)

Marketing skills follow the [Agent Skills specification](https://agentskills.io/specification.md), which differs from the engineering skills in this repo:

| Field | Engineering skills (this repo) | Marketing skills (Agent Skills spec) |
|-------|-------------------------------|--------------------------------------|
| `name` | Required | Required (must match directory) |
| `version` | Top-level key | Under `metadata.version` |
| `triggers` | Explicit array `[kw1, kw2]` | Embedded in the `description` text |

Activation is discovery-driven: the agent matches the user's request against the `description` field rather than a keyword array.

## 3. Skill Layout

```
.ai/skills/marketing/<skill-name>/
├── SKILL.md              # Main instructions (<500 lines)
├── references/           # Loaded on demand (frameworks, checklists, templates)
└── evals/evals.json      # Quality evaluations
```

Read the `references/*.md` files only when the SKILL.md points to them — progressive disclosure keeps the attention budget tight.

## 4. Skills by Category

| Category | Skills |
|----------|--------|
| **SEO & Content** | `seo-audit`, `ai-seo`, `site-architecture`, `programmatic-seo`, `schema-markup`, `content-strategy` |
| **CRO** | `page-cro`, `signup-flow-cro`, `onboarding-cro`, `form-cro`, `popup-cro`, `paywall-upgrade-cro` |
| **Content & Copy** | `copywriting`, `copy-editing`, `cold-email`, `email-sequence`, `social-content` |
| **Paid & Measurement** | `paid-ads`, `ad-creative`, `ab-test-setup`, `analytics-tracking` |
| **Growth & Retention** | `referral-program`, `free-tool-strategy`, `churn-prevention`, `community-marketing`, `lead-magnets` |
| **Sales & GTM** | `revops`, `sales-enablement`, `launch-strategy`, `pricing-strategy`, `competitor-alternatives`, `aso-audit` |
| **Strategy & Research** | `marketing-ideas`, `marketing-psychology`, `customer-research`, `product-marketing-context` |

## 5. Execution Loop

For every marketing task:

1. **Context check:** Load `product-marketing-context` (or the project context file).
2. **Skill selection:** Match the request to one primary skill by scanning the `description` fields under `./.ai/skills/marketing/`.
3. **Progressive disclosure:** Read the selected `SKILL.md`. Only fetch `references/*.md` when the SKILL.md links to them.
4. **Cross-reference:** Check the `Related Skills` section at the bottom of each SKILL.md — marketing skills compose (e.g. `copywriting` ↔ `page-cro` ↔ `ab-test-setup`).
5. **Deliver:** Produce the output format specified in the skill (page copy, ad variants, audit report, etc.).

## 6. Interaction with Engineering Skills

Marketing skills coexist with engineering skills in the same `.ai/skills/` tree. When a marketing task requires code (landing page markup, tracking snippets, A/B test wiring), hand off to the relevant engineering skill:

- HTML/CSS/JS implementation → `./.ai/skills/typescript-standard/SKILL.md`
- Backend/server code → `./.ai/skills/php-standard/SKILL.md` or `./.ai/skills/typescript-standard/SKILL.md`
- Reviewing generated code → `./.ai/skills/code-review/SKILL.md`

## 7. What This Protocol Does NOT Cover

- Tool integrations (GA4, Stripe, Mailchimp CLIs) — not vendored in this repo.
- Claude Code plugin marketplace installation — use the skills directly via vendoring (`make ai <path>`).
- Version update checks against upstream — pull manually from [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills).

---
*Credits: Marketing skills adapted from [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) by Corey Haines (MIT License).*
