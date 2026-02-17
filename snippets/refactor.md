---
task: Refactoring
objective: Improve code quality without changing behavior
focus: [Complexity Reduction, Readability, Standards Adherence]
---

# Snippet: Surgical Refactoring Protocol

Apply this snippet when the goal is to clean, optimize, or align existing code with our technical standards.

## 1. Pre-Refactor Analysis
Before touching the code, perform a recursive check:
- **Contracts:** Identify all interfaces or types the current code implements.
- **Consumers:** List all files/methods that depend on this code to ensure signature changes don't break them.
- **Tests:** Verify that a test suite exists and is green. If not, ask to create a test first.

## 2. Refactoring Targets (The "Clean 20" Rule)
Systematically apply these transformations:
- **Method Extraction:** If a method exceeds 20 lines, extract logical sub-tasks into private helper methods (10-20 lines each).
- **Complexity Flattening:** Reduce nested `if/else` or `loops` by using early returns or collection pipelines (map/filter/reduce).
- **Naming Alignment:** Rename variables and functions to match the domain language identified in the `stacks/` definitions.
- **Type Strengthening:** Replace `mixed` or `any` with specific types or Value Objects.

## 3. Execution Protocol
1. **The "Shadow" Step:** Propose the new structure in a `<thought>` block first.
2. **Incremental Apply:** Refactor one method at a time. Do not rewrite the whole file in one go.
3. **Verify:** After each extraction, run the tests to ensure the "behavioral contract" remains intact.

## 4. Output Format
For each refactor, provide:
- **Rationale:** Why was this change made? (e.g., "Extracted validation logic to reduce cyclomatic complexity").
- **The Change:** The refactored code block.
- **Next Step:** Identify the next method that needs attention.
