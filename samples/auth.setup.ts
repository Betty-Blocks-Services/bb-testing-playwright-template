/*
 * To use this file:
 *
 * 1. Copy into src/tests/setup
 * 2. Uncomment the lines at 'projects' in playwright.config.ts
 * 3. Configure the .env file
 * 4. Adjust this file to your apps specific's
 *
 */

import { test as setup } from "@playwright/test";

setup("authenticate", async ({ page }) => {
  const makeAppURL = (path?: string) => {
    return `${process.env.APP_URL || ""}${path}`;
  };

  await page.goto(makeAppURL("/login"));

  const usernameField = page.getByRole("textbox", { name: "Email" });
  const passwordField = page.getByRole("textbox", { name: "Password" });

  await usernameField.click();
  await usernameField.fill(process.env.APP_USERNAME || "");

  await passwordField.click();
  await passwordField.fill(process.env.APP_PASSWORD || "");

  await page.getByRole("button", { name: "Login" }).click();

  await page.waitForURL(makeAppURL("/home"));
  await page.waitForLoadState("networkidle"); // Wait for datacontainers to load

  /*
   * If your app has 2FA, you need to add additional steps here
   */
  await page.context().storageState({ path: "storage-stage.json" });
});
