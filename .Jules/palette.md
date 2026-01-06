## 2024-01-06 - Skip Link Visibility
**Learning:** Fixed navbar with `z-index: 1000` requires skip links to have significantly higher z-index (used 9999) to ensure visibility over the glassmorphism header.
**Action:** Always check stacking contexts when implementing overlays on this site.
