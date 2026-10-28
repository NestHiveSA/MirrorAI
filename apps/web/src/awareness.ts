// Digital Awareness Index (DAI): the 24 statements and scoring proposed in the
// Digital Awareness Theory paper (6 dimensions × 4 statements, Likert 1–5).
// The questionnaire is a pilot instrument; the app presents it as such.

export type AwarenessDimension = {
  id: string;
  title: string;
  tip: string;
  statements: string[];
};

export const AWARENESS_DIMENSIONS: AwarenessDimension[] = [
  {
    id: "information",
    title: "الوعي المعلوماتي",
    tip: "قبل أن تشارك خبراً، ابحث عنه في مصدر معروف وانظر إلى تاريخ نشره.",
    statements: [
      "أتحقق من مصدر الخبر عبر مواقع موثوقة قبل مشاركته.",
      "أبحث عن رأي مخالف للخبر لأتأكد من صحته.",
      "أنتبه لتاريخ نشر المعلومة لأتجنب المعلومات القديمة.",
      "أميز بين الخبر المكتوب والإعلان المدفوع بسهولة."
    ]
  },
  {
    id: "privacy",
    title: "الوعي بالخصوصية",
    tip: "راجع إعدادات الخصوصية في حساباتك، ولا تشارك موقعك أو بياناتك إلا عند الحاجة.",
    statements: [
      "أقرأ سياسة الخصوصية قبل تثبيت أي تطبيق جديد.",
      "أضبط إعدادات الخصوصية في حساباتي للحد من جمع البيانات.",
      "أتجنب مشاركة موقعي الجغرافي أو بياناتي الصحية عشوائياً.",
      "أعرف كيف أطلب حذف بياناتي من بعض المنصات."
    ]
  },
  {
    id: "security",
    title: "الأمن السيبراني",
    tip: "فعّل التحقق بخطوتين في حساباتك المهمة، واستعمل كلمة مرور مختلفة لكل حساب.",
    statements: [
      "أستخدم كلمة مرور مختلفة لكل حساب من حساباتي المهمة.",
      "أفعل خاصية التحقق بخطوتين (2FA) حيثما أمكن.",
      "لا أنقر على الروابط المشبوهة في رسائل البريد الإلكتروني.",
      "أقوم بتحديث أنظمة التشغيل والتطبيقات بانتظام."
    ]
  },
  {
    id: "ethics",
    title: "الأخلاق الرقمية",
    tip: "تعامل على الإنترنت كما تتعامل وجهاً لوجه، واحترم أعمال الآخرين وحقوقهم.",
    statements: [
      "أتجنب استخدام ألفاظ مسيئة في النقاشات الإلكترونية.",
      "أحترم حقوق النشر ولا أنسب أعمالاً للآخرين.",
      "أتدخل بلطف لإيقاف التنمر الإلكتروني إن رأيته.",
      "أنشر المحتوى الإيجابي الذي يشجع على الأمل والعمل."
    ]
  },
  {
    id: "ai",
    title: "الوعي بالذكاء الاصطناعي",
    tip: "لا تصدّق صورة أو فيديو أو جواباً آلياً دون تحقق، فقد يكون مُصنَّعاً.",
    statements: [
      "أعرف أن نتائج بحث جوجل تختلف حسب الخوارزميات.",
      "لا أثق تماماً بمخرجات الذكاء الاصطناعي دون تدقيق.",
      "أتحقق من حقيقة الصور ومقاطع الفيديو (Deepfake).",
      "أفهم كيف تستهدفني الإعلانات بناءً على سلوكياتي."
    ]
  },
  {
    id: "participation",
    title: "المشاركة الإيجابية",
    tip: "شارك ما تعرفه مع من حولك، خاصة كبار السن، فالوعي يكبر حين نتقاسمه.",
    statements: [
      "أساهم في المبادرات التطوعية الرقمية.",
      "أشارك معرفتي الرقمية مع كبار السن أو المبتدئين.",
      "أستخدم التكنولوجيا لحل مشكلات مجتمعي المحلي.",
      "أحث الآخرين على التحقق من المعلومات."
    ]
  }
];

export const LIKERT_OPTIONS = [
  { value: 5, label: "موافق بشدة" },
  { value: 4, label: "موافق" },
  { value: 3, label: "محايد" },
  { value: 2, label: "غير موافق" },
  { value: 1, label: "غير موافق بشدة" }
] as const;

export type AwarenessQuestion = {
  key: string;
  dimension: AwarenessDimension;
  statement: string;
};

export const AWARENESS_QUESTIONS: AwarenessQuestion[] = AWARENESS_DIMENSIONS.flatMap((dimension) =>
  dimension.statements.map((statement, index) => ({ key: `${dimension.id}-${index}`, dimension, statement }))
);

export type AwarenessLevel = { label: string; description: string };

export function awarenessLevel(score: number): AwarenessLevel {
  if (score <= 40) return { label: "وعي منخفض", description: "تحتاج إلى تعلّم أساسيات الحماية الرقمية، وسنساعدك خطوة بخطوة." };
  if (score <= 65) return { label: "وعي متوسط", description: "لديك أساس جيد، وتحتاج إلى مواصلة التعلّم في بعض الجوانب." };
  if (score <= 85) return { label: "وعي مرتفع", description: "أنت نموذج إيجابي في محيطك الرقمي." };
  return { label: "وعي متقدم", description: "يمكنك أن تقود مبادرات للتوعية الرقمية من حولك." };
}

export type DimensionScore = { dimension: AwarenessDimension; score: number };

export type AwarenessResult = {
  score: number;
  level: AwarenessLevel;
  dimensions: DimensionScore[];
  weakest: DimensionScore;
};

const toPercent = (mean: number) => Math.round(mean * 20);

// DAI = mean of the six dimension means × 20 (1–5 scale → up to 100).
export function scoreAwareness(answers: Record<string, number>): AwarenessResult {
  const dimensionMeans = AWARENESS_DIMENSIONS.map((dimension) => {
    const values = dimension.statements.map((_, index) => {
      const value = answers[`${dimension.id}-${index}`];

      if (value === undefined || value < 1 || value > 5) {
        throw new Error(`Incomplete answers for ${dimension.id}`);
      }

      return value;
    });

    return { dimension, mean: values.reduce((sum, value) => sum + value, 0) / values.length };
  });

  const overallMean = dimensionMeans.reduce((sum, item) => sum + item.mean, 0) / dimensionMeans.length;
  const dimensions = dimensionMeans.map(({ dimension, mean }) => ({ dimension, score: toPercent(mean) }));
  const weakest = dimensions.reduce((lowest, item) => (item.score < lowest.score ? item : lowest));
  const score = toPercent(overallMean);

  return { score, level: awarenessLevel(score), dimensions, weakest };
}
