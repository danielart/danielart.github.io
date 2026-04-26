---
title: "[EN] How to pay Haiku's price for Opus's brain: practical guide to the Advisor Tool"
author: Daniel Artola
pubDatetime: 2026-04-25T16:46:20Z
slug: claude-advisor-tool-practical-guide
featured: true
draft: false
tags:
  - ai
  - claude
  - api
  - en
lang: en
description: "AI prices will keep rising. Adjust your workflow while there's still time. A complete guide on how to configure Anthropic's Advisor Tool via API and activate it in Claude Code."
---

A week ago I briefly mentioned Anthropic's **Advisor Tool**. Today I'm sharing the complete guide: how to configure it via API, how to activate it in **Claude Code** with a single command, which model pairs are valid, and the billing details you should check **before** leaving it running in production.

The secret is not to use the most expensive model for everything, but the smartest one for what matters.

## Table of contents

## The idea in one sentence

You put a fast and cheap model (Haiku or Sonnet) to do 90% of the work. When it gets stuck or needs to really think, **it** consults Opus. You don't orchestrate anything — the decision is made by the executor, and everything happens within **a single `/v1/messages` call**.

🏃 **Executor (Haiku or Sonnet)** — the player. Generates code, reads files, runs commands. Fast and cheap.

🧠 **Advisor (Opus)** — the coach. Only steps in when a plan, correction, or stop signal is needed. Never calls tools, never produces output for the user. Only advises the executor.

It is the inversion of the typical sub-agents pattern (large orchestrator delegating to small workers). Here the small one drives and scales up only when necessary.

## The numbers that justify the beta

🔹 **Haiku 4.5 + Opus advisor on BrowseComp:** jump from 19.7% to 41.2%. More than double.

🔹 **Sonnet 4.6 + Opus advisor on SWE-bench Multilingual:** ~11% lower cost per task than Sonnet alone, with a better score.

🔹 **Sonnet with advisor at medium effort** reaches the intelligence of Sonnet at default effort, spending less.

The savings don't come from the advisor — they come from the executor finishing the task in fewer turns because it already has a decent plan.

---

## Valid models (this matters)

The advisor must be **at least as capable** as the executor. These are the only combinations the API accepts:

- Executor `claude-haiku-4-5-20251001` → Advisor `claude-opus-4-7`
- Executor `claude-sonnet-4-6` → Advisor `claude-opus-4-7`
- Executor `claude-opus-4-6` → Advisor `claude-opus-4-7`
- Executor `claude-opus-4-7` → Advisor `claude-opus-4-7`

Any other combination returns `400 invalid_request_error`. No, you cannot set Haiku as an advisor to Sonnet "to make it cheaper" — the beta does not allow it, and it would be useless anyway.

---

## Option A: Claude Code (the easiest)

If you already use Claude Code, this is literally one command.

**Requirement:** Claude Code v2.1.101 or higher. Check with `claude --version` and update if necessary:

```bash
npm install -g @anthropic-ai/claude-code
```

**Activation:**

1. Open Claude Code in your project: `claude`
2. Inside the session type: `/advisor`
3. It shows a short list of models. Choose Opus.

You will see something like *"Advisor configured. Opus will be consulted for complex decisions and task completion checks."* And that's it. No sampling parameters, no custom system prompts, nothing.

**What you need to understand is that you do not call the advisor.** There is no "consult the advisor" command. Sonnet decides on its own when it needs a second opinion, silently inserts the call in the middle of its response, and the advice is incorporated into the context as if it had always been there. The first time you see it, you will look for a confirmation dialog that doesn't exist.

⚠️ **Important limitation:** it only works against the direct Anthropic API. If you use Claude Code through **Bedrock, Vertex, LiteLLM, OpenRouter** or any other proxy, the advisor won't trigger. It is a server-side feature that lives on the native endpoint.

---

## Option B: Direct API (total control)

When you build your own agent, you declare it as just another tool in the `tools` array:

```python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-6",                  # executor
    max_tokens=4096,
    betas=["advisor-tool-2026-03-01"],          # beta header
    tools=[
        {
            "type": "advisor_20260301",
            "name": "advisor",
            "model": "claude-opus-4-7",         # advisor
            "max_uses": 5,                       # optional, limit per request
        }
    ],
    messages=[
        {"role": "user", "content": "Build a concurrent worker pool in Go with graceful shutdown."}
    ],
)
```

Three minimum things:

1. The beta header `advisor-tool-2026-03-01`.
2. The executor in `model` (top-level).
3. The `advisor_20260301` tool with its own `model` (the advisor).

### Multi-turn: watch out for this

In subsequent calls you must **return the full history, including the `advisor_tool_result` blocks**. If you omit them while the advisor is still in `tools`, the API returns 400. And if you remove the advisor from `tools`, you also have to clear those blocks from the history. It's either the combination of both at the same time or neither.

```python
messages.append({"role": "assistant", "content": response.content})
messages.append({"role": "user", "content": "Now add a limit of 10 in-flight."})
```

---

## 💡 Configuration `keep: "all"` (the caching detail that slips by)

Quoting the docs literally: *clear_thinking with a keep value other than "all" shifts the advisor's quoted transcript each turn, causing advisor-side cache misses*.

