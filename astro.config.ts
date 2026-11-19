import { readFileSync } from "node:fs";
import { withArticleLastmod } from "./scripts/sitemap";
import { defineConfig, envField, fontProviders } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { SITE } from "./src/config";
import postRedirects from "./src/post-redirects.json";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  base: "/",
  trailingSlash: "always",
  redirects: postRedirects,
  integrations: [
    sitemap({
      serialize: item => {
        const pathname = decodeURIComponent(new URL(item.url).pathname);
        const file = new URL(`./dist${pathname}index.html`, import.meta.url);
        return withArticleLastmod(item, readFileSync(file, "utf8"));
      },
      filter: page => {
        const pathname = decodeURIComponent(new URL(page).pathname);
        if (
          Object.hasOwn(postRedirects, pathname) ||
          pathname === "/search/" ||
          pathname === "/404.html"
        )
          return false;
        const isDuplicateEnglishCollection = /^\/posts\/en(?:\/\d+)?\/?$/.test(
          pathname
        );
        const isArchives = /^\/archives\/?$/.test(pathname);

        return (
          !isDuplicateEnglishCollection && (SITE.showArchives || !isArchives)
        );
      },
    }),
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
    }),
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    // eslint-disable-next-line
    // @ts-ignore
    // This will be fixed in Astro 6 with Vite 7 support
    // See: https://github.com/withastro/astro/issues/14030
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  fonts: [
    {
      name: "Google Sans Code",
      cssVariable: "--font-google-sans-code",
      provider: fontProviders.google(),
      fallbacks: ["monospace"],
      weights: [300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
    },
  ],
});
