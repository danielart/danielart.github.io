import { expect, test } from "vitest";
import { withArticleLastmod } from "../sitemap";

const html = (article: object) =>
  `<script type="application/ld+json">${JSON.stringify({ "@graph": [article] })}</script>`;
const url = "https://danielart.github.io/posts/en/example/";

test("sitemap dates follow the rendered article's editorial dates", () => {
  expect(
    withArticleLastmod(
      { url },
      html({
        "@type": "BlogPosting",
        url,
        datePublished: "2026-08-06T17:00:00Z",
        dateModified: "2026-11-17T10:00:00Z",
      })
    ).lastmod
  ).toBe("2026-11-17T10:00:00.000Z");
  expect(
    withArticleLastmod(
      { url },
      html({
        "@type": "BlogPosting",
        url,
        datePublished: "2026-08-06T17:00:00Z",
      })
    ).lastmod
  ).toBe("2026-08-06T17:00:00.000Z");
});

test("does not invent dates for collections, aliases or invalid metadata", () => {
  for (const article of [
    { "@type": "CollectionPage", datePublished: "2026-01-01" },
    {
      "@type": "BlogPosting",
      url: `${url}other/`,
      datePublished: "2026-01-01",
    },
    { "@type": "BlogPosting", url, datePublished: "invalid" },
  ]) {
    expect(withArticleLastmod({ url }, html(article))).toEqual({ url });
  }
});
