import { type FormEvent, useEffect, useState } from "react";
import type { AnalysisResult } from "@mirrorai/shared";
import { analyze } from "./analyze";
import { buildRequestBody } from "./request";
import { LIMITS, SCORE_MEANING, actionsFor, copyForSignal, levelClassName, levelLabel, summaryFor } from "./copy";
import { type Lang, type UiText, dirFor, readStoredLang, storeLang, ui } from "./i18n";
import { lessons, quiz, scoreLevel } from "./learn";

type Tab = "home" | "check" | "learn" | "quiz" | "media" | "about";

const SHOP_URL = "https://souktree.ma";

type AnalysisState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: AnalysisResult }
  | { status: "error"; message: string };

export function App() {
  const [lang, setLang] = useState<Lang>(readStoredLang);
  const [tab, setTab] = useState<Tab>("home");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [state, setState] = useState<AnalysisState>({ status: "idle" });
  const t = ui[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dirFor(lang);
    document.title = `MirrorAI — ${ui[lang].tagline}`;
  }, [lang]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [tab]);

  function switchLang() {
    const next: Lang = lang === "ar" ? "fr" : "ar";
    storeLang(next);
    setLang(next);
    if (state.status === "error") setState({ status: "idle" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!content.trim()) {
      setState({ status: "error", message: t.check.emptyInput });
      return;
    }

    setState({ status: "loading" });

    try {
      setState({ status: "success", result: await analyze(buildRequestBody(content, url)) });
    } catch {
      setState({ status: "error", message: t.check.apiError });
    }
  }

  function clearAll() {
    setContent("");
    setUrl("");
    setState({ status: "idle" });
  }

  return (
    <div className="app-frame" dir={dirFor(lang)} lang={lang}>
      <main className="app-shell">
        <header className="brand-header">
          <div className="brand-row">
            <img className="brand-logo" src="/brand/mirrorai-logo.png" alt="MirrorAI" />
            <div className="brand-title-wrap">
              <h1>MirrorAI</h1>
              <p className="brand-tagline">{t.tagline}</p>
            </div>
            <button type="button" className="lang-switch" onClick={switchLang} lang={lang === "ar" ? "fr" : "ar"}>
              {t.langSwitch}
            </button>
          </div>
          <p className="brand-attribution">
            <img src="/brand/nesthive-nest.png" alt="NestHive" />
            <span>{t.attribution}</span>
          </p>
        </header>

        {tab === "home" ? <HomeScreen t={t} onOpen={setTab} /> : null}
        {tab === "check" ? (
          <CheckScreen
            t={t}
            lang={lang}
            content={content}
            url={url}
            state={state}
            onContent={setContent}
            onUrl={setUrl}
            onSubmit={(event) => {
              void handleSubmit(event);
            }}
            onExample={() => {
              setContent(t.check.exampleMessage);
              setState({ status: "idle" });
            }}
            onClear={clearAll}
          />
        ) : null}
        {tab === "learn" ? <LearnScreen t={t} lang={lang} quizFirst={false} /> : null}
        {tab === "quiz" ? <LearnScreen t={t} lang={lang} quizFirst /> : null}
        {tab === "media" ? <MediaScreen t={t} /> : null}
        {tab === "about" ? <AboutScreen t={t} /> : null}
      </main>

      <nav className="tab-bar" aria-label="MirrorAI">
        <TabButton active={tab === "home"} icon="🏠" label={t.tabs.home} onClick={() => setTab("home")} />
        <TabButton active={tab === "check"} icon="🔍" label={t.tabs.check} onClick={() => setTab("check")} />
        <TabButton active={tab === "learn" || tab === "quiz"} icon="🎓" label={t.tabs.learn} onClick={() => setTab("learn")} />
        <TabButton active={tab === "about"} icon="ℹ️" label={t.tabs.about} onClick={() => setTab("about")} />
      </nav>

      {state.status === "loading" ? <div className="loading-bar" aria-hidden="true" /> : null}
    </div>
  );
}

