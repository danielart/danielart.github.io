# Guidelines: AI-Assisted Analysis Reporting

> **Golden Rule:** If you publish it, you own it. If you can't explain it in your own words, don't publish it yet. _(Addy Osmani: "Explain it or don't ship it")_

---

## 1. Core Publishing Principles

- **Your name implies ownership:** "The AI said so" is not a valid justification in code reviews, postmortems, or client meetings.
- **Keep Slack concise:** Keep the main Slack message under 15 lines.
- **Detailed analysis as attachment (`.md`):** Attach a `.md` file to preserve tables, formatting, and code blocks without polluting the channel.

---

## 2. Required Analysis Structure

Every AI-assisted analysis report must follow this format:

```text
TL;DR — 1-3 lines, plain language. What is broken and what is the impact.

Hypothesis / Conclusion — In your own words, with explicit confidence level:
  [confirmed | probable | speculative]

Verified Evidence — Links to Datadog/Grafana queries, log lines, commits, PRs, or dashboards.

Unverified for now — What you have NOT confirmed (explicit declaration of gaps).

Next Step / Request — What you need, and from whom.

(Optional) Full AI Output → In the thread or snippet labeled:
  "Raw output, unverified".
```

---

## 3. Recommended Format Matrix

| Medium                           | Primary Purpose                                |
| -------------------------------- | ---------------------------------------------- |
| **Slack Message**                | TL;DR & Action Request                         |
| **Attached `.md` File**          | Detailed Analysis (Default choice)             |
| **Claude Artifact**              | Interactive Content (Verify permissions first) |
| **Confluence / Notion / Canvas** | Permanent Reference (Runbooks, Postmortems)    |

---

## 4. Pre-Publish Verification Checklist

- [ ] Every factual claim traces to a directly verified source, not just the model's description. _(add link if applicable)_
- [ ] Service names, metric names, config keys, file paths, and versions: all real and verified.
- [ ] The query has been re-run or the behavior reproduced. It has not just been read about, and assistance was requested if needed.
- [ ] Alternative explanations have been evaluated beyond the first plausible hypothesis.
- [ ] The analysis can be defended in a technical review under probing questions.

---

## 5. Input & Prompting Best Practices

1. **Provide real data:** Attach real logs, stack traces, diffs, and schemas (avoid paraphrasing).
2. **Declare constraints:** Stack, versions, environment, and what has already been ruled out.
3. **Request uncertainty tagging:** Ask the model to state its confidence and what would be needed to confirm each point.
4. **Ask for counter-hypotheses:** _"What else could produce this same signal?"_.

---

## 6. Traceability & Anti-Patterns

### Traceability:

- Label the post: `"AI-assisted analysis, reviewed by <Name>"`.
- During active incidents: Label as `"Unverified hypothesis, testing now"`.

### Anti-Patterns to Avoid:

- ✕ Pasting raw markdown walls without personal commentary.
- ✕ Claiming "The AI thinks..." without prior verification.
- ✕ Hallucinated metric or service names.
- ✕ Sharing public artifacts containing internal incident or customer data.
