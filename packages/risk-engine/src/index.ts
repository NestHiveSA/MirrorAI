import type { RiskLevel, RiskSignal } from '@mirrorai/shared';

const prizeRewardPatterns: RegExp[] = [
  /مبروك/i,
  /ربحت/i,
  /لقد\s+ربحت/i,
  /فزت/i,
  /جائزة/i,
  /هدية/i,
  /مكافأة/i,
  /\bwon\b/i,
  /\bprize\b/i,
  /\breward\b/i
];

const urgencyPatterns: RegExp[] = [
  /عاجل/i,
  /الآن/i,
  /فورًا/i,
  /فوراً/i,
  /فورا/i,
  /حالًا/i,
  /حالاً/i,
  /حالا/i,
  /آخر\s*فرصة/i,
  /قبل\s*انتهاء\s*المهلة/i,
  /\burgent\b/i,
  /\bnow\b/i,
  /click\s+now/i
];

const credentialPatterns: RegExp[] = [
  /كلمة\s*المرور/i,
  /رمز\s*التحقق/i,
  /رمز\s*التأكيد/i,
  /\bOTP\b/i,
  /\bPIN\b/i,
  /رقم\s*البطاقة/i,
  /\bpassword\b/i,
  /verification\s*code/i
];

const financialPressurePatterns: RegExp[] = [
  /ادفع\s*الآن/i,
  /تحويل\s*الأموال/i,
  /تحويل\s*مبلغ/i,
  /رسوم/i,
  /غرامة/i,
  /مستحقات/i,
  /\bpay\s+now\b/i,
  /\btransfer\s+money\b/i,
  /\bwire\s+money\b/i
];

const impersonationPatterns: RegExp[] = [/البنك/i, /الشرطة/i, /الحكومة/i, /الضرائب/i];

const unverifiedAttributionPatterns: RegExp[] = [
  /مصادر\s+مطلع(?:ة|ين)?/i,
  /مصادر\s+خاصة/i,
  /مصدر\s+موثوق/i,
  /حسب\s+مصادر/i,
  /تشير\s+مصادر/i,
  /أفادت\s+مصادر/i,
  /معلومات\s+متداولة/i
];

const viralSharingPatterns: RegExp[] = [
  /انشر\s+قبل\s+الحذف/i,
  /شارك\s+بسرعة/i,
  /شارك\s+المنشور\s+بسرعة/i,
  /شارك\s+\S+\s+بسرعة/i,
  /شارك\s+مع\s+الجميع/i,
  /شارك\s+مع\s+أصدقائك/i,
  /أرسل\s+للجميع/i,
  /انشر\s+الآن/i,
  /قبل\s+حذف\s+الخبر/i,
  /انشر\s+هذا\s+الخبر/i,
  /لا\s+تدعهم\s+يخفون\s+الحقيقة/i
];

const sensationalLanguagePatterns: RegExp[] = [
  /خبر\s+صادم/i,
  /لن\s+تصدق/i,
  /مفاجأة\s+كبرى/i,
  /الحقيقة\s+التي\s+لا\s+يريدونك\s+أن\s+تعرفها/i,
  /فضيحة\s+كبرى/i
];

const unsupportedCertaintyPatterns: RegExp[] = [
  /مؤكد\s*100%/i,
  /مؤكد\s+بنسبة\s*100%/i,
  /الخبر\s+مؤكد/i,
  /بدون\s+شك/i,
  /لا\s+شك/i,
  /بالتأكيد\s+دون\s+مصدر\s+واضح/i,
  /الحقيقة\s+المطلقة/i,
  /لا\s+يمكن\s+إنكار/i,
  /ثبت\s+نهائي(?:اً|ا|ًا)?/i
];

const officialSourceGuidancePatterns: RegExp[] = [
  /تابع\s+المصادر\s+الرسمية/i,
  /متابعة\s+المصادر\s+الرسمية/i,
  /راجع\s+المصادر\s+الرسمية/i,
  /تابع\s+النشرات\s+الرسمية/i,
  /تابع\s+بلاغات\s+اليقظة/i,
  /تحقق\s+من\s+الجهات\s+الرسمية/i,
  /النشرات\s+الجوية\s+الرسمية/i,
  /بلاغات\s+اليقظة/i
];

