import { SectionIcon } from "../icons";
import { hrefFor } from "../routes";
import { SECTIONS } from "../sections";

export function HomeScreen() {
  return (
    <>
      <header className="brand-header centered">
        <div className="brand-logo-slot">
          <img src="/brand/mirrorai-logo.png" alt="MirrorAI" />
        </div>
        <div className="brand-title-wrap">
          <h1>MirrorAI</h1>
          <p className="brand-tagline">مرحباً بك في العش الرقمي</p>
        </div>
        <p className="brand-attribution">
          <img src="/brand/nesthive-nest.png" alt="NestHive" />
          <span>منتج من NestHive</span>
        </p>
      </header>

      <nav className="section-grid" aria-label="أقسام التطبيق">
        {SECTIONS.map((section) => (
          <a
            key={section.route}
            className={`section-tile section-${section.route}${section.route === "check" ? " featured" : ""}`}
            href={hrefFor(section.route)}
          >
            <SectionIcon route={section.route} />
            <strong>{section.title}</strong>
            <span>{section.description}</span>
            {section.comingSoon ? <em className="soon-badge">قريباً</em> : null}
          </a>
        ))}
      </nav>
    </>
  );
}
