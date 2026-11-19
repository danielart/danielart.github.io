import { expect, test } from "vitest";
import { changedUrls, createPayload } from "../submit-indexnow.mjs";

test("notifies additions, edits and deletions, without resending unchanged URLs", () => {
  const root = "https://danielart.github.io/";
  expect(
    changedUrls(
      { [root]: "same", [`${root}new/`]: "new", [`${root}edit/`]: "v2" },
      { [root]: "same", [`${root}gone/`]: "old", [`${root}edit/`]: "v1" }
    )
  ).toEqual([`${root}edit/`, `${root}gone/`, `${root}new/`]);
  expect(changedUrls({ [root]: "same" }, null)).toEqual([]);
});

test("only accepts this site's URLs and the published verification key", () => {
  expect(() => createPayload(["https://evil.example/post/"])).toThrow();
  expect(() =>
    createPayload(["https://danielart.github.io/?token=private"])
  ).toThrow();
  expect(
    createPayload(["https://danielart.github.io/posts/en/example/"]).host
  ).toBe("danielart.github.io");
});

test("manifest follows built publication state, retaining aliases but excluding noindex and duplicate pages", async () => {
  const { mkdtempSync, mkdirSync, writeFileSync, rmSync } =
    await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const { manifest } = await import("../submit-indexnow.mjs");
  const directory = mkdtempSync(join(tmpdir(), "blog-indexnow-"));
  const root = "https://danielart.github.io/";
  const write = (path: string, body: string) => {
    mkdirSync(join(directory, path), { recursive: true });
    writeFileSync(join(directory, path, "index.html"), body);
  };
  try {
    write(
      "posts/en/example",
      `<link rel="canonical" href="${root}posts/en/example/">article`
    );
    write(
      "search",
      `<link rel="canonical" href="${root}search/"><meta name="robots" content="noindex, follow">`
    );
    write(
      "posts/en",
      `<link rel="canonical" href="${root}posts/">duplicate collection`
    );
    write(
      "posts/en/old",
      `<link rel="canonical" href="${root}posts/en/example/"><meta http-equiv="refresh" content="0;url=${root}posts/en/example/">`
    );
    const before = manifest(directory);
    expect(Object.keys(before).sort()).toEqual([
      `${root}posts/en/example/`,
      `${root}posts/en/old/`,
    ]);
    write(
      "posts/es/nuevo",
      `<link rel="canonical" href="${root}posts/es/nuevo/">new translation`
    );
    expect(changedUrls(manifest(directory), before)).toEqual([
      `${root}posts/es/nuevo/`,
    ]);
    write(
      "posts/en/example",
      `<link rel="canonical" href="${root}posts/en/example/"><meta name="robots" content="noindex, follow">`
    );
    expect(manifest(directory)).not.toHaveProperty(`${root}posts/en/example/`);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("notification checks the public key and surfaces throttling without retrying in a loop", async () => {
  const { notifyUrls } = await import("../submit-indexnow.mjs");
  const requests: string[] = [];
  const payload = createPayload([
    "https://danielart.github.io/posts/en/example/",
  ]);
  const fetcher = async (url: string) => {
    requests.push(url);
    if (url === payload.keyLocation) return new Response(payload.key);
    return new Response("throttled", { status: 429 });
  };
  await expect(notifyUrls(payload.urlList, fetcher)).rejects.toThrow("429");
  expect(requests).toEqual([
    payload.keyLocation,
    "https://api.indexnow.org/indexnow",
  ]);
  requests.length = 0;
  await notifyUrls([], fetcher);
  expect(requests).toEqual([]);
  await expect(
    notifyUrls(payload.urlList, async () => new Response("wrong key"))
  ).rejects.toThrow("verification key");
});
