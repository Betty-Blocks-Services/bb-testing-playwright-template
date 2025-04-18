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
   * Extracts non-empty lines of text from a specific page in the PDF.
   *
   * @param pages - An array of PDF page objects.
   * @param pageNumber - The page number (0-based index) to extract text from.
   * @returns An array of text lines from the specified page.
   */
  static extractTextFromPage(pages: PdfPage[], pageNumber: number): string[] {
    if (pageNumber < 0 || pageNumber >= pages.length) {
      throw new RangeError(
        `Page ${pageNumber} is out of bounds (0…${pages.length - 1})`,
      );
    }
    return pages[pageNumber].lines
      .map((line) => line.trim()) // drop leading/trailing whitespace
      .filter((line) => line.length > 0); // remove blank or “   ” lines
  }

  /**
   * Splits lines of text into paragraphs by merging lines that start with a lowercase letter or digit
   * into the previous line.
   *
   * @param pages - An array of PDF page objects.
   * @param pageNumber - The zero‑based index of the page to extract paragraphs from.
   * @returns An array of paragraph strings assembled from contiguous lines.
   */
  static extractParagraphsFromPage(
    pages: PdfPage[],
    pageNumber: number,
  ): string[] {
    const lines = this.extractTextFromPage(pages, pageNumber);
    const paras: string[] = [];
    let buf = lines[0] || "";

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (/^[a-z0-9]/.test(line)) {
        buf += " " + line; // continuation of same paragraph
      } else {
        paras.push(buf);
        buf = line;
      }
    }
    paras.push(buf);
    return paras;
  }

  /**
   * Extracts all unique HTTP/HTTPS links from the text of a given PDF page.
   *
   * @param pages - An array of PDF page objects.
   * @param pageNumber - The zero‑based index of the page to scan for URLs.
   * @returns A deduplicated array of URL strings found on the page.
   */
  static extractLinksFromPage(pages: PdfPage[], pageNumber: number): string[] {
    const text = this.extractTextFromPage(pages, pageNumber).join(" ");
    const urlRegex = /\bhttps?:\/\/[^\s)]+/g;
    return Array.from(new Set(text.match(urlRegex) || []));
  }

  /**
   * Concatenates the text of all pages into a single string, inserting
   * a “--- Page Break ---” marker between pages.
   *
   * @param pages - An array of PDF page objects.
   * @returns A string containing the full document text with page‑break markers.
   */
  static extractAllText(pages: PdfPage[]): string {
    return pages
      .map((_, i) => this.extractTextFromPage(pages, i).join("\n"))
      .join("\n\n--- Page Break ---\n\n");
  }

  /**
   * Searches all pages for a given keyword (case‑insensitive) and returns
   * the list of page indices where it appears.
   *
   * @param pages - An array of PDF page objects.
   * @param keyword - The keyword or phrase to search for.
   * @returns An array of zero‑based page indices containing the keyword.
   */
  static findPagesWithKeyword(pages: PdfPage[], keyword: string): number[] {
    const re = new RegExp(keyword, "i");
    return pages
      .map((p, i) => (p.lines.some((line) => re.test(line)) ? i : -1))
      .filter((i) => i >= 0);
  }
}
