import type { ReactElement } from "react";
import type { Route } from "./routes";

type IconProps = { route: Exclude<Route, "home"> };

const paths: Record<IconProps["route"], ReactElement> = {
  check: (
    <>
      <path d="M24 5 9 11v11c0 9.5 6.4 17.3 15 20 8.6-2.7 15-10.5 15-20V11L24 5Z" />
      <path d="m17 24 5 5 9-10" />
    </>
  ),
  awareness: (
    <>
      <path d="M8 32a16 16 0 1 1 32 0" />
      <path d="m24 32 8-9" />
      <circle cx="24" cy="32" r="2.5" />
      <path d="M8 38h32" />
    </>
  ),
  library: (
    <>
      <path d="M8 10c5-2 11-2 16 2v28c-5-4-11-4-16-2V10Z" />
      <path d="M40 10c-5-2-11-2-16 2v28c5-4 11-4 16-2V10Z" />
    </>
  ),
  videos: (
    <>
      <rect x="6" y="11" width="36" height="26" rx="6" />
      <path d="m21 18 9 6-9 6V18Z" />
    </>
  ),
  podcast: (
    <>
      <rect x="18" y="6" width="12" height="20" rx="6" />
      <path d="M12 22a12 12 0 0 0 24 0" />
      <path d="M24 34v7M18 41h12" />
    </>
  )
};

export function SectionIcon({ route }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="section-icon">
      {paths[route]}
    </svg>
  );
}
