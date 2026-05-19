---
title: "[PT] Como pagar o preço do Haiku pelo cérebro do Opus: guia prático para a Advisor Tool"
author: Daniel Artola
pubDatetime: 2026-04-25T16:46:20Z
slug: claude-advisor-tool-practical-guide-pt
featured: true
draft: false
tags:
  - ai
  - claude
  - api
  - pt
lang: pt
description: "Os preços da IA continuarão subindo. Ajuste seu fluxo de trabalho enquanto ainda há tempo. Um guia completo sobre como configurar a Advisor Tool da Anthropic via API e ativá-la no Claude Code."
---

Há uma semana mencionei brevemente a **Advisor Tool** (Ferramenta Consultora) da Anthropic. Hoje estou compartilhando o guia completo: como configurá-la via API, como ativá-la no **Claude Code** com um único comando, quais pares de modelos são válidos e os detalhes de faturamento que você deve verificar **antes** de deixá-la rodando em produção.

O segredo não é usar o modelo mais caro para tudo, mas o mais inteligente para o que importa.

## Índice

## A ideia em uma frase

Você coloca um modelo rápido e barato (Haiku ou Sonnet) para fazer 90% do trabalho. Quando ele fica preso ou precisa pensar de verdade, **ele** consulta o Opus. Você não orquestra nada — a decisão é tomada pelo executor, e tudo acontece dentro de **uma única chamada de `/v1/messages`**.

🏃 **Executor (Haiku ou Sonnet)** — o jogador. Gera código, lê arquivos, roda comandos. Rápido e barato.

🧠 **Advisor (Opus)** — o técnico. Só entra em campo quando um plano, correção ou sinal de parada é necessário. Nunca chama ferramentas, nunca produz saída para o usuário. Apenas aconselha o executor.

É a inversão do típico padrão de subagentes (um orquestrador grande delegando para trabalhadores pequenos). Aqui o pequeno dirige e só escala (sobe o nível) quando necessário.

## Os números que justificam o beta

🔹 **Haiku 4.5 + Opus advisor no BrowseComp:** salto de 19.7% para 41.2%. Mais que o dobro.

🔹 **Sonnet 4.6 + Opus advisor no SWE-bench Multilingual:** ~11% menor custo por tarefa do que o Sonnet sozinho, com uma pontuação melhor.

🔹 **Sonnet com advisor no esforço médio (medium effort)** atinge a inteligência do Sonnet no esforço padrão, gastando menos.

A economia não vem do advisor — vem do executor terminando a tarefa em menos turnos porque já tem um plano decente.

---

## Modelos válidos (isso importa)

O advisor deve ser **pelo menos tão capaz** quanto o executor. Estas são as únicas combinações que a API aceita:

- Executor `claude-haiku-4-5-20251001` → Advisor `claude-opus-4-7`
- Executor `claude-sonnet-4-6` → Advisor `claude-opus-4-7`
- Executor `claude-opus-4-6` → Advisor `claude-opus-4-7`
- Executor `claude-opus-4-7` → Advisor `claude-opus-4-7`

Qualquer outra combinação retorna `400 invalid_request_error`. Não, você não pode definir o Haiku como advisor do Sonnet "para ficar mais barato" — o beta não permite isso, e seria inútil de qualquer forma.

---

## Opção A: Claude Code (o mais fácil)

Se você já usa o Claude Code, isso é literalmente um comando.

**Requisito:** Claude Code v2.1.101 ou superior. Verifique com `claude --version` e atualize se necessário:

```bash
npm install -g @anthropic-ai/claude-code
```

**Ativação:**

1. Abra o Claude Code no seu projeto: `claude`
2. Dentro da sessão, digite: `/advisor`
3. Ele mostra uma pequena lista de modelos. Escolha o Opus.

Você verá algo como _"Advisor configured. Opus will be consulted for complex decisions and task completion checks."_ (Advisor configurado. O Opus será consultado para decisões complexas e checagens de conclusão de tarefas). E é isso. Sem parâmetros de amostragem, sem system prompts customizados, nada.

**O que você precisa entender é que não é você quem chama o advisor.** Não existe o comando "consultar o advisor". O Sonnet decide por conta própria quando precisa de uma segunda opinião, insere silenciosamente a chamada no meio de sua resposta, e o conselho é incorporado ao contexto como se sempre estivesse lá. Na primeira vez que você ver isso acontecer, você vai procurar por uma caixa de diálogo de confirmação que não existe.

