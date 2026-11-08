import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import redirects from "../../post-redirects.json";

describe("historic post URLs", () => {
  it("preserves the English music video URL submitted to Google", () => {
    expect(redirects["/posts/en/ai-music-video-en/"]).toBe(
      "/posts/en/ai-music-video/"
    );
  });

  it("redirects directly to existing published posts in the same language", () => {
    for (const [source, destination] of Object.entries(redirects)) {
      expect(source).toMatch(/^\/posts\/(en|es|ja|pt)\/[^/]+\/$/);
      expect(destination.split("/")[2]).toBe(source.split("/")[2]);
      expect(Object.hasOwn(redirects, destination), source).toBe(false);
      const file = resolve(
        "src/data/blog",
        `${destination.slice("/posts/".length, -1)}.md`
      );
      expect(existsSync(file), destination).toBe(true);
      expect(readFileSync(file, "utf8")).not.toMatch(/^draft: true$/m);
    }
  });
});
