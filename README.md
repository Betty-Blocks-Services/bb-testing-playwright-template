# bb-playwright-testing-template

A minimal, ready-to-use Playwright testing setup for easy cloning and use by the team.

## Getting Started

1. Install the dependencies

```bash
npm install
```

2. Open the Test tab, your tests should appear.

If your tests do not appear, use the 🔄 Refresh button:

![vscode_no_tests_found](./public/vscode_no_tests_found.jpg)

## Creating Tests

You can write tests in both `.ts` and `.js`.

### Setup Files

A setup file can be run as a dependency for your tests.

> **Example**
> If your app is secured with an authentication profile, the tester needs to be logged in before it can execute tasks in the application.
> Instead of recording the login process each time, you can create a `auth.setup.ts` in which you define the login process.

You can declare a setup as dependency for each project in `playwright.config.ts`.

Check this [`auth.setup.ts` example](./samples/auth.setup.ts) which runs a simple login task.

Read more: [Playwright - Global setup and teardown](https://playwright.dev/docs/test-global-setup-teardown)

## Running Tests

> [!NOTE]
> If you wish to test on a sandbox, enable `Public testing` in your sandbox configurations

You can run your tests via the terminal:

```bash
# This will open the Playwright Testing App
npm test
```

Or with the VSCode Playwright extension.

## 🔧 Test Utilities & PDF Helpers

This project provides a set of helper utilities written in **TypeScript** to streamline common testing and PDF-processing tasks. It includes helpers for:

- 📄 Extracting and reading PDF files (`PdfHelper`)
- 🔐 Working with JWTs and auth files (`AuthHelper`)

---

### Config

The `Config()` class provides functions to read and store config variables across tests.
This class extends `ConfigBase` which already makes sure to create/load the config.json.

This allows you to, for instance, chain setup files to fetch a `deviceToken` from the first setup and use it in the second setup.
You can read more about this at [What is a setup?]()

```TypeScript

import { config } from "../utils"

const deviceToken = config.deviceToken;
```

> [!IMPORTANT]
> To use the config, always import `config` and not the class `Config`.
> This is to ensure the config.json is properly loaded during testing.

#### Editing your config

Feel free to edit the config values for your tests in [`./src/utils/config/index.ts`](./src/utils/config/index.ts).

##### (Optional) Defining the `IConfig` interface

You can define the key/value types for your config by editing the `interface IConfig`:

```TypeScript
export interface IConfig {
  someValue: string; // Or any if you want to loosely check for types.
}
```

##### Default values:

You can define default values in your config by editing the `DEFAULT_CONFIG` variable:

```TypeScript
// Without type checking
const DEFUALT_CONFIG = {
  soemValue: String()
}

// With IConfig interface
const DEFAULT_CONFIG: IConfig = {
  someValue: String()
}
```

##### Reading values

To read values from your config, you need to create `get()` accessors in the `Config()` class:

```TypeScript
// DO
// Create a get function to fetch the value from the config.
get someValue() {
  return this.config.someValue
}
// Then use it:
const someValue = config.someValue;

// DON'T
const someValue = config.config.someValue;
```

By defining `get()` functions, you can parse or combine config values before they're used in the test.
On top of that, your code is clean and easily maintainable. Neat, right!?

##### Defining custom config files.

If you really need to have separate config files, you can instantiate add a new export at the bottom of [`./src/utils/config/index.ts`](./src/utils/config/index.ts).

```TypeScript
// Example
export const config = new Config();
export const myCustomConfig = new Config("config-name.json")
```

This will create a `config-name.json` with the same configuration but can store different values.

---

### 📄 PdfHelper

```ts
import { PdfHelper } from "../utils";

// Extract pages from a PDF
const pages = await PdfHelper.extractPagesFromPdf("myfile.pdf");

// Get pages after triggering a browser download
const pagesViaBrowser = await PdfHelper.fetchPdfPages(page, locator);

// Extract non-empty lines from page 1
const lines = PdfHelper.extractTextFromPage(pages, 0);
```

---

### 🗄️ Director

The `Director()` class provides functions for managing files and directories.

```TypeScript
import { Director } from "../utils"

test("downloading file", async () => {
  // logic to download a file
  // E.g.: Click a button

  const pathToFile = await Director.waitForDownload(page);
  const fileContent = Director.readFile(pathToFile, "utf-8")
})
```

### 🔐 AuthHelper

The `AuthHelper()` class provides functions for authenticating with your application.

An example usage can be found in [`auth.setup.ts`](./samples/auth.setup.ts)

```ts
import { AuthHelper } from "../utils";

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
