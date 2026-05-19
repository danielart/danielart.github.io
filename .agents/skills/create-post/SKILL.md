---
name: create-post
description: Instructions and guidelines for creating new blog posts or drafts in AstroPaper.
---

# Create a Post or Draft

Use this skill when you need to create a new blog post or draft for the AstroPaper website.

## Location & Structure

1. **Where to place posts (Multilingual Requirement):**
   - You MUST ALWAYS create four versions of every post: English, Spanish, Japanese, and Portuguese.
   - Place English posts in `src/data/blog/en/` (e.g., `src/data/blog/en/my-post.md`).
   - Place Spanish posts in `src/data/blog/es/` (e.g., `src/data/blog/es/my-post.md`).
   - Place Japanese posts in `src/data/blog/ja/` (e.g., `src/data/blog/ja/my-post.md`).
   - Place Portuguese posts in `src/data/blog/pt/` (e.g., `src/data/blog/pt/my-post.md`).

2. **Required Frontmatter:**
   - Every post MUST have a YAML frontmatter block at the top with at least `title`, `description`, `pubDatetime` (in ISO 8601 format like `2026-02-28T00:00:00Z`), and `lang` (`en`, `es`, `ja`, or `pt`).
   - The title should ideally be prefixed with `[EN]`, `[ES]`, `[JA]`, or `[PT]` depending on the language.
   - **CRITICAL:** ALWAYS set `pubDatetime` to **1 hour BEFORE the current UTC time** (unless explicitly told otherwise) to ensure the post is instantly visible.
   - **CRITICAL:** To prevent URL collisions, ALWAYS append the language code to the slug (e.g., `slug: my-post-en`, `slug: my-post-es`, etc.).
   - Include a language-specific tag (`en`, `es`, `ja`, or `pt`) in the `tags` array.

## Sample Frontmatter

```yaml
---
title: "[EN] The title of the post" # Or [ES], [JA], [PT]
author: Daniel Artola
pubDatetime: 2026-02-28T10:00:00Z # Ensure this is 1 hour in the past
slug: your-custom-slug-en # Append -en, -es, -ja, or -pt
featured: false # set true to pin on homepage
draft: false # set TRUE to make this a draft!
tags:
  - web
  - ai
  - en # or 'es', 'ja', 'pt'
lang: en # or 'es', 'ja', 'pt'
ogImage: ../../../assets/images/blog/example.png # optional, or generated automatically
description: This is a short excerpt and description for SEO.
---
```

## Special Features & Checks

1. **Drafts:** To mark a post as a draft (unpublished locally but ignored in production), set `draft: true` in the frontmatter.
2. **Table of Contents:** Add a `## Table of contents` section (exact capitalization) wherever you want the ToC to be generated in your post.
3. **Headings:** Start with `##` (h2) for sections because the main post title generates the `<h1>`.
4. **Images & Human Review:** Store images directly in `src/assets/images/` to benefit from automatic performance optimization by Astro.
   - Embed them via Markdown: `![alt text](../../../assets/images/blog/img.png)`.
   - **CRITICAL:** If any image included in the posts contains text in Spanish, you MUST ask the user for a human review to confirm if an English equivalent is needed or if the image should be adapted.
