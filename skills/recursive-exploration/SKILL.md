---
name: recursive-exploration
description: Explore unfamiliar code before changing it by tracing consumers and dependencies recursively, then landing one verified step at a time. Use when starting a task in code you have not read, tracing how a change propagates, planning edits across multiple files, or debugging by following execution paths. Don't use it when the change sits entirely in a file you already read and understood.
license: MIT
metadata:
  author: didacrios
  version: 1.2.0
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

- **Recursive tracing** — before any modification, walk the call chain of the current step: consumers (who calls this?) and dependencies (what does this call?).
- **Contract verification** — read the source of an `interface`, `type`, or `class` before using it. Never assume the shape of a data structure.
- **Missing definitions** — when a called symbol's body is not in the repo, resolve it from documentation, its tests, or a small probe run. The identifier's name is a hypothesis, never evidence of behavior.
- **Context pruning** — ignore files that do not contribute to the current atomic step, to keep reasoning density high.
- **Confidence threshold** — when a detail sits outside your context, stop and say: "I need to see `[file_path]` to proceed with high confidence."

## Process

1. **Locate the entry point.** Search with `grep`, `find`, or the agent's search tool for the feature, symbol, or error text. Search first; ask the user for a path only after searching fails. If a structural index exists (call graph, codegraph, AST tooling), rank candidate entry points with it before reading any file body, and read the symbol rather than the whole file when the tool allows.
   *Done when:* you know which file the change starts in.
2. **Trace outward and inward.** Follow imports and call sites to map both consumers and dependencies. Read the real definitions, not the call sites' assumptions.
   *Done when:* every consumer and dependency the current step actually touches has been read, and anything deliberately deferred is named rather than silently skipped.
3. **Draw the dependency tree.** Print a small tree of the files explored and the files you intend to modify.
   *Done when:* the tree has been shown to the user.
4. **Reduce the change to one step.** Propose exactly one logical change, with the reasoning stated before any code.
   *Done when:* the user faces a single, reviewable step.
5. **Execute, verify, re-plan.** Run the relevant check or test, confirm the result, then reassess whether the original plan still holds. A claim about runtime behavior requires a run, a test, or a real execution trace. Simulating the code in your head is not evidence, including for code you just wrote.
   *Done when:* the step is verified green and the next step is known — or a pivot is explained and re-planned.

## Detailed guidance

### Iterative workflow

- **Single responsibility step** — address only one logical change per interaction.
- **The look-back rule** — after each execution, verify the result and reassess whether the original plan is still valid or needs a recursive pivot.
- **Reasoning first** — state the exploration and the plan before generating code, using the harness's reasoning block if it has one.

### Exploration and tools

- **Active discovery** — proactive searching is mandatory before asking the user for a location.

### Communication and precision

- **Atomic inquiry** — ask only one clarifying question at a time, to keep focus.
- **No assumptions** — every inference about the codebase is backed by a file read or a search result.

## Example

**Input:** "Add a new payment method to the checkout flow."

**Expected behavior:**

1. Search for existing payment-method implementations. If a structural index exists, rank the entry points before reading file bodies.
2. Trace the consumers and dependencies that first step touches, and name anything deferred.
3. Output a dependency tree of the files involved in that step.
4. Propose a single step: "First, I'll create the interface for the new payment adapter."
5. Execute, verify the runtime behavior with a run or a test, then propose the next step.

## Guidelines

1. Never modify code without first tracing its consumers and dependencies for the current step.
2. One logical change per step. A single change may touch interface, implementation, and test together; it must not bundle unrelated changes.
3. Search proactively; never ask the user for a file location before trying to find it.
4. State confidence gaps explicitly instead of guessing.
5. Verify each step before proposing the next one.
6. State the exploration and the plan before generating code, using the harness's reasoning block if it has one.
7. Back every codebase claim with a file read or a search result. A claim about runtime behavior also requires a run, a test, or a real execution trace.
