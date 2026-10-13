---
name: documentation
description: Write in-code comments and system documentation that explain why rather than what, using the Diátaxis framework for external docs. Use when adding TSDoc or PHPDoc, creating a README, tutorial, how-to guide, explanation, or reference page, or documenting an API or schema.
license: MIT
metadata:
  author: didacrios
  version: 1.1.0
---

# High-Precision Documentation Protocol

A protocol for generating in-code comments and system documentation. Uses the Diátaxis framework for external docs and enforces "explain why, not what" for inline comments.

## When to Activate
- Writing or updating in-code documentation (TSDoc, PHPDoc)
- Creating system documentation in a `/docs/` folder
- Generating READMEs, tutorials, or how-to guides
- Documenting APIs, schemas, or architectural decisions

## Core Concepts
- **Why, not what** — documentation explains reasoning, not mechanics
- **Diátaxis framework** — four types of docs, each with a clear purpose
- **Synchronized updates** — docs update in the same step as the code change
- **Source-verified** — read the implementation before writing about it

## Detailed Guidance

### In-Code Documentation (The "Reference" Layer)
Follow the recursive principle: documentation must explain **why**, not **what**.
- **TypeScript:** Use TSDoc. Explicitly document generics, complex union types, and interface contracts found in the project.
- **PHP:** Use PHPDoc. Mandatory `@throws` for all identified exceptions in the call chain.
- **Synchronization:** Documentation must be updated in the same "Baby Step" as the code change.

### System Documentation (The `/docs/` Folder)
When generating files for the project's `/docs/` directory, strictly apply the **Diátaxis Framework**:

#### A. Tutorials (Learning-oriented)
- Focus: "Learning by doing". Abstract complexity to guarantee a successful first run.

#### B. How-To Guides (Problem-oriented)
- Focus: "Solving a specific task". Steps for real-world goals (e.g., "Adding a new Payment Gateway").

#### C. Explanations (Understanding-oriented)
- Focus: "Concepts and Architecture". Discuss recursive dependencies, design patterns, and system constraints.

#### D. Reference (Information-oriented)
- Focus: "Technical facts". Exhaustive descriptions of APIs, schemas, and classes.

### Recursive Context Check
Before writing any documentation:
1. **Source Trace:** Read the actual implementation to ensure the documentation is technically accurate.
2. **Global Context:** Search the `./docs/` folder for existing guides to avoid duplication and maintain a consistent voice.
3. **Link Verification:** Ensure all file paths and cross-references between `./docs/` and source code are valid.

### Tone & Style
- **The Invisible Author:** Objective, clear, and concise. No fluff.
- **Visuals:** Use Mermaid.js for architecture diagrams if the recursive logic spans more than 3 calls.

## Examples

**Good inline comment (why):**
```typescript
// Retry up to 3 times because the payment gateway occasionally returns
// transient 503 errors during high-traffic windows.
const result = await retry(3, () => gateway.charge(amount));
```

**Bad inline comment (what):**
```typescript
// Charge the amount using the gateway
const result = await gateway.charge(amount);
```

## Guidelines
1. Explain **why**, never **what** — the code already shows what
2. TSDoc for TypeScript, PHPDoc for PHP — no exceptions
3. Document `@throws` for all exceptions in the call chain (PHP)
4. Update docs in the same step as the code change
5. Apply Diátaxis: tutorials, how-to guides, explanations, reference
6. Read the implementation before writing about it
7. Check for existing docs before creating new ones

## Related skills

Optional companions, each installed separately.

- [`typescript-standard`](../typescript-standard/SKILL.md) — TSDoc conventions.
- [`php-standard`](../php-standard/SKILL.md) — PHPDoc conventions.
- [`recursive-exploration`](../recursive-exploration/SKILL.md) — read the implementation before writing about it.
