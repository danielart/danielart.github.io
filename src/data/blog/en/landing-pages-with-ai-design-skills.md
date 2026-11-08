---
title: "High-Quality AI Landing Pages: Two Skills and a Solid Brief"
description: "Build landing pages with Landing Page Guide and Impeccable: set up the skills, paste the prompt, and compare variants to iterate fast with clear design intent."
author: Daniel Artola
pubDatetime: 2026-11-06T18:20:00Z
draft: false
lang: en
translationKey: landing-pages-with-ai-design-skills
pillar: agent-ready-repositories
articleType: guide
audience:
  - developer
  - general
tags:
  - ai
  - skills
  - web-design
  - productivity
---

You ask for a website and what comes back is something you've seen twenty times already: a massive headline, a purple gradient, three feature cards with generic icons, and a button that says "Get Started". The exact same animations, color palettes, and effects. A new site that feels like a twin to hundreds of thousands of others. This happens when you delegate the look and feel entirely to the AI, leaving aesthetic direction to its default whims. It's frustrating because it's hard to put your finger on what makes it feel so generic, or how to explain in a prompt what needs to change.

To break out of that trap, it helps to combine **a concrete summary of the site's goal, your own authentic assets (like images or a real slogan), and two curated skills**. The approach in this article is to use Landing Page Guide to structure the page layout and messaging flow, and Impeccable to critique the visual design and steer it in a recognizable direction.

You want a working first version quickly—something you can open, compare, and refine. Having a concrete prototype in front of you enables far better design decisions than endlessly prompting for "something modern and professional".

## Table of contents

## What each skill brings to the table

A skill packages instructions and supporting reference files so an AI agent can execute a structured workflow. For this process, we split the responsibilities as follows:

| Resource              | How we use it                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| Landing Page Guide V2 | Structures the message, core sections, and conversion journey toward the primary call to action. |
| Impeccable            | Critiques visual choices and polishes generic, uninspired, or inconsistent UI elements.          |

