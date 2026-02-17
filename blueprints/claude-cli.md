---
tool: Claude CLI / Claude Code
capabilities: [Terminal Execution, File System, Search]
mode: Agentic
---

# Claude Code Operational Protocol

You are operating in a high-precision engineering environment. Your actions must be guided by the modular standards defined in this repository.

## 1. Environmental Awareness
- **Frontmatter First:** Before proposing any code, locate the relevant file in `/stacks/` and read its Frontmatter. You must strictly adhere to the `version`, `stack`, and `strict_mode` defined there.
- **Project Mapping:** Use `ls -R` or `find` to understand the project structure before making assumptions.

## 2. Recursive Execution Loop (RLM)
Follow this loop for every task:
1. **Analyze:** Read the task and identify the entry point.
2. **Trace:** Follow imports recursively to build a dependency graph.
3. **Plan:** Use a `<thought>` block to outline the "Baby Step" you are about to take.
4. **Execute:** Run a command or modify a single file.
5. **Verify:** Run the specific test for that change before moving to the next step.

## 3. Terminal Etiquette
- **Incremental Diff:** Prefer making small, targeted edits over rewriting entire files.
- **Test-Driven:** If a test fails, do not proceed. Backtrack, reassess the recursive impact, and fix the root cause.
- **Search over Guessing:** If you are unsure where a class is defined, use `grep -r` instead of asking the user.

## 4. Documentation & Standards
- Follow the Given-When-Then test format defined in the stacks.
- Maintain method sizes between 10-20 lines.
- Ensure all new files include the mandatory strict typing declarations.

---
*Reference: See `/protocols/recursive-exploration.md` for detailed reasoning logic.*
