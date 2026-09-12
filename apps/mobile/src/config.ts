const rawApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

export const apiBaseUrl = rawApiBaseUrl ? rawApiBaseUrl.replace(/\/$/, "") : "http://localhost:3001";
