import { describe, expect, it } from 'vitest';
import { buildAnalysisInput, buildAnalysisResponse } from './analysis.js';
import type { RiskAssessment } from '@mirrorai/shared';

describe('analysis helpers', () => {
  it('combines text and url into a single analysis input', () => {
    expect(
      buildAnalysisInput({ text: 'اختبار', url: 'https://example.com/phishing' })
    ).toContain('URL: https://example.com/phishing');
  });

  it('maps an assessment into a user-facing response', () => {
    const assessment: RiskAssessment = {
      level: 'high',
      score: 91,
      confidence: 0.81,
      signals: [
        {
          id: 'credential-request',
          title: 'طلب بيانات اعتماد حساسة',
          description: 'النص يطلب كلمة المرور أو رمز التحقق أو بيانات بطاقة.',
          severity: 'high'
        }
      ],
      riskSignals: [
        {
          id: 'credential-request',
          title: 'طلب بيانات اعتماد حساسة',
          description: 'النص يطلب كلمة المرور أو رمز التحقق أو بيانات بطاقة.',
          severity: 'high'
        }
      ],
      positiveSignals: [],
      extractedAdvice: [],
      limitations: ['يعتمد التقييم على النص والرابط المرسل فقط.'],
      recommendedActions: ['لا تشارك كلمات المرور أو رموز التحقق.']
    };

    const response = buildAnalysisResponse(assessment);

    expect(response.analysis.level).toBe('high');
    expect(response.analysis.score).toBe(91);
    expect(response.analysis.explanation).toContain('الإشارات التالية');
    expect(response.analysis.signals).toHaveLength(1);
    expect(response.analysis.riskSignals).toHaveLength(1);
    expect(response.analysis.positiveSignals).toHaveLength(0);
    expect(response.analysis.signals[0]?.title).toContain('حساسة');
    expect(response.analysis.recommendedActions[0]).toContain('لا تشارك');
  });

  it('explains misinformation-related content as requiring verification', () => {
    const assessment: RiskAssessment = {
      level: 'medium',
      score: 58,
      confidence: 0.64,
      signals: [
        {
          id: 'sensational_language',
          title: 'صياغة مثيرة أو صادمة',
          description: 'النص يستخدم لغة صادمة أو مثيرة لشد الانتباه.',
          severity: 'medium'
        }
      ],
      riskSignals: [
        {
          id: 'sensational_language',
          title: 'صياغة مثيرة أو صادمة',
          description: 'النص يستخدم لغة صادمة أو مثيرة لشد الانتباه.',
          severity: 'medium'
        }
      ],
      positiveSignals: [],
      extractedAdvice: [],
      limitations: ['يعتمد التقييم على النص فقط.'],
      recommendedActions: ['تحقق من مصدر الخبر قبل مشاركته.']
    };

    const response = buildAnalysisResponse(assessment);

    expect(response.analysis.explanation).toContain('قد تتطلب التحقق');
    expect(response.analysis.explanation).not.toContain('هذه الأخبار كاذبة');
    expect(response.analysis.recommendedActions.join(' ')).toContain('تحقق من مصدر الخبر');
  });

  it('explains positive awareness context without claiming external verification', () => {
    const assessment: RiskAssessment = {
      level: 'low',
      score: 4,
      confidence: 0.7,
      signals: [],
      riskSignals: [],
      positiveSignals: [
        {
          id: 'official_source_guidance',
          title: 'دعوة إلى متابعة المصادر الرسمية',
          description: 'النص يتضمن دعوة صريحة لمتابعة جهات رسمية أو نشرات معتمدة.',
          severity: 'low'
        }
      ],
      extractedAdvice: ['تابع المصادر الرسمية.'],
      limitations: ['يعتمد التقييم على النص فقط.'],
      recommendedActions: ['واصل الاعتماد على المصادر الرسمية والمستقلة عند تقييم أي محتوى مشابه.']
    };

    const response = buildAnalysisResponse(assessment);

    expect(response.analysis.explanation).toContain('لم يتم رصد مؤشرات لغوية قوية');
    expect(response.analysis.explanation).toContain('دون تحقق خارجي');
    expect(response.analysis.extractedAdvice).toContain('تابع المصادر الرسمية.');
  });
});