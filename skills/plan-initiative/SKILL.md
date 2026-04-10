---
name: plan-initiative
version: 1.0.0
description: Activate when an Engineering Manager needs to shape a rough initiative into a clear, scoped, outcome-oriented brief before execution.
triggers: [plan-initiative, initiative, kickoff, scope, framing, epics, discovery, roadmap]
---

# Plan Initiative

A facilitation skill for Engineering Managers to move from a rough idea to a solid initiative brief. This skill prioritizes thinking quality over document speed: clarify the problem first, then define delivery.

## When to Activate

- A user asks to plan, frame, or structure an engineering initiative
- Scope is unclear and needs boundaries before execution
- The team is jumping to solutions without a validated problem statement
- Cross-team dependencies, risk, or ownership boundaries are still fuzzy

## Core Concepts

- **Outcome before output:** Define what change should happen before deciding what to build
- **Strict clarification gate:** Do not draft until mandatory fields are clear enough
- **Scope discipline:** In-scope and out-of-scope are equally important
- **Risk transparency:** Make assumptions, unknowns, and dependency criticality explicit
- **Single artifact focus:** Produce one initiative brief, not multiple parallel documents

## Detailed Guidance

### Phase 1: Deep discovery (strict-stop mode)

Start with the EM's own description, then ask focused questions in small batches. Keep iterating until uncertainty is low across all mandatory fields.

Ask for:

#### Problem and motivation (mandatory)

- What exact problem are we solving, for whom?
- What evidence exists (signals, incidents, trends, feedback)?
- Why now? What is the forcing function?
- What happens if we do nothing?

#### Desired outcome (mandatory)

- What must be different in 3-6 months?
- What decision, behavior, or capability does this unlock?
- How would we recognize progress (metric or proxy if available)?

#### Scope and boundaries (mandatory)

- What is explicitly in scope?
- What is explicitly out of scope?
- What are the ownership boundaries and decision rights?

#### Delivery shape

- Is discovery needed before build?
- Can value be delivered incrementally?
- Which parts are sequential vs parallel?

#### Team, dependencies, and constraints

- Which teams are involved?
- Which dependencies are critical path vs non-critical?
- What constraints exist (timeline, staffing, budget, architecture, compliance)?

#### Risks, unknowns, and assumptions

- Top derailers (technical, product, org)
- Unknowns that must be resolved early
- Assumptions currently treated as facts

#### Facilitation behavior rules

- Ask a few high-value questions at a time (avoid checklist dumping)
- Challenge vague statements; ask for concrete wording
- Detect solution-jumping and pull back to the problem
- If mandatory fields remain unclear, continue discovery and do not draft

### Phase 2: Draft the initiative brief

Draft only after mandatory fields are clear enough for a credible plan.

Title rules:

- Outcome-oriented and concise (roughly <= 10 words)
- Reflects what changes, not what is built
- Avoid internal jargon

Use this format:

```markdown
## SUMMARY
[1-3 sentences: what this is, why now, expected change]

## PROBLEM
[Concrete problem statement with available evidence/signals]

## OUTCOME
[What changes when successful; include metric/proxy if meaningful]

## CURRENT SITUATION
[Known context, prior attempts, constraints]

## SCOPE
[Explicit in-scope boundaries]

## OUT OF SCOPE
[Explicit exclusions]

## APPROACH
[High-level approach, phases, discovery vs build logic]

## PROPOSED EPICS
Discovery:
- [Epic title] - [one-line purpose]

Build:
- [Epic title] - [one-line purpose]

## TEAM AND DEPENDENCIES
[Teams involved, dependency map, criticality]

## RISKS, UNKNOWNS, ASSUMPTIONS
[Top risks, open unknowns, key assumptions to validate]

## NEXT STEPS
[3-5 concrete actions with immediate execution value]
```

### Phase 3: Confirm and finalize

After showing the draft, always ask for explicit selection:

1. Use as-is
2. Edit something
3. Cancel

Do not finalize without confirmation.

### Quality gate (must pass before presenting draft)

- Problem is specific and evidence-based enough
- Outcome reflects real impact, not only shipped output
- Scope and out-of-scope are explicit and coherent
- Approach fits uncertainty level (discovery where needed)
- Epics cover a realistic path from uncertainty to delivery
- Risks and assumptions are explicit and non-generic
- Next steps are concrete and immediately actionable
- Capacity/dependency realism is reflected in the plan

## Examples

**Good activation input:**
> "Help me plan an initiative to reduce incidents caused by config drift across services."

**Expected behavior:**

1. Ask discovery questions in batches (problem evidence, forcing function, ownership boundary)
2. Continue probing until mandatory fields are clear
3. Draft a single initiative brief with discovery/build epics
4. Ask for explicit confirmation (use/edit/cancel)

**Bad behavior to avoid:**

- Producing a full plan after one vague sentence
- Treating "improve reliability" as a complete problem statement
- Forcing hard metrics when only qualitative signals exist at this stage

## Guidelines

1. Never draft the initiative brief while any mandatory field is materially unclear
2. Ask high-value questions in small batches, not full questionnaires
3. Keep output to one initiative brief unless the user explicitly asks otherwise
4. Require explicit `SCOPE` and `OUT OF SCOPE` sections in every draft
5. Record risks, unknowns, and assumptions separately from scope
6. Treat metrics as optional: include quantitative targets when meaningful, otherwise use clear proxies
7. Always close with a 3-way confirmation gate: use as-is, edit, or cancel
8. Favor concrete language over abstractions and generic phrasing

## Integration

- Builds on: `recursive-exploration` (iterative discovery and confidence gating)
- Related: `documentation` (clear structure and precision in written artifacts)
- Complementary external framing references:
  - Atlassian Project Poster: [https://www.atlassian.com/team-playbook/plays/project-poster](https://www.atlassian.com/team-playbook/plays/project-poster)
  - Working Backwards PR/FAQ mindset: [https://workingbackwards.com/concepts/working-backwards-pr-faq-process/](https://workingbackwards.com/concepts/working-backwards-pr-faq-process/)

## Skill Metadata

- Created: 2026-04-09
- Last Updated: 2026-04-09
- Author: didacrios
- Version: 1.0.0
