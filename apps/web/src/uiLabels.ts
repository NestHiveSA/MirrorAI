export function analysisButtonLabel(isLoading: boolean): string {
  return isLoading ? 'جارٍ التحليل...' : 'تحليل المحتوى';
}

export const EMPTY_INPUT_MESSAGE = 'أدخل نصًا أو محتوى لتحليله أولًا.';
export const API_ERROR_MESSAGE = 'تعذر إكمال التحليل حاليًا. حاول مرة أخرى.';
export const SCORE_MEANING_TEXT =
  'تمثل هذه الدرجة قوة وتراكم مؤشرات الخطر المكتشفة، وليست نسبة لاحتمال أن يكون المحتوى كاذبًا أو احتياليًا.';
