import type { AnalysisResult, RiskLevel } from "@mirrorai/shared";

export const RISK_ENGINE_VERSION = "risk-v0.1-foundation";

export function deriveRiskLevel(score: number): RiskLevel {
  if (score >= 75) {
    return "CRITICAL";
  }

  if (score >= 50) {
    return "HIGH";
  }

  if (score >= 25) {
    return "MODERATE";
  }

  return "LOW";
}

export function validateResultInvariants(result: AnalysisResult): string[] {
  const violations: string[] = [];

  if (result.risk_score !== null && result.signals.length === 0) {
    violations.push("Risk score requires supporting signals.");
  }

  if (result.explanation.trim().length === 0) {
    violations.push("Explanation is required.");
  }

  if (result.risk_score !== null && result.risk_level !== deriveRiskLevel(result.risk_score)) {
    violations.push("Risk level must remain consistent with the score bands.");
  }

  return violations;
}

