---
name: create-post
description: Instructions and guidelines for creating new blog posts or drafts in AstroPaper.
---

# Create a Post or Draft

Use this skill when you need to create a new blog post or draft for the AstroPaper website.

## Location & Structure

1. **Where to place posts (Bilingual Requirement):**
   - You MUST ALWAYS create two versions of every post: one in English and one in Spanish.
   - Place English posts in `src/data/blog/en/` (e.g., `src/data/blog/en/my-post.md`).
   - Place Spanish posts in `src/data/blog/es/` (e.g., `src/data/blog/es/my-post.md`).

2. **Required Frontmatter:**
   - Every post MUST have a YAML frontmatter block at the top with at least `title`, `description`, `pubDatetime` (in ISO 8601 format like `2026-02-28T00:00:00Z`), and `lang` (`en` or `es`).
   - The title should ideally be prefixed with `[EN]` or `[ES]` depending on the language.
   - Include a language-specific tag (`en` or `es`) in the `tags` array.

## Sample Frontmatter

```yaml
---
title: "[EN] The title of the post" # Or [ES] for Spanish
author: Daniel Artola
pubDatetime: 2026-02-28T10:00:00Z
slug: your-custom-slug-here # optional
featured: false # set true to pin on homepage
draft: false # set TRUE to make this a draft!
tags:
  - web
  - ai
  - en # or 'es' for Spanish
lang: en # or 'es' for Spanish
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
