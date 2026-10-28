const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

export const apiBaseUrl = rawApiBaseUrl ? rawApiBaseUrl.replace(/\/$/, "") : "";
export const analysisMode: "local" | "api" = import.meta.env.VITE_ANALYSIS_MODE === "local" ? "local" : "api";
