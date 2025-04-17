import { Page } from "@playwright/test";
import fs from "fs";
import path from "path";

/**
 * fs.ReadSyncOptions does not work properly with fs.readFileSync
 * This class is a manual implementation of fs.ReadSyncOptions
 */
interface ReadSyncOptions {
  encoding?: BufferEncoding | null | undefined;
  flag?: string | undefined;
}

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
   *
   * Creates a file with content at the given path.
   * By default, it will create the necessary directories if they do not exist.
   *
   * @param filePath - The path of the new file.
   * @param contents - The content of the file.
   * @param options - (Optional): The options to use when writing the file.
   */
  static async writeFile(
    filePath: string,
    contents: string,
    options?: fs.WriteFileOptions,
  ) {
    this.makeDir(path.resolve(path.dirname(filePath)), {
      recursive: true,
    });
    fs.writeFileSync(filePath, contents, options);
  }

  /**
   *
   * Reads the contens of a file.
   *
   * @param filePath - The path of the file to read
   * @param options - (Optional): The options to use to read the file. Defaults to { encoding: "utf-8" }
   * @returns Promise resolving to:
   * BufferEncoding OR string - depending on options.encoding
   * false - if the file does not exist
   */
  static readFile(
    filePath: string,
    options: ReadSyncOptions = { encoding: "utf-8" },
  ) {
    if (this.pathExists(filePath)) {
      return fs.readFileSync(filePath, options);
    }
    return false;
  }

  /**
   *
   * Creates a directory at the given path.
   * By default, it will
   *
   * @param dirPath - The path of the new directory
   * @param options - (Optional): The options to use to create the new directory. Defaults to: { recursive: true }
   */
  static makeDir(
    dirPath: string,
    options: fs.MakeDirectoryOptions = { recursive: true },
  ) {
    return fs.mkdirSync(dirPath, options);
  }

  /**
   * Reads the contents of a directory.
   * You can enable recursive scanning and other options via the options
   *
   * @param dirPath - The path of the directory to read.
   * @param options - (Optional): The options to use to read the contents of the directory. Defaults to: { encoding: "utf-8" }
   * @returns string[] or false if the directory does not exist
   */
  static readDir(
    dirPath: string,
    options:
      | {
          encoding: BufferEncoding | null;
          withFileTypes?: false | undefined;
          recursive?: boolean | undefined;
        }
      | BufferEncoding
      | null = { encoding: "utf-8" },
  ): string[] | false {
    if (this.pathExists(dirPath)) {
      return fs.readdirSync(dirPath, options);
    }
    return false;
  }

  /**
   * Removes a directory if it exists
   *
   * @param dirPath - The path to the directory
   * @param options - (Optional): The options to use when removing the directory
   */
  static removeDir(dirPath: string, options?: fs.RmDirOptions): boolean {
    if (fs.existsSync(dirPath)) {
      fs.rmdirSync(dirPath, options);
      console.log(`All contents deleted from folder: ${dirPath}`);
      return true;
    }
    return false;
  }

  /**
   *
   * Simple function to check if a path is accessible by the file system (it exists).
   * @param p - The path to the file
   */
  static pathExists(p: string) {
    return fs.existsSync(p);
  }
}
