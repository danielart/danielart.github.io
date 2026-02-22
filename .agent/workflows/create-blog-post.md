---
description: Create a new multilingual blog post (English + Spanish)
---
This workflow creates a blog post in both English and Spanish, updates the listing pages, and prepares a branch for deployment.

**Step 1: Analyze Content**
Provide the blog post content (Markdown or text). Generate tags, SEO title, description, and slug.

**Step 2: Translate Content**
If in English → translate to Spanish. If in Spanish → translate to English.

**Step 3: Create HTML Files**
// turbo
- Use `blog/post-template.html` as the base template.
- Replace placeholders: `{{TITLE}}`, `{{DATE}}`, `{{READ_TIME}}`, `{{DESCRIPTION}}`, `{{KEYWORDS}}`, `{{SLUG}}`, `{{CONTENT}}`.
- Save to `blog/en/{{SLUG}}.html` and `blog/es/{{SLUG}}.html`.
- Set `lang="es"` in the Spanish version's `<html>` tag.

**Step 4: Update `blog.html`**
- Add the new post card under `<!-- SPANISH POSTS -->` and `<!-- ENGLISH POSTS -->`.
- Add `data-tags` and `data-lang` attributes.
- Add `loading="lazy" decoding="async" width="600" height="338"` to thumbnail images.

**Step 5: Update `index.html`**
- Add the new post to the featured section if needed.

// turbo
**Step 6: Deploy**
- `git checkout -b blog/{{SLUG}}`
- `git add .`
- `git commit -m "feat: add blog post {{TITLE}}"`
- `git push origin blog/{{SLUG}}`
