---
name: plan-diagram
description: "Draw a coarse boxes-and-arrows model (C4-style) inside a plan, spec, or issue so the work is visible first. Use when planning, specifying, writing issues, or asked to diagram or sketch a change; not for call sequences."
license: MIT
metadata:
  author: didacrios
  version: 1.0.0
---

# Plan Diagram

Open every plan, spec, or issue with one picture: boxes for what already
exists — files, classes, methods, policies — and arrows for the couplings
between them. C4-shaped: level 2 for containers (modules, layers, boundaries),
level 3 for components inside one. Coarse on purpose, answering one question
in ten seconds.

## When to activate

- Writing a plan, spec, issue, RFC, or ADR that touches more than one file
- Asked to diagram, map, visualize, or sketch a change
- Placement is disputed: which layer, module, or file owns the logic
- A policy, guard, or invariant needs a home

Skip a single-file change with no coupling, and ordered call flow — a
`sequenceDiagram` is the honest picture there.

## Core concepts

- **One question per diagram**, written as the caption first ("who writes to
  the store?").
- **Boxes are real.** Every node is a path, symbol, or named policy from the
  repository; anything you cannot point at is an assumption and is marked.
- **Subgraphs are boundaries**: a deployable unit, package, bounded context, or
  trust boundary — never a grouping of convenience.
- **Two levels, rarely both.** L2 when the change crosses a container, L3 when
  it lives inside one; both only when the seam itself is the subject.

Shape carries meaning — pick the shape, do not decorate the label:

| Shape | Means | Example |
| --- | --- | --- |
| `[x]` rectangle | file or module | `handlers/orders.go` |
| `[[x]]` double border | class, interface, contract | `OrderRepository` |
| `(x)` rounded | method or entry point | `Confirm(ctx)` |
| `{{x}}` hexagon | policy, rule, guard, invariant | `refund-limit` |
| `[(x)]` cylinder | store | `orders` |
| `([x])` stadium | outside the boundary | `payment gateway` |

Edges: `-->|calls|` runtime dependency, `-.->|reads|` observation only,
`==>|writes|` mutation, `-->|enforces|` policy applied to a node.

## Process

1. **Write the caption.** One sentence stating what the diagram settles.
   *Done when:* it is answerable from the picture alone.
2. **Choose the level.** L2 if the change crosses a boundary, L3 if not.
   *Done when:* you can name the container the work lands in.
3. **Inventory from the source.** Only paths, symbols and policies that exist;
   append `?` to assumptions.
   *Done when:* every node traces to a file, symbol, or decision.
4. **Draw a `flowchart`.** `LR` or `TB`, one `subgraph` per boundary, quoted
   edge labels, at most about twelve nodes.
   *Done when:* it parses as Mermaid and reads without the prose.
5. **Place it inline**, a `mermaid` block right after the problem or goal and
   before any task breakdown.
   *Done when:* the picture precedes the wall of text.
6. **Fall back to ASCII** only where nothing renders — terminal, plain mail,
   unrendered diff. Same nodes, same verbs.

Skeletons to copy: `assets/skeletons.md`.

## Guidelines

1. Never use the Mermaid C4 blocks (`C4Context`, `C4Container`,
   `C4Component`): GitHub's bundled Mermaid has no C4 extension and prints them
   as raw text. Use `flowchart` plus `subgraph`.
2. Set no fills — a hardcoded `fill:` breaks dark themes. One `classDef` with
   `stroke-dasharray` marks assumptions; nothing else is styled.
3. Stop near twelve nodes. More means the question is too big: split it.
4. Label every edge with a verb. No unlabelled or bidirectional arrows.
5. Labels carry real paths and identifiers: no invented names, fields, or
   statuses.
6. Redraw when the plan changes; a stale diagram asserts a coupling that no
   longer holds.

## Related skills

Optional, installed separately.

- [`recursive-exploration`](../recursive-exploration/SKILL.md) — tracing the
  couplings that become the arrows.
- [`plan-initiative`](../plan-initiative/SKILL.md) — the brief this sits in.