[Landing Page Guide V2, by bear2u](https://github.com/bear2u/my-skills/tree/master/skills/landing-page-guide-v2) proposes an 11-essential-elements framework including brand identity, hero value proposition, primary CTA, visual demonstration, benefit breakdowns, social proof, FAQs, and a closing argument. It also provides aesthetic guidelines to avoid typical template traps. Here, we use it primarily as an architectural and content blueprint. Its reference implementation is designed around Next.js and ShadCN UI.

[Impeccable, by pbakaus](https://github.com/pbakaus/impeccable) provides tools to critique, audit, and refine interfaces. Its documentation emphasizes working against tangible targets—for instance, evaluating a hero section or simplifying a cluttered layout. It shines right after you have an initial, navigable page up and running.

This combination is a practical workflow proposal, not an automatic guarantee of higher conversion rates. That still has to be validated with real visitors and empirical data.

## Getting both skills ready

Every agent environment (**Claude Code, Codex, Gemini CLI, Cursor, etc.**) manages skills differently. The quickest route is often to ask your agent directly to download and install them by providing the repository URLs, or to follow each project's quickstart guide:

- **[Landing Page Guide V2](https://github.com/bear2u/my-skills/tree/master/skills/landing-page-guide-v2)**: requires its **complete folder** (not just `SKILL.md`, as it references a `references/` subfolder containing the 11 essential elements and component samples). You can install it with `npx skills add bear2u/my-skills --skill landing-page-guide-v2`, copy the entire directory into your agent's skills location (`.claude/skills/` or `.agents/skills/`), or ask your agent to pull it.
- **[Impeccable](https://github.com/pbakaus/impeccable)**: provides its own installer CLI (`npx impeccable install`) and initialization command (`/impeccable init`). Check its GitHub repository for the recommended workflow in your environment.

Before prompting the agent to build the page, run a quick sanity check:

```text
Confirm that you can access the instructions for Landing Page Guide V2 and Impeccable.
Let me know if both are available before generating the page.
```

Pasting a URL into a chat prompt does not guarantee that the skill was parsed or loaded properly into context.

## Prepare a project directory with your assets and copy

Create or open a project folder in your chosen agent environment. Add your real brand logo, product photography, UI screenshots, and copy drafts. A clean, minimal layout works best:

```text
my-landing/
  assets/
    logo.svg
    product.webp
    team.jpg
  content/
    brief.md
    approved-copy.md
```

These directories act as raw inputs for the agent; it can then place the static assets in the proper build directories later.

In `brief.md`, clearly explain **what you are selling, to whom, what problem it solves, and the single primary action you want the visitor to take**. "Book a 15-minute discovery call" enables a much sharper user flow than "raise brand awareness".

In `approved-copy.md`, separate phrases that must appear verbatim from concepts that the agent is allowed to iterate on. If your brand tagline is "Your next getaway starts here", mark it as mandatory text. Do the same for pricing, warranties, and promotional terms.

Tie each image asset to its specific job: "product.webp must appear above the fold and show the complete dashboard interface". This removes guesswork and avoids unnecessary rounds of visual adjustments.

## Prompt template for the first working version

Copy this prompt template once the skills are loaded, replacing the bracketed placeholders with your project details. This is an editorial workflow template, not an official command from either project.

```text
Create a first navigable version of a landing page in this project.
Use Landing Page Guide V2 to structure the sections and message flow.
Then apply Impeccable to critique and elevate the visual design.
Load both skills before starting; notify me if any are missing.

CONTEXT
- Brand or product: [Name and brief summary].
- Audience: [Target persona and their primary pain point].
- Page goal: [What the visitor must understand immediately].
- Primary action: [Book, buy, register, contact, download...].
- Language and tone: [English, authoritative, friendly, concise...].

MATERIALS
- Read content/brief.md and content/approved-copy.md.
- Use images in assets/ according to their defined role in the brief.
- Do not invent customer names, testimonials, metrics, discounts, or badges.
- If a data point is missing, flag it as pending review.

LITERAL COPY: DO NOT REWRITE
- Tagline: "[exact string]".
- Primary hook: "[exact string]".
- Primary CTA button: "[exact string]".
- Other required terms or disclaimers: [list or file reference].
- You may suggest alternative copy variations separately, without modifying the originals.

MAIN SECTIONS (adapt this list to your specific needs)
1. Header with logo and concise navigation.
2. Above-the-fold hero with clear value proposition, primary visual, and main CTA button.
3. The core problem solved and key customer benefits.
4. [Explanation or product mechanics: steps, feature breakdown, or product demo].
5. [Social proof: customer testimonials, client logos, or verified case metrics, only if real assets exist].
6. [Objection handling: FAQs, transparent pricing/tiers, or comparison matrix].
7. [Other sections specific to your offering: team, schedule, guarantees, etc.].
8. Closing section with final call to action, contact channel, and footer links.
Cross-reference this layout against Landing Page Guide V2 and explain any adjustments.
If assets are missing for an element in the guide, highlight it without fabricating content.

VISUAL DIRECTION
- Brand personality: [Editorial, sober, warm, bold, high-tech...].
- Color palette and brand fonts: [Exact tokens or creative flexibility].
- Reference sites I like and why: [Links or file paths].
- Design patterns to avoid: [Specific clichés or tropes].
- Establish a coherent visual identity before writing layout markup.
- Apply Impeccable to critique hierarchy, balance, whitespace, and consistency.
- Avoid arbitrary decorative elements; justify prominent choices
  based on product purpose, audience, and available brand assets.

IMPLEMENTATION & DELIVERY
- Respect the existing stack. If none exists, propose a lightweight option
  and explain how you will apply the technical tenets of Landing Page Guide V2.
- Prioritize a fully navigable first draft that we can review right away.
- Validate mobile responsiveness, desktop layouts, color contrast, and keyboard navigation.
- Honor user preferences for reduced motion.
- Verify button actions and navigation links. If a form requires backend
  wiring, state it clearly: do not fake successful data submissions.
- Run project build/lint checks and explain how to view the page locally.
- Summarize the design decisions made and what remains to be completed.
```

Visual critique requires specific, actionable feedback. For instance, you might request that a product screenshot take up more visual real estate because it clarifies the workflow, or strip away decorative icons that compete with the main CTA. These directions are far more useful to an agent than vague prompts like "make it look premium".

## Ask for a variant comparison tool

Once the first version is running, ask the agent to explore alternate layout directions while keeping the copy locked. Holding the message constant allows you to judge design choices without conflating them with copy changes.

```text
Create three variants of this landing page using the exact same brief, assets,
literal copy, and primary action. Keep the current version intact.

- A: Editorial direction, giving primary weight to photography and strong typography.
- B: Sober, functional direction, optimized for quick scanning and interactive demo.
- C: Expressive direction, exploring a bolder layout rhythm within the brand guidelines.

Use Landing Page Guide V2 to verify the structural integrity of each option,
and Impeccable to review visual coherence.
Differences must center on composition, visual hierarchy, and rhythm;
simply swapping accent colors is not enough.

Build a lightweight local switcher with an A/B/C selector, direct links to each
variant, and mobile/desktop viewport toggles. If fitting,
use /comparator and /variants/a, /variants/b, /variants/c.
Keep these routes as review tools outside of the production bundle.
Enable side-by-side comparison on large screens and full-width views.
Keep viewport widths identical when comparing variants.

Explain the trade-offs each variant introduces and the design rationale behind them.
```

The comparator is a lightweight scaffolding tool you ask the agent to generate. **It is not a built-in feature of these skills, nor is it a live A/B test with production traffic.** Its purpose is to help you quickly choose which design vector to commit to.

Always review variants at full width: scaled thumbnails easily hide readability and spacing issues. Check whether the value proposition is unmistakable above the fold, and confirm that the primary action remains front and center on mobile screens.

## Iterate on the elements that need refining

Once you have compared the variants, keep what works and tightly bound your next round of revisions. For example:

```text
Use Variant B as our baseline. I like its layout logic and want to keep
the approved copy, navigation, and FAQ accordion untouched.

Update only these three areas:
1. Above-the-fold hero: adopt the photographic layout from Variant A,
   ensuring the product is not cropped and keeping the CTA visible on mobile viewports.
2. Benefits section: replace repeated icon cards with a clean visual list
   that allows visitors to scan the three core outcomes in seconds.
3. Closing section: strip out decorative background graphics and give full prominence to the booking CTA.

Use Impeccable to critique these three zones and apply the changes.
Verify with Landing Page Guide V2 that the user journey remains intact.
Test mobile and desktop breakpoints, and summarize the adjustments.
```

An annotated screenshot also works wonders: "this heading wraps awkwardly", "display the product screenshot at full aspect ratio here", "too much vertical padding between pricing and the checkout button". Giving the agent observable, measurable goals makes validation straightforward.

Work in concise feedback loops: composition first, then visual hierarchy and scanability, followed by micro-details. Save or commit your baseline before starting a major revision so you can easily revert if a localized change degrades the overall composition.

## Before shipping the landing page

Review all literal strings, click every link, and test the conversion flow end-to-end. Ensure images load quickly, content flows naturally without overflow on mobile devices, and marketing claims reflect real numbers. If there is an email capture or contact form, verify that submissions actually route to your backend or CRM.

This workflow aligns directly with the approach in [AI Coding Agents: How I Reduced Development Time from Months to Days](/posts/en/ai-workflow/): providing structured context and reviewing discrete deliverables accelerates real progress. It also echoes the rule in [If You Publish It, You Own It](/posts/en/if-you-publish-it-you-own-it/): final review and quality assurance remain the author's responsibility.

Speed comes from shrinking the feedback loop between prompting, observing, and refining. With real assets, clear messaging, and these two skills in your toolkit, each iteration gets you significantly closer to a landing page tailored to your project.
