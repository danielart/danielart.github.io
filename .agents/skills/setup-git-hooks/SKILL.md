---
name: setup-git-hooks
description: Instructions on how to automate pubDatetime and modDatetime modification via Git hooks and bash.
---

# Setting Dates via Git Hooks

Use this skill to configure automatic date updates in your markdown's frontmatter whenever files are staged/committed using `husky` or native `.git/hooks`.

## Strategy

You will construct a `pre-commit` bash script to automatically modify frontmatter tags upon staging markdown files (`M` modified and `A` added):
- Intercept added (`A`) blog Markdown files and inject the current timestamp (`$(date -u "+%Y-%m-%dT%H:%M:%SZ")`) into their `pubDatetime`.
- Intercept modified (`M`) blog Markdown files and update their `modDatetime` (if they are not currently drafts!).

## Requirements & Required Code Modifications

For this automated hook to not throw linting errors with Astro's Content Collections schema and Zod:
1. **Zod Validation (`src/content.config.ts`):** 
   You must change `modDatetime` to allow nullability:
   `modDatetime: z.date().optional().nullable(),`
2. **Layout Changes (`src/layouts/Layout.astro`):**
   Provide `null` capability to Prop interface definitions:
   `modDatetime?: Date | null;`
3. **Component Changes (`src/components/Datetime.tsx`):**
   Provide `null` capabilities to `DatetimesProps`:
   `modDatetime: string | Date | undefined | null;`

Once the typing rules are adjusted to support empty strings inside `modDatetime:` arrays created by your bash automation step, drop the bash script logic looping `git diff --cached --name-status` over `.md` files into the local `.husky/pre-commit` hook to automatically mutate frontmatter locally prior to every fast commit.
