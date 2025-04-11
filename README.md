# bb-playwright-testing-template

A minimal, ready-to-use Playwright testing setup for easy cloning and use by the team.

## Getting Started

```bash
npm install
```

## Creating Tests

### Setup Files

A setup file can be run as a dependency for your tests.

> **Example**
> If your app is secured with an authentication profile, the tester needs to be logged in before it can execute tasks in the application.
> Instead of recording the login process each time, you can create a `auth.setup.ts` in which you define the login process.

You can declare a setup as dependency per test in `playwright.config.ts`.

Check this [`auth.setup.ts` example](./samples/auth.setup.ts)

Read more: [Playwright - Global setup and teardown](https://playwright.dev/docs/test-global-setup-teardown)

## Running Tests

> [!NOTE]
> If you wish to test on a sandbox, enable `Public testing` in your sandbox configurations

You can run your tests via the terminal:

```bash
# This will open the Playwright Testing App
npx playwright test --ui
```

Or with the VSCode Playwright extension.

## 🔧 Test Utilities & PDF Helpers

This project provides a set of helper utilities written in **TypeScript** to streamline common testing and PDF-processing tasks. It includes helpers for:

- 📄 Extracting and reading PDF files (`PdfHelper`)
- 🔐 Working with JWTs and auth files (`AuthHelper`)

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

### 🗄️ Director

The `Director()` class provides functions functions for managing (downloaded) files.

```TypeScript
import { Director } from "../utils/index"

test("downloading file", async () => {
  // logic to download a file
  // E.g.: Click a button

  const pathToFile = await Director.waitForDownload(page);
})
```

### 🔐 AuthHelper

The `AuthHelper()` class provides functions for authenticating with your application.

An example usage can be found in [`auth.setup.ts`](./samples/auth.setup.ts)

```ts
import { AuthHelper } from "../utils/index";

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
```

---

## ⚙️ TypeScript Support (But You Can Still Write JavaScript!)

This project is written in **TypeScript (.ts)** to take advantage of static typing and modern tooling.

However, **you can still use plain JavaScript** if you prefer!

---
