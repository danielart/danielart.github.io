
import os
from playwright.sync_api import sync_playwright

def verify_back_to_top():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Get absolute path to index.html
        cwd = os.getcwd()
        file_path = f"file://{cwd}/index.html"

        print(f"Navigating to {file_path}")
        page.goto(file_path)

        # Initial state: button should not be visible
        # Note: The class is 'back-to-top', and 'visible' is added.
        # CSS: .back-to-top { opacity: 0; ... } .back-to-top.visible { opacity: 1; ... }
        # We can check for the class 'visible'.

        btn = page.locator('.back-to-top')

        # Scroll down
        print("Scrolling down...")
        page.evaluate("window.scrollTo(0, 1000)")

        # Wait for potential animation frame/debounce
        page.wait_for_timeout(500)

        # Check if visible class is added
        is_visible = page.evaluate("document.querySelector('.back-to-top').classList.contains('visible')")
        print(f"Is visible after scroll: {is_visible}")

        # Take screenshot
        page.screenshot(path="verification/back_to_top_visible.png")

        # Scroll up
        print("Scrolling up...")
        page.evaluate("window.scrollTo(0, 0)")

        # Wait for potential animation frame
        page.wait_for_timeout(500)

        # Check if visible class is removed
        is_visible_top = page.evaluate("document.querySelector('.back-to-top').classList.contains('visible')")
        print(f"Is visible after scroll up: {is_visible_top}")

        browser.close()

if __name__ == "__main__":
    verify_back_to_top()
