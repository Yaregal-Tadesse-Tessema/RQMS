import { createAuthClient } from "better-auth/client";
import { jwtClient } from "better-auth/client/plugins";

const defaultAuthBaseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:5000";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? defaultAuthBaseUrl,
  plugins: [jwtClient()]
});
