import type { AnalysisRequest, AnalysisResult } from "@mirrorai/shared";
import { apiBaseUrl } from "./config";

export type AnalysisOutcome =
  | { ok: true; status: number; result: AnalysisResult }
  | { ok: false; status: number | null; message: string };

export async function runAnalysis(payload: AnalysisRequest): Promise<AnalysisOutcome> {
  if (!apiBaseUrl) {
    return {
      ok: false,
      status: null,
      message: "لم يتم ضبط عنوان خادم التحليل (EXPO_PUBLIC_API_BASE_URL)."
    };
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/analysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const body = (await response.json()) as AnalysisResult | { error?: { message?: string } };

    if (!response.ok) {
      const message =
        "error" in body && body.error?.message ? body.error.message : "حدث خطأ غير متوقع.";
      return { ok: false, status: response.status, message };
    }

    return { ok: true, status: response.status, result: body as AnalysisResult };
  } catch (error) {
    const message = error instanceof Error ? error.message : "تعذّر الوصول إلى خادم التحليل.";
    return { ok: false, status: null, message };
  }
}
