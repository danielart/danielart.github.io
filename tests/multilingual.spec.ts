import { expect, test, type Page } from "@playwright/test";

type AlternateLink = { lang: string; url: string };

async function getAlternateLinks(page: Page): Promise<AlternateLink[]> {
  return page
    .locator('link[rel="alternate"][hreflang]')
    .evaluateAll(elements =>
      elements.map(element => ({
        lang: element.getAttribute("hreflang") ?? "",
        url: (element as HTMLLinkElement).href,
      }))
    );
}

test("translated posts expose reciprocal and unique hreflang links", async ({
  page,
}) => {
  const paths = [
    "/posts/en/claude-advisor-tool-practical-guide",
    "/posts/es/claude-advisor-tool-guia-practica",
  ];
  const linkSets: AlternateLink[][] = [];

  for (const path of paths) {
    await page.goto(path);
    linkSets.push(await getAlternateLinks(page));
  }

  expect(linkSets[1]).toEqual(linkSets[0]);

  const languages = linkSets[0].map(link => link.lang);
  expect(new Set(languages).size).toBe(languages.length);
  expect(linkSets[0].find(link => link.lang === "x-default")?.url).toMatch(
    /\/posts\/en\/claude-advisor-tool-practical-guide\/$/
  );
});

test("RSS keeps distinct concepts published at the same time", async ({
  request,
}) => {
  const response = await request.get("/rss.xml");
  const rss = await response.text();

  expect(response.ok()).toBe(true);
  expect(rss).toContain("/posts/en/ai-workflow");
  expect(rss).toContain("/posts/en/jules-ai-mcp");
  expect(rss).toContain("/posts/en/youtube-ai-agent");
});
