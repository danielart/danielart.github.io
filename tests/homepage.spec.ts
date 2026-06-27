import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

test("homepage has correct title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Daniel Artola/);
});

test("navigation links are present", async ({ page }) => {
  await page.goto("/");
  const postsLink = page.getByRole("link", { name: "Posts", exact: true }).first();
  await expect(postsLink).toBeVisible();

  const tagsLink = page.getByRole("link", { name: "Tags", exact: true }).first();
  await expect(tagsLink).toBeVisible();

  const aboutLink = page.getByRole("link", { name: "About", exact: true }).first();
  await expect(aboutLink).toBeVisible();
});


function getMostRecentPostTitle() {
  const postsDir = path.join(process.cwd(), "src/data/blog");
  const files: string[] = [];
  
  function walk(dir: string) {
    if (!fs.existsSync(dir)) return;
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walk(filePath);
      } else if (file.endsWith(".md") || file.endsWith(".mdx")) {
        files.push(filePath);
      }
    }
  }
  
  walk(postsDir);
  
  const posts = files.map(file => {
    const content = fs.readFileSync(file, "utf-8");
    const titleMatch = content.match(/^title:\s*(.+)$/m);
    let title = titleMatch ? titleMatch[1].trim() : "";
    if ((title.startsWith('"') && title.endsWith('"')) || (title.startsWith("'") && title.endsWith("'"))) {
      title = title.slice(1, -1);
    }
    
    const draftMatch = content.match(/^draft:\s*(.+)$/m);
    const isDraft = draftMatch ? draftMatch[1].trim() === "true" : false;
    
    const pubMatch = content.match(/^pubDatetime:\s*(.+)$/m);
    const pubDate = pubMatch ? pubMatch[1].trim() : "";
    
    const modMatch = content.match(/^modDatetime:\s*(.+)$/m);
    const modDate = modMatch ? modMatch[1].trim() : pubDate;
    
    return { title, isDraft, date: new Date(modDate).getTime() };
  }).filter(p => p.title && !isNaN(p.date) && !p.isDraft);
  
  posts.sort((a, b) => b.date - a.date);
  
  return posts[0]?.title || "";
}

test("recent posts section displays at least one post", async ({ page }) => {
  await page.goto("/");
  
  // Verify that the recent posts section is present
  const recentPostsSection = page.locator("#recent-posts");
  await expect(recentPostsSection).toBeVisible();

  // Verify that there is at least one post displayed in the section
  const posts = recentPostsSection.locator("li");
  await expect(posts.first()).toBeVisible();

  // Verify that the newest post title is present
  const latestTitle = getMostRecentPostTitle();
  if (latestTitle) {
    await expect(recentPostsSection).toContainText(latestTitle);
  }
});
