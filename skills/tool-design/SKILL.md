---
name: tool-design
version: 1.0.0
description: Activate when designing MCP tools, custom agent tools, or optimizing tool descriptions and parameters for agent consumption.
triggers: [tool-design, mcp, tool-description, api-design, agent-tools, function-calling]
---

# Tool Design for Agents

Principles for designing tools that agents can use effectively. Tool descriptions are loaded into agent context and collectively steer behavior — they function as prompt engineering. A well-designed tool reduces the agent's cognitive load; a poorly designed one causes confusion and errors.

## When to Activate
- Designing new MCP tools or custom function tools
- Debugging agent tool selection errors (wrong tool chosen)
- Optimizing existing tool descriptions for better agent performance
- Deciding how many tools an agent needs
- Building API wrappers for agent consumption

## Core Concepts
- **Consolidation principle:** If a human can't definitively say which tool to use, an agent can't either
- **Descriptions are prompts:** Tool descriptions steer behavior as much as system prompts do
- **Fewer tools, better results:** 10-20 tools is the sweet spot; beyond that, use namespacing
- **Design for recovery:** Error messages should guide agents toward correction

## Detailed Guidance

### The Four Questions Every Tool Description Must Answer
1. **What** does this tool do? (Clear, specific functionality)
2. **When** should it be used? (Activation conditions, not just capability)
3. **What inputs** does it accept? (Types, constraints, defaults, examples)
4. **What does it return?** (Output format, edge cases, error conditions)

### Reduce Complexity
Primitive, general-purpose capabilities often outperform sophisticated multi-tool architectures. The filesystem agent pattern uses standard Unix utilities (grep, cat, find, ls) instead of custom exploration tools.

**Before:** 17 specialized tools, 80% success, 274s avg execution
**After:** 2 tools (bash + SQL), 100% success, 77s avg execution

### Optimize Descriptions
Replace vague language with precise functionality statements:

**Bad:** "Helps with file operations"
**Good:** "Read a file from disk. Returns the full content as UTF-8 text. Use this when you need to examine source code, configuration, or documentation. Input: absolute file path. Output: file contents or error message if file doesn't exist."

### Naming Conventions
- Follow verb-noun patterns: `read_file`, `search_code`, `run_tests`
- Establish uniform parameter conventions across your tool collection
- For MCP tools, always use fully qualified names: `ServerName:tool_name`

### Limit Tool Count
Research indicates 10-20 tools works well for most applications. Beyond that:
- Group related tools under namespaces
- Consider consolidating overlapping tools
- Remove tools that are rarely used

### Design for Recovery
Error messages should guide agents toward correction, not just report failures:

**Bad:** `Error: invalid input`
**Good:** `Error: file_path must be an absolute path starting with /. Received: "src/main.ts". Try: "/home/user/project/src/main.ts"`

### Test Iteratively
Use agent interactions to identify failure modes and improve descriptions:
1. Watch which tools the agent selects (or misselects)
2. Note when the agent passes incorrect parameters
3. Update descriptions to address observed confusion
4. Re-test and iterate

## Examples

**Well-designed tool definition:**
```json
{
  "name": "search_codebase",
  "description": "Search for text patterns in source files using regex. Use this when looking for function definitions, variable usage, import statements, or any text pattern across the project. Returns matching lines with file paths and line numbers. For finding files by name, use list_files instead.",
  "parameters": {
    "pattern": "Regex pattern to search for (e.g., 'function\\s+handlePayment')",
    "file_type": "Optional file extension filter (e.g., 'ts', 'php'). Omit to search all files.",
    "max_results": "Maximum results to return (default: 20, max: 100)"
  }
}
```

**Problematic tool definition:**
```json
{
  "name": "search",
  "description": "Searches for things in the project",
  "parameters": {
    "query": "What to search for"
  }
}
```

## Guidelines
1. Every tool description must answer: what, when, inputs, outputs
2. Favor fewer, more capable tools over many specialized ones
3. Use verb-noun naming: `read_file`, `search_code`, `run_tests`
4. Include activation conditions ("Use this when...") in descriptions
5. Design error messages that guide toward correction
6. Test tool selection with real agent interactions and iterate
7. Use fully qualified names for MCP tools: `ServerName:tool_name`
8. Build minimal architectures that benefit from model improvements

## Integration
- Builds on: `context-fundamentals` (tool definitions consume context budget)
- Related: `project-development` (tool architecture within pipelines), `evaluation` (testing tool effectiveness)

## Skill Metadata
- Created: 2025-12-20
- Last Updated: 2025-07-01
- Author: Adapted from Agent-Skills-for-Context-Engineering (Muratcan Koylan)
- Version: 1.0.0
