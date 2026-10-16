import liff from "@line/liff";

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID?.trim();

let initPromise: Promise<void> | null = null;

export function isLiffConfigured(): boolean {
  return Boolean(LIFF_ID);
}

/** Initializes LIFF once per page load. No-ops outside a LIFF-configured deploy (e.g. local dev). */
export function initLiff(): Promise<void> {
  if (!LIFF_ID) {
    return Promise.resolve();
  }
  if (!initPromise) {
    initPromise = liff.init({ liffId: LIFF_ID });
  }
  return initPromise;
}

export async function ensureLoggedIn(): Promise<void> {
  await initLiff();
  if (!LIFF_ID) return;
  // Return to the page the user is on. The endpoint URL is the site root, so any
  // in-app path is under it, which is what LINE requires for redirectUri.
  if (!liff.isLoggedIn()) {
    liff.login({ redirectUri: window.location.href });
  }
}

export async function getIdToken(): Promise<string | null> {
  await ensureLoggedIn();
  if (!LIFF_ID) return null;
  return liff.getIDToken();
}

/** Logs the user out of LINE (LIFF). The caller clears our own session separately. */
export function liffLogout(): void {
  if (!LIFF_ID) return;
  try {
    if (liff.isLoggedIn()) liff.logout();
  } catch {
    /* ignore */
  }
}

export type LineProfile = { displayName: string; pictureUrl?: string };

/** The signed-in LINE user's profile, or null outside LIFF / when not logged in. */
export async function getLineProfile(): Promise<LineProfile | null> {
  await initLiff();
  if (!LIFF_ID || !liff.isLoggedIn()) return null;
  try {
    const p = await liff.getProfile();
    return { displayName: p.displayName, pictureUrl: p.pictureUrl };
  } catch {
    return null;
  }
}
