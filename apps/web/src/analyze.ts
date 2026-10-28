import { analyzeRequest } from "@mirrorai/risk-engine";
import type { AnalysisResult } from "@mirrorai/shared";
import { analysisMode, apiBaseUrl } from "./config";
import type { buildRequestBody } from "./request";

export class AnalysisUnavailableError extends Error {}

// "local" runs the risk engine on the device, so the message never leaves the phone.
export async function analyze(body: ReturnType<typeof buildRequestBody>): Promise<AnalysisResult> {
  if (analysisMode === "local") {
    return analyzeRequest(body);
  }

  const response = await fetch(`${apiBaseUrl}/api/v1/analysis`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new AnalysisUnavailableError(`Analysis API responded with ${response.status}`);
  }

  return (await response.json()) as AnalysisResult;
}
