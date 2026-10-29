import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { knowledgeSignalIds } from "./test-fixtures";
import { App } from "./app";
import { buildRequestBody } from "./request";
import { LIMITS, SCORE_MEANING, actionsFor, copyForSignal, levelLabel, signalCopy, signalCopyFr, summaryFor } from "./copy";
import { lessons, quiz, scoreLevel } from "./learn";
import { ui } from "./i18n";
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
  it("opens on the Arabic home screen with its tiles and no developer panels", () => {
    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain("رفيقك الرقمي");
    expect(markup).toContain("منتج من NestHive");
    for (const title of ["تحقّق", "اختبر", "شاهد واستمع", "المتجر", "تعلّم", "عن التطبيق"]) {
      expect(markup).toContain(title);
    }
    expect(markup).toContain("https://souktree.ma");
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

describe("French copy", () => {
  it("has French wording for every signal the engine can emit", () => {
    for (const signalId of knowledgeSignalIds) {
      expect(signalCopyFr[signalId], signalId).toBeDefined();
    }
  });

  it("speaks French when asked, and keeps Arabic as the default", () => {
    const result = resultWith(["SIG-014"], "CRITICAL", 90);

    expect(levelLabel("CRITICAL", "fr")).toBe("Très élevé");
    expect(copyForSignal("SIG-014", "fr").title).toBe("Demande du code de vérification");
    expect(copyForSignal("SIG-999", "fr").title).toBe("Signal à surveiller");
    expect(summaryFor(result, "fr")).toContain("Arrêtez-vous");
    expect(actionsFor(result, "fr")).toContain(copyForSignal("SIG-014", "fr").tip);
    expect(summaryFor(result)).toBe(summaryFor(result, "ar"));
  });

  it("gives score meaning and limits in both languages", () => {
    expect(SCORE_MEANING.fr).toBeTruthy();
    expect(LIMITS.fr).toHaveLength(LIMITS.ar.length);
  });
});

describe("Learning content", () => {
  it("has the same lessons and quiz questions in Arabic and French", () => {
    expect(lessons.fr.map((lesson) => lesson.id)).toEqual(lessons.ar.map((lesson) => lesson.id));
    expect(quiz.fr.map((question) => question.id)).toEqual(quiz.ar.map((question) => question.id));
    expect(quiz.fr.map((question) => question.answer)).toEqual(quiz.ar.map((question) => question.answer));
  });

  it("does not always put the right answer in the same place", () => {
    expect(new Set(quiz.ar.map((question) => question.answer)).size).toBeGreaterThan(1);
  });

  it("rates quiz scores", () => {
    expect(scoreLevel(8, 8)).toBe("high");
    expect(scoreLevel(5, 8)).toBe("mid");
    expect(scoreLevel(2, 8)).toBe("low");
    expect(scoreLevel(0, 0)).toBe("low");
  });

  it("lists the same media items in both languages", () => {
    expect(ui.fr.media.items.map((item) => item.id)).toEqual(ui.ar.media.items.map((item) => item.id));
  });
});