⚠️ **Limitação importante:** só funciona diretamente contra a API da Anthropic. Se você usa o Claude Code através do **Bedrock, Vertex, LiteLLM, OpenRouter** ou qualquer outro proxy, o advisor não será acionado. É uma funcionalidade do lado do servidor que vive no endpoint nativo.

---

## Opção B: API Direta (controle total)

Quando você constrói o seu próprio agente, você o declara apenas como mais uma ferramenta na matriz (array) `tools`:

```python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-6",                  # executor
    max_tokens=4096,
    betas=["advisor-tool-2026-03-01"],          # cabeçalho beta
    tools=[
        {
            "type": "advisor_20260301",
            "name": "advisor",
            "model": "claude-opus-4-7",         # advisor
            "max_uses": 5,                       # opcional, limite por requisição
        }
    ],
    messages=[
        {"role": "user", "content": "Construa um pool de workers concorrentes em Go com desligamento amigável (graceful shutdown)."}
    ],
)
```

Três coisas mínimas:

1. O cabeçalho beta `advisor-tool-2026-03-01`.
2. O executor no `model` (no nível mais alto).
3. A ferramenta `advisor_20260301` com o seu próprio `model` (o advisor).

### Multi-turno: cuidado com isso

Nas chamadas subsequentes você deve **retornar o histórico completo, incluindo os blocos `advisor_tool_result`**. Se você omiti-los enquanto o advisor ainda estiver nas `tools`, a API retorna 400. E se você remover o advisor das `tools`, você também tem que limpar esses blocos do histórico. É a combinação dos dois ao mesmo tempo ou nenhum.

```python
messages.append({"role": "assistant", "content": response.content})
messages.append({"role": "user", "content": "Agora adicione um limite de 10 in-flight."})
```

---

## 💡 Configuração `keep: "all"` (o detalhe de cache que passa despercebido)

Citando a documentação literalmente: _clear_thinking com um valor keep diferente de "all" desloca o transcript (histórico) citado do advisor a cada turno, causando falhas (misses) no cache do lado do advisor_.

Por que isso importa? O advisor gera blocos de raciocínio estratégico. Por padrão, quando você tem o pensamento estendido (extended thinking) ativado, a API aplica `clear_thinking` com `keep: {type: "thinking_turns", value: 1}` — ou seja, ela apara (corta) os blocos mais antigos a cada turno. Isso desloca o histórico que o advisor vê e quebra o prompt caching do lado do advisor.

Resultado: você paga pelas escritas de cache a cada chamada e nunca há uma leitura. Falha de cache (miss) perpétua.

**Solução:** defina `keep: "all"` na sua configuração de edição de contexto. Você mantém o histórico intacto, as chamadas recorrentes para o advisor são lidas do cache, e a economia pode chegar a **90%** nos tokens de entrada (input tokens) do advisor.

E para habilitar o cache para o próprio advisor:

```python
tools=[
    {
        "type": "advisor_20260301",
        "name": "advisor",
        "model": "claude-opus-4-7",
        "caching": {"type": "ephemeral", "ttl": "5m"},
    }
]
```

⚠️ **Regra de ouro do cache do advisor:** escritas de cache **custam mais do que economizam se você chamar o advisor 2 vezes ou menos por conversa**. Só começa a ser rentável a partir da 3ª chamada. Para tarefas curtas, deixe-o desativado.

---

## Faturamento: o que o `usage` esconde

O advisor é faturado **à sua própria taxa de Opus**, separado do executor. E os campos de nível superior de `usage` só refletem o executor. Se você rastrear os custos olhando apenas para `input_tokens` e `output_tokens`, as contas não vão fechar.

A divisão real está em `usage.iterations[]`:

```json
{
  "usage": {
    "input_tokens": 412,
    "output_tokens": 531,
    "iterations": [
      { "type": "message", "input_tokens": 412, "output_tokens": 89 },
      {
        "type": "advisor_message",
        "model": "claude-opus-4-7",
        "input_tokens": 823,
        "output_tokens": 1612
      },
      {
        "type": "message",
        "input_tokens": 1348,
        "cache_read_input_tokens": 412,
        "output_tokens": 442
      }
    ]
  }
}
```

