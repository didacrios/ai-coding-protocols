---
name: recursive-exploration
description: Explore unfamiliar code before changing it by tracing consumers and dependencies recursively, then landing one verified step at a time. Use when starting a task in code you have not read, tracing how a change propagates, planning edits across multiple files, or debugging by following execution paths. Don't use it when the change sits entirely in a file you already read and understood.
license: MIT
metadata:
  author: didacrios
  version: 1.1.0
---

# Recursive Exploration

A protocol for systematic codebase exploration, inspired by Recursive Language Modeling (RLM). Treat the codebase as external memory: trace call chains recursively, prune everything that does not serve the current step, and land changes in small, verified increments.

**The codebase is the source of truth.** Project files are the only evidence for project logic. Training data may be stale or simply wrong about this codebase: a file read or a search result is evidence, a recollection is not.

## When to activate

- Starting a task in code you have not read
- Tracing how a change propagates through the codebase
- Planning modifications that touch multiple files or modules
- Debugging by following an execution path

Skip it when the whole change lives in a file you already read and understood in this session.

## Core concepts

- **Recursive tracing** — before any modification, walk the full call chain: consumers (who calls this?) and dependencies (what does this call?).
- **Contract verification** — read the source of an `interface`, `type`, or `class` before using it. Never assume the shape of a data structure.
- **Context pruning** — ignore files that do not contribute to the current atomic step, to keep reasoning density high.
- **Confidence threshold** — when a detail sits outside your context, say so and name the file you need rather than guessing.

## Process

1. **Locate the entry point.** Search with `grep`, `find`, or the agent's search tool for the feature, symbol, or error text. Search first; ask the user for a path only after searching fails.
   *Done when:* you know which file the change starts in.
2. **Trace outward and inward.** Follow imports and call sites to map both consumers and dependencies. Read the real definitions, not the call sites' assumptions.
   *Done when:* every file the change can reach, and every file that can reach it, is either read or explicitly ruled out.
3. **Draw the dependency tree.** Print a small tree of the files explored and the files you intend to modify.
   *Done when:* the tree has been shown to the user.
4. **Reduce the change to one step.** Propose exactly one logical change, with the reasoning stated before any code.
   *Done when:* the user faces a single, reviewable step.
5. **Execute, verify, re-plan.** Run the relevant check or test, confirm the result, then reassess whether the original plan still holds.
   *Done when:* the step is verified green and the next step is known — or a pivot is explained and re-planned.

## Detailed guidance

### Iterative workflow

- **Single responsibility step** — address only one logical change per interaction.
- **The look-back rule** — after each execution, verify the result and reassess whether the original plan is still valid or needs a recursive pivot.
- **Reasoning first** — document the exploration and the plan in a `<thought>` block before generating code.

### Exploration and tools

- **Active discovery** — proactive searching is mandatory before asking the user for a location.
- **Contract verification** — "peek" into the source of any `interface`, `type`, or `class` before using it.
- **Dependency tree** — before implementation, output a small tree-like map of the files explored and the files to be modified.

### Communication and precision

- **Atomic inquiry** — ask only one clarifying question at a time, to keep focus.
- **Confidence threshold** — if a dependency or implementation detail is outside the current context, stop and say: "I need to see `[file_path]` to proceed with high confidence."
- **No assumptions** — every inference about the codebase is backed by a file read or a search result.

## Example

**Input:** "Add a new payment method to the checkout flow."

**Expected behavior:**

1. Search for existing payment-method implementations.
2. Trace the checkout flow entry point through every dependent file.
3. Output a dependency tree of the files involved.
4. Propose a single step: "First, I'll create the interface for the new payment adapter."
5. Execute, verify, then propose the next step.

## Guidelines

1. Never modify code without first tracing its consumers and dependencies.
2. One logical change per step — no multi-file bulk edits.
3. Search proactively; never ask the user for a file location before trying to find it.
4. State confidence gaps explicitly instead of guessing.
5. Verify each step before proposing the next one.
6. Document the reasoning in a `<thought>` block before writing code.
7. Back every codebase claim with a file read or a search result.

## Related skills

Optional companions, each installed separately. If one is not present, apply its rules manually.

- [`refactor`](../refactor/SKILL.md) — needs this tracing model before changing a method.
- [`code-review`](../code-review/SKILL.md) — uses the same consumer/dependency trace to scope a diff.
- [`documentation`](../documentation/SKILL.md) — traces the implementation before describing it.
