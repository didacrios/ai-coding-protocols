# AI Coding Protocols 🤖🧠

> Modular framework for high-precision AI assistance based on **Recursive Language Modeling (RLM)**.

This repository provides a standardized set of instructions to transform LLMs (Cursor, Claude, Gemini) into senior software engineering agents. Instead of relying on massive context windows, these protocols force the AI to explore codebases programmatically and recursively.



## 🏗️ Architecture

The repository is organized into four modular layers:

* **`/protocols`**: The "Thinking Engine". Rules for recursive exploration, baby steps, and reasoning.
* **`/stacks`**: The "Technical Standards". Language-specific rules (TypeScript, PHP), testing patterns, and architectural constraints.
* **`/blueprints`**: The "Integration Layer". Pre-assembled configurations for specific tools like `.cursorrules` or `CLAUDE.md`.
* **`/snippets`**: The "Task Toolbox". Short, reusable prompts for refactoring, documentation, or debugging.

## 🧬 Core Philosophy: Recursive Reasoning (RLM)

Inspired by the MIT CSAIL research on [Recursive Language Models](https://arxiv.org/pdf/2512.24601), this framework implements:

1.  **Codebase as External Memory**: The AI must query and explore files instead of guessing.
2.  **Recursive Tracing**: If a function is modified, the AI must recursively check all its call sites and dependencies.
3.  **Inference-Time Scaling**: We trade speed for quality by forcing the AI to "think" and "explore" before it "writes".

## 🚀 How to Use

### 1. Installation (The Vendor Pattern)
To maintain coherence and provide the AI with the necessary context, you should copy these protocols into a `.ai/` folder within your project.

You can use the built-in command to "vendor" the protocols into any project:

```bash
make ai dest=ruta/del/teu/projecte
```` 

This will create a `.ai/` directory in the destination project with all the protocols, stacks, and snippets.

### 2. Tool Integration

#### Cursor

Create a `.cursorrules` file in your project root. Reference the vendored files:

> Follow the reasoning logic in `./.ai/protocols/recursive-exploration.md` and the standards in `./.ai/stacks/typescript-standard.md.`

### Claude (CLI & Web)

For Claude Code (CLI), use a CLAUDE.md file that references the ./.ai/ directory. For the Web version, paste the relevant protocols into "Project Instructions".

### Gemini Code Assist

Paste the protocols into the "System Instructions" to guide Gemini's 2M context window with high-precision rules.

### 🛠️ Key Rules at a Glance
- 👶 Baby Steps: One logical change per iteration.
- 🧪 TDD First: One test at a time, Given-When-Then format.
- 📏 Small Methods: Max 20 lines per function.
- 🔍 Strict Exploration: Verify interfaces and types before implementation.

---
*Maintained by [didacrios]. Inspired by Recursive Language Modeling research (2025/26).*
