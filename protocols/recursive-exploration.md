# Protocol: Recursive Exploration & Iterative Development

## 1. Core Philosophy (RLM-based)
- **Codebase as External Memory:** Treat the local project files as your primary and only source of truth. Do not rely on training data for project-specific logic.
- **Recursive Tracing:** Before any modification, trace the full "call chain". You must identify both the consumers (who calls this?) and the dependencies (what does this call?).
- **Context Pruning:** Actively ignore files that do not contribute to the current atomic task to maintain high reasoning density and avoid "lost in the middle" effects.

## 2. Iterative Workflow (Baby Steps)
- **Single Responsibility Step:** Address ONLY ONE logical change per interaction.
- **The "Look-Back" Rule:** After each execution, verify the result and reassess if the original plan remains valid or requires a recursive pivot.
- **Reasoning First:** You must document your exploration and plan in a `<thought>` block before generating any code.

## 3. Exploration & Tools
- **Active Discovery:** Use `grep`, `find`, or internal search tools to locate implementations. Proactive searching is mandatory before asking the user for locations.
- **Contract Verification:** Always "peek" into the source file of an `interface`, `type`, or `class` before using it. Never assume a data structure's shape.
- **Dependency Tree:** Before implementation, output a small tree-like map of the files you have explored and those you intend to modify.

## 4. Communication & Precision
- **Atomic Inquiry:** Ask only one clarifying question at a time to maintain focus.
- **Confidence Threshold:** If a dependency or implementation detail is outside your current context, you must stop and explicitly state: "I need to see [file_path] to proceed with high confidence."
- **No Assumptions:** Every inference about the codebase must be backed by a file read or a search result.
