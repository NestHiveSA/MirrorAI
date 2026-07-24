import { z } from "zod";

export const AnalysisInputTypeSchema = z.enum([
  "INPUT-TEXT",
  "INPUT-URL",
  "INPUT-MIXED"
]);

export const EvidenceSourceSchema = z.enum(["RULE", "AI", "KNOWLEDGE", "EXTERNAL"]);
export const RiskLevelSchema = z.enum(["LOW", "MODERATE", "HIGH", "CRITICAL"]);
export const ConfidenceSchema = z.enum(["LOW", "MEDIUM", "HIGH"]);
export const ActionLevelSchema = z.enum(["INFO", "CAUTION", "VERIFY", "AVOID", "ESCALATE"]);

export const DetectedSignalSchema = z.object({
  signal_id: z.string(),
  severity: z.number().int().min(1).max(5),
  confidence: ConfidenceSchema,
  evidence: z.string(),
  source: EvidenceSourceSchema,
  explanation: z.string()
});

export const RiskCategorySchema = z.object({
  risk_id: z.string(),
  label: z.string()
});

export const RecommendedActionSchema = z.object({
  level: ActionLevelSchema,
  title: z.string(),
  description: z.string()
});

export const AnalysisResultSchema = z.object({
  analysis_id: z.string(),
  input_type: AnalysisInputTypeSchema,
  risk_score: z.number().min(0).max(100).nullable(),
  risk_level: RiskLevelSchema.nullable(),
  confidence: ConfidenceSchema,
  risk_categories: z.array(RiskCategorySchema),
  signals: z.array(DetectedSignalSchema),
  evidence: z.array(z.string()),
  summary: z.string(),
  explanation: z.string(),
  recommended_actions: z.array(RecommendedActionSchema),
  limitations: z.array(z.string()),
  engine_version: z.string(),
  timestamp: z.string()
});

export const AnalysisRequestSchema = z
  .object({
    input_type: AnalysisInputTypeSchema,
    content: z.string().trim().min(1).max(10_000).optional(),
    url: z.string().trim().url().optional()
  })
  .superRefine((value, context) => {
    if (value.input_type === "INPUT-TEXT" && !value.content) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "content is required for INPUT-TEXT",
        path: ["content"]
      });
    }

    if (value.input_type === "INPUT-URL" && !value.url) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "url is required for INPUT-URL",
        path: ["url"]
      });
    }

    if (value.input_type === "INPUT-MIXED" && (!value.content || !value.url)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "content and url are required for INPUT-MIXED",
        path: ["input_type"]
      });
    }
  });

export const ErrorCodeSchema = z.enum([
  "INVALID_INPUT",
  "CONTENT_TOO_LARGE",
  "AI_PROVIDER_ERROR",
  "AI_TIMEOUT",
  "INVALID_AI_RESPONSE",
  "RISK_ENGINE_ERROR",
  "RATE_LIMITED",
  "ANALYSIS_NOT_IMPLEMENTED"
]);

export const ErrorResponseSchema = z.object({
  error: z.object({
    code: ErrorCodeSchema,
    message: z.string()
  })
});

export type AnalysisInputType = z.infer<typeof AnalysisInputTypeSchema>;
export type AnalysisRequest = z.infer<typeof AnalysisRequestSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
export type Confidence = z.infer<typeof ConfidenceSchema>;
export type DetectedSignal = z.infer<typeof DetectedSignalSchema>;
export type ErrorCode = z.infer<typeof ErrorCodeSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type RecommendedAction = z.infer<typeof RecommendedActionSchema>;
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

