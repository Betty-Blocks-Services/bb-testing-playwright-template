# Config Usage

The `Config` class (in `src/utils/config/index.ts`) extends `ConfigBase` and manages a `config.json` file in your project root.

> ⚠️ **Important:** The generated `config.json` may contain sensitive data—add it to your `.gitignore` to keep secrets out of version control.

---

## Importing the Config

```TypeScript
import { config } from "../utils";
```

This gives you a single shared `Config` instance for reading and writing settings.

---

## Defining Your Config Schema

Edit the `IConfig` interface to describe the keys you need:

```TypeScript
export interface IConfig {
  someValueFromConfig: string;
  // add other fields as needed
}
```

---

## Setting Default Values

Adjust the `DEFAULT_CONFIG` constant in `src/utils/config/index.ts`:

```TypeScript
export const DEFAULT_CONFIG: IConfig = {
  someValueFromConfig: "defaultValue",
  // defaults for any new keys
};
```

On first run, if `config.json` does not exist, `ConfigBase` writes this object to disk.

---

## Accessing Config Values

Define a getter in your `Config` subclass for each key:

```TypeScript
export class Config extends ConfigBase {
  get someValueFromConfig(): string {
    return this.config?.someValueFromConfig;
  }
}
```

Then read values cleanly:

```TypeScript
const value = config.someValueFromConfig;
```

Avoid reaching into `config.config` directly.

---

## Updating Config Values

Use `updateConfig()` to merge new settings and save:

```TypeScript
config.updateConfig({
  someValueFromConfig: "newValue",
});
```

- You only need to supply the keys you want to change.
- `updateConfig` merges, then calls `saveConfig` internally.

---

## Custom Config Files

If you need multiple config files, instantiate additional instances with custom paths:

```TypeScript
export const defaultConfig = new Config();
export const customConfig = new Config("custom-config.json");
```

Each instance reads/writes its own JSON file at the given path.
