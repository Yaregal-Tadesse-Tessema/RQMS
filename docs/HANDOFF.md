# RQMS v1 (Operations & Field Execution) — Compact Handoff

Date: 2026-02-12

## What Exists Now

Monorepo in `D:\Projects\My\Transport`

- `apps/api`: NestJS + TypeORM + Postgres backend
  - Swagger: `http://localhost:4000/docs`
  - OpenAPI JSON: `http://localhost:4000/docs-json`
- `apps/web`: Next.js frontend
  - Web: `http://localhost:3000`
  - Landing: `/`
  - App shell + dashboard: `/app`
- `packages/*`: minimal “cross-cutting platform pieces” stubs for reuse later

Logs (when started via our PowerShell scripts):

- `temp/web-dev.out.log`, `temp/web-dev.err.log`
- `temp/api-dev.out.log`, `temp/api-dev.err.log`

## Auth / Security

- Better Auth lives in web:
  - `apps/web/src/app/api/auth/[...all]/route.ts`
  - `apps/web/src/lib/auth.ts`
- API auth: validates `Authorization: Bearer <jwt>` via JWKS (`AUTH_JWKS_URL`), then upserts into local `users` table keyed by JWT `sub`.
- UI: RTK Query baseQuery attaches bearer token via Better Auth `authClient.token()`.

## Features Implemented (Ops & Field Execution)

API + UI pages exist for:

- Projects (projects are generic: Road, Bridge, Drainage, etc.)
- Road/assets + sections/chainage
- Work items
- Daily progress (with QA gating)
- QA: checklist templates, inspections, rework close (minimal)
- Machinery + fuel request/approve/issue
- Safety inspections + incidents
- Environment records
- Grievances + actions
- Attachments: MinIO presigned PUT + link + GET

## Dashboard

API endpoints:

- `GET /dashboard/overview`
- `GET /dashboard/projects/:projectId?workDate=YYYY-MM-DD`

API module:

- `apps/api/src/modules/dashboard/dashboard.module.ts`
- `apps/api/src/modules/dashboard/dashboard.controller.ts`
- `apps/api/src/modules/dashboard/dashboard.service.ts`
- DTOs:
  - `apps/api/src/modules/dashboard/dto/dashboard-overview.dto.ts`
  - `apps/api/src/modules/dashboard/dto/project-dashboard.dto.ts`

Web dashboard page:

- `apps/web/src/app/app/page.tsx`

Landing page:

- `apps/web/src/app/page.tsx`
- `apps/web/src/app/globals.css`

## Codegen (Keep UI + API In Sync)

After any API change:

1. `npm run api:openapi` (writes `apps/api/openapi.json`)
2. `npm run web:codegen` (regenerates `apps/web/src/lib/api/generated.ts`)

## Known Issues / Debt

- Some UI text has mojibake (`Loadingâ€¦`, `Â·`) in a few files; not fully cleaned.
- OpenAPI typings are not yet “fully DTO-driven” everywhere, so generated RTK types may be `any/unknown` in places.
- Generated RTK file may have an absolute import path on Windows (works locally, not ideal).
- Brevo email wiring is minimal / not fully integrated into workflows yet.

## Next Steps (When You Resume)

1. Smoke test:
   - Web: `http://localhost:3000/` (landing)
   - Web: `http://localhost:3000/app` (dashboard)
   - API: `http://localhost:4000/docs`
2. Fix encoding/mojibake globally across UI.
3. Improve OpenAPI DTO annotations for stronger generated RTK types.
4. Fix generated RTK import to be relative (portability).

