import { expect, test } from "@playwright/test";

test("404 offers recent articles and useful navigation", async ({ page }) => {
  await page.goto("/404.html");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Page not found"
  );
  const recent = page.getByRole("region", { name: "Latest articles" });
  await expect(recent.locator('a[href^="/posts/"]')).toHaveCount(4);
});

test("newsletter has an accessible label and actionable errors", async ({
  page,
}) => {
  await page.goto("/");
  const email = page.getByRole("textbox", { name: "Email address" });
  await page.getByRole("button", { name: "Subscribe →" }).click();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByRole("alert")).toContainText(
    "Enter your email address"
  );
  await email.fill("invalid");
  await page.getByRole("button", { name: "Subscribe →" }).click();
  await expect(page.getByRole("alert")).toContainText("valid email");
});

test("analytics stays blocked until consent and stops after withdrawal", async ({
  page,
  context,
}) => {
  const requests: string[] = [];
  await page.route("https://www.googletagmanager.com/**", route => {
    requests.push(route.request().url());
    return route.fulfill({ contentType: "application/javascript", body: "" });
  });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Accept", exact: true })
  ).toBeVisible();
  expect(requests).toHaveLength(0);
  await page.getByRole("button", { name: "Decline", exact: true }).click();
  await page.reload();
  await expect(page.locator("#cookie-consent-banner")).toBeHidden();
  expect(requests).toHaveLength(0);
  await page.getByRole("button", { name: "Cookie settings" }).click();
  await page.getByRole("button", { name: "Accept", exact: true }).click();
  await expect.poll(() => requests.length).toBe(1);
  await context.addCookies([
    { name: "_ga", value: "test-only", url: "http://127.0.0.1:4321" },
    { name: "_ga_TEST", value: "test-only", domain: "127.0.0.1", path: "/" },
    { name: "unrelated", value: "preserve", url: "http://127.0.0.1:4321" },
  ]);
  await page.getByRole("link", { name: "Privacy & cookies" }).click();
  await expect(page).toHaveURL(/privacy/);
  expect(requests).toHaveLength(1);
  await page.getByRole("button", { name: "Cookie settings" }).click();
  await Promise.all([
    page.waitForEvent("load"),
    page.getByRole("button", { name: "Decline", exact: true }).click(),
  ]);
  await expect(page.locator("#cookie-consent-banner")).toBeHidden();
  expect(requests).toHaveLength(1);
  const cookies = await context.cookies();
  expect(cookies.some(cookie => cookie.name.startsWith("_ga"))).toBe(false);
  expect(cookies.some(cookie => cookie.name === "unrelated")).toBe(true);
});

test("JavaScript-disabled visitors never load Tag Manager", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const requests: string[] = [];
  await page.route("https://www.googletagmanager.com/**", route => {
    requests.push(route.request().url());
    return route.abort();
  });
  await page.goto("/");
  await expect(page.locator('iframe[src*="googletagmanager"]')).toHaveCount(0);
  expect(requests).toHaveLength(0);
  await context.close();
});
