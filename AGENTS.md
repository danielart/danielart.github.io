# Repository Agent Guidelines & Standards

This document establishes the canonical rules, architecture, and editorial workflows for this repository (`danielart.github.io`).

## Core Engineering & Editorial Principles

1. **Astro Route Generation**:
   - Posts are located in `src/data/blog/<lang>/<filename>.md`.
   - Public URLs are generated based on Astro's glob loader and `getPath()` utility (`/posts/<lang>/<slug>`).
   - The frontmatter `slug` property does NOT control public routing. Do not assume or rely on frontmatter `slug` for URLs.

2. **Multilingual Architecture**:
   - The primary editorial languages are **English (`en`)** and **Spanish (`es`)**.
   - Japanese (`ja`) and Portuguese (`pt`) exist for legacy posts but are created ONLY upon explicit request.
   - Default behavior when creating a post: generate only the requested single language version (usually `en` or `es`).
   - Use `translationKey` in frontmatter to link translations of the same article concept.
   - Do NOT add language prefixes (`[EN]`, `[ES]`, `[JA]`, `[PT]`) to visible post titles.
   - Do NOT add language codes (`en`, `es`, `ja`, `pt`) into the frontmatter `tags` array. Use `lang: <code>` for language identification.

3. **Editorial Pillars & Metadata**:
   - Every post should belong to one of four core pillars:
     1. `agent-ready-repositories`: Context transparency, prompts, tool definitions, repo structure.
     2. `safe-autonomy`: Guardrails, allowlists, interactive permissions, session checkpointing.
     3. `engineering-management`: AI adoption, team velocity, workflow integration, leadership.
     4. `real-experiments`: Hands-on deep dives, multimodal pipelines, reproducible case studies.
   - Schema & Frontmatter Fields:
     - `title`: Clean title string (no language prefix).
     - `description`: Concise SEO description.
     - `pubDatetime`: ISO 8601 date string.
     - `lang`: `"en"` | `"es"` | `"ja"` | `"pt"`.
     - `translationKey`: Unique string grouping translations of the concept.
     - `pillar`: `"agent-ready-repositories"` | `"safe-autonomy"` | `"engineering-management"` | `"real-experiments"`.
     - `articleType`: `"guide"` | `"case-study"` | `"experiment"` | `"opinion"` | `"reference"`.
     - `audience`: Array of `"developer"` | `"engineering-manager"` | `"tech-lead"` | `"general"`.
     - `testedWith`: (Optional) Array of tools or model versions used in the post.

4. **URL & Backwards Compatibility**:
   - Never alter published filenames, paths, or URLs without implementing verified redirects.

5. **Validation Pipeline**:
   - Before finishing any modification or post creation, run:
     - `pnpm format:check`
     - `pnpm lint`
     - `pnpm test:unit`
     - `pnpm build`
