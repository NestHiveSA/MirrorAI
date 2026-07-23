export interface AIAnalysisRequest {
  promptId: string;
  content: string;
  expectedSchemaName: string;
}

export interface AIAnalysisResponse {
  raw: unknown;
}

export interface AIProvider {
  analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse>;
}

export class AIGatewayUnavailableError extends Error {
  readonly code = "AI_PROVIDER_ERROR";

  constructor() {
    super("No AI provider adapter is configured in the MIRROR-001 foundation.");
    this.name = "AIGatewayUnavailableError";
  }
}

class UnavailableProvider implements AIProvider {
  analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    void request;
    return Promise.reject(new AIGatewayUnavailableError());
  }
}

export function createUnavailableGateway(): AIProvider {
  return new UnavailableProvider();
}
