import { Page } from "@playwright/test";
import fs from "fs";
import path from "path";

/**
 * Utility class for handling things on the file system
 */
export class Director {
  static tmpPath: string = "./tmp";

  /**
   * Waits for the "download" event to trigger, saves it to a temporary file and
   * returns the path to the file.
   *
   * @param page - The Playwright `Page` object used to monitor and control the browser.
   * @returns A promise that resolves to the path (string) of the downloaded file
   */

  static async waitForDownload(page: Page): Promise<string> {
    const download = await page.waitForEvent("download");
    const fileUrl = path.resolve(this.tmpPath);

    await download.saveAs(fileUrl);

    return fileUrl;
  }

  /**
   * Removes a directory if it exists
   *
   * @param dirPath - The path to the directory
   * @param options - (Optional): { recursive?: boolean; maxRetries?: number; retryDelay?: number: }
   * @returns A promise that resolves to a void
   */
  static async removeDir(dirPath: string, options?: fs.RmDirOptions) {
    if (fs.existsSync(dirPath)) {
      fs.rmdirSync(dirPath, options);
      console.log(`All contents deleted from folder: ${dirPath}`);
    }
  }
}
