import type { AnalysisResult } from "@mirrorai/shared";
import { RISK_ENGINE_VERSION } from "@mirrorai/risk-engine";

export const syntheticRiskCases: AnalysisResult[] = [
  {
    analysis_id: "case-high-risk-phishing",
    input_type: "INPUT-TEXT",
    risk_score: 82,
    risk_level: "CRITICAL",
    confidence: "MEDIUM",
    risk_categories: [
      { risk_id: "RISK-001", label: "Phishing" },
      { risk_id: "RISK-006", label: "Sensitive Data Exposure" }
    ],
    signals: [
      {
        signal_id: "SIG-001",
        severity: 4,
        confidence: "HIGH",
        evidence: "Immediate deadline pressure was detected.",
        source: "RULE",
        explanation: "Urgency can reduce the user's time to verify the request."
      },
      {
        signal_id: "SIG-014",
        severity: 5,
        confidence: "HIGH",
        evidence: "The message asks for a verification code.",
        source: "RULE",
        explanation: "Requests for one-time codes are strongly associated with account takeover attempts."
      }
    ],
    evidence: [
      "The message combines urgency with a request for a verification code.",
      "The sender identity is not independently verified."
    ],
    summary: "The content shows a strong phishing pattern.",
    explanation:
      "The detected signals indicate pressure and a sensitive verification request. This combination is commonly used to gain account access.",
    recommended_actions: [
      {
        level: "AVOID",
        title: "Do not share the code",
        description: "Do not send verification or login codes to the sender."
      },
      {
        level: "VERIFY",
        title: "Confirm through an official channel",
        description: "Contact the institution through a trusted number or website."
      }
    ],
    limitations: [
      "The sender identity was not externally verified.",
      "No external reputation lookup was performed in the foundation dataset."
    ],
    engine_version: RISK_ENGINE_VERSION,
    timestamp: "2026-07-23T00:00:00.000Z"
  }
];

