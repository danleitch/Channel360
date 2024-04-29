import { createHmac } from "node:crypto";

/**
 * Calculates the secret hash for a given user.
 * @param {Credentials} credentials
 * @param {string} username
 */
export const calculateSecretHash = (
  credentials: Credentials,
  username: string
): string => {
  const { clientId, clientSecret } = credentials;

  const hmac = createHmac("sha256", clientSecret);

  hmac.update(username + clientId);

  return hmac.digest("base64");
};

/**
 * Credentials
 *  - clientId: string
 *  - clientSecret: string
 */
interface Credentials {
  clientId: string;
  clientSecret: string;
}
