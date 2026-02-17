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

### 1. The Modular Approach
Don't copy everything. Combine the modules you need for your current project.
Example: `protocols/recursive-exploration.md` + `stacks/typescript-standard.md`.

### 2. Tool Integration

#### **Cursor**
Create a `.cursorrules` file in your root directory and paste the combined instructions from the relevant blueprint. Or use the `.cursor/rules.md` structure.

#### **Claude (CLI & Web)**
For the CLI, use a `CLAUDE.md` file. For the Web version, add the protocols to the "Project Instructions".

#### **Gemini Code Assist**
Paste the protocols into the "System Instructions" to take advantage of the long context window without losing precision.

## 🛠️ Key Rules at a Glance
- 👶 **Baby Steps**: One logical change per iteration.
- 🧪 **TDD First**: One test at a time, Given-When-Then format.
- 📏 **Small Methods**: Max 20 lines per function.
- 🔍 **Strict Exploration**: Verify interfaces and types before implementation.

---
*Maintained by [didacrios]. Inspired by Recursive Language Modeling research (2025/26).*
