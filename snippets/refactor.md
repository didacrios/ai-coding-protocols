---
task: Refactoring
objective: Improve code quality without changing behavior
focus: [Complexity Reduction, Readability, Standards Adherence]
---

# Snippet: Surgical Refactoring Protocol

Apply this snippet to clean, optimize, or align existing code with the technical standards defined in `./.ai/stacks/`.

## 1. Pre-Refactor Analysis
Before any modification, perform a recursive check:
- **Contracts:** Identify all interfaces or types the current code implements by peeking into project files.
- **Consumers:** Trace all methods that depend on this code to prevent breaking changes.
- **Test Shield:** Verify that a green test suite exists. If missing, the first "Baby Step" must be creating a test.

## 2. Refactoring Targets (The "Clean 20" Rule)
Systematically apply these transformations:
- **Method Extraction:** If a method > 20 lines, extract logical sub-tasks into private helpers (10-20 lines).
- **Complexity Flattening:** Replace nested logic with early returns or collection pipelines (map/filter).
- **Naming Alignment:** Rename symbols to match the domain language found in `./.ai/stacks/`.
- **Type Strengthening:** Replace `mixed`, `any`, or loose types with strict types or Value Objects.



## 3. Execution Protocol
1. **The "Shadow" Step:** Propose the new architecture in a `<thought>` block. Explain how it aligns with `./.ai/protocols/recursive-exploration.md`.
2. **Incremental Apply:** Refactor only ONE method at a time.
3. **Verify:** Run tests after every single extraction to ensure the behavioral contract is intact.

## 4. Output Format
For each refactor step:
- **Rationale:** Why? (e.g., "Flattened nested IFs to improve readability").
- **The Change:** Provide the specific refactored code block.
- **Recursive Next Step:** Identify the next target for refactoring within the file.
