export const SITE = {
  website: "https://danielart.github.io/",
  author: "Daniel Artola Dominguez",
  brandName: "Daniel Artola",
  profile: "https://danielart.github.io",
  desc: "Engineering Lead, AI Engineer & Open Source Contributor. Building intelligent multi-agent systems and contributing to next-generation web frameworks.",
  siteName: "Daniel Artola",
  siteTitle: "Daniel Artola — AI Engineering and Developer Tools",
  title: "Daniel Artola — AI Engineering and Developer Tools",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 8,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/danielart/danielart.github.io/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Europe/Madrid", // Updated to user's likely time zone based on Barcelona location
} as const;
