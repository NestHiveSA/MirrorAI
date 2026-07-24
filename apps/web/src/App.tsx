import { FormEvent, useState } from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  CircleHelp,
  ClipboardList,
  Compass,
  FileSearch,
  Info,
  Sparkles,
  Radar,
  ShieldCheck
} from 'lucide-react';
import type { AnalyzeResponse } from '@mirrorai/shared';
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

type AnalysisState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: AnalyzeResponse }
  | { status: 'error'; message: string };

function levelLabel(level: AnalyzeResponse['analysis']['level']): string {
  if (level === 'high') return 'مرتفع';
  if (level === 'medium') return 'متوسط';
  return 'منخفض';
}

export function App() {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [useFallbackLogo, setUseFallbackLogo] = useState(false);
  const [state, setState] = useState<AnalysisState>({ status: 'idle' });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText) {
      setState({ status: 'error', message: EMPTY_INPUT_MESSAGE });
      return;
    }

    setState({ status: 'loading' });

    try {
      const response = await fetch('/api/v1/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: trimmedText,
          url: url.trim() || undefined
        })
      });

      if (!response.ok) {
        throw new Error(API_ERROR_MESSAGE);
      }

      const data = (await response.json()) as AnalyzeResponse;
      setState({ status: 'success', data });
    } catch (error) {
      setState({
        status: 'error',
        message: error instanceof Error ? error.message : API_ERROR_MESSAGE
      });
    }
  }

  const analysis = state.status === 'success' ? state.data.analysis : null;
  const isUrlSet = url.trim().length > 0;
  const riskSignals = analysis?.riskSignals ?? analysis?.signals ?? [];
  const positiveSignals = analysis?.positiveSignals ?? [];
  const extractedAdvice = analysis?.extractedAdvice ?? [];
  const scoreBand = analysis ? scoreBandFor(analysis.score) : 'low';
  const scoreBandLabelText = scoreBandLabel(scoreBand);
  const scoreBandClass = scoreBandClassName(scoreBand);
  const logoSource = useFallbackLogo ? '/icons/mirrorai-icon.svg' : '/brand/mirrorai-logo.png';

  return (
    <main className="app-shell">
      <header className="brand-header centered" aria-label="MirrorAI Header">
        <div className="brand-logo-slot" aria-label="MirrorAI Logo Slot">
          <img
            src={logoSource}
            alt="MirrorAI Logo"
            onError={() => setUseFallbackLogo(true)}
          />
        </div>
        <div className="brand-title-wrap">
          <h1>MirrorAI</h1>
          <p className="brand-tagline">رفيقك الرقمي</p>
        </div>
        <p className="brand-attribution">منتج من NestHive</p>
      </header>

      <section className="intro-card" aria-label="مقدمة التطبيق">
        <p>حلّل الرسائل والنصوص والمنشورات لفهم مؤشرات المخاطر قبل اتخاذ القرار.</p>
      </section>

      <section className="input-card" aria-label="واجهة التحليل">
        <div className="section-title">
          <Radar size={18} aria-hidden="true" />
          <h2>تحليل المحتوى</h2>
        </div>

        <form className="analysis-form" onSubmit={handleSubmit}>
          <label htmlFor="text-input">ما المحتوى الذي تريد تحليله؟</label>
          <textarea
            id="text-input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="الصق هنا رسالة أو منشورًا أو محتوى تريد فهم مؤشرات المخاطر فيه..."
            rows={7}
          />

          <div className="secondary-input">
            <label htmlFor="url-input">رابط مرتبط بالمحتوى — اختياري</label>
            <input
              id="url-input"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com"
            />
            <p className="field-note">
              {isUrlSet
                ? 'تمت إضافة رابط وسيُستخدم كسياق إضافي فقط.'
                : 'يمكنك تركه فارغًا إذا كنت تريد تحليل النص فقط.'}
            </p>
          </div>

          <button type="submit" disabled={state.status === 'loading'}>
            {analysisButtonLabel(state.status === 'loading')}
          </button>

          {state.status === 'error' ? <p className="error-banner">{state.message}</p> : null}
        </form>
      </section>

      <section className="results-grid" aria-live="polite">
        {analysis ? (
          <>
            <article className="result-card emphasis">
              <span className="card-label">
                <AlertTriangle size={17} aria-hidden="true" />
                مستوى الخطر
              </span>
              <strong>{levelLabel(analysis.level)}</strong>
            </article>

            <article className={`result-card score-card ${scoreBandClass}`}>
              <span className="card-label">
                <BadgeCheck size={17} aria-hidden="true" />
                مؤشر المخاطر
              </span>
              <strong>{analysis.score} / 100</strong>
              <p className="score-band-label">{scoreBandLabelText}</p>
              <progress
                className="score-progress"
                max={100}
                value={analysis.score}
                aria-label="مؤشر المخاطر"
                aria-valuetext={`${scoreBandLabelText} ${analysis.score} من 100`}
              />
              <p>
                {SCORE_MEANING_TEXT}
              </p>
            </article>

            <article className="result-card full-width">
              <span className="card-label">
                <ShieldCheck size={17} aria-hidden="true" />
                مؤشرات الخطر
              </span>
              {riskSignals.length > 0 ? (
                <ul className="signal-list">
                  {riskSignals.map((signal: AnalyzeResponse['analysis']['riskSignals'][number]) => (
                    <li key={signal.id}>
                      <strong>{signal.title}</strong>
                      <span>{signal.description}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>لم يتم رصد إشارات واضحة.</p>
              )}
            </article>

            {shouldShowPositiveSignalsSection(positiveSignals.length) ? (
              <article className="result-card full-width">
                <span className="card-label">
                  <Sparkles size={17} aria-hidden="true" />
                  مؤشرات إيجابية في المحتوى
                </span>
                <ul className="signal-list">
                  {positiveSignals.map((signal: AnalyzeResponse['analysis']['positiveSignals'][number]) => (
                    <li key={signal.id}>
                      <strong>{signal.title}</strong>
                      <span>{signal.description}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ) : null}

            <article className="result-card full-width">
              <span className="card-label">
                <FileSearch size={17} aria-hidden="true" />
                لماذا ظهرت هذه النتيجة؟
              </span>
              <p>{analysis.explanation}</p>
            </article>

            <article className="result-card full-width">
              <span className="card-label">
                <Compass size={17} aria-hidden="true" />
                ماذا يُنصح أن تفعل؟
              </span>
              <ul className="action-list">
                {analysis.recommendedActions.map((action: string) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </article>

            {shouldShowExtractedAdviceSection(extractedAdvice.length) ? (
              <article className="result-card full-width">
                <span className="card-label">
                  <ClipboardList size={17} aria-hidden="true" />
                  نصائح واردة في المحتوى
                </span>
                <ul className="action-list">
                  {extractedAdvice.map((advice: string) => (
                    <li key={advice}>{advice}</li>
                  ))}
                </ul>
              </article>
            ) : null}

            <article className="result-card full-width">
              <span className="card-label">
                <CircleHelp size={17} aria-hidden="true" />
                حدود التحليل
              </span>
              <ul className="action-list subtle">
                {analysis.limitations.map((limitation: string) => (
                  <li key={limitation}>{limitation}</li>
                ))}
              </ul>
            </article>
          </>
        ) : (
          <article className="result-card empty-state full-width">
            <span className="card-label">
              <Info size={17} aria-hidden="true" />
              النتيجة
            </span>
            <p>
              ابدأ بلصق المحتوى ثم اضغط "تحليل المحتوى" لرؤية مستوى الخطر، الإشارات المكتشفة،
              التفسير، والتوصيات.
            </p>
          </article>
        )}
      </section>

      {state.status === 'loading' ? <div className="loading-bar" aria-hidden="true" /> : null}
    </main>
  );
}
