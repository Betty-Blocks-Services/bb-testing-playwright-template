# bb-playwright-testing-template

A minimal, ready-to-use Playwright testing setup for easy cloning and use by the team.

## Getting Started

```bash
npm install
npx playwright test
```

## Run UI Mode

```bash
npx playwright test --ui
```

## 🔧 Test Utilities & PDF Helpers

This project provides a set of helper utilities written in **TypeScript** to streamline common testing and PDF-processing tasks. It includes helpers for:

- 🧪 Clicking and asserting in Playwright (`PlaywrightHelper`)
- 📄 Extracting and reading PDF files (`PdfHelper`)
- 🔐 Working with JWTs and auth files (`AuthHelper`)

---

### 🧪 PlaywrightHelper

```ts
import { PlaywrightHelper } from "./helpers/PlaywrightHelper";
import { test } from "@playwright/test";

test("Example click test", async ({ page }) => {
  const button = page.locator("text=Submit");

  await PlaywrightHelper.clickToExpect(page, button, {
    waitNetwork: true,
    submit: true,
    delay: 200,
  });
});
```

### Options

| Option        | Type      | Description                                   |
| ------------- | --------- | --------------------------------------------- |
| `waitNetwork` | `boolean` | Wait for `networkidle` before and after click |
| `hasHref`     | `boolean` | Expect an `href` attribute on the element     |
| `submit`      | `boolean` | Expect the element to have type `submit`      |
| `delay`       | `number`  | Delay (ms) before clicking                    |

---

### 📄 PdfHelper

```ts
import { PdfHelper } from "./helpers/PdfHelper";

// Extract pages from a PDF
const pages = await PdfHelper.extractPagesFromPdf("myfile.pdf");

// Get pages after triggering a browser download
const pagesViaBrowser = await PdfHelper.fetchPdfPages(page, locator);

// Extract non-empty lines from page 1
const lines = PdfHelper.extractTextFromPage(pages, 0);
```

---

### 🔐 AuthHelper

```ts
import { AuthHelper } from "./helpers/AuthHelper";

// Check if a token is expired
const expired = AuthHelper.isJwtExpired(myJwt);

// Get a JWT token from a JSON file based on origin
const token = await AuthHelper.getJwtTokenFromJson(
  "./auth.json",
  "https://myapp.com",
);
```

## 📁 File Structure

```text
├── src
│   ├── tests
│   └── utils
│       ├── auth
│       ├── pdf
│       └── playwright
```

---

## ⚙️ TypeScript Support (But You Can Still Write JavaScript!)

This project is written in **TypeScript (.ts)** to take advantage of static typing and modern tooling.

However, **you can still use plain JavaScript** if you prefer!

---