Why does it matter? The advisor generates strategic reasoning blocks. By default, when you have extended thinking enabled, the API applies `clear_thinking` with `keep: {type: "thinking_turns", value: 1}` — meaning, it trims older blocks on each turn. That shifts the transcript the advisor sees and breaks prompt caching on the advisor side.

Result: you pay for cache writes on every call and there is never a read. Perpetual cache miss.

**Solution:** set `keep: "all"` in your context editing configuration. You keep the history intact, recurring calls to the advisor read from cache, and the savings can reach **90%** on the advisor's input tokens.

And to enable caching for the advisor itself:

```python
tools=[
    {
        "type": "advisor_20260301",
        "name": "advisor",
        "model": "claude-opus-4-7",
        "caching": {"type": "ephemeral", "ttl": "5m"},
    }
]
```

⚠️ **Golden rule of advisor caching:** cache writes **cost more than they save if you call the advisor 2 times or less per conversation**. It starts being profitable from the 3rd call. For short tasks, leave it disabled.

---

## Billing: what the `usage` hides

The advisor is billed **at its own Opus rate**, separate from the executor. And the top-level fields of `usage` only reflect the executor. If you track costs looking only at `input_tokens` and `output_tokens`, you will fall short.

The real breakdown is in `usage.iterations[]`:

```json
{
  "usage": {
    "input_tokens": 412,
    "output_tokens": 531,
    "iterations": [
      {"type": "message", "input_tokens": 412, "output_tokens": 89},
      {"type": "advisor_message", "model": "claude-opus-4-7", "input_tokens": 823, "output_tokens": 1612},
      {"type": "message", "input_tokens": 1348, "cache_read_input_tokens": 412, "output_tokens": 442}
    ]
  }
}
```

- Iterations `type: "message"` → executor rate.
- Iterations `type: "advisor_message"` → advisor rate (Opus).
- The advisor typically produces **400-700 text tokens, or 1,400-1,800 including thinking** per call.
- The `max_tokens` of the request **does not limit** the advisor's tokens.

If you want to track cost seriously, sum the iterations yourself.

---

## System prompts that actually move the needle

If you build your own agent via API and want to replicate the quality Anthropic measures in its benchmarks, put these blocks **at the very beginning of the executor's system prompt**, before any other mention of the advisor:

**Timing block** (when to call):

> Call the advisor BEFORE substantive work — before writing, before committing to an interpretation, before building on an assumption. If the task requires orientation first (finding files, reading a source), do that, then call the advisor. Orientation is not substantive work. Writing, editing, and declaring an answer are.
>
> Also call the advisor when you think the task is complete (make the deliverable durable first: write the file, save the output), when you are stuck, and when you consider changing approach.

**How to treat advice block** (right after):

> Give the advice serious weight. If you follow a step and it fails empirically, or you have primary source evidence that contradicts a specific claim, adapt. Your own test passing is NOT evidence that the advice is wrong — it is evidence that your test does not check what the advice checks.

**Conciseness block** (cuts ~35-45% of advisor tokens without touching frequency):

> The advisor should respond in under 100 words and use enumerated steps, not explanations.

In Claude Code these prompts are already applied out of the box. Via API, you have to add them yourself.

---

## When NOT to use it

This is not magic and does not always pay off:

- **Single-turn Q&A.** There is nothing to plan, the executor will not invoke it and you only add overhead.
- **Purely mechanical tasks** (formatting, lookups, regex). No decision points, no advisor.
- **Latency critical paths.** The executor's stream is **paused** while the advisor's sub-inference runs. It does not stream.
- **Workloads where every turn needs Opus.** If you always need it, you are already paying twice for nothing — use Opus directly.
- **Through Bedrock or Vertex today.** Support is on the way but it is not native everywhere yet.

---

## The other master keys to the budget

The advisor does not operate alone. Combine it with:

✨ **Prompt Caching** — up to 90% savings on repeated input tokens. Critical for long conversations.

📦 **Batch API** — 50% savings on any task that does not need an immediate response.

⚙️ **Effort settings** — Sonnet at medium effort + Opus advisor ≈ Sonnet at default effort, cheaper.

In a market where reasoning is becoming an expensive luxury, **orchestration is your best competitive advantage**.

---

## TL;DR

- In **Claude Code**: `/advisor` → choose Opus → done. Only Anthropic direct API.
- Via **API**: header `advisor-tool-2026-03-01` + tool `advisor_20260301` with its `model`.
- **Valid pairs:** Haiku/Sonnet/Opus 4.6/Opus 4.7 as executor → always Opus 4.7 as advisor.
- **`keep: "all"`** if you have extended thinking, or you lose advisor caching.
- **`caching: ephemeral`** only if you expect 3+ calls per conversation.
- **Billing:** look at `usage.iterations[]`, not the top-level ones. Opus rate for each `advisor_message`.
- **Do not use it** for single-turn, mechanical tasks, or through proxies like Bedrock/Vertex today.

🚀 If you use AI to code and you are still throwing prompts without measuring tokens, in the next post I will go into detail on prompt caching, batch API and the real economics of an agent in production. Follow me so you don't miss it.
