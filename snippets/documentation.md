---
task: Documentation Generation
framework: Diátaxis
focus: [In-code comments, System Documentation, Technical Writing]
---

# Snippet: High-Precision Documentation Protocol

Apply this protocol when generating internal code comments or external system documentation.

## 1. In-Code Documentation (The "Reference" layer)
Follow the recursive principle: documentation should explain **why**, not **what** (the code shows the "what").
- **TypeScript:** Use TSDoc. Document generics and complex union types.
- **PHP:** Use PHPDoc. Ensure all exceptions thrown by a method are documented with `@throws`.
- **Baby Step Doc:** If a method is refactored, the documentation must be updated in the same iteration.

## 2. System Documentation (The `/docs/` Folder)
When asked to document a feature or module, use the **Diátaxis Framework** to choose the right file type:

### A. Tutorials (Learning-oriented)
- Focus on the "First Steps".
- Abstract away the complexity. Goal: A successful first run.

### B. How-To Guides (Problem-oriented)
- Steps to achieve a specific real-world goal (e.g., "How to add a new Payment Gateway").
- Assume the user has basic knowledge.

### C. Explanations (Understanding-oriented)
- High-level architecture. Why did we choose this pattern? 
- Discuss recursive dependencies and system constraints.

### D. Reference (Information-oriented)
- Technical descriptions of APIs, schemas, and classes.
- Must be exhaustive and objective.

## 3. Recursive Context Check
Before documenting:
1. **Trace:** Read the implementation to ensure the documentation doesn't lie.
2. **Context:** Check if a similar guide exists in `/docs/` to maintain consistency.
3. **Verify:** Ensure all links between `/docs/` and code (like file paths) are correct.

## 4. Tone & Style
- Use "The Invisible Author" style: objective, clear, and concise.
- Use Mermaid.js for diagrams if the logic spans more than 3 recursive calls.
