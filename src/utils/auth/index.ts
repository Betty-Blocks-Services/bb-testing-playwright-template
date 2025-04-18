import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

/**
 * Utility class for handling authentication-related operations
 * such as managing JWT tokens and ensuring storage file integrity.
 */
export class AuthHelper {
  /**
   * Checks whether a given JWT token is expired.
   *
   * @param jwt - The JWT string to check.
   * @returns `true` if the token is expired or invalid, otherwise `false`.
   */
  static isJwtExpired(jwt?: string | null): boolean {
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

    console.log(`Token is ${isExpired ? "" : "not"} expired`);

    return isExpired;
  }
}
