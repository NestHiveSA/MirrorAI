import type { AnalysisResult, RiskLevel } from "@mirrorai/shared";
import type { Lang } from "./i18n";

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

export const signalCopyFr: Record<string, SignalCopy> = {
  "SIG-001": {
    title: "Urgence et pression",
    description: "Le message vous pousse à agir vite ou avant une échéance, pour ne pas vous laisser le temps de vérifier.",
    tip: "Prenez votre temps. Un vrai service ne ferme pas votre compte en quelques minutes."
  },
  "SIG-003": {
    title: "Demande de données personnelles",
    description: "Le message demande des informations sensibles : numéro de carte, CIN ou compte.",
    tip: "N’envoyez jamais vos données personnelles via un message ou un lien reçu à l’improviste."
  },
  "SIG-004": {
    title: "Demande de paiement ou de virement",
    description: "Le message vous demande de payer, de virer de l’argent ou de régler des frais.",
    tip: "Ne payez aucun frais depuis un lien reçu par message. Passez par l’application ou le site officiel."
  },
  "SIG-005": {
    title: "Promesse de gain ou de prix",
    description: "Le message vous promet un prix, un cadeau ou un gain que vous n’avez pas demandé.",
    tip: "Si vous n’avez participé à aucun concours, vous n’avez rien gagné."
  },
  "SIG-006": {
    title: "Usurpation d’un organisme connu",
    description: "Le message parle au nom d’une banque, d’une entreprise ou d’une administration pour gagner votre confiance.",
    tip: "Contactez l’organisme via son numéro ou son application officiels, pas via le message."
  },
  "SIG-007": {
    title: "Lien suspect",
    description: "Le lien ne ressemble pas à un site officiel ou utilise une extension fréquente dans les arnaques.",
    tip: "N’ouvrez pas le lien. Tapez vous-même l’adresse du site officiel."
  },
  "SIG-008": {
    title: "Demande de secret",
    description: "Le message vous demande de n’en parler à personne, pour vous isoler de ceux qui pourraient vous alerter.",
    tip: "Demandez conseil à une personne de confiance avant d’agir."
  },
  "SIG-010": {
    title: "Peur et menaces",
    description: "Le message menace de bloquer un compte, d’une amende ou de poursuites pour vous faire peur.",
    tip: "La peur pousse à décider vite. Arrêtez-vous et vérifiez d’abord."
  },
  "SIG-013": {
    title: "Demande de mot de passe",
    description: "Le message demande votre mot de passe ou vos identifiants de connexion.",
    tip: "Personne n’a besoin de votre mot de passe, ni votre banque ni le service client."
  },
  "SIG-014": {
    title: "Demande du code de vérification",
    description: "Le message demande le code reçu par SMS. Ce code est la clé de votre compte.",
    tip: "Votre code est à vous seul. Ne le donnez à personne, quoi qu’on vous dise."
  },
  "SIG-017": {
    title: "Lien raccourci ou masqué",
    description: "Le lien est raccourci ou numérique : impossible de voir où il mène.",
    tip: "N’ouvrez pas les liens raccourcis venant d’une source inconnue."
  },
  "SIG-020": {
    title: "Sources non précisées",
    description: "L’information est attribuée à des « sources » que le texte ne nomme pas.",
    tip: "Cherchez la même information auprès d’une source connue avant d’y croire."
  },
  "SIG-021": {
    title: "Pression au partage",
    description: "Le texte vous demande de le partager vite ou « avant suppression ».",
    tip: "Ne partagez pas avant d’avoir vérifié. Le partage rapide, c’est ce que veut l’auteur."
  },
  "SIG-022": {
    title: "Formulation choc",
    description: "Le texte utilise des mots sensationnels pour attirer votre attention.",
    tip: "Un titre choc ne suffit pas. Regardez la source et la date."
  },
  "SIG-023": {
    title: "Certitude sans preuve",
    description: "Le texte affirme une certitude absolue sans source claire.",
    tip: "Demandez-vous : qui l’a dit ? Où est la preuve ?"
  }
};

const fallbackSignalCopy: Record<Lang, SignalCopy> = {
  ar: {
    title: "إشارة تستحق الانتباه",
    description: "رصد MirrorAI نمطاً يستحق المراجعة في هذا المحتوى.",
    tip: "تحقق من المصدر قبل أن تتصرف."
  },
  fr: {
    title: "Signal à surveiller",
    description: "MirrorAI a repéré un élément qui mérite d’être vérifié dans ce contenu.",
    tip: "Vérifiez la source avant d’agir."
  }
};

