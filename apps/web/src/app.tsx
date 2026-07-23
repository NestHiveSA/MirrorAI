import type { AnalysisInputType } from "@mirrorai/shared";

const supportedInputs: AnalysisInputType[] = ["INPUT-TEXT", "INPUT-URL", "INPUT-MIXED"];

export function App() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">MirrorAI MVP v0.1</p>
        <h1>بنية أساسية عربية أولاً لتحليل المخاطر الرقمية</h1>
        <p className="lede">
          هذا التطبيق يثبت حدود الواجهة والبنية فقط. منطق التحليل الفعلي ومسار
          التقييم سيأتيان في القضايا اللاحقة.
        </p>
      </section>

      <section className="panel">
        <h2>الحدود المعتمدة</h2>
        <ul>
          <li>الواجهة لا تستدعي أي مزود ذكاء اصطناعي مباشرة.</li>
          <li>اتجاه الواجهة من اليمين إلى اليسار ومهيأ للعربية.</li>
          <li>التحليل سيمر لاحقاً عبر API و AI Gateway و Risk Engine.</li>
        </ul>
      </section>

      <section className="panel">
        <h2>أنواع الإدخال المخطط لها</h2>
        <div className="chips">
          {supportedInputs.map((input) => (
            <span className="chip" key={input}>
              {input}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}

