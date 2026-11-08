import { expect, test } from "@playwright/test";

test("404 language selector shows one translation and remembers the choice", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/404.html");
  const selector = page.getByLabel("Language / Idioma");
  await expect(selector).toBeVisible();
  for (const lang of ["es", "en", "pt", "ja"]) {
    await selector.selectOption(lang);
    const messages = page.locator("[data-404-message]:visible");
    await expect(messages).toHaveCount(1);
    await expect(messages).toHaveAttribute("lang", lang);
  }
  await page.screenshot({
    path: testInfo.outputPath("404-ja-mobile.png"),
    fullPage: true,
  });
  await page.reload();
  await expect(selector).toHaveValue("ja");
  await expect(page.locator("[data-404-message]:visible")).toHaveAttribute(
    "lang",
    "ja"
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
