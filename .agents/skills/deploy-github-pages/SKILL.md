---
name: deploy-github-pages
description: Instructions to easily trigger a GitHub Pages deploy for the Astro blog.
---

# Deploy GitHub Pages

This project is configured to automatically build and deploy to GitHub Pages whenever changes are pushed to the `main` branch.

## How to trigger a deploy

To execute a deployment, you simply need to commit and push your changes to GitHub:

1. Stage all your new posts, config changes, code changes:

   ```bash
   git add .
   ```

2. Commit your changes:

   ```bash
   git commit -m "chore: deploy new content"
   ```

3. Push to `main`:

   ```bash
   git push origin main
   ```

Once pushed, go to the repository's **Actions** tab on GitHub to monitor the deployment progress. The site will be updated in a minute or two.

## Troubleshooting & Configuration

- **Repository Settings**: Make sure that in your GitHub repository `Settings > Pages`, the **Source** is set to `GitHub Actions`.
- **Base Path**: If you are using a repo name other than `<username>.github.io` (for example, `Blog_astropaper`), you must update `astro.config.ts` to include `base: '/Blog_astropaper/'` in the configuration.
- **Node version / Package manager**: The workflow is configured to automatically use Node and `npm`. If you switch to another package manager (like `pnpm`), update the `.github/workflows/deploy.yml` or take out the `with: package-manager:` parameter and let the Astro action detect it.
