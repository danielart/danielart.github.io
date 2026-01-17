const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Portfolio Page', () => {
    test.beforeEach(async ({ page }) => {
        // Force dark mode preference to ensure consistent starting state
        await page.emulateMedia({ colorScheme: 'dark' });

        const fileUrl = 'file://' + path.resolve(__dirname, '../index.html');
        await page.goto(fileUrl);
    });

    test('should have correct title', async ({ page }) => {
        await expect(page).toHaveTitle(/Daniel Artola Dominguez/);
    });

    test('Theme Toggle should switch themes', async ({ page }) => {
        const themeToggle = page.locator('.theme-toggle');
        const html = page.locator('html');

        // Initial state should be dark (per index.html) or computed from system
        // But in index.html, it is explicitly set to data-theme="dark"
        await expect(html).toHaveAttribute('data-theme', 'dark');

        // Click toggle
        await themeToggle.click();

        // Should switch to light
        await expect(html).toHaveAttribute('data-theme', 'light');

        // Click again
        await themeToggle.click();

        // Should switch back to dark
        await expect(html).toHaveAttribute('data-theme', 'dark');
    });

    test('Navigation links should exist and have valid targets', async ({ page }) => {
        const links = page.locator('.nav-links a');
        const count = await links.count();

        for (let i = 0; i < count; i++) {
            const link = links.nth(i);
            const href = await link.getAttribute('href');
            expect(href).toMatch(/^#/); // Should be an anchor link

            if (href && href !== '#') {
                const targetId = href.substring(1);
                const target = page.locator(`#${targetId}`);
                await expect(target).toBeAttached();
            }
        }
    });

    test('Mobile Menu should toggle', async ({ page }) => {
        // Set viewport to mobile to ensure menu button is visible (if hidden on desktop)
        // CSS suggests .menu-toggle is display: none on larger screens usually, but let's see.
        // Assuming the styles handle it. We can force a smaller viewport.
        await page.setViewportSize({ width: 375, height: 667 });

        const menuToggle = page.locator('.menu-toggle');
        const navLinks = page.locator('.nav-links');

        // Initially not active
        await expect(navLinks).not.toHaveClass(/active/);

        // Click toggle
        await menuToggle.click();

        // Should be active
        await expect(navLinks).toHaveClass(/active/);
        await expect(menuToggle).toHaveClass(/active/);

        // Click again
        await menuToggle.click();

        // Should be inactive
        await expect(navLinks).not.toHaveClass(/active/);
    });

    test('Typing Effect should populate text', async ({ page }) => {
        const typingElement = page.locator('.typing-text');
        const fullText = await typingElement.getAttribute('data-text');

        // Wait for typing to complete (approx calculation based on speed)
        // logic is speed=80ms * length + 500ms delay.
        // Let's just wait for a reasonable time or check that it eventually contains the text.

        // We can use expect to poll until condition is met
        await expect(typingElement).toHaveText(fullText, { timeout: 10000 });
    });

    test('Accessibility: Social links should have aria-labels', async ({ page }) => {
        const socialLinks = page.locator('.social-links a');
        const count = await socialLinks.count();

        for (let i = 0; i < count; i++) {
            const link = socialLinks.nth(i);
            await expect(link).toHaveAttribute('aria-label');
        }
    });

    test('Back to Top button should appear on scroll', async ({ page }) => {
        const backToTop = page.locator('.back-to-top');

        // Initially hidden (opacity 0 and pointer-events none probably, via class .visible)
        await expect(backToTop).not.toHaveClass(/visible/);

        // Scroll down
        await page.evaluate(() => window.scrollTo(0, 1000));

        // Should become visible (logic checks scrollY > 500)
        await expect(backToTop).toHaveClass(/visible/);

        // Click it
        await backToTop.click();

        // Should scroll back to top
        await page.waitForFunction(() => window.scrollY === 0);
    });
});
