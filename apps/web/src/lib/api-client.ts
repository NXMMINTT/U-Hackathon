const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const JWT_STORAGE_KEY = "u-ledger-jwt";

export function getStoredJwt(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(JWT_STORAGE_KEY);
}

export function setStoredJwt(token: string): void {
  window.localStorage.setItem(JWT_STORAGE_KEY, token);
}

/** Thin fetch wrapper: base URL + JSON + bearer token. Backend error shape is
 * always `{ error: { code, message_th } }` — see CLAUDE.md API contract notes. */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getStoredJwt();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.error?.message_th ?? `คำขอล้มเหลว (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

/** The one endpoint that actually exists on the backend right now — used on the
 * homepage to show a real "connected to backend" status instead of a fake one. */
export async function checkHealth(): Promise<{ status: string }> {
  return apiFetch("/health");
}
