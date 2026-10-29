import type { Lang } from "./i18n";

// Short lessons on the scams Moroccan users meet most often, and a scenario
// quiz. Arabic and French carry the same meaning; examples are invented.
export type Lesson = {
  id: string;
  icon: string;
  title: string;
  looksLike: string;
  doThis: string;
};

export type QuizQuestion = {
  id: string;
  scenario: string;
  options: [string, string, string];
  answer: 0 | 1 | 2;
  why: string;
};

export const lessons: Record<Lang, Lesson[]> = {
  ar: [
    {
      id: "code",
      icon: "🔑",
      title: "سرقة رمز التحقق",
      looksLike: "«أرسلت لك كوداً بالخطأ، أرسله لي من فضلك». الكود يفتح حسابك في واتساب أو البنك.",
      doThis: "لا تعطِ الكود الذي يصلك في SMS لأي أحد، حتى لو قال إنه من البنك أو من عائلتك."
    },
    {
      id: "prize",
      icon: "🎁",
      title: "الجائزة الوهمية",
      looksLike: "«مبروك! ربحت هاتفاً أو مبلغاً، ادفع رسوم التوصيل فقط».",
      doThis: "إن لم تشارك في مسابقة فلم تربح شيئاً. لا تدفع أي رسوم لاستلام «جائزة»."
    },
    {
      id: "impersonation",
      icon: "🏦",
      title: "انتحال جهة رسمية",
      looksLike: "رسالة باسم البنك أو البريد أو شركة الاتصالات تطلب «تحديث بياناتك» عبر رابط.",
      doThis: "ادخل إلى التطبيق أو الموقع الرسمي بنفسك، أو اتصل بالرقم المكتوب على بطاقتك."
    },
    {
      id: "urgency",
      icon: "⏰",
      title: "الاستعجال والتخويف",
      looksLike: "«حسابك سيُغلق خلال ساعة»، «غرامة إن لم تدفع اليوم».",
      doThis: "الاستعجال علامة خطر. توقف، وتحقق من الجهة عبر قناتها الرسمية."
    },
    {
      id: "link",
      icon: "🔗",
      title: "الروابط المخفية",
      looksLike: "رابط مختصر أو اسم موقع يشبه الرسمي مع حرف زائد أو امتداد غريب.",
      doThis: "لا تفتح الرابط. اكتب عنوان الموقع الرسمي بنفسك، أو افحص الرسالة في MirrorAI."
    },
    {
      id: "fake-news",
      icon: "📰",
      title: "الأخبار الزائفة",
      looksLike: "خبر صادم «من مصادر موثوقة» مع طلب «انشر قبل الحذف».",
      doThis: "ابحث عن الخبر في مصدر معروف قبل أن تصدّقه أو تشاركه."
    }
  ],
  fr: [
    {
      id: "code",
      icon: "🔑",
      title: "Le vol du code de vérification",
      looksLike: "« Je t’ai envoyé un code par erreur, renvoie-le-moi stp. » Ce code ouvre votre WhatsApp ou votre compte bancaire.",
      doThis: "Ne donnez jamais le code reçu par SMS, même si la personne dit venir de la banque ou de votre famille."
    },
    {
      id: "prize",
      icon: "🎁",
      title: "Le faux gain",
      looksLike: "« Félicitations ! Vous avez gagné un téléphone ou une somme, payez seulement la livraison. »",
      doThis: "Sans participation à un concours, il n’y a pas de gain. Ne payez jamais de frais pour recevoir un « prix »."
    },
    {
      id: "impersonation",
      icon: "🏦",
      title: "L’usurpation d’un organisme",
      looksLike: "Un message au nom de la banque, de la poste ou de l’opérateur demande de « mettre à jour vos données » via un lien.",
      doThis: "Ouvrez vous-même l’application ou le site officiel, ou appelez le numéro inscrit sur votre carte."
    },
    {
      id: "urgency",
      icon: "⏰",
      title: "L’urgence et la peur",
      looksLike: "« Votre compte sera bloqué dans une heure », « amende si vous ne payez pas aujourd’hui ».",
      doThis: "L’urgence est un signal d’alerte. Arrêtez-vous et vérifiez par le canal officiel."
    },
    {
      id: "link",
      icon: "🔗",
      title: "Les liens masqués",
      looksLike: "Un lien raccourci, ou un nom de site qui imite l’officiel avec une lettre en plus ou une extension étrange.",
      doThis: "N’ouvrez pas le lien. Tapez vous-même l’adresse officielle, ou vérifiez le message dans MirrorAI."
    },
    {
      id: "fake-news",
      icon: "📰",
      title: "Les fausses informations",
      looksLike: "Une nouvelle choc « de sources sûres » avec « partagez avant suppression ».",
      doThis: "Cherchez l’information auprès d’une source connue avant d’y croire ou de la partager."
    }
  ]
};

