import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import postFilter from "../postFilter";
import { SITE } from "../../config";
import type { CollectionEntry } from "astro:content";

describe("postFilter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return false if post is a draft", () => {
    const post = {
      data: {
        draft: true,
        pubDatetime: new Date().toISOString(),
      },
    } as unknown as CollectionEntry<"blog">;
    expect(postFilter(post)).toBe(false);
  });

  it("should return true if post is not a draft and publication time has passed", () => {
    const now = new Date("2023-01-01T12:00:00Z");
    vi.setSystemTime(now);

    const post = {
      data: {
        draft: false,
        pubDatetime: new Date("2023-01-01T11:59:00Z").toISOString(),
      },
    } as unknown as CollectionEntry<"blog">;
    expect(postFilter(post)).toBe(true);
  });

  it("should return false if publication time is in the future (beyond margin) and not in DEV", () => {
    // We force DEV to false if we could, but here we just check against the actual code behavior
    const now = new Date("2023-01-01T12:00:00Z");
    vi.setSystemTime(now);

    const post = {
      data: {
        draft: false,
        pubDatetime: new Date(now.getTime() + SITE.scheduledPostMargin + 1000).toISOString(),
      },
    } as unknown as CollectionEntry<"blog">;

    const isDev = import.meta.env.DEV;
    if (isDev) {
      expect(postFilter(post)).toBe(true);
    } else {
      expect(postFilter(post)).toBe(false);
    }
  });

  it("should return true if publication time is within the scheduled margin", () => {
    const now = new Date("2023-01-01T12:00:00Z");
    vi.setSystemTime(now);

    const post = {
      data: {
        draft: false,
        pubDatetime: new Date(now.getTime() + SITE.scheduledPostMargin - 1000).toISOString(),
      },
    } as unknown as CollectionEntry<"blog">;
    expect(postFilter(post)).toBe(true);
  });
});
