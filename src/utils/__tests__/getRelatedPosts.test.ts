import { describe, expect, it } from "vitest";
import type { CollectionEntry } from "astro:content";
import { getRelatedPosts } from "../getRelatedPosts";

function mockPost(
  id: string,
  lang: "en" | "es" | "ja" | "pt",
  pubDatetime: string,
  filePath: string,
  opts: {
    pillar?:
      | "agent-ready-repositories"
      | "safe-autonomy"
      | "engineering-management"
      | "real-experiments";
    tags?: string[];
    audience?: Array<
      "developer" | "engineering-manager" | "tech-lead" | "general"
    >;
    translationKey?: string;
    draft?: boolean;
  } = {}
): CollectionEntry<"blog"> {
  return {
    id,
    collection: "blog",
    filePath,
    data: {
      title: `Title ${id}`,
      author: "Daniel Artola",
      pubDatetime: new Date(pubDatetime),
      lang,
      description: "Description",
      tags: opts.tags ?? ["ai"],
      draft: opts.draft ?? false,
      pillar: opts.pillar,
      audience: opts.audience,
      translationKey: opts.translationKey,
    },
  } as CollectionEntry<"blog">;
}

describe("getRelatedPosts", () => {
  const targetPost = mockPost(
    "en/target",
    "en",
    "2026-03-01T00:00:00Z",
    "src/data/blog/en/target.md",
    {
      pillar: "agent-ready-repositories",
      tags: ["ai", "mcp"],
      audience: ["developer"],
      translationKey: "target-key",
    }
  );

  const translationOfTarget = mockPost(
    "es/target-es",
    "es",
    "2026-03-01T00:00:00Z",
    "src/data/blog/es/target-es.md",
    {
      translationKey: "target-key",
    }
  );

  const samePillarAndTags = mockPost(
    "en/same-pillar",
    "en",
    "2026-02-15T00:00:00Z",
    "src/data/blog/en/same-pillar.md",
    {
      pillar: "agent-ready-repositories",
      tags: ["ai", "mcp"],
      audience: ["developer"],
    }
  );

  const diffPillar = mockPost(
    "en/diff-pillar",
    "en",
    "2026-02-10T00:00:00Z",
    "src/data/blog/en/diff-pillar.md",
    {
      pillar: "safe-autonomy",
      tags: ["ai"],
    }
  );

  const esPost = mockPost(
    "es/other-es",
    "es",
    "2026-02-20T00:00:00Z",
    "src/data/blog/es/other-es.md",
    {
      pillar: "agent-ready-repositories",
      tags: ["ai", "mcp"],
    }
  );

  const draftPost = mockPost(
    "en/draft",
    "en",
    "2026-03-02T00:00:00Z",
    "src/data/blog/en/draft.md",
    {
      draft: true,
    }
  );

  it("should exclude current post, its translations, and drafts", () => {
    const allPosts = [
      targetPost,
      translationOfTarget,
      samePillarAndTags,
      diffPillar,
      draftPost,
    ];
    const related = getRelatedPosts(targetPost, allPosts, 4);

    expect(related.find(p => p.id === targetPost.id)).toBeUndefined();
    expect(related.find(p => p.id === translationOfTarget.id)).toBeUndefined();
    expect(related.find(p => p.id === draftPost.id)).toBeUndefined();
  });

  it("should prioritize same language, same pillar, and matching tags", () => {
    const allPosts = [
      targetPost,
      translationOfTarget,
      diffPillar,
      esPost,
      samePillarAndTags,
    ];
    const related = getRelatedPosts(targetPost, allPosts, 2);

    expect(related[0].id).toBe(samePillarAndTags.id);
    expect(related[1].id).toBe(diffPillar.id);
  });
});
