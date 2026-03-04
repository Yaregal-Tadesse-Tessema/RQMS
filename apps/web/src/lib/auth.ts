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

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:5000",
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
