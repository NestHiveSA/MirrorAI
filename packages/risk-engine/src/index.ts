import { randomUUID } from "node:crypto";
import { riskCategories } from "@mirrorai/knowledge";
import {
  AnalysisResultSchema,
  type AnalysisRequest,
  type AnalysisResult,
  type Confidence,
  type DetectedSignal,
  type RecommendedAction,
  type RiskLevel
} from "@mirrorai/shared";

export const RISK_ENGINE_VERSION = "risk-v0.1-foundation";

const directRequestPattern =
  /(send|share|provide|confirm|update|verify|click|pay|transfer|reply|enter|open|download|submit|أرسل|شارك|زود|أكد|حدّث|حدث|اضغط|انقر|ادفع|حوّل|حول|أدخل|افتح|نزّل|حمل|قم)/i;

const protectiveContextPattern =
  /(do not|don't|never share|security warning|awareness|avoid|احذر|تحذير|تنبيه|لا تشارك|لا ترسل|لا تضغط|لا تحول|لا تحوّل|لا تدخل|لا تُدخل|نصيحة أمنية)/i;

type RuleDefinition = {
  signal: Omit<DetectedSignal, "evidence">;
  evidence: string;
  patterns: RegExp[];
  categoryIds: RiskCategoryId[];
  requiresDirectRequest?: boolean;
  skipInProtectiveContext?: boolean;
};

type RiskCategoryId = (typeof riskCategories)[number]["risk_id"];

const textRules: RuleDefinition[] = [
  {
    signal: {
      signal_id: "SIG-001",
      severity: 4,
      confidence: "HIGH",
      source: "RULE",
      explanation: "Urgency reduces the user's time to verify a risky request."
    },
    evidence: "Urgent or deadline-driven language was detected.",
    patterns: [/urgent|immediately|right now|asap|expire|suspend|last chance/i, /عاجل|فورًا|فورا|الآن|حالًا|خلال ساعة|سيتم إيقاف|سينتهي/i],
    categoryIds: ["RISK-005", "RISK-004"]
  },
  {
    signal: {
      signal_id: "SIG-003",
      severity: 4,
      confidence: "HIGH",
      source: "RULE",
      explanation: "Requests for sensitive personal or account data can expose the user to fraud or takeover."
    },
    evidence: "A request for sensitive information was detected.",
    patterns: [/national id|id number|bank account|card number|cvv|personal information/i, /رقم الهوية|معلومات شخصية|رقم الحساب|رقم البطاقة|الرقم السري/i],
    categoryIds: ["RISK-006", "RISK-001"],
    requiresDirectRequest: true,
    skipInProtectiveContext: true
  },
  {
    signal: {
      signal_id: "SIG-004",
      severity: 4,
      confidence: "MEDIUM",
      source: "RULE",
      explanation: "Unexpected payment requests are a common scam indicator."
    },
    evidence: "The content asks for money, a transfer, or payment action.",
    patterns: [/wire|transfer|payment|invoice|wallet|gift card|crypto/i, /حوّل|حول|ادفع|دفع|رسوم|بطاقة هدية|محفظة|عملة رقمية/i],
    categoryIds: ["RISK-007", "RISK-002"],
    requiresDirectRequest: true,
    skipInProtectiveContext: true
  },
  {
    signal: {
      signal_id: "SIG-005",
      severity: 3,
      confidence: "MEDIUM",
      source: "RULE",
      explanation: "Unexpected prizes and rewards are often used to lure users into scam flows."
    },
    evidence: "The content promises a prize, reward, or unrealistic gain.",
    patterns: [/won|winner|free money|bonus|prize|reward/i, /ربحت|فزت|جائزة|مكافأة|هدية مجانية/i],
    categoryIds: ["RISK-009", "RISK-002"],
    skipInProtectiveContext: true
  },
  {
    signal: {
      signal_id: "SIG-006",
      severity: 4,
      confidence: "MEDIUM",
      source: "RULE",
      explanation: "Claimed institutional identity combined with a risky request can indicate impersonation."
    },
    evidence: "The message claims to represent a trusted institution or support team.",
    patterns: [/bank|support team|security team|official account|government|delivery company/i, /البنك|خدمة العملاء|الدعم الفني|فريق الأمان|جهة حكومية|شركة الشحن/i],
    categoryIds: ["RISK-003", "RISK-004"],
    skipInProtectiveContext: true
  },
  {
    signal: {
      signal_id: "SIG-008",
      severity: 3,
      confidence: "MEDIUM",
      source: "RULE",
      explanation: "Secrecy requests can be used to isolate the user from trusted verification."
    },
    evidence: "The message asks the user to keep the interaction secret.",
    patterns: [/keep this secret|don't tell anyone|private only/i, /لا تخبر أحد|ابقه سرًا|سري للغاية/i],
    categoryIds: ["RISK-004", "RISK-002"],
    skipInProtectiveContext: true
  },
  {
    signal: {
      signal_id: "SIG-010",
      severity: 3,
      confidence: "MEDIUM",
      source: "RULE",
      explanation: "Fear or panic language is often used to push quick decisions."
    },
    evidence: "Fear-driven or emotionally pressuring language was detected.",
    patterns: [/your account will be closed|legal action|final notice|breach/i, /سيتم إغلاق حسابك|إجراء قانوني|إنذار نهائي|اختراق/i],
    categoryIds: ["RISK-010", "RISK-004"]
  },
  {
    signal: {
      signal_id: "SIG-013",
      severity: 5,
      confidence: "HIGH",
      source: "RULE",
      explanation: "Credential requests are strongly associated with phishing and account compromise."
    },
    evidence: "The content asks for login credentials or a password.",
    patterns: [/password|username|login details|sign in information/i, /كلمة المرور|اسم المستخدم|بيانات الدخول|تسجيل الدخول/i],
    categoryIds: ["RISK-001", "RISK-006"],
    requiresDirectRequest: true,
    skipInProtectiveContext: true
  },
  {
    signal: {
      signal_id: "SIG-014",
      severity: 5,
      confidence: "HIGH",
      source: "RULE",
      explanation: "Requests for one-time verification codes are strongly linked to account takeover attempts."
    },
    evidence: "The content asks for a verification code or OTP.",
    patterns: [/otp|verification code|one[- ]time code|security code/i, /رمز التحقق|رمز التأكيد|رمز الدخول|كود التحقق/i],
    categoryIds: ["RISK-001", "RISK-006", "RISK-004"],
    requiresDirectRequest: true,
    skipInProtectiveContext: true
  }
];

const categoryMap = new Map(riskCategories.map((category) => [category.risk_id, category]));

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

export function analyzeRequest(request: AnalysisRequest): AnalysisResult {
  const normalizedText = buildNormalizedText(request);
  const protectiveContext = protectiveContextPattern.test(normalizedText);
  const directRequest = directRequestPattern.test(normalizedText);
  const urlSignals = detectUrlSignals(request.url);
  const textSignals = protectiveContext && !directRequest ? [] : detectTextSignals(normalizedText, directRequest, protectiveContext);
  const signals = dedupeSignals([...textSignals, ...urlSignals]);
  const riskScore = signals.length > 0 ? computeRiskScore(signals) : null;
  const riskLevel = riskScore === null ? null : deriveRiskLevel(riskScore);
  const riskCategoriesForResult = deriveCategories(signals);
  const limitations = buildLimitations(request, signals, protectiveContext);
  const confidence = deriveConfidence(signals, riskScore, request.input_type);
  const evidence = buildEvidence(signals, request, protectiveContext);
  const recommendedActions = buildRecommendedActions(riskLevel, signals);

  const result: AnalysisResult = {
    analysis_id: randomUUID(),
    input_type: request.input_type,
    risk_score: riskScore,
    risk_level: riskLevel,
    confidence,
    risk_categories: riskCategoriesForResult,
    signals,
    evidence,
    summary: buildSummary(signals, riskLevel, protectiveContext),
    explanation: buildExplanation(signals, riskLevel, limitations, protectiveContext),
    recommended_actions: recommendedActions,
    limitations,
    engine_version: RISK_ENGINE_VERSION,
    timestamp: new Date().toISOString()
  };

  AnalysisResultSchema.parse(result);

  const violations = validateResultInvariants(result);

  if (violations.length > 0) {
    throw new Error(`Risk engine invariant violation: ${violations.join(" ")}`);
  }

  return result;
}

function buildNormalizedText(request: AnalysisRequest): string {
  return [request.content ?? "", request.url ?? ""].join(" ").toLowerCase();
}

function detectTextSignals(
  normalizedText: string,
  directRequest: boolean,
  protectiveContext: boolean
): DetectedSignal[] {
  const matches: DetectedSignal[] = [];

  for (const rule of textRules) {
    if (rule.skipInProtectiveContext && protectiveContext) {
      continue;
    }

    if (rule.requiresDirectRequest && !directRequest) {
      continue;
    }

    if (!rule.patterns.some((pattern) => pattern.test(normalizedText))) {
      continue;
    }

    matches.push({
      ...rule.signal,
      evidence: rule.evidence
    });
  }

  return matches;
}

function detectUrlSignals(urlValue: string | undefined): DetectedSignal[] {
  if (!urlValue) {
    return [];
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(urlValue);
  } catch {
    return [];
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  const shortened = /^(bit\.ly|tinyurl\.com|t\.co|goo\.gl|rb\.gy)$/.test(hostname);
  const ipAddress = /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);
  const suspiciousTerms = /(login|verify|secure|update|account|wallet|bonus|gift)/.test(hostname + parsedUrl.pathname.toLowerCase());
  const suspiciousTld = /\.(top|xyz|click|shop|site|online)$/.test(hostname);

  if (!shortened && !ipAddress && !suspiciousTerms && !suspiciousTld) {
    return [];
  }

  return [
    {
      signal_id: shortened || ipAddress ? "SIG-017" : "SIG-007",
      severity: shortened || ipAddress ? 5 : 4,
      confidence: "HIGH",
      evidence: "The supplied URL uses a shortened, opaque, or suspicious destination pattern.",
      source: "RULE",
      explanation: "Suspicious URL structure can hide the final destination and is commonly used in phishing flows."
    }
  ];
}

function dedupeSignals(signals: DetectedSignal[]): DetectedSignal[] {
  const signalMap = new Map<string, DetectedSignal>();

  for (const signal of signals) {
    const current = signalMap.get(signal.signal_id);

    if (!current || current.severity < signal.severity) {
      signalMap.set(signal.signal_id, signal);
    }
  }

  return [...signalMap.values()];
}

function computeRiskScore(signals: DetectedSignal[]): number {
  let score = signals.reduce((total, signal) => total + signal.severity * 9, 0);
  const signalIds = new Set(signals.map((signal) => signal.signal_id));

  if (signalIds.has("SIG-001") && signalIds.has("SIG-014")) {
    score += 15;
  }

  if (signalIds.has("SIG-006") && (signalIds.has("SIG-013") || signalIds.has("SIG-014"))) {
    score += 15;
  }

  if ((signalIds.has("SIG-007") || signalIds.has("SIG-017")) && (signalIds.has("SIG-013") || signalIds.has("SIG-014"))) {
    score += 10;
  }

  if (signalIds.has("SIG-004") && signalIds.has("SIG-001")) {
    score += 10;
  }

  if (signalIds.has("SIG-005") && (signalIds.has("SIG-007") || signalIds.has("SIG-017"))) {
    score += 8;
  }

  return Math.min(score, 100);
}

function deriveCategories(signals: DetectedSignal[]) {
  const categoryIds = new Set<RiskCategoryId>();

  for (const signal of signals) {
    for (const rule of textRules) {
      if (rule.signal.signal_id === signal.signal_id) {
        for (const categoryId of rule.categoryIds) {
          categoryIds.add(categoryId);
        }
      }
    }

    if (signal.signal_id === "SIG-007" || signal.signal_id === "SIG-017") {
      categoryIds.add("RISK-008");
      categoryIds.add("RISK-001");
    }
  }

  return [...categoryIds]
    .map((categoryId) => categoryMap.get(categoryId))
    .filter((category): category is (typeof riskCategories)[number] => Boolean(category));
}

function buildLimitations(
  request: AnalysisRequest,
  signals: DetectedSignal[],
  protectiveContext: boolean
): string[] {
  const limitations = [
    "No external sender identity verification was performed.",
    "No external reputation or threat-intelligence lookup was performed."
  ];

  if (request.input_type !== "INPUT-URL") {
    limitations.push("The analysis is based on message and URL patterns only; surrounding conversation context may be incomplete.");
  }

  if (signals.length === 0 && protectiveContext) {
    limitations.push("Protective or educational wording reduced rule-based risk detection in this result.");
  }

  return limitations;
}

function deriveConfidence(
  signals: DetectedSignal[],
  riskScore: number | null,
  inputType: AnalysisRequest["input_type"]
): Confidence {
  if (signals.length === 0) {
    return inputType === "INPUT-MIXED" ? "MEDIUM" : "LOW";
  }

  if ((riskScore ?? 0) >= 75 || signals.length >= 3) {
    return "HIGH";
  }

  if ((riskScore ?? 0) >= 40 || signals.length >= 2) {
    return "MEDIUM";
  }

  return "LOW";
}

function buildEvidence(
  signals: DetectedSignal[],
  request: AnalysisRequest,
  protectiveContext: boolean
): string[] {
  if (signals.length === 0) {
    return protectiveContext
      ? ["The content appears to use warning or awareness language rather than a direct risky request."]
      : ["No strong rule-based risk signals were detected in the provided input."];
  }

  const evidence = signals.map((signal) => signal.evidence);

  if (request.url) {
    evidence.push("A URL was included and evaluated with deterministic URL-pattern checks.");
  }

  return evidence;
}

function buildSummary(
  signals: DetectedSignal[],
  riskLevel: RiskLevel | null,
  protectiveContext: boolean
): string {
  if (signals.length === 0) {
    return protectiveContext
      ? "The content looks more like awareness or protective guidance than an active risk attempt."
      : "No strong digital-risk pattern was detected from the current rule set.";
  }

  return `The content shows a ${riskLevel?.toLowerCase() ?? "moderate"} digital-risk pattern based on detected rule signals.`;
}

function buildExplanation(
  signals: DetectedSignal[],
  riskLevel: RiskLevel | null,
  limitations: string[],
  protectiveContext: boolean
): string {
  if (signals.length === 0) {
    return protectiveContext
      ? `What we noticed: the text uses warning-oriented language. Why it matters: educational context can mention risky terms without making a risky request. What we cannot verify: ${limitations.join(" ")} What you can do: continue to verify any real sender through official channels if this message is tied to a live interaction.`
      : `What we noticed: no strong rule-based signals were detected. Why it matters: the current deterministic checks did not find a clear phishing, scam, or impersonation pattern. What we cannot verify: ${limitations.join(" ")} What you can do: stay cautious and verify unexpected claims through official channels.`;
  }

  const signalSummary = signals
    .map((signal) => signal.explanation)
    .join(" ");

  return `What we noticed: ${signals.length} risk signal(s) were detected. Why it matters: ${signalSummary} The combined pattern maps to a ${riskLevel?.toLowerCase() ?? "moderate"} risk assessment. What we cannot verify: ${limitations.join(" ")} What you can do: use the recommended actions below before responding or sharing sensitive information.`;
}

function buildRecommendedActions(
  riskLevel: RiskLevel | null,
  signals: DetectedSignal[]
): RecommendedAction[] {
  if (signals.length === 0) {
    return [
      {
        level: "INFO",
        title: "Keep normal verification habits",
        description: "If the request becomes active or asks for sensitive action later, verify it through a trusted official channel."
      }
    ];
  }

  const actions: RecommendedAction[] = [
    {
      level: riskLevel === "CRITICAL" || riskLevel === "HIGH" ? "AVOID" : "CAUTION",
      title: "Do not act on the request immediately",
      description: "Pause before clicking links, sharing codes, or sending money until the request is independently verified."
    },
    {
      level: "VERIFY",
      title: "Verify through an official channel",
      description: "Contact the claimed institution through a trusted phone number, website, or app rather than using details from the message."
    }
  ];

  if (signals.some((signal) => signal.signal_id === "SIG-013" || signal.signal_id === "SIG-014")) {
    actions.unshift({
      level: "AVOID",
      title: "Do not share credentials or verification codes",
      description: "Legitimate institutions should not ask you to send passwords or one-time login codes in a message."
    });
  }

  if (riskLevel === "CRITICAL") {
    actions.push({
      level: "ESCALATE",
      title: "Escalate to a trusted security or support contact",
      description: "If the message targets work, banking, or an important account, notify the relevant trusted team before taking action."
    });
  }

  return actions;
}

