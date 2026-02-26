---
name: filesystem-context
version: 1.0.0
description: Activate when managing large outputs, persisting plans across turns, or using the filesystem as a context layer for agent workflows.
triggers: [filesystem, scratch-pad, plan-persistence, offload, large-output, file-state]
---

# Filesystem-Based Context Engineering

The filesystem provides a persistent layer where agents write once and read selectively, offloading bulk content while preserving the ability to retrieve specific information. This skill addresses the core challenge: context windows are limited, but tasks often require more information than fits within them.

## When to Activate
- Tool outputs exceed ~2000 tokens (test results, logs, API responses)
- Tasks span multiple turns and need persistent state
- Multiple agents or sub-agents need shared state
- System prompt is getting too large with static skill content
- Need to track progress on long-running coding tasks

## Core Concepts
- **Write once, read selectively:** Dump large outputs to files, then grep/read specific sections as needed
- **File existence as state:** Use file presence to gate pipeline stages (idempotency for free)
- **Static vs dynamic context:** Balance always-loaded context with on-demand file reads
- **Metadata as navigation:** File names, sizes, and timestamps hint at relevance without reading content

## Detailed Guidance

### Scratch Pad Pattern
Write large tool outputs (>2000 tokens) to files rather than keeping them in message history. This allows targeted retrieval instead of carrying everything forward.

**When to use:** Test suite output, build logs, API responses, large file contents, search results spanning many files.

```bash
# Instead of dumping full test output into context:
pytest --tb=short > /tmp/test-results.txt

# Then read selectively:
grep "FAILED" /tmp/test-results.txt
```

### Plan Persistence
Store structured plans in files so agents can re-read objectives and track progress across long conversations. Prevents losing track of multi-step tasks when context compresses.

```markdown
# .ai/current-plan.md
## Objective
Refactor payment module to use Value Objects

## Steps
- [x] Create Email value object
- [x] Create Price value object
- [ ] Update PaymentService to use VOs
- [ ] Update tests

## Current Step
Updating PaymentService — see src/payment/service.ts
```

### Sub-Agent Communication
Multiple agents writing findings directly to shared filesystem locations preserves information fidelity better than passing through a coordinator (avoids the "telephone game" problem).

### Dynamic Skill Loading
Store instruction sets as files and load them only when relevant, rather than stuffing all skills into the system prompt. This is exactly what the `.ai/skills/` directory pattern enables.

**Static context** (always loaded): Skill names and triggers in system prompt
**Dynamic context** (loaded on-demand): Full SKILL.md content when a trigger matches

### Terminal/Log Persistence
Sync terminal output to searchable files. Instead of scrolling through long command output in context, write to a file and grep for relevant sections.

### Self-Modification (with caution)
Agents can write learned preferences to instruction files (like CLAUDE.md memory sections) for incorporation in subsequent sessions. Use sparingly — validate before persisting.

## Examples

**File-system state machine for a migration task:**
```
data/migration/
├── analysis.md       # Research phase complete
├── plan.md           # Planning phase complete
├── users.sql         # Users table migrated
└── orders.sql        # Orders table migrated
# Missing: inventory.sql = next step
```

**Offloading build output:**
```bash
# Bad: 500 lines of webpack output flooding context
npm run build

# Good: Offload and query
npm run build > /tmp/build-output.txt 2>&1
grep -E "ERROR|WARNING" /tmp/build-output.txt
```

## Guidelines
1. Offload tool outputs >2000 tokens to files, then read selectively
2. Use file existence to track pipeline/task progress
3. Keep plans in persistent files for multi-turn tasks
4. Load skills dynamically — don't stuff everything into system prompts
5. Write terminal output to files for searchable debugging
6. Use file metadata (name, size, timestamp) as navigation hints before reading
7. Prefer filesystem state over in-memory state for anything that spans turns

## Integration
- Builds on: `context-fundamentals` (progressive disclosure principle)
- Related: `context-optimization` (observation masking uses filesystem offload), `context-compression` (file state survives compression), `recursive-exploration` (dependency trees can be persisted)

## Skill Metadata
- Created: 2025-12-20
- Last Updated: 2025-07-01
- Author: Adapted from Agent-Skills-for-Context-Engineering (Muratcan Koylan)
- Version: 1.0.0
