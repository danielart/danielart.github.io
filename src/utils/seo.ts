import { SITE } from "@/config";

export const SITE_LANGUAGES = ["en", "es", "ja", "pt"] as const;

export type SiteLanguage = (typeof SITE_LANGUAGES)[number];

export const COLLECTION_DESCRIPTIONS: Record<SiteLanguage, string> = {
  en: "Practical articles on agentic engineering, safe AI autonomy, developer tooling, engineering leadership, and reproducible experiments.",
  es: "Artículos prácticos sobre ingeniería agéntica, autonomía segura con IA, herramientas para desarrollo, liderazgo técnico y experimentos reproducibles.",
  ja: "エージェント型エンジニアリング、安全なAI自律運用、開発者ツール、エンジニアリングリーダーシップ、再現可能な実践検証を扱う技術記事。",
  pt: "Artigos práticos sobre engenharia de agentes, autonomia segura com IA, ferramentas para desenvolvedores, liderança de engenharia e experimentos reproduzíveis.",
};

export const PAGE_DESCRIPTIONS = {
  about:
    "About Daniel Artola, an Engineering Lead working on AI agents, developer tooling, open-source software, and reliable engineering workflows.",
  certifications:
    "Daniel Artola’s professional certifications and training in software architecture, engineering leadership, AI, security, and JavaScript.",
  archives:
    "Browse Daniel Artola’s technical writing by year and month, covering AI agents, software engineering, developer tools, and engineering leadership.",
  tags: "Explore Daniel Artola’s articles by topic, from AI agents and MCP integrations to developer productivity and engineering leadership.",
} as const;

export const TAG_DESCRIPTIONS: Record<string, string> = {
  ai: "Articles on artificial intelligence, AI agents, multimodal workflows, and practical applications in software engineering.",
  productivity:
    "Developer productivity strategies, tools, and workflows for delivering reliable software with less operational friction.",
  claude:
    "Practical guides to Claude and Claude Code, including architecture, skills, permissions, allowlists, and safe autonomy.",
  mcp: "Guides and real-world integrations using the Model Context Protocol to connect AI agents with engineering tools and data.",
  gemini:
    "Experiments and workflows using Google Gemini for research, automation, structured thinking, and multimodal projects.",
  automation:
    "Automation patterns for engineering, content workflows, reporting, and repeatable AI-assisted processes.",
  jules:
    "Hands-on workflows with Google Jules for asynchronous coding, MCP integrations, and delegated development tasks.",
  workflow:
    "Agentic development workflows that connect planning, implementation, verification, and engineering tools.",
  stitch:
    "Practical uses of Google Stitch for UI exploration and AI-assisted product development workflows.",
  antigravity:
    "Architecture, custom skills, and multi-agent development workflows using Google Antigravity.",
  video:
    "Experiments in AI-assisted video production, visual consistency, editing, and multimodal creative workflows.",
  youtube:
    "AI-assisted YouTube strategy, content automation, audience analysis, and lessons from real projects.",
  "incident-management":
    "Engineering practices for investigating incidents, testing hypotheses, and communicating evidence responsibly.",
  "team-culture":
    "Engineering leadership and team-culture practices for trust, ownership, collaboration, and responsible AI adoption.",
};

export const PERSON_ID = new URL("/about/#person", SITE.website).href;

export const PERSON_STRUCTURED_DATA = {
  "@type": "Person",
  "@id": PERSON_ID,
  url: new URL("/about/", SITE.website).href,
  name: SITE.author,
  jobTitle: "Engineering Lead",
  description: PAGE_DESCRIPTIONS.about,
  sameAs: [
    "https://github.com/danielart",
    "https://www.linkedin.com/in/danielartoladominguez",
    "https://dev.to/danielart",
    "https://danielartola.substack.com/",
  ],
  knowsAbout: [
    "Agentic engineering",
    "AI agents",
    "Multi-agent systems",
    "Safe AI autonomy",
    "Developer tooling",
    "Software architecture",
    "Engineering leadership",
    "React",
    "Event-driven architecture",
    "Model Context Protocol",
  ],
} as const;

