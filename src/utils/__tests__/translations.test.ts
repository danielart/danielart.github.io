import { describe, expect, it } from "vitest";
import type { CollectionEntry } from "astro:content";
import {
  areTranslations,
  getPostTranslations,
  getTranslationForLang,
  filterOutTranslations,
  getRepresentativePosts,
} from "../translations";

function mockPost(
  id: string,
  lang: "en" | "es" | "ja" | "pt",
  pubDatetime: string,
  filePath: string,
  translationKey?: string,
  draft = false
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
      tags: ["ai"],
      draft,
      translationKey,
    },
  } as CollectionEntry<"blog">;
}

describe("translations utilities", () => {
  const postEn = mockPost(
    "en/ai-agent",
    "en",
    "2026-01-01T00:00:00Z",
    "src/data/blog/en/ai-agent.md",
    "ai-agent-key"
  );
  const postEs = mockPost(
    "es/agente-ia",
    "es",
    "2026-01-01T00:00:00Z",
    "src/data/blog/es/agente-ia.md",
    "ai-agent-key"
  );
  const postJaWithoutKey = mockPost(
    "ja/ai-agent-ja",
    "ja",
    "2026-01-01T00:00:00Z",
    "src/data/blog/ja/ai-agent-ja.md"
  );
  const otherPost = mockPost(
    "en/other-post",
    "en",
    "2026-02-01T00:00:00Z",
    "src/data/blog/en/other-post.md"
  );

  describe("areTranslations", () => {
    it("should identify posts with matching translationKey as translations", () => {
      expect(areTranslations(postEn, postEs)).toBe(true);
    });

    it("should fallback to matching pubDatetime when translationKey is missing on one", () => {
      expect(areTranslations(postEn, postJaWithoutKey)).toBe(true);
    });

    it("should return false for unrelated posts", () => {
      expect(areTranslations(postEn, otherPost)).toBe(false);
    });
  });

  describe("getPostTranslations", () => {
    it("should return translations in other languages", () => {
      const allPosts = [postEn, postEs, postJaWithoutKey, otherPost];
      const translations = getPostTranslations(postEn, allPosts);
      expect(translations.map(p => p.data.lang)).toEqual(["es", "ja"]);
    });
  });

  describe("getTranslationForLang", () => {
    it("should find the translation for a given target language", () => {
      const allPosts = [postEn, postEs, otherPost];
      const esTranslation = getTranslationForLang(postEn, allPosts, "es");
      expect(esTranslation?.id).toBe("es/agente-ia");
    });
  });

  describe("filterOutTranslations", () => {
    it("should exclude translations of targetPost", () => {
      const candidates = [postEs, postJaWithoutKey, otherPost];
      const filtered = filterOutTranslations(candidates, postEn);
      expect(filtered).toEqual([otherPost]);
    });
  });

  describe("getRepresentativePosts", () => {
    it("should return single representative per concept preferring preferred language", () => {
      const allPosts = [postEs, postEn, postJaWithoutKey, otherPost];
      const representative = getRepresentativePosts(allPosts, "en");
      expect(representative.map(p => p.id)).toEqual([
        "en/ai-agent",
        "en/other-post",
      ]);
    });
  });
});
