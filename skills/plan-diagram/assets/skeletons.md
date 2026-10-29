# Plan diagram skeletons

Copy one, replace the nodes with real paths and symbols, keep the shapes.

## L2 — containers and boundaries

Question: *who may write to the `orders` store?*

```mermaid
flowchart LR
  subgraph api["api · HTTP boundary"]
    H["handlers/orders.go"]
  end

  subgraph domain["domain · business rules"]
    S["OrderService"]:::assumed
    P{{"refund-limit"}}
  end

  subgraph persistence["persistence · owner of writes"]
    R[["OrderRepository"]]
    DB[("orders")]
  end

  G(["payment gateway"])

  H -->|calls| S
  S -->|enforces| P
  S -->|calls| R
  R ==>|writes| DB
  S -.->|reads| G

  %% assumed: OrderService has no refund entry point yet; the seam is a guess
  classDef assumed stroke-dasharray:4 4,stroke:#888
```

## L3 — components inside one container

Question: *where does the refund guard sit inside `domain`?*

```mermaid
flowchart TB
  subgraph domain["domain · business rules"]
    S["OrderService"]
    C("Confirm(ctx)")
    X("Refund(ctx)")
    P{{"refund-limit"}}
    E[["Order"]]
  end

  R[["OrderRepository"]]

  S -->|calls| C
  S -->|calls| X
  X -->|enforces| P
  X -.->|reads| E
  X -->|calls| R

  classDef assumed stroke-dasharray:4 4,stroke:#888
```

## ASCII fallback

Only for destinations without a renderer. Same nodes, same edge verbs.

```
            +--- api ------------------+
            |  handlers/orders.go      |
            +-------------+-----------+
                          | calls
            +--- domain ---v-----------+
            |  OrderService            |
            |    | enforces            |
            |    v                     |
            |  < refund-limit >        |
            +-------------+------------+
                          | calls
            +--- persistence ----------+
            |  [OrderRepository]       |
            |        | writes          |
            |        v                 |
            |      (orders)            |
            +--------------------------+

  [ ]  file/module      { }  policy
  [x]  class/contract   ( )  method
  (x)  store            < >  assumption
```

## Assumptions

One class only, on assumptions, never on real nodes. The line below is a
fragment, not a diagram — paste it inside an existing `flowchart` block:

```text
classDef assumed stroke-dasharray:4 4,stroke:#888
```

Apply it with `:::assumed` on a node that already has a shape, then state the
assumption in the artifact's own words below the diagram — the dashed border is
a flag, not an explanation.

```mermaid
flowchart LR
  S["OrderService"]:::assumed
  R[["OrderRepository"]]

  S -->|calls| R

  classDef assumed stroke-dasharray:4 4,stroke:#888
```
