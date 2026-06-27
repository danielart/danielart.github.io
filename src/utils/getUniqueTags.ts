import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";
import postFilter from "./postFilter";

export interface Tag {
  tag: string;
  tagName: string;
  count: number;
}

const getUniqueTags = (posts: CollectionEntry<"blog">[]) => {
  const filteredPosts = posts.filter(postFilter);

  // Calculate counts for each slugified tag
  const tagCountMap: Record<string, number> = {};
  filteredPosts.forEach(post => {
    post.data.tags.forEach(tag => {
      const slugified = slugifyStr(tag);
      tagCountMap[slugified] = (tagCountMap[slugified] || 0) + 1;
    });
  });

  const tags: Tag[] = filteredPosts
    .flatMap(post => post.data.tags)
    .map(tag => ({ tag: slugifyStr(tag), tagName: tag }))
    .filter(
      (value, index, self) =>
        self.findIndex(tag => tag.tag === value.tag) === index
    )
    .map(tag => ({
      ...tag,
      count: tagCountMap[tag.tag] || 0,
    }))
    .sort((tagA, tagB) => tagA.tag.localeCompare(tagB.tag));
  return tags;
};

export default getUniqueTags;
