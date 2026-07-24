# MirrorAI

**MirrorAI — رفيقك للوعي الرقمي**

MirrorAI is a NestHive product focused on helping people understand potential digital-risk signals before making decisions online.

> **See clearly. Decide consciously.**

## Current stage

MirrorAI is currently moving from an experimental prototype to **MVP v0.1**.

The MVP focuses on one core flow:

`Input → Analysis → Signals → Risk Assessment → Explanation → Recommended Actions → Human Decision`

The first release is **Arabic-first** and prioritizes understandable, explainable digital-risk analysis for text and, progressively, URLs.

## Core principles

- The user remains the final decision-maker.
- Evidence comes before scoring.
- No warning without explanation.
- Risk and confidence are separate concepts.
- AI is a component of MirrorAI, not the identity of the product.
- Privacy and data minimization are architectural requirements.
- The frontend must never expose AI-provider secrets.
- The Risk Engine must remain independent from UI, HTTP frameworks, and provider-specific SDKs.

## MVP architecture

MirrorAI follows a **TypeScript-first Modular Monolith Monorepo** approach.

Target structure:

```text
mirrorai/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   ├── risk-engine/
│   ├── ai-gateway/
│   ├── knowledge/
│   └── shared/
├── docs/
├── tests/
├── AGENTS.md
├── README.md
└── CONTRIBUTING.md
```

Planned technical direction:

- Frontend: React + TypeScript + Vite
- Backend: Node.js + TypeScript
- API: REST
- Validation: Zod
- Risk Engine: independent TypeScript package
- AI integration: provider-agnostic AI Gateway
- Knowledge: structured and version-controlled first
- Database: deferred until an MVP requirement demonstrates the need
- Testing: Vitest, risk regression tests, and later Playwright for stable E2E flows
- CI/CD: GitHub Actions

## Governance hierarchy

Engineering decisions follow this order:

1. `MIRROR-CONST-001` — MirrorAI Constitution
2. `MIRROR-PRD-001` — Product Requirements Document
3. `MIRROR-RISK-001` — Risk Engine Specification
4. `MIRROR-ARCH-001` — Technical Architecture
5. `MIRROR-AUDIT-001` — Prototype Audit
6. `MIRROR-ADR-001` — Technology Stack Decision
7. GitHub Issues
8. Implementation and tests
9. Human review
10. Release

## Development workflow

`Issue → Branch → Implementation → Tests → Pull Request → Human Review → Merge`

AI coding agents, including Codex, must follow the repository-level instructions in `AGENTS.md` and the acceptance criteria of the assigned GitHub Issue.

## MVP scope

### P0

- Text analysis
- Risk signals
- Risk categories and level
- Explainable risk assessment
- Recommended precautionary actions
- Uncertainty and limitations
- Arabic RTL experience
- Secure backend-controlled AI integration

### Deferred

- Persistent analysis history
- Full user accounts
- Native mobile applications
- General image editing
- Enterprise platform
- Public commercial API
- Complex vector infrastructure
- Autonomous multi-agent architecture

## Product ownership

MirrorAI is developed as a product of **NestHive**.

The project is currently under active foundation and MVP development.

## Repository foundation

MIRROR-001 establishes the initial monorepo boundaries and starter tooling for:

- `apps/web` — React + TypeScript + Vite shell with Arabic RTL defaults.
- `apps/api` — Node.js + TypeScript API foundation with `GET /api/v1/health` and a placeholder `POST /api/v1/analysis` boundary.
- `packages/shared` — shared schemas and contracts.
- `packages/risk-engine` — independent deterministic starter utilities only.
- `packages/ai-gateway` — provider-agnostic AI boundary without a configured provider.
- `packages/knowledge` — structured, version-controlled starter definitions.
- `tests/risk-cases` — synthetic regression fixture and foundational tests.

## Getting started

This repository is configured as a workspace monorepo.

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

## Development Environment

- Node.js: validated locally with `v24.13.0`
- Package manager: `npm` is the current effective package manager

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

The unified development command starts both services:

- Web: `http://localhost:5173`
- API: `http://localhost:3001/api/v1/health`

## Production deployment

### Web (Vercel)

- Deploy from `apps/web` as the Vercel root directory.
- Build command: `npm run build`.
- Output directory: `dist`.
- Set `VITE_API_BASE_URL` to the public API origin, for example `https://mirrorai-api.up.railway.app`.
- Security headers are defined in `apps/web/vercel.json`.

### API (Railway)

- Deploy from `apps/api` as the Railway service root.
- Config as code is provided in `apps/api/railway.toml`.
- Required runtime environment variables are documented in `.env.example`.
- Health check path: `/api/v1/health`.

### Required environment variables

See `.env.example` for the complete list.

Key variables:

- `PORT`
- `HOST`
- `NODE_ENV`
- `LOG_LEVEL`
- `CORS_ORIGIN`
- `RATE_LIMIT_MAX`
- `RATE_LIMIT_TIME_WINDOW_MS`
- `TRUST_PROXY`
- `VITE_API_BASE_URL`
