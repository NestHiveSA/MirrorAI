import type { AnalysisRequest } from "@mirrorai/shared";
import { createUnavailableGateway } from "@mirrorai/ai-gateway";

export class AnalysisNotImplementedError extends Error {
  readonly code = "ANALYSIS_NOT_IMPLEMENTED";

  constructor() {
    super(
      "Analysis orchestration is not implemented in MIRROR-001. Use later issues for the live analysis flow."
    );
    this.name = "AnalysisNotImplementedError";
  }
}

export class AnalysisService {
  private readonly gateway = createUnavailableGateway();

  analyze(request: AnalysisRequest): Promise<never> {
    void this.gateway;
    void request;
    return Promise.reject(new AnalysisNotImplementedError());
  }
}
