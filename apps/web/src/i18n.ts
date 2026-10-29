// Interface wording for the two app languages. Arabic is the default and the
// reference; French mirrors it. Signal and risk wording lives in copy.ts.
export type Lang = "ar" | "fr";

export const LANGS: readonly Lang[] = ["ar", "fr"];

const LANG_KEY = "mirrorai.lang";

export function readStoredLang(): Lang {
  try {
    const stored = globalThis.localStorage?.getItem(LANG_KEY);
    return stored === "fr" ? "fr" : "ar";
  } catch {
    return "ar";
  }
}

export function storeLang(lang: Lang): void {
  try {
    globalThis.localStorage?.setItem(LANG_KEY, lang);
  } catch {
    // Storage can be unavailable (private mode); the app still works in memory.
  }
}

export function dirFor(lang: Lang): "rtl" | "ltr" {
  return lang === "ar" ? "rtl" : "ltr";
}

export type UiText = {
  tagline: string;
  attribution: string;
  langSwitch: string;
  tabs: { home: string; check: string; learn: string; about: string };
  home: {
    hello: string;
    sub: string;
    tiles: {
      check: { title: string; text: string };
      quiz: { title: string; text: string };
      media: { title: string; text: string };
      shop: { title: string; text: string };
      learn: { title: string; text: string };
      about: { title: string; text: string };
    };
    external: string;
  };
  media: {
    heading: string;
    intro: string;
    soon: string;
    listen: string;
    items: { id: string; icon: string; title: string; text: string; url?: string }[];
  };
  check: {
    intro: string;
    heading: string;
    contentLabel: string;
    contentPlaceholder: string;
    urlLabel: string;
    urlNote: string;
    submit: string;
    loading: string;
    tryExample: string;
    clear: string;
    exampleMessage: string;
    resultLabel: string;
    emptyResult: string;
    levelLabel: string;
    signalsLabel: string;
    actionsLabel: string;
    limitsLabel: string;
    scoreAria: string;
    scoreOf: string;
    emptyInput: string;
    apiError: string;
  };
  learn: {
    intro: string;
    lessonsHeading: string;
    looksLike: string;
    doThis: string;
    quizHeading: string;
    quizIntro: string;
    start: string;
    question: string;
    of: string;
    correct: string;
    wrong: string;
    next: string;
    seeScore: string;
    scoreTitle: string;
    restart: string;
    levels: { high: string; mid: string; low: string };
  };
  about: {
    heading: string;
    what: string;
    howHeading: string;
    how: string[];
    privacyHeading: string;
    privacy: string[];
    privacyLink: string;
    freeHeading: string;
    free: string;
    madeByHeading: string;
    madeBy: string;
    contactHeading: string;
    disclaimer: string;
  };
};

