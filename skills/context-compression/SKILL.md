---
name: context-compression
version: 1.0.0
description: Activate when managing conversation history in long sessions, choosing compression strategies, or preserving critical information during context truncation.
triggers: [compression, summarization, long-session, truncation, context-loss, sliding-window]
---

# Context Compression Strategies

Strategies for managing conversation history when agent sessions generate extensive tokens. The core principle: optimize tokens-per-task (total tokens to completion), not tokens-per-request, since aggressive compression causing information loss triggers costly re-fetching.

## When to Activate
- Coding session has been running for many turns and context is growing
- Agent starts losing track of earlier decisions or file changes
- Need to choose between compression approaches for a long-running task
- Implementing context management for an agent system
- Planning a task that will require many turns to complete

## Core Concepts
- **Structure forces preservation:** Dedicated summary sections prevent silent information drift
- **Anchored > aggressive:** Slightly more tokens but significantly better recall
- **The artifact trail problem:** Tracking which files were created/modified/read is the hardest thing to preserve
- **Trigger at 70-80%:** Don't wait until context is completely full

## Detailed Guidance

### Anchored Iterative Summarization (Recommended)
Maintains structured, persistent summaries with dedicated sections:

```markdown
## Compression Summary
### Session Intent
Refactoring payment module to use Value Objects

### File Modifications
- Created: src/payment/Email.php (Value Object)
- Modified: src/payment/PaymentService.php (updated constructor)
- Read: src/checkout/Controller.php (identified as consumer)

### Key Decisions
- Using readonly properties for all Value Objects
- PHPUnit with Object Mother pattern for tests

### Next Steps
- Update CheckoutController to accept Email VO
- Create Price VO following same pattern
```

New compressions summarize only recently-truncated content, then merge with the existing summary. Each section must be explicitly populated — this forces preservation.

### Opaque Compression
Maximally compressed representations (99%+ reduction) optimized for reconstruction. Sacrifices interpretability — you can't verify what was preserved. **Not recommended** for coding tasks where precision matters.

### Regenerative Full Summary
Generates detailed structured summaries on each compression cycle. Readable but potentially loses details across repeated compressions since it regenerates fully rather than incrementally updating.

### Compression Timing
- **Trigger:** At 70-80% context utilization
- **Sliding window:** Maintain last N turns plus summary. Offers predictable context sizing.
- **Never compress:** The most recent 3-5 turns (active working memory)

### The Artifact Trail Problem
Tracking which files were created, modified, or read is the weakest dimension across all compression methods (scoring 2.2-2.5/5.0). Mitigate by:
- Keeping an explicit file modification log in the summary
- Using filesystem state (actual files on disk) as source of truth
- Re-scanning the working directory after compression

### Three-Phase Approach for Large Tasks
For tasks that will clearly exceed context:
1. **Research phase:** Produce architectural analysis document (write to file)
2. **Planning phase:** Convert research into implementation specification (write to file)
3. **Implementation phase:** Execute against the specification, not raw exploration

Each phase can start with a fresh context, reading the output of the previous phase from files.

## Examples

**Good compression preserves the artifact trail:**
```markdown
### Files Touched (Turns 1-20)
- Created: src/vo/Email.php, src/vo/Price.php, tests/vo/EmailTest.php
- Modified: src/service/Payment.php (lines 12-45), composer.json
- Read: src/controller/Checkout.php, src/repository/OrderRepo.php
```

**Bad compression loses it:**
```
"We worked on refactoring the payment module and made good progress."
```

## Guidelines
1. Use anchored iterative summarization for coding sessions
2. Trigger compression at 70-80% context utilization
3. Always maintain explicit file modification logs in summaries
4. Never compress the most recent 3-5 turns
5. Structure summary sections as checklists to force preservation
6. For large tasks, split into research/planning/implementation phases
7. Use filesystem state as source of truth after compression
8. Prefer slightly higher token usage over aggressive compression that loses details

## Integration
- Builds on: `context-fundamentals` (attention budget), `context-optimization` (when to trigger)
- Related: `filesystem-context` (file state survives compression), `recursive-exploration` (dependency maps should be persisted before compression)

## Skill Metadata
- Created: 2025-12-25
- Last Updated: 2025-07-01
- Author: Adapted from Agent-Skills-for-Context-Engineering (Muratcan Koylan)
- Version: 1.0.0
