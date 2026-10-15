import { getIdToken, isLiffConfigured } from "./liff";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const JWT_STORAGE_KEY = "u-ledger-jwt";

export function getStoredJwt(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(JWT_STORAGE_KEY);
}

export function setStoredJwt(token: string): void {
  window.localStorage.setItem(JWT_STORAGE_KEY, token);
}

function clearStoredJwt(): void {
  window.localStorage.removeItem(JWT_STORAGE_KEY);
}

let sessionPromise: Promise<void> | null = null;

/** Inside LIFF: exchanges the LINE ID token for our JWT once. Without LIFF
 * (local dev / demo) the backend serves the seeded demo shop, so no-op. */
function ensureSession(): Promise<void> {
  if (!isLiffConfigured() || getStoredJwt()) return Promise.resolve();
  sessionPromise ??= (async () => {
    const idToken = await getIdToken();
    if (!idToken) return;
    const { access_token } = await request<{ access_token: string }>("/api/v1/auth/line", {
      method: "POST",
      body: JSON.stringify({ id_token: idToken }),
    });
    setStoredJwt(access_token);
  })().finally(() => {
    sessionPromise = null;
  });
  return sessionPromise;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
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
    if (response.status === 401) clearStoredJwt();
    const body = await response.json().catch(() => null);
    const message = body?.error?.message_th ?? `คำขอล้มเหลว (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

/** Thin fetch wrapper: base URL + JSON + bearer token. Backend error shape is
 * always `{ error: { code, message_th } }` (backend/app/core/errors.py). */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  await ensureSession();
  return request<T>(path, init);
}

export async function checkHealth(): Promise<{ status: string }> {
  return request("/health");
}
