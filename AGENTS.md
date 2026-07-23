# AGENTS.md — MirrorAI Engineering Instructions

This file defines repository-level instructions for Codex and other AI coding agents working on MirrorAI.

## 1. Project purpose

MirrorAI is an Arabic-first digital-awareness and digital-risk product developed by NestHive.

The MVP helps a user submit suspicious digital content and receive an explainable assessment containing signals, risk categories, risk level, confidence, limitations, and precautionary actions.

MirrorAI assists human judgment. It does not claim absolute certainty and does not make the final decision for the user.

## 2. Governing documents

Before making architectural or product-level changes, follow this hierarchy:

1. `MIRROR-CONST-001` — MirrorAI Constitution
2. `MIRROR-PRD-001` — Product Requirements Document
3. `MIRROR-RISK-001` — Risk Engine Specification
4. `MIRROR-ARCH-001` — Technical Architecture
5. `MIRROR-AUDIT-001` — Prototype Audit
6. `MIRROR-ADR-001` — Technology Stack Decision
7. The assigned GitHub Issue and its acceptance criteria

If an implementation request conflicts with a higher-level governing document, stop and report the conflict rather than silently overriding the architecture.

## 3. Current architecture

The MVP uses a TypeScript-first Modular Monolith Monorepo approach.

Target boundaries:

- `apps/web` — React + TypeScript + Vite user interface.
- `apps/api` — Node.js + TypeScript backend API.
- `packages/risk-engine` — provider-independent risk logic.
- `packages/ai-gateway` — AI provider abstraction and adapters.
- `packages/knowledge` — structured, version-controlled knowledge.
- `packages/shared` — genuinely shared types and utilities only.
- `docs` — product, architecture, risk, audit, and ADR documentation.
- `tests/risk-cases` — synthetic risk regression cases.

Do not introduce microservices, Kubernetes, event buses, autonomous multi-agent systems, vector databases, or a persistent database unless an approved issue or ADR explicitly requires them.

## 4. Core product invariants

These rules must not be violated:

- No score without supporting signals.
- No warning without an explanation.
- No claim of certainty without sufficient evidence.
- Risk level and confidence are separate concepts.
- `isSafe: true/false` must not be the primary product decision model.
- AI output is not automatically trusted or treated as a source of truth.
- The user remains the final decision-maker.
- Results must expose meaningful limitations when verification is incomplete.

## 5. AI integration rules

- Never call an AI provider directly from the browser analysis flow.
- Never expose provider API keys or secrets in frontend code or bundles.
- Route AI requests through the backend and AI Gateway.
- Risk Engine code must not import provider-specific SDKs.
- Provider-specific logic belongs in adapters behind a stable provider interface.
- Require structured AI output and validate it before use.
- Reject, retry within defined limits, or safely degrade when AI output fails schema validation.
- Do not hard-code the product identity to Gemini or any other provider.

## 6. Risk Engine rules

The Risk Engine must remain independent from React, HTTP frameworks, databases, and AI-provider SDKs.

Prefer deterministic and testable functions for:

- signal definitions;
- rule evaluation;
- evidence mapping;
- risk classification;
- score aggregation;
- confidence evaluation;
- safety validation.

AI may assist with contextual understanding but must not replace the entire risk pipeline.

All important risk methodology changes must be versionable and regression-testable.

## 7. Privacy and security

- Follow data minimization by default.
- Do not log full user-submitted content by default.
- Never log passwords, OTPs, credentials, financial secrets, API keys, or tokens.
- Never commit `.env` files containing secrets.
- Provide `.env.example` using placeholders only when configuration documentation is needed.
- Request no camera, microphone, or device permission unless an approved feature explicitly requires it.
- Do not add persistent storage of original user input without an approved privacy/data-retention decision.
- Apply least privilege to services and integrations.

If a change could expose sensitive data, stop and document the risk before proceeding.

## 8. Frontend rules

