import type { AnalysisRequest, AnalysisResult } from "@mirrorai/shared";
import { analyzeRequest } from "@mirrorai/risk-engine";

export class AnalysisService {
  analyze(request: AnalysisRequest): Promise<AnalysisResult> {
    return Promise.resolve(analyzeRequest(request));
  }
}
