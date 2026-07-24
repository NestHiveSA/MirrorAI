# MIRROR-PROD-READINESS-2026-07-24

## Overall architecture

MirrorAI remains a TypeScript monorepo with the intended modular boundaries:

- Web app: `apps/web` (Vite + React, static deploy target on Vercel).
- API: `apps/api` (Fastify service, deploy target on Railway).
- Risk logic: `packages/risk-engine`.
- Shared contracts: `packages/shared`.
- Structured knowledge: `packages/knowledge`.

Runtime flow remains unchanged:

`Web -> API Route -> AnalysisService -> Risk Engine -> Structured Response`

## Problems found

1. API had no production hardening (CORS, security headers, request throttling).
2. API logging was effectively disabled for operations.
3. Environment variable handling was implicit and not validated.
4. `.env.example` was missing and also ignored by `.gitignore`.
5. Vercel/Railway deployment config was missing.
6. API package declared an unused direct dependency on `@mirrorai/ai-gateway`.
7. Web build used development-only aliases that were broader than needed.
8. Error handling existed but had duplicate handling paths.

## Problems fixed

1. Added typed environment parsing for API runtime config:
   - `apps/api/src/config.ts`
2. Added complete example env file:
   - `.env.example`
3. Fixed `.gitignore` so `.env.example` is tracked.
4. Added production runtime script for API:
   - `apps/api/package.json` -> `start`
5. Added production deploy config files:
   - `apps/web/vercel.json`
   - `apps/api/railway.toml`
6. Added production hardening in API server:
   - CORS allowlist from env (`CORS_ORIGIN`)
   - Security headers via Helmet + explicit `Permissions-Policy`
   - Request throttling on `/api/v1/analysis` with `429 RATE_LIMITED`
7. Standardized API error handling through centralized error handler.
8. Enabled configurable API logging level (`LOG_LEVEL`) and structured error logging.
9. Removed unused API dependency:
   - removed `@mirrorai/ai-gateway` from `apps/api/package.json`
10. Reduced web alias surface to only what is needed for current runtime.

## Remaining issues

1. No CI workflow files are present in `.github/workflows` yet.
2. No automated dependency vulnerability gating in CI (e.g., npm audit in pipeline).
3. No API integration smoke job for deployed environments.
4. No centralized log shipping configuration (current logging is stdout JSON only).
5. No authn/authz layer (acceptable for current MVP scope, but not for public production API).

## Deployment blockers

Blocking for public production release:

1. Missing CI/CD pipelines for mandatory checks and deployment promotion.
2. Missing environment separation policy (explicit staging/prod branch strategy and protected deployment gates).
3. Missing domain/TLS/certificate ownership runbook and incident rollback procedure.

Not blocking for internal staging deployment:

- Current build, validation, and runtime hardening are sufficient for controlled staging/demo.

## Security recommendations

1. Keep API private initially and front it with platform-level WAF/rules before broad exposure.
2. Restrict `CORS_ORIGIN` to exact deployed web origin(s), no wildcards.
3. Keep `TRUST_PROXY=true` only when behind trusted platform proxy; default remains false.
4. Add request body size limits and possibly stricter per-IP/per-origin throttling policies.
5. Add deployment-time secret scanning and dependency scanning in CI.
6. Add incident response playbook for abnormal `RATE_LIMITED` or `RISK_ENGINE_ERROR` spikes.

## Environment variables required

From `.env.example`:

- `NODE_ENV` (`development|test|production`)
- `PORT`
- `HOST`
- `LOG_LEVEL`
- `CORS_ORIGIN` (comma-separated allowlist)
- `RATE_LIMIT_MAX`
- `RATE_LIMIT_TIME_WINDOW_MS`
- `TRUST_PROXY`
- `VITE_API_BASE_URL`

## Deployment checklist

1. Set Vercel project root to `apps/web`.
2. Set Railway service root to `apps/api`.
3. Configure all environment variables from `.env.example`.
4. Set `CORS_ORIGIN` to the exact Vercel production URL.
5. Set `VITE_API_BASE_URL` to the Railway public URL.
6. Run `npm ci` at repository root.
7. Run `npm run lint`.
8. Run `npm run typecheck`.
9. Run `npm run test`.
10. Run `npm run build`.
11. Verify API health endpoint `/api/v1/health`.
12. Verify `/api/v1/analysis` returns 200 for valid payloads and 429 on sustained burst.
13. Verify web app can render analysis response from deployed API.
14. Enable platform logs/metrics alerts.

## Recommended GitHub repository structure

```text
mirrorai/
  .github/
    workflows/
      ci.yml
      deploy-web-vercel.yml
      deploy-api-railway.yml
  apps/
    web/
      vercel.json
    api/
      railway.toml
  packages/
    shared/
    risk-engine/
    knowledge/
    ai-gateway/
  docs/
    architecture/
    audit/
    decisions/
    risk/
  tests/
    risk-cases/
  .env.example
  package.json
  package-lock.json
```

## Validation evidence (current run)

- `npm ci` completed successfully.
- `npm run lint` completed successfully.
- `npm run build` completed successfully.
- API runtime headers verified:
  - `Access-Control-Allow-Origin` set for allowed origin.
  - `Permissions-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` present.
  - `X-RateLimit-*` headers present on analysis route.
- Rate limiting enforcement verified with low temporary threshold:
  - burst response sequence included `429` after threshold.

## Production readiness score

**78 / 100**

### Why not higher yet

- Core runtime hardening and environment/deployment scaffolding are now in place.
- Build/reproducibility checks pass from clean install.
- But full production maturity still needs CI/CD automation, release governance, and operational runbooks/alerts.

### Path to 90+

- Add required GitHub Actions pipelines and deployment protections.
- Add staging-to-production promotion checks.
- Add monitoring/alerting SLOs and incident/rollback procedures.
