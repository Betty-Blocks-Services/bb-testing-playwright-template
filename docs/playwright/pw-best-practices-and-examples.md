# Playwright - Best Practices & Examples

There are various ways to setup your test project so we've collected some of the Best Practices.

## Directory structure

Create a separate directory for each role:

```text
# Example
├── src/
│   ├── admin/
│   │     ├── setup/
│   │     ├── tests/
│   ├── user/
│   │     ├── setup/
│   │     ├── tests/
```

---

## Creating Setup Scripts

**Example**:

- `auth.setup.admin.ts`
- `auth.setup.user.ts`

`playwright.config.ts`

We define each role's setup and project in `playwright.config.ts`:

```TypeScript
// playwright.config.ts
export default defineConfig({
    // Other config settings...
    projects: [
    {
      name: "admin-login",
      testMatch: "admin-login.spec.ts",
      testDir: "src/admin/setup",
      metadata: { type: "setup" },
      dependencies: [],
    },
    {
      name: "admin",
      dependencies: [
        "admin-login"
      ],
      testDir: "src/admin/tests",
      metadata: { type: "suite" },
    },
]
```

---

## Setup Order/Chain

Sometimes you might need to execute one setup after the other.

> **Example**
> An user with the role `admin` requires to login to the device to unlock it before a `user` can login.

Defining each setup in the dependencies array will not work and should generally be avoided because:

- Playwright executes dependencies **alphabetically**
- It makes your setup harder to debug

```TypeScript
// playwright.config.ts

// These dependencies will run parallel
{
  name: "myName",
  use: { ...devices["Desktop Chrome"] },
  dependencies: ["setup auth admin", "setup auth user"],
},
```

`playwright.config.ts`:

```TypeScript
// playwright.config.ts

// This setup ensures that when running our 'user'-suite, we:
// 1. First login as admin with 'admin-login'
// 2. Then login as user with 'user-login'
// 3. Then run the suite itself
export default defineConfig({
    // ....
    projects: [
    // First define our suites:
    {
      name: "admin",
      dependencies: [
        "admin-login"
      ],
      testDir: "src/admin/tests",
      metadata: { type: "suite" },
    },
    {
      name: "user",
      dependencies: [
        // This suite needs 'user-login' to run
        "user-login"
      ],
      testDir: "src/user/tests",
      metadata: { type: "suite" },
    },
    // Setup:
    {
      name: "user-login",
      testMatch: "user-login.spec.ts",
      testDir: "src/user/setup",
      metadata: { type: "setup" },
      dependencies: [
      // Here we define that 'admin-login' needs to run before 'user-login'
      "admin-login"
      ],
    },
    {
      name: "admin-login",
      testMatch: "admin-login.spec.ts",
      testDir: "src/admin/setup",
      metadata: { type: "setup" },
      dependencies: [],
    },
]
```

---

## Reading from `localStorage`

```TypeScript
const language = await page.evaluate((localStorageKey) =>
  localStorage.getItem(localStorageKey),
  "keyOfItem",
)
```

---

## Writing to `localStorage`

```TypeScript
// We basically define a script to execute when the page is intialized
await page.addInitScript(
  // When the page has loaded, execute ... with variables ...
  ([key, deviceToken]) => {
    window.localStorage.setItem(key, deviceToken);
  },
  ["keyOfItem", deviceToken], // Variables to use in the script
);

// You can also use page.context() to execute this script on all pages.
await page.context().addInitScript(
  ([myVariables]) => {
    // ... Do something
  },
  ["someValue"], );
```
