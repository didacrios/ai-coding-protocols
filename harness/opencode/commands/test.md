---
description: Design or run focused test validation for a task, bug, or diff.
agent: developer
---

Test objective:

$ARGUMENTS

Use the matching local skills:

- `test-driven-development` for behavior changes, bugs, or new tests.
- `debugging-and-error-recovery` when there is a failure, trace, or unexpected
  behavior.

Flow:

1. Identify expected behavior, scope, and success criteria.
2. For bugs, reproduce first with a test or observable evidence.
3. Add or adjust the minimum test that proves the behavior.
4. Run the narrowest useful validation.
5. If implementation is needed to make the test pass and scope is clear,
   implement the minimum code required.
6. Run final reasonable validation and summarize the evidence.

Rules:

- Do not replace `/feature` when spec, research, or scope decisions are missing.
- Do not write tests that only verify fragile internals.
- Do not claim success for a reproducible bug unless you saw the new test fail,
  unless you explain why that was not viable.
- Do not expand refactors beyond the tested behavior.

Deliver:

1. Test or validation added.
2. Before/after result when applicable.
3. Implementation changes, if any.
4. Commands run.
5. Risks or pending coverage.
