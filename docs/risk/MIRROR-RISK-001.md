# MIRROR-RISK-001 — MirrorAI Risk Engine Specification

**Product:** MirrorAI  
**Component:** Risk Engine  
**References:** MIRROR-CONST-001, MIRROR-PRD-001

## Purpose

Define the functional and logical foundation of the MirrorAI Risk Engine.

## Core principle

> **Evidence Before Score.**

Pipeline:

`Input → Signals → Evidence → Risk Categories → Context → Risk Assessment → Confidence → Explanation → Actions → Safety Validation`

## Engine goals

- Detect digital-risk signals.
- Map signals to evidence and risk categories.
- Evaluate signal severity and combinations.
- Consider context and uncertainty.
- Produce explainable assessments.
- Recommend context-appropriate precautionary actions.
- Return a stable structured result.

## Initial input types

- `INPUT-TEXT`
- `INPUT-URL`
- `INPUT-MIXED`

Future: image, screenshot, document.

## Initial signal taxonomy

- SIG-001 Urgency
- SIG-002 Threat
- SIG-003 Sensitive Data Request
- SIG-004 Financial Request
- SIG-005 Unrealistic Reward
- SIG-006 Impersonation
- SIG-007 Suspicious Link
- SIG-008 Secrecy Request
- SIG-009 Authority Pressure
- SIG-010 Emotional Manipulation
- SIG-011 Unsolicited Contact
- SIG-012 Unusual Payment Method
- SIG-013 Credential Request
- SIG-014 Verification Code Request
- SIG-015 External Channel Migration
- SIG-016 Inconsistent Identity
- SIG-017 Suspicious Domain Pattern
- SIG-018 Too-Good-To-Be-True
- SIG-019 Fear Trigger
- SIG-020 Pressure to Bypass Verification

A signal is an indicator, not proof of malicious intent.

## Risk categories

- RISK-001 Phishing
- RISK-002 Scam
- RISK-003 Impersonation
- RISK-004 Social Engineering
- RISK-005 Manipulative Urgency
- RISK-006 Sensitive Data Exposure
- RISK-007 Financial Risk
- RISK-008 Suspicious Link
- RISK-009 Unrealistic Offer
- RISK-010 Emotional Manipulation

## Evidence model

Each detected signal should, where practical, include:

- signal identifier;
- severity;
- confidence;
- evidence or reason;
- source (`RULE`, `AI`, `KNOWLEDGE`, or `EXTERNAL`);
- explanation.

Avoid retaining or reproducing sensitive user content beyond what is necessary.

## Severity

Initial signal severity scale:

1. Informational
2. Low
3. Moderate
4. High
5. Critical

Signal severity is not the final risk score.

## Combination logic

The engine must support compound patterns. A single urgency signal may be weak, while urgency + impersonation + credential request + suspicious link may materially increase assessed risk.

Combination rules must be explicit, versionable, and testable.

## Context

Keyword matching alone is insufficient. The engine should distinguish, for example, a malicious request to share a verification code from educational text warning users never to share one.

AI may assist with contextual understanding, but deterministic rules and product logic remain independent.

## Hybrid model

Target model:

`Rules + AI Context Analysis + Structured Knowledge + Optional External Verification`

MirrorAI must not depend solely on an LLM or solely on rigid rules.

## Risk score

Proposed experimental range: `0–100`.

Conceptual inputs:

`Signal Evidence + Severity + Combinations + Context + Confidence Adjustments`

This is not yet a validated scientific formula. Score methodology must be versioned and regression-tested.

Initial experimental levels:

- 0–24 Low
- 25–49 Moderate
- 50–74 High
- 75–100 Critical

Thresholds remain subject to validation.

## Confidence

Confidence is separate from risk. High potential risk may coexist with low confidence when information is incomplete.

## Uncertainty and limitations

The engine must be able to state limitations such as:

- insufficient information;
- sender identity not verified;
- domain reputation not externally checked;
- link safety cannot be confirmed.

## Explanation structure

- What we noticed.
- Why it matters.
- What we cannot verify.
- What you can do.

## Recommended action levels

- `INFO`
- `CAUTION`
- `VERIFY`
- `AVOID`
- `ESCALATE`

Recommendations should be precautionary and proportional to available evidence.

## Safety validation

Before returning a result, verify:

- no score exists without supporting signals;
- explanation exists;
- risk level and score are internally consistent;
- unsupported certainty is absent;
- limitations are included when appropriate;
- recommended actions are proportionate;
- output matches the required schema.

## Structured result

The technical schema should include:

- `analysis_id`
- `input_type`
- `risk_score`
- `risk_level`
- `confidence`
- `risk_categories`
- `signals`
- `evidence`
- `summary`
- `explanation`
- `recommended_actions`
- `limitations`
- `engine_version`
- `timestamp`

## Testing

Maintain synthetic regression datasets covering:

- safe content;
- low risk;
- moderate risk;
- high risk;
- critical patterns;
- adversarial/contextual cases.

Track expected signals, categories, acceptable risk ranges, and actions. Evaluate false positives and false negatives.

## Versioning

Risk methodology must be versioned independently from the application when practical, for example `risk-v0.1`.

## Acceptance criteria for v0.1

- Analyze text.
- Extract structured signals.
- Map signals to categories.
- Produce risk level and experimental score.
- Produce explanation and actions.
- Express uncertainty.
- Return validated structured output.
- Pass synthetic regression tests.

## Central rule

> **No Score Without Signals. No Warning Without Explanation. No Certainty Without Evidence.**

**MirrorAI — A NestHive Product**