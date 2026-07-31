---
layout: ../layouts/AboutLayout.astro
title: "About"
---

I am an **Engineering Lead** based in Barcelona with roughly two decades of experience shipping software. I lead an engineering team at a high-traffic, multi-market European e-commerce marketplace. Outside of engineering management, I also work as a freelance AI and automation developer.

Beyond the code, I am a React enthusiast, a bass player in a rock band, and a parent. I am passionate about combining robust software engineering discipline with the emerging capabilities of AI.

## My Approach to Agentic Engineering

Most AI developer tools stop at the prompt. I build the operational layer underneath: equipping agents with domain rules, live production data, and the review discipline required to handle real production systems.

### Core Principles

- **Encode standards, not prompts.** A prompt helps once. I write team conventions down as reusable agent skills—database migration rules, event-consumer error handling, acceptance test structure, decision records, and review checklists—so every agent inherits how your specific team builds.
- **Scope agents to domains, not tasks.** The most effective agents own a business domain end to end. They understand its rules, cross-team dependencies, and common failure points. They review changes, draft tickets, and reject work that violates written rules.
- **Wire agents to the real stack.** Agents connected directly to production analytics, observability platforms, and issue trackers reason about actual runtime behavior rather than guessing from screenshots.
- **Trust comes from verification, not vibes.** Claims are checked against source code before shipping. Assumptions are stated explicitly, diffs are kept small and human-reviewable, and adversarial review runs before merge.

## What I've Built

- **Domain-scoped review agents:** Deployed review agents across critical e-commerce domains—including shopping cart and checkout, customer data and GDPR compliance, and authentication. Each agent audits changes against written business rules, plans work, drafts tickets, and flags cross-team blockers before they reach production.
- **Organization-wide skill libraries:** Designed skill libraries encoding an engineering org's technical standards, covering architecture (hexagonal, DDD, event sourcing), data migrations, event-streaming patterns, testing strategy, observability, deployment, and code review.
- **Real-time reporting agents:** Built agents that query product analytics and monitoring platforms directly, assembling breakdown reports by market, platform, and device without manual dashboard wrangling.
- **Agent-assisted platform migrations:** Guided live system migrations in multi-market environments, including relational database migrations with change-data-capture, identity provider replacements, and GDPR data-lifecycle automation.

## Technical Range

- **Languages:** TypeScript, JavaScript, Kotlin, Java
- **Frontend & UI:** React, Redux, React Native, Brisa
- **Backend & Data:** Spring Boot, GraphQL federation, Kafka and Kafka Streams, PostgreSQL, event-driven architecture
- **Platform & Ops:** Kubernetes, service mesh, CI/CD, infrastructure as code, observability tooling
- **Agentic Tooling:** Claude Code (custom agents, skills, hooks, MCP servers), MCP integrations with production systems, RAG pipelines, agent orchestration frameworks (Mastra, n8n)
- **Practices:** Domain-Driven Design (DDD), hexagonal architecture, BDD and acceptance testing, architecture decision records (ADRs), small-diff reviewable changes

## Certifications

### Architecture & Leadership

- **The Complete Guide to Becoming a Software Architect** | Udemy | Apr 2023 | ID: UC-0c793e16-02cc-4ab3-abaa-ca50c2c7634e
- **Event Driven Architecture** | Udemy | Apr 2023 | ID: UC-e83175ff-f2f2-46f4-9660-9238a23ac5da
- **Microservices Architecture** | Udemy | Mar 2022 | ID: UC-ac7f1070-2ea1-41ed-b6d0-ac6e7a8426b4
- **Management Basics** | NUMA | Oct 2022

### Security & Engineering

- **Anthropic Claude Code in Action** | Anthropic | Feb 2026 | [Verify Credential](https://verify.skilljar.com/c/nnwo6ga3qttn)
- **Graduado en ciberseguridad avanzada** | Riot | Feb 2026 | ID: 06c7c088-7af2-4c63-89d2-ce3e30afdd72
- **Testing Javascript** | Kent C. Dodds Tech LLC | Jul 2021
- **Redux-saga with React** | Udemy | Jul 2021 | ID: UC-29ea2efb-a6f8-49ab-b3d8-462b5fbb804b
- **Advanced JavaScript** | ui.dev | Oct 2018 | ID: cert_pt01p6v1

## Services & Collaboration

### Agentic Engineering Enablement

Helping engineering teams move past initial AI demos—converting team conventions into agent-readable standards, scoping agents to high-impact domains, connecting them to production telemetry, and establishing strict review guardrails.

### Custom Agent & Skill Development

Building domain-scoped review agents, telemetry-integrated reporting tools, and migration or audit agents tailored to your team's standards and reviewable by your engineers.

### Advisory for Engineering Leaders

Strategic guidance for engineering leaders on managing developer teams and AI agent workflows with shared instruments: clear domain boundaries, written standards, and mandatory human review before merge.
