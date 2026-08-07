import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";
import { getRepresentativePosts } from "@/utils/translations";
import { SITE } from "@/config";
import { COLLECTION_DESCRIPTIONS } from "@/utils/seo";

export async function GET() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const sortedPosts = getSortedPosts(posts);
  const conceptPosts = getRepresentativePosts(sortedPosts, "en");

  return rss({
    title: SITE.title,
    description: COLLECTION_DESCRIPTIONS.en,
    site: SITE.website,
    items: conceptPosts.map(({ data, id, filePath }) => ({
      link: getPath(id, filePath),
      title: data.title.replace(/^\[(EN|ES|JA|PT)\]\s*/i, ""),
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}
