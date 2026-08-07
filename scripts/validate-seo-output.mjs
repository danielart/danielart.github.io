import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = join(projectRoot, "dist");
const siteOrigin = "https://danielart.github.io";
const personId = `${siteOrigin}/about/#person`;
const failures = [];

if (!existsSync(distRoot)) {
  process.stderr.write("Missing dist/. Run pnpm build before validate:seo.\n");
  process.exit(1);
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const entryPath = join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : entryPath;
  });
}

function capture(html, pattern) {
  return html.match(pattern)?.[1];
}

function decodeHtml(value = "") {
  return value
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_match, code) =>
      String.fromCodePoint(Number.parseInt(code, 16))
    )
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .trim();
}

function getPageUrl(filePath) {
  const relativePath = relative(distRoot, filePath).split(sep).join("/");
  if (relativePath === "index.html") return `${siteOrigin}/`;
  if (relativePath.endsWith("/index.html")) {
    return `${siteOrigin}/${relativePath.replace(/index\.html$/, "")}`;
  }
  return `${siteOrigin}/${relativePath}`;
}

function approvedCanonicalFor(pageUrl) {
  const url = new URL(pageUrl);
  const match = url.pathname.match(/^\/posts\/en(?:\/(\d+))?\/$/);
  if (!match) return pageUrl;
  return `${siteOrigin}/posts/${match[1] ? `${match[1]}/` : ""}`;
}

function fail(message) {
  failures.push(message);
}

const pages = new Map();

for (const filePath of walk(distRoot).filter(file => file.endsWith(".html"))) {
  const html = readFileSync(filePath, "utf8");
  const pageUrl = getPageUrl(filePath);
  const canonical = capture(
    html,
    /<link rel="canonical" href="([^"]+)"/
  );
  const lang = capture(html, /<html[^>]* lang="([^"]+)"/);
  const description = capture(
    html,
    /<meta name="description" content="([^"]*)"/
  );
  const jsonLdSource = capture(
    html,
    /<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s
  );
  const alternates = [
    ...html.matchAll(
      /<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g
    ),
  ].map(match => ({ lang: match[1], url: match[2] }));

  if (!canonical) fail(`${pageUrl}: missing canonical`);
  if (canonical !== approvedCanonicalFor(pageUrl)) {
    fail(`${pageUrl}: canonical ${canonical} violates the approved mapping`);
  }

  let jsonLd;
  try {
    jsonLd = JSON.parse(jsonLdSource ?? "");
  } catch (error) {
    fail(`${pageUrl}: invalid JSON-LD (${error.message})`);
  }

  const graph = Array.isArray(jsonLd?.["@graph"])
    ? jsonLd["@graph"]
    : jsonLd
      ? [jsonLd]
      : [];
  const person = graph.find(item => item?.["@type"] === "Person");
  const article = graph.find(item => item?.["@type"] === "BlogPosting");

  if (person?.["@id"] !== personId) {
    fail(`${pageUrl}: missing shared Person ${personId}`);
  }

  if (article) {
    const headline = decodeHtml(capture(html, /<h1[^>]*>(.*?)<\/h1>/s));
    if (article.headline !== headline) {
      fail(`${pageUrl}: BlogPosting headline does not match the visible H1`);
    }
    if (article.inLanguage !== lang) {
      fail(`${pageUrl}: BlogPosting inLanguage does not match html[lang]`);
    }
    if (article.author?.["@id"] !== personId) {
      fail(`${pageUrl}: BlogPosting author does not reference shared Person`);
    }
    if (article.publisher?.["@id"] !== personId) {
      fail(`${pageUrl}: BlogPosting publisher does not reference shared Person`);
    }
    if (!html.includes('rel="author"')) {
      fail(`${pageUrl}: structured author has no visible byline`);
    }
  }

  pages.set(pageUrl, {
    canonical,
    lang,
    description,
    alternates,
    article: Boolean(article),
  });
}

for (const [pageUrl, page] of pages) {
  if (!page.alternates.length) continue;

  const languages = page.alternates.map(alternate => alternate.lang);
  if (new Set(languages).size !== languages.length) {
    fail(`${pageUrl}: duplicate hreflang values`);
  }

  const selfLanguage = page.alternates.find(
    alternate => alternate.lang === page.lang
  );
  if (selfLanguage?.url !== page.canonical) {
    fail(`${pageUrl}: hreflang self-reference does not match canonical`);
  }

  for (const alternate of page.alternates) {
    const target = pages.get(alternate.url);
    if (!target) {
      fail(`${pageUrl}: hreflang target is not generated: ${alternate.url}`);
      continue;
    }
    if (target.canonical !== alternate.url) {
      fail(`${pageUrl}: hreflang target is not canonical: ${alternate.url}`);
    }
    if (
      !target.alternates.some(candidate => candidate.url === page.canonical)
    ) {
      fail(`${pageUrl}: hreflang target is not reciprocal: ${alternate.url}`);
    }
  }
}

const expectedLocalizedDescriptions = {
  "/posts/": "Practical articles on agentic engineering",
  "/posts/es/": "Artículos prácticos sobre ingeniería agéntica",
  "/posts/ja/": "エージェント型エンジニアリング",
  "/posts/pt/": "Artigos práticos sobre engenharia de agentes",
};

for (const [pathname, expectedText] of Object.entries(
  expectedLocalizedDescriptions
)) {
  const page = pages.get(`${siteOrigin}${pathname}`);
  if (!page?.description?.includes(expectedText)) {
    fail(`${pathname}: localized description is missing from generated HTML`);
  }
}

const sitemap = readFileSync(join(distRoot, "sitemap-0.xml"), "utf8");
if (!sitemap.includes(`<loc>${siteOrigin}/posts/</loc>`)) {
  fail("sitemap: missing canonical English collection /posts/");
}
if (/<loc>https:\/\/danielart\.github\.io\/posts\/en(?:\/\d+)?\/<\/loc>/.test(sitemap)) {
  fail("sitemap: contains a duplicate English collection URL");
}

if (failures.length) {
  process.stderr.write(`SEO production validation failed:\n- ${failures.join("\n- ")}\n`);
  process.exit(1);
}

const articleCount = [...pages.values()].filter(page => page.article).length;
process.stdout.write(
  `SEO production validation passed for ${pages.size} HTML pages and ${articleCount} BlogPosting entities.\n`
);
