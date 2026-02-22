# Portfolio Styling Guidelines

This document outlines the visual identity, structure, and constraints for maintaining the unified UI aesthetic of the Daniel Artola portfolio and its related components. All UI changes or additions to the site should comply with these rules.

## 1. Minimalist Glassmorphism (Vibe Engineering)

The primary layout pattern employs glassmorphic containers. We favor soft, translucent components over harsh borders and solid blocks.

- Use `background: var(--glass-bg)` in combination with `backdrop-filter: blur(12px)` and `-webkit-backdrop-filter: blur(12px)`.
- Borders should be subtle and glassy: `border: 1px solid var(--glass-border)`.
- Apply a slight shadow for depth: `box-shadow: 0 4px 30px var(--shadow-color)`.

## 2. Dynamic Component Highlighting & Hover States

Interactive elements should feel responsive and "alive" using subtle micro-animations.

- Hover states for links and cards generally include a slight negative Y translation (`transform: translateY(-8px)`) and an enhanced shadow.
- Hovered borders can transition to use the primary accent color (`border-color: var(--accent-primary)`).
- Use `transition: all var(--transition-base)` consistently.

## 3. Responsive 2-Column Grids

Features, articles, and logical segments (e.g., the Contact Section, Open Source) should prioritize a 2-column or grid-based alignment on desktop, returning to a 1-column layout on mobile setups.

- Grid Class constraint: Ensure `.grid` container classes are used alongside column classes like `.grid-2`.
- Gap normalization: Rely strictly on predefined properties like `gap: var(--space-xl)` or `var(--space-2xl)`. Do not use arbitrary pixel values.

## 4. Typography Rules

- The primary font is Inter (`var(--font-sans)`).
- Text colors must strictly use the global CSS variables: `--text-primary`, `--text-secondary`, and `--text-muted`.
- Never use inline CSS colors or hard-coded hexes unless explicitly overriding for a specific third-party brand (like LinkedIn's `#0a66c2`).

## 5. Animations & Status Feedback

- Active or running background jobs (like the status indicator) simulate existence via subtle pulses. Keep animation durations around 2 seconds to simulate rhythm (`animation: pulse 2s infinite`).
- Avoid flashes or abrupt transitions. Everything goes through a slow fade or minimal slide out/in (via `.reveal` class).

## 6. CSS Framework Rules & Script Loading

- **Tailwind CSS CDN:** The `<script src="https://cdn.tailwindcss.com"></script>` tag **must never** have a `defer` attribute. Deferring the Tailwind CDN script breaks the inline `tailwind.config` definition and incorrectly injects the Tailwind base preflight styles, which resets spacing and typography layout defaults (making titles smaller and losing correct item spacing).
- Always use `<link rel="preload" href="https://cdn.tailwindcss.com" as="script">` in the `<head>` instead to improve LCP without breaking execution order.
