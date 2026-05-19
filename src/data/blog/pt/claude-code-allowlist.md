---
title: "[PT] Deixe o Claude Code escrever sua própria allowlist"
author: Daniel Artola
pubDatetime: 2026-05-17T00:00:00Z
slug: claude-code-allowlist-pt
featured: false
draft: false
tags:
  - ai
  - claude
  - pt
lang: pt
description: O problema de 100 aprovações diárias e como a skill /fewer-permission-prompts do Claude Code resolve isso de forma transparente.
---

## Índice

## O problema de 100 aprovações diárias

Se você usa o Claude Code no modo manual, conhece a sensação: cada `npm run typecheck`, cada `git log`, cada `kubectl get pods` é um prompt de permissão. Você aprova o mesmo comando inofensivo vinte vezes por dia. Quando a Anthropic mede isso em sua própria base de usuários, os dados são surpreendentes: **93% dos prompts são aprovados**.

Isso não é segurança. É fadiga de aprovação. E a fadiga de aprovação é exatamente o que faz você clicar "sim" com preguiça no dia em que um `rm -rf` mal contextualizado aparece.

Historicamente, existiam três formas de sair desse problema:

1. **Manter o `settings.json` à mão.** Funciona, mas exige disciplina e conhecimento da sintaxe dos padrões.
2. **`--dangerously-skip-permissions`.** Rápido e perigoso. O nome não é decorativo.
3. **Modo Auto** (com classificadores). Uma boa opção, mas nem todos cumprem os requisitos ou querem delegar a decisão a um modelo.

Em abril de 2026, a Anthropic lançou uma quarta via: uma skill oficial que **lê o seu próprio histórico e constrói a allowlist (lista de permissões) para você**. Chama-se `/fewer-permission-prompts` e resolve o atrito sem abrir mão do controle manual.

---

## O que exatamente ela faz

A skill vem integrada no Claude Code (v2.1+). Você não a instala, não a configura. Você a invoca:

```
/fewer-permission-prompts
```

Por baixo dos panos, ela segue um pipeline (processo) bastante conservador:

1. **Lê os históricos (transcripts)** em `~/.claude/projects/<dir>/*.jsonl`, limitando-se às 50 sessões mais recentes.
2. **Extrai todas as chamadas** de Bash e MCP, agrupando por comando + primeiro subcomando (`git log`, `gh pr view`, `mcp__slack__read_thread`...).
3. **Filtra apenas para leitura (read-only).** Descarta `rm`, `git push`, `npm install`, builds com efeitos colaterais, requisições POST, comandos que matam processos.
4. **Pula o que já é autoaprovado** sem precisar de uma entrada na allowlist: `cat`, `ls`, `git status`, `gh pr view`, `docker logs`, `lsof`...
5. **Bloqueia curingas perigosos.** `Bash(python3:*)`, `Bash(bun run *)`, `sudo`, interpretadores, shells, `npx` — qualquer coisa que abra execução de código arbitrário, mesmo que você use apenas para uma ferramenta específica.
6. **Ordena por frequência**, descarta o que aparece menos de 3 vezes e mostra o top 20.

O resultado é uma tabela com candidatos, uma explicação do que adicionou e do que omitiu, e uma escrita limpa no `.claude/settings.json` do projeto (não o global, nem o `settings.local.json`).

---

## Um exemplo real

A maneira mais clara de entender é ver uma execução. Aqui está o resultado em um projeto real com um gateway MCP no Kubernetes, após filtrar os nomes internos:

| #   | Padrão                                                     | Vezes | Notas                        |
| --- | ---------------------------------------------------------- | ----- | ---------------------------- |
| 1   | `Bash(kubectl port-forward -n <ns> svc/<svc> 8000:8000 *)` | 4     | túnel local para o gateway   |
| 2   | `Bash(npx tsc --noEmit *)`                                 | 4     | typecheck do TypeScript      |
| 3   | `Bash(curl -s http://localhost:8000/*)`                    | 3     | health checks locais via GET |
| 4   | `Bash(lsof -ti:*)`                                         | 2     | ocupação de portas           |
| 5   | `Bash(dotnet --version *)`                                 | 2     | versão do SDK                |

Desses cinco candidatos, **apenas dois acabam na allowlist**. Vale a pena entender por que os outros três ficam de fora, pois cada motivo ilustra uma regra da skill:

