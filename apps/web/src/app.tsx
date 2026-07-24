import { useMemo, useState } from "react";
import type { AnalysisInputType, AnalysisResult } from "@mirrorai/shared";
import { apiBaseUrl } from "./config";

const supportedInputs: AnalysisInputType[] = ["INPUT-TEXT", "INPUT-URL", "INPUT-MIXED"];

const sampleCases = {
  awareness: {
    input_type: "INPUT-TEXT" as const,
    content: "تحذير أمني: لا تشارك رمز التحقق مع أي شخص ولا تضغط على الروابط المجهولة"
  },
  phishing: {
    input_type: "INPUT-TEXT" as const,
    content: "عاجل: نحن من البنك. أرسل رمز التحقق الآن لتجنب إيقاف الحساب"
  },
  verification: {
    input_type: "INPUT-TEXT" as const,
    content: "يرجى التحقق من هويتك عبر الرابط الرسمي قبل متابعة الطلب"
  }
};

function formatRequestBody(inputType: AnalysisInputType, content: string, url: string) {
  if (inputType === "INPUT-URL") {
    return { input_type: inputType, url };
  }

  if (inputType === "INPUT-MIXED") {
    return { input_type: inputType, content, url };
  }

  return { input_type: inputType, content };
}

export function App() {
  const [inputType, setInputType] = useState<AnalysisInputType>("INPUT-TEXT");
  const [content, setContent] = useState(sampleCases.awareness.content);
  const [url, setUrl] = useState("https://example.com");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [httpStatus, setHttpStatus] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestPreview = useMemo(
    () => JSON.stringify(formatRequestBody(inputType, content, url), null, 2),
    [content, inputType, url]
  );

  async function runAnalysis(payload: ReturnType<typeof formatRequestBody>) {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const responseBody = (await response.json()) as AnalysisResult | { error?: { message?: string } };

      setHttpStatus(response.status);

      if (!response.ok) {
        setResult(null);
        setErrorMessage("error" in responseBody && responseBody.error?.message ? responseBody.error.message : "An unexpected error occurred.");
        return;
      }

      setResult(responseBody as AnalysisResult);
    } catch (error) {
      setHttpStatus(null);
      setResult(null);
      setErrorMessage(error instanceof Error ? error.message : "Failed to reach the analysis API.");
    } finally {
      setIsLoading(false);
    }
  }

  function loadSample(sample: keyof typeof sampleCases) {
    const selected = sampleCases[sample];

    setInputType(selected.input_type);
    setContent(selected.content);
    setUrl("https://example.com");
    setResult(null);
    setHttpStatus(null);
    setErrorMessage(null);
  }

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">MirrorAI MVP v0.1</p>
        <h1>بنية أساسية عربية أولاً لتحليل المخاطر الرقمية</h1>
        <p className="lede">
          هذه الواجهة تستدعي الـ API المحلي مباشرة وتعرض نتيجة التحليل الفعلية من
          Route → AnalysisService → Risk Engine → Response.
        </p>
        <div className="sample-buttons" aria-label="عينات الإدخال">
          <button type="button" className="secondary-button" onClick={() => loadSample("awareness")}>
            عيّنة توعوية
          </button>
          <button type="button" className="secondary-button" onClick={() => loadSample("phishing")}>
            عيّنة تصيّد
          </button>
          <button type="button" className="secondary-button" onClick={() => loadSample("verification")}>
            عيّنة تحقق
          </button>
        </div>
      </section>

      <section className="panel">
        <h2>تشغيل التحليل</h2>
        <div className="form-grid">
          <label>
            نوع الإدخال
            <select value={inputType} onChange={(event) => setInputType(event.target.value as AnalysisInputType)}>
              {supportedInputs.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          {(inputType === "INPUT-TEXT" || inputType === "INPUT-MIXED") && (
            <label>
              المحتوى
              <textarea
                rows={6}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="اكتب أو الصق الرسالة هنا"
              />
            </label>
          )}

          {(inputType === "INPUT-URL" || inputType === "INPUT-MIXED") && (
            <label>
              الرابط
              <input
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://example.com"
              />
            </label>
          )}
        </div>

        <div className="action-row">
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              void runAnalysis(formatRequestBody(inputType, content, url));
            }}
            disabled={isLoading}
          >
            {isLoading ? "جاري التحليل..." : "تحليل الآن"}
          </button>
          <span className="request-preview-label">معاينة الطلب</span>
        </div>

        <pre className="request-preview">{requestPreview}</pre>
      </section>

      <section className="panel">
        <h2>نتيجة التحليل</h2>
        <div className="result-meta">
          <span>HTTP status: {httpStatus ?? "-"}</span>
          <span>risk_score: {result?.risk_score ?? "-"}</span>
          <span>risk_level: {result?.risk_level ?? "-"}</span>
          <span>confidence: {result?.confidence ?? "-"}</span>
        </div>

        {errorMessage ? <p className="error-box">{errorMessage}</p> : null}

        {result ? (
          <div className="result-stack">
            <section>
              <h3>Summary</h3>
              <p>{result.summary}</p>
            </section>

            <section>
              <h3>Explanation</h3>
              <p>{result.explanation}</p>
            </section>

            <section>
              <h3>Evidence</h3>
              <ul>
                {result.evidence.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3>Recommended actions</h3>
              <ul>
                {result.recommended_actions.map((action) => (
                  <li key={`${action.level}-${action.title}`}>
                    <strong>{action.level}</strong> {action.title}: {action.description}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3>Raw JSON</h3>
              <pre className="json-block">{JSON.stringify(result, null, 2)}</pre>
            </section>
          </div>
        ) : (
          <p className="empty-state">اختر عيّنة أو اكتب إدخالًا ثم اضغط على تحليل الآن.</p>
        )}
      </section>
    </main>
  );
}
