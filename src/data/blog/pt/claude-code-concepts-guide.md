---
title: "[PT] Guia Técnico: Conceitos do Claude Code"
author: Daniel Artola
pubDatetime: 2026-04-09T10:20:14Z
slug: claude-code-concepts-guide-pt
featured: true
draft: false
tags:
  - ai
  - claude
  - guide
  - pt
lang: pt
description: Um guia técnico baseado na documentação oficial da Anthropic sobre os cinco conceitos distintos no Claude Code.
---

## Índice

## Introdução

**Claude Code — Prompt, Skill, Subagent, Agent e Agent Teams**
_Guia técnico baseado na documentação oficial da Anthropic_

Fontes: [Claude Code Features](https://code.claude.com/docs/en/agent-sdk/claude-code-features) · [Agent Skills](https://code.claude.com/docs/en/agent-sdk/skills) · [Subagents](https://code.claude.com/docs/en/agent-sdk/subagents) · [Agent Teams](https://code.claude.com/docs/en/agent-teams)

### Cinco conceitos distintos no Claude Code

Não é uma hierarquia linear de complexidade: são ferramentas com propósitos distintos que podem ser combinadas.

`Prompt` / `Skill` / `Subagent` / `Agent (session)` / `Agent Teams`

- **Prompt**: Mensagem para o agente com instruções, contexto e/ou ferramentas. É a unidade básica de qualquer interação.
- **Skill**: Diretório com um arquivo `SKILL.md` encapsulando conhecimento reutilizável. O Claude o carrega automaticamente ou via `/slash-command`.
- **Subagent**: Instância do Claude com seu próprio contexto, system prompt, ferramentas e permissões, invocada pelo agente principal via a ferramenta `Agent`.
- **Agent (session)**: Claude Code em modo interativo ou headless: tem acesso a ferramentas, lê o `CLAUDE.md`, pode delegar para subagentes. É a sessão principal.
- **Agent Teams**: Múltiplas sessões coordenadas do Claude Code: um líder de equipe (team lead) e múltiplos colegas (teammates), cada um com seu próprio contexto. Requer ativação explícita.

## Prompt — Instrução para o agente

> *"Um prompt não é apenas uma simples pergunta: é qualquer instrução que você dá ao Claude, com ou sem ferramentas, simples ou complexa."*

O prompt é a entrada (input) que o Claude Code recebe em qualquer interação. Ele pode iniciar uma conversa interativa, executar uma tarefa headless (sem interface) (`claude -p "..."`), ou servir como a base de um sistema agentic complexo com system prompt, contexto do projeto e ferramentas ativas.

> **De acordo com a documentação oficial:** O Agent SDK usa um system prompt mínimo por padrão. Para incluir o system prompt completo do Claude Code com todas as suas ferramentas e comportamentos, especifique `systemPrompt: { type: "preset", preset: "claude_code" }`. Arquivos `CLAUDE.md` são carregados como contexto de projeto adicional.

**Quando focar no prompt:**
- Tarefa delimitada ou conversa direta
- Scripting headless com `-p`
- Configuração de system prompt para o SDK
- Ponto de entrada para qualquer fluxo agentic

> **Exemplos:**
> - `claude -p "Refatore a função authenticate em src/auth.ts"` — tarefa rápida headless
> - Conversa interativa com o Claude Code com acesso a todas as ferramentas
> - Entrada para um agente SDK com system prompt customizado e ferramentas configuradas
> - O `CLAUDE.md` age como contexto persistente injetado em cada prompt do projeto

| Prós | Contras |
| ---- | ------- |
| Flexível · Configurável · Base de tudo · Modo headless para scripts | Sem estado (stateless) entre sessões · Exige bom design para tarefas complexas |

## Skill — Capacidade especializada e reutilizável

> *"Uma Skill é como um manual de jogadas (playbook) especialista que o Claude consulta automaticamente quando a tarefa é relevante, ou que você invoca com um slash-command."*

> **Correção do guia anterior:** Skills NÃO vivem no `CLAUDE.md`. Eles são diretórios com um arquivo `SKILL.md` em `.claude/skills/nome-da-skill/` (projeto) ou `~/.claude/skills/nome-da-skill/` (usuário).

De acordo com a documentação oficial, uma Skill é um diretório com três tipos de conteúdo carregados progressivamente para evitar o consumo desnecessário de contexto:

1. **Nível 1 — Metadados (sempre carregados)**: Frontmatter YAML: `name` (nome) e `description` (descrição). Apenas ~100 tokens. O Claude sabe que existe e quando usar.
2. **Nível 2 — Instruções (quando ativadas)**: Corpo do `SKILL.md`: fluxos de trabalho, melhores práticas. Carregados via bash quando a Skill é ativada. Menos de 5k tokens.
3. **Nível 3 — Recursos e código (sob demanda)**: Scripts executáveis, templates, documentação. O Claude os lê apenas se necessário. Sem limite prático de tamanho.

> **Diferença para Slash Commands:** Slash commands embutidos (`/clear`, `/compact`) têm lógica fixa. Skills são arquivos anteriormente chamados de "commands" (`.claude/commands/`) que evoluíram para `.claude/skills/` com capacidades extras: controle de frontmatter, scripts anexados, injeção de contexto dinâmico com ``!`comando` ``.

**Quando usar:**
- Conhecimento de domínio reutilizável entre conversas
- Convenções da equipe (estilo de código, padrões de PR)
- Fluxos de trabalho que o Claude deve iniciar automaticamente
- Empacotar scripts junto com instruções
- Disponível no Claude.ai e na API

| Prós | Contras |
| ---- | ------- |
| Auto-carregado por relevância · Reutilizável entre projetos · Pode incluir código | Exige ambiente de execução de código · Skills entre diferentes interfaces não sincronizam · Não herda as skills do agente pai |

## Subagent — Assistente especializado com contexto próprio

> *"Um subagent é um especialista convocado pelo agente principal para uma tarefa específica: ele trabalha de forma independente no seu próprio contexto e só devolve o resultado."*

Subagentes são instâncias do Claude com seu próprio system prompt, ferramentas configuradas, permissões e janela de contexto. O agente principal os invoca via a ferramenta `Agent` (anteriormente `Task`). Definidos como arquivos Markdown com frontmatter YAML em `.claude/agents/` ou `~/.claude/agents/`.

> **Chave de acordo com a documentação oficial:** Subagentes NÃO herdam o contexto da conversa — eles só recebem o que o agente pai inclui explicitamente no prompt de invocação. **Subagentes não podem invocar outros subagentes.** Se você precisa de delegação aninhada, use Skills ou encadeie subagentes a partir da conversa principal.

**Quando usar versus a conversa principal:**
- A tarefa gera saída prolixa que você não quer no contexto principal
- Quer restringir ferramentas específicas (subagent somente leitura / read-only)
- O trabalho é autocontido e pode retornar um resumo
- Operações paralelas independentes

> **Latência:** subagentes começam com contexto vazio e podem levar tempo para reunir o contexto necessário. Para perguntas rápidas sobre algo que já está na conversa, use `/btw` (by the way / a propósito) em vez disso.

| Prós | Contras |
| ---- | ------- |
| Isola o contexto · Ferramentas restritíveis · Memória persistente opcional | Sem contexto herdado · Não pode invocar outros subagentes · Só reporta ao agente pai · Adiciona latência de inicialização |

## Agent (session) — A sessão principal do Claude Code

> *"Uma sessão do Claude Code é um agente completo: ele raciocina, age, observa o resultado e repete até que o objetivo seja concluído."*

Quando você inicia o Claude Code interativamente ou com `claude --agent name`, você inicia um agente com acesso total a ferramentas, loop de raciocínio autônomo e capacidade de delegar para subagentes. Aqui nos referimos explicitamente aos agentes Claude configurados em `.claude/agents/` atuando como a sessão principal, em vez de agentes autônomos externos complexos (como openclaw ou similares).

> **De acordo com a documentação oficial:** Com `claude --agent subagent-name`, a sessão principal adota o system prompt, ferramentas e modelo daquele arquivo de `/agents`. Com o `CLAUDE.md`, o contexto do projeto é injetado. O loop agentic inclui ferramentas nativas (Bash, Read, Write, Edit, WebSearch) e pode delegar para subagentes.  
> *Nota adicional:* Tanto a sessão de runtime (execução) quanto o SDK suportam totalmente os **[Hooks](https://code.claude.com/docs/en/agent-sdk/hooks)**, configurados em `.claude/settings.json`, para interceptar ações-chave (como rastrear condicionalmente ou bloquear comandos Bash destrutivos).

**Quando é a abordagem certa:**
- Objetivo complexo de várias etapas com decisões encadeadas
- Iteração: erro -> análise -> correção -> verificação
- Acesso total ao sistema de arquivos e terminal
- Tarefa exigindo idas e vindas ou refinamento iterativo
- Múltiplas fases compartilhando contexto (planejamento -> implementação -> testes)

| Prós | Contras |
| ---- | ------- |
| Autônomo · Loop de raciocínio completo · Acesso total a ferramentas · Pode delegar | Contexto único (sem paralelismo real) · Custo médio-alto · Exige revisão em tarefas críticas |

## Agent Teams — Sessões coordenadas com comunicação direta

> *"Uma equipe do Claude Code: um líder de equipe coordena; os colegas de equipe trabalham em paralelo, podem falar entre si diretamente, e cada um tem seu próprio contexto."*

> **De acordo com a documentação oficial:** As Agent Teams são **experimentais** e desativadas por padrão. Elas exigem `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` nas configurações ou no ambiente. Precisa do Claude Code v2.1.32 ou superior.

Diferença chave para subagentes: os membros da equipe (teammates) são sessões inteiramente independentes que se comunicam diretamente entre si (não apenas através do líder). Eles compartilham uma lista de tarefas e um sistema de caixa de correio. O usuário também pode falar diretamente com qualquer membro da equipe.

**Melhores casos de uso (de acordo com a doc oficial):**
- Pesquisa e revisão: múltiplas perspectivas em paralelo
- Novos módulos ou recursos onde cada membro da equipe é "dono" da sua área
- Debugging com hipóteses concorrentes em paralelo
- Mudanças abrangendo frontend + backend + testes simultaneamente

> **Importante — quando NÃO usar Agent Teams:** tarefas sequenciais, edições no mesmo arquivo, trabalho altamente dependente. Nesses casos, subagentes ou uma sessão única são mais eficientes. O custo aumenta linearmente com cada membro da equipe.

| Prós | Contras |
| ---- | ------- |
| Auto-comunicação direta · Paralelismo real · Contexto independente compartilhando lista de tarefas | Experimental · Alto custo (escala linearmente) · Sem retomada para membros da equipe em processo · Uma equipe por sessão |

## Tabela Comparativa

| Dimensão | Prompt | Skill | Subagent | Agent | Multi-Agent Team |
| -------- | ------ | ----- | -------- | ----- | ---------------- |
| **Autonomia** | Nenhuma | Nenhuma | Parcial | Alta | Muito alta |
| **Acesso a ferramentas**| Não | Não | Sim | Sim | Sim (múltiplas) |
| **Memória entre turnos**| Não | Não | Não | Limitada| Limitada |
| **Paralelismo** | Não | Não | Sim (como parte) | Não | Sim (nativo) |
| **Iteração / loop** | Não | Não | Limitado | Sim | Sim |
| **Complexidade de config**| Mínima | Baixa | Média | Média-Alta| Alta |
| **Custo por tarefa** | Muito baixo| Baixo | Médio | Médio-Alto| Alto |
| **Reprodutibilidade** | Variável | Alta | Variável | Variável | Variável |
| **Exige supervisão** | Baixa | Baixa | Média | Média-Alta| Alta |
| **Caso de uso ideal** | Consulta única| Tarefa repetível | Subtarefa pipeline| Objetivo multistep| Projeto complexo |

## Árvore de Decisão

*Quando usar Skills versus Subagents?* A documentação oficial diz: use Skills para prompts/fluxos de trabalho reutilizáveis no contexto principal; use Subagents para isolamento de contexto e ferramentas restritas.

1. **É um conhecimento reutilizável que o Claude deve carregar automaticamente entre projetos?**
   - Sim -> **Skill** em `~/.claude/skills/`
2. **É um fluxo de trabalho específico ou convenção para esta equipe compartilhar?**
   - Sim -> **Skill** em `.claude/skills/`
3. **A tarefa gera saída prolixa que você não quer no contexto principal, ou precisa de ferramentas restritas?**
   - Sim -> **Subagent**
4. **Você precisa de iteração, múltiplos passos e acesso total ao sistema?**
   - Sim -> **Agent (session)**
5. **Os trabalhadores precisam se comunicar diretamente, e não apenas se reportar ao chefe?**
   - Sim -> **Agent Teams** (se o paralelismo agregar valor real)

### Regras de Ouro
- **Skills vs Subagents:** Use Skills para fluxos de trabalho no contexto principal, Subagents para isolamento de contexto.
- **Subagents vs Agent Teams:** Use subagentes para trabalhadores focados que retornam o resultado. Use Agent Teams para colaboração complexa.
- **Comece simples:** Para perguntas rápidas, use `/btw` em vez de um subagent.
- **Agent Teams:** 3 a 5 membros da equipe é o ponto ideal.

## Cursos Recomendados (Anthropic Academy)

Para dominar completamente essas ferramentas agentic avançadas, a academia oficial da Anthropic fornece os seguintes recursos especializados mapeados para esses conceitos em **[anthropic.skilljar.com](https://anthropic.skilljar.com/)**:

- **Claude Code 101:** Entenda o loop fundamental de agente exploratório (Explorar -> Planejar -> Codar -> Commitar), fluxos de trabalho de terminal padrão e a orquestração do `CLAUDE.md`.
- **Introduction to Agent Skills:** Treinamento prático sobre como construir, configurar e compartilhar "Skills" eficazes. Ensina como encapsular instruções de código/Markdown para impor estilo de código e convenções arquitetônicas.
- **Introduction to Subagents:** Aprenda precisamente quando e como delegar tarefas para agentes totalmente isolados, prevenindo o inchaço de contexto em suas sessões principais e melhorando as saídas de raciocínio paralelo.