- Iterações `type: "message"` → taxa do executor.
- Iterações `type: "advisor_message"` → taxa do advisor (Opus).
- O advisor tipicamente produz **400-700 tokens de texto, ou 1.400-1.800 incluindo o pensamento (thinking)** por chamada.
- O `max_tokens` da requisição **não limita** os tokens do advisor.

Se você quer rastrear custos a sério, some as iterações você mesmo.

---

## System prompts que realmente fazem a diferença

Se você constrói o seu próprio agente via API e quer replicar a qualidade que a Anthropic mede em seus benchmarks, coloque estes blocos **logo no início do system prompt do executor**, antes de qualquer outra menção ao advisor:

**Bloco de tempo** (quando chamar):

> Chame o advisor ANTES de um trabalho substancial — antes de escrever, antes de se comprometer com uma interpretação, antes de construir sobre uma suposição. Se a tarefa exige orientação primeiro (encontrar arquivos, ler uma fonte), faça isso, e então chame o advisor. Orientação não é trabalho substancial. Escrever, editar e declarar uma resposta são.
>
> Também chame o advisor quando você achar que a tarefa está completa (torne o entregável durável primeiro: escreva o arquivo, salve a saída), quando você estiver preso e quando considerar mudar a abordagem.

**Como tratar o bloco de conselhos** (logo depois):

> Dê peso sério ao conselho. Se você seguir um passo e ele falhar empiricamente, ou você tiver evidências de fontes primárias que contradigam uma afirmação específica, adapte-se. O seu próprio teste passando NÃO é evidência de que o conselho está errado — é evidência de que o seu teste não checa o que o conselho checa.

**Bloco de concisão** (corta ~35-45% dos tokens do advisor sem tocar na frequência):

> O advisor deve responder em menos de 100 palavras e usar passos enumerados, não explicações.

No Claude Code, esses prompts já são aplicados nativamente. Via API, você tem que adicioná-á-los você mesmo.

---

## Quando NÃO usar

Isso não é mágica e não compensa sempre:

- **Q&A (Perguntas e Respostas) de turno único.** Não há nada para planejar, o executor não o invocará e você só adiciona latência e custos à toa.
- **Tarefas puramente mecânicas** (formatação, buscas, regex). Sem pontos de decisão, sem advisor.
- **Caminhos críticos de latência.** O fluxo (stream) do executor é **pausado** enquanto a sub-inferência do advisor roda. Ele não faz stream.
- **Cargas de trabalho onde cada turno precisa do Opus.** Se você precisa dele sempre, já está pagando duas vezes por nada — use o Opus diretamente.
- **Através do Bedrock ou Vertex hoje.** O suporte está a caminho, mas ainda não é nativo em todo lugar.

---

## As outras chaves mestras do orçamento

O advisor não opera sozinho. Combine-o com:

✨ **Prompt Caching** — até 90% de economia em tokens de entrada repetidos. Crítico para conversas longas.

📦 **Batch API** — 50% de economia em qualquer tarefa que não precise de uma resposta imediata.

⚙️ **Configurações de esforço (Effort)** — Sonnet no esforço médio + Opus advisor ≈ Sonnet no esforço padrão, mais barato.

Em um mercado onde o raciocínio está se tornando um luxo caro, **orquestração é a sua melhor vantagem competitiva**.

---

## TL;DR (Resumão)

- No **Claude Code**: `/advisor` → escolha Opus → pronto. Apenas API direta da Anthropic.
- Via **API**: cabeçalho `advisor-tool-2026-03-01` + ferramenta `advisor_20260301` com o seu `model`.
- **Pares válidos:** Haiku/Sonnet/Opus 4.6/Opus 4.7 como executor → sempre Opus 4.7 como advisor.
- **`keep: "all"`** se você usar o pensamento estendido (extended thinking), ou você perde o cache do advisor.
- **`caching: ephemeral`** apenas se você espera mais de 3 chamadas por conversa.
- **Faturamento:** olhe as `usage.iterations[]`, não os de nível superior. Taxa do Opus para cada `advisor_message`.
- **Não use** para tarefas mecânicas, de turno único, ou através de proxies como Bedrock/Vertex hoje.

🚀 Se você usa IA para programar e ainda está jogando prompts sem medir os tokens, no próximo post eu entrarei em detalhes sobre prompt caching, batch API e a economia real de um agente em produção. Siga-me para não perder.
