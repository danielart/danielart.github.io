import { test, expect } from "@playwright/test";

test("homepage has correct title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Daniel Artola/);
});

test("navigation links are present", async ({ page }) => {
  await page.goto("/");
  const postsLink = page.getByRole("link", { name: "Posts", exact: true });
  await expect(postsLink).toBeVisible();

  const tagsLink = page.getByRole("link", { name: "Tags", exact: true });
  await expect(tagsLink).toBeVisible();

  const aboutLink = page.getByRole("link", { name: "About", exact: true });
  await expect(aboutLink).toBeVisible();
});
