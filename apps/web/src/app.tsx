import { useCallback, useState } from "react";
import { hrefFor, useRoute } from "./routes";
import { sectionFor } from "./sections";
import { AwarenessScreen } from "./screens/awareness-screen";
import { CheckScreen } from "./screens/check-screen";
import { ComingSoonScreen } from "./screens/coming-soon-screen";
import { HomeScreen } from "./screens/home-screen";
import { SplashScreen } from "./screens/splash-screen";

export function App() {
  const route = useRoute();
  const [showSplash, setShowSplash] = useState(true);
  const hideSplash = useCallback(() => setShowSplash(false), []);

  if (route === "home") {
    return (
      <main className="app-shell">
        {showSplash ? <SplashScreen onDone={hideSplash} /> : null}
        <HomeScreen />
      </main>
    );
  }

  const section = sectionFor(route);

  return (
    <main className="app-shell">
      <header className="screen-header">
        <a className="back-link" href={hrefFor("home")} aria-label="الرجوع إلى الرئيسية">
          →
        </a>
        <h1>{section.title}</h1>
        <img src="/brand/mirrorai-logo.png" alt="MirrorAI" />
      </header>

      {route === "check" ? <CheckScreen /> : null}
      {route === "awareness" ? <AwarenessScreen /> : null}
      {section.comingSoon ? <ComingSoonScreen section={section} /> : null}
    </main>
  );
}
