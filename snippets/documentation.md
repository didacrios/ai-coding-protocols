---
task: Documentation Generation
framework: Diátaxis
focus: [In-code comments, System Documentation, Technical Writing]
---

# Snippet: High-Precision Documentation Protocol

Apply this protocol when generating internal code comments or external system documentation. This snippet works in conjunction with the standards in `./.ai/stacks/`.

## 1. In-Code Documentation (The "Reference" layer)
Follow the recursive principle: documentation must explain **why**, not **what**.
- **TypeScript:** Use TSDoc. Explicitly document generics, complex union types, and interface contracts found in the project.
- **PHP:** Use PHPDoc. Mandatory `@throws` for all identified exceptions in the call chain.
- **Synchronization:** Documentation must be updated in the same "Baby Step" as the code change.

## 2. System Documentation (The `/docs/` Folder)
When generating files for the project's `/docs/` directory, strictly apply the **Diátaxis Framework**:

### A. Tutorials (Learning-oriented)
- Focus: "Learning by doing". Abstract complexity to guarantee a successful first run.

### B. How-To Guides (Problem-oriented)
- Focus: "Solving a specific task". Steps for real-world goals (e.g., "Adding a new Payment Gateway").

### C. Explanations (Understanding-oriented)
- Focus: "Concepts and Architecture". Discuss recursive dependencies, design patterns, and system constraints.

### D. Reference (Information-oriented)
- Focus: "Technical facts". Exhaustive descriptions of APIs, schemas, and classes.



## 3. Recursive Context Check
Before writing any documentation:
1. **Source Trace:** Read the actual implementation to ensure the documentation is technically accurate.
2. **Global Context:** Search the `./docs/` folder for existing guides to avoid duplication and maintain a consistent voice.
3. **Link Verification:** Ensure all file paths and cross-references between `./docs/` and source code are valid.

## 4. Tone & Style
- **The Invisible Author:** Objective, clear, and concise. No fluff.
- **Visuals:** Use Mermaid.js for architecture diagrams if the recursive logic spans more than 3 calls.
