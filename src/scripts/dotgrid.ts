interface DotGridOptions {
  theme: "light" | "dark";
  dotColor?: string;
  dotSpacing?: number;
  dotSize?: number;
}

export class DotGrid {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private options: DotGridOptions;
  private width: number = 0;
  private height: number = 0;
  private mouseX: number = -1000;
  private mouseY: number = -1000;
  private activeMouse: boolean = false;
  private animationFrameId: number | null = null;
  private isVisible: boolean = true;
  private observer: IntersectionObserver | null = null;

  constructor(canvas: HTMLCanvasElement, options: DotGridOptions) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.options = {
      dotSpacing: 32,
      dotSize: 1.5,
      ...options,
    };

    this.init();
  }

  private init() {
    this.resize();
    window.addEventListener("resize", this.handleResize);

    // Mouse events
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseleave", this.handleMouseLeave);

    // Touch events (for mobile)
    window.addEventListener("touchmove", this.handleTouchMove, {
      passive: true,
    });
    window.addEventListener("touchend", this.handleTouchEnd);

    // Visibility observer to pause animation when not on screen
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          this.isVisible = entry.isIntersecting;
          if (this.isVisible) {
            this.startLoop();
          } else {
            this.stopLoop();
          }
        });
      },
      { threshold: 0.1 }
    );
    this.observer.observe(this.canvas);

    this.startLoop();
  }

  public setTheme(theme: "light" | "dark") {
    this.options.theme = theme;
    this.draw();
  }

  private handleResize = () => {
    this.resize();
  };

  private resize() {
    const parent = this.canvas.parentElement;
    const rect = parent
      ? parent.getBoundingClientRect()
      : { width: window.innerWidth, height: 400 };
    this.width = rect.width;
    this.height = rect.height;

    // Use device pixel ratio for super crisp rendering
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    if (this.ctx) {
      this.ctx.scale(dpr, dpr);
    }
    this.draw();
  }

  private handleMouseMove = (e: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
    this.activeMouse = true;
    this.startLoop();
  };

  private handleMouseLeave = () => {
    this.activeMouse = false;
  };

  private handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.touches[0].clientX - rect.left;
      this.mouseY = e.touches[0].clientY - rect.top;
      this.activeMouse = true;
      this.startLoop();
    }
  };

  private handleTouchEnd = () => {
    this.activeMouse = false;
  };

  private startLoop() {
    if (this.animationFrameId === null && this.isVisible) {
      this.loop();
    }
  }

  private stopLoop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private loop = () => {
    this.draw();
    if (this.activeMouse) {
      this.animationFrameId = requestAnimationFrame(this.loop);
    } else {
      this.animationFrameId = null;
    }
  };

  private draw() {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    const spacing = this.options.dotSpacing || 32;
    const size = this.options.dotSize || 1.5;
    const isDark = this.options.theme === "dark";

    // Set dot base color based on theme
    const baseColor = isDark
      ? "rgba(44, 41, 38, 0.45)"
      : "rgba(230, 224, 213, 0.8)";

    const cols = Math.ceil(this.width / spacing);
    const rows = Math.ceil(this.height / spacing);

    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        const originalX = i * spacing;
        const originalY = j * spacing;

        let drawX = originalX;
        let drawY = originalY;
        let currentSize = size;
        let color = baseColor;

        if (this.activeMouse) {
          const dx = this.mouseX - originalX;
          const dy = this.mouseY - originalY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 120; // Radius of interaction

          if (dist < maxDist) {
            const factor = (maxDist - dist) / maxDist; // 0 to 1 based on closeness

            // Push dot away slightly
            const angle = Math.atan2(dy, dx);
            const push = factor * 8; // Max push in pixels
            drawX = originalX - Math.cos(angle) * push;
            drawY = originalY - Math.sin(angle) * push;

            // Increase size and change color/opacity
            currentSize = size + factor * 1.5;
            color = isDark
              ? `rgba(226, 109, 74, ${0.45 + factor * 0.45})`
              : `rgba(224, 92, 54, ${0.25 + factor * 0.55})`;
          }
        }

        this.ctx.beginPath();
        this.ctx.arc(drawX, drawY, currentSize, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
      }
    }
  }

  public destroy() {
    this.stopLoop();
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseleave", this.handleMouseLeave);
    window.removeEventListener("touchmove", this.handleTouchMove);
    window.removeEventListener("touchend", this.handleTouchEnd);
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Global helper for easy loading in Astro scripts
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).initDotGrid = (
    canvas: HTMLCanvasElement,
    options: DotGridOptions
  ) => {
    return new DotGrid(canvas, options);
  };
}
