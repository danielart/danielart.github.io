import { describe, it, expect } from "vitest";
import { slugifyStr, slugifyAll } from "../slugify";

describe("slugifyStr", () => {
  it("should slugify Latin strings", () => {
    expect(slugifyStr("Hello World")).toBe("hello-world");
    expect(slugifyStr("E2E Testing")).toBe("e2e-testing");
    expect(slugifyStr("TypeScript 5.0")).toBe("typescript-5.0");
  });

  it("should preserve non-Latin characters using kebab-case", () => {
    // For non-Latin, lodash.kebabcase is used
    expect(slugifyStr("你好世界")).toBe("你好世界");
    expect(slugifyStr("안녕하세요")).toBe("안녕하세요");
  });

  it("should handle mixed Latin and non-Latin strings", () => {
    expect(slugifyStr("Hello 你好")).toBe("hello-你好");
  });
});

describe("slugifyAll", () => {
  it("should slugify an array of strings", () => {
    const input = ["Hello World", "TypeScript", "Astro Paper"];
    const expected = ["hello-world", "typescript", "astro-paper"];
    expect(slugifyAll(input)).toEqual(expected);
  });
});
