# 📄 PdfHelper

The `PDFHelper()` class provides functions for downloading and extracting contents

## Importing the PdfHelper

```TypeScript
import { PdfHelper } from "../utils";
```

## using the PdfHelper

First, trigger the download and wait for the file:

```TypeScript
// 1. Trigger the download by clicking the Download button
await page.locator("button", { hasText: "Download" }).click();

// 2. Wait for the download and get the file path
const downloadedPDF = await Director.waitForDownload();

```

## Extract Pages from PDF

```TypeScript
// 3. Extract pages from the downloaded PDF
const pdfPages = await PdfHelper.extractPagesFromPdf(downloadedPDF);
```

---

## Extract Text Lines from a Page

```TypeScript
// 4. Extract non-empty lines of text from page 0
const lines = PdfHelper.extractTextFromPage(pdfPages, 0);
```

---

## Extract Paragraphs from a Page

```TypeScript
// 5. Extract paragraphs from page 0
const paragraphs = PdfHelper.extractParagraphsFromPage(pdfPages, 0);
```

---

## Extract Links from a Page

```TypeScript
// 6. Extract all unique HTTP/HTTPS links from page 0
const links = PdfHelper.extractLinksFromPage(pdfPages, 0);
```

---

## Extract Full Text

```TypeScript
// 7. Concatenate the full document text (with page-break markers)
const fullText = PdfHelper.extractAllText(pdfPages);
```

---

## Find Pages with a Keyword

```TypeScript
// 8. Find all pages containing a specific keyword
const pagesWithKeyword = PdfHelper.findPagesWithKeyword(pdfPages, "invoice");
```
