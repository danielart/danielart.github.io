# AI Agent Operative Manual (AGENTS.md)

This document provides context and instructions for AI agents (Jules, Antigravity, etc.) working on the `danielart.github.io` project.

## 🎯 Repository Overview
This is a personal portfolio and engineering blog for Daniel Artola. It is built as a highly-performant, single-page-feel static site using **Vanilla Web Technologies**.

- **Tech Stack:** HTML5, CSS3 (with Custom Properties/CSS Variables), Vanilla JavaScript.
- **Style:** Minimalist Glassmorphism (Premium/Sleek vibe).
- **Deployment:** GitHub Pages (Automatic from `main` branch).

## 🛠 Project Structure
- `/index.html`: Main landing page (Portfolio, Experience, Featured Work).
- `/blog.html`: Engineering blog listing page.
- `/blog/post-template.html`: Template for creating new blog post pages.
- `/blog/`: Individual blog posts (localized in `en/` and `es/`).
- `/css/styles.css`: Central styling system.
- `/js/main.js`: Main interactivity, scroll animations, and dynamic localization logic.
- `/docs/STYLING_GUIDELINES.md`: **MANDATORY** reading before any UI changes.
- `/docs/BLOG_POST_TEMPLATE.md`: Frontmatter and content template for new blog posts.
- `/GITHUB_ISSUE.md`: Backlog of proposed improvements and feature requests.
- `.agent/workflows/`: Executable/repeatable task definitions.
- `.agent/skills/`: Detailed skill instructions for complex tasks.

## 🎨 Styling Guidelines
All CSS changes **MUST** comply with `docs/STYLING_GUIDELINES.md`.
- **Key Palette variables:** `--accent-primary`, `--accent-secondary`, `--glass-bg`, `--glass-border`.
- **Components:** Cards use `.glass-card`, sections use `.reveal` for scroll animations.
- **Grids:** Prefer `.grid-2` for segmented content.
- **No inline styles:** Use CSS classes defined in `css/styles.css`. Utility classes like `.section-header-flex`, `.github-invitation-*` etc. exist for layout patterns.
- **No `!important`:** Use higher-specificity selectors instead (e.g., `.nav-links .nav-cta`).

## 🌍 Localization Engine
The site supports English (`en`) and Spanish (`es`).
1. **Detection:** Controlled via `lang` toggle in the UI (stored in `localStorage`).
2. **Implementation:** Handled in `js/main.js` via the `updateLanguageUI(lang)` function.
3. **Strings:** Static strings are stored in the `texts` object inside `js/main.js`.
4. **Blog Selection:** Blog posts are filtered based on the `data-lang` attribute in `blog.html`.

**When adding features:** Ensure both languages are updated in the `texts` object in `js/main.js`.

## ✍️ Content Creation (Blog)
Follow the `.agent/workflows/create-blog-post.md` workflow for adding new content.
- Always create parallel posts in `blog/en/` and `blog/es/`.
- Update the grid in `blog.html` to include the new post entries.
- Add `loading="lazy" decoding="async" width="600" height="338"` to all blog thumbnail images.

## 📓 Agent Continuity
- **Learnings:** Check `.Jules/palette.md` for historical decisions and technical learnings.
- **Memory:** If you make a significant architectural or design decision, record it in `.Jules/palette.md` to avoid regressions in future sessions.

---
**Status:** Managed by Antigravity AI | Last Updated: 2026-02-22
