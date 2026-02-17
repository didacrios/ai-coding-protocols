# Protocol: Recursive Exploration & Iterative Development

## 1. Core Philosophy (RLM-based)
- **Codebase as External Memory:** Do not rely on your internal training data. Treat the local files as the only source of truth.
- **Recursive Tracing:** Before modifying any code, you must trace the "call chain". If you touch a function, you must know who calls it and what it calls.
- **Context Pruning:** Discard irrelevant files immediately to keep the reasoning chain sharp and avoid "lost in the middle" errors.

## 2. Iterative Workflow (Baby Steps)
- **Single Responsibility Step:** Every response must address ONLY ONE logical change.
- **The "Look-Back" Rule:** After every step, reassess if the previous assumptions still hold true.
- **Drafting before Coding:** Describe the intended change in a `<thought>` block or "Natural Thought Flow" before writing a single line of code.

## 3. Exploration Commands (Tool usage)
- **Grep & Find:** Use search tools to find implementations, don't just ask me "where is X".
- **Interface Peek:** Always check the `interface` or `type` definition in the source file before using a data structure.
- **Dependency Mapping:** List the affected files in a tree-like structure before starting the implementation.

## 4. Communication Contract
- **One Question Policy:** Ask only one clarifying question at a time.
- **Uncertainty Flagging:** If a dependency is missing from your current context, explicitly state: "I need to see [file_path] to proceed with high confidence."