const verificationEncouragementPatterns: RegExp[] = [
  /تحقق\s+من\s+المعلومة/i,
  /تحقق\s+من\s+المصدر/i,
  /تأكد\s+من\s+المصدر/i,
  /قارن\s+مع\s+مصادر\s+موثوقة/i,
  /ابحث\s+في\s+مصادر\s+مستقلة/i,
  /مصادر\s+مستقلة\s+وموثوقة/i
];

const preventiveGuidancePatterns: RegExp[] = [
  /تجنب/i,
  /اشرب\s+الماء/i,
  /شرب\s+الماء/i,
  /تجنب\s+التعرض/i,
  /احرص\s+على/i,
  /سلامتك/i,
  /حافظ\s+على/i,
  /اتخذ\s+الاحتياطات/i,
  /متابعة\s+النشرات\s+الرسمية/i,
  /تحقق\s+من\s+المصدر/i,
  /الوقاية/i,
  /الحيطة/i,
  /خذ\s+الاحتياطات/i
];

const genericAdvisoryCuePatterns: RegExp[] = [/ي[ُ\u064f]?نصح/i, /يستحسن/i, /ننصح/i];

const manipulativeOrRiskCallPatterns: RegExp[] = [
  /شارك\s+بسرعة/i,
  /انشر\s+الآن/i,
  /أرسل\s+للجميع/i,
  /شارك\s+مع\s+أصدقائك/i,
  /استعد\s+من\s+الآن/i,
  /ادفع\s+الآن/i,
  /أدخل\s+كلمة\s*المرور/i,
  /اضغط\s+على\s+الرابط/i,
  /أرسل\s+رمز\s*التحقق/i,
  /أدخل\s+رمز\s*التحقق/i,
  /بالشراء\s+الآن/i,
  /بالمشاركة\s+بسرعة/i
];

const awarenessContextPatterns: RegExp[] = [
  /الوقاية/i,
  /الاحتياطات/i,
  /المصادر\s+الرسمية/i,
  /بلاغات\s+اليقظة/i,
  /تابع\s+المصادر/i,
  /تجنب\s+التعرض/i,
  /اشرب\s+الماء/i,
  /سلامتك/i,
  /تحقق\s+من\s+المصدر/i
];

const adviceCuePatterns: RegExp[] = [
  /ي[ُ\u064f]?نصح/i,
  /يستحسن/i,
  /تجنب/i,
  /اشرب\s+الماء/i,
  /شرب\s+الماء/i,
  /احرص\s+على/i,
  /حافظ\s+على/i,
  /اتخذ\s+الاحتياطات/i,
  /خذ\s+الاحتياطات/i,
  /تابع\s+المصادر\s+الرسمية/i,
  /متابعة\s+المصادر\s+الرسمية/i,
  /متابعة\s+النشرات\s+الجوية\s+الرسمية/i,
  /راجع\s+المصادر\s+الرسمية/i,
  /تحقق\s+من\s+المصدر/i,
  /تحقق\s+من\s+المعلومة/i,
  /قارن\s+مع\s+مصادر\s+موثوقة/i,
  /ابحث\s+في\s+مصادر\s+مستقلة/i,
  /الحد\s+من/i,
  /سلامتك/i
];

const strongRiskContextPatterns: RegExp[] = [
  ...credentialPatterns,
  ...financialPressurePatterns,
  ...viralSharingPatterns,
  ...unsupportedCertaintyPatterns,
  ...unverifiedAttributionPatterns
];

const misinformationSignalIds = new Set([
  'unverified_attribution',
  'viral_sharing_pressure',
  'sensational_language',
  'unsupported_certainty'
]);

const scamOrDirectHarmSignalIds = new Set([
  'prize-or-reward-claim',
  'urgency-pressure-language',
  'credential-request',
  'financial-pressure',
  'impersonation-context',
  'suspicious-short-link'
]);

