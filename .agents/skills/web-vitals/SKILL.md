---
name: web-vitals
description: Guidelines and considerations to maintain excellent Web Vitals as the blog scales in posts and languages.
---

# Web Vitals & Scalability Guidelines

As the AstroPaper blog scales to support multiple languages (EN, ES, JA, PT) and hundreds of posts, it's crucial to maintain excellent Core Web Vitals (LCP, CLS, INP). Follow these guidelines when creating new posts or modifying the site's architecture.

## 1. Static Generation & Caching (TTFB & LCP)
Astro generates static HTML (`.html`) for every post during build time. 
- Expanding to more languages and posts will slightly increase build time, but it won't affect runtime performance. 
- The time-to-first-byte (TTFB) and Largest Contentful Paint (LCP) will remain near-instant because the HTML is pre-rendered and can be aggressively cached by the CDN (e.g., GitHub Pages).
- **Rule**: Avoid adding client-side fetching for critical content. Always rely on `getCollection` and static paths.

## 2. Pagination Limits (DOM Size & INP)
Keep the DOM size manageable to ensure Interaction to Next Paint (INP) stays low.
- Make sure `postPerPage` in `src/config.ts` remains reasonable (currently around 4-10). 
- Adding more posts won't increase the DOM size of the index/list pages as long as pagination is strictly enforced.

## 3. Image Optimization (LCP)
Images are often the largest contributors to poor LCP.
- Always store blog images in `src/assets/images/`. 
- Use Astro's built-in `<Image>` component or standard markdown image syntax (`![alt](../../../assets/images/...)`) to automatically optimize them. 
- Astro automatically converts them to modern formats (WebP/AVIF) and applies proper width/height attributes to prevent layout shifts.

## 4. Font Loading (CLS)
Fonts can cause severe Cumulative Layout Shift (CLS), especially for languages with massive character sets like Japanese or Chinese.
- **Japanese/Asian Fonts**: Do not load massive external font files (like full Noto Sans JP) via Google Fonts without subsetting.
- Rely on system fonts for UI text where possible (`font-family: system-ui, -apple-system, sans-serif`) to maintain a 0-byte font download.
- If web fonts are necessary, ensure they are heavily subsetted and use `font-display: swap` to prevent invisible text during loading.

## 5. Client-Side JavaScript (INP)
Astro removes client-side JS by default.
- Only use `client:load`, `client:visible`, or `<script>` tags when absolutely necessary for interactivity.
- Keep interactive components (like language switchers or theme toggles) lightweight to ensure the main thread stays unblocked.
