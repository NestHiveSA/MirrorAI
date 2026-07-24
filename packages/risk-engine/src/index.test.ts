import { describe, expect, it } from 'vitest';
import { evaluateRisk } from './index.js';

describe('evaluateRisk', () => {
  it('keeps a harmless Arabic message low risk', () => {
    const assessment = evaluateRisk('مرحبا، هذه رسالة ودية للاطمئنان على الأخبار وأتمنى لك يومًا سعيدًا.');

    expect(assessment.level).toBe('low');
    expect(assessment.signals.map((signal) => signal.id)).not.toContain('prize-or-reward-claim');
  });

  it('keeps harmless Arabic informational text low risk', () => {
    const assessment = evaluateRisk('تقرير اليوم يشرح تطورًا إداريًا داخليًا ويعرض معلومات عامة عن المشروع.');

    expect(assessment.level).toBe('low');
    expect(assessment.signals.map((signal) => signal.id)).not.toEqual(
      expect.arrayContaining([
        'unverified_attribution',
        'viral_sharing_pressure',
        'sensational_language',
        'unsupported_certainty'
      ])
    );
  });

  it('detects official-source guidance in benign awareness content', () => {
    const assessment = evaluateRisk('تابع المصادر الرسمية وراجع النشرات الرسمية قبل مشاركة الأخبار.');

    expect(assessment.level).toBe('low');
    expect(assessment.positiveSignals.map((signal) => signal.id)).toContain('official_source_guidance');
    expect(assessment.score).toBeLessThan(10);
  });

  it('detects verification encouragement in awareness content', () => {
    const assessment = evaluateRisk('تحقق من المصدر وقارن مع مصادر موثوقة قبل إعادة النشر.');

    expect(assessment.level).toBe('low');
    expect(assessment.positiveSignals.map((signal) => signal.id)).toContain('verification_encouragement');
    expect(assessment.recommendedActions.join(' ')).not.toContain('كلمات المرور');
  });

  it('detects preventive guidance in awareness content', () => {
    const assessment = evaluateRisk('ينصح باتخاذ الاحتياطات والوقاية وتجنب السلوكيات الخطرة.');

    expect(assessment.level).toBe('low');
    expect(assessment.positiveSignals.map((signal) => signal.id)).toContain('preventive_guidance');
  });

  it('extracts deterministic advice from awareness text without inventing new advice', () => {
    const assessment = evaluateRisk(
      'يُنصح بشرب الماء بانتظام، وتجنب التعرض المباشر لأشعة الشمس، ومتابعة النشرات الجوية الرسمية.'
    );

    expect(assessment.extractedAdvice).toEqual(
      expect.arrayContaining([
        'يُنصح بشرب الماء بانتظام.',
        'تجنب التعرض المباشر لأشعة الشمس.',
        'متابعة النشرات الجوية الرسمية.'
      ])
    );
  });

  it('returns no extracted advice when no clear advisory wording exists', () => {
    const assessment = evaluateRisk('المقال يتناول موضوعًا عامًا ويعرض معطيات دون تعليمات واضحة.');

    expect(assessment.extractedAdvice).toHaveLength(0);
  });

  it('flags vague attribution as requiring verification', () => {
    const assessment = evaluateRisk('أفادت مصادر مطلعة بأن هناك تطورًا مهمًا في الملف.');

    expect(assessment.level).toBe('medium');
    expect(assessment.signals.map((signal) => signal.id)).toContain('unverified_attribution');
    expect(assessment.recommendedActions.join(' ')).toContain('تحقق من مصدر الخبر');
    expect(assessment.recommendedActions.join(' ')).not.toContain('كلمات المرور');
    expect(assessment.recommendedActions.join(' ')).not.toContain('الروابط المختصرة');
  });

  it('flags viral sharing pressure', () => {
    const assessment = evaluateRisk('انشر قبل الحذف وشارك بسرعة مع الجميع.');

    expect(assessment.level).toBe('medium');
    expect(assessment.signals.map((signal) => signal.id)).toContain('viral_sharing_pressure');
  });

  it('flags sensational language', () => {
    const assessment = evaluateRisk('خبر صادم لن تصدق ما حدث بعد قليل.');

    expect(assessment.level).toBe('medium');
    expect(assessment.signals.map((signal) => signal.id)).toContain('sensational_language');
  });

  it('flags unsupported certainty', () => {
    const assessment = evaluateRisk('هذه الحقيقة المطلقة وقد ثبت نهائيًا بدون شك.');

    expect(assessment.level).toBe('medium');
    expect(assessment.signals.map((signal) => signal.id)).toContain('unsupported_certainty');
  });

  it('treats combined suspicious news-like content as higher risk', () => {
    const assessment = evaluateRisk(
      'خبر صادم: أفادت مصادر خاصة أن الحقيقة التي لا يريدونك أن تعرفها مؤكد 100%.'
    );

    expect(assessment.level).toBe('high');
    expect(assessment.signals.map((signal) => signal.id)).toEqual(
      expect.arrayContaining([
        'unverified_attribution',
        'sensational_language',
        'unsupported_certainty'
      ])
    );
    expect(assessment.score).toBeGreaterThan(60);
    expect(assessment.score).toBeLessThan(90);
  });

  it('keeps misinformation-only assessments below certainty-like maximum scores', () => {
    const assessment = evaluateRisk(
      'خبر صادم: أفادت مصادر مطلعة أن الحقيقة المطلقة مؤكدة 100% وشارك بسرعة مع الجميع.'
    );

    expect(assessment.signals.map((signal) => signal.id)).toEqual(
      expect.arrayContaining([
        'unverified_attribution',
        'sensational_language',
        'unsupported_certainty',
        'viral_sharing_pressure'
      ])
    );
    expect(assessment.level).toBe('high');
    expect(assessment.score).toBeLessThan(90);
  });

  it('detects an Arabic prize claim', () => {
    const assessment = evaluateRisk('مبروك قد ربحت أيفون');

    expect(assessment.level).toBe('medium');
    expect(assessment.signals.map((signal) => signal.id)).toContain('prize-or-reward-claim');
    expect(assessment.signals.some((signal) => signal.title.includes('جائزة'))).toBe(true);
  });

  it('detects Arabic urgency language', () => {
    const assessment = evaluateRisk('عاجل، اضغط الآن قبل انتهاء المهلة.');

    expect(assessment.level).toBe('medium');
    expect(assessment.signals.map((signal) => signal.id)).toContain('urgency-pressure-language');
  });

  it('detects Arabic credential requests', () => {
    const assessment = evaluateRisk('أدخل كلمة المرور ورمز التحقق الآن لإكمال التحديث.');

    expect(assessment.level).toBe('high');
    expect(assessment.signals.map((signal) => signal.id)).toContain('credential-request');
  });

  it('does not let positive wording cancel credential-theft risk signals', () => {
    const assessment = evaluateRisk('لأمان حسابك تابع المصادر الرسمية وأدخل كلمة المرور الآن.');

    expect(assessment.level).toBe('high');
    expect(assessment.riskSignals.map((signal) => signal.id)).toEqual(
      expect.arrayContaining(['credential-request', 'urgency-pressure-language'])
    );
    expect(assessment.positiveSignals.map((signal) => signal.id)).toContain('official_source_guidance');
    expect(assessment.recommendedActions.join(' ')).toContain('كلمات المرور');
  });

  it('detects Arabic financial pressure', () => {
    const assessment = evaluateRisk('ادفع الآن رسوم الخدمة أو ستُفرض عليك غرامة.');

    expect(assessment.level).toBe('medium');
    expect(assessment.signals.map((signal) => signal.id)).toContain('financial-pressure');
  });

  it('detects contextual impersonation indicators', () => {
    const assessment = evaluateRisk('رسالة من البنك بخصوص تحديث البيانات عبر القناة الرسمية.');

    expect(assessment.level).toBe('low');
    expect(assessment.signals.map((signal) => signal.id)).toContain('impersonation-context');
  });

  it('does not mark a normal https url as suspicious', () => {
    const assessment = evaluateRisk('يرجى مراجعة الرابط https://example.com للاطلاع على التفاصيل.');

    expect(assessment.signals.map((signal) => signal.id)).not.toContain('suspicious-short-link');
    expect(assessment.level).toBe('low');
  });

  it('flags shortened links as suspicious', () => {
    const assessment = evaluateRisk('راجع الرابط https://bit.ly/abc الآن');

    expect(assessment.signals.map((signal) => signal.id)).toContain('suspicious-short-link');
    expect(assessment.level).toBe('medium');
    expect(assessment.recommendedActions.join(' ')).toContain('الروابط المختصرة');
  });

  it('detects mixed Arabic and English scam language', () => {
    const assessment = evaluateRisk('مبروك! You won a prize, اضغط الآن وأدخل OTP.');

    expect(assessment.level).toBe('high');
    expect(assessment.signals.map((signal) => signal.id)).toEqual(
      expect.arrayContaining(['prize-or-reward-claim', 'urgency-pressure-language', 'credential-request'])
    );
  });

  it('produces a clearly higher assessment for a combined Arabic scam pattern', () => {
    const assessment = evaluateRisk(
      'مبروك، لقد ربحت جائزة. اضغط على الرابط الآن وأدخل كلمة المرور https://bit.ly/offer'
    );

    expect(assessment.level).toBe('high');
    expect(assessment.signals.map((signal) => signal.id)).toEqual(
      expect.arrayContaining([
        'prize-or-reward-claim',
        'urgency-pressure-language',
        'credential-request',
        'suspicious-short-link'
      ])
    );
    expect(assessment.confidence).toBeGreaterThan(0.8);
  });

  it('regresses the manual case for prize wording in Arabic', () => {
    const assessment = evaluateRisk('مبروك قد ربحت أيفون');

    expect(assessment.level).toBe('medium');
    expect(assessment.signals.map((signal) => signal.id)).toContain('prize-or-reward-claim');
    expect(assessment.score).toBeGreaterThan(45);
  });

  it('keeps existing Arabic scam detection working', () => {
    const assessment = evaluateRisk('مبروك، لقد ربحت جائزة. اضغط على الرابط الآن وأدخل كلمة المرور https://bit.ly/offer');

    expect(assessment.level).toBe('high');
    expect(assessment.signals.map((signal) => signal.id)).toEqual(
      expect.arrayContaining([
        'prize-or-reward-claim',
        'urgency-pressure-language',
        'credential-request',
        'suspicious-short-link'
      ])
    );
    expect(assessment.score).toBeGreaterThan(90);
    expect(assessment.recommendedActions.join(' ')).toContain('كلمات المرور');
    expect(assessment.recommendedActions.join(' ')).toContain('الروابط المختصرة');
  });

  it('keeps misinformation detection working alongside new positive signals', () => {
    const assessment = evaluateRisk('خبر صادم ومؤكد 100% حسب مصادر خاصة.');

    expect(assessment.level).toBe('high');
    expect(assessment.riskSignals.map((signal) => signal.id)).toEqual(
      expect.arrayContaining([
        'sensational_language',
        'unsupported_certainty',
        'unverified_attribution'
      ])
    );
  });

  it('handles awareness-style weather content as low risk with positive indicators', () => {
    const assessment = evaluateRisk(
      'ارتفاع درجات الحرارة مع اقتراب شهر غشت. يُنصح المواطنين بشرب الماء بانتظام، وتجنب التعرض المباشر والطويل لأشعة الشمس، والحد من الأنشطة المجهدة خلال الساعات الأكثر حرارة. كما يُستحسن متابعة النشرات الجوية الرسمية وبلاغات اليقظة لمعرفة تطورات حالة الطقس. الوقاية تبدأ بالمعلومة الصحيحة: تابع المصادر الرسمية وخذ الاحتياطات المناسبة.'
    );

    expect(assessment.level).toBe('low');
    expect(assessment.riskSignals.map((signal) => signal.id)).not.toEqual(
      expect.arrayContaining(['credential-request', 'prize-or-reward-claim'])
    );
    expect(assessment.positiveSignals.map((signal) => signal.id)).toEqual(
      expect.arrayContaining([
        'preventive_guidance',
        'official_source_guidance'
      ])
    );
    expect(assessment.extractedAdvice.length).toBeGreaterThan(0);
    expect(assessment.recommendedActions.join(' ')).not.toContain('كلمات المرور');
    expect(assessment.recommendedActions.join(' ')).not.toContain('الروابط المختصرة');
  });

  it('avoids high-risk false positives for تحذير/خطر/عاجل in awareness context', () => {
    const assessment = evaluateRisk(
      'تحذير عاجل: خطر الإجهاد الحراري. يُنصح باتخاذ الاحتياطات ومتابعة المصادر الرسمية.'
    );

    expect(assessment.level).toBe('low');
    expect(assessment.riskSignals.map((signal) => signal.id)).toContain('urgency-pressure-language');
    expect(assessment.positiveSignals.map((signal) => signal.id)).toEqual(
      expect.arrayContaining(['preventive_guidance', 'official_source_guidance'])
    );
  });

  it('does not classify generic ينصح as preventive guidance', () => {
    const assessment = evaluateRisk('يُنصح الجميع بالاستعداد من الآن.');

    expect(assessment.positiveSignals.map((signal) => signal.id)).not.toContain('preventive_guidance');
  });

  it('does not extract manipulative advice-like calls', () => {
    const assessment = evaluateRisk('شارك بسرعة مع أصدقائك. استعد من الآن.');

    expect(assessment.extractedAdvice).toHaveLength(0);
  });

  it('detects viral sharing from شارك بسرعة variant', () => {
    const assessment = evaluateRisk('شارك بسرعة مع أصدقائك وعائلتك قبل حذف الخبر.');

    expect(assessment.riskSignals.map((signal) => signal.id)).toContain('viral_sharing_pressure');
  });

  it('detects unsupported certainty from مؤكد بنسبة 100%', () => {
    const assessment = evaluateRisk('الخبر مؤكد بنسبة 100% ولا شك في ذلك.');

    expect(assessment.riskSignals.map((signal) => signal.id)).toContain('unsupported_certainty');
  });

  it('detects vague-source phrases including معلومات متداولة', () => {
    const assessment = evaluateRisk('بحسب معلومات متداولة، هناك قرار جديد.');

    expect(assessment.riskSignals.map((signal) => signal.id)).toContain('unverified_attribution');
  });

  it('does not downgrade strong risk context via generic positive wording', () => {
    const assessment = evaluateRisk(
      'عاجل ومؤكد: قرار جديد سيغيّر أسعار الإنترنت قريبًا. أفادت مصادر مطلعة. الخبر مؤكد بنسبة 100% رغم عدم صدور أي إعلان رسمي. يُنصح الجميع بالاستعداد. شارك المنشور بسرعة مع أصدقائك.'
    );

    expect(assessment.level).toBe('high');
    expect(assessment.riskSignals.map((signal) => signal.id)).toEqual(
      expect.arrayContaining([
        'urgency-pressure-language',
        'unverified_attribution',
        'unsupported_certainty',
        'viral_sharing_pressure'
      ])
    );
    expect(assessment.positiveSignals.map((signal) => signal.id)).not.toContain('preventive_guidance');
    expect(assessment.extractedAdvice).not.toEqual(
      expect.arrayContaining(['يُنصح الجميع بالاستعداد من الآن.'])
    );
  });

  it('shows credential recommendation only when credential signals exist', () => {
    const nonCredentialAssessment = evaluateRisk('خبر صادم: حسب مصادر خاصة، القرار مؤكد بنسبة 100%.');
    const credentialAssessment = evaluateRisk('لأمان حسابك أدخل كلمة المرور الآن.');

    expect(nonCredentialAssessment.recommendedActions.join(' ')).not.toContain('كلمات المرور');
    expect(credentialAssessment.recommendedActions.join(' ')).toContain('كلمات المرور');
  });

  it('shows suspicious-link recommendations only when suspicious-link signal exists', () => {
    const noLinkAssessment = evaluateRisk('الخبر مؤكد بنسبة 100% وشارك بسرعة مع الجميع.');
    const linkAssessment = evaluateRisk('راجع الرابط https://bit.ly/offer قبل متابعة الرسالة.');

    expect(noLinkAssessment.recommendedActions.join(' ')).not.toContain('تحقق من الرابط قبل فتحه');
    expect(noLinkAssessment.recommendedActions.join(' ')).not.toContain('الروابط المختصرة');
    expect(linkAssessment.recommendedActions.join(' ')).toContain('تحقق من الرابط قبل فتحه');
    expect(linkAssessment.recommendedActions.join(' ')).toContain('الروابط المختصرة');
  });
});