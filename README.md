# RQMS Platform (v1)

This repo implements **Operations & Field Execution** (requirements sections 5, 6, 7) as the first module of a larger RQMS platform.

## Stack

- Backend: NestJS + TypeORM + Postgres
- Frontend: Next.js + RTK Query
- Auth: better-auth (runs in Next.js) + JWT/JWKS verification in Nest
- Attachments: MinIO (S3-compatible)
- Email: Brevo

## Quick start (dev)

1. Create a Postgres database and a MinIO bucket named `rqms-attachments`.
2. Copy `.env.example` to `.env` and fill values.
3. Create Better Auth tables (one-time):
   - `npx @better-auth/cli generate --output=./schema.sql`
   - Apply `schema.sql` to Postgres (use a separate schema if you want; see `BETTER_AUTH_DATABASE_URL`).
4. Install deps: `npm install`
5. Start dev servers: `npm run dev`

## OpenAPI + RTK Query codegen

1. Generate OpenAPI JSON: `npm run api:openapi`
2. Generate RTK Query hooks: `npm run web:codegen`

## Production API (PM2)

1. Build API:
   - `npm run build -w apps/api`
2. Set production DB and auth values in `ecosystem.config.cjs`:
   - `DATABASE_URL` (required)
   - `DATABASE_SSL` (`true` for managed/cloud Postgres, otherwise `false`)
   - `TYPEORM_SYNCHRONIZE=false`
3. Start or restart PM2:
   - `pm2 start ecosystem.config.cjs --only rqms-api`
   - `pm2 restart ecosystem.config.cjs --only rqms-api --update-env`
4. Persist PM2 process list:
   - `pm2 save`
5. Verify:
   - `pm2 describe rqms-api`
   - `pm2 logs rqms-api --lines 100`
