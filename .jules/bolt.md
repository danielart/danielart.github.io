## 2024-10-24 - Scroll Event Throttling
**Learning:** Attaching expensive operations (like DOM class toggling) directly to the `scroll` event can cause layout thrashing and performance degradation, even on simple pages.
**Action:** Always wrap scroll event listeners in `requestAnimationFrame` to ensure updates align with the browser's refresh rate (approx. 60fps) and prevent main-thread blocking.
