---
description: Update the README with the latest changes made to the project
---
This workflow updates the project README (or AGENTS.md) to reflect the latest changes.

**Step 1: Review Recent Changes**
Check the latest `git log -n 5 --oneline` to understand what was changed recently.

// turbo
**Step 2: Identify Changed Files**
Run `git diff --stat HEAD~1` (or the appropriate range) to see which files were modified.

**Step 3: Update Documentation**
Based on the changes:
- If structural changes were made (new files, directories), update the Project Structure section in `AGENTS.md`.
- If new styling patterns were added, update `docs/STYLING_GUIDELINES.md`.
- If new learnings emerged, append them to `.Jules/palette.md`.
- If a new blog post was added, verify it appears in the workflow and skill docs.

**Step 4: Commit**
// turbo
- `git add AGENTS.md docs/ .Jules/`
- `git commit -m "docs: update documentation with latest changes"`
