import { useState } from "react";
import { AWARENESS_QUESTIONS, LIKERT_OPTIONS, scoreAwareness, type AwarenessResult } from "../awareness";

export function AwarenessScreen() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<AwarenessResult | null>(null);

  function restart() {
    setAnswers({});
    setIndex(0);
    setResult(null);
    setStarted(true);
  }

  const question = AWARENESS_QUESTIONS[index] ?? AWARENESS_QUESTIONS[0]!;

  function answer(value: number) {
    const next = { ...answers, [question.key]: value };
    setAnswers(next);

    if (index + 1 < AWARENESS_QUESTIONS.length) {
      setIndex(index + 1);
    } else {
      setResult(scoreAwareness(next));
    }
  }

  if (!started) {
    return (
      <section className="result-card full-width awareness-intro">
        <p>
          أجب عن 24 عبارة قصيرة بصراحة. في النهاية ترى مؤشر وعيك الرقمي من 100، ودرجتك في كل بُعد من الأبعاد الستة،
          ونصيحة لما يستحق أن تبدأ به.
        </p>
        <p className="field-note">
          الأسئلة مأخوذة من «نظرية الوعي الرقمي» ومؤشرها المقترح، وما زالت في مرحلة التجريب. إجاباتك تبقى على هاتفك
          ولا تُرسل لأي جهة.
        </p>
        <button type="button" className="primary-button" onClick={() => setStarted(true)}>
          ابدأ
        </button>
      </section>
    );
  }

  if (result) {
    return (
      <section className="results-grid" aria-live="polite">
        <article className="result-card full-width awareness-score">
          <span className="card-label">مؤشر وعيك الرقمي</span>
          <strong>
            {result.score} / 100 · {result.level.label}
          </strong>
          <p>{result.level.description}</p>
        </article>

        <article className="result-card full-width">
          <span className="card-label">درجتك في كل بُعد</span>
          <ul className="dimension-list">
            {result.dimensions.map(({ dimension, score }) => (
              <li key={dimension.id}>
                <span>{dimension.title}</span>
                <progress max={100} value={score} aria-label={dimension.title} />
                <b>{score}</b>
              </li>
            ))}
          </ul>
        </article>

        <article className="result-card full-width">
          <span className="card-label">ابدأ من هنا: {result.weakest.dimension.title}</span>
          <p>{result.weakest.dimension.tip}</p>
        </article>

        <button type="button" className="secondary-button" onClick={restart}>
          أعد الاختبار
        </button>
      </section>
    );
  }

  return (
    <section className="result-card full-width awareness-question">
      <div className="question-progress">
        <span>
          {index + 1} من {AWARENESS_QUESTIONS.length} · {question.dimension.title}
        </span>
        <progress max={AWARENESS_QUESTIONS.length} value={index + 1} aria-hidden="true" />
      </div>

      <h2>{question.statement}</h2>

      <div className="likert-options" role="group" aria-label="إجابتك">
        {LIKERT_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={answers[question.key] === option.value ? "selected" : undefined}
            onClick={() => answer(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {index > 0 ? (
        <button type="button" className="link-button" onClick={() => setIndex(index - 1)}>
          السؤال السابق
        </button>
      ) : null}
    </section>
  );
}
