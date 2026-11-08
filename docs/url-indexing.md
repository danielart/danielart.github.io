# Post URLs and indexing

## URL policy

- Canonical articles use `/posts/<lang>/<localized-name>/`, with a trailing slash.
- English, Spanish and Portuguese filenames use lowercase ASCII words separated by hyphens. Japanese filenames use native Japanese with lowercase product names where appropriate.
- Routing is determined by the filename and `getPath()`, not a frontmatter `slug`.
- `translationKey` remains stable when a filename changes. Only existing published translations appear in `hreflang`.
- `getPath()` returns a page URL with a trailing slash. With `includeBase = false`, it returns bare route parameters for Astro pages and image endpoints.
- Preserve historic URLs in `src/post-redirects.json`. All aliases point directly to a canonical destination, never another alias. Keep them for at least one year, preferably indefinitely.
- GitHub Pages serves static HTML redirects with immediate meta refresh and a destination canonical. These are not HTTP 301 responses. Do not describe them as such.
- Redirects are excluded from the sitemap; canonical articles remain included. Each translated article is self-canonical.

## After deployment

1. Deploy the reviewed changes through the existing GitHub Pages workflow. A local build does not publish them.
2. Verify that the canonical articles return HTTP 200 and the old URLs resolve to the right language. In particular check `/posts/en/ai-music-video-en/` → `/posts/en/ai-music-video/` in a browser. Static meta refresh does not appear as an HTTP redirect in `curl -I`.
3. Verify the Search Console property covers `https://danielart.github.io/`, not only a post or language folder. Keep the existing ownership verification file/meta tag available.
4. Submit `https://danielart.github.io/sitemap-index.xml` in Search Console. The same property covers all four languages.
5. Inspect the new English music video URL, test the live URL, then request indexing. Inspect the old URL to let Google discover the move; do not request removal of the old URL or use Change of Address for a path migration.
6. Inspect one canonical article per language: verify indexability, rendered content, selected canonical and reciprocal `hreflang`. Use the sitemap for bulk discovery rather than requesting every URL repeatedly.
7. Submit the same sitemap in Bing Webmaster Tools after verifying site ownership. A local `BingSiteAuth.xml` file alone does not prove that verification is complete.
8. Monitor Page Indexing and Performance by `/posts/en/`, `/posts/es/`, `/posts/ja/` and `/posts/pt/`. Investigate excluded URLs individually. Sitemap submission and crawl requests do not guarantee indexing or traffic.

No separate Japanese Search Console is needed. Yahoo! JAPAN currently uses Google's search technology; Google discovery is the first priority there.

## Verification

```sh
pnpm format:check
pnpm lint
pnpm test:unit --run
pnpm build
pnpm validate:links
pnpm validate:seo
pnpm exec playwright test tests/post-urls.spec.ts
```

The SEO validator checks redirect artifacts, canonical destinations, sitemap membership and reciprocal language annotations. Search engine verification HTML is intentionally excluded from editorial metadata checks.

## Migration map

