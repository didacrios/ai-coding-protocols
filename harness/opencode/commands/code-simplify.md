---
description: Simplify bounded code without changing behavior.
agent: developer
---

Simplify this scope:

$ARGUMENTS

Use `code-simplification`.

Flow:

1. Identify the exact scope and behavior that must be preserved.
2. Read related code and tests before editing.
3. Simplify only the requested code or code made unnecessarily complex by the
   current change.
4. Preserve behavior, errors, side effects, and observable contracts.
5. Run the most appropriate validation to prove behavior did not change.

Rules:

- Do not make unrelated adjacent refactors.
- Do not remove doubtful dead code without reporting it or asking for
  confirmation.
- Do not mix simplification with new features.
- If there is not enough coverage to preserve behavior confidently, state the
  risk and add a minimal test when scope allows.

Deliver:

1. What was simplified.
2. What behavior was preserved.
3. Files touched.
4. Validation run.
5. Risks or code intentionally left untouched.
