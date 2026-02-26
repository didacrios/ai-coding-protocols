---
name: project-development
version: 1.0.0
description: Activate when starting LLM-powered projects, evaluating task-model fit, designing pipelines, or estimating costs for agent-assisted development.
triggers: [project, pipeline, task-model-fit, batch, cost-estimation, architecture, scaffold]
---

# Project Development Methodology

Principles for identifying tasks suited to LLM processing, designing effective project architectures, and iterating rapidly using agent-assisted development. Applies whether building a batch pipeline, a multi-agent system, or an interactive agent application.

## When to Activate
- Starting a new project that might benefit from LLM processing
- Evaluating whether a task is suited for agents vs traditional code
- Designing architecture for an LLM-powered application
- Planning a batch processing pipeline with structured outputs
- Estimating costs and timelines for LLM-heavy projects

## Core Concepts
- **Task-model fit first:** Validate with manual prototyping before building automation
- **Pipeline stages:** acquire -> prepare -> process -> parse -> render
- **Filesystem as state machine:** File existence gates execution, intermediate results persist
- **Minimal architecture:** Start simple, add complexity only when proven necessary

## Detailed Guidance

### Task-Model Fit Recognition

**LLM-suited tasks:**
| Characteristic | Why It Fits |
|----------------|-------------|
| Synthesis across sources | LLMs excel at combining information from multiple inputs |
| Subjective judgment with rubrics | Grading, evaluation, classification with criteria |
| Natural language output | When the goal is human-readable text |
| Error tolerance | Individual failures don't break the system |
| Batch processing | No conversational state between items |

**LLM-unsuited tasks:**
| Characteristic | Why It Fails |
|----------------|--------------|
| Precise computation | Math, counting, exact algorithms are unreliable |
| Real-time requirements | LLM latency too high for sub-second responses |
| Perfect accuracy | Hallucination risk makes 100% accuracy impossible |
| Deterministic output | Same input must produce identical output |

### The Manual Prototype Step

Before building automation, copy one representative input into the model. Evaluate output quality. This takes minutes and prevents hours of wasted development.

Questions it answers:
- Does the model have the knowledge required?
- Can it produce output in the format you need?
- What quality level should you expect at scale?
- What are the obvious failure modes?

**If the manual prototype fails, the automated system will fail.**

### Pipeline Architecture

Structure LLM projects as staged pipelines where each stage is discrete, idempotent, cacheable, and independent:

```
acquire → prepare → process → parse → render
```

1. **Acquire:** Fetch raw data (APIs, files, databases)
2. **Prepare:** Transform into prompt format
3. **Process:** Execute LLM calls (expensive, non-deterministic)
4. **Parse:** Extract structured data from LLM outputs
5. **Render:** Generate final outputs

Stages 1, 2, 4, 5 are deterministic. Stage 3 is not. This separation lets you re-run the expensive LLM stage only when necessary while iterating quickly on parsing and rendering.

### File System as State Machine

```
data/{id}/
├── raw.json         # acquire complete
├── prompt.md        # prepare complete
├── response.md      # process complete
├── parsed.json      # parse complete
```

Check if an item needs processing: check if output file exists. Re-run a stage: delete its output file. Debug: read intermediate files directly.

### Structured Output Design

When outputs must be parsed, the prompt must specify exact format requirements:
1. **Section markers:** Explicit headers for parsing
2. **Format examples:** Show exactly what output looks like
3. **Rationale disclosure:** "I will be parsing this programmatically"
4. **Constrained values:** Enumerated options, score ranges

Build parsers that handle variations gracefully — LLMs don't follow format instructions perfectly.

### Architectural Reduction

Start minimal. Production evidence shows that removing specialized tools often improves performance. Vercel's d0 agent went from 80% to 100% success rate by reducing from 17 tools to 2 (bash + SQL).

**Reduce when:** data is well-documented, model has sufficient reasoning, tools are constraining rather than enabling.
**Add complexity when:** data is messy, domain needs specialized knowledge, safety requires limiting capabilities.

### Cost Estimation

```
Total cost = items × tokens_per_item × price_per_token + 20-30% buffer
```

Track actual costs during development. If costs exceed estimates significantly, re-evaluate: reduce context length, use smaller models for simpler items, cache partial results.

## Examples

**Batch pipeline example:**
- Task: Analyze 930 discussions with hindsight grading
- Architecture: 5-stage pipeline with file system state
- Result: $58 total cost, ~1 hour execution

**Architectural reduction example:**
- Before: 17 specialized tools, 80% success, 274s average
- After: 2 tools (bash + SQL), 100% success, 77s average

## Guidelines
1. Validate task-model fit with manual prototyping before building automation
2. Structure pipelines as discrete, idempotent, cacheable stages
3. Use the file system for state management and debugging
4. Design prompts for structured, parseable outputs with explicit format examples
5. Start with minimal architecture; add complexity only when proven necessary
6. Estimate costs early and track throughout development
7. Build robust parsers that handle LLM output variations
8. Expect and plan for multiple architectural iterations
9. Test whether scaffolding helps or constrains model performance

## Integration
- Builds on: `context-fundamentals` (context constraints for prompt design), `filesystem-context` (file system state patterns)
- Related: `tool-design` (designing tools within pipelines), `evaluation` (evaluating pipeline outputs)

## Skill Metadata
- Created: 2025-12-25
- Last Updated: 2025-07-01
- Author: Adapted from Agent-Skills-for-Context-Engineering (Muratcan Koylan)
- Version: 1.0.0
