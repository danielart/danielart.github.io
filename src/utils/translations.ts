import type { CollectionEntry } from "astro:content";

const LANGUAGE_ORDER = ["en", "es", "ja", "pt"] as const;

type BlogPost = CollectionEntry<"blog">;

export type AlternateLanguageLink = {
  lang: BlogPost["data"]["lang"] | "x-default";
  url: string;
};

type PostUrlBuilder = (post: BlogPost) => string;

/**
 * Checks if two blog posts belong to the same translation concept.
 * `translationKey` is the only cross-post identity; dates and filenames are
 * deliberately ignored because independent articles can share either value.
 */
export function areTranslations(a: BlogPost, b: BlogPost): boolean {
  if (a.id === b.id) return true;

  return Boolean(
    a.data.translationKey &&
    b.data.translationKey &&
    a.data.translationKey === b.data.translationKey
  );
}

function assertUniqueLanguages(posts: BlogPost[]): void {
  const postsByLanguage = new Map<string, BlogPost>();

  for (const post of posts) {
    const existingPost = postsByLanguage.get(post.data.lang);
    if (existingPost) {
      throw new Error(
        `Duplicate ${post.data.lang} translation for translationKey "${post.data.translationKey}": "${existingPost.id}" and "${post.id}"`
      );
    }
    postsByLanguage.set(post.data.lang, post);
  }
}

function sortByLanguage(posts: BlogPost[]): BlogPost[] {
  return posts.toSorted(
    (a, b) =>
      LANGUAGE_ORDER.indexOf(a.data.lang) - LANGUAGE_ORDER.indexOf(b.data.lang)
  );
}

/**
 * Returns every published post in a translation concept, including `post`.
 * The result is deterministic and contains at most one post per language.
 */
export function getTranslationGroup(
  post: BlogPost,
  allPosts: BlogPost[]
): BlogPost[] {
  const group = [
    post,
    ...allPosts.filter(
      candidate =>
        candidate.id !== post.id &&
        !candidate.data.draft &&
        areTranslations(post, candidate)
    ),
  ];

  assertUniqueLanguages(group);
  return sortByLanguage(group);
}

/**
 * Returns all published translated versions of a post, excluding the post.
 */
export function getPostTranslations(
  post: BlogPost,
  allPosts: BlogPost[]
): BlogPost[] {
  return getTranslationGroup(post, allPosts).filter(
    candidate => candidate.id !== post.id
  );
}

/**
 * Finds a translation of `post` for a specific target language.
 */
export function getTranslationForLang(
  post: BlogPost,
  allPosts: BlogPost[],
  targetLang: string
): BlogPost | undefined {
  return getTranslationGroup(post, allPosts).find(
    candidate => candidate.data.lang === targetLang
  );
}

/**
 * Builds the same reciprocal hreflang set for every post in a concept.
 */
export function getAlternateLanguageLinks(
  post: BlogPost,
  allPosts: BlogPost[],
  toUrl: PostUrlBuilder
): AlternateLanguageLink[] {
  const group = getTranslationGroup(post, allPosts);
  const defaultPost =
    group.find(candidate => candidate.data.lang === "en") ?? post;

  return [
    { lang: "x-default", url: toUrl(defaultPost) },
    ...group.map(candidate => ({
      lang: candidate.data.lang,
      url: toUrl(candidate),
    })),
  ];
}

/**
 * Filters out any posts that are translations of `targetPost` (including
 * `targetPost` itself).
 */
export function filterOutTranslations(
  candidates: BlogPost[],
  targetPost: BlogPost
): BlogPost[] {
  return candidates.filter(
    candidate => !areTranslations(candidate, targetPost)
  );
}

/**
 * Groups posts exclusively by translationKey and picks one representative per
 * concept, preferring `preferredLang` when it exists.
 */
export function getRepresentativePosts(
  posts: BlogPost[],
  preferredLang = "en"
): BlogPost[] {
  const groups = new Map<string, BlogPost[]>();

  for (const post of posts) {
    const translationKey = post.data.translationKey?.trim();
    if (!translationKey) {
      throw new Error(`Post "${post.id}" is missing translationKey`);
    }

    const group = groups.get(translationKey) ?? [];
    group.push(post);
    groups.set(translationKey, group);
  }

  return [...groups.values()].map(group => {
    assertUniqueLanguages(group);
    return group.find(post => post.data.lang === preferredLang) ?? group[0];
  });
}