function TabButton(props: { active: boolean; icon: string; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className={props.active ? "tab active" : "tab"}
      aria-current={props.active ? "page" : undefined}
      onClick={props.onClick}
    >
      <span className="tab-icon" aria-hidden="true">
        {props.icon}
      </span>
      <span>{props.label}</span>
    </button>
  );
}

function HomeScreen({ t, onOpen }: { t: UiText; onOpen: (tab: Tab) => void }) {
  const tiles: { key: Exclude<Tab, "home">; icon: string; tone: string }[] = [
    { key: "check", icon: "🔍", tone: "tone-teal" },
    { key: "quiz", icon: "✅", tone: "tone-violet" },
    { key: "media", icon: "🎬", tone: "tone-orange" },
    { key: "learn", icon: "🎓", tone: "tone-green" },
    { key: "about", icon: "🔒", tone: "tone-navy" }
  ];

  return (
    <section className="home" aria-labelledby="home-title">
      <div className="home-head">
        <h2 id="home-title">{t.home.hello}</h2>
        <p>{t.home.sub}</p>
      </div>
      <div className="tile-grid">
        {tiles.map((tile) => {
          const copy = t.home.tiles[tile.key];
          return (
            <button key={tile.key} type="button" className={`tile ${tile.tone}`} onClick={() => onOpen(tile.key)}>
              <span className="tile-icon" aria-hidden="true">
                {tile.icon}
              </span>
              <strong>{copy.title}</strong>
              <span className="tile-text">{copy.text}</span>
            </button>
          );
        })}
        <a className="tile tone-yellow" href={SHOP_URL} target="_blank" rel="noopener noreferrer">
          <span className="tile-icon" aria-hidden="true">
            👕
          </span>
          <strong>{t.home.tiles.shop.title}</strong>
          <span className="tile-text">{t.home.tiles.shop.text}</span>
          <span className="tile-external">↗ {t.home.external}</span>
        </a>
      </div>
    </section>
  );
}

