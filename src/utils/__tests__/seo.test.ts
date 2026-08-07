import { describe, expect, it } from "vitest";
import {
  COLLECTION_DESCRIPTIONS,
  PERSON_ID,
  PERSON_STRUCTURED_DATA,
  createStructuredData,
  getCollectionAlternateLanguages,
  getCollectionCanonicalUrl,
  getCollectionDescription,
} from "@/utils/seo";

describe("SEO entity and collection metadata", () => {
  it("defines one stable and publicly anchored Person entity", () => {
    expect(PERSON_ID).toBe("https://danielart.github.io/about/#person");
    expect(PERSON_STRUCTURED_DATA).toMatchObject({
      "@type": "Person",
      "@id": PERSON_ID,
      url: "https://danielart.github.io/about/",
      name: "Daniel Artola Dominguez",
      jobTitle: "Engineering Lead",
    });
    expect(PERSON_STRUCTURED_DATA.sameAs).not.toContain(
      "https://medium.com/@danielart"
    );
    expect(PERSON_STRUCTURED_DATA.knowsAbout.length).toBeGreaterThan(0);
  });

  it("references the shared Person and keeps article language and headline clean", () => {
    const schema = createStructuredData({
      pageType: "article",
      title: "Clean title | Daniel Artola",
      headline: "Clean title",
      description: "A useful description.",
      canonicalURL: "https://danielart.github.io/posts/es/clean-title/",
      socialImageURL: "https://danielart.github.io/clean-title.png",
      lang: "es",
      pubDatetime: new Date("2026-01-01T00:00:00Z"),
    });
    const graph = schema["@graph"] as Array<Record<string, unknown>>;
    const article = graph.find(item => item["@type"] === "BlogPosting");
    const person = graph.find(item => item["@type"] === "Person");

    expect(article).toMatchObject({
      headline: "Clean title",
      inLanguage: "es",
      author: { "@id": PERSON_ID },
      publisher: { "@id": PERSON_ID },
    });
    expect(person?.["@id"]).toBe(PERSON_ID);
  });

  it("canonicalizes the duplicate English collection to the unprefixed route", () => {
    expect(getCollectionCanonicalUrl("en")).toBe(
      "https://danielart.github.io/posts/"
    );
    expect(getCollectionCanonicalUrl("en", 2)).toBe(
      "https://danielart.github.io/posts/2/"
    );
    expect(getCollectionCanonicalUrl("es", 2)).toBe(
      "https://danielart.github.io/posts/es/2/"
    );
  });

  it("builds canonical collection hreflang links only for available languages", () => {
    expect(getCollectionAlternateLanguages(2, ["en", "es"])).toEqual([
      {
        lang: "x-default",
        url: "https://danielart.github.io/posts/2/",
      },
      { lang: "en", url: "https://danielart.github.io/posts/2/" },
      { lang: "es", url: "https://danielart.github.io/posts/es/2/" },
    ]);
  });

  it("provides localized and pagination-specific collection descriptions", () => {
    expect(new Set(Object.values(COLLECTION_DESCRIPTIONS)).size).toBe(4);
    expect(getCollectionDescription("es", 2)).toContain("Página 2");
    expect(getCollectionDescription("ja", 2)).toContain("2ページ目");
  });
});
