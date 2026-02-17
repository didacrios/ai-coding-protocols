# Stack: TypeScript & Testing Standards

## 1. Clean Code Constraints
- **Method Size:** Methods must be between 10 and 20 lines max.
- **Typing:** Strict mode enabled. No `any`. Use interfaces for all data structures.
- **Naming:** Variable and function names must be descriptive and self-documenting.
- **Simplification:** Avoid unnecessary abstractions. Prefer the simplest working solution.

## 2. Testing Protocol (TDD)
- **One Test at a Time:** Create exactly one test before implementing the corresponding code.
- **Given-When-Then:** Use this format in comments to structure test logic.
- **Data Builders:** Use the `entity.data-builder.ts` pattern for test data.
- **Faker:** Use Faker for all default values to avoid hardcoded bias.
- **Naming Convention:** Use `file-name.spec.ts` and place tests near the production code.

## 3. Testing Frameworks
- **Unit/Component:** Jest + React Testing Library.
- **E2E:** Playwright
- **Mocks:** Mock database calls; use `InMemoryRepositories` for adapters.
- **Coverage:** Minimum 80% coverage required.