function MediaScreen({ t }: { t: UiText }) {
  return (
    <>
      <section className="intro-card">
        <p>{t.media.intro}</p>
      </section>
      <section className="input-card">
        <div className="section-title">
          <h2>{t.media.heading}</h2>
        </div>
        <div className="media-list">
          {t.media.items.map((item) => (
            <article key={item.id} className="media-card">
              <span className={item.id === "tifinagh" ? "media-icon tifinagh" : "media-icon"} aria-hidden="true">
                {item.icon}
              </span>
              <div className="media-body">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                {item.url ? (
                  <a className="primary-button small" href={item.url} target="_blank" rel="noopener noreferrer">
                    ▶ {t.media.listen}
                  </a>
                ) : (
                  <span className="soon-badge">{t.media.soon}</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

type CheckProps = {
  t: UiText;
  lang: Lang;
  content: string;
  url: string;
  state: AnalysisState;
  onContent: (value: string) => void;
  onUrl: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onExample: () => void;
  onClear: () => void;
};

function CheckScreen({ t, lang, content, url, state, onContent, onUrl, onSubmit, onExample, onClear }: CheckProps) {
  const result = state.status === "success" ? state.result : null;

  return (
    <>
      <section className="intro-card">
        <p>{t.check.intro}</p>
      </section>

      <section className="input-card">
        <div className="section-title">
          <h2>{t.check.heading}</h2>
        </div>

        <form className="analysis-form" onSubmit={onSubmit}>
          <label htmlFor="content-input">{t.check.contentLabel}</label>
          <textarea
            id="content-input"
            value={content}
            onChange={(event) => onContent(event.target.value)}
            placeholder={t.check.contentPlaceholder}
            rows={7}
          />

          <div className="helper-row">
            <button type="button" className="ghost-button" onClick={onExample}>
              {t.check.tryExample}
            </button>
            {content || url || result ? (
              <button type="button" className="ghost-button" onClick={onClear}>
                {t.check.clear}
              </button>
            ) : null}
          </div>

          <div className="secondary-input">
            <label htmlFor="url-input">{t.check.urlLabel}</label>
            <input
              id="url-input"
              type="url"
              dir="ltr"
              value={url}
              onChange={(event) => onUrl(event.target.value)}
              placeholder="https://"
            />
            <p className="field-note">{t.check.urlNote}</p>
          </div>

          <button type="submit" className="primary-button" disabled={state.status === "loading"}>
            {state.status === "loading" ? t.check.loading : t.check.submit}
          </button>

          {state.status === "error" ? <p className="error-banner">{state.message}</p> : null}
        </form>
      </section>

      <section className="results-grid" aria-live="polite">
        {result ? (
          <>
            <article className={`result-card score-card full-width ${levelClassName(result.risk_level)}`}>
              <span className="card-label">{t.check.levelLabel}</span>
              <strong>{levelLabel(result.risk_level, lang)}</strong>
              {result.risk_score !== null ? (
                <>
                  <progress
                    className="score-progress"
                    max={100}
                    value={result.risk_score}
                    aria-label={t.check.scoreAria}
                    aria-valuetext={`${result.risk_score} ${t.check.scoreOf}`}
                  />
                  <p className="score-band-label">{result.risk_score} / 100</p>
                  <p>{SCORE_MEANING[lang]}</p>
                </>
              ) : null}
              <p>{summaryFor(result, lang)}</p>
            </article>

            {result.signals.length > 0 ? (
              <article className="result-card full-width">
                <span className="card-label">{t.check.signalsLabel}</span>
                <ul className="signal-list">
                  {result.signals.map((signal) => {
                    const copy = copyForSignal(signal.signal_id, lang);

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
              <span className="card-label">{t.check.actionsLabel}</span>
              <ul className="action-list">
                {actionsFor(result, lang).map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </article>

            <article className="result-card full-width">
              <span className="card-label">{t.check.limitsLabel}</span>
              <ul className="action-list subtle">
                {LIMITS[lang].map((limitation) => (
                  <li key={limitation}>{limitation}</li>
                ))}
              </ul>
            </article>
          </>
        ) : (
          <article className="result-card empty-state full-width">
            <span className="card-label">{t.check.resultLabel}</span>
            <p>{t.check.emptyResult}</p>
          </article>
        )}
      </section>
    </>
  );
}

type QuizState =
  | { step: "intro" }
  | { step: "question"; index: number; picked: number | null; score: number }
  | { step: "done"; score: number };

function LearnScreen({ t, lang, quizFirst }: { t: UiText; lang: Lang; quizFirst: boolean }) {
  const [quizState, setQuizState] = useState<QuizState>({ step: "intro" });
  const questions = quiz[lang];
  const total = questions.length;

  const lessonsSection = (
      <section className="input-card" key="lessons">
        <div className="section-title">
          <h2>{t.learn.lessonsHeading}</h2>
        </div>
        <div className="lesson-grid">
          {lessons[lang].map((lesson) => (
            <article key={lesson.id} className="lesson-card">
              <h3>
                <span aria-hidden="true">{lesson.icon}</span> {lesson.title}
              </h3>
              <p className="lesson-label">{t.learn.looksLike}</p>
              <p>{lesson.looksLike}</p>
              <p className="lesson-label do">{t.learn.doThis}</p>
              <p>{lesson.doThis}</p>
            </article>
          ))}
        </div>
      </section>
  );

  const quizSection = (
      <section className="input-card quiz-card" aria-live="polite" key="quiz">
        <div className="section-title">
          <h2>{t.learn.quizHeading}</h2>
        </div>

        {quizState.step === "intro" ? (
          <>
            <p className="quiz-text">{t.learn.quizIntro}</p>
            <button
              type="button"
              className="primary-button"
              onClick={() => setQuizState({ step: "question", index: 0, picked: null, score: 0 })}
            >
              {t.learn.start}
            </button>
          </>
        ) : null}

        {quizState.step === "question"
          ? (() => {
              const question = questions[quizState.index];
              if (!question) return null;
              const answered = quizState.picked !== null;
              const isLast = quizState.index === total - 1;

              return (
                <>
                  <p className="quiz-progress">
                    {t.learn.question} {quizState.index + 1} {t.learn.of} {total}
                  </p>
                  <p className="quiz-text">{question.scenario}</p>
                  <div className="quiz-options">
                    {question.options.map((option, optionIndex) => {
                      let className = "quiz-option";
                      if (answered && optionIndex === question.answer) className += " correct";
                      else if (answered && optionIndex === quizState.picked) className += " wrong";

                      return (
                        <button
                          key={option}
                          type="button"
                          className={className}
                          disabled={answered}
                          onClick={() =>
                            setQuizState({
                              ...quizState,
                              picked: optionIndex,
                              score: quizState.score + (optionIndex === question.answer ? 1 : 0)
                            })
                          }
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {answered ? (
                    <div className={quizState.picked === question.answer ? "quiz-feedback good" : "quiz-feedback bad"}>
                      <strong>{quizState.picked === question.answer ? `✓ ${t.learn.correct}` : `✗ ${t.learn.wrong}`}</strong>
                      <p>{question.why}</p>
                      <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                          setQuizState(
                            isLast
                              ? { step: "done", score: quizState.score }
                              : { step: "question", index: quizState.index + 1, picked: null, score: quizState.score }
                          )
                        }
                      >
                        {isLast ? t.learn.seeScore : t.learn.next}
                      </button>
                    </div>
                  ) : null}
                </>
              );
            })()
          : null}

        {quizState.step === "done" ? (
          <div className="quiz-result">
            <p className="card-label">{t.learn.scoreTitle}</p>
            <strong className="quiz-score">
              {quizState.score} / {total}
            </strong>
            <p>{t.learn.levels[scoreLevel(quizState.score, total)]}</p>
            <button type="button" className="primary-button" onClick={() => setQuizState({ step: "intro" })}>
              {t.learn.restart}
            </button>
          </div>
        ) : null}
      </section>
  );

  return (
    <>
      <section className="intro-card">
        <p>{t.learn.intro}</p>
      </section>
      {quizFirst ? [quizSection, lessonsSection] : [lessonsSection, quizSection]}
    </>
  );
}

function AboutScreen({ t }: { t: UiText }) {
  return (
    <>
      <section className="input-card about-card">
        <div className="section-title">
          <h2>{t.about.heading}</h2>
        </div>
        <p>{t.about.what}</p>

        <h3>{t.about.howHeading}</h3>
        <ol className="about-steps">
          {t.about.how.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>

        <h3>🔒 {t.about.privacyHeading}</h3>
        <ul className="action-list">
          {t.about.privacy.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p>
          <a className="text-link" href="/privacy.html">
            {t.about.privacyLink}
          </a>
        </p>

        <h3>🎁 {t.about.freeHeading}</h3>
        <p>{t.about.free}</p>

        <h3>{t.about.madeByHeading}</h3>
        <p className="made-by">
          <img src="/brand/nesthive-nest.png" alt="" />
          <span>{t.about.madeBy}</span>
        </p>

        <h3>{t.about.contactHeading}</h3>
        <ul className="contact-list">
          <li>
            <a className="text-link" href="mailto:contact@nesthive.ma" dir="ltr">
              contact@nesthive.ma
            </a>
          </li>
          <li>
            <a className="text-link" href="https://nesthive.ma" target="_blank" rel="noopener noreferrer" dir="ltr">
              nesthive.ma
            </a>
          </li>
        </ul>

        <p className="disclaimer">{t.about.disclaimer}</p>
      </section>
    </>
  );
}
