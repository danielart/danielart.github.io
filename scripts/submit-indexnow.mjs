import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { resolve, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const origin = "https://danielart.github.io";
const key = "082a40e664f5454cab3b8ea03c9ff245";

export function changedUrls(current, previous) {
  // The first successful deployment establishes a baseline, not a bulk resubmit.
  if (!previous) return [];
  return [...new Set([...Object.keys(current), ...Object.keys(previous)])]
    .filter(url => current[url] !== previous[url])
    .sort();
}

export function createPayload(urlList) {
  for (const value of urlList) {
    const url = new URL(value);
    if (
      url.origin !== origin ||
      url.search ||
      url.hash ||
      url.username ||
      url.password
    ) {
      throw new Error(`Invalid IndexNow URL: ${value}`);
    }
  }
  return {
    host: new URL(origin).host,
    key,
    keyLocation: `${origin}/${key}.txt`,
    urlList,
  };
}

export function manifest(directory) {
  function walk(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
      const path = resolve(dir, entry.name);
      return entry.isDirectory() ? walk(path) : [path];
    });
  }
  const entries = [];
  for (const file of walk(directory).filter(file =>
    file.endsWith("index.html")
  )) {
    const html = readFileSync(file, "utf8");
    if (/<meta name="robots" content="[^"]*noindex/i.test(html)) continue;
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    const path = relative(directory, file)
      .split(sep)
      .join("/")
      .replace(/index\.html$/, "");
    const url = new URL(path, `${origin}/`).href;
    if (canonical !== url && !html.includes('http-equiv="refresh"')) continue;
    createPayload([url]);
    entries.push([url, createHash("sha256").update(html).digest("hex")]);
  }
  return Object.fromEntries(entries.sort(([a], [b]) => a.localeCompare(b)));
}

export async function notifyUrls(urls, fetchRequest = fetch) {
  if (!urls.length) return;
  const payload = createPayload(urls);
  const proof = await fetchRequest(payload.keyLocation, {
    signal: AbortSignal.timeout(30000),
  });
  if (!proof.ok || (await proof.text()).trim() !== key)
    throw new Error(
      "Published IndexNow verification key is unavailable; no URLs submitted."
    );
  for (let offset = 0; offset < urls.length; offset += 10000) {
    const response = await fetchRequest("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(createPayload(urls.slice(offset, offset + 10000))),
      signal: AbortSignal.timeout(30000),
    });
    if (![200, 202].includes(response.status))
      throw new Error(
        `IndexNow returned ${response.status}; baseline retained for retry.`
      );
    process.stdout.write(
      `IndexNow received ${Math.min(10000, urls.length - offset)} URLs (${response.status}); indexing is not guaranteed.\n`
    );
  }
}

async function main() {
  const [command, currentPath, previousPath] = process.argv.slice(2);
  if (command === "manifest") {
    writeFileSync(
      currentPath,
      JSON.stringify(manifest(resolve("dist")), null, 2) + "\n"
    );
    return;
  }
  if (command !== "submit" || !currentPath || !previousPath) {
    throw new Error(
      "Usage: submit-indexnow.mjs manifest OUTPUT | submit CURRENT PREVIOUS [--dry-run]"
    );
  }
  const current = JSON.parse(readFileSync(currentPath, "utf8"));
  const previous = existsSync(previousPath)
    ? JSON.parse(readFileSync(previousPath, "utf8"))
    : null;
  const urls = changedUrls(current, previous);
  const payload = createPayload(urls);
  if (process.argv.includes("--dry-run")) {
    process.stdout.write(
      JSON.stringify({ baseline: !previous, ...payload }, null, 2) + "\n"
    );
    return;
  }
  if (urls.length) {
    await notifyUrls(urls);
  } else
    process.stdout.write(
      (previous
        ? "No changed URLs."
        : "Established first deployment baseline; no bulk submission.") + "\n"
    );
  writeFileSync(previousPath, JSON.stringify(current, null, 2) + "\n");
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main().catch(error => {
    process.stderr.write(error.message + "\n");
    process.exitCode = 1;
  });
}