export const ui: Record<Lang, UiText> = {
  ar: {
    tagline: "رفيقك الرقمي",
    attribution: "منتج من NestHive",
    langSwitch: "Français",
    tabs: { home: "الرئيسية", check: "تحقّق", learn: "تعلّم", about: "عن التطبيق" },
    home: {
      hello: "مرحباً بك في MirrorAI",
      sub: "ماذا تريد أن تفعل اليوم؟",
      tiles: {
        check: { title: "تحقّق", text: "افحص رسالة أو رابطاً مشبوهاً" },
        quiz: { title: "اختبر", text: "اختبر وعيك الرقمي في 8 أسئلة" },
        media: { title: "شاهد واستمع", text: "بودكاست ورسوم متحركة للتوعية" },
        shop: { title: "المتجر", text: "تيشيرتات وملصقات وحقائب NestHive" },
        learn: { title: "تعلّم", text: "حيل الاحتيال الشائعة وكيف تتجنبها" },
        about: { title: "عن التطبيق", text: "الخصوصية ومن نحن" }
      },
      external: "يُفتح في المتصفح"
    },
    media: {
      heading: "شاهد واستمع",
      intro: "محتوى قصير بالعربية والدارجة والأمازيغية لنتعلم الوعي الرقمي معاً.",
      soon: "قريباً",
      listen: "استمع الآن",
      items: [
        {
          id: "podcast",
          icon: "🎙️",
          title: "بودكاست الوعي الرقمي",
          text: "حلقات قصيرة عن الاحتيال والأخبار الزائفة وحماية الحسابات.",
          url: "https://open.spotify.com/episode/3bwt7PtaKwcSk5Ti96embd"
        },
        {
          id: "nest-series",
          icon: "🎬",
          title: "العش الرقمي — مغامرات في العالم الرقمي",
          text: "سلسلة رسوم متحركة للناشئة مع نور وآدم والروبوت نِست."
        },
        {
          id: "tifinagh",
          icon: "ⴰ",
          title: "مغامرات تيفيناغ",
          text: "سلسلة للأطفال لتعلّم حروف تيفيناغ والأمازيغية، حلقة لكل حرف."
        }
      ]
    },
    check: {
      intro: "الصق رسالة أو منشوراً وصلك، وسنريك الإشارات التي تستحق الانتباه قبل أن تقرر. لا نحفظ ما تكتبه.",
      heading: "توقّف، فكّر، تحقّق",
      contentLabel: "ما الرسالة التي تريد فحصها؟",
      contentPlaceholder: "الصق هنا رسالة SMS أو واتساب أو منشوراً... بالعربية أو الدارجة أو الفرنسية",
      urlLabel: "رابط مرتبط بالرسالة (اختياري)",
      urlNote: "لا تفتح الرابط. يكفي أن تلصقه هنا.",
      submit: "افحص الرسالة",
      loading: "جارٍ الفحص...",
      tryExample: "جرّب مثالاً",
      clear: "مسح",
      exampleMessage:
        "مبروك! ربحت جائزة 5000 درهم. باش توصلك، صيفط لينا الكود اللي غادي يجيك فـ SMS دابا، العرض كيسالي من بعد ساعة.",
      resultLabel: "النتيجة",
      emptyResult: "بعد الفحص ستظهر هنا الإشارات التي رصدناها، وسبب أهميتها، وما يُنصح أن تفعله.",
      levelLabel: "مستوى الخطر",
      signalsLabel: "ما الذي لاحظناه؟",
      actionsLabel: "ماذا تفعل الآن؟",
      limitsLabel: "حدود التحليل",
      scoreAria: "مؤشر المخاطر",
      scoreOf: "من 100",
      emptyInput: "الصق رسالة أو منشوراً أولاً.",
      apiError: "تعذر إكمال التحليل حالياً. حاول مرة أخرى."
    },
    learn: {
      intro: "أغلب حيل الاحتيال تتكرر. حين تعرفها، تكتشفها في ثوانٍ.",
      lessonsHeading: "حيل شائعة يجب أن تعرفها",
      looksLike: "كيف تبدو؟",
      doThis: "ماذا تفعل؟",
      quizHeading: "اختبر وعيك الرقمي",
      quizIntro: "ثمانية مواقف من الحياة اليومية. اختر التصرف الصحيح، وستعرف السبب بعد كل جواب.",
      start: "ابدأ الاختبار",
      question: "السؤال",
      of: "من",
      correct: "إجابة صحيحة",
      wrong: "ليست الإجابة الأفضل",
      next: "السؤال التالي",
      seeScore: "اعرف نتيجتك",
      scoreTitle: "نتيجتك",
      restart: "أعد الاختبار",
      levels: {
        high: "ممتاز! وعيك الرقمي قوي. شارك ما تعرفه مع عائلتك.",
        mid: "جيد. راجع الحيل الشائعة أعلاه لتصبح أكثر حذراً.",
        low: "لا بأس، التعلم يبدأ هنا. اقرأ الحيل الشائعة ثم أعد الاختبار."
      }
    },
    about: {
      heading: "عن MirrorAI",
      what: "MirrorAI رفيق رقمي يساعدك على فهم الرسائل والروابط المشبوهة قبل أن تتفاعل معها. لا يقرر بدلاً منك، بل يريك الإشارات بوضوح لتقرر أنت بوعي.",
      howHeading: "كيف يعمل؟",
      how: [
        "تلصق الرسالة أو المنشور، ومعه الرابط إن وُجد.",
        "يبحث MirrorAI عن إشارات معروفة في الاحتيال والتضليل: الاستعجال، طلب الكود، الجوائز، انتحال الجهات، الروابط المخفية.",
        "تحصل على مستوى الخطر، وشرح كل إشارة، ونصائح عملية لما تفعله الآن."
      ],
      privacyHeading: "خصوصيتك",
      privacy: [
        "على هاتفك: تطبيق أندرويد يحلل الرسائل داخل الهاتف نفسه، فلا يرسلها إلى أي خادم.",
        "لا حساب، ولا إعلانات، ولا أدوات تتبع، ولا نحفظ ما تكتبه.",
        "في نسخة الويب: يُرسل النص إلى خادمنا للتحليل ثم تعود النتيجة فوراً، بدون تخزين."
      ],
      privacyLink: "اقرأ سياسة الخصوصية كاملة",
      freeHeading: "مجاني",
      free: "MirrorAI مجاني بالكامل في هذه المرحلة.",
      madeByHeading: "من صنع NestHive",
      madeBy: "NestHive (العش الرقمي) شركة مغربية من آيت أورير، إقليم الحوز، تعمل على نقل الناس من العمل التقليدي إلى العمل الرقمي، وعلى نشر الوعي الرقمي.",
      contactHeading: "تواصل معنا",
      disclaimer: "MirrorAI أداة توعية ولا يضمن كشف كل أنواع الاحتيال. القرار الأخير لك دائماً."
    }
  },
  fr: {
    tagline: "Votre compagnon numérique",
    attribution: "Un produit NestHive",
    langSwitch: "العربية",
    tabs: { home: "Accueil", check: "Vérifier", learn: "Apprendre", about: "À propos" },
    home: {
      hello: "Bienvenue sur MirrorAI",
      sub: "Que voulez-vous faire aujourd’hui ?",
      tiles: {
        check: { title: "Vérifier", text: "Analysez un message ou un lien suspect" },
        quiz: { title: "Tester", text: "Testez votre conscience numérique en 8 questions" },
        media: { title: "Regarder & écouter", text: "Podcast et dessins animés de sensibilisation" },
        shop: { title: "Boutique", text: "T-shirts, stickers et sacs NestHive" },
        learn: { title: "Apprendre", text: "Les arnaques courantes et comment les éviter" },
        about: { title: "À propos", text: "Vie privée et qui sommes-nous" }
      },
      external: "S’ouvre dans le navigateur"
    },
    media: {
      heading: "Regarder & écouter",
      intro: "Des contenus courts en arabe, en darija et en amazighe pour apprendre ensemble la conscience numérique.",
      soon: "Bientôt",
      listen: "Écouter",
      items: [
        {
          id: "podcast",
          icon: "🎙️",
          title: "Le podcast de la conscience numérique",
          text: "De courts épisodes sur les arnaques, les fausses informations et la protection des comptes.",
          url: "https://open.spotify.com/episode/3bwt7PtaKwcSk5Ti96embd"
        },
        {
          id: "nest-series",
          icon: "🎬",
          title: "Le Nid Numérique — Aventures dans le monde numérique",
          text: "Une série animée pour les jeunes avec Nour, Adam et le robot Nest."
        },
        {
          id: "tifinagh",
          icon: "ⴰ",
          title: "Les aventures de Tifinagh",
          text: "Une série pour enfants pour apprendre les lettres tifinagh et l’amazighe, un épisode par lettre."
        }
      ]
    },
    check: {
      intro: "Collez un message ou une publication reçus : nous vous montrons les signaux qui méritent votre attention avant de décider. Nous ne conservons rien de ce que vous écrivez.",
      heading: "Stop, réfléchis, vérifie",
      contentLabel: "Quel message voulez-vous vérifier ?",
      contentPlaceholder: "Collez ici un SMS, un message WhatsApp ou une publication… en arabe, en darija ou en français",
      urlLabel: "Lien associé au message (facultatif)",
      urlNote: "N’ouvrez pas le lien. Il suffit de le coller ici.",
      submit: "Vérifier le message",
      loading: "Vérification…",
      tryExample: "Essayer un exemple",
      clear: "Effacer",
      exampleMessage:
        "Félicitations ! Vous avez gagné 5000 DH. Pour les recevoir, envoyez-nous tout de suite le code que vous allez recevoir par SMS. L’offre expire dans une heure.",
      resultLabel: "Résultat",
      emptyResult: "Après la vérification, vous verrez ici les signaux repérés, pourquoi ils comptent et ce qu’il est conseillé de faire.",
      levelLabel: "Niveau de risque",
      signalsLabel: "Ce que nous avons remarqué",
      actionsLabel: "Que faire maintenant ?",
      limitsLabel: "Limites de l’analyse",
      scoreAria: "Indicateur de risque",
      scoreOf: "sur 100",
      emptyInput: "Collez d’abord un message ou une publication.",
      apiError: "L’analyse est impossible pour le moment. Réessayez."
    },
    learn: {
      intro: "La plupart des arnaques se répètent. Quand on les connaît, on les repère en quelques secondes.",
      lessonsHeading: "Les pièges courants à connaître",
      looksLike: "À quoi ça ressemble ?",
      doThis: "Que faire ?",
      quizHeading: "Testez votre conscience numérique",
      quizIntro: "Huit situations du quotidien. Choisissez la bonne réaction ; l’explication s’affiche après chaque réponse.",
      start: "Commencer le quiz",
      question: "Question",
      of: "sur",
      correct: "Bonne réponse",
      wrong: "Ce n’est pas la meilleure réponse",
      next: "Question suivante",
      seeScore: "Voir mon score",
      scoreTitle: "Votre score",
      restart: "Recommencer",
      levels: {
        high: "Excellent ! Votre conscience numérique est solide. Partagez ces réflexes avec vos proches.",
        mid: "Bien. Relisez les pièges courants pour être encore plus vigilant.",
        low: "Pas de souci, tout commence ici. Lisez les pièges courants puis recommencez."
      }
    },
    about: {
      heading: "À propos de MirrorAI",
      what: "MirrorAI est un compagnon numérique qui vous aide à comprendre les messages et liens suspects avant d’agir. Il ne décide pas à votre place : il vous montre clairement les signaux pour que vous décidiez en connaissance de cause.",
      howHeading: "Comment ça marche ?",
      how: [
        "Vous collez le message ou la publication, avec le lien s’il y en a un.",
        "MirrorAI recherche des signaux connus de fraude et de désinformation : urgence, demande de code, faux gains, usurpation d’identité, liens masqués.",
        "Vous obtenez un niveau de risque, l’explication de chaque signal et des conseils concrets."
      ],
      privacyHeading: "Votre vie privée",
      privacy: [
        "Sur votre téléphone : l’application Android analyse les messages directement sur l’appareil, sans les envoyer à un serveur.",
        "Pas de compte, pas de publicité, pas de suivi, et nous ne conservons rien de ce que vous écrivez.",
        "Version web : le texte est envoyé à notre serveur pour analyse et le résultat revient immédiatement, sans stockage."
      ],
      privacyLink: "Lire la politique de confidentialité",
      freeHeading: "Gratuit",
      free: "MirrorAI est entièrement gratuit à ce stade.",
      madeByHeading: "Créé par NestHive",
      madeBy: "NestHive (Le Nid Numérique) est une entreprise marocaine d’Aït Ourir, province d’Al Haouz, qui accompagne le passage du travail traditionnel au travail numérique et diffuse la conscience numérique.",
      contactHeading: "Nous contacter",
      disclaimer: "MirrorAI est un outil de sensibilisation et ne garantit pas de détecter toutes les arnaques. La décision finale vous appartient toujours."
    }
  }
};
