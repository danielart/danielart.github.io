# Feature Request: Blog Platform Improvements

## Overview
We have implemented a basic static blog section with manual HTML creation. To improve the developer experience and site functionality, we should implement the following enhancements.

## Proposed Improvements

### 1. Automate Markdown to HTML Conversion
**Problem:** Currently, creating a post requires manually converting Markdown to HTML and pasting it into the template.
**Solution:**
- Create a build script (Node.js) that reads `blog/*.md` files.
- Use a library like `marked` or `remark` to convert Markdown to HTML.
- Inject the HTML into `blog/post-template.html` automatically.
- Generate the `blog.html` list automatically based on the MD metadata (frontmatter).

### 2. Add RSS Feed
**Problem:** Readers cannot subscribe to the blog.
**Solution:**
- Generate an `rss.xml` file during the build process containing the latest posts.

### 3. Improve SEO & Social Sharing
**Problem:** Meta tags are manual and OG images are static.
**Solution:**
- Automate OG image generation using the post title (e.g., using `@vercel/og` or a canvas script).
- Ensure sitemap.xml is updated with new blog posts.

### 4. Pagination
**Problem:** The blog list (`blog.html`) will get too long eventually.
**Solution:**
- Implement pagination (e.g., 10 posts per page) if the post count exceeds a threshold.

### 5. Comments System
**Problem:** No way for users to engage.
**Solution:**
- Integrate Giscus (GitHub Discussions based) or a privacy-focused comment system.

## Acceptance Criteria
- [ ] Build script creates HTML from MD.
- [ ] RSS feed is available at /rss.xml.
- [ ] OG images are dynamic or better templated.
