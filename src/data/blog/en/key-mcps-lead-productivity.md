---
title: "[EN] Reducing time on Lead tasks with key MCPs"
author: Daniel Artola
pubDatetime: 2026-03-24T21:55:00Z
slug: key-mcps-lead-productivity
featured: false
draft: false
tags:
  - mcp
  - productivity
  - ai
  - lead
  - en
lang: en
description: How I use various Model Context Protocols (MCP) like Datadog, Amplitude, Excalidraw, and Miro to save time on my tasks as a Lead.
---

## Introduction

As a lead, there are several tasks where I've managed to drastically reduce the time invested. 

Analyzing monitors, optimizing alerts, investigating incidents, creating reports/notebooks, creating diagrams, finding and solving inconsistencies... many of these thanks to the use of a few key MCPs. Here I'll tell you how.

Yes, beyond the controversy of whether to use MCPs or not. They are still a tool, there shouldn't be a problem if you use them for specific cases and with knowledge, just like everything with AI. Well, just like you don't use a chainsaw to file a splinter and on top of that without reading the instructions.

There are several MCPs I use often: Atlassian, Context7, Playwright... but here's a list of others that, although I don't use them as often, help me quite a bit in specific situations.

## My MCPs for specific cases

### Datadog MCP

With this one, I've been able to analyze errors in production, use it to analyze and improve alerts and monitors in our microservices, and even create error reports comparing data with Amplitude, which leads me to the next case.

![Datadog Analysis Example](../../../assets/images/blog/datadog-analysis.jpg)

### Amplitude MCP

With Amplitude I'm like a fish out of water, I understand it but I haven't mastered it. Thanks to the MCP, I've been able to create notebooks, analyze data, draw conclusions from sharp drops or spikes, and combined with Datadog's it makes it easy to have a broader view.

![Amplitude Dashboard](../../../assets/images/blog/amplitude-dashboard.jpg)

### Excalidraw MCP

Not everything is mermaid, sometimes you want to be able to add and remove things quickly and easily. It helps me generate architecture maps or specific features, and then combine them, use them in documentation, or simply to explain an idea. Besides, it allows you to generate the file or a link to view it. Careful though, don't expose your architecture in a public link.

![Excalidraw Map Example](../../../assets/images/blog/excalidraw-map.jpg)

### Miro MCP

Although you can create diagrams and even code with this one, where I've gotten the most out of it has been to compare information from huge diagrams in Miro (the kind that look like Dungeons and Dragons boards) with Confluence documentation or code and find discrepancies, thus anticipating blockers, problems, and ambiguity in decisions.

## Conclusion and Links

All the ones mentioned are official from their respective companies, which gives an extra layer of security. Of course, the tokens are on your dime, so optimize their use.

Official Links to the mentioned MCPs:

- [Datadog MCP](https://docs.datadoghq.com/en/bits_ai/mcp_server/)
- [Amplitude MCP](https://amplitude.com/docs/amplitude-ai/amplitude-mcp)
- [Excalidraw MCP](https://github.com/excalidraw/excalidraw-mcp)
- [Miro MCP](https://developers.miro.com/docs/miro-mcp)
