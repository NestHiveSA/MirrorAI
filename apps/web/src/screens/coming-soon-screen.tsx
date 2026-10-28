import type { Section } from "../sections";

export function ComingSoonScreen({ section }: { section: Section }) {
  const comingSoon = section.comingSoon!;

  return (
    <section className="result-card full-width coming-soon">
      <span className="soon-badge">قريباً</span>
      <p>{comingSoon.intro}</p>
      <span className="card-label">ما نحضّره</span>
      <ul className="action-list">
        {comingSoon.planned.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
