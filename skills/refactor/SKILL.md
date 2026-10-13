---
name: refactor
description: Refactor code surgically without changing behavior — trace consumers first, require a green test suite, then transform one method per step with tests after each. Use when cleaning up after a feature, reducing method length or complexity, extracting helpers, aligning code with a stack standard, or renaming symbols to domain language.
license: MIT
metadata:
  author: didacrios
  version: 1.1.0
---

# Surgical Refactoring Protocol

A protocol for safely improving code quality without changing external behavior. Combines recursive tracing with incremental, test-verified transformations.

## When to Activate
- Cleaning up code after a feature is complete
- Reducing method length or cyclomatic complexity
- Aligning existing code with stack standards
- Extracting reusable logic from large methods
- Renaming symbols to match domain language

## Core Concepts
- **Behavior preservation** — refactoring must not change external behavior
- **Test shield** — green tests must exist before any refactoring begins
- **One method at a time** — incremental changes, verified after each step
- **The "Clean 20" rule** — methods over 20 lines are mandatory extraction targets

## Detailed Guidance

### Pre-Refactor Analysis
Before any modification, perform a recursive check:
- **Contracts:** Identify all interfaces or types the current code implements by peeking into project files.
- **Consumers:** Trace all methods that depend on this code to prevent breaking changes.
- **Test Shield:** Verify that a green test suite exists. If missing, the first "Baby Step" must be creating a test.

### Refactoring Targets (The "Clean 20" Rule)
Systematically apply these transformations:
- **Method Extraction:** If a method > 20 lines, extract logical sub-tasks into private helpers (10-20 lines).
- **Complexity Flattening:** Replace nested logic with early returns or collection pipelines (map/filter).
- **Naming Alignment:** Rename symbols to match the domain language found in the relevant stack skill.
- **Type Strengthening:** Replace `mixed`, `any`, or loose types with strict types or Value Objects.

### Execution Protocol
1. **The "Shadow" Step:** Propose the new architecture in a `<thought>` block. Explain how it aligns with the tracing rules in [`recursive-exploration`](../recursive-exploration/SKILL.md).
2. **Incremental Apply:** Refactor only ONE method at a time.
3. **Verify:** Run tests after every single extraction to ensure the behavioral contract is intact.

### Output Format
For each refactor step:
- **Rationale:** Why? (e.g., "Flattened nested IFs to improve readability").
- **The Change:** Provide the specific refactored code block.
- **Recursive Next Step:** Identify the next target for refactoring within the file.

## Examples

**Input:** A 35-line method with nested conditionals.

**Step 1 output:**
- **Rationale:** "Method exceeds 20 lines. Extracting validation logic into `validateInput()`."
- **Change:** Show extracted method and updated caller.
- **Next:** "The remaining method is 18 lines. Next target: flatten the nested if/else at line 12."

## Guidelines
1. Never refactor without a green test suite — create tests first if missing
2. Trace all consumers before modifying any method signature
3. One method per step — never batch refactor
4. Run tests after every extraction
5. Methods must be 10-20 lines after refactoring
6. Replace loose types with strict types or Value Objects
7. Document rationale for every change

## Related skills

Optional companions, each installed separately. If one is not present, apply its rules manually.

- [`recursive-exploration`](../recursive-exploration/SKILL.md) — required before changing a method signature.
- [`typescript-standard`](../typescript-standard/SKILL.md) and [`php-standard`](../php-standard/SKILL.md) — the target standards for the stack.
- [`code-review`](../code-review/SKILL.md) — where refactor suggestions usually originate.
