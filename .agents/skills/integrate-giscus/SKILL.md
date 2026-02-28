---
name: integrate-giscus
description: Instructions to add Giscus comments functionality to AstroPaper blog posts.
---

# Integrate Giscus Comments

Use this skill when you need to enable Giscus to manage comments using a GitHub discussions integration.

## Installation and Components

1. Start by installing the React Giscus driver into Astro:
   ```bash
   npm i @giscus/react && npx astro add react
   ```
2. In `src/constants.ts`, export your Giscus configuration:
   ```ts
   import type { GiscusProps } from "@giscus/react";
   export const GISCUS: GiscusProps = {
      repo: "[ENTER REPO HERE]",
      repoId: "[ENTER REPO ID HERE]",
      category: "[ENTER CATEGORY]",
      categoryId: "[ENTER CATEGORY ID]",
      mapping: "pathname",
      reactionsEnabled: "0",
      emitMetadata: "0",
      inputPosition: "bottom",
      lang: "en",
      loading: "lazy",
   };
   ```
3. Create a bridge component in `src/components/Comments.tsx` utilizing `@giscus/react` to listen to theme changes:
   - It should track localStorage `theme` toggles and browser preferences.
   - Watch the `theme-btn` click listener to auto-toggle the React `Giscus` theme prop.

## Layout Implementation

1. Once the `Comments` bridge component is created, open `src/layouts/PostDetails.astro`.
2. Below the `<ShareLinks />` tag, drop in the client-side imported UI component:
   ```astro
   import Comments from "@/components/Comments";

   <ShareLinks />
   <Comments client:only="react" />
   ```
