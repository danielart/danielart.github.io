---
description: Run local browser tests to verify website layout and functionality
---
This workflow spins up a local server and uses an AI browser subagent to test the website's functionality and visual layout.

**Step 1: Verify the local server is running**
Check the running terminal commands to see if the local server (e.g., `python3 -m http.server 8080`) is active. If not:
// turbo
Run `python3 -m http.server 8080` in the terminal to serve the static site.

**Step 2: Run Core Browser Tests**
Invoke the `browser_subagent` tool to perform an automated test session:

"Navigate to http://localhost:8080 and test the following:
1. **Homepage Load**: Verify the hero section, navigation, and all content sections are visible.
2. **Navigation**: Click 'Blog' link — verify blog.html loads. Go back to homepage.
3. **Theme Toggle**: Click the dark/light mode toggle. Verify the background and text colors change.
4. **Language Switcher**: Click 'ES' — verify blog post titles change to Spanish. Click 'EN' — verify they revert.
5. **Blog Filters**: Click 'AI & Agents' — verify only AI-tagged posts are visible. Click 'All' — verify all posts return.
6. **Contact Section**: Verify the service list, social links, and status indicator are visible and correctly styled.
7. **Responsiveness**: Resize to 400px width. Verify the mobile menu toggle appears and the layout adapts.
8. **Blog Post Page**: Navigate to a blog post (e.g., click the first card). Verify the nav, content, and footer render correctly.
Return a summary of what worked and any issues found."

**Step 3: Report Findings**
After the browser subagent completes, summarize its report. Highlight any failing tests, visual defects, or broken links as actionable items.
