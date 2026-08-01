---
name: create-post
description: Instructions and guidelines for creating new blog posts or drafts in AstroPaper.
---

# Create a Post or Draft

Use this skill when you need to create a new blog post or draft for the website.

## Pre-Writing Checklist (Mandatory)

Before drafting any post:
1. **Search Intent & Angle**: Define the exact problem being solved and the unique technical angle.
2. **Target Audience**: Identify primary persona (`developer`, `engineering-manager`, `tech-lead`, `general`).
3. **Primary Sources**: Ground all technical claims on official documentation or verified empirical tests.
4. **Reproducibility**: Include exact prompts, code snippets, or configuration files only when they provide reproducible value.
5. **Internal Links**: Identify relevant existing articles on the blog to link internally.

## Language Rules

- **Default Single Language**: Create ONLY ONE language version by default (the language requested by the user, usually `en` or `es`).
- **Do NOT automatically create 4 languages.**
- Create English and Spanish versions ONLY when explicitly requested.
- Create Japanese (`ja`) or Portuguese (`pt`) versions ONLY under explicit request.
- **NO Title Prefixes**: Never add `[EN]`, `[ES]`, `[JA]`, or `[PT]` to the title string.
- **NO Language Tags**: Never include `en`, `es`, `ja`, or `pt` in the `tags` array. Language is defined strictly via `lang`.

## Location & Routing

1. **Location**:
   - English: `src/data/blog/en/<filename>.md`
   - Spanish: `src/data/blog/es/<filename>.md`
   - Japanese: `src/data/blog/ja/<filename>.md`
   - Portuguese: `src/data/blog/pt/<filename>.md`
2. **Routing**: Astro glob loader generates routes from file location (`/posts/<lang>/<filename>`). Do not rely on frontmatter `slug` to alter published URL structure. Maintain existing URLs and filenames.

## Frontmatter Schema

```yaml
---
title: "Clean Title Without Language Prefix"
author: Daniel Artola
pubDatetime: 2026-08-01T12:00:00Z # Set 1 hour before current UTC time if instant publication is needed
draft: false # set true for drafts
lang: en # or 'es', 'ja', 'pt'
translationKey: "unique-concept-key" # Identifies translations of the same idea
pillar: "agent-ready-repositories" # "agent-ready-repositories" | "safe-autonomy" | "engineering-management" | "real-experiments"
articleType: "guide" # "guide" | "case-study" | "experiment" | "opinion" | "reference"
audience:
  - developer # "developer" | "engineering-manager" | "tech-lead" | "general"
tags:
  - ai
  - mcp
description: "A compelling SEO description."
ogImage: ../../../assets/images/blog/example.png # optional
testedWith:
  - "Claude Code 2.0"
  - "Vitest 4.0"
---
```

## Content Formatting & Components

- Use `## Table of contents` (exact capitalization) for automatic ToC placement.
- Use `##` (h2) for top-level content sections (`<h1>` is reserved for post title).
- Store images in `src/assets/images/` and embed via `![alt](../../../assets/images/blog/img.png)`.
- Use reusable editorial components where relevant:
  - `<KeyTakeaway>`
  - `<TestedWith tools={["Tool1", "Tool2"]} />`
  - `<PromptExample context="..." prompt="..." expected="..." actual="..." />`
  - `<WhatFailed>`
  - `<TradeOffs>`
  - `<ForDevelopers>`
  - `<ForEngineeringManagers>`

## Mandatory Verification Before Completion

After creating or modifying a post, run:
```bash
pnpm format:check
pnpm lint
pnpm test:unit
pnpm build
```
Ensure all commands pass cleanly before marking the task complete.
