## 2024-05-23 - Back to Top Button
**Learning:** For long single-page portfolios, users often lose context or easy access to navigation after scrolling deep into content (like certifications or experience).
**Action:** Implemented a non-intrusive "Back to Top" button that only appears after significant scrolling (500px). Used glassmorphism to match the design system so it feels integrated, not tacked on. Added keyboard focus management to return focus to the top logo, improving accessibility for keyboard users who would otherwise be stranded at the bottom of the DOM.

## 2025-01-11 - Typing Animation Accessibility
**Learning:** Typing animations that inject text character-by-character can be confusing or silent for screen reader users if not handled correctly. They may announce partial words or nothing at all.
**Action:** The solution is to provide the full text in an `aria-label` on the parent container and hide the dynamic animation element itself using `aria-hidden="true"`. This allows sighted users to enjoy the animation while screen reader users get the content immediately.
