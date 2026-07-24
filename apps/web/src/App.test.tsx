import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { App } from './App';
import { scoreBandClassName, scoreBandFor, scoreBandLabel } from './scoreBands';
import {
  shouldShowExtractedAdviceSection,
  shouldShowPositiveSignalsSection
} from './resultVisibility';
import {
  analysisButtonLabel,
  API_ERROR_MESSAGE,
  EMPTY_INPUT_MESSAGE,
  SCORE_MEANING_TEXT
} from './uiLabels';

function renderAppMarkup(): string {
  return renderToStaticMarkup(<App />);
}

describe('web analysis flow', () => {
  it('renders centered MirrorAI brand hierarchy in Arabic-first layout', () => {
    const markup = renderAppMarkup();

    expect(markup).toContain('class="brand-header centered"');
    expect(markup).toContain('MirrorAI');
    expect(markup).toContain('رفيقك الرقمي');
    expect(markup).toContain('منتج من NestHive');
  });

  it('renders input labels and primary CTA text in Arabic', () => {
    const markup = renderAppMarkup();

    expect(markup).toContain('تحليل المحتوى');
    expect(markup).toContain('ما المحتوى الذي تريد تحليله؟');
    expect(markup).toContain('رابط مرتبط بالمحتوى — اختياري');
    expect(markup).toContain(analysisButtonLabel(false));
  });

  it('keeps loading button label helper behavior stable', () => {
    expect(analysisButtonLabel(false)).toBe('تحليل المحتوى');
    expect(analysisButtonLabel(true)).toBe('جارٍ التحليل...');
  });

  it('keeps friendly input and api error messages in ui labels', () => {
    expect(EMPTY_INPUT_MESSAGE).toContain('أدخل');
    expect(API_ERROR_MESSAGE).toContain('تعذر');
  });

  it('keeps score meaning helper text available for result card', () => {
    expect(SCORE_MEANING_TEXT).toContain('مؤشرات الخطر');
  });

  it('maps score bands to the expected labels', () => {
    expect(scoreBandFor(0)).toBe('low');
    expect(scoreBandFor(24)).toBe('low');
    expect(scoreBandFor(25)).toBe('caution');
    expect(scoreBandFor(49)).toBe('caution');
    expect(scoreBandFor(50)).toBe('medium');
    expect(scoreBandFor(74)).toBe('medium');
    expect(scoreBandFor(75)).toBe('high');
    expect(scoreBandFor(100)).toBe('high');

    expect(scoreBandLabel('low')).toBe('منخفض');
    expect(scoreBandLabel('caution')).toBe('يستدعي الانتباه');
    expect(scoreBandLabel('medium')).toBe('متوسط');
    expect(scoreBandLabel('high')).toBe('مرتفع');
  });

  it('maps score bands to the expected css classes', () => {
    expect(scoreBandClassName('low')).toBe('risk-band-low');
    expect(scoreBandClassName('caution')).toBe('risk-band-caution');
    expect(scoreBandClassName('medium')).toBe('risk-band-medium');
    expect(scoreBandClassName('high')).toBe('risk-band-high');
  });

  it('keeps positive signals section visibility conditional', () => {
    expect(shouldShowPositiveSignalsSection(0)).toBe(false);
    expect(shouldShowPositiveSignalsSection(1)).toBe(true);
  });

  it('keeps extracted advice section visibility conditional', () => {
    expect(shouldShowExtractedAdviceSection(0)).toBe(false);
    expect(shouldShowExtractedAdviceSection(2)).toBe(true);
  });

  it('renders idle empty state guidance before any analysis', () => {
    const markup = renderAppMarkup();

    expect(markup).toContain('ابدأ بلصق المحتوى ثم اضغط');
    expect(markup).toContain('النتيجة');
  });
});