---
name: code-review
version: 1.0.0
description: Activate when reviewing branches, commits, or pull requests using the emoji-driven review protocol.
triggers: [review, pr, pull-request, code-review, merge, diff]
---

# Emoji-Driven Code Review Protocol

A systematic review protocol for branches, commits, or pull requests. Every comment is prefixed with an emoji to signal intent and severity, producing structured, actionable feedback.

## When to Activate
- Reviewing a pull request or merge request
- Reviewing a branch diff or set of commits
- Performing a code audit on existing code
- Providing structured feedback on code changes

## Core Concepts
- **Emoji-prefixed comments** — every finding uses a fixed emoji to signal intent
- **Only bugs and changes block merges** — all other emojis are informational
- **Recursive tracing before reviewing** — trace consumers and dependencies of changed code
- **Constructive feedback** — every blocking issue includes a suggested fix

## Detailed Guidance

### Emoji Legend

| Emoji | Tag | Intent | Action Required? |
|-------|-----|--------|-----------------|
| 🐛 | `bug` | Potential bug or incorrect behavior. Explain the failure scenario and suggest a fix. | **Yes — Must fix** |
| 🔧 | `change` | Concrete change request. A concern or improvement that should be addressed before merging. | **Yes — Should fix** |
| ♻️ | `refactor` | Refactoring suggestion. Include pseudo-code or a brief outline of the proposed simplification. | **Yes — Consider** |
| ❓ | `question` | A question that needs an answer to continue the review. Provide enough context for a clear response. | **Yes — Reply needed** |
| 💭 | `thought` | Thinking out loud. Sharing an alternative approach or walking through the code to verify understanding. | No |
| 🌱 | `seed` | Planting a seed. An observation with larger implications worth exploring in a follow-up task. | No |
| 👍 | `praise` | Highlight something well done. Positive reinforcement for good patterns, clean abstractions, or clever solutions. | No |
| ⛏ | `nit` | Nitpick. Minor style or formatting preference. Not worth blocking a merge. | No |
| 📌 | `out-of-scope` | A concern that falls outside the current change. Should be tracked as a separate issue or task. | No — Track separately |

**Rule:** Only 🐛 and 🔧 comments block a merge. All other emojis are informational or advisory.

### Pre-Review Analysis

Before writing any comment, perform a recursive assessment:

1. **Scope Mapping:** Read the PR description or commit messages. Identify the stated goal of the change.
2. **Diff Trace:** Walk through the diff file-by-file. For each changed file, trace its consumers and dependencies using the project's import graph.
3. **Standards Check:** Load the relevant stack skill and verify the diff against its rules (method size, typing, naming, test coverage).
4. **Test Verification:** Check if new or modified logic has corresponding test coverage. Flag gaps as 🐛 or 🔧.

### Review Structure

Organize the review output in this order:

#### A. Summary
A 2-3 sentence overview of the change: what it does, whether it achieves its stated goal, and the overall quality impression.

#### B. Findings (grouped by severity)

Present findings in descending severity order:

1. **🐛 Bugs** — Critical issues first.
2. **🔧 Changes** — Required improvements.
3. **♻️ Refactors** — Simplification opportunities.
4. **❓ Questions** — Things that need clarification.
5. **💭 Thoughts / 🌱 Seeds** — Ideas and future considerations.
6. **⛏ Nits** — Minor style notes.
7. **👍 Praise** — Positive highlights.

Each finding must include:
- **Location:** `file_path:line_number` (or line range).
- **Comment:** The emoji-prefixed observation.
- **Suggestion:** For 🐛, 🔧, and ♻️ — provide a concrete code snippet or pseudo-code showing the proposed fix.

#### C. Verdict

Close the review with one of:

| Verdict | Meaning |
|---------|---------|
| ✅ **Approve** | No blocking issues. Ready to merge. |
| 🔄 **Request Changes** | Has 🐛 or 🔧 findings that must be resolved. |
| 💬 **Comment** | Has ❓ questions that need answers before a decision. |

### Quality Gates

Cross-reference every diff against these checks:

- **Method Length:** Flag methods exceeding 20 lines → 🔧 or ♻️.
- **Type Safety:** Flag `any`, `mixed`, or loose types → 🔧.
- **Test Coverage:** Flag untested public methods or branches → 🐛.
- **Naming:** Flag symbols that don't match the domain language → ⛏ or 🔧.
- **Complexity:** Flag nested conditionals deeper than 2 levels → ♻️.
- **Side Effects:** Flag functions mixing queries and commands → 💭 or ♻️.
- **Dependencies:** Trace imports to detect circular dependencies or unnecessary coupling → 🌱.

### Tone & Conduct

- **Objective:** Review the code, not the author. Use impersonal language ("This method..." not "You wrote...").
- **Constructive:** Every 🐛 and 🔧 must include a suggested fix. Never flag a problem without offering a path forward.
- **Balanced:** Include at least one 👍 per review. Acknowledge what was done well.
- **Concise:** Keep each comment to 1-3 sentences plus the code suggestion when applicable.

## Examples

**Single finding:**
> 🐛 `src/checkout/payment.ts:42` — This method doesn't handle the case where `gateway.charge()` throws. The promise rejection will propagate unhandled.
> **Suggestion:** Wrap in try/catch and return a `PaymentResult.failed(error)`.

## Guidelines
1. Always perform pre-review analysis before writing any comment
2. Prefix every comment with the appropriate emoji
3. Only 🐛 and 🔧 block a merge
4. Every blocking finding must include a concrete suggested fix
5. Include at least one 👍 per review
6. Review the code, not the author — use impersonal language
7. Keep comments to 1-3 sentences plus code suggestion

## Integration
- Depends on: `recursive-exploration` (tracing methodology), `typescript-standard` or `php-standard` (quality gates)
- Related: `refactor` (for implementing suggested refactors)

---
*References: [Emoji Code (dev.to)](https://dev.to/juanvegadev/start-doing-better-code-reviews-tomorrow-the-emoji-code-3jf6), [Code Review Emoji Guide (GitHub)](https://github.com/erikthedeveloper/code-review-emoji-guide)*

## Skill Metadata
- Created: 2025-06-01
- Last Updated: 2025-07-01
- Author: didacrios
- Version: 1.0.0
