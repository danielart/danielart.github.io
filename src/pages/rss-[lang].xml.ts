import type { APIRoute } from "astro";
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";

export async function getStaticPaths() {
  return [
    { params: { lang: "en" } },
    { params: { lang: "es" } },
    { params: { lang: "ja" } },
    { params: { lang: "pt" } },
  ];
}

export const GET: APIRoute = async ({ params }) => {
  const { lang } = params;
  if (!lang) {
    return new Response("Language parameter is required", { status: 400 });
  }

  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const sortedPosts = getSortedPosts(posts);

  // Filter by language
  const langPosts = sortedPosts.filter(({ data }) => data.lang === lang);

  const langNames = {
    en: "English",
    es: "Español",
    pt: "Português",
    ja: "日本語",
  };

  const feedTitle = `${SITE.title} (${langNames[lang as keyof typeof langNames] || lang.toUpperCase()})`;

  return rss({
    title: feedTitle,
    description: SITE.desc,
    site: SITE.website,
    items: langPosts.map(({ data, id, filePath }) => ({
      link: getPath(id, filePath),
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
};