export type CollectionAlternateLanguage = {
  lang: SiteLanguage | "x-default";
  url: string;
};

export function getCollectionDescription(
  lang: SiteLanguage,
  pageNumber = 1
): string {
  const description = COLLECTION_DESCRIPTIONS[lang];
  if (pageNumber <= 1) return description;

  const pageLabels: Record<SiteLanguage, string> = {
    en: `Page ${pageNumber}.`,
    es: `Página ${pageNumber}.`,
    ja: `${pageNumber}ページ目。`,
    pt: `Página ${pageNumber}.`,
  };

  return `${description} ${pageLabels[lang]}`;
}

export function getCollectionCanonicalUrl(
  lang: SiteLanguage,
  pageNumber = 1
): string {
  const languageSegment = lang === "en" ? "" : `/${lang}`;
  const pageSegment = pageNumber <= 1 ? "" : `/${pageNumber}`;
  return new URL(`/posts${languageSegment}${pageSegment}/`, SITE.website).href;
}

export function getCollectionAlternateLanguages(
  pageNumber: number,
  availableLanguages: SiteLanguage[]
): CollectionAlternateLanguage[] {
  const englishUrl = getCollectionCanonicalUrl("en", pageNumber);

  return [
    { lang: "x-default", url: englishUrl },
    ...availableLanguages.map(lang => ({
      lang,
      url: getCollectionCanonicalUrl(lang, pageNumber),
    })),
  ];
}

type PageType = "website" | "profile" | "article" | "collection";

type StructuredDataOptions = {
  pageType: PageType;
  title: string;
  headline?: string;
  description: string;
  canonicalURL: string;
  socialImageURL: string;
  lang: string;
  pubDatetime?: Date;
  modDatetime?: Date | null;
};

export function createStructuredData({
  pageType,
  title,
  headline = title,
  description,
  canonicalURL,
  socialImageURL,
  lang,
  pubDatetime,
  modDatetime,
}: StructuredDataOptions): Record<string, unknown> {
  const personReference = { "@id": PERSON_ID };

  if (pageType === "website") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${SITE.website}#website`,
          name: SITE.siteName,
          url: SITE.website,
          description,
          author: personReference,
          publisher: personReference,
        },
        PERSON_STRUCTURED_DATA,
      ],
    };
  }

  if (pageType === "profile") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ProfilePage",
          "@id": `${canonicalURL}#profile-page`,
          name: headline,
          url: canonicalURL,
          description,
          mainEntity: personReference,
        },
        PERSON_STRUCTURED_DATA,
      ],
    };
  }

  if (pageType === "collection") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `${canonicalURL}#collection-page`,
          name: headline,
          url: canonicalURL,
          description,
          author: personReference,
          isPartOf: { "@id": `${SITE.website}#website` },
        },
        PERSON_STRUCTURED_DATA,
      ],
    };
  }

  const article: Record<string, unknown> = {
    "@type": "BlogPosting",
    "@id": `${canonicalURL}#article`,
    url: canonicalURL,
    headline,
    image: socialImageURL,
    author: personReference,
    publisher: personReference,
    description,
    inLanguage: lang,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalURL,
    },
    isPartOf: { "@id": `${SITE.website}#website` },
  };

  if (pubDatetime) article.datePublished = pubDatetime.toISOString();
  if (modDatetime) article.dateModified = modDatetime.toISOString();

  return {
    "@context": "https://schema.org",
    "@graph": [
      article,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE.website,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Posts",
            item: new URL("/posts/", SITE.website).href,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: headline,
            item: canonicalURL,
          },
        ],
      },
      PERSON_STRUCTURED_DATA,
    ],
  };
}
