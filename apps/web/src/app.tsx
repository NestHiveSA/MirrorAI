import { type FormEvent, useState } from "react";
import type { AnalysisResult } from "@mirrorai/shared";
import { analyze } from "./analyze";
import { buildRequestBody } from "./request";
import {
  API_ERROR_MESSAGE,
  EMPTY_INPUT_MESSAGE,
  LIMITATIONS,
  SCORE_MEANING_TEXT,
  actionsFor,
  copyForSignal,
  levelClassName,
  levelLabel,
  summaryFor
} from "./copy";

type AnalysisState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: AnalysisResult }
  | { status: "error"; message: string };

export function App() {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [state, setState] = useState<AnalysisState>({ status: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!content.trim()) {
      setState({ status: "error", message: EMPTY_INPUT_MESSAGE });
      return;
    }

    setState({ status: "loading" });

    try {
      setState({ status: "success", result: await analyze(buildRequestBody(content, url)) });
    } catch {
      setState({ status: "error", message: API_ERROR_MESSAGE });
    }
  }

  const result = state.status === "success" ? state.result : null;

  return (
    <main className="app-shell">
      <header className="brand-header centered">
        <div className="brand-logo-slot">
          <img src="/brand/mirrorai-logo.png" alt="MirrorAI" />
        </div>
        <div className="brand-title-wrap">
          <h1>MirrorAI</h1>
          <p className="brand-tagline">رفيقك الرقمي</p>
        </div>
        <p className="brand-attribution">منتج من NestHive</p>
      </header>

      <section className="intro-card">
        <p>الصق رسالة أو منشوراً وصلك، وسنريك الإشارات التي تستحق الانتباه قبل أن تقرر. لا نحفظ ما تكتبه.</p>
      </section>

      <section className="input-card">
        <div className="section-title">
          <h2>توقّف، فكّر، تحقّق</h2>
        </div>

        <form
          className="analysis-form"
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
        >
          <label htmlFor="content-input">ما الرسالة التي تريد فحصها؟</label>
          <textarea
            id="content-input"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="الصق هنا رسالة SMS أو واتساب أو منشوراً... بالعربية أو الدارجة أو الفرنسية"
            rows={7}
          />

          <div className="secondary-input">
            <label htmlFor="url-input">رابط مرتبط بالرسالة (اختياري)</label>
            <input
              id="url-input"
              type="url"
              dir="ltr"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://"
            />
            <p className="field-note">لا تفتح الرابط. يكفي أن تلصقه هنا.</p>
          </div>

          <button type="submit" disabled={state.status === "loading"}>
            {state.status === "loading" ? "جارٍ الفحص..." : "افحص الرسالة"}
          </button>

          {state.status === "error" ? <p className="error-banner">{state.message}</p> : null}
        </form>
      </section>

      <section className="results-grid" aria-live="polite">
        {result ? (
          <>
            <article className={`result-card score-card full-width ${levelClassName(result.risk_level)}`}>
              <span className="card-label">مستوى الخطر</span>
              <strong>{levelLabel(result.risk_level)}</strong>
              {result.risk_score !== null ? (
                <>
                  <progress
                    className="score-progress"
                    max={100}
                    value={result.risk_score}
                    aria-label="مؤشر المخاطر"
                    aria-valuetext={`${result.risk_score} من 100`}
                  />
                  <p className="score-band-label">{result.risk_score} / 100</p>
                  <p>{SCORE_MEANING_TEXT}</p>
                </>
              ) : null}
              <p>{summaryFor(result)}</p>
            </article>

            {result.signals.length > 0 ? (
              <article className="result-card full-width">
                <span className="card-label">ما الذي لاحظناه؟</span>
                <ul className="signal-list">
                  {result.signals.map((signal) => {
                    const copy = copyForSignal(signal.signal_id);

                    return (
                      <li key={signal.signal_id}>
                        <strong>{copy.title}</strong>
                        <span>{copy.description}</span>
                      </li>
                    );
                  })}
                </ul>
              </article>
            ) : null}

            <article className="result-card full-width">
              <span className="card-label">ماذا تفعل الآن؟</span>
              <ul className="action-list">
                {actionsFor(result).map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </article>

            <article className="result-card full-width">
              <span className="card-label">حدود التحليل</span>
              <ul className="action-list subtle">
                {LIMITATIONS.map((limitation) => (
                  <li key={limitation}>{limitation}</li>
                ))}
              </ul>
            </article>
          </>
        ) : (
          <article className="result-card empty-state full-width">
            <span className="card-label">النتيجة</span>
            <p>بعد الفحص ستظهر هنا الإشارات التي رصدناها، وسبب أهميتها، وما يُنصح أن تفعله.</p>
          </article>
        )}
      </section>

      {state.status === "loading" ? <div className="loading-bar" aria-hidden="true" /> : null}
    </main>
  );
}
