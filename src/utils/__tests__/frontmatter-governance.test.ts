import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const BLOG_DIRECTORY = join(process.cwd(), "src/data/blog");
const PILLARS = new Set([
  "agent-ready-repositories",
  "safe-autonomy",
  "engineering-management",
  "real-experiments",
]);
const ARTICLE_TYPES = new Set([
  "guide",
  "case-study",
  "experiment",
  "opinion",
  "reference",
]);
const AUDIENCES = new Set([
  "developer",
  "engineering-manager",
  "tech-lead",
  "general",
]);
const LANGUAGE_TAGS = new Set(["en", "es", "ja", "pt"]);

function getMarkdownFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) return getMarkdownFiles(path);
    return entry.name.endsWith(".md") ? [path] : [];
  });
}

function getFrontmatter(filePath: string): string {
  const content = readFileSync(filePath, "utf8");
  const match = content.match(/^---\n([\s\S]*?)\n---/);

  if (!match) {
    throw new Error(
      `Missing frontmatter: ${relative(process.cwd(), filePath)}`
    );
  }

  return match[1];
}

function getScalar(frontmatter: string, field: string): string | undefined {
  const match = frontmatter.match(new RegExp(`^${field}:\\s*(.+)$`, "m"));
  return match?.[1].trim().replace(/^['"]|['"]$/g, "");
}

function getList(frontmatter: string, field: string): string[] {
  const match = frontmatter.match(
    new RegExp(`^${field}:\\s*\\n((?:\\s+-\\s+.+\\n?)*)`, "m")
  );

  return match
    ? [...match[1].matchAll(/^\s+-\s+(.+)$/gm)].map(item =>
        item[1].trim().replace(/^['"]|['"]$/g, "")
      )
    : [];
}

const posts = getMarkdownFiles(BLOG_DIRECTORY).map(filePath => {
  const frontmatter = getFrontmatter(filePath);

  return {
    filePath: relative(process.cwd(), filePath),
    translationKey: getScalar(frontmatter, "translationKey"),
    pillar: getScalar(frontmatter, "pillar"),
    articleType: getScalar(frontmatter, "articleType"),
    audience: getList(frontmatter, "audience"),
    tags: getList(frontmatter, "tags"),
  };
});

describe("blog frontmatter governance", () => {
  it("requires valid editorial metadata on every post", () => {
    for (const post of posts) {
      expect(post.translationKey, post.filePath).toMatch(/\S/);
      expect(PILLARS.has(post.pillar ?? ""), post.filePath).toBe(true);
      expect(ARTICLE_TYPES.has(post.articleType ?? ""), post.filePath).toBe(
        true
      );
      expect(post.audience.length, post.filePath).toBeGreaterThan(0);

      for (const audience of post.audience) {
        expect(AUDIENCES.has(audience), `${post.filePath}: ${audience}`).toBe(
          true
        );
      }
    }
  });

  it("does not use language codes as tags", () => {
    for (const post of posts) {
      for (const tag of post.tags) {
        expect(LANGUAGE_TAGS.has(tag), `${post.filePath}: ${tag}`).toBe(false);
      }
    }
  });

  it("keeps editorial metadata consistent across translations", () => {
    const metadataByTranslationKey = new Map<string, string>();

    for (const post of posts) {
      const metadata = JSON.stringify({
        pillar: post.pillar,
        articleType: post.articleType,
        audience: post.audience,
      });
      const existing = metadataByTranslationKey.get(post.translationKey ?? "");

      expect(existing ?? metadata, post.filePath).toBe(metadata);
      metadataByTranslationKey.set(post.translationKey ?? "", metadata);
    }
  });
});