const positiveSignalIds = new Set([
  'official_source_guidance',
  'verification_encouragement',
  'preventive_guidance'
]);

const suspiciousLinkHosts = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'rebrand.ly', 'cutt.ly'];

function hasAnyPattern(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

function extractUrlCandidates(text: string): string[] {
  const matches = text.match(/https?:\/\/[^\s<>'"()]+|(?:\b(?:bit\.ly|tinyurl\.com|t\.co|goo\.gl|rebrand\.ly|cutt\.ly)\/[^\s<>'"()]+)/gi);

  return matches ?? [];
}

function normalizeUrlCandidate(candidate: string): string {
  return candidate.replace(/[.,!?؛،:]+$/u, '');
}

function addSignal(signals: RiskSignal[], signal: RiskSignal): void {
  signals.push(signal);
}

function splitArabicSentences(text: string): string[] {
  return text
    .split(/[\n.!؟؛]+/u)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

function normalizeAdviceLine(line: string): string {
  const cleaned = line.replace(/^[-*\u2022\s]+/u, '').replace(/\s+/g, ' ').trim();
  if (cleaned.length === 0) {
    return '';
  }

  return /[.!؟]$/u.test(cleaned) ? cleaned : `${cleaned}.`;
}

function extractAdviceFromText(text: string): string[] {
  const lines = splitArabicSentences(text);
  const advice = new Set<string>();

  for (const line of lines) {
    if (!hasAnyPattern(line, adviceCuePatterns)) {
      continue;
    }

    const normalizedLine = line.replace(/^كما\s+/u, '').trim();
    const fragments = normalizedLine
      .split(/(?:،|,|\s+و(?=تجنب|متابعة|تابع|تحقق|تأكد|الحد\s+من|احرص|حافظ|اتخذ|خذ))/u)
      .map((fragment) => normalizeAdviceLine(fragment))
      .filter((fragment) => fragment.length >= 8);

    for (const fragment of fragments) {
      if (hasAnyPattern(fragment, adviceCuePatterns) && !hasAnyPattern(fragment, manipulativeOrRiskCallPatterns)) {
        advice.add(fragment);
      }
    }
  }

  return Array.from(advice).slice(0, 6);
}

function hasMisinformationSignal(signals: RiskSignal[]): boolean {
  return signals.some((signal) => misinformationSignalIds.has(signal.id));
}

function hasScamOrDirectHarmSignal(signals: RiskSignal[]): boolean {
  return signals.some((signal) => scamOrDirectHarmSignalIds.has(signal.id));
}

function hasPositiveSignal(signals: RiskSignal[]): boolean {
  return signals.some((signal) => positiveSignalIds.has(signal.id));
}

function isMisinformationOnlyAssessment(signals: RiskSignal[]): boolean {
  return signals.length > 0 && signals.every((signal) => misinformationSignalIds.has(signal.id) || signal.id === 'low-context');
}

function hasMeaningfulRiskSignal(signals: RiskSignal[]): boolean {
  return signals.some((signal) => signal.id !== 'low-context');
}

function classifyLevel(signals: RiskSignal[]): RiskLevel {
  const highCount = signals.filter((signal) => signal.severity === 'high').length;
  const mediumCount = signals.filter((signal) => signal.severity === 'medium').length;

  if (highCount > 0) {
    return 'high';
  }

  if (mediumCount >= 3) {
    return 'high';
  }

  if (mediumCount >= 1) {
    return 'medium';
  }

  return 'low';
}

function confidenceFor(signalCount: number): number {
  if (signalCount >= 4) return 0.91;
  if (signalCount === 3) return 0.84;
  if (signalCount === 2) return 0.7;
  if (signalCount === 1) return 0.56;
  return 0.35;
}

function scoreForSignal(signal: RiskSignal): number {
  if (misinformationSignalIds.has(signal.id)) {
    return 6;
  }

  if (signal.severity === 'high') {
    return 16;
  }

  if (signal.severity === 'medium') {
    return 10;
  }

  return 4;
}

function baseScoreForLevel(level: RiskLevel): number {
  if (level === 'high') return 68;
  if (level === 'medium') return 38;
  return 20;
}

function riskScoreFromSignals(level: RiskLevel, riskSignals: RiskSignal[], positiveSignals: RiskSignal[]): number {
  if (!hasMeaningfulRiskSignal(riskSignals) && positiveSignals.length > 0) {
    const positiveContextBoost = Math.min(positiveSignals.length * 2, 6);
    return Math.max(2, 8 - positiveContextBoost);
  }

  if (isMisinformationOnlyAssessment(riskSignals)) {
    const base = level === 'high' ? 52 : level === 'medium' ? 32 : 18;
    const signalScore = riskSignals.reduce((total, signal) => total + scoreForSignal(signal), 0);
    const evidenceBonus = Math.min(riskSignals.length, 5);

    return Math.min(base + signalScore + evidenceBonus, 86);
  }

  const signalScore = riskSignals.reduce((total, signal) => total + scoreForSignal(signal), 0);
  const evidenceBonus = Math.min(riskSignals.length * 2, 8);

  return Math.min(baseScoreForLevel(level) + signalScore + evidenceBonus, 100);
}

function buildLimitations(riskSignals: RiskSignal[]): string[] {
  const limitations = [
    'يعتمد التقييم على النص المرسل فقط ولا يحدد صحة الخبر أو خطأه.',
    'لا يجري هذا الإصدار تحققًا خارجيًا من المصادر أو السجل الزمني أو السياق الكامل.'
  ];

  if (hasMisinformationSignal(riskSignals)) {
    limitations.push('الإشارات اللغوية لا تعني أن المحتوى غير صحيح، لكنها تشير إلى حاجة لمراجعة إضافية.');
  }

  if (!hasMisinformationSignal(riskSignals)) {
    limitations.push('لا يجري هذا الإصدار فحصًا خارجيًا لسمعة النطاقات أو محتوى الصفحة المقصودة.');
  }

  return limitations;
}

function buildRecommendedActions(riskSignals: RiskSignal[], positiveSignals: RiskSignal[]): string[] {
  const hasMisinformation = hasMisinformationSignal(riskSignals);
  const hasScamOrDirectHarm = hasScamOrDirectHarmSignal(riskSignals);
  const hasSuspiciousShortLink = riskSignals.some((signal) => signal.id === 'suspicious-short-link');
  const hasImpersonationOrScamSignal = riskSignals.some((signal) =>
    ['impersonation-context', 'prize-or-reward-claim', 'financial-pressure', 'urgency-pressure-language'].includes(signal.id)
  );
  const hasCredentialSignal = riskSignals.some((signal) => signal.id === 'credential-request');
  const hasPositive = hasPositiveSignal(positiveSignals);

  const actions: string[] = [];

  if (hasMisinformation) {
    actions.push(
      'تحقق من مصدر الخبر قبل مشاركته.',
      'ابحث عن نفس المعلومة في مصادر مستقلة وموثوقة.',
      'تحقق من تاريخ النشر والسياق.',
      'لا تعتمد على العنوان وحده للحكم على المحتوى.'
    );
  }

  if (hasCredentialSignal) {
    actions.push(
      'لا تشارك كلمات المرور أو رموز التحقق أو بيانات البطاقة.'
    );
  }

  if (hasSuspiciousShortLink) {
    actions.push(
      'تحقق من الرابط قبل فتحه.',
      'تجنب الروابط المختصرة غير الموثوقة.'
    );
  }

  if (hasImpersonationOrScamSignal || (hasScamOrDirectHarm && !hasCredentialSignal && !hasSuspiciousShortLink)) {
    actions.push('تحقق من الجهة المرسلة عبر قناة مستقلة وموثوقة.');
  }

  if (!hasMisinformation && !hasScamOrDirectHarm && hasPositive) {
    actions.push(
      'واصل الاعتماد على المصادر الرسمية والمستقلة عند تقييم أي محتوى مشابه.',
      'احتفظ بنفس النهج الوقائي قبل إعادة النشر أو اتخاذ قرار.'
    );
  }

  if (actions.length === 0) {
    actions.push('تعامل بحذر واطلب مصدرًا أوضح قبل مشاركة المحتوى أو التفاعل معه.');
  }

  return actions;
}

export function evaluateRisk(input: string) {
  const normalized = input.trim();
  const riskSignals: RiskSignal[] = [];
  const positiveSignals: RiskSignal[] = [];

  if (hasAnyPattern(normalized, prizeRewardPatterns)) {
    addSignal(riskSignals, {
      id: 'prize-or-reward-claim',
      title: 'ادعاء جائزة أو ربح',
      description: 'النص يتضمن عبارات مرتبطة بجائزة أو ربح أو هدية، وهو نمط شائع في الرسائل الاحتيالية.',
      severity: 'medium'
    });
  }

  if (hasAnyPattern(normalized, urgencyPatterns)) {
    const awarenessContext = hasAnyPattern(normalized, awarenessContextPatterns);
    const strongRiskContext = hasAnyPattern(normalized, strongRiskContextPatterns);
    const manipulativeContext = hasAnyPattern(normalized, manipulativeOrRiskCallPatterns);
    const shouldDowngradeUrgency = awarenessContext && !strongRiskContext && !manipulativeContext;

    addSignal(riskSignals, {
      id: 'urgency-pressure-language',
      title: 'لغة استعجال وضغط',
      description: shouldDowngradeUrgency
        ? 'النص يتضمن كلمات استعجال، لكنها واردة ضمن سياق توعوي أو وقائي يتطلب قراءة متوازنة.'
        : 'النص يدفع إلى اتخاذ إجراء سريع أو قبل انتهاء المهلة، وهي إشارة ضغط شائعة.',
      severity: shouldDowngradeUrgency ? 'low' : 'medium'
    });
  }

  if (hasAnyPattern(normalized, credentialPatterns)) {
    addSignal(riskSignals, {
      id: 'credential-request',
      title: 'طلب بيانات اعتماد حساسة',
      description: 'النص يطلب كلمة المرور أو رمز التحقق أو بيانات بطاقة، وهو طلب شديد الحساسية.',
      severity: 'high'
    });
  }

  if (hasAnyPattern(normalized, financialPressurePatterns)) {
    addSignal(riskSignals, {
      id: 'financial-pressure',
      title: 'ضغط مالي أو طلب دفع',
      description: 'النص يطلب الدفع أو التحويل أو يلوّح برسوم وغرامات، وهو نمط يستدعي الحذر.',
      severity: 'medium'
    });
  }

  if (hasAnyPattern(normalized, impersonationPatterns)) {
    addSignal(riskSignals, {
      id: 'impersonation-context',
      title: 'إشارة انتحال جهة معروفة',
      description: 'النص يذكر البنك أو الشرطة أو الحكومة أو الضرائب، وهي إشارة سياقية قد تستغل الثقة.',
      severity: 'low'
    });
  }

  if (hasAnyPattern(normalized, unverifiedAttributionPatterns)) {
    addSignal(riskSignals, {
      id: 'unverified_attribution',
      title: 'صياغة تعزو المعلومة إلى مصادر غير محددة',
      description: 'النص يستخدم عبارات مثل مصادر مطلعة أو حسب مصادر، وهي إشارة تحتاج إلى تحقق مستقل.',
      severity: 'medium'
    });
  }

  if (hasAnyPattern(normalized, viralSharingPatterns)) {
    addSignal(riskSignals, {
      id: 'viral_sharing_pressure',
      title: 'ضغط على المشاركة السريعة',
      description: 'النص يحث على النشر أو المشاركة السريعة، وهو أسلوب شائع لدفع المحتوى إلى الانتشار.',
      severity: 'medium'
    });
  }

  if (hasAnyPattern(normalized, sensationalLanguagePatterns)) {
    addSignal(riskSignals, {
      id: 'sensational_language',
      title: 'صياغة مثيرة أو صادمة',
      description: 'النص يستخدم لغة صادمة أو مثيرة لشد الانتباه، ما يستدعي مراجعة إضافية.',
      severity: 'medium'
    });
  }

  if (hasAnyPattern(normalized, unsupportedCertaintyPatterns)) {
    addSignal(riskSignals, {
      id: 'unsupported_certainty',
      title: 'يقين مطلق أو غير مسند',
      description: 'النص يتحدث بيقين شديد أو مطلق دون إسناد كافٍ، وهو مؤشر يحتاج إلى تحقق.',
      severity: 'medium'
    });
  }

  if (hasAnyPattern(normalized, officialSourceGuidancePatterns)) {
    addSignal(positiveSignals, {
      id: 'official_source_guidance',
      title: 'دعوة إلى متابعة المصادر الرسمية',
      description: 'النص يتضمن دعوة صريحة لمتابعة جهات رسمية أو نشرات معتمدة.',
      severity: 'low'
    });
  }

  if (hasAnyPattern(normalized, verificationEncouragementPatterns)) {
    addSignal(positiveSignals, {
      id: 'verification_encouragement',
      title: 'تشجيع على التحقق من المعلومة',
      description: 'النص يشجع على التحقق من المصادر أو مقارنة المعلومة قبل التفاعل معها.',
      severity: 'low'
    });
  }

  const hasPreventiveCore = hasAnyPattern(normalized, preventiveGuidancePatterns);
  const hasGenericAdvisoryCue = hasAnyPattern(normalized, genericAdvisoryCuePatterns);
  const hasManipulativeOrRiskCall = hasAnyPattern(normalized, manipulativeOrRiskCallPatterns);
  const hasStrongRiskContext = hasAnyPattern(normalized, strongRiskContextPatterns);
  const shouldAddPreventiveGuidance =
    (hasPreventiveCore || (hasGenericAdvisoryCue && hasAnyPattern(normalized, awarenessContextPatterns))) &&
    !hasManipulativeOrRiskCall &&
    !hasStrongRiskContext;

  if (shouldAddPreventiveGuidance) {
    addSignal(positiveSignals, {
      id: 'preventive_guidance',
      title: 'إرشادات وقائية أو توعوية',
      description: 'النص يحتوي على توجيهات وقائية أو سلوكية تهدف إلى تقليل المخاطر.',
      severity: 'low'
    });
  }

  const urlCandidates = extractUrlCandidates(normalized);
  const hasSuspiciousLink = urlCandidates.some((candidate) => {
    const sanitized = normalizeUrlCandidate(candidate);
    const normalizedUrl = sanitized.startsWith('http://') || sanitized.startsWith('https://')
      ? sanitized
      : `https://${sanitized}`;
    const hostname = (normalizedUrl
      .replace(/^https?:\/\//i, '')
      .split(/[/?#]/, 1)[0] ?? '')
      .toLowerCase();

    return suspiciousLinkHosts.some((host) => hostname === host || hostname.endsWith(`.${host}`));
  });

  if (hasSuspiciousLink) {
    addSignal(riskSignals, {
      id: 'suspicious-short-link',
      title: 'رابط مختصر يحد من الوضوح',
      description: 'تم رصد رابط مختصر مثل bit.ly أو tinyurl، وهو أقل شفافية ويستحق الحذر.',
      severity: 'medium'
    });
  }

  if (normalized.length < 24) {
    addSignal(riskSignals, {
      id: 'low-context',
      title: 'سياق محدود',
      description: 'النص قصير أو يفتقر إلى مؤشرات كافية، ما يقلل من دقة التقييم.',
      severity: 'low'
    });
  }

  const level = classifyLevel(riskSignals);
  const confidence = confidenceFor(riskSignals.length + Math.min(positiveSignals.length, 2));
  const score = riskScoreFromSignals(level, riskSignals, positiveSignals);
  const extractedAdvice = extractAdviceFromText(normalized);

  return {
    level,
    score,
    confidence,
    signals: riskSignals,
    riskSignals,
    positiveSignals,
    extractedAdvice,
    limitations: buildLimitations(riskSignals),
    recommendedActions: buildRecommendedActions(riskSignals, positiveSignals)
  };
}
