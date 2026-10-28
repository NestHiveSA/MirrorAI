import { useEffect, useState } from "react";

// Hash routes keep navigation in the web view's history, so the Android back
// button and the browser back button both return to the previous screen.
export const ROUTES = ["home", "check", "awareness", "library", "videos", "podcast"] as const;
export type Route = (typeof ROUTES)[number];

export function routeFromHash(hash: string): Route {
  const name = hash.replace(/^#\/?/, "");
  return (ROUTES as readonly string[]).includes(name) ? (name as Route) : "home";
}

export function hrefFor(route: Route): string {
  return route === "home" ? "#/" : `#/${route}`;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === "undefined" ? "home" : routeFromHash(window.location.hash)
  );

  useEffect(() => {
    const onHashChange = () => {
      setRoute(routeFromHash(window.location.hash));
      window.scrollTo(0, 0);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return route;
}
