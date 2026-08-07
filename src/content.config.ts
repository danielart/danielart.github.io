import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/blog";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      lang: z.enum(["en", "es", "ja", "pt"]).default("en"),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
      translationKey: z.string().min(1),
      pillar: z.enum([
        "agent-ready-repositories",
        "safe-autonomy",
        "engineering-management",
        "real-experiments",
      ]),
      articleType: z.enum([
        "guide",
        "case-study",
        "experiment",
        "opinion",
        "reference",
      ]),
      audience: z
        .array(
          z.enum(["developer", "engineering-manager", "tech-lead", "general"])
        )
        .min(1),
      testedWith: z.array(z.string()).optional(),
    }),
});

export const collections = { blog };
