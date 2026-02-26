---
name: context-optimization
version: 1.0.0
description: Activate when hitting context limits, experiencing quality degradation in long sessions, or needing to extend effective context capacity.
triggers: [context-limit, optimization, compaction, masking, token-budget, long-session, cache]
---

# Context Optimization

Techniques for maximizing available context window capacity through strategic optimization rather than requiring larger models. Focuses on getting more useful work done within existing constraints.

## When to Activate
- Context utilization surpasses 70%
- Response quality degrades with longer conversations
- Token costs are rising and need reduction
- Long coding sessions where the agent starts "forgetting" earlier work
- Need to fit more useful information into fixed context windows

## Core Concepts
- **Optimize tokens-per-task, not tokens-per-request:** Total tokens to complete work matters more than per-call efficiency
- **Trigger at 70-80% utilization:** Don't wait until context is full
- **Strategy depends on what dominates context:** Different fixes for tool-heavy vs message-heavy vs document-heavy sessions
- **50-70% token reduction with <5% quality loss** is the realistic target

## Detailed Guidance

### Compaction
Summarize context near capacity limits. Replace verbose message history with structured summaries that preserve key decisions, file changes, and next steps. Target 50-70% token reduction.

**When to use:** Message history is growing large, conversation has been going for many turns, earlier exchanges are no longer directly relevant.

**How:** Compress earlier conversation into a structured summary at the start of context, keeping recent exchanges intact. The summary should preserve:
- Current objective and progress
- Files modified and key decisions made
- Errors encountered and solutions found
- Next steps planned

### Observation Masking
Replace verbose tool outputs with compact references. Tool outputs can comprise 80%+ of token usage in agent trajectories. Most of that content is never referenced again.

**When to use:** Tool-heavy workflows (running tests, reading large files, searching codebases).

**How:** After processing a tool result, replace it with a brief summary: "Read src/payment.ts (245 lines) - found PaymentService class with 3 public methods." The full content was already processed; the summary preserves what was learned.

### KV-Cache Optimization
Reuse cached computations across requests sharing identical prefixes. When system prompts and early context are identical across calls, the model can skip recomputing attention for those tokens.

**Practical impact:** Keep system prompts and static context (like skill files) stable across turns. Avoid reordering or modifying the beginning of context between calls.

### Context Partitioning
Distribute work across isolated sub-agents. Each sub-agent gets a fresh context window for focused subtasks, preventing context degradation on long-running tasks.

**When to use:** Tasks that naturally decompose into independent subtasks. Research tasks where multiple files need deep analysis. Tasks exceeding what a single context window can handle well.

## Examples

**Deciding which strategy to apply:**
```
Context dominated by tool outputs → Apply observation masking
Context dominated by documents  → Apply summarization/extraction
Context dominated by messages   → Apply compaction
All of the above                → Apply context partitioning (sub-agents)
```

**Compaction summary format:**
```markdown
## Session Summary (Turn 1-15)
**Objective:** Refactor PaymentService to use Value Objects
**Modified:** src/payment/service.ts, src/payment/email.ts (new)
**Decisions:** Using readonly properties for VOs, PHPUnit for tests
**Blocked:** Need to update 3 consumers of PaymentService
**Next:** Update CheckoutController to use new Email VO
```

## Guidelines
1. Trigger optimization at 70-80% context utilization — don't wait until full
2. Identify what dominates your context before choosing a strategy
3. Target 50-70% token reduction with <5% quality degradation
4. Keep system prompts stable across turns for KV-cache efficiency
5. Use sub-agents for tasks that naturally decompose into independent subtasks
6. Preserve key decisions, file changes, and next steps when compacting
7. Replace processed tool outputs with brief summaries of what was learned
8. Optimize for tokens-per-task (total to completion), not per-request

## Integration
- Builds on: `context-fundamentals` (attention budget concepts)
- Related: `context-compression` (specific compression algorithms), `filesystem-context` (offloading to filesystem as optimization)

## Skill Metadata
- Created: 2025-12-20
- Last Updated: 2025-07-01
- Author: Adapted from Agent-Skills-for-Context-Engineering (Muratcan Koylan)
- Version: 1.0.0