export function copyForSignal(signalId: string, lang: Lang = "ar"): SignalCopy {
  const table = lang === "fr" ? signalCopyFr : signalCopy;
  return table[signalId] ?? fallbackSignalCopy[lang];
}

export function levelLabel(level: RiskLevel | null, lang: Lang = "ar"): string {
  if (lang === "fr") {
    if (level === "CRITICAL") return "Très élevé";
    if (level === "HIGH") return "Élevé";
    if (level === "MODERATE") return "À surveiller";
    if (level === "LOW") return "Faible";
    return "Aucun signal clair";
  }
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

const summaries: Record<Lang, { none: string; high: string; caution: string }> = {
  ar: {
    none: "لم نرصد إشارات خطر واضحة في هذا المحتوى. هذا لا يعني أنه آمن بالضرورة.",
    high: "هذا المحتوى يجمع عدة إشارات معروفة في رسائل الاحتيال. توقف قبل أن تضغط أو تدفع أو ترسل أي معلومة.",
    caution: "في هذا المحتوى إشارات تستحق الانتباه. تحقق منه قبل أن تتفاعل معه أو تشاركه."
  },
  fr: {
    none: "Aucun signal de risque clair dans ce contenu. Cela ne veut pas forcément dire qu’il est sûr.",
    high: "Ce contenu réunit plusieurs signaux typiques des arnaques. Arrêtez-vous avant de cliquer, payer ou envoyer la moindre information.",
    caution: "Ce contenu présente des signaux à surveiller. Vérifiez-le avant d’y réagir ou de le partager."
  }
};

export function summaryFor(result: AnalysisResult, lang: Lang = "ar"): string {
  const text = summaries[lang];
  if (result.signals.length === 0) return text.none;
  if (result.risk_level === "CRITICAL" || result.risk_level === "HIGH") return text.high;
  return text.caution;
}

const genericActions: Record<Lang, { none: string; verify: string }> = {
  ar: {
    none: "إذا طلب منك أحد لاحقاً كوداً أو دفعاً أو بيانات، تحقق من الجهة عبر قناتها الرسمية.",
    verify: "تحقق من الجهة المرسلة عبر رقمها أو تطبيقها الرسمي، وليس عبر الرسالة."
  },
  fr: {
    none: "Si quelqu’un vous demande plus tard un code, un paiement ou des données, vérifiez auprès de l’organisme par son canal officiel.",
    verify: "Vérifiez l’expéditeur via son numéro ou son application officiels, pas via le message."
  }
};

export function actionsFor(result: AnalysisResult, lang: Lang = "ar"): string[] {
  if (result.signals.length === 0) {
    return [genericActions[lang].none];
  }

  const tips = result.signals.map((signal) => copyForSignal(signal.signal_id, lang).tip);
  tips.push(genericActions[lang].verify);

  return [...new Set(tips)];
}

export const SCORE_MEANING: Record<Lang, string> = {
  ar: "تمثل هذه الدرجة قوة وتراكم الإشارات المكتشفة، وليست نسبة احتمال أن يكون المحتوى كاذباً أو احتيالياً.",
  fr: "Ce score reflète la force et le cumul des signaux détectés ; ce n’est pas une probabilité que le contenu soit faux ou frauduleux."
};

export const LIMITS: Record<Lang, string[]> = {
  ar: [
    "التحليل يعتمد على نص الرسالة فقط، ولا يتحقق من هوية المرسل.",
    "لا يحكم MirrorAI بأن المحتوى صحيح أو كاذب، بل يلفت انتباهك إلى إشارات تستحق التحقق.",
    "قد تفوته رسائل احتيال جديدة، وقد ينبّه أحياناً بدون داعٍ. القرار الأخير لك."
  ],
  fr: [
    "L’analyse porte uniquement sur le texte du message ; elle ne vérifie pas l’identité de l’expéditeur.",
    "MirrorAI ne dit pas si un contenu est vrai ou faux : il attire votre attention sur des signaux à vérifier.",
    "Il peut manquer de nouvelles arnaques ou alerter sans raison. La décision finale vous appartient."
  ]
};
