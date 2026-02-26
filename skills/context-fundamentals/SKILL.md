---
name: context-fundamentals
version: 1.0.0
description: Activate when designing agent systems, debugging unexpected agent behavior, or optimizing context usage and attention budgets.
triggers: [context, attention, progressive-disclosure, context-window, token-budget, system-prompt]
---

# Context Engineering Fundamentals

Context is the complete state available to a language model at inference time: system instructions, tool definitions, retrieved documents, message history, and tool outputs. Understanding how to engineer context effectively is prerequisite to getting high-quality results from AI coding agents.

## When to Activate
- Designing or modifying agent system prompts (CLAUDE.md, .cursorrules)
- Debugging unexpected agent behavior that may relate to context
- Optimizing context usage to reduce token costs or improve output quality
- Deciding what information to include in project configuration files
- Structuring `.ai/` skill files for maximum effectiveness

## Core Concepts
- **Attention Budget:** Models have finite attention that depletes as context grows. More tokens != better results.
- **Progressive Disclosure:** Load information only when needed. Start with skill names, load full content on activation.
- **Quality over Quantity:** The smallest high-signal token set outperforms large low-signal context.
- **Position Matters:** Information at the beginning and end of context gets more attention than the middle.

## Detailed Guidance

### The Anatomy of Context

**System Prompts** establish the agent's identity, constraints, and behavioral guidelines. They persist throughout the session. The optimal "altitude" balances specificity (concrete signals for desired output) with flexibility (strong heuristics, not brittle logic). Organize prompts with clear section boundaries using XML tags or Markdown headers.

**Tool Definitions** specify actions an agent can take. They live near the front of context and collectively steer behavior. Poor descriptions force agents to guess; optimized descriptions include usage context, examples, and defaults.

**Message History** is the conversation between user and agent. For long tasks, it can dominate context. It serves as scratchpad memory for tracking progress and maintaining state across turns.

**Tool Outputs** are results of agent actions (file contents, search results, command output). They can reach 80%+ of total context usage in typical agent sessions. This creates pressure for strategies like observation masking and compaction.

### Context Windows and Attention

Models process tokens through attention mechanisms creating pairwise relationships between all tokens. As context grows, the model's ability to capture these relationships gets stretched thin. The result is an "attention budget" that depletes as context grows.

Models remain capable at longer contexts but show reduced precision for information retrieval and long-range reasoning compared to shorter contexts. This is why stuffing everything into a massive context window doesn't work.

### Progressive Disclosure in Practice

At startup, agents should load only skill names and descriptions — enough to know when a skill is relevant. Full content loads only on activation. This applies at multiple levels:
- **Skill selection:** List skill triggers in system prompt, load full SKILL.md on match
- **Document loading:** Start with summaries, load full docs when needed
- **Tool results:** Write large outputs to files, read selectively

### Context Quality vs Quantity

Processing cost grows disproportionately with context length. Model performance degrades beyond certain thresholds even when the window supports more tokens. The guiding principle: include what matters for the decision at hand, exclude what doesn't, and design systems that can access additional information on demand.

## Examples

**Good: Progressive document loading**
```
# Step 1: Load summary
docs/api_summary.md          # Lightweight overview

# Step 2: Load specific section as needed
docs/api/endpoints.md        # Only when API calls needed
docs/api/authentication.md   # Only when auth context needed
```

**Good: Organized system prompt**
```markdown
## Background
You are a TypeScript expert working on a data pipeline.

## Instructions
- Write clean, typed code with no `any`
- Include type hints for function signatures
- Follow project conventions in .ai/skills/

## Tool Guidance
Use grep for search, file reads for exploration.
```

## Guidelines
1. Treat context as a finite resource with diminishing returns
2. Place critical information at attention-favored positions (beginning and end)
3. Use progressive disclosure — defer loading until needed
4. Organize system prompts with clear section boundaries
5. Monitor context usage during development
6. Prefer smaller high-signal context over larger low-signal context
7. Design for context degradation rather than hoping to avoid it
8. Position critical instructions at the start or end, never buried in the middle

## Integration
- Foundation for: all other skills build on these concepts
- Related: `context-optimization` (techniques to extend capacity), `context-compression` (managing long sessions), `filesystem-context` (filesystem as context layer)

## Skill Metadata
- Created: 2025-12-20
- Last Updated: 2025-07-01
- Author: Adapted from Agent-Skills-for-Context-Engineering (Muratcan Koylan)
- Version: 1.0.0
