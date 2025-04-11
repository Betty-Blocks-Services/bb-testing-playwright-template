import fs from "fs";

export class Director {
  static async createDir(dirPath: string, options: fs.MakeDirectoryOptions) {
    return fs.mkdirSync(dirPath, { recursive: true });
  }

  static async removeDir(dirPath: string) {
    if (fs.existsSync(dirPath)) {
      fs.rmdirSync(dirPath, { recursive: true });
      console.log(`All contents deleted from folder: ${dirPath}`);
    }
  }
}
