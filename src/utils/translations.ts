import type { CollectionEntry } from "astro:content";

function getFilename(filePath?: string): string | undefined {
  return filePath?.split("/").pop();
}

/**
 * Checks if two blog posts are translations of the same idea/concept.
 */
export function areTranslations(
  a: CollectionEntry<"blog">,
  b: CollectionEntry<"blog">
): boolean {
  if (a.id === b.id) return true;

  // 1. Explicit translationKey check
  if (a.data.translationKey && b.data.translationKey) {
    return a.data.translationKey === b.data.translationKey;
  }
  if (a.data.translationKey && !b.data.translationKey) {
    const bFilename = getFilename(b.filePath)?.replace(/\.md$/, "");
    if (a.data.translationKey === bFilename) return true;
  }
  if (!a.data.translationKey && b.data.translationKey) {
    const aFilename = getFilename(a.filePath)?.replace(/\.md$/, "");
    if (b.data.translationKey === aFilename) return true;
  }

  // 2. Fallback: Check pubDatetime match
  const sameTime =
    new Date(a.data.pubDatetime).getTime() ===
    new Date(b.data.pubDatetime).getTime();
  if (sameTime) return true;

  // 3. Fallback: Check base filename match
  const aFilename = getFilename(a.filePath);
  const bFilename = getFilename(b.filePath);
  if (aFilename && bFilename && aFilename === bFilename) return true;

  return false;
}

/**
 * Returns all translated versions of a target post (excluding the target post itself and drafts).
 */
export function getPostTranslations(
  post: CollectionEntry<"blog">,
  allPosts: CollectionEntry<"blog">[]
): CollectionEntry<"blog">[] {
  return allPosts.filter(
    p =>
      p.id !== post.id &&
      !p.data.draft &&
      p.data.lang !== post.data.lang &&
      areTranslations(post, p)
  );
}

/**
 * Finds a translation of `post` for a specific target language.
 */
export function getTranslationForLang(
  post: CollectionEntry<"blog">,
  allPosts: CollectionEntry<"blog">[],
  targetLang: string
): CollectionEntry<"blog"> | undefined {
  if (post.data.lang === targetLang) return post;
  return allPosts.find(
    p => !p.data.draft && p.data.lang === targetLang && areTranslations(post, p)
  );
}

/**
 * Filters out any posts that are translations of `targetPost` (including `targetPost` itself).
 */
export function filterOutTranslations(
  candidates: CollectionEntry<"blog">[],
  targetPost: CollectionEntry<"blog">
): CollectionEntry<"blog">[] {
  return candidates.filter(
    candidate => !areTranslations(candidate, targetPost)
  );
}

/**
 * Groups posts by translation concept and picks one representative version per idea.
 * Prefers `preferredLang` version when available.
 */
export function getRepresentativePosts(
  posts: CollectionEntry<"blog">[],
  preferredLang = "en"
): CollectionEntry<"blog">[] {
  const groups: CollectionEntry<"blog">[][] = [];

  for (const post of posts) {
    let existingGroup = groups.find(group =>
      group.some(item => areTranslations(item, post))
    );
    if (!existingGroup) {
      existingGroup = [];
      groups.push(existingGroup);
    }
    existingGroup.push(post);
  }

  return groups.map(group => {
    const preferred = group.find(p => p.data.lang === preferredLang);
    return preferred ?? group[0];
  });
}
