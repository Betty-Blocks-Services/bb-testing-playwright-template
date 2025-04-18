# AuthHelper Usage

The `AuthHelper` class (in `src/utils/authHelper.ts`) provides utilities for handling JWT tokens, including expiration checks and ensuring token integrity.

---

## Importing AuthHelper

```TypeScript
import { AuthHelper } from "../utils";
```

---

## Checking JWT Expiration

```TypeScript
/**
 * Determines if a JWT is expired or invalid.
 *
 * @param jwt - The JWT string to check (may be `undefined` or `null`).
 * @returns `true` if the token is missing, malformed, or its `exp` claim is in the past; otherwise `false`.
 */
static isJwtExpired(jwt?: string | null): boolean
```

### How it works

1. **Presence check**: returns `true` if `jwt` is `undefined`, `null`, or an empty string.
2. **Payload extraction**: splits the token on `.` and Base64-decodes the middle segment.
3. **Expiration parsing**: reads the `exp` (expiration time) claim and converts it to a `Date`.
4. **Comparison**: compares against the current time.
5. **Logging**: prints the `user_id`, `roles`, and expiration status to the console.

### Example

```TypeScript
const token = await getTokenFromSomewhere();
if (AuthHelper.isJwtExpired(token)) {
  console.warn("JWT is expired or invalid, please authenticate again.");
  // redirect to login or refresh token
} else {
  console.log("JWT is still valid.");
}
```

---

## Notes & Best Practices

- Tokens with missing or corrupt payloads are treated as expired.
- Logging is built-in; remove or adjust `console.log` statements in production if necessary.
- Extend `AuthHelper` with additional methods (e.g., decoding other claims) as needed.
