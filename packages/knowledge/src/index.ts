export const riskCategories = [
  { risk_id: "RISK-001", label: "Phishing" },
  { risk_id: "RISK-002", label: "Scam" },
  { risk_id: "RISK-003", label: "Impersonation" },
  { risk_id: "RISK-004", label: "Social Engineering" },
  { risk_id: "RISK-005", label: "Manipulative Urgency" },
  { risk_id: "RISK-006", label: "Sensitive Data Exposure" },
  { risk_id: "RISK-007", label: "Financial Risk" },
  { risk_id: "RISK-008", label: "Suspicious Link" },
  { risk_id: "RISK-009", label: "Unrealistic Offer" },
  { risk_id: "RISK-010", label: "Emotional Manipulation" }
] as const;

export const signalCatalog = [
  { signal_id: "SIG-001", name: "Urgency" },
  { signal_id: "SIG-003", name: "Sensitive Data Request" },
  { signal_id: "SIG-006", name: "Impersonation" },
  { signal_id: "SIG-007", name: "Suspicious Link" },
  { signal_id: "SIG-014", name: "Verification Code Request" }
] as const;

export const recommendationLevels = [
  "INFO",
  "CAUTION",
  "VERIFY",
  "AVOID",
  "ESCALATE"
] as const;

