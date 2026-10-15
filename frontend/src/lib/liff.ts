import liff from "@line/liff";

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID;

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
  if (!liff.isLoggedIn()) {
    liff.login();
  }
}

export async function getIdToken(): Promise<string | null> {
  await ensureLoggedIn();
  if (!LIFF_ID) return null;
  return liff.getIDToken();
}