| Historic path                                                   | Canonical destination                                                  |
| --------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `/posts/en/ai-music-video-en/`                                  | `/posts/en/ai-music-video/`                                            |
| `/posts/en/claude-code-allowlist-en/`                           | `/posts/en/claude-code-allowlist/`                                     |
| `/posts/en/claude-code-permission-modes-en/`                    | `/posts/en/claude-code-permission-modes/`                              |
| `/posts/en/si-lo-publicas-es-tuyo/`                             | `/posts/en/if-you-publish-it-you-own-it/`                              |
| `/posts/es/5-atlassian-mcp-hacks-to-supercharge-your-workflow/` | `/posts/es/5-trucos-atlassian-mcp-para-potenciar-tu-flujo-de-trabajo/` |
| `/posts/es/ai-changelog-gem/`                                   | `/posts/es/resumenes-automaticos-novedades-ia/`                        |
| `/posts/es/ai-music-video-es/`                                  | `/posts/es/videoclip-con-ia/`                                          |
| `/posts/es/ai-music-video/`                                     | `/posts/es/videoclip-con-ia/`                                          |
| `/posts/es/ai-workflow/`                                        | `/posts/es/agentes-ia-desarrollo-meses-a-dias/`                        |
| `/posts/es/checkpoint-session-fork-claude-code/`                | `/posts/es/claude-code-bifurcacion-sesiones-puntos-control/`           |
| `/posts/es/claude-code-allowlist-es/`                           | `/posts/es/claude-code-lista-permisos-comandos/`                       |
| `/posts/es/claude-code-allowlist/`                              | `/posts/es/claude-code-lista-permisos-comandos/`                       |
| `/posts/es/claude-code-permission-modes-es/`                    | `/posts/es/claude-code-modos-permisos/`                                |
| `/posts/es/claude-code-permission-modes/`                       | `/posts/es/claude-code-modos-permisos/`                                |
| `/posts/es/jules-ai-mcp/`                                       | `/posts/es/jules-agente-ia-mcp/`                                       |
| `/posts/es/youtube-ai-agent/`                                   | `/posts/es/agentes-ia-automatizacion-youtube/`                         |
| `/posts/ja/ai-changelog-gem/`                                   | `/posts/ja/ai-更新情報の自動要約/`                                     |
| `/posts/ja/ai-music-video-ja/`                                  | `/posts/ja/ai-ミュージックビデオ制作/`                                 |
| `/posts/ja/ai-music-video/`                                     | `/posts/ja/ai-ミュージックビデオ制作/`                                 |
| `/posts/ja/claude-advisor-tool-practical-guide-ja/`             | `/posts/ja/claude-advisor-tool-実践ガイド/`                            |
| `/posts/ja/claude-advisor-tool-practical-guide/`                | `/posts/ja/claude-advisor-tool-実践ガイド/`                            |
| `/posts/ja/claude-code-allowlist-ja/`                           | `/posts/ja/claude-code-コマンド許可リスト/`                            |
| `/posts/ja/claude-code-allowlist/`                              | `/posts/ja/claude-code-コマンド許可リスト/`                            |
| `/posts/ja/claude-code-concepts-guide-ja/`                      | `/posts/ja/claude-code-基本概念ガイド/`                                |
| `/posts/ja/claude-code-concepts-guide/`                         | `/posts/ja/claude-code-基本概念ガイド/`                                |
| `/posts/ja/claude-code-permission-modes-ja/`                    | `/posts/ja/claude-code-権限モード/`                                    |
| `/posts/ja/claude-code-permission-modes/`                       | `/posts/ja/claude-code-権限モード/`                                    |
| `/posts/ja/key-mcps-lead-productivity-ja/`                      | `/posts/ja/mcp-エンジニアリングリーダーの業務自動化/`                  |
| `/posts/ja/key-mcps-lead-productivity/`                         | `/posts/ja/mcp-エンジニアリングリーダーの業務自動化/`                  |
| `/posts/ja/youtube-ai-agent/`                                   | `/posts/ja/ai-エージェントによる-youtube-自動化/`                      |
| `/posts/pt/ai-changelog-gem/`                                   | `/posts/pt/resumos-automaticos-novidades-ia/`                          |
| `/posts/pt/ai-music-video-pt/`                                  | `/posts/pt/videoclipe-com-ia/`                                         |
| `/posts/pt/ai-music-video/`                                     | `/posts/pt/videoclipe-com-ia/`                                         |
| `/posts/pt/claude-advisor-tool-practical-guide-pt/`             | `/posts/pt/claude-advisor-tool-guia-pratico/`                          |
| `/posts/pt/claude-advisor-tool-practical-guide/`                | `/posts/pt/claude-advisor-tool-guia-pratico/`                          |
| `/posts/pt/claude-code-allowlist-pt/`                           | `/posts/pt/claude-code-lista-permissoes-comandos/`                     |
| `/posts/pt/claude-code-allowlist/`                              | `/posts/pt/claude-code-lista-permissoes-comandos/`                     |
| `/posts/pt/claude-code-concepts-guide-pt/`                      | `/posts/pt/claude-code-conceitos-guia/`                                |
| `/posts/pt/claude-code-concepts-guide/`                         | `/posts/pt/claude-code-conceitos-guia/`                                |
| `/posts/pt/claude-code-permission-modes-pt/`                    | `/posts/pt/claude-code-modos-permissao/`                               |
| `/posts/pt/claude-code-permission-modes/`                       | `/posts/pt/claude-code-modos-permissao/`                               |
| `/posts/pt/key-mcps-lead-productivity-pt/`                      | `/posts/pt/fluxos-mcp-produtividade-lideres-engenharia/`               |
| `/posts/pt/key-mcps-lead-productivity/`                         | `/posts/pt/fluxos-mcp-produtividade-lideres-engenharia/`               |
| `/posts/pt/youtube-ai-agent/`                                   | `/posts/pt/agentes-ia-automacao-youtube/`                              |

## Official references

- [Google: URL structure](https://developers.google.com/search/docs/crawling-indexing/url-structure)
- [Google: localized pages](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google: URL migrations](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
- [Google: request recrawling](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
- [Astro: static redirects](https://docs.astro.build/en/guides/routing/#redirects)
- [Bing: sitemaps](https://www.bing.com/webmasters/help/sitemaps-3b5cf6ed)
- [LY Corporation: Yahoo! JAPAN search technology](https://privacy.lycorp.co.jp/en/utilization/)
