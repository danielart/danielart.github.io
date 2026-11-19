import type { SitemapItem } from "@astrojs/sitemap";

/** Reuse the rendered collection metadata; never use build time as freshness. */
export function withArticleLastmod(
  item: SitemapItem,
  html: string
): SitemapItem {
  const source = html.match(
    /<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s
  )?.[1];
  if (!source) return item;
  const data = JSON.parse(source);
  const article = (data["@graph"] ?? [data]).find(
    (entity: Record<string, unknown>) =>
      entity["@type"] === "BlogPosting" && entity.url === item.url
  );
  const value = article?.dateModified ?? article?.datePublished;
  if (!value) return item;
  const date = new Date(value);
  return Number.isNaN(date.valueOf())
    ? item
    : { ...item, lastmod: date.toISOString() };
}
