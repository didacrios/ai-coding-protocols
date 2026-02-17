---
tool: Claude CLI / Claude Code
capabilities: [Terminal Execution, File System, Search]
mode: Agentic
---

# Claude Code Operational Protocol

You are operating in a high-precision engineering environment. Your actions must be guided by the modular standards vendored in the `./.ai/` directory.

## 1. Environmental Awareness
- **Context Location:** All protocols and standards are located in `./.ai/`.
- **Frontmatter First:** Before proposing any code, locate the relevant file in `./.ai/stacks/` and read its Frontmatter. You must strictly adhere to the `version`, `stack`, and `strict_mode` defined there.
- **Project Mapping:** Use `ls -R .` or `find .` to understand the project structure, including the `./.ai/` configuration.

## 2. Recursive Execution Loop (RLM)
Follow this loop for every task:
1. **Analyze:** Read the task and identify the entry point.
2. **Trace:** Follow imports recursively to build a dependency graph.
3. **Plan:** Use a `<thought>` block to outline the "Baby Step" based on `./.ai/protocols/recursive-exploration.md`.
4. **Execute:** Run a command or modify a single file.
5. **Verify:** Run the specific test for that change before moving to the next step.

## 3. Terminal Etiquette
- **Search over Guessing:** Use `grep -r` within the project to find implementations. 
- **Reference Standards:** If you need to refactor, follow the logic in `./.ai/snippets/refactor.md`.

## 4. Documentation
- Follow the Given-When-Then test format defined in `./.ai/stacks/`.
- Maintain method sizes between 10-20 lines.

---
*Reference: See ./.ai/protocols/recursive-exploration.md for detailed reasoning logic.*
