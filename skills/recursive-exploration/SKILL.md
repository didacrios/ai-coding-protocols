---
name: recursive-exploration
version: 1.0.0
description: Activate when exploring a codebase, tracing dependencies, or planning changes using recursive reasoning.
triggers: [explore, trace, investigate, dependency, reasoning, baby-steps, iterative]
---

# Recursive Exploration & Iterative Development

A protocol for systematic codebase exploration based on Recursive Language Modeling (RLM). Forces the AI to treat the codebase as external memory, trace call chains recursively, and make changes in small, verified steps.

## When to Activate
- Starting any new task that requires understanding existing code
- Tracing how a change propagates through the codebase
- Planning modifications that touch multiple files or modules
- Debugging by following execution paths

## Core Concepts
- **Codebase as External Memory:** The local project files are the only source of truth. Never rely on training data for project-specific logic.
- **Recursive Tracing:** Before any modification, trace the full call chain — consumers (who calls this?) and dependencies (what does this call?).
- **Context Pruning:** Actively ignore files that don't contribute to the current atomic task to maintain high reasoning density.

## Detailed Guidance

### Iterative Workflow (Baby Steps)
- **Single Responsibility Step:** Address ONLY ONE logical change per interaction.
- **The "Look-Back" Rule:** After each execution, verify the result and reassess if the original plan remains valid or requires a recursive pivot.
- **Reasoning First:** Document your exploration and plan in a `<thought>` block before generating any code.

### Exploration & Tools
- **Active Discovery:** Use `grep`, `find`, or internal search tools to locate implementations. Proactive searching is mandatory before asking the user for locations.
- **Contract Verification:** Always "peek" into the source file of an `interface`, `type`, or `class` before using it. Never assume a data structure's shape.
- **Dependency Tree:** Before implementation, output a small tree-like map of the files you have explored and those you intend to modify.

### Communication & Precision
- **Atomic Inquiry:** Ask only one clarifying question at a time to maintain focus.
- **Confidence Threshold:** If a dependency or implementation detail is outside your current context, stop and explicitly state: "I need to see [file_path] to proceed with high confidence."
- **No Assumptions:** Every inference about the codebase must be backed by a file read or a search result.

## Examples

**Input:** "Add a new payment method to the checkout flow."

**Expected behavior:**
1. Search for existing payment method implementations
2. Trace the checkout flow entry point through all dependent files
3. Output a dependency tree of files involved
4. Propose a single baby step (e.g., "First, I'll create the interface for the new payment adapter")
5. Execute, verify, then propose the next step

## Guidelines
1. Never modify code without first tracing its consumers and dependencies
2. One logical change per step — no multi-file bulk edits
3. Always verify results before proceeding to the next step
4. Use `<thought>` blocks to document reasoning before writing code
5. Search proactively — never ask the user for file locations without trying first
6. State confidence gaps explicitly rather than guessing

## Integration
- Used by: `code-review`, `refactor`, `documentation` (all skills reference this reasoning model)
- Referenced in: `blueprints/cursor-rules.md`, `blueprints/claude-cli.md`

## Skill Metadata
- Created: 2025-06-01
- Last Updated: 2025-07-01
- Author: didacrios
- Version: 1.0.0
