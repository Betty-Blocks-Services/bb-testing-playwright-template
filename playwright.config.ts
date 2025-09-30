import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./src",
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel to determine test order via naming convention: 001-, 002-, etc. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    screenshot: { mode: "off" },
    trace: {
      screenshots: true,
      mode: "on",
      snapshots: false,
      attachments: false,
    },
  },

  /* Configure projects for major browsers */
  projects: [
    /* Define your setup's */
    // {
    //   name: "admin-login",
    //   testMatch: "admin-login.spec.ts",
    //   testDir: "src/admin/setup",
    //   metadata: { type: "setup" },
    //   dependencies: [],
    // },
    {
      name: "admin",
      dependencies: [
        /*"admin-login"*/
      ],
      testDir: "src/admin/tests",
      metadata: { type: "suite" },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
