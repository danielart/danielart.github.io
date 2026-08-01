import Lenis from "lenis";

type LenisWindow = Window & {
  __lenisInstance?: Lenis;
};

const getLenisWin = (): LenisWindow => window as unknown as LenisWindow;

function initLenis() {
  const win = getLenisWin();

  // Respect user preference for reduced motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    if (win.__lenisInstance) {
      win.__lenisInstance.destroy();
      win.__lenisInstance = undefined;
    }
    return;
  }

  if (win.__lenisInstance) {
    win.__lenisInstance.destroy();
  }

  const lenis = new Lenis({
    autoRaf: true,
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  win.__lenisInstance = lenis;

  // Setup smooth scroll handling for internal anchor links
  setupAnchorScrolling(lenis);
}

function setupAnchorScrolling(lenis: Lenis) {
  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
  );

  links.forEach(link => {
    link.addEventListener("click", e => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -70 });
      }
    });
  });
}

// Run initialization on page boot
if (typeof window !== "undefined") {
  initLenis();

  // Re-initialize cleanly on Astro view transitions
  document.addEventListener("astro:page-load", initLenis);
  document.addEventListener("astro:before-swap", () => {
    const win = getLenisWin();
    if (win.__lenisInstance) {
      win.__lenisInstance.destroy();
      win.__lenisInstance = undefined;
    }
  });
}
