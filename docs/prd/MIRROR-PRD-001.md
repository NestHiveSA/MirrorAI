# MIRROR-PRD-001 — MirrorAI MVP v0.1 Product Requirements Document

**Product:** MirrorAI  
**Owner:** NestHive  
**Stage:** Prototype → MVP  
**Governing document:** MIRROR-CONST-001

## Purpose

Define the official scope and requirements for MirrorAI MVP v0.1.

## Product definition

MirrorAI is an Arabic-first digital-awareness companion that helps users understand potentially risky digital content, identify relevant signals, understand why those signals matter, and receive precautionary actions before making a decision.

Core flow:

`Content → Analysis → Signals → Risk Assessment → Explanation → Recommended Actions → Human Decision`

## MVP hypothesis

A user can submit suspicious digital content and receive an understandable, explainable assessment that improves their ability to verify and decide safely.

## Target user

The initial target is a non-technical general user who encounters suspicious messages, offers, requests for sensitive information, impersonation attempts, social-engineering pressure, or suspicious links.

## Core output

Every successful analysis should answer:

1. What was noticed?
2. Which risk signals were detected?
3. What is the potential risk level?
4. Why does the result matter?
5. What can the user do next?
6. What could not be verified?

## P0 MVP scope

- Text input and analysis.
- Basic URL input/context support.
- Risk categories.
- Risk level.
- Experimental risk score only when supported by signals and explanation.
- Detected signals.
- Evidence or reasons.
- Explanation.
- Recommended precautionary actions.
- Confidence and uncertainty handling.
- Explicit limitations.
- Arabic RTL interface.
- Secure backend-controlled AI integration.
- Understandable error states.

## Initial risk categories

- Phishing.
- Scam.
- Impersonation.
- Social Engineering.
- Manipulative Urgency.
- Sensitive Data Exposure.
- Financial Risk.
- Suspicious Link.
- Unrealistic Offer.
- Emotional Manipulation.

## Functional requirements

- **FR-001:** Accept text input.
- **FR-002:** Accept URL input within supported capabilities.
- **FR-003:** Allow the user to request analysis.
- **FR-004:** Return one or more risk categories when appropriate.
- **FR-005:** Return an understandable risk level.
- **FR-006:** If a risk score is used, show it with explanatory context.
- **FR-007:** Return principal detected signals.
- **FR-008:** Explain the result in understandable language.
- **FR-009:** Return context-appropriate precautionary actions.
- **FR-010:** Express uncertainty or insufficient information.
- **FR-011:** Support Arabic and RTL correctly.
- **FR-012:** Present understandable error states.
- **FR-013:** Persistent analysis history is optional, not required for initial release.
- **FR-014:** Feedback is P1 after the core analysis flow stabilizes.

## Non-functional requirements

- Privacy and data minimization.
- Secure secret management.
- Provider independence.
- Explainability.
- Maintainability.
- Reliability and graceful provider failure.
- Basic observability without sensitive-content logging.
- Mobile-ready responsive web experience.

## Out of scope for v0.1

- Native mobile applications.
- General image editing.
- Advanced file, audio, or video analysis.
- Antivirus or network monitoring.
- Autonomous actions on user accounts.
- Enterprise multi-tenancy.
- Public commercial API.
- Advanced subscription systems.
- Full NestHiveCore platform.
- Complex vector infrastructure.

## Mirror Mode

Mirror Mode remains part of the long-term product vision but is deferred from P0. The MVP prioritizes Shield / Digital Risk Analysis.

## Privacy baseline

Preferred initial processing path:

`User Input → Secure Transport → Temporary Processing → Analysis → Result → Input Discarded`

Original content should not be persistently stored by default.

## Acceptance criteria

The MVP is ready for controlled testing when:

- Text analysis works end-to-end.
- Results include risk level, signals, explanation, actions, and limitations.
- Uncertainty can be expressed.
- AI secrets are absent from the frontend.
- Arabic RTL works correctly.
- Provider failures are handled clearly.
- Synthetic low- and high-risk test cases exist.
- False-positive and false-negative behavior is evaluated initially.

## Success measures

- User understanding of results.
- Usefulness of explanations and actions.
- Analysis reliability and latency.
- Technical error rate.
- False-positive and false-negative patterns.
- Appropriate uncertainty handling.

## Governance

`Constitution → PRD → Risk Specification → Architecture → Issues → Implementation → Tests → Human Review → Release`

## MVP decision

Build the smallest coherent Arabic-first product that helps users see, understand, and verify potential digital-risk signals before deciding.

**MirrorAI — A NestHive Product**