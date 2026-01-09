
from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Load the page
        page.goto("http://localhost:8080")

        # Initial state: navbar should NOT have 'scrolled' class
        navbar = page.locator(".navbar")
        expect(navbar).not_to_have_class("navbar scrolled")

        # Take screenshot of initial state
        page.screenshot(path="verification/initial.png")
        print("Initial state verified and screenshot taken.")

        # Scroll down
        page.evaluate("window.scrollTo(0, 100)")

        # Wait for potential rAF (though in test it might happen instantly, we wait a bit)
        page.wait_for_timeout(100)

        # Scrolled state: navbar SHOULD have 'scrolled' class
        # Note: classList check via expect
        expect(navbar).to_have_class("navbar scrolled")

        # Take screenshot of scrolled state
        page.screenshot(path="verification/scrolled.png")
        print("Scrolled state verified and screenshot taken.")

        # Scroll back up
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(100)

        # Back to initial state
        expect(navbar).not_to_have_class("navbar scrolled")
        print("Back to top state verified.")

        browser.close()

if __name__ == "__main__":
    run()
