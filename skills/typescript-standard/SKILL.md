---
name: typescript-standard
description: Apply opinionated TypeScript and testing standards — strict mode with no `any`, 10-20 line methods, and a test-first loop using data builders, Faker, and Given-When-Then. Use when writing, reviewing, or testing TypeScript, setting up Jest or Playwright, or checking TS code against a project's conventions.
license: MIT
metadata:
  author: didacrios
  version: 1.1.0
---

# TypeScript & Testing Standards

Language-specific rules for TypeScript projects covering clean code constraints, TDD workflow, and testing framework conventions.

## When to Activate
- Writing or modifying TypeScript code
- Creating or updating tests in a TypeScript project
- Reviewing TypeScript code for standards compliance
- Setting up testing infrastructure (Jest, Playwright)

## Core Concepts
- **Strict typing everywhere** — no `any`, interfaces for all data structures
- **Small methods** — 10-20 lines maximum, extraction is mandatory
- **TDD flow** — one test at a time, written before the implementation

## Detailed Guidance

### Clean Code Constraints
- **Method Size:** Methods must be between 10 and 20 lines max.
- **Typing:** Strict mode enabled. No `any`. Use interfaces for all data structures.
- **Naming:** Variable and function names must be descriptive and self-documenting.
- **Simplification:** Avoid unnecessary abstractions. Prefer the simplest working solution.

### Testing Protocol (TDD)
- **One Test at a Time:** Create exactly one test before implementing the corresponding code.
- **Given-When-Then:** Use this format in comments to structure test logic.
- **Data Builders:** Use the `entity.data-builder.ts` pattern for test data.
- **Faker:** Use Faker for all default values to avoid hardcoded bias.
- **Naming Convention:** Use `file-name.spec.ts` and place tests near the production code.

### Testing Frameworks
- **Unit/Component:** Jest + React Testing Library.
- **E2E:** Playwright
- **Mocks:** Mock database calls; use `InMemoryRepositories` for adapters.
- **Coverage:** Minimum 80% coverage required.

## Examples

**Test structure:**
```typescript
// file: create-user.spec.ts
describe('CreateUser', () => {
  it('should create a user with valid data', () => {
    // Given
    const userData = aUser().withEmail('test@example.com').build();
    // When
    const result = createUser(userData);
    // Then
    expect(result.email).toBe('test@example.com');
  });
});
```

## Guidelines
1. Strict mode enabled — zero tolerance for `any`
2. Methods between 10-20 lines; extract if longer
3. One test before one implementation — no batch writing
4. Use Given-When-Then comments in every test
5. Data builders with Faker for test data — no hardcoded values
6. Tests live next to production code as `*.spec.ts`
7. Minimum 80% test coverage

## Related skills

Optional companions, each installed separately.

- [`recursive-exploration`](../recursive-exploration/SKILL.md) — the tracing model behind this skill.
- [`refactor`](../refactor/SKILL.md) — the cleanup workflow that enforces the method-size rule.
- [`code-review`](../code-review/SKILL.md) — the review checklist for TS diffs.
