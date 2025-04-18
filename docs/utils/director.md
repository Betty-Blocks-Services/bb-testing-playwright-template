# Director

> Import and use Director to handle file system operations.

## Importing the Config Singleton

```TypeScript
import { Director } from "../utils";
```

---

## Wait for Download

```TypeScript
// Waits for Playwright's "download" event, saves to tmp/, returns the path
const downloadedPDF = await Director.waitForDownload(page);
```

---

## Write File

```TypeScript
// Writes `contents` to `filePath`, creates dirs if needed
await Director.writeFile("./tmp/output.txt", "Hello, world!", {
  encoding: "utf-8",
});
```

---

## Read File

```TypeScript
// Reads file or returns false if it doesn't exist
const data = Director.readFile("./tmp/output.txt");
if (data === false) {
  console.error("File not found");
} else {
  console.log(data);
}
```

---

## Make Directory

```TypeScript
// Creates a directory (recursive by default)
Director.makeDir("./tmp/new-folder", { recursive: true });
```

---

## Read Directory

```TypeScript
// Lists contents or returns false if dir missing
const files= Director.readDir("./tmp", { encoding: "utf-8" });
if (files === false) {
  console.error("Directory not found");
} else {
  console.log(files);
}
```

---

## Remove Directory

```TypeScript
// Deletes a directory if it exists; returns true on success
const removed = Director.removeDir("./tmp/new-folder", {
  recursive: true,
});

console.log(removed ? "Directory and contents removed" : "Nothing to remove");
```

---

## Path Exists

```TypeScript
// Checks file or folder existence
const exists = Director.pathExists("./tmp/output.txt");
console.log(exists ? "Found" : "Not found");
```
