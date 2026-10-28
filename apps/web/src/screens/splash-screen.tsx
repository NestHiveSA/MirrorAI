import { useEffect, useState } from "react";

const SPLASH_MS = 2200;

// Opening screen shown once per launch; a tap skips it.
export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const leave = window.setTimeout(() => setLeaving(true), SPLASH_MS - 400);
    const done = window.setTimeout(onDone, SPLASH_MS);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
    };
  }, [onDone]);

  return (
    <div className={`splash${leaving ? " leaving" : ""}`} role="presentation" onClick={onDone}>
      <img className="splash-logo" src="/brand/mirrorai-logo.png" alt="" />
      <h1>MirrorAI</h1>
      <p className="splash-welcome">مرحباً بك في العش الرقمي</p>
      <p className="brand-attribution splash-attribution">
        <img src="/brand/nesthive-nest.png" alt="NestHive" />
        <span>منتج من NestHive</span>
      </p>
    </div>
  );
}
