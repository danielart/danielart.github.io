---
layout: ../layouts/AboutLayout.astro
title: "About"
---

I am an **Engineering Lead** based in Barcelona with roughly two decades of experience building and evolving software systems.

I lead an engineering team at a high-traffic, multi-market European e-commerce marketplace. Alongside engineering leadership, I work on AI agents, developer tooling, automation, open-source software, and experimental projects that combine code, language, images, video, and structured knowledge.

Beyond the code, I am a React enthusiast, a bass player in the indie rock band Los Chicos del Sótano, a parent, and a persistent maker of side projects.

My main interest is not using AI to produce more output. It is learning how to combine human judgment, software engineering discipline, and AI capabilities to complete ambitious work that would otherwise be too slow, expensive, repetitive, or complex.

> _"I do not use AI to avoid the work. I use it to make ambitious work possible, while keeping engineering judgment, verification and authorship human."_

## How I Work With AI

I treat AI as a system component rather than a magic prompt box.

- **ChatGPT & Gemini:** Help me explore unfamiliar domains, challenge assumptions, structure information, define requirements, create reusable workflows, and execute multimodal analysis across text, images, research, and visual references (from UI mockups to DaVinci Resolve color matching).
- **Coding Agents & Runtimes (Codex, Claude Code, Google Antigravity):** Help me move from an understood problem to a working implementation—exploring repositories, orchestrating multi-agent workflows with Google Antigravity, drafting plans, editing code, writing tests, updating documentation, reviewing changes via MCP servers, and validating results against the actual codebase.

### The Loop Between Them

1. Understand the problem and its constraints.
2. Turn implicit knowledge into explicit rules.
3. Give the agent access to the right context and tools.
4. Produce small, reviewable changes.
5. Test claims against code, data, or visual evidence.
6. Capture what was learned as reusable documentation or skills.

AI accelerates the loop, but responsibility for the final result remains human.

## Core Principles

- **Encode standards, not prompts.** A prompt helps once. I write team conventions down as reusable agent skills—database migration rules, event-consumer error handling, acceptance test structure, decision records, and review checklists—so every agent inherits how your specific team builds.
- **Scope agents to domains, not tasks.** The most effective agents own a business domain end to end. They understand its rules, cross-team dependencies, and common failure points. They review changes, draft tickets, and reject work that violates written rules.
- **Wire agents to the real stack.** Agents connected directly to production analytics, observability platforms, and issue trackers reason about actual runtime behavior rather than guessing from screenshots.
- **Trust comes from verification, not vibes.** Claims are checked against source code before shipping. Assumptions are stated explicitly, diffs are kept small and human-reviewable, and adversarial review runs before merge.

## What I’ve Built

- **Domain-scoped review agents:** Deployed review agents across critical e-commerce domains—including shopping cart and checkout, customer data and GDPR compliance, and authentication. Each agent audits changes against written business rules, plans work, drafts tickets, and flags cross-team blockers before they reach production.
- **Organization-wide skill libraries:** Designed skill libraries encoding an engineering org’s technical standards, covering architecture (hexagonal, DDD, event sourcing), data migrations, event-streaming patterns, testing strategy, observability, deployment, and code review.
- **Real-time reporting agents:** Built agents that query product analytics and monitoring platforms directly, assembling breakdown reports by market, platform, and device without manual dashboard wrangling.
- **Agent-assisted platform migrations:** Guided live system migrations in multi-market environments, including relational database migrations with change-data-capture, identity provider replacements, and GDPR data-lifecycle automation.

## AI as a Learning and Thinking Tool

I regularly use AI to enter areas outside my existing expertise without pretending that generated information is automatically correct. I have used it to support language learning, visual design, video production, storytelling, investment analysis, technical writing, research, and educational materials.

My usual approach is to:

1. Ask the model to interview me before proposing a solution.
2. Separate facts, assumptions, preferences, and constraints.
3. Build reusable reference material instead of repeating context.
4. Request criticism and failure cases, not only agreeable answers.
5. Verify important information against primary sources.
6. Turn discoveries into templates, checklists, or structured project files.

This ability to move between disciplines makes learning more directed and experimentation more accessible without replacing human expertise.

## Open Source and Knowledge Sharing

- **Brisa:** Core contributor to Brisa, a full-stack web framework built around web standards and zero client-side JavaScript by default.
- **Teaful:** Co-creator and maintainer of Teaful, a small React state-management library designed to reduce boilerplate and unnecessary re-renders.
- **Technical Writing:** I publish practical articles about agentic engineering, coding-agent permissions, reusable skills, MCP integrations, AI-assisted workflows, and lessons learned from real projects—including mistakes, trade-offs, and failed attempts alongside successful results.

## Technical Range

- **Languages:** TypeScript, JavaScript, Kotlin, Java
- **Frontend & UI:** React, Redux, React Native, Brisa, Web Components
- **Backend & Data:** Spring Boot, GraphQL federation, Kafka, Kafka Streams, PostgreSQL, event-driven architecture
- **Platform & Ops:** Kubernetes, service mesh, CI/CD, infrastructure as code, observability tooling
- **AI Development:** ChatGPT, Codex, Claude Code, Gemini, Google Antigravity, custom agents, agent skills, hooks, MCP servers, RAG pipelines, Mastra, n8n
- **Engineering Practices:** Domain-Driven Design (DDD), hexagonal architecture, BDD, acceptance testing, architecture decision records (ADRs), incremental delivery, small-diff code review
- **Multimodal Workflows:** Structured prompting, reference sheets, image generation, video generation, visual continuity, AI-assisted editing

## Personal Philosophy

1. Use AI to expand what can be attempted, not to hide weak work.
2. Give models context, constraints, tools, and examples—not vague instructions.
3. Preserve human ownership of decisions and outcomes.
4. Prefer inspectable workflows over opaque automation.
5. Match autonomy to risk.
6. Know when conventional software or manual work is more appropriate than AI.
7. Finish meaningful projects instead of endlessly pursuing perfect generations.

## Services & Collaboration

### Agentic Engineering Enablement

Helping engineering teams move beyond isolated AI demos by turning team conventions into agent-readable standards, selecting high-value domains, connecting agents to real systems, and introducing practical review and safety boundaries.

### Custom Agents, Skills, and Automations

Building repository skills, domain-aware agents, reporting tools, migration assistants, audit workflows, and integrations tailored to an organization’s existing engineering practices.

### AI-Assisted Development Workflows

Designing workflows that combine conversational models and coding agents across discovery, planning, implementation, testing, documentation, and review.

### Advisory for Engineering Leaders

Helping engineering leaders decide where agents add value, which responsibilities should remain human, how to introduce them safely, and how engineering roles and processes should evolve around them.
