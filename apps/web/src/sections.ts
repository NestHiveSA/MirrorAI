import type { Route } from "./routes";

export type SectionRoute = Exclude<Route, "home">;

export type Section = {
  route: SectionRoute;
  title: string;
  description: string;
  // Sections without real content yet show a "coming soon" screen instead of promises.
  comingSoon?: { intro: string; planned: string[] };
};

export const SECTIONS: Section[] = [
  {
    route: "check",
    title: "تحقّق",
    description: "الصق رسالة مشبوهة واعرف إشاراتها"
  },
  {
    route: "awareness",
    title: "مؤشر الوعي",
    description: "24 سؤالاً تقيس وعيك الرقمي"
  },
  {
    route: "library",
    title: "المكتبة",
    description: "كتب ودلائل في التوعية الرقمية",
    comingSoon: {
      intro: "نجهّز مكتبة صغيرة تقرأ فيها بلغة بسيطة عن الحماية الرقمية.",
      planned: ["دليل الحماية من رسائل الاحتيال", "كيف تتحقق من خبر قبل أن تشاركه", "خصوصيتك على الهاتف خطوة بخطوة"]
    }
  },
  {
    route: "videos",
    title: "فيديوهات",
    description: "مقاطع قصيرة بالدارجة",
    comingSoon: {
      intro: "نصوّر مقاطع قصيرة بالدارجة، كل مقطع يشرح حيلة واحدة من حيل الاحتيال.",
      planned: ["الكود ديالك ليك بوحدك", "ربحتي كادو؟ عاود فكّر", "الرابط المختصر: فين غادي يديك؟"]
    }
  },
  {
    route: "podcast",
    title: "بودكاست",
    description: "«حديث العش» عن الوعي الرقمي",
    comingSoon: {
      intro: "بودكاست «حديث العش»: حلقات نتحدث فيها مع ضيوف عن أبعاد الوعي الرقمي الستة.",
      planned: ["الحلقة الأولى: لماذا نقع في فخ الاحتيال؟"]
    }
  }
];

export function sectionFor(route: SectionRoute): Section {
  return SECTIONS.find((section) => section.route === route)!;
}