- Preserve Arabic-first and RTL support.
- Keep the Shield analysis experience as the P0 product flow.
- Mirror Mode is a retained product concept but is not P0 unless an issue explicitly promotes it.
- General-purpose image editing is outside the MVP scope.
- Prefer feature-based components over a single oversized application component.
- The UI must display risk explanations and limitations alongside scores or levels.
- Technical backend errors must be translated into understandable user-facing states.

## 9. Backend rules

- Use Node.js + TypeScript for the MVP backend unless superseded by an approved ADR.
- Keep HTTP/controller concerns thin.
- Put orchestration in an application/service layer rather than controllers.
- Validate all external inputs.
- Validate all structured AI outputs.
- Use explicit error categories instead of leaking raw provider errors to the client.
- Add rate limits, input limits, and timeouts when implementing public analysis endpoints.

## 10. Knowledge rules

Start with structured, version-controlled knowledge.

Knowledge may include:

- signal definitions;
- risk-category definitions;
- approved explanation templates;
- precautionary action definitions;
- source metadata when applicable.

Do not introduce semantic retrieval or a vector database until a demonstrated requirement justifies it.

AI-generated content must not automatically become approved MirrorAI knowledge.

## 11. Testing requirements

Every implementation issue must add or update tests appropriate to the change.

Priorities:

1. Unit tests for deterministic Risk Engine logic.
2. Schema and contract tests for structured outputs.
3. Integration tests for the analysis pipeline and API boundaries.
4. Risk regression tests using synthetic test cases.
5. E2E tests for stable user flows when appropriate.

Risk test cases must not contain real personal data.

For risk methodology changes, check both false-positive and false-negative behavior where relevant.

## 12. Coding rules

- Use TypeScript strictness; avoid unnecessary `any`.
- Prefer small, explicit modules with clear ownership.
- Do not duplicate shared domain types across packages when a stable shared contract is appropriate.
- Avoid premature abstraction.
- Do not add a dependency when a small native solution is clearer and maintainable.
- Remove unused dependencies introduced by prototype experiments when encountered in the scoped work.
- Keep comments focused on why, not restating obvious code.

## 13. Scope discipline

Implement only the assigned issue and the minimum supporting changes needed to satisfy its acceptance criteria.

Do not opportunistically redesign unrelated modules.

When discovering unrelated work:

- document it;
- propose a follow-up issue;
- do not silently expand scope.

## 14. Git workflow

Expected workflow:

`Issue → Branch → Implementation → Tests → Pull Request → Human Review → Merge`

For each task:

1. Read the issue completely.
2. Identify relevant governing documents.
3. Inspect existing code before editing.
4. Make the smallest coherent change.
5. Run relevant tests, lint, type checks, and builds.
6. Summarize what changed and any remaining limitations.
7. Open or prepare a pull request for human review.

Do not push unreviewed implementation directly to production workflows.

## 15. Definition of done

A task is complete only when:

- acceptance criteria are satisfied;
- relevant tests pass;
- type checking passes;
- lint/build checks relevant to the changed area pass;
- no secret is committed;
- architecture boundaries remain intact;
- user-facing behavior remains understandable in Arabic/RTL where applicable;
- documentation is updated when behavior or architecture changes;
- known limitations are stated rather than hidden.

## 16. Stop conditions

Stop and request human review when:

- requirements conflict with the Constitution or PRD;
- a change requires storing sensitive user content;
- a new permanent external provider is being selected;
- a change materially alters risk-scoring methodology;
- a security or privacy issue is discovered;
- the requested scope requires a new architectural pattern not covered by existing ADRs;
- acceptance criteria cannot be met without broadening the issue substantially.

## 17. Guiding principle

**Build for MirrorAI. Extract for NestHiveCore only when a component has proven reusable value.**

Do not delay the MirrorAI MVP to build a speculative shared platform.

---

MirrorAI engineering principle:

> **No Score Without Signals. No Warning Without Explanation. No Certainty Without Evidence.**
