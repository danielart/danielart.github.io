import { describe, expect, it, vi } from "vitest";

vi.mock("@/content.config", () => ({ BLOG_PATH: "src/data/blog" }));

import { getPath } from "../getPath";

describe("getPath", () => {
  it("returns canonical page links with one trailing slash", () => {
    expect(getPath("en/example", "src/data/blog/en/example.md")).toBe(
      "/posts/en/example/"
    );
    expect(getPath("example", undefined)).toBe("/posts/example/");
  });

  it("returns route parameters without leading or trailing slashes", () => {
    expect(getPath("es/ejemplo", "src/data/blog/es/ejemplo.md", false)).toBe(
      "es/ejemplo"
    );
    expect(getPath("example", undefined, false)).toBe("example");
  });

  it("preserves Japanese route names", () => {
    expect(getPath("ja/ai-動画制作", "src/data/blog/ja/ai-動画制作.md")).toBe(
      "/posts/ja/ai-動画制作/"
    );
  });
});
