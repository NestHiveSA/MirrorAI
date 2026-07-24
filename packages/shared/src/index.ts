export type RiskLevel = 'low' | 'medium' | 'high';

export interface RiskSignal {
  id: string;
  title: string;
  description: string;
  severity: RiskLevel;
}

export interface RiskAssessment {
  level: RiskLevel;
  score: number;
  confidence: number;
  signals: RiskSignal[];
  riskSignals: RiskSignal[];
  positiveSignals: RiskSignal[];
  extractedAdvice: string[];
  limitations: string[];
  recommendedActions: string[];
}

export interface AnalyzeRequest {
  text: string;
  url?: string;
}

export interface AnalysisResult {
  level: RiskLevel;
  score: number;
  confidence: number;
  signals: RiskSignal[];
  riskSignals: RiskSignal[];
  positiveSignals: RiskSignal[];
  extractedAdvice: string[];
  explanation: string;
  recommendedActions: string[];
  limitations: string[];
}

export interface AnalyzeResponse {
  analysis: AnalysisResult;
}
