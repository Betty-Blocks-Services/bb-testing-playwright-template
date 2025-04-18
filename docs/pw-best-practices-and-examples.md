# Playwright - Best Practices & Examples

There are various ways to setup your test project so we've collected some of the Best Practices.

## Directory structure

Create a separate directory for each role:

```text
# Example
├── src
│   ├── tests
│       ├── setup
│       ├── + admin
│       ├── + user
```

---

## Creating Setup Scripts

Create your setup files in `./src/tests/setup`:

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
    // Define setup:
    {
      name: "setup auth admin",
      testMatch: /auth\.setup\.admin\.ts/,
    },
    {
      name: "setup auth user",
      testMatch: /auth\.setup\.user\.ts/,
    }

    // Define projects
    {
      name: "admin",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup auth admin"],
    },
    {
      name: "user",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup auth user"],
    },
    // Other browsers...
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

// DON'T DO THIS
{
  name: "myName",
  use: { ...devices["Desktop Chrome"] },
  dependencies: ["setup auth admin", "setup auth user"],
},
```

`playwright.config.ts`:

```TypeScript
// playwright.config.ts
export default defineConfig({
    // ....
    projects: [
    // Setup files:
    {
      name: "setup auth admin",
      testMatch: /auth\.setup\.admin\.ts/,
    },
    {
      name: "setup auth user",
      testMatch: /auth\.setup\.user\.ts/,
      /*
      * We define 'setup auth admin' as a dependency for 'setup auth user'.
      */
      dependcies: ["setup auth admin"]
    }
    // Define test projects
    {
      name: "test-user",
      use: { ...devices["Desktop Chrome"] },
      /*
      * Then we define 'setup auth user' as a dependency to run for this project.
      */
      dependencies: ["setup auth user"],
    },
]
```
