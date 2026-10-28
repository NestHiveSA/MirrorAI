import type { AnalysisResult, RiskLevel } from "@mirrorai/shared";

// Arabic, user-facing wording for engine signals. The API keeps stable ids and
// English diagnostics; the app owns what the user reads.
export type SignalCopy = {
  title: string;
  description: string;
  tip: string;
};

export const signalCopy: Record<string, SignalCopy> = {
  "SIG-001": {
    title: "استعجال وضغط",
    description: "الرسالة تدفعك لتتصرف بسرعة أو قبل انتهاء مهلة، حتى لا تجد وقتاً للتحقق.",
    tip: "خذ وقتك. الجهات الحقيقية لا تلغي حسابك خلال دقائق."
  },
  "SIG-003": {
    title: "طلب بيانات شخصية",
    description: "الرسالة تطلب معلومات حساسة مثل رقم البطاقة أو البطاقة الوطنية أو الحساب.",
    tip: "لا ترسل بياناتك الشخصية عبر رسالة أو رابط وصلك فجأة."
  },
  "SIG-004": {
    title: "طلب دفع أو تحويل",
    description: "الرسالة تطلب منك الدفع أو تحويل مبلغ أو أداء رسوم.",
    tip: "لا تدفع أي رسوم من رابط في رسالة. ادخل إلى التطبيق أو الموقع الرسمي بنفسك."
  },
  "SIG-005": {
    title: "وعد بجائزة أو ربح",
    description: "الرسالة تعدك بجائزة أو هدية أو ربح لم تطلبه.",
    tip: "إذا لم تشارك في مسابقة، فأنت لم تربح شيئاً."
  },
  "SIG-006": {
    title: "انتحال جهة معروفة",
    description: "الرسالة تتحدث باسم بنك أو شركة أو إدارة لتكسب ثقتك.",
    tip: "تواصل مع الجهة عبر رقمها أو تطبيقها الرسمي، لا عبر تفاصيل الرسالة."
  },
  "SIG-007": {
    title: "رابط مشبوه",
    description: "الرابط لا يشبه موقعاً رسمياً، أو ينتهي بامتداد يكثر استعماله في الاحتيال.",
    tip: "لا تفتح الرابط. اكتب عنوان الموقع الرسمي بنفسك."
  },
  "SIG-008": {
    title: "طلب السرية",
    description: "الرسالة تطلب منك ألا تخبر أحداً، لتعزلك عمّن قد ينبّهك.",
    tip: "اسأل شخصاً تثق به قبل أن تتصرف."
  },
  "SIG-010": {
    title: "تخويف وتهديد",
    description: "الرسالة تهددك بإغلاق حساب أو غرامة أو متابعة قانونية لتدفعك إلى الخوف.",
    tip: "الخوف يدفع إلى القرار السريع. توقف وتحقق أولاً."
  },
  "SIG-013": {
    title: "طلب كلمة المرور",
    description: "الرسالة تطلب كلمة المرور أو بيانات الدخول إلى حسابك.",
    tip: "لا أحد يحتاج كلمة مرورك، ولا حتى البنك أو خدمة العملاء."
  },
  "SIG-014": {
    title: "طلب رمز التحقق",
    description: "الرسالة تطلب الكود الذي وصلك في SMS. هذا الكود هو مفتاح حسابك.",
    tip: "الكود ديالك ليك بوحدك. لا تعطه لأي أحد مهما قال."
  },
  "SIG-017": {
    title: "رابط مختصر أو مخفي",
    description: "الرابط مختصر أو رقمي، فلا يمكنك أن ترى أين سيأخذك.",
    tip: "لا تفتح الروابط المختصرة القادمة من مصدر لا تعرفه."
  },
  "SIG-020": {
    title: "مصادر غير محددة",
    description: "المعلومة منسوبة إلى «مصادر» لا يذكر النص من هي.",
    tip: "ابحث عن نفس الخبر في مصدر معروف قبل أن تصدّقه."
  },
  "SIG-021": {
    title: "ضغط على المشاركة",
    description: "النص يطلب منك نشره بسرعة أو «قبل الحذف».",
    tip: "لا تشارك قبل أن تتحقق. المشاركة السريعة هي ما يريده ناشر الخبر."
  },
  "SIG-022": {
    title: "صياغة صادمة",
    description: "النص يستعمل كلمات مثيرة أو صادمة لجذب انتباهك.",
    tip: "العنوان الصادم لا يكفي. اقرأ المصدر والتاريخ."
  },
  "SIG-023": {
    title: "يقين بدون دليل",
    description: "النص يدّعي يقيناً مطلقاً دون مصدر واضح.",
    tip: "اسأل: من قال هذا؟ وأين الدليل؟"
  }
};

