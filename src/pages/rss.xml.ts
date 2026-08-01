import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";
import { getRepresentativePosts } from "@/utils/translations";
import { SITE } from "@/config";

export async function GET() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const sortedPosts = getSortedPosts(posts);
  const representativePosts = getRepresentativePosts(sortedPosts, "en");

  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: representativePosts.map(({ data, id, filePath }) => ({
      link: getPath(id, filePath),
      title: data.title.replace(/^\[(EN|ES|JA|PT)\]\s*/i, ""),
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}
