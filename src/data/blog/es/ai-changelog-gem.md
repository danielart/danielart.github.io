---
author: Daniel Artola Dominguez
pubDatetime: 2026-02-19T00:00:00Z
title: "[ES] Deja de leer newsletters de IA: crea tu propio sistema de changelogs"
featured: false
draft: false
tags:
  - ai
  - productivity
  - gemini
  - automation
  - es
lang: es
description: La IA avanza tan rápido que mantenerse al día es imposible. Descubre cómo una Gema personalizada con Google Sheets automatizado te da solo los cambios que importan.
ogImage: ../../../assets/images/blog/ai-changelog-gem.png
---

La IA avanza tan rápido en tantas cosas que mantenerme al día con newsletters y resúmenes me llevaría horas.

Solo en lo que va de 2026 hemos tenido:

- **1 de enero:** OpenAI lanza o2-mini (Optimización de razonamiento en tiempo real)
- **7 de enero:** Mistral AI lanza Mistral Medium 2
- **14 de enero:** Google lanza Gemini 2.5 Ultra
- **21 de enero:** Meta lanza Llama 3.5 Turbo (Versión refinada post-lanzamiento inicial)
- **27 de enero:** Kimi.ai lanza Kimi J2.5
- **5 de febrero:** Anthropic lanza Claude Opus 4.6
- **5 de febrero:** OpenAI lanza GPT-5.3-Codex
- **5 de febrero:** Kuaishou lanza Kling 3.0
- **12 de febrero:** Z.ai lanza GLM-5
- **12 de febrero:** ByteDance lanza Seedance 2.0
- **12 de febrero:** MiniMax lanza MiniMax 2.5
- **16 de febrero:** Alibaba lanza Qwen3.5-397B-A17B
- **17 de febrero:** DeepSeek lanza DeepSeek-V4
- **19 de febrero:** Google lanza Gemini 3.1 Pro

**Próximamente:** Llama 4?, Mistral Large 3?, GPT-5.5? ¿nueva tool de Google?

![Sobrecarga de información de newsletters y notificaciones de IA filtradas por una gema](../../../assets/images/blog/ai-changelog-gem.png)
_Demasiada información, poca señal. La solución: ir directo a los changelogs._

## El problema

Las newsletters te dan la opinión de otro, ejemplos, información irrelevante.

## La solución

Ir directo a los **ChangeLogs** y las **Release Notes**.

He creado una **Gema** (Custom AI) conectada a un **Google Spreadsheet** automatizado que me da solo los cambios, y luego ya si me interesa indago con la misma gema.

## Por qué este sistema es 10x más rápido

- 🎯 **Cero sesgo:** leo el dato, no el hype de turno y si no me interesa paso a la siguiente línea.
- ⚡ **Velocidad:** me informa del hecho, y de las herramientas que quiero. Si sale una nueva que me interesa, la añado al excel.
- 🚫 **Sin publicidad** ni contenido patrocinado ni historias.

## Recursos

Te dejo los enlaces para que puedas montártelo tú también:

- 📊 [Google Spreadsheet de AI Changelogs](https://docs.google.com/spreadsheets/d/1Yc3RP9DanCZP4KgSNT8oMuyTEouVullOHbMxz-oB2rc/edit?gid=1843997542#gid=1843997542)
- 💎 [Gema de Gemini — AI Changelogs Tracker](https://gemini.google.com/gem/1eylYmiv8WA0NC9svVdVLDbctR0casVj0?usp=sharing)

## Instrucciones de la Gema

Estas son las instrucciones completas que utiliza la gema. Puedes copiarlas y adaptarlas a tu caso de uso:

<details>
<summary>📋 Ver instrucciones completas de la Gema</summary>

```text
Purpose and Goals:
Act as a technical analyst specializing in AI software development.
Monitor AI tool changelogs from a specific Google Sheet named 'AI changelogs'
within the available knowledge base.
Provide structured updates and technical summaries based on the 'keep track'
monitoring column.

Configurations:
Output language: Spanish
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
    b) Summarize only the relevant updates in Spanish.
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

## Cómo personalizar la Gema

Si quieres adaptar la gema a tus necesidades, solo tienes que modificar la sección **Configurations** de las instrucciones:

- 🌐 **Idioma:** Cambia `Output language: Spanish` por el idioma que prefieras (por ejemplo, `English`, `French`, `Portuguese`).
- 🕐 **Hora del mensaje diario:** Cambia `Hour for daily message: 20:00` por la hora que más te convenga.
- 🕗 **Hora del mensaje semanal:** Cambia `Hour for weekly message: 08:00` por la hora que prefieras.
- 📅 **Día del resumen semanal:** Cambia `Day for weekly message: Monday` por el día que quieras (ej. `Friday`).

## Más allá del desarrollo de software

Esta gema está muy enfocada en el mundo del **desarrollo de software y tecnología**, pero el concepto se puede adaptar a cualquier propósito. Solo necesitas:

1. Crear un Google Spreadsheet con las herramientas/fuentes que te interesen (ej. herramientas de marketing, diseño, finanzas…).
2. Añadir las URLs de los changelogs o release notes correspondientes.
3. Modificar las instrucciones de la gema para que se adapten a tu dominio.

El patrón es el mismo: **datos limpios → gema personalizada → información sin ruido**.