export const quiz: Record<Lang, QuizQuestion[]> = {
  ar: [
    {
      id: "q1",
      scenario: "وصلك SMS فيه كود، ثم رسالة واتساب من رقم صديقك: «أرسلت لك كوداً بالخطأ، أعده لي».",
      options: ["أرسل له الكود، فهو صديقي", "لا أرسل الكود، وأتصل بصديقي هاتفياً للتأكد", "أرسل نصف الكود فقط"],
      answer: 1,
      why: "الكود هو مفتاح حسابك. حساب صديقك قد يكون مسروقاً، والاتصال الهاتفي يكشف ذلك."
    },
    {
      id: "q2",
      scenario: "رسالة: «ربحت 5000 درهم في سحب اتصالات، ادفع 50 درهماً رسوم التحويل عبر هذا الرابط».",
      options: ["أتجاهل الرسالة، فلم أشارك في أي سحب", "أدفع 50 درهماً، المبلغ صغير مقابل الجائزة", "أرسل الرسالة لأصدقائي ليربحوا أيضاً"],
      answer: 0,
      why: "لا أحد يربح سحباً لم يشارك فيه، والجائزة الحقيقية لا تطلب رسوماً مسبقة."
    },
    {
      id: "q3",
      scenario: "بريد باسم بنكك: «تم تعليق بطاقتك، أدخل بياناتك هنا خلال 24 ساعة».",
      options: ["أضغط الرابط بسرعة قبل انتهاء المهلة", "أرد على البريد وأطلب توضيحاً", "أفتح تطبيق البنك بنفسي أو أتصل بالرقم الرسمي"],
      answer: 2,
      why: "البنك لا يطلب بياناتك عبر رابط. المهلة القصيرة هدفها أن تتصرف بلا تفكير."
    },
    {
      id: "q4",
      scenario: "منشور: «خبر عاجل من مصادر موثوقة! انشره قبل أن يحذفوه».",
      options: ["أبحث عن الخبر في موقع إخباري معروف قبل أي مشاركة", "أنشره فوراً حتى يعرف الجميع", "أصدّقه لأن كثيرين نشروه"],
      answer: 0,
      why: "«مصادر موثوقة» بلا اسم و«انشر قبل الحذف» علامتان كلاسيكيتان للأخبار الزائفة."
    },
    {
      id: "q5",
      scenario: "رابط وصلك: bit.ly/cadeau-maroc يقول إنه هدية من شركة معروفة.",
      options: ["أفتحه لأرى الهدية", "أفتحه من حاسوب صديقي", "لا أفتحه، فالرابط المختصر يخفي وجهته الحقيقية"],
      answer: 2,
      why: "الرابط المختصر من مصدر مجهول لا يُظهر إلى أين يأخذك. اذهب إلى الموقع الرسمي بنفسك."
    },
    {
      id: "q6",
      scenario: "شخص يقول إنه من خدمة العملاء ويطلب كلمة مرور حسابك «لإصلاح مشكل».",
      options: ["أعطيه كلمة المرور لأنه موظف", "أرفض، فلا أحد يحتاج كلمة مروري", "أعطيه نصفها"],
      answer: 1,
      why: "لا خدمة عملاء حقيقية تطلب كلمة مرورك، أبداً."
    },
    {
      id: "q7",
      scenario: "رسالة من رقم مجهول: «أنا ابنك، غيّرت رقمي، أحتاج مالاً بسرعة ولا تخبر أحداً».",
      options: ["أحوّل المال فوراً", "أرسل نصف المبلغ", "أتصل بابني على رقمه القديم أو أسأل أحد أفراد العائلة"],
      answer: 2,
      why: "الاستعجال وطلب السرية وتغيير الرقم معاً علامات احتيال. التحقق بالاتصال يحميك."
    },
    {
      id: "q8",
      scenario: "إعلان على فيسبوك: هاتف جديد بربع ثمنه، الدفع مسبقاً فقط عبر تحويل.",
      options: ["أشكّ في الثمن غير الواقعي وأشتري من متجر معروف", "أدفع بسرعة قبل نفاد الكمية", "أدفع لأن الصفحة فيها تعليقات كثيرة"],
      answer: 0,
      why: "الثمن غير الواقعي والدفع المسبق فقط علامتان شائعتان في المتاجر الوهمية، والتعليقات قد تكون مزيفة."
    }
  ],
  fr: [
    {
      id: "q1",
      scenario: "Vous recevez un SMS avec un code, puis un message WhatsApp du numéro d’un ami : « Je t’ai envoyé un code par erreur, renvoie-le-moi ».",
      options: ["J’envoie le code, c’est mon ami", "Je n’envoie pas le code et j’appelle mon ami pour vérifier", "J’envoie seulement la moitié du code"],
      answer: 1,
      why: "Ce code est la clé de votre compte. Le compte de votre ami est peut-être piraté ; un appel le révèle."
    },
    {
      id: "q2",
      scenario: "Message : « Vous avez gagné 5000 DH au tirage de l’opérateur, payez 50 DH de frais de transfert via ce lien ».",
      options: ["J’ignore le message : je n’ai participé à aucun tirage", "Je paie 50 DH, c’est peu par rapport au gain", "Je le transfère à mes amis pour qu’ils gagnent aussi"],
      answer: 0,
      why: "On ne gagne pas un tirage auquel on n’a pas participé, et un vrai gain ne demande pas de frais à l’avance."
    },
    {
      id: "q3",
      scenario: "Un e-mail au nom de votre banque : « Votre carte est suspendue, saisissez vos données ici sous 24 h ».",
      options: ["Je clique vite avant la fin du délai", "Je réponds à l’e-mail pour demander des précisions", "J’ouvre moi-même l’application de la banque ou j’appelle le numéro officiel"],
      answer: 2,
      why: "Une banque ne demande pas vos données via un lien. Le délai court sert à vous faire agir sans réfléchir."
    },
    {
      id: "q4",
      scenario: "Publication : « Urgent, de sources sûres ! Partagez avant qu’ils ne suppriment ».",
      options: ["Je cherche l’information sur un site d’actualité connu avant de partager", "Je partage tout de suite pour que tout le monde sache", "J’y crois parce que beaucoup l’ont partagée"],
      answer: 0,
      why: "Des « sources sûres » sans nom et « partagez avant suppression » sont deux signes classiques de fausse information."
    },
    {
      id: "q5",
      scenario: "Vous recevez le lien bit.ly/cadeau-maroc, présenté comme un cadeau d’une marque connue.",
      options: ["Je l’ouvre pour voir le cadeau", "Je l’ouvre depuis l’ordinateur d’un ami", "Je ne l’ouvre pas : un lien raccourci cache sa vraie destination"],
      answer: 2,
      why: "Un lien raccourci d’une source inconnue ne montre pas où il mène. Allez vous-même sur le site officiel."
    },
    {
      id: "q6",
      scenario: "Une personne se présente comme le service client et demande votre mot de passe « pour régler un problème ».",
      options: ["Je le donne, c’est un employé", "Je refuse : personne n’a besoin de mon mot de passe", "J’en donne la moitié"],
      answer: 1,
      why: "Aucun vrai service client ne demande votre mot de passe, jamais."
    },
    {
      id: "q7",
      scenario: "Un numéro inconnu écrit : « C’est ton fils, j’ai changé de numéro, j’ai besoin d’argent vite, n’en parle à personne ».",
      options: ["J’envoie l’argent tout de suite", "J’envoie la moitié de la somme", "J’appelle mon fils sur son ancien numéro ou je demande à un proche"],
      answer: 2,
      why: "Urgence, secret et changement de numéro réunis : ce sont des signes d’arnaque. Un appel de vérification vous protège."
    },
    {
      id: "q8",
      scenario: "Publicité Facebook : un téléphone neuf au quart de son prix, paiement uniquement par virement à l’avance.",
      options: ["Je me méfie du prix irréaliste et j’achète chez un vendeur connu", "Je paie vite avant la rupture de stock", "Je paie parce que la page a beaucoup de commentaires"],
      answer: 0,
      why: "Prix irréaliste et paiement à l’avance uniquement sont fréquents dans les fausses boutiques ; les commentaires peuvent être faux."
    }
  ]
};

export function scoreLevel(score: number, total: number): "high" | "mid" | "low" {
  if (total === 0) return "low";
  const ratio = score / total;
  if (ratio >= 0.85) return "high";
  if (ratio >= 0.5) return "mid";
  return "low";
}
