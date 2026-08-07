import type { CollectionEntry } from "astro:content";
import { describe, expect, it } from "vitest";
import {
  areTranslations,
  filterOutTranslations,
  getAlternateLanguageLinks,
  getPostTranslations,
  getRepresentativePosts,
  getTranslationForLang,
} from "../translations";

type BlogLanguage = "en" | "es" | "ja" | "pt";

function mockPost(
  id: string,
  lang: BlogLanguage,
  translationKey: string | undefined,
  options: {
    pubDatetime?: string;
    filePath?: string;
    draft?: boolean;
  } = {}
): CollectionEntry<"blog"> {
  const filename = id.split("/").pop();

  return {
    id,
    collection: "blog",
    filePath: options.filePath ?? `src/data/blog/${lang}/${filename ?? id}.md`,
    data: {
      title: `Title ${id}`,
      author: "Daniel Artola",
      pubDatetime: new Date(options.pubDatetime ?? "2026-01-01T00:00:00Z"),
      lang,
      description: "Description",
      tags: ["ai"],
      draft: options.draft ?? false,
      translationKey,
    },
  } as CollectionEntry<"blog">;
}

describe("translations utilities", () => {
  const postEn = mockPost("en/ai-agent", "en", "ai-agent");
  const postEs = mockPost("es/agente-ia", "es", "ai-agent");
  const postJa = mockPost("ja/ai-agent", "ja", "ai-agent");
  const otherPostWithSameDate = mockPost("en/other-post", "en", "other-post");

  describe("areTranslations", () => {
    it("identifies posts with the same translationKey", () => {
      expect(areTranslations(postEn, postEs)).toBe(true);
    });

    it("does not treat different articles published at the same time as translations", () => {
      expect(areTranslations(postEn, otherPostWithSameDate)).toBe(false);
    });

    it("does not use a shared filename as translation identity", () => {
      const sameFilename = mockPost("es/ai-agent", "es", "different-concept");

      expect(areTranslations(postEn, sameFilename)).toBe(false);
    });

    it("does not infer a translation when translationKey is missing", () => {
      const postWithoutKey = mockPost("pt/ai-agent", "pt", undefined);

      expect(areTranslations(postEn, postWithoutKey)).toBe(false);
    });
  });

  describe("getPostTranslations", () => {
    it("returns only published posts with the exact translationKey", () => {
      const draft = mockPost("pt/ai-agent", "pt", "ai-agent", {
        draft: true,
      });
      const translations = getPostTranslations(postEn, [
        postEn,
        postEs,
        postJa,
        otherPostWithSameDate,
        draft,
      ]);

      expect(translations.map(post => post.data.lang)).toEqual(["es", "ja"]);
    });

    it("rejects multiple published translations in the same language", () => {
      const duplicateSpanishPost = mockPost(
        "es/otro-agente-ia",
        "es",
        "ai-agent"
      );

      expect(() =>
        getPostTranslations(postEn, [postEn, postEs, duplicateSpanishPost])
      ).toThrow(/Duplicate es translation.*ai-agent/);
    });
  });

  describe("getTranslationForLang", () => {
    it("finds the translation for a target language", () => {
      const esTranslation = getTranslationForLang(
        postEn,
        [postEn, postEs],
        "es"
      );

      expect(esTranslation?.id).toBe("es/agente-ia");
    });
  });

  describe("getAlternateLanguageLinks", () => {
    const toUrl = (post: CollectionEntry<"blog">) =>
      `https://example.com/posts/${post.data.lang}/${post.id.split("/").pop()}`;

    it("generates reciprocal, unique hreflang sets with English as x-default", () => {
      const posts = [postEn, postEs, postJa];
      const linksByPost = posts.map(post =>
        getAlternateLanguageLinks(post, posts, toUrl)
      );

      expect(linksByPost[1]).toEqual(linksByPost[0]);
      expect(linksByPost[2]).toEqual(linksByPost[0]);

      const languages = linksByPost[0].map(link => link.lang);
      expect(new Set(languages).size).toBe(languages.length);
      expect(linksByPost[0]).toContainEqual({
        lang: "x-default",
        url: "https://example.com/posts/en/ai-agent",
      });
    });

    it("uses the current language as x-default when English is unavailable", () => {
      const spanishOnlyPost = mockPost(
        "es/concepto-solo-en-espanol",
        "es",
        "spanish-only"
      );

      expect(
        getAlternateLanguageLinks(spanishOnlyPost, [spanishOnlyPost], toUrl)[0]
      ).toEqual({
        lang: "x-default",
        url: "https://example.com/posts/es/concepto-solo-en-espanol",
      });
    });
  });

  describe("filterOutTranslations", () => {
    it("excludes only posts with the target translationKey", () => {
      const filtered = filterOutTranslations(
        [postEs, postJa, otherPostWithSameDate],
        postEn
      );

      expect(filtered).toEqual([otherPostWithSameDate]);
    });
  });

  describe("getRepresentativePosts", () => {
    it("keeps distinct concepts that share the same publication date", () => {
      const sharedDate = "2026-02-15T00:00:00Z";
      const workflowEn = mockPost("en/ai-workflow", "en", "ai-workflow", {
        pubDatetime: sharedDate,
      });
      const workflowEs = mockPost("es/ai-workflow", "es", "ai-workflow", {
        pubDatetime: sharedDate,
      });
      const julesEn = mockPost("en/jules-ai-mcp", "en", "jules-ai-mcp", {
        pubDatetime: sharedDate,
      });
      const youtubeEn = mockPost(
        "en/youtube-ai-agent",
        "en",
        "youtube-ai-agent",
        { pubDatetime: sharedDate }
      );

      const representatives = getRepresentativePosts(
        [workflowEs, workflowEn, julesEn, youtubeEn],
        "en"
      );

      expect(representatives.map(post => post.id)).toEqual([
        "en/ai-workflow",
        "en/jules-ai-mcp",
        "en/youtube-ai-agent",
      ]);
    });

    it("rejects a duplicate language within a concept", () => {
      const duplicateEnglishPost = mockPost(
        "en/another-ai-agent",
        "en",
        "ai-agent"
      );

      expect(() =>
        getRepresentativePosts([postEn, duplicateEnglishPost])
      ).toThrow(/Duplicate en translation.*ai-agent/);
    });

    it("rejects posts without a translationKey", () => {
      const postWithoutKey = mockPost("en/missing-key", "en", undefined);

      expect(() => getRepresentativePosts([postWithoutKey])).toThrow(
        /missing translationKey/
      );
    });
  });
});
