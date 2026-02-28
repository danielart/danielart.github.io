---
author: Daniel Artola Dominguez
pubDatetime: 2026-02-24T00:00:00Z
title: "[EN] Beyond Chat: Git for Your Brain with Session Forking in Claude Code"
featured: false
draft: false
tags:
  - ai
  - productivity
  - claude
  - workflow
  - en
lang: en
description: Learn how to use Claude Code's session forking to manage context and experiment with code like Git branches.
ogImage: ../../../assets/images/blog/claude-code-forking.png
---

![Claude Code Session Forking Concept](../../../assets/images/blog/claude-code-forking.png)

As engineers, we are used to our workflow being branchable. We use Git to experiment without breaking the main branch. However, when we interact with AIs, we are usually stuck in linear threads: if an idea doesn't work, we delete or start from scratch, losing all accumulated context.

Recently, analyzing the internal workings of Claude Code, I found the solution to this problem in its session management.

## The Agentic Loop: How Does Claude "Think"?

Unlike a traditional chat, Claude Code works through an agentic loop. When you give it a task, the agent enters a three-phase cycle:

- **Gather Context:** Searches files, reads code, and understands dependencies.
- **Take Action:** Makes edits, creates files, or runs terminal commands.
- **Verify Results:** Runs tests and checks that changes work.

This loop generates a very valuable state. The question is: how do we manage it when we want to try two different paths?

## Resume vs. Fork: Master the State

Most users know the `claude --continue` (or `--resume`) command, which allows you to pick up a previous conversation using the same session ID, restoring the entire message history.

But the real superpower for a Lead is the `--fork-session` flag.

- **What does it do?:** Creates a new session (a new session ID) but preserves the entire conversation history up to that point.
- **What is it for?:** To branch your reasoning. You can try a complex refactor in a "fork" and, if it doesn't go well, the original session remains intact. Plus, it allows you to work in parallel from different terminals without messages intertwining.

## Real Scenario: The Refactoring Dilemma

Imagine you are collaborating on a project like Brisa (where I lend a hand to my colleague Aral Roca). You have a performance bug.

1. You start an investigation session: `claude "Analyze the rendering bottleneck"`.
2. After analysis, Claude has the entire dependency tree in memory.
3. You make a fork: You want to try changing the state management.

If that path becomes too dense, you close that terminal and return to the base session. You haven't lost a second re-explaining the context to the AI.

## Safety and Persistence: CLAUDE.md and Checkpoints

To make this flow professional, Claude Code introduces two key mechanisms:

- **CLAUDE.md:** A file where we save persistent project rules. Thus, no matter how many forks you make, the AI will always know your testing or architecture standards.
- **Checkpoints:** Before editing any file, Claude takes a snapshot. If something fails, you can use `Esc + Esc` (or ask for an "undo") to revert file changes instantly.

## Conclusion

AI is no longer just a window where we ask questions. In 2026, tools like Claude Code have become branchable reasoning infrastructure. Learning to manage sessions is not just a productivity trick; it is the difference between coding and orchestrating engineering.
