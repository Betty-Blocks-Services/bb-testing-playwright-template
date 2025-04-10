import type { Page } from "playwright";
import type { Locator } from "playwright";
import type {
  PdfPage,
  readPdfPages as ReadPdfPagesType,
  ReadPdfTextParams,
} from "pdf-text-reader";

/**
 * Utility class for handling PDF operations such as downloading,
 * extracting pages, and extracting text content.
 */
export class PdfHelper {
  /**
   * Extracts text pages from a given PDF file path.
   *
   * @param params - The parameters to use.
   * @returns A promise that resolves to an array of PDF page objects.
   */
  static async extractPagesFromPdf(
    params: ReadPdfTextParams,
  ): Promise<PdfPage[]> {
    const { readPdfPages }: { readPdfPages: typeof ReadPdfPagesType } =
      await import("pdf-text-reader");
    const pages = await readPdfPages(params);
    return pages;
  }

  /**
   * Downloads a PDF file by triggering a click on the provided locator,
   * saves it to a temporary file, and extracts its pages.
   *
   * @param page - The Playwright `Page` object used to monitor and control the browser.
   * @param locator - A Playwright `Locator` used to trigger the download.
   * @returns A promise that resolves to an array of extracted PDF pages.
   */
  static async fetchPdfPages(page: Page, locator: Locator): Promise<PdfPage[]> {
    const downloadPromise = page.waitForEvent("download");

    await page.waitForTimeout(1000);
    await locator.click();

    const download = await downloadPromise;
    const fileUrl = `./.tmp/${Date.now()}_${download.suggestedFilename()}`;

    await download.saveAs(fileUrl);

    return await this.extractPagesFromPdf({ url: fileUrl });
  }

  /**
   * Extracts non-empty lines of text from a specific page in the PDF.
   *
   * @param pages - An array of PDF page objects.
   * @param pageNumber - The page number (0-based index) to extract text from.
   * @returns An array of text lines from the specified page.
   */
  static extractTextFromPage(pages: PdfPage[], pageNumber: number): string[] {
    return pages[pageNumber].lines.filter((text) => text !== "");
  }
}
