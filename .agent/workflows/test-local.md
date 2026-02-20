---
description: Run local browser tests to verify website layout and functionality
---
This workflow helps you spin up a local server and uses an AI browser subagent to test the website's functionality and visual layout.

**Step 1: Verify the local server is running**
Check the running terminal commands to see if the local server (e.g., `python3 -m http.server 8080`) is active. If not:
// turbo
Run `python3 -m http.server 8080` in the terminal to serve the static site.

**Step 2: Run Browser Subagent Tests**
Invoke the `browser_subagent` tool to perform an automated test session. Use the following prompt for the `Task` description:
"Please go to http://localhost:8080. 
1. Verify the homepage loads properly and the core layout is visible.
2. Check the navigation menu: click on the 'Blog' section (if present) and ensure it navigates correctly, then go back to the homepage.
3. Test interactivity: click the theme toggle (Dark/Light mode) or language switcher if they exist, and observe if the styles or text change appropriately.
4. Check responsiveness: resize the window to a mobile width (e.g., width 400) and verify if the layout adapts (like showing a mobile menu).
5. Stop the test and return a concise summary of what worked and if you noticed any visual bugs, broken links, or issues."

**Step 3: Report Findings**
After the browser subagent completes, summarize its report and formulate a clear, actionable summary of the test results for the user. Highlight any failing tests or visual defects.
