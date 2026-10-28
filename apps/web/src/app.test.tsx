import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { knowledgeSignalIds } from "./test-fixtures";
import { App } from "./app";
import { buildRequestBody } from "./request";
import { actionsFor, copyForSignal, levelLabel, signalCopy, summaryFor } from "./copy";
import type { AnalysisResult } from "@mirrorai/shared";

function resultWith(signalIds: string[], level: AnalysisResult["risk_level"], score: number | null): AnalysisResult {
  return {
    analysis_id: "test",
    input_type: "INPUT-TEXT",
    risk_score: score,
    risk_level: level,
    confidence: "MEDIUM",
    risk_categories: [],
    signals: signalIds.map((signal_id) => ({
      signal_id,
      severity: 4,
      confidence: "HIGH",
      evidence: "",
      source: "RULE",
      explanation: ""
    })),
    evidence: [],
    summary: "",
    explanation: "",
    recommended_actions: [],
    limitations: [],
    engine_version: "test",
    timestamp: new Date(0).toISOString()
  };
}

describe("App", () => {
  it("renders the Arabic, user-facing shell without developer panels", () => {
    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain("رفيقك الرقمي");
    expect(markup).toContain("منتج من NestHive");
    expect(markup).toContain("افحص الرسالة");
    expect(markup).not.toContain("Raw JSON");
    expect(markup).not.toContain("HTTP status");
  });

  it("sends text alone, or text with a link when one is given", () => {
    expect(buildRequestBody(" سلام ", "")).toEqual({ input_type: "INPUT-TEXT", content: "سلام" });
    expect(buildRequestBody("سلام", " https://a.ma ")).toEqual({
      input_type: "INPUT-MIXED",
      content: "سلام",
      url: "https://a.ma"
    });
  });
});

describe("Arabic copy", () => {
  it("has Arabic wording for every signal the engine can emit", () => {
    for (const signalId of knowledgeSignalIds) {
      expect(signalCopy[signalId], signalId).toBeDefined();
    }
  });

  it("falls back to generic wording for an unknown signal", () => {
    expect(copyForSignal("SIG-999").title).toBe("إشارة تستحق الانتباه");
  });

  it("labels every risk level in Arabic", () => {
    expect(levelLabel("CRITICAL")).toBe("مرتفع جداً");
    expect(levelLabel(null)).toBe("لا إشارات واضحة");
  });

  it("turns each detected signal into a practical tip without duplicates", () => {
    const actions = actionsFor(resultWith(["SIG-014", "SIG-001", "SIG-014"], "CRITICAL", 100));

    expect(actions).toContain(copyForSignal("SIG-014").tip);
    expect(actions).toContain(copyForSignal("SIG-001").tip);
    expect(new Set(actions).size).toBe(actions.length);
  });

  it("does not call content safe when nothing was detected", () => {
    expect(summaryFor(resultWith([], null, null))).toContain("لا يعني أنه آمن");
  });
});
