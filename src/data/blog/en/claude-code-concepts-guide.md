---
title: "[EN] Technical Guide: Claude Code Concepts"
author: Daniel Artola
pubDatetime: 2026-04-09T10:20:14Z
slug: claude-code-concepts-guide
featured: true
draft: false
tags:
  - ai
  - claude
  - guide
  - en
lang: en
description: A technical guide based on official Anthropic documentation about the five distinct concepts in Claude Code.
---

## Table of contents

## Introduction

**Claude Code — Prompt, Skill, Subagent, Agent, and Agent Teams**
_Technical guide based on official Anthropic documentation_

Sources: [Claude Code Features](https://code.claude.com/docs/en/agent-sdk/claude-code-features) · [Agent Skills](https://code.claude.com/docs/en/agent-sdk/skills) · [Subagents](https://code.claude.com/docs/en/agent-sdk/subagents) · [Agent Teams](https://code.claude.com/docs/en/agent-teams)

### Five distinct concepts in Claude Code

It is not a linear hierarchy of complexity: they are tools with distinct purposes that can be combined.

`Prompt` / `Skill` / `Subagent` / `Agent (session)` / `Agent Teams`

- **Prompt**: Message to the agent with instructions, context, and/or tools. It is the base unit of any interaction.
- **Skill**: Directory with a `SKILL.md` file encapsulating reusable knowledge. Claude loads it automatically or via `/slash-command`.
- **Subagent**: Claude instance with its own context, system prompt, tools, and permissions, invoked by the main agent via the `Agent` tool.
- **Agent (session)**: Claude Code in interactive or headless mode: has access to tools, reads `CLAUDE.md`, can delegate to subagents. It is the main session.
- **Agent Teams**: Multiple coordinated Claude Code sessions: a team lead and multiple teammates, each with their own context. Requires explicit activation.

## Prompt — Instruction to the agent

> *"A prompt is not just a simple question: it's any instruction you give Claude, with or without tools, simple or complex."*

The prompt is the input Claude Code receives in any interaction. It can launch an interactive conversation, execute a headless task (`claude -p "..."`), or serve as the basis of a complex agentic system with system prompt, project context, and active tools.

> **According to official documentation:** The Agent SDK uses a minimal system prompt by default. To include the full Claude Code system prompt with all its tools and behaviors, specify `systemPrompt: { type: "preset", preset: "claude_code" }`. `CLAUDE.md` files are loaded as additional project context.

**When to focus on the prompt:**
- Bounded task or direct conversation
- Headless scripting with `-p`
- System prompt configuration for the SDK
- Entry point to any agentic flow

> **Examples:**
> - `claude -p "Refactor the authenticate function in src/auth.ts"` — headless quick task
> - Interactive conversation with Claude Code with access to all tools
> - Entry to an SDK agent with custom system prompt and configured tools
> - `CLAUDE.md` acts as persistent context injected into every project prompt

| Pros | Cons |
| ---- | ---- |
| Flexible · Configurable · Foundation of everything · Headless mode for scripts | Stateless across sessions · Requires good design for complex tasks |

## Skill — Specialized and reusable capability

> *"A Skill is like an expert playbook that Claude consults automatically when the task is relevant, or that you invoke with a slash-command."*

> **Correction from previous guide:** Skills DO NOT live in `CLAUDE.md`. They are directories with a `SKILL.md` file in `.claude/skills/skill-name/` (project) or `~/.claude/skills/skill-name/` (user).

According to official documentation, a Skill is a directory with three types of content loaded progressively to avoid consuming context unnecessarily:

1. **Level 1 — Metadata (always loaded)**: YAML frontmatter: `name` and `description`. Only ~100 tokens. Claude knows it exists and when to use it.
2. **Level 2 — Instructions (when activated)**: `SKILL.md` body: workflows, best practices. Loaded via bash when the Skill is activated. Under 5k tokens.
3. **Level 3 — Resources and code (on-demand)**: Executable scripts, templates, documentation. Claude reads them only if needed. No practical size limit.

> **Difference with Slash Commands:** Built-in slash commands (`/clear`, `/compact`) have fixed logic. Skills are files previously called "commands" (`.claude/commands/`) that evolved into `.claude/skills/` with extra capabilities: control frontmatter, attached scripts, dynamic context injection with ``!`command` ``.

**When to use it:**
- Reusable domain knowledge across conversations
- Team conventions (code style, PR patterns)
- Workflows Claude should start automatically
- Bundling scripts with instructions
- Available on Claude.ai and the API

| Pros | Cons |
| ---- | ---- |
| Auto-loaded by relevance · Reusable across projects · Can include code | Requires code execution environment · Skills across surfaces don't sync · Doesn't inherit parent agent skills |

## Subagent — Specialized assistant with its own context

> *"A subagent is a specialist summoned by the main agent for a specific task: it works independently in its own context and only returns the result."*

Subagents are Claude instances with their own system prompt, configured tools, permissions, and context window. The main agent invokes them via the `Agent` tool (formerly `Task`). Defined as Markdown files with YAML frontmatter in `.claude/agents/` or `~/.claude/agents/`.

> **Key according to official documentation:** Subagents DO NOT inherit the conversation context — they only receive what the parent agent explicitly includes in the invocation prompt. **Subagents cannot invoke other subagents.** If you need nested delegation, use Skills or chain subagents from the main conversation.

**When to use it vs the main conversation:**
- Task generates verbose output you don't want in the main context
- Want to restrict specific tools (read-only subagent)
- The work is self-contained and can return a summary
- Independent parallel operations

> **Latency:** subagents start with empty context and may take time to gather necessary context. For quick questions about something already in the conversation, use `/btw` instead.

| Pros | Cons |
| ---- | ---- |
| Isolates context · Restrictable tools · Optional persistent memory | No inherited context · Cannot invoke other subagents · Only reports to parent agent · Adds startup latency |

## Agent (session) — The main Claude Code session

> *"A Claude Code session is a complete agent: it reasons, acts, observes the result, and repeats until the goal is completed."*

When you launch Claude Code interactively or with `claude --agent name`, you start an agent with full access to tools, autonomous reasoning loop, and capability to delegate to subagents. Here we explicitly refer to Claude agents configured in `.claude/agents/` acting as the main session, rather than complex external autonomous agents (like openclaw or similar).

> **According to official documentation:** With `claude --agent subagent-name`, the main session adopts the system prompt, tools, and model of that file from `/agents`. With `CLAUDE.md`, project context is injected. The agentic loop includes native tools (Bash, Read, Write, Edit, WebSearch) and can delegate to subagents.  
> *Additional note:* Both the runtime session and the SDK fully support **[Hooks](https://code.claude.com/docs/en/agent-sdk/hooks)**, configured in `.claude/settings.json`, to intercept key actions (such as conditionally tracking or blocking destructive Bash commands).

**When it's the right approach:**
- Complex multi-step goal with chained decisions
- Iteration: error -> analysis -> fix -> verification
- Full access to filesystem and terminal
- Task requiring back-and-forth or iterative refinement
- Multiple phases sharing context (planning -> implementation -> tests)

| Pros | Cons |
| ---- | ---- |
| Autonomous · Full reasoning loop · Total tool access · Can delegate | Single context (no real parallelism) · Medium-high cost · Requires review in critical tasks |

## Agent Teams — Coordinated sessions with direct communication

> *"A Claude Code team: a team lead coordinates; teammates work in parallel, can talk to each other directly, and each has their own context."*

> **According to official documentation:** Agent Teams are **experimental** and disabled by default. They require `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in settings or environment. Need Claude Code v2.1.32 or higher.

Key difference with subagents: teammates are entirely independent sessions that communicate directly with each other (not just via the lead). They share a task list and a mailbox system. The user can also speak directly with any teammate.

**Best use cases (according to official doc):**
- Research and review: multiple perspectives in parallel
- New modules or features where each teammate "owns" their area
- Debugging with competing hypotheses in parallel
- Changes spanning frontend + backend + tests simultaneously

> **Important — when NOT to use Agent Teams:** sequential tasks, edits to the same file, highly dependent work. In those cases, subagents or a single session are more efficient. Cost scales with each teammate.

| Pros | Cons |
| ---- | ---- |
| Direct auto-communication · Real parallelism · Independent context shared task list | Experimental · High cost (scales linearly) · No resumption for in-process teammates · One team per session |

## Comparative Table

| Dimension | Prompt | Skill | Subagent | Agent | Multi-Agent Team |
| --------- | ------ | ----- | -------- | ----- | ---------------- |
| **Autonomy** | None | None | Partial | High | Very high |
| **Tool access** | No | No | Yes | Yes | Yes (multiple) |
| **Cross-turn memory** | No | No | No | Limited | Limited |
| **Parallelism** | No | No | Yes (as part.) | No | Yes (native) |
| **Iteration / loop** | No | No | Limited | Yes | Yes |
| **Setup complexity** | Minimal | Low | Medium | Med-High | High |
| **Cost per task** | Very low | Low | Medium | Med-High | High |
| **Reproducibility** | Variable | High | Variable | Variable | Variable |
| **Requires supervision**| Low | Low | Medium | Med-High | High |
| **Ideal use case** | Single query | Repeatable task | Pipeline subtask | Multistep goal | Complex project |

## Decision Tree

*When to use Skills vs Subagents?* Official docs say: use Skills for reusable prompts/workflows in main context; use Subagents for context isolation and restricted tools.

1. **Is it reusable knowledge Claude should load automatically across projects?**
   - Yes -> **Skill** in `~/.claude/skills/`
2. **Is it a specific workflow or convention for this team to share?**
   - Yes -> **Skill** in `.claude/skills/`
3. **Does the task generate verbose output you don't want in main context, or need restricted tools?**
   - Yes -> **Subagent**
4. **Do you need iteration, multiple steps, and full system access?**
   - Yes -> **Agent (session)**
5. **Do workers need to communicate directly, not just report to the boss?**
   - Yes -> **Agent Teams** (if parallelism adds real value)

### Golden Rules
- **Skills vs Subagents:** Use Skills for workflows in main context, Subagents for context isolation.
- **Subagents vs Agent Teams:** Use subagents for focused workers reporting back. Use Agent Teams for complex collaboration.
- **Start simple:** For quick questions, use `/btw` instead of a subagent.
- **Agent Teams:** 3-5 teammates is the sweet spot.

## Recommended Courses (Anthropic Academy)

To fully master these advanced agentic tools, Anthropic's official academy provides the following specialized resources mapped to these concepts at **[anthropic.skilljar.com](https://anthropic.skilljar.com/)**:

- **Claude Code 101:** Understand the foundational exploratory agent loop (Explore -> Plan -> Code -> Commit), default terminal workflows, and `CLAUDE.md` orchestration.
- **Introduction to Agent Skills:** Hands-on training on how to build, configure, and share effective "Skills." Teaches you how to encapsulate code/Markdown instructions to enforce code styling and architectural conventions.
- **Introduction to Subagents:** Learn precisely when and how to delegate tasks to fully isolated agents, preventing context bloat in your main sessions and improving parallel reasoning outputs.
