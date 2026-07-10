const KEY = "changeloom.token";

export interface SavedToken {
  token: string;
  login: string;
}

/** Read a previously-saved token from the browser (SSR-safe). */
export function loadToken(): SavedToken | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedToken;
    return parsed?.token ? parsed : null;
  } catch {
    return null;
  }
}

export function saveToken(token: string, login: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ token, login }));
  } catch {
    /* storage may be unavailable (private mode) */
  }
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
