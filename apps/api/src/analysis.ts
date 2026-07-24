import type { AnalyzeRequest, AnalyzeResponse, AnalysisResult, RiskAssessment } from '@mirrorai/shared';

function formatAnalysisInput(payload: AnalyzeRequest): string {
  const parts: string[] = [payload.text.trim()];

  if (payload.url?.trim()) {
    parts.push(`URL: ${payload.url.trim()}`);
  }

  return parts.filter(Boolean).join('\n\n');
}

function buildExplanation(assessment: RiskAssessment): string {
  const signalNames = assessment.riskSignals.map((signal) => signal.title);
  const misinformationSignals = assessment.riskSignals.filter((signal) =>
    ['unverified_attribution', 'viral_sharing_pressure', 'sensational_language', 'unsupported_certainty'].includes(signal.id)
  );
  const meaningfulRiskSignals = assessment.riskSignals.filter((signal) => signal.id !== 'low-context');

  if (misinformationSignals.length > 0) {
    return 'يتضمن هذا المحتوى مؤشرات لغوية قد تتطلب التحقق من مصادر موثوقة ومستقلة. MirrorAI لا يحدد ما إذا كان الخبر صحيحًا أو خاطئًا، بل يلفت الانتباه إلى علامات تستحق المراجعة.';
  }

  if (meaningfulRiskSignals.length === 0 && assessment.positiveSignals.length > 0) {
    return 'لم يتم رصد مؤشرات لغوية قوية مرتبطة بالاحتيال أو المحتوى المضلل. يتضمن النص إرشادات وقائية ودعوة إلى متابعة مصادر موثوقة، مع بقاء التقييم محدودًا بالنص دون تحقق خارجي.';
  }

  if (signalNames.length === 0) {
    return 'لم يتم رصد إشارات قوية، لكن التقييم ما زال محدودًا بالنص المرسل فقط.';
  }

  const joinedSignals = signalNames.join('، ');
  return `اعتمد التقييم على الإشارات التالية: ${joinedSignals}. المستوى النهائي يعكس شدة الإشارات المتاحة مع درجة الثقة الحالية.`;
}

export function buildAnalysisResult(assessment: RiskAssessment): AnalysisResult {
  return {
    level: assessment.level,
    score: assessment.score,
    confidence: assessment.confidence,
    signals: assessment.signals,
    riskSignals: assessment.riskSignals,
    positiveSignals: assessment.positiveSignals,
    extractedAdvice: assessment.extractedAdvice,
    explanation: buildExplanation(assessment),
    recommendedActions: assessment.recommendedActions,
    limitations: assessment.limitations
  };
}

export function buildAnalysisResponse(assessment: RiskAssessment): AnalyzeResponse {
  return {
    analysis: buildAnalysisResult(assessment)
  };
}

export function buildAnalysisInput(payload: AnalyzeRequest): string {
  return formatAnalysisInput(payload);
}