const fallbackSignalCopy: SignalCopy = {
  title: "إشارة تستحق الانتباه",
  description: "رصد MirrorAI نمطاً يستحق المراجعة في هذا المحتوى.",
  tip: "تحقق من المصدر قبل أن تتصرف."
};

export function copyForSignal(signalId: string): SignalCopy {
  return signalCopy[signalId] ?? fallbackSignalCopy;
}

export function levelLabel(level: RiskLevel | null): string {
  if (level === "CRITICAL") return "مرتفع جداً";
  if (level === "HIGH") return "مرتفع";
  if (level === "MODERATE") return "يستدعي الانتباه";
  if (level === "LOW") return "منخفض";
  return "لا إشارات واضحة";
}

export function levelClassName(level: RiskLevel | null): string {
  if (level === "CRITICAL" || level === "HIGH") return "risk-band-high";
  if (level === "MODERATE") return "risk-band-caution";
  return "risk-band-low";
}

export function summaryFor(result: AnalysisResult): string {
  if (result.signals.length === 0) {
    return "لم نرصد إشارات خطر واضحة في هذا المحتوى. هذا لا يعني أنه آمن بالضرورة.";
  }

  if (result.risk_level === "CRITICAL" || result.risk_level === "HIGH") {
    return "هذا المحتوى يجمع عدة إشارات معروفة في رسائل الاحتيال. توقف قبل أن تضغط أو تدفع أو ترسل أي معلومة.";
  }

  return "في هذا المحتوى إشارات تستحق الانتباه. تحقق منه قبل أن تتفاعل معه أو تشاركه.";
}

export function actionsFor(result: AnalysisResult): string[] {
  if (result.signals.length === 0) {
    return ["إذا طلب منك أحد لاحقاً كوداً أو دفعاً أو بيانات، تحقق من الجهة عبر قناتها الرسمية."];
  }

  const tips = result.signals.map((signal) => copyForSignal(signal.signal_id).tip);
  tips.push("تحقق من الجهة المرسلة عبر رقمها أو تطبيقها الرسمي، وليس عبر الرسالة.");

  return [...new Set(tips)];
}

export const SCORE_MEANING_TEXT =
  "تمثل هذه الدرجة قوة وتراكم الإشارات المكتشفة، وليست نسبة احتمال أن يكون المحتوى كاذباً أو احتيالياً.";

export const LIMITATIONS = [
  "التحليل يعتمد على نص الرسالة فقط، ولا يتحقق من هوية المرسل.",
  "لا يحكم MirrorAI بأن المحتوى صحيح أو كاذب، بل يلفت انتباهك إلى إشارات تستحق التحقق.",
  "قد تفوته رسائل احتيال جديدة، وقد ينبّه أحياناً بدون داعٍ. القرار الأخير لك."
];

export const EMPTY_INPUT_MESSAGE = "الصق رسالة أو منشوراً أولاً.";
export const API_ERROR_MESSAGE = "تعذر إكمال التحليل حالياً. حاول مرة أخرى.";
