---
name: evaluation
version: 1.0.0
description: Activate when testing agent systems, measuring output quality, or designing evaluation frameworks for AI-assisted workflows.
triggers: [evaluation, testing, quality, metrics, benchmark, llm-judge, agent-testing]
---

# Evaluation Methods for Agent Systems

Systematic assessment of agent performance across multiple quality dimensions. Unlike traditional software testing, agent evaluation must account for non-deterministic behavior — agents may take different valid routes to correct results.

## When to Activate
- Testing a new agent system or skill configuration
- Measuring output quality of AI-assisted workflows
- Designing evaluation rubrics for code review or generation
- Debugging inconsistent agent performance
- Deciding between model configurations or prompt strategies

## Core Concepts
- **Outcome-focused:** Evaluate results, not execution paths — agents legitimately take different routes
- **Multi-dimensional:** Single metrics miss important quality aspects
- **The 95% rule:** Token usage (80%) + tool calls (10%) + model choice (5%) explain 95% of performance variance
- **Continuous evaluation:** Run regularly, not just pre-deployment

## Detailed Guidance

### The 95% Performance Variance
Research on browsing agents found three factors explain 95% of performance:
- **Token usage:** 80% of variance. More efficient context = better results.
- **Tool calls:** ~10% of variance. Fewer, better-targeted calls win.
- **Model choice:** ~5% of variance. Model upgrades beat token increases.

Implication: optimizing context engineering (skills in this repo) has far more impact than switching models.

### Outcome-Focused Evaluation
Don't check if the agent took specific steps. Check if the final result is correct and the process was reasonable. Agents may:
- Read files in different order
- Use different search strategies
- Take more or fewer steps
- Find alternative valid solutions

All of these can produce correct results. Penalizing valid alternative paths produces misleading metrics.

### Multi-Dimensional Rubrics
Evaluate across multiple dimensions:

| Dimension | What to Check |
|-----------|--------------|
| **Accuracy** | Factual correctness against ground truth |
| **Completeness** | All requested information present |
| **Code quality** | Follows project standards (method size, types, tests) |
| **Tool efficiency** | Minimal necessary tool calls, no redundant reads |
| **Process quality** | Logical reasoning, appropriate exploration |

### Evaluation Methods

**LLM-as-Judge:** Use a model to evaluate agent outputs. Scales to large test sets with consistent evaluation. Best for subjective quality dimensions. Add chain-of-thought justification to improve reliability 15-25%.

**Human review:** Catches hallucinations and edge cases automation misses. Essential for high-stakes outputs. Expensive but highest signal.

**End-state evaluation:** For agents modifying persistent systems (files, databases). Check the final state matches expectations regardless of how the agent got there.

**Automated checks:** Linting, type checking, test suites. Fast, deterministic, catches a class of errors reliably.

### Test Design
- **Stratify complexity:** Simple (single tool), moderate (multi-step), complex (multi-file), very complex (architectural)
- **Sample from real usage:** Test cases should reflect actual tasks
- **Include known edge cases:** Error handling, ambiguous inputs, large files
- **Run continuously:** Evaluate regularly to catch regressions from prompt/skill changes

### Anti-Patterns
- **Path-dependent testing:** Asserting the agent must take specific steps
- **Single-metric evaluation:** Only checking pass/fail without quality dimensions
- **Snapshot testing:** Exact output matching fails with non-deterministic systems
- **Pre-deployment only:** Missing regressions from ongoing changes

## Examples

**Multi-dimensional rubric for code generation:**
```markdown
## Evaluation Rubric
1. Correctness (0-5): Does the code work? Does it handle edge cases?
2. Standards (0-5): Follows project conventions? Types? Method size?
3. Tests (0-5): Adequate test coverage? Given-When-Then format?
4. Efficiency (0-5): Minimal tool calls? No redundant file reads?
5. Communication (0-5): Clear reasoning? Appropriate questions?
```

**Outcome-focused test:**
```
Input: "Add email validation to the User model"
Expected outcome:
  - User model has validation logic ✓
  - Invalid emails are rejected ✓
  - Tests cover valid and invalid cases ✓
NOT expected: specific file read order or number of steps
```

## Guidelines
1. Evaluate outcomes, not execution paths
2. Use multi-dimensional rubrics, not single pass/fail metrics
3. Stratify test cases by complexity level
4. Combine LLM-as-judge with human review for comprehensive coverage
5. Run evaluations continuously, not just pre-deployment
6. Focus optimization on context efficiency (80% of performance variance)
7. Include chain-of-thought justification in LLM-as-judge for 15-25% reliability improvement
8. Sample test cases from real usage patterns

## Integration
- Builds on: `context-fundamentals` (understanding what affects performance)
- Related: `project-development` (evaluating pipeline outputs), `code-review` (review as evaluation), `tool-design` (testing tool effectiveness)

## Skill Metadata
- Created: 2025-12-20
- Last Updated: 2025-07-01
- Author: Adapted from Agent-Skills-for-Context-Engineering (Muratcan Koylan)
- Version: 1.0.0
