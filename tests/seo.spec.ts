import { expect, test, type Page } from "@playwright/test";

const PERSON_ID = "https://danielart.github.io/about/#person";

type JsonLdRecord = Record<string, unknown>;

async function getJsonLdGraph(page: Page): Promise<JsonLdRecord[]> {
  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .evaluate(element => JSON.parse(element.textContent ?? "{}"));

  return Array.isArray(jsonLd["@graph"]) ? jsonLd["@graph"] : [jsonLd];
}

async function getCanonical(page: Page): Promise<string | null> {
  return page.locator('link[rel="canonical"]').getAttribute("href");
}

async function getHreflangLinks(page: Page) {
  return page
    .locator('link[rel="alternate"][hreflang]')
    .evaluateAll(elements =>
      elements.map(element => ({
        lang: element.getAttribute("hreflang"),
        url: (element as HTMLLinkElement).href,
      }))
    );
}

test("BlogPosting uses the shared Person, clean headline, and visible language", async ({
  page,
}) => {
  await page.goto("/posts/es/claude-code-permission-modes-es/");

  const graph = await getJsonLdGraph(page);
  const article = graph.find(item => item["@type"] === "BlogPosting");
  const person = graph.find(item => item["@type"] === "Person");
  const visibleHeadline = (
    await page.locator("#main-content > h1").textContent()
  )?.trim();

  expect(article).toMatchObject({
    headline: visibleHeadline,
    inLanguage: "es",
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
  });
  expect(person?.["@id"]).toBe(PERSON_ID);
  await expect(page.locator('a[rel="author"]')).toHaveText(
    "Daniel Artola Dominguez"
  );
});

test("English collection duplicate points to the approved canonical", async ({
  page,
}) => {
  await page.goto("/posts/en/");
  expect(await getCanonical(page)).toBe("https://danielart.github.io/posts/");

  const prefixedAlternates = await getHreflangLinks(page);
  await page.goto("/posts/");

  expect(await getCanonical(page)).toBe("https://danielart.github.io/posts/");
  expect(await getHreflangLinks(page)).toEqual(prefixedAlternates);
  expect(prefixedAlternates).toContainEqual({
    lang: "en",
    url: "https://danielart.github.io/posts/",
  });
  expect(prefixedAlternates).not.toContainEqual(
    expect.objectContaining({ url: "https://danielart.github.io/posts/en/" })
  );
});

test("paginated collection hreflang only references existing equivalents", async ({
  page,
}) => {
  await page.goto("/posts/en/2/");

  expect(await getCanonical(page)).toBe(
    "https://danielart.github.io/posts/2/"
  );
  expect(await getHreflangLinks(page)).toEqual([
    { lang: "x-default", url: "https://danielart.github.io/posts/2/" },
    { lang: "en", url: "https://danielart.github.io/posts/2/" },
    { lang: "es", url: "https://danielart.github.io/posts/es/2/" },
  ]);
});

test("article hreflang URLs match canonical URL formatting and remain reciprocal", async ({
  page,
}) => {
  const paths = [
    "/posts/en/claude-advisor-tool-practical-guide/",
    "/posts/es/claude-advisor-tool-guia-practica/",
  ];
  const linkSets = [];

  for (const path of paths) {
    await page.goto(path);
    linkSets.push(await getHreflangLinks(page));
  }

  expect(linkSets[1]).toEqual(linkSets[0]);
  expect(linkSets[0].every(link => link.url.endsWith("/"))).toBe(true);
});

test("localized collection metadata reaches the HTML head and JSON-LD", async ({
  page,
}) => {
  await page.goto("/posts/ja/");

  const description = await page
    .locator('meta[name="description"]')
    .getAttribute("content");
  const collection = (await getJsonLdGraph(page)).find(
    item => item["@type"] === "CollectionPage"
  );

  expect(description).toContain("エージェント型エンジニアリング");
  expect(collection?.description).toBe(description);
  expect(await page.locator("html").getAttribute("lang")).toBe("ja");
});
