import { describe, expect, it } from "vitest";
import { deriveRiskLevel, validateResultInvariants } from "@mirrorai/risk-engine";
import { AnalysisResultSchema } from "@mirrorai/shared";
import { syntheticRiskCases } from "./fixtures.js";

describe("synthetic risk cases", () => {
  it("remain schema valid", () => {
    for (const testCase of syntheticRiskCases) {
      expect(() => AnalysisResultSchema.parse(testCase)).not.toThrow();
    }
  });

  it("stay aligned with the current score bands", () => {
    for (const testCase of syntheticRiskCases) {
      expect(testCase.risk_score).not.toBeNull();
      expect(deriveRiskLevel(testCase.risk_score ?? 0)).toBe(testCase.risk_level);
    }
  });

  it("satisfy foundational invariants", () => {
    for (const testCase of syntheticRiskCases) {
      expect(validateResultInvariants(testCase)).toEqual([]);
    }
  });
});

