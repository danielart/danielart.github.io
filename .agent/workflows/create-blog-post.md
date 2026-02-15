# Create Blog Post Workflow

1. **Analyze Content**: Provide the blog post content (Markdown or text).
2. **Generate Metadata**: Generate tags, SEO title, description, and slug.
3. **Translate Content**: Translate the content and metadata into the missing language (English/Spanish).
4. **Create English HTML**:
   - Use `blog/post-template.html`.
   - Populate with English content and metadata.
   - Save to `blog/en/{{SLUG}}.html`.
5. **Create Spanish HTML**:
   - Use `blog/post-template.html`.
   - Populate with Spanish content and metadata.
   - Save to `blog/es/{{SLUG}}.html`.
   - Update `<html lang="en">` to `<html lang="es">`.
6. **Update `blog.html`**:
   - Add the new post to the grid in `blog.html` for both languages.
7. **Update `index.html`**:
   - Add the new post to the featured section if needed.

// turbo
8. **Deploy**:
   - `git checkout -b blog/{{SLUG}}`
   - `git add .`
   - `git commit -m "feat: add blog post {{TITLE}}"`
   - `git push origin blog/{{SLUG}}`
