---
name: php-standard
description: Apply opinionated PHP 8.2+ and PHPUnit standards — `declare(strict_types=1)` everywhere, PSR-12 and PSR-4, value objects, and a test-first loop with Given-When-Then naming. Use when writing, reviewing, or testing PHP, wiring Composer autoloading, or setting up PHPUnit.
license: MIT
metadata:
  author: didacrios
  version: 1.1.0
---

# PHP & Testing Standards

Language-specific rules for PHP projects covering strict typing, PSR compliance, clean architecture, and PHPUnit testing conventions.

## When to Activate
- Writing or modifying PHP code (>= 8.2)
- Creating or updating PHPUnit tests
- Reviewing PHP code for standards compliance
- Setting up PHP project architecture

## Core Concepts
- **Strict typing everywhere** — `declare(strict_types=1)` in every file
- **PSR compliance** — PSR-12 coding style, PSR-4 autoloading
- **Value Objects** — domain concepts modeled as immutable objects
- **TDD flow** — one test at a time, written before the implementation

## Detailed Guidance

### Environment & Constraints
- **PHP Version:** Target >= 8.2. Use modern features (Readonly properties, Enums, Constructor Promotion) where applicable.
- **Strict Typing:** Always include `declare(strict_types=1);` at the top of every file.
- **PSR Standards:** Adhere strictly to PSR-12 (Coding Style) and PSR-4 (Autoloading).

### Clean Code & Architecture
- **Method Size:** Methods must be between 10 and 20 lines max.
- **Abstractions:** Use Value Objects for domain concepts (Email, Price, Id).
- **Inversion of Control:** Dependencies must be injected via constructor, preferably using promoted properties.

### Testing Protocol (PHPUnit)
- **Framework:** PHPUnit.
- **TDD Flow:** Create exactly one test before implementing the logic.
- **Naming:** `test[FunctionName]_[Scenario]_[ExpectedResult]`.
- **Structure:** Use **Given-When-Then** comments.

### Test Maintainability
- **Object Mother:** Use for complex entities.
- **Data Providers:** Use `@dataProvider` to keep tests DRY when testing multiple cases.
- **Location:** `tests/` mirroring `src/`.

### Recursive Verification
- **Autoloading:** Check `composer.json` or directory structure to ensure correct namespaces.
- **Type Tracing:** If a method returns a class, peek into that class to understand its structure before using the return value.

## Examples

**Test structure:**
```php
public function testCreateUser_WithValidData_ReturnsUser(): void
{
    // Given
    $email = EmailMother::random();
    // When
    $user = $this->service->create($email);
    // Then
    $this->assertEquals($email, $user->email());
}
```

## Guidelines
1. `declare(strict_types=1)` in every PHP file — no exceptions
2. PSR-12 coding style and PSR-4 autoloading
3. Methods between 10-20 lines; extract if longer
4. Value Objects for domain concepts (Email, Price, Id)
5. Constructor injection with promoted properties
6. One test before one implementation — no batch writing
7. Test naming: `test[Function]_[Scenario]_[Expected]`
8. Object Mother pattern for complex test entities
9. `@dataProvider` for multi-case tests

## Related skills

Optional companions, each installed separately.

- [`recursive-exploration`](../recursive-exploration/SKILL.md) — the tracing model behind this skill.
- [`refactor`](../refactor/SKILL.md) — the cleanup workflow that enforces the method-size rule.
- [`code-review`](../code-review/SKILL.md) — the review checklist for PHP diffs.
