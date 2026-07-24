import { describe, expect, it } from "vitest";
import { AnalysisResultSchema } from "@mirrorai/shared";
import {
  analyzeRequest,
  deriveRiskLevel,
  validateResultInvariants
} from "./index.js";

describe("analyzeRequest", () => {
  it("returns a critical result for a compound phishing-style message", () => {
    const result = analyzeRequest({
      input_type: "INPUT-TEXT",
      content: "عاجل: نحن من البنك. أرسل رمز التحقق الآن وإلا سيتم إيقاف الحساب فورًا"
    });

    expect(() => AnalysisResultSchema.parse(result)).not.toThrow();
    expect(result.risk_score).not.toBeNull();
    expect(result.risk_level).toBe("CRITICAL");
    expect(result.risk_score).toBeGreaterThanOrEqual(75);
    expect(result.signals.map((signal) => signal.signal_id)).toEqual(
      expect.arrayContaining(["SIG-001", "SIG-006", "SIG-014"])
    );
    expect(validateResultInvariants(result)).toEqual([]);
  });

  it("suppresses warnings that look educational rather than malicious", () => {
    const result = analyzeRequest({
      input_type: "INPUT-TEXT",
      content: "تحذير أمني: لا تشارك رمز التحقق مع أي شخص ولا تضغط على الروابط المجهولة"
    });

    expect(result.risk_score).toBeNull();
    expect(result.risk_level).toBeNull();
    expect(result.signals).toEqual([]);
    expect(result.evidence[0]).toContain("warning or awareness language");
    expect(validateResultInvariants(result)).toEqual([]);
  });

  it("derives categories and level for suspicious URLs", () => {
    const result = analyzeRequest({
      input_type: "INPUT-URL",
      url: "https://bit.ly/secure-login-update"
    });

    expect(result.risk_score).not.toBeNull();
    expect(deriveRiskLevel(result.risk_score ?? 0)).toBe(result.risk_level);
    expect(result.risk_categories.map((category) => category.risk_id)).toEqual(
      expect.arrayContaining(["RISK-008", "RISK-001"])
    );
    expect(result.signals.map((signal) => signal.signal_id)).toContain("SIG-017");
  });
});