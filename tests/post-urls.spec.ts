import { expect, test } from "@playwright/test";
import redirects from "../src/post-redirects.json" with { type: "json" };

test("the indexed legacy URL redirects to the canonical English article", async ({
  page,
}) => {
  await page.goto("/posts/en/ai-music-video-en/");
  await expect(page).toHaveURL(/\/posts\/en\/ai-music-video\/$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://danielart.github.io/posts/en/ai-music-video/"
  );
});

test("Japanese redirects resolve to native routes with reciprocal language links", async ({
  page,
}) => {
  await page.goto("/posts/ja/ai-music-video/");
  await expect(page).toHaveURL(
    new RegExp(encodeURI("/posts/ja/ai-ミュージックビデオ制作/"))
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(page.locator('link[hreflang="ja"]')).toHaveAttribute(
    "href",
    new URL(
      "/posts/ja/ai-ミュージックビデオ制作/",
      "https://danielart.github.io"
    ).href
  );
  await page.getByRole("link", { name: "Read in English" }).click();
  await expect(page).toHaveURL(/\/posts\/en\/ai-music-video\/$/);
});

test("historic URLs return immediate redirects and destinations return articles", async ({
  request,
}) => {
  for (const [source, destination] of Object.entries(redirects)) {
    const response = await request.get(source);
    expect(response.status(), source).toBe(200);
    expect(await response.text(), source).toContain('content="0;url=');
    const target = await request.get(destination);
    expect(target.status(), destination).toBe(200);
    expect(await target.text(), destination).toContain(
      'property="og:type" content="article"'
    );
  }
});
