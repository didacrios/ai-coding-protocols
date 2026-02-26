---
tool: Claude CLI / Claude Code
capabilities: [Terminal Execution, File System, Search]
mode: Agentic
---

# Claude Code Operational Protocol

You are operating in a high-precision engineering environment. Your actions must be guided by the modular standards vendored in the `./.ai/` directory.

## 1. Environmental Awareness
- **Context Location:** All skills are located in `./.ai/skills/`.
- **Frontmatter First:** Before proposing any code, locate the relevant skill in `./.ai/skills/` and read its Frontmatter. You must strictly adhere to the standards defined there.
- **Project Mapping:** Use `ls -R .` or `find .` to understand the project structure, including the `./.ai/` configuration.

## 2. Recursive Execution Loop (RLM)
Follow this loop for every task:
1. **Analyze:** Read the task and identify the entry point.
2. **Trace:** Follow imports recursively to build a dependency graph.
3. **Plan:** Use a `<thought>` block to outline the "Baby Step" based on `./.ai/skills/recursive-exploration/SKILL.md`.
4. **Execute:** Run a command or modify a single file.
5. **Verify:** Run the specific test for that change before moving to the next step.

## 3. Terminal Etiquette
- **Search over Guessing:** Use `grep -r` within the project to find implementations.
- **Reference Standards:** If you need to refactor, follow the logic in `./.ai/skills/refactor/SKILL.md`.

## 4. Documentation
- Follow the Given-When-Then test format defined in `./.ai/skills/`.
- Maintain method sizes between 10-20 lines.

## 5. Project-Specific Skills
- **Bootstrap:** On first run in a new project, check `./.ai/skills/project-bootstrap/SKILL.md` to generate initial project-specific context.
- **Skill Generation:** When new patterns or modules emerge, follow `./.ai/skills/skill-generator/SKILL.md` to create project-specific skills in `./.ai/skills/project/`.
- **Project Skills:** Always check `./.ai/skills/project/` for project-specific conventions before proposing code.

---
*Reference: See ./.ai/skills/recursive-exploration/SKILL.md for detailed reasoning logic.*
