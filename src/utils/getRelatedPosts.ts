import type { CollectionEntry } from "astro:content";
import postFilter from "./postFilter";
import { areTranslations } from "./translations";

/**
 * Recommends between 2 and 4 related posts for a given target post based on:
 * 1. Same language (+100)
 * 2. Same pillar (+50)
 * 3. Shared tags (+10 per tag)
 * 4. Shared target audience (+5 per role)
 * 5. Recency as tie-breaker
 *
 * Excludes: target post, its translations, drafts, and future scheduled posts.
 */
export function getRelatedPosts(
  targetPost: CollectionEntry<"blog">,
  allPosts: CollectionEntry<"blog">[],
  limit = 4
): CollectionEntry<"blog">[] {
  const eligiblePosts = allPosts.filter(p => {
    if (p.id === targetPost.id) return false;
    if (!postFilter(p)) return false;
    if (areTranslations(targetPost, p)) return false;
    return true;
  });

  const scored = eligiblePosts.map(p => {
    let score = 0;

    // 1. Same language priority
    if (p.data.lang === targetPost.data.lang) {
      score += 100;
    }

    // 2. Same pillar
    if (targetPost.data.pillar && p.data.pillar === targetPost.data.pillar) {
      score += 50;
    }

    // 3. Shared tags
    if (targetPost.data.tags && p.data.tags) {
      const sharedTags = p.data.tags.filter(t =>
        targetPost.data.tags.includes(t)
      ).length;
      score += sharedTags * 10;
    }

    // 4. Shared audience
    if (targetPost.data.audience && p.data.audience) {
      const sharedAudience = p.data.audience.filter(a =>
        targetPost.data.audience!.includes(a)
      ).length;
      score += sharedAudience * 5;
    }

    const pubTime = new Date(p.data.pubDatetime).getTime();

    return { post: p, score, pubTime };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.pubTime - a.pubTime;
  });

  return scored.map(s => s.post).slice(0, Math.max(2, limit));
}

export default getRelatedPosts;
