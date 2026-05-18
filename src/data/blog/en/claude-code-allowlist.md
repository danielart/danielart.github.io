---
title: "[EN] Let Claude Code write its own allowlist"
author: Daniel Artola
pubDatetime: 2026-05-17T00:00:00Z
slug: claude-code-allowlist
featured: false
draft: false
tags:
  - ai
  - claude
  - en
lang: en
description: The problem of 100 daily approvals and how Claude Code's /fewer-permission-prompts skill solves it transparently.
---

## Table of contents

## The problem of 100 daily approvals

If you use Claude Code in manual mode, you know the feeling: every `npm run typecheck`, every `git log`, every `kubectl get pods` is a permission prompt. You approve the same harmless command twenty times a day. When Anthropic measures this in its own user base, the data is staggering: **93% of prompts are approved**.

That's not security. It's approval fatigue. And approval fatigue is exactly what causes you to lazily click "yes" the day a poorly contextualized `rm -rf` appears.

There have historically been three ways out of this problem:

1. **Keep `settings.json` handy.** It works, but requires discipline and knowing the pattern syntax.
2. **`--dangerously-skip-permissions`.** Fast and dangerous. The name is not decorative.
3. **Auto mode** (with classifiers). A good option, but not everyone meets the requirements or wants to delegate the decision to a model.

In April 2026, Anthropic released a fourth way: an official skill that **reads your own history and builds the allowlist for you**. It's called `/fewer-permission-prompts` and it solves the friction without giving up manual control.

---

## What exactly it does

The skill comes integrated in Claude Code (v2.1+). You don't install it, you don't configure it. You invoke it:

```
/fewer-permission-prompts
```

Under the hood, it follows a fairly conservative pipeline:

1. **Reads transcripts** in `~/.claude/projects/<dir>/*.jsonl`, limiting itself to the 50 most recent sessions.
2. **Extracts all calls** Bash and MCP, grouping by command + first subcommand (`git log`, `gh pr view`, `mcp__slack__read_thread`...).
3. **Filters to read-only.** Discards `rm`, `git push`, `npm install`, builds with side effects, POST requests, commands that kill processes.
4. **Skips what is already auto-allowed** without needing an allowlist entry: `cat`, `ls`, `git status`, `gh pr view`, `docker logs`, `lsof`...
5. **Blocks dangerous wildcards.** `Bash(python3:*)`, `Bash(bun run *)`, `sudo`, interpreters, shells, `npx` — anything that opens arbitrary code execution, even if you only use it for a specific tool.
6. **Sorts by frequency**, discards what appears less than 3 times and shows the top 20.

The result is a table with candidates, an explanation of what it added and what it omitted, and a clean write to the project's `.claude/settings.json` (not global, not `settings.local.json`).

---

## A real example

The clearest way is to see an execution. Here is the result in a real project with an MCP gateway in Kubernetes, after filtering internal names:

| # | Pattern | Times | Notes |
|---|---|---|---|
| 1 | `Bash(kubectl port-forward -n <ns> svc/<svc> 8000:8000 *)` | 4 | local tunnel to gateway |
| 2 | `Bash(npx tsc --noEmit *)` | 4 | TypeScript typecheck |
| 3 | `Bash(curl -s http://localhost:8000/*)` | 3 | GET local health checks |
| 4 | `Bash(lsof -ti:*)` | 2 | port occupation |
| 5 | `Bash(dotnet --version *)` | 2 | SDK version |

Of these five candidates, **only two end up in the allowlist**. It's worth understanding why the other three fall through, because each reason illustrates a rule of the skill:

- **`npx tsc --noEmit` (4 times).** It appears high in frequency, but `npx` is an arbitrary code executor. Even if you only use it for `tsc` today, keep the `--noEmit` flag and never switch machines, allowlisting it would mean greenlighting any package `npx` decides to download. The skill explicitly refuses.
- **`lsof -ti:*` (2 times).** Falls through for two reasons: `lsof` is already in the auto-allowed list, and it doesn't reach the 3 occurrences threshold.
- **`dotnet --version` (2 times).** Read-only, risk-free, but below the threshold. The skill prefers false negatives to inflating the allowlist with noise.

> **💡 Tip:** You can ask Claude directly (e.g., *"which permissions did you skip in this last execution and why?"*) to better understand its decision process if you notice a frequent command wasn't added to the allowlist.

Two lines remain that enter `.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(kubectl port-forward -n <ns> svc/<svc> 8000:8000 *)",
      "Bash(curl -s http://localhost:8000/*)"
    ]
  }
}
```

The rest of the file is preserved intact. Conservative, transparent, without surprises.

---

## Allowlist patterns you will see

The syntax is simple but has a trap worth memorizing:

| Pattern | When it's used |
|---|---|
| `Bash(foo)` | Exact match of a specific invocation |
| `Bash(foo *)` | Prefix + space: matches `foo`, `foo bar`, `foo --opt` |
| `Bash(foo*)` | No space: careful, `Bash(ls*)` also captures `lsof` |
| `mcp__server__tool` | Full MCP tool name, no wildcards |

The difference between `foo *` and `foo*` has claimed entire allowlists. The space matters.

---

## Where it writes and why it matters in a team

The skill writes to `.claude/settings.json`, which is the project's **versioned and shared** file. Not `.claude/settings.local.json` (which is yours and not uploaded). Not `~/.claude/settings.json` (which is global to your user).

This has practical consequences:

- **Always review the diff before commit.** What is "a local port" to you might be an internal endpoint you don't want to publicly document in the repo.
- **If an entry is personal**, manually move it to `.claude/settings.local.json` after execution.
- **If you are in a public repo**, be especially careful with internal service names, Kubernetes namespaces or routes that leak architecture.

It's not a flaw in the skill, it's a design decision: the benefits of an allowlist are greater when the whole team shares them. But the commit passes through you.

---

## The sibling from the same origin: `/insights`

Same data source, complementary purpose. `/insights` reads the same `.jsonl`, but instead of building an allowlist it generates an HTML report with:

- Recurring friction points in your sessions
- Suggested rules for your `CLAUDE.md` based on instructions you repeat the most
- Model behavior patterns that deserve documentation

Where `/fewer-permission-prompts` attacks approval friction, `/insights` attacks understanding friction: the times you had to explain something to Claude it should already know.

The fortnightly combination of both is a cheap and very profitable habit.

---

## Conclusion

`/fewer-permission-prompts` is not a spectacular tool. It doesn't save you an hour a day or unlock anything new. What it does is eliminate ten seconds of friction a hundred times a day, without you having to think about pattern syntax or manually maintain allowlists.

More importantly: it does so transparently and conservatively. It shows you what it adds, what it omits and why. It blocks dangerous wildcards by default. It requires a minimum frequency threshold to avoid noise. And it leaves the final decision to you.

It's the kind of utility only Anthropic could do right, because they have access to the full semantics of the transcripts and know their own auto-allowed list. Any third-party attempt would be worse.

If you use Claude Code in manual mode and haven't run it yet, do it today. Five seconds of invocation in exchange for weeks of approvals you stop doing.

---

**References**
- Original post (Wmedia): https://wmedia.es/en/tips/claude-code-fewer-permission-prompts
- Official documentation: https://code.claude.com/docs/en/permissions
- Auto mode (context about 93% approval): https://www.anthropic.com/engineering/claude-code-auto-mode
