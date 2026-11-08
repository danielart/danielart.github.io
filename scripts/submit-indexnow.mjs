import fs from "fs";

const body = {
  host: "danielart.github.io",
  key: "082a40e664f5454cab3b8ea03c9ff245",
  keyLocation: "https://danielart.github.io/082a40e664f5454cab3b8ea03c9ff245.txt",
  urlList: [
    "https://danielart.github.io/",
    "https://danielart.github.io/about/",
    "https://danielart.github.io/certifications/",
    "https://danielart.github.io/posts/",
    "https://danielart.github.io/posts/es/",
    "https://danielart.github.io/archives/",
    "https://danielart.github.io/posts/es/5-trucos-atlassian-mcp-flujo-trabajo/",
    "https://danielart.github.io/posts/es/claude-advisor-tool-guia-practica/",
    "https://danielart.github.io/posts/es/claude-code-conceptos-guia/",
    "https://danielart.github.io/posts/es/claude-code-modos-permisos/",
    "https://danielart.github.io/posts/es/claude-code-lista-permisos-comandos/",
    "https://danielart.github.io/posts/es/claude-code-bifurcacion-sesiones-puntos-control/",
    "https://danielart.github.io/posts/es/mcp-claves-lead-productividad/",
    "https://danielart.github.io/posts/es/landing-pages-post-diseno-ia/",
    "https://danielart.github.io/posts/es/landing-pages-with-ai-design-skills/",
    "https://danielart.github.io/posts/es/resumenes-automaticos-novedades-ia/",
    "https://danielart.github.io/posts/es/agentes-ia-automatizacion-youtube/",
    "https://danielart.github.io/posts/es/agentes-ia-desarrollo-meses-a-dias/",
    "https://danielart.github.io/posts/es/jules-agente-ia-mcp/",
    "https://danielart.github.io/posts/es/si-lo-publicas-es-tuyo/",
    "https://danielart.github.io/posts/es/videoclip-con-ia/",
    "https://danielart.github.io/posts/en/5-atlassian-mcp-hacks-workflow/",
    "https://danielart.github.io/posts/en/claude-advisor-tool-practical-guide/",
    "https://danielart.github.io/posts/en/claude-code-concepts-guide/",
    "https://danielart.github.io/posts/en/claude-code-permission-modes/",
    "https://danielart.github.io/posts/en/claude-code-allowlist/",
    "https://danielart.github.io/posts/en/checkpoint-session-fork-claude-code/",
    "https://danielart.github.io/posts/en/key-mcps-lead-productivity/",
    "https://danielart.github.io/posts/en/landing-pages-with-ai-design-skills/",
    "https://danielart.github.io/posts/en/ai-workflow/",
    "https://danielart.github.io/posts/en/ai-changelog-gem/",
    "https://danielart.github.io/posts/en/youtube-ai-agent/",
    "https://danielart.github.io/posts/en/jules-ai-mcp/",
    "https://danielart.github.io/posts/en/if-you-publish-it-you-own-it/",
    "https://danielart.github.io/posts/en/ai-music-video/",
    "https://danielart.github.io/posts/pt/claude-advisor-tool-guia-pratico/",
    "https://danielart.github.io/posts/pt/fluxos-mcp-produtividade-lideres-engenharia/",
    "https://danielart.github.io/posts/pt/claude-code-modos-permissao/",
    "https://danielart.github.io/posts/ja/claude-advisor-tool-%E5%AE%9F%E8%B7%B5%E3%82%AC%E3%82%A4%E3%83%89/",
    "https://danielart.github.io/posts/ja/claude-code-%E6%A8%A9%E9%99%90%E3%83%A2%E3%83%BC%E3%83%89/",
    "https://danielart.github.io/tags/",
    "https://danielart.github.io/tags/claude/",
    "https://danielart.github.io/tags/mcp/",
    "https://danielart.github.io/tags/ai/",
    "https://danielart.github.io/tags/productivity/",
    "https://danielart.github.io/tags/workflow/",
    "https://danielart.github.io/tags/lead/",
    "https://danielart.github.io/tags/automation/",
    "https://danielart.github.io/tags/gemini/",
    "https://danielart.github.io/tags/web-design/"
  ]
};

async function submitIndexNow() {
  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow"
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Submitting ${body.urlList.length} URLs to ${endpoint}...`);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(body)
      });
      console.log(`Endpoint: ${endpoint} -> Status: ${res.status} ${res.statusText}`);
    } catch (err) {
      console.error(`Error submitting to ${endpoint}:`, err);
    }
  }
}

submitIndexNow();
