import { expect, test } from "@playwright/test";

test("404 has no language selector and uses the browser language", async ({
  browser,
}) => {
  for (const lang of ["es", "en", "pt", "ja"]) {
    const context = await browser.newContext({ locale: lang });
    const page = await context.newPage();
    await page.goto("/404.html");
    await expect(
      page.locator("#main-content").getByRole("combobox")
    ).toHaveCount(0);
    const messages = page.locator("[data-404-message]:visible");
    await expect(messages).toHaveCount(1);
    await expect(messages).toHaveAttribute("lang", lang);
    await context.close();
  }
});

test("404 respects the language selected on the homepage", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "ES", exact: true }).click();
  await page.goto("/404.html");
  await expect(page.locator("[data-404-message]:visible")).toHaveAttribute(
    "lang",
    "es"
  );
});

test("404 uses the missing URL's language before the browser preference", async ({
  page,
}) => {
  await page.goto("/posts/es/this-page-does-not-exist/");
  await expect(page.locator("[data-404-message]:visible")).toHaveAttribute(
    "lang",
    "es"
  );
});

test("contact invitation follows the homepage language selector", async ({
  page,
}) => {
  await page.goto("/");
  for (const lang of ["es", "en", "pt", "ja"]) {
    await page
      .getByRole("button", { name: lang.toUpperCase(), exact: true })
      .click();
    const messages = page.locator("[data-contact-message]:visible");
    await expect(messages).toHaveCount(1);
    await expect(messages).toHaveAttribute("lang", lang);
  }
});
