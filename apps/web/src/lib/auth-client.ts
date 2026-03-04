import { createAuthClient } from "better-auth/client";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // Use same-origin auth routes (/api/auth/*) to avoid cross-origin CORS issues.
  plugins: [jwtClient()]
});
