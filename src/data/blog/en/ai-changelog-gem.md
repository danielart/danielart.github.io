---
author: Daniel Artola Dominguez
pubDatetime: 2026-02-19T00:00:00Z
title: "[EN] Stop Reading AI Newsletters: Build Your Own Changelog System"
featured: false
draft: false
tags:
  - ai
  - productivity
  - gemini
  - automation
  - en
lang: en
description: AI moves so fast that keeping up is impossible. Discover how a custom Gemini Gem with an automated Google Sheet gives you just the changes that matter.
ogImage: ../../../assets/images/blog/ai-changelog-gem.png
---

AI is advancing so fast on so many fronts that keeping up with newsletters and summaries alone would take me hours.

Just in 2026 so far, we've had:

- **January 1:** OpenAI launches o2-mini (Real-time reasoning optimization)
- **January 7:** Mistral AI launches Mistral Medium 2
- **January 14:** Google launches Gemini 2.5 Ultra
- **January 21:** Meta launches Llama 3.5 Turbo (Refined post-launch version)
- **January 27:** Kimi.ai launches Kimi J2.5
- **February 5:** Anthropic launches Claude Opus 4.6
- **February 5:** OpenAI launches GPT-5.3-Codex
- **February 5:** Kuaishou launches Kling 3.0
- **February 12:** Z.ai launches GLM-5
- **February 12:** ByteDance launches Seedance 2.0
- **February 12:** MiniMax launches MiniMax 2.5
- **February 16:** Alibaba launches Qwen3.5-397B-A17B
- **February 17:** DeepSeek launches DeepSeek-V4
- **February 19:** Google launches Gemini 3.1 Pro

**Coming soon:** Llama 4? Mistral Large 3? GPT-5.5? A new Google tool?

![Information overload from AI newsletters and notifications filtered by a gem](../../../assets/images/blog/ai-changelog-gem.png)
_Too much information, too little signal. The solution: go straight to the changelogs._

## The Problem

Newsletters give you someone else's opinion, examples, irrelevant information.

## The Solution

Go directly to the **ChangeLogs** and the **Release Notes**.

I created a **Gem** (Custom AI) connected to an automated **Google Spreadsheet** that gives me just the changes that matter, and then if something catches my eye, I dig deeper with the same gem.

## Why This System Is 10x Faster

- 🎯 **Zero bias:** I read the data, not the hype of the day. If I'm not interested, I move on to the next line.
- ⚡ **Speed:** It tells me the facts, focused on the tools I care about. If a new one interests me, I add it to the sheet.
- 🚫 **No ads**, no sponsored content, no fluff.

## Resources

Here are the links so you can set it up yourself:

- 📊 [Google Spreadsheet — AI Changelogs](https://docs.google.com/spreadsheets/d/1Yc3RP9DanCZP4KgSNT8oMuyTEouVullOHbMxz-oB2rc/edit?gid=1843997542#gid=1843997542)
- 💎 [Gemini Gem — AI Changelogs Tracker](https://gemini.google.com/gem/1eylYmiv8WA0NC9svVdVLDbctR0casVj0?usp=sharing)

## Gem Instructions

These are the full instructions used by the gem. You can copy them and adapt them to your use case:

<details>
<summary>📋 View full Gem instructions</summary>

```text
Purpose and Goals:
Act as a technical analyst specializing in AI software development.
Monitor AI tool changelogs from a specific Google Sheet named 'AI changelogs'
within the available knowledge base.
Provide structured updates and technical summaries based on the 'keep track'
monitoring column.

Configurations:
Output language: Spanish
Hour for daily message: 20:00
Hour for weekly message: 08:00
Day for weekly message: Monday

Behaviors and Rules:
1) Data Analysis:
    a) Access the 'AI changelogs' Google Sheet.
    b) Identify exclusively the rows where the 'keep track' column is
       flagged/marked.
    c) For the selected tools, visit the provided URLs to detect recent
       technical changes.
2) Daily Routine:
    a) Every day at the hour specified on top, review changes from the
       last 24 hours.
    b) Summarize only the relevant updates in Spanish.
    c) If there are no changes, do not generate a response.
3) Weekly Routine:
    a) Every week, at day and hour specified on top, perform a synthesis
       of all changes that occurred over the last 7 days.
    b) Maintain a technical and concise focus.
4) Output Format:
    a) Group information by the tool's name.
    b) Use bullet points to detail specific changes.
    c) Include the source URL for each mentioned tool.
    d) Output language defined on top.
5) Tone and Style:
    a) Professional, technical, and analytical.
    b) Avoid unnecessarily complex language outside of the technical AI field.
    c) Be precise and direct when communicating news, avoiding irrelevant
       information or examples.
```

</details>

## How to Customize the Gem

If you want to tailor the gem to your needs, just modify the **Configurations** section of the instructions:

- 🌐 **Language:** Change `Output language: Spanish` to your preferred language (e.g., `English`, `French`, `Portuguese`).
- 🕐 **Daily message time:** Change `Hour for daily message: 20:00` to whatever time suits you best.
- 🕗 **Weekly message time:** Change `Hour for weekly message: 08:00` to your preferred time.
- 📅 **Weekly summary day:** Change `Day for weekly message: Monday` to the day you prefer (e.g., `Friday`).

## Beyond Software Development

This gem is heavily focused on the **software development and tech world**, but the concept can be adapted to any purpose. All you need is:

1. A Google Spreadsheet with the tools/sources you care about (e.g., marketing tools, design tools, finance…).
2. The changelog or release notes URLs for each source.
3. Modified gem instructions tailored to your domain.

The pattern is always the same: **clean data → custom gem → noise-free information**.
