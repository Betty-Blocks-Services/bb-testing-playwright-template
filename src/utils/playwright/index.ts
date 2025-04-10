import { expect, Page, Locator } from "@playwright/test";

/**
 * Helper class for Playwright utilities, including common interactions and assertions.
 */
export class PlaywrightHelper {
  /**
   * Clicks on a locator with optional preconditions and assertions,
   * including visibility, network idle, href presence, and form submission.
   *
   * @param page - The Playwright `Page` object.
   * @param locator - The Playwright `Locator` to click.
   * @param options - Optional settings for the click behavior.
   * @param options.waitNetwork - If true, waits for `networkidle` before and after clicking.
   * @param options.hasHref - If true, asserts that the locator has an `href` attribute.
   * @param options.submit - If true, asserts that the locator is a submit button.
   * @param options.delay - Optional delay (in ms) before the click.
   */
  static async clickToExpect(
    page: Page,
    locator: Locator,
    options: {
      waitNetwork?: boolean;
      hasHref?: boolean;
      submit?: boolean;
      delay?: number;
    } = {},
  ): Promise<void> {
    const {
      waitNetwork = true,
      hasHref = false,
      submit = false,
      delay = 0,
    } = options;

    if (waitNetwork) {
      await page.waitForLoadState("networkidle");
    }

    await locator.waitFor({ state: "visible" });
    await expect(locator).toBeVisible();

    if (submit) {
      await expect(locator).toHaveAttribute("type", "submit");
    }

    if (hasHref) {
      await expect(locator).toHaveAttribute("href");
    }

    await page.waitForTimeout(delay);
    await locator.click();

    if (waitNetwork) {
      await page.waitForLoadState("networkidle");
    }
  }
}
