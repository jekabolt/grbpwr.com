export const CHECKOUT_GUEST_SESSION_KEY = "checkout-as-guest";

/** Readable on the server via `cookies()` so reload can match guest skeleton before client hydrates. */
export const CHECKOUT_GUEST_COOKIE = "checkout_guest";

const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 7;

function cookieSecureDirective() {
  return process.env.NODE_ENV === "production" ? ";Secure" : "";
}

export function readGuestCheckoutFromSession(): boolean {
  try {
    return sessionStorage.getItem(CHECKOUT_GUEST_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function readGuestCheckoutFromDocumentCookie(): boolean {
  if (typeof document === "undefined") return false;
  const token = `${CHECKOUT_GUEST_COOKIE}=`;
  const { cookie } = document;
  if (!cookie) return false;
  const chunk = cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(token));
  if (!chunk) return false;
  return chunk.slice(token.length) === "1";
}

/** `sessionStorage` + `document.cookie` — used on the client where SSR `cookies()` can miss the flag for one request. */
export function clientHasGuestCheckoutIntent(): boolean {
  return (
    readGuestCheckoutFromSession() || readGuestCheckoutFromDocumentCookie()
  );
}

export function hasPersistedGuestCheckoutCookie(cookieValue?: string): boolean {
  return cookieValue === "1";
}

export function persistGuestCheckoutIntent(): void {
  try {
    sessionStorage.setItem(CHECKOUT_GUEST_SESSION_KEY, "1");
  } catch {
    /* private mode */
  }

  if (typeof document === "undefined") return;
  document.cookie = `${CHECKOUT_GUEST_COOKIE}=1;path=/;max-age=${COOKIE_MAX_AGE_SEC};SameSite=Lax${cookieSecureDirective()}`;
}

export function clearGuestCheckoutIntent(): void {
  try {
    sessionStorage.removeItem(CHECKOUT_GUEST_SESSION_KEY);
  } catch {
    /* noop */
  }

  if (typeof document === "undefined") return;
  document.cookie = `${CHECKOUT_GUEST_COOKIE}=;path=/;max-age=0;SameSite=Lax${cookieSecureDirective()}`;
}
