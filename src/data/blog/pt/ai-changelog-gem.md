---
author: Daniel Artola Dominguez
pubDatetime: 2026-02-19T00:00:00Z
title: "[PT] Pare de ler newsletters de IA: Crie seu próprio sistema de Changelog"
featured: false
draft: false
tags:
  - ai
  - productivity
  - gemini
  - automation
  - pt
lang: pt
description: A IA avança tão rápido que é impossível acompanhar tudo. Descubra como um Gem do Gemini com uma planilha do Google automatizada pode te entregar apenas as mudanças que realmente importam.
ogImage: ../../../assets/images/blog/ai-changelog-gem.png
---

A IA está avançando tão rápido em tantas frentes que acompanhar apenas lendo newsletters e resumos me tomaria horas.

Só em 2026, até agora, tivemos:

- **1 de janeiro:** OpenAI lança o2-mini (Otimização de raciocínio em tempo real)
- **7 de janeiro:** Mistral AI lança Mistral Medium 2
- **14 de janeiro:** Google lança Gemini 2.5 Ultra
- **21 de janeiro:** Meta lança Llama 3.5 Turbo (Versão refinada pós-lançamento)
- **27 de janeiro:** Kimi.ai lança Kimi J2.5
- **5 de fevereiro:** Anthropic lança Claude Opus 4.6
- **5 de fevereiro:** OpenAI lança GPT-5.3-Codex
- **5 de fevereiro:** Kuaishou lança Kling 3.0
- **12 de fevereiro:** Z.ai lança GLM-5
- **12 de fevereiro:** ByteDance lança Seedance 2.0
- **12 de fevereiro:** MiniMax lança MiniMax 2.5
- **16 de fevereiro:** Alibaba lança Qwen3.5-397B-A17B
- **17 de fevereiro:** DeepSeek lança DeepSeek-V4
- **19 de fevereiro:** Google lança Gemini 3.1 Pro

**Em breve:** Llama 4? Mistral Large 3? GPT-5.5? Uma nova ferramenta do Google?

![Sobrecarga de informação de newsletters e notificações filtradas por um gem](../../../assets/images/blog/ai-changelog-gem.png)
_Muita informação, pouco sinal. A solução: vá direto aos changelogs._

## O Problema

As newsletters te dão a opinião de outra pessoa, exemplos e informações que muitas vezes são irrelevantes.

## A Solução

Vá direto aos **ChangeLogs** (Históricos de Atualizações) e às **Release Notes** (Notas de Lançamento).

Eu criei um **Gem** (IA Customizada) conectado a uma **Planilha do Google** automatizada que me dá apenas as mudanças que importam, e então, se algo me chamar a atenção, eu me aprofundo com o mesmo Gem.

## Por que esse sistema é 10x mais rápido

- 🎯 **Zero viés:** Eu leio os dados, não o hype do dia. Se não me interessa, passo para a próxima linha.
- ⚡ **Velocidade:** Ele me conta os fatos, focados nas ferramentas que me importam. Se uma nova me interessar, eu a adiciono na planilha.
- 🚫 **Sem anúncios**, sem conteúdo patrocinado, sem enrolação.

## Recursos

Aqui estão os links para que você mesmo possa configurar:

- 📊 [Planilha do Google — Históricos de IA](https://docs.google.com/spreadsheets/d/1Yc3RP9DanCZP4KgSNT8oMuyTEouVullOHbMxz-oB2rc/edit?gid=1843997542#gid=1843997542)
- 💎 [Gem do Gemini — Rastreador de Históricos de IA](https://gemini.google.com/gem/1eylYmiv8WA0NC9svVdVLDbctR0casVj0?usp=sharing)

## Instruções do Gem

Estas são as instruções completas usadas pelo Gem. Você pode copiá-las e adaptá-las ao seu caso de uso:

<details>
<summary>📋 Ver instruções completas do Gem</summary>

```text
Purpose and Goals:
Act as a technical analyst specializing in AI software development.
Monitor AI tool changelogs from a specific Google Sheet named 'AI changelogs'
within the available knowledge base.
Provide structured updates and technical summaries based on the 'keep track'
monitoring column.

Configurations:
Output language: Portuguese
Hour for daily message: 20:00
Hour for weekly message: 08:00
Day for weekly message: Monday

Behaviors and Rules:
1) Data Analysis:
    a) Access the 'AI changelogs' Google Sheet.
    b) Identify exclusively the rows where the 'keep track' column is
       flagged/marked.
    c) For the selected tools, visit the provided URLs to detect recent
       technical changes.
2) Daily Routine:
    a) Every day at the hour specified on top, review changes from the
       last 24 hours.
    b) Summarize only the relevant updates in Portuguese.
    c) If there are no changes, do not generate a response.
3) Weekly Routine:
    a) Every week, at day and hour specified on top, perform a synthesis
       of all changes that occurred over the last 7 days.
    b) Maintain a technical and concise focus.
4) Output Format:
    a) Group information by the tool's name.
    b) Use bullet points to detail specific changes.
    c) Include the source URL for each mentioned tool.
    d) Output language defined on top.
5) Tone and Style:
    a) Professional, technical, and analytical.
    b) Avoid unnecessarily complex language outside of the technical AI field.
    c) Be precise and direct when communicating news, avoiding irrelevant
       information or examples.
```

</details>

## Como Customizar o Gem

Se você quiser adaptar o Gem às suas necessidades, basta modificar a seção **Configurations** nas instruções:

- 🌐 **Idioma:** Mude `Output language: Portuguese` para o seu idioma preferido.
- 🕐 **Hora da mensagem diária:** Mude `Hour for daily message: 20:00` para a hora que for melhor para você.
- 🕗 **Hora da mensagem semanal:** Mude `Hour for weekly message: 08:00` para a sua hora preferida.
- 📅 **Dia do resumo semanal:** Mude `Day for weekly message: Monday` para o dia que você preferir (ex: `Friday`).

## Além do Desenvolvimento de Software

Este Gem é fortemente focado no **desenvolvimento de software e no mundo da tecnologia**, mas o conceito pode ser adaptado para qualquer propósito. Tudo o que você precisa é:

1. Uma Planilha do Google com as ferramentas/fontes que você se importa (ex: ferramentas de marketing, ferramentas de design, finanças...).
2. As URLs do changelog ou das notas de lançamento de cada fonte.
3. Instruções modificadas do Gem, adaptadas para o seu domínio.

O padrão é sempre o mesmo: **dados limpos → Gem customizado → informação sem ruídos**.
