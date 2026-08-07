import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const projectRoot = process.cwd();
const distDirectory = join(projectRoot, "dist");
const llmsPath = join(projectRoot, "public", "llms.txt");
const siteOrigin = "https://danielart.github.io";
const hrefPattern = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
const markdownLinkPattern = /(?<!!)\[[^\]]*\]\(([^\s)]+)(?:\s+[^)]*)?\)/g;

function findHtmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const filePath = join(directory, entry.name);
    if (entry.isDirectory()) return findHtmlFiles(filePath);
    return entry.isFile() && entry.name.endsWith(".html") ? [filePath] : [];
  });
}

function getPublicPath(filePath) {
  const fileFromDist = relative(distDirectory, filePath).split(sep).join("/");
  if (fileFromDist === "index.html") return "/";
  if (fileFromDist.endsWith("/index.html")) {
    return `/${fileFromDist.slice(0, -"index.html".length)}`;
  }
  return `/${fileFromDist}`;
}

function isInternalHref(href, sourceUrl) {
  if (!href || href.startsWith("#") || href.startsWith("//")) return false;

  try {
    const url = new URL(href, sourceUrl);
    return url.origin === sourceUrl.origin;
  } catch {
    return false;
  }
}

function getCandidatePaths(pathname) {
  const decodedPath = decodeURIComponent(pathname).replace(/^\/+/, "");
  const destination = resolve(distDirectory, decodedPath);

  if (destination !== distDirectory && !destination.startsWith(`${distDirectory}${sep}`)) {
    return [];
  }

  if (!decodedPath || pathname.endsWith("/")) {
    return [join(destination, "index.html")];
  }

  return [
    destination,
    `${destination}.html`,
    join(destination, "index.html"),
  ];
}

function destinationExists(url) {
  return getCandidatePaths(url.pathname).some(candidate => existsSync(candidate));
}

function collectHtmlHrefs(filePath) {
  const content = readFileSync(filePath, "utf8");
  return [...content.matchAll(hrefPattern)].map(match =>
    (match[1] ?? match[2] ?? match[3]).replaceAll("&amp;", "&")
  );
}

function collectLlmsHrefs() {
  const content = readFileSync(llmsPath, "utf8");
  return [...content.matchAll(markdownLinkPattern)].map(match => match[1]);
}

function validateSource(sourceName, sourceUrl, hrefs) {
  return hrefs.flatMap(href => {
    if (!isInternalHref(href, sourceUrl)) return [];

    const destination = new URL(href, sourceUrl);
    if (destinationExists(destination)) return [];

    return [{ sourceName, href, destination: destination.pathname }];
  });
}

if (!existsSync(distDirectory) || !statSync(distDirectory).isDirectory()) {
  console.error("Missing dist directory. Run the build before validating links.");
  process.exit(1);
}

if (!existsSync(llmsPath)) {
  console.error("Missing public/llms.txt.");
  process.exit(1);
}

const brokenLinks = [
  ...findHtmlFiles(distDirectory).flatMap(filePath =>
    validateSource(
      relative(projectRoot, filePath),
      new URL(getPublicPath(filePath), siteOrigin),
      collectHtmlHrefs(filePath)
    )
  ),
  ...validateSource(
    relative(projectRoot, llmsPath),
    new URL("/llms.txt", siteOrigin),
    collectLlmsHrefs()
  ),
];

if (brokenLinks.length > 0) {
  console.error(`Found ${brokenLinks.length} broken internal link(s):`);
  for (const { sourceName, href, destination } of brokenLinks) {
    console.error(`- ${sourceName}: ${href} -> ${destination}`);
  }
  process.exit(1);
}

console.log("Internal link validation passed.");
