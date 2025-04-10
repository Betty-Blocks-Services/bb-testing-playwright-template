import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

/**
 * Utility class for handling authentication-related operations
 * such as managing JWT tokens and ensuring storage file integrity.
 */
export class AuthHelper {
  /**
   * Ensures the auth file and its directory exist. If the file does not exist,
   * it is created with default content.
   *
   * @param filePath - The path to the auth JSON file.
   */
  static async ensureAuthFileExists(filePath: string): Promise<void> {
    try {
      const dirPath = path.dirname(filePath);
      await mkdir(dirPath, { recursive: true });

      try {
        await readFile(filePath, "utf8");
      } catch (err: any) {
        if (err.code === "ENOENT") {
          const defaultContent = { origins: [] };
          await writeFile(
            filePath,
            JSON.stringify(defaultContent, null, 2),
            "utf8",
          );
          console.log(`Created file at ${filePath} with default content`);
        } else {
          throw err;
        }
      }
    } catch (err) {
      console.error("Error ensuring directory and file:", err);
      throw err;
    }
  }

  /**
   * Checks whether a given JWT token is expired.
   *
   * @param jwt - The JWT string to check.
   * @returns `true` if the token is expired or invalid, otherwise `false`.
   */
  static isJwtExpired(jwt: string | null): boolean {
    if (!jwt) {
      return true;
    }

    const jwtPayload = jwt.split(".")[1];
    const bufferObj = Buffer.from(jwtPayload, "base64");
    const payloadObj: {
      exp: number;
      user_id: string;
      roles: string[];
    } = JSON.parse(bufferObj.toString("utf8"));

    const expDate = new Date(0);
    expDate.setUTCSeconds(payloadObj.exp);

    const now = new Date();

    const isExpired = now > expDate;

    console.log(
      `Logging in as: ${payloadObj.user_id} with roles: ${payloadObj.roles}`,
    );

    if (isExpired) {
      console.log("Token expired, need to log in again..");
    } else {
      console.log("Session not expired, skipping login");
    }

    return isExpired;
  }

  /**
   * Retrieves a JWT token from a local auth file based on origin.
   *
   * @param filePath - Path to the local JSON file storing auth data.
   * @param origin - The origin key used to locate the stored token.
   * @returns The JWT token if found, otherwise `null`.
   */
  static async getJwtTokenFromJson(
    filePath: string,
    origin: string,
  ): Promise<string | null> {
    await this.ensureAuthFileExists(filePath);
    const data = await readFile(filePath, "utf8");
    const jsonData: {
      origins: {
        origin: string;
        localStorage: { name: string; value: string }[];
      }[];
    } = JSON.parse(data);

    const originStorage = jsonData.origins.find((e) => e.origin === origin);
    if (!originStorage) {
      return null;
    }

    const tokenEntry = originStorage.localStorage.find(
      (e) => e.name === "TOKEN",
    );
    return tokenEntry?.value ?? null;
  }
}
