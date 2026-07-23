# MIRROR-ADR-001 — Technology Stack Decision

**Status:** Approved for MVP foundation  
**Product:** MirrorAI  
**References:** MIRROR-CONST-001, MIRROR-PRD-001, MIRROR-RISK-001, MIRROR-ARCH-001, MIRROR-AUDIT-001

## Decision

Adopt a **TypeScript-first Modular Monolith Monorepo** for MirrorAI MVP v0.1.

## Stack direction

- Language: TypeScript.
- Frontend: React + TypeScript + Vite.
- Backend: Node.js + TypeScript.
- API style: REST.
- Repository: GitHub monorepo.
- Package manager: pnpm proposed.
- Backend framework: Fastify proposed, subject to focused implementation validation.
- Validation: Zod proposed.
- Risk Engine: independent TypeScript package.
- AI layer: provider-agnostic AI Gateway.
- Initial AI provider: not permanently selected by this ADR.
- Knowledge: structured and version-controlled first.
- Database: deferred until a demonstrated requirement exists.
- Unit/risk testing: Vitest proposed.
- E2E: Playwright when stable flows justify it.
- CI/CD: GitHub Actions.
- Deployment provider: deferred to a later decision.

## Rationale

The prototype already uses React and TypeScript. MVP risk analysis primarily requires rules, structured data, API integration, schema validation, contextual AI analysis, and risk aggregation. A second primary language would add operational complexity without a demonstrated current need.

Using TypeScript end-to-end simplifies shared contracts, repository organization, maintenance, and Codex execution.

## Python decision

Python is not required for MVP v0.1.

It may be introduced later for a proven need such as custom ML, specialized NLP, model training, advanced data science, local models, or offline evaluation.

The architecture must not prevent adding a Python service later, but speculative Python infrastructure should not be built now.

## Monorepo target

```text
apps/web
apps/api
packages/risk-engine
packages/ai-gateway
packages/knowledge
packages/shared
docs
tests/risk-cases
```

## Backend framework

Node.js + TypeScript is approved. Fastify is the leading proposed framework because of its lightweight and schema-oriented design. Final adoption may be recorded in a focused follow-up ADR if implementation evaluation reveals a meaningful tradeoff.

## AI provider decision

The experimental Gemini provider used in the prototype does not bind the product to Gemini. Provider selection for MVP should consider Arabic quality, structured outputs, latency, cost, privacy, and reliability.

All provider-specific code must remain behind the AI Gateway adapter boundary.

## Database decision

No database by default for the initial analysis core. Add persistence only for a demonstrated requirement such as approved feedback storage or justified metadata.

Original user input is not persistently stored by default.

## Consequences

Benefits:

- Reuse of prototype technology.
- One primary language for MVP.
- Easier shared schemas/types.
- Lower operational complexity.
- Clear Codex working environment.
- Provider-independent AI integration.
- Future option to extract proven reusable components into NestHiveCore.

Risk:

TypeScript may become less suitable for future specialized ML/research workloads. This is mitigated by maintaining clean architectural boundaries and adding Python only when justified.

## Final decision

> **APPROVED — TypeScript-First Architecture for MirrorAI MVP v0.1.**

Revisit this decision only through a new or superseding ADR when a documented technical requirement warrants it.

**MirrorAI — A NestHive Product**