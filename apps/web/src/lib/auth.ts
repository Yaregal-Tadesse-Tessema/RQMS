import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

const databaseUrl = process.env.BETTER_AUTH_DATABASE_URL ?? process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("BETTER_AUTH_DATABASE_URL (or DATABASE_URL) is required");
}

const secret = process.env.BETTER_AUTH_SECRET;
if (!secret || secret.length < 32) {
  throw new Error("BETTER_AUTH_SECRET is required (>= 32 chars recommended)");
}

const baseURL = process.env.AUTH_BASE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:5000";
const configuredTrustedOrigins = (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function dedupe(origins: (string | undefined | null)[]) {
  return Array.from(new Set(origins.filter((v): v is string => Boolean(v))));
}

export const auth = betterAuth({
  baseURL,
  trustedOrigins: async (request) => {
    if (!request) {
      return dedupe([baseURL, ...configuredTrustedOrigins]);
    }

    const requestUrl = new URL(request.url);
    const host = request.headers.get("host");
    const forwardedHost = request.headers.get("x-forwarded-host");
    const forwardedProto = request.headers.get("x-forwarded-proto") ?? requestUrl.protocol.replace(":", "");

    const requestOrigin = requestUrl.origin;
    const hostOrigin = host ? `${requestUrl.protocol}//${host}` : null;
    const forwardedOrigin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : null;

    return dedupe([baseURL, requestOrigin, hostOrigin, forwardedOrigin, ...configuredTrustedOrigins]);
  },
  secret,
  database: {
    db: new Kysely({
      dialect: new PostgresDialect({
        pool: new Pool({ connectionString: databaseUrl })
      })
    }),
    type: "postgres"
  },
  emailAndPassword: { enabled: true },
  plugins: [jwt()]
});
