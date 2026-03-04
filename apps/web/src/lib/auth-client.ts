import { createAuthClient } from "better-auth/client";
import { jwtClient } from "better-auth/client/plugins";

const runtimeHost = typeof window !== "undefined" ? window.location.hostname : "localhost";
const defaultAuthBaseUrl = `http://${runtimeHost}:4000`;

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? defaultAuthBaseUrl,
  plugins: [jwtClient()]
});
