const rawApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

// No implicit "localhost" fallback: on a physical device or the Android
// emulator that resolves to the device/emulator itself, not the dev machine
// running apps/api, which would fail silently against the wrong host.
export const apiBaseUrl = rawApiBaseUrl ? rawApiBaseUrl.replace(/\/$/, "") : null;
