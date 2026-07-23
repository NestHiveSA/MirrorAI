# MIRROR-ARCH-001 — MirrorAI MVP v0.1 Technical Architecture

**Product:** MirrorAI  
**References:** MIRROR-CONST-001, MIRROR-PRD-001, MIRROR-RISK-001

## Architectural objective

Build a simple, secure, testable MVP architecture that supports future growth without premature infrastructure complexity.

## Principles

- Modular Monolith first.
- TypeScript-first MVP.
- Backend-controlled AI.
- Provider independence.
- Risk Engine independence.
- Privacy by design.
- Structured and validated AI output.
- Evidence before score.
- Build for MirrorAI first; extract to NestHiveCore only after proven reuse.

## High-level flow

`User → Web App → API → Analysis Orchestrator → Input Processor → Rules / AI / Knowledge → Risk Aggregator → Confidence → Explanation & Actions → Safety Validator → Structured Result`

Privacy, security, and observability are cross-cutting concerns.

## Repository target

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
│   └── risk-cases/
├── AGENTS.md
├── README.md
└── CONTRIBUTING.md
```

## Frontend

React + TypeScript + Vite. Preserve the useful Arabic RTL Shield experience from the prototype while reorganizing into feature-based components.

The frontend is responsible for input, loading/error states, and presenting structured results. It must not implement core risk logic or directly call AI providers.

## Backend API

Node.js + TypeScript. Initial REST endpoints:

- `POST /api/v1/analysis`
- future `POST /api/v1/feedback`
- `GET /api/v1/health`

The backend handles validation, orchestration, AI access, privacy controls, rate/input limits, errors, and structured responses.

## Analysis Orchestrator

Coordinates:

1. input normalization;
2. deterministic rules;
3. AI contextual analysis;
4. structured knowledge when relevant;
5. risk aggregation;
6. confidence evaluation;
7. explanation/actions;
8. safety validation.

Business rules should not be embedded in controllers.

## Risk Engine

Independent TypeScript package. It must not depend directly on React, HTTP frameworks, databases, or provider SDKs.

Logical components:

- InputProcessor
- SignalDetector
- RuleEngine
- EvidenceMapper
- RiskClassifier
- RiskAggregator
- ConfidenceEvaluator
- ExplanationBuilder
- ActionRecommender
- SafetyValidator

## AI Gateway

Architecture:

`Risk/Application Layer → AI Gateway → AIProvider Interface → Provider Adapter → External AI Service`

The MVP may use one provider, but provider-specific SDKs remain behind adapters.

## Prompt management

Important prompts must be centrally managed, identified, versioned, and associated with an expected structured schema.

## Validation

External input and AI structured output must be schema-validated. Invalid AI responses must not pass directly to the user.

## Knowledge Layer

Start with structured, version-controlled definitions for signals, risks, explanations, and actions. Do not introduce a vector database until a demonstrated requirement exists.

## Persistence

No database is required for the initial core analysis flow. Persistent storage may be introduced for feedback or justified metadata. Original user input is not stored by default.

## Privacy path

`User Input → HTTPS → Temporary Processing → Analysis → Result → Input Discarded`

Do not log sensitive content by default.

## Secrets

API keys and credentials belong in environment/secret management, never frontend bundles, source code, Git history, or AGENTS.md.

## Error categories

Examples:

- `INVALID_INPUT`
- `CONTENT_TOO_LARGE`
- `AI_PROVIDER_ERROR`
- `AI_TIMEOUT`
- `INVALID_AI_RESPONSE`
- `RISK_ENGINE_ERROR`
- `RATE_LIMITED`

Expose understandable user-facing errors, not raw provider details.

## Observability

Track request identifiers, latency, provider status, engine version, analysis success/failure, and schema validation failures without recording sensitive input by default.

## Testing

- Unit tests for rules and deterministic risk logic.
- Contract/schema tests for AI output.
- Integration tests for API and analysis pipeline.
- Synthetic risk regression tests.
- E2E tests for stable user flows when appropriate.

## Environments

- Development
- Staging
- Production

Risk methodology changes should not be tested first in production.

## CI/CD

Pull requests should run relevant install, lint, type-check, tests, risk regressions, and build checks.

## Prototype migration

`Prototype → Preserve useful UI → Remove direct AI coupling → Establish API → AI Gateway → Risk Engine → Connect UI → Tests → Staging validation`

Do not patch the prototype indefinitely and do not discard useful product experience. **Evolve, do not patch.**

## Explicitly deferred architecture

- Microservices.
- Kubernetes.
- Complex event buses.
- Multi-region infrastructure.
- Enterprise IAM.
- Full NestHiveCore.
- Large vector databases.
- Autonomous multi-agent risk systems.

## Initial decisions

- Modular Monolith.
- Monorepo.
- Logical separation of frontend/backend.
- No direct frontend AI access.
- Provider-agnostic AI Gateway.
- Structured AI output.
- Signal-based risk assessment.
- Minimal structured knowledge.
- No user accounts required for first release.
- Minimal retention of user input.
- GitHub as engineering source of truth.
- Codex executes scoped issues with human review.

## Definition of done for foundation

The foundation is ready when web/API boundaries, Risk Engine, AI Gateway, structured result validation, tests, Arabic RTL, error handling, staging readiness, and documented architecture decisions are in place.

**MirrorAI — A NestHive Product**