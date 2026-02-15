# Create Blog Post Skill

This skill automates the creation of a multilingual blog post for Daniel Artola's portfolio.

## Prerequisites

- The input should be a Markdown content or a draft.
- The site structure expects files in `blog/en/` and `blog/es/`.

## Process

### 1. Content Analysis & Tagging

- Analyze the content to identify key themes.
- Generate 3-5 relevant tags.
- Use these tags for both the `tags` metadata and the `data-tags` attribute in `blog.html` and `index.html`.

### 2. SEO Metadata Generation

- Generate a compelling `title` (max 60 chars).
- Generate a `description` (150-160 chars) for SEO and Open Graph.
- Identify 5-10 `keywords`.
- Create a URL-friendly `slug`.

### 3. Translation

- If content is in English, translate it to Spanish.
- If content is in Spanish, translate it to English.
- Ensure the translation maintains the same structure and tone.
- Metadata must also be translated (title, description).

### 4. File Creation (HTML conversion)

- Use `blog/post-template.html` as the base.
- Convert Markdown content to HTML.
- Replace placeholders:
  - `{{TITLE}}`: Post Title
  - `{{DATE}}`: Current Date (YYYY-MM-DD)
  - `{{READ_TIME}}`: Calculated read time (words / 200)
  - `{{DESCRIPTION}}`: SEO description
  - `{{KEYWORDS}}`: Comma-separated keywords
  - `{{SLUG}}`: URL slug
  - `{{CONTENT}}`: Converted HTML content

- In `blog/post-template.html`, find `<!-- TAGS_PLACEHOLDER -->` and insert tags as `<span class="tag">#tagname</span>`.

- Save to `blog/en/{{SLUG}}.html` and `blog/es/{{SLUG}}.html`.
- Ensure `lang="en"` or `lang="es"` is set in the `<html>` tag.

### 5. Update Listing Pages

- **blog.html**:
  - Add the Spanish version under `<!-- SPANISH POSTS -->`.
  - Add the English version under `<!-- ENGLISH POSTS -->`.
  - Ensure `data-tags` attribute is correctly populated (lowercase, comma-separated).
  - Ensure `data-lang` attribute is set (`es` or `en`).
- **index.html**:
  - Update any "Latest Posts" if they exist in the homepage.

### 6. Deployment

- The site deploys by pushing to the `master` branch.
- Standard flow:
  1. Create a feature branch `blog/{{SLUG}}`.
  2. Review changes locally.
  3. Merge to `master` (or push directly if preferred by user).
  4. Push to origin.

## Best Practices for This Site

- **Common Tags**: `ai`, `productivity`, `web`, `leadership`, `jules`, `antigravity`, `stitch`, `mcp`.
- **Image Assets**: Place blog images in `assets/images/blog/`.
- **Clean URLs**: Use descriptive slugs like `ai-agents-productivity` instead of `post1`.
- **Accessibility**: Ensure `alt` tags are present in any images added to the content.
