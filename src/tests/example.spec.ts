import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://bettyblocks.com/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Betty Blocks/);
});
