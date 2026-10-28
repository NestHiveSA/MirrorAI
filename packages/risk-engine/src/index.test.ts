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
describe("Moroccan Darija and French coverage", () => {
  const riskyCases: Array<[string, string, string[]]> = [
    ["Darija prize and code request", "سلام خويا، ربحتي كادو من اتصالات المغرب، صيفط ليا الكود اللي جاك فالميساج", ["SIG-005", "SIG-006", "SIG-014"]],
    ["Latin-script Darija code request", "sift lia l code li jak daba daba", ["SIG-001", "SIG-014"]],
    ["French prize and verification code", "Félicitations, vous avez gagné un iPhone. Envoyez votre code de vérification maintenant", ["SIG-001", "SIG-005", "SIG-014"]],
    ["Moroccan bank look-alike link in text", "عزيزي العميل، حسابك في CIH Bank سيتم توقيفه، ادخل هنا لتأكيد معلوماتك: http://cih-secure-ma.xyz", ["SIG-006", "SIG-007"]],
    ["French parcel fee scam", "Votre colis Amana est bloqué, payez 12 DH de frais: http://amana-livraison.top", ["SIG-004", "SIG-006", "SIG-007"]]
  ];

  it.each(riskyCases)("flags %s", (_label, content, expectedSignals) => {
    const result = analyzeRequest({ input_type: "INPUT-TEXT", content });

    expect(result.risk_level === "HIGH" || result.risk_level === "CRITICAL").toBe(true);
    expect(result.signals.map((signal) => signal.signal_id)).toEqual(expect.arrayContaining(expectedSignals));
    expect(validateResultInvariants(result)).toEqual([]);
  });

  const benignCases: Array<[string, string]> = [
    ["everyday Darija", "فين نتا دابا؟ نتلاقاو فالقهوة مع الخمسة"],
    ["everyday French", "Bonjour, la réunion est demain à 10h au bureau"],
    ["Darija request without risk", "عافاك صيفط ليا الصورة ديال الدار"],
    ["Darija security advice", "رد البال: البانكة ما كتطلبش منك الكود، ما تصيفطش الكود لحتى واحد"],
    ["French security advice", "Ne partagez jamais votre code de vérification"]
  ];

  it.each(benignCases)("does not score %s", (_label, content) => {
    const result = analyzeRequest({ input_type: "INPUT-TEXT", content });

    expect(result.risk_score).toBeNull();
    expect(result.signals).toEqual([]);
  });
});

describe("misleading content signals", () => {
  it("flags unsourced viral claims without calling them false", () => {
    const result = analyzeRequest({
      input_type: "INPUT-TEXT",
      content: "حسب مصادر مطلعة، الخبر مؤكد 100%، انشر قبل الحذف"
    });

    expect(result.signals.map((signal) => signal.signal_id)).toEqual(
      expect.arrayContaining(["SIG-020", "SIG-021", "SIG-023"])
    );
    expect(result.risk_categories.map((category) => category.risk_id)).toContain("RISK-011");
    expect(validateResultInvariants(result)).toEqual([]);
  });

  it("flags French and Darija viral sharing pressure", () => {
    for (const content of ["Selon nos sources, c'est un scandale, partagez avant qu'il soit supprimé", "سمعت بلي كاين فضيحة، بارطاجي قبل ما يتمسح"]) {
      const result = analyzeRequest({ input_type: "INPUT-TEXT", content });
      expect(result.signals.map((signal) => signal.signal_id)).toEqual(expect.arrayContaining(["SIG-020", "SIG-021", "SIG-022"]));
    }
  });

  it("keeps a single weak misinformation cue at a low level", () => {
    const result = analyzeRequest({ input_type: "INPUT-TEXT", content: "مفاجأة كبرى في مباراة الأمس" });

    expect(result.risk_level).toBe("LOW");
  });
});