- **`npx tsc --noEmit` (4 vezes).** Aparece alto na frequência, mas `npx` é um executor de código arbitrário. Mesmo que você use apenas para `tsc` hoje, mantenha a flag `--noEmit` e nunca mude de máquina, colocá-lo na allowlist significaria dar sinal verde para qualquer pacote que o `npx` decidisse baixar. A skill recusa isso explicitamente.
- **`lsof -ti:*` (2 vezes).** Fica de fora por dois motivos: `lsof` já está na lista de autoaprovados, e não atinge o limite de 3 ocorrências.
- **`dotnet --version` (2 vezes).** Apenas leitura, sem risco, mas abaixo do limite. A skill prefere falsos negativos a inflar a allowlist com ruído.

> **💡 Dica:** Você pode perguntar ao Claude diretamente (ex.: _"quais permissões você pulou nesta última execução e por quê?"_) para entender melhor o processo de decisão dele se notar que um comando frequente não foi adicionado à allowlist.

Restam duas linhas que entram no `.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(kubectl port-forward -n <ns> svc/<svc> 8000:8000 *)",
      "Bash(curl -s http://localhost:8000/*)"
    ]
  }
}
```

O resto do arquivo é preservado intacto. Conservador, transparente, sem surpresas.

---

## Padrões de allowlist que você verá

A sintaxe é simples, mas tem uma armadilha que vale a pena memorizar:

| Padrão              | Quando é usado                                         |
| ------------------- | ------------------------------------------------------ |
| `Bash(foo)`         | Correspondência exata de uma invocação específica      |
| `Bash(foo *)`       | Prefixo + espaço: pega `foo`, `foo bar`, `foo --opt`   |
| `Bash(foo*)`        | Sem espaço: cuidado, `Bash(ls*)` também captura `lsof` |
| `mcp__server__tool` | Nome completo da ferramenta MCP, sem curingas          |

A diferença entre `foo *` e `foo*` já derrubou allowlists inteiras. O espaço importa.

---

## Onde ele escreve e por que importa em uma equipe

A skill escreve no `.claude/settings.json`, que é o arquivo do projeto **versionado e compartilhado**. Não no `.claude/settings.local.json` (que é seu e não é enviado pro git). Não no `~/.claude/settings.json` (que é global para o seu usuário).

Isso tem consequências práticas:

- **Sempre revise o diff antes do commit.** O que é "uma porta local" para você pode ser um endpoint interno que você não quer documentar publicamente no repositório.
- **Se uma entrada for pessoal**, mova-a manualmente para `.claude/settings.local.json` após a execução.
- **Se você estiver em um repositório público**, tenha um cuidado especial com nomes de serviços internos, namespaces do Kubernetes ou rotas que vazem a arquitetura.

Não é uma falha na skill, é uma decisão de design: os benefícios de uma allowlist são maiores quando toda a equipe os compartilha. Mas o commit passa por você.

---

## O irmão da mesma origem: `/insights`

Mesma fonte de dados, propósito complementar. `/insights` lê os mesmos arquivos `.jsonl`, mas em vez de construir uma allowlist, gera um relatório HTML com:

- Pontos de atrito recorrentes nas suas sessões
- Regras sugeridas para o seu `CLAUDE.md` com base nas instruções que você mais repete
- Padrões de comportamento do modelo que merecem ser documentados

Onde `/fewer-permission-prompts` ataca o atrito da aprovação, `/insights` ataca o atrito do entendimento: as vezes que você teve que explicar ao Claude algo que ele já deveria saber.

A combinação quinzenal de ambos é um hábito barato e muito rentável.

---

## Conclusão

`/fewer-permission-prompts` não é uma ferramenta espetacular. Não economiza uma hora do seu dia nem desbloqueia nada de novo. O que ela faz é eliminar dez segundos de atrito cem vezes por dia, sem que você tenha que pensar na sintaxe dos padrões ou manter allowlists manualmente.

Mais importante ainda: ela faz isso de forma transparente e conservadora. Mostra o que adiciona, o que omite e o porquê. Bloqueia curingas perigosos por padrão. Exige um limite mínimo de frequência para evitar ruído. E deixa a decisão final com você.

É o tipo de utilidade que só a Anthropic poderia fazer direito, porque eles têm acesso à semântica completa dos históricos e conhecem sua própria lista de autoaprovados. Qualquer tentativa de terceiros seria pior.

Se você usa o Claude Code no modo manual e ainda não rodou isso, faça hoje. Cinco segundos de invocação em troca de semanas de aprovações que você deixa de fazer.

---

**Referências**

- Post original (Wmedia): https://wmedia.es/en/tips/claude-code-fewer-permission-prompts
- Documentação oficial: https://code.claude.com/docs/en/permissions
- Modo Auto (contexto sobre 93% de aprovação): https://www.anthropic.com/engineering/claude-code-auto-mode
