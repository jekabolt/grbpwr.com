import type { Breadcrumb, ErrorEvent } from "@sentry/nextjs";

// Anything that looks like an email, also URL-encoded (order and unsubscribe URLs carry one).
const EMAIL = /[A-Z0-9._%+-]+(?:@|%40)[A-Z0-9-]+(?:\.[A-Z0-9-]+)*\.[A-Z]{2,}/gi;
// A URL or path followed by a query string or fragment, inside free text.
const URL_TAIL = /((?:https?:\/\/|\/)[^\s?#"'<>]*)[?#][^\s"'<>]*/g;
const KEPT_HEADERS = new Set([
  "accept",
  "accept-language",
  "content-type",
  "referer",
  "user-agent",
]);

export function scrubText(text: string): string {
  return text.replace(URL_TAIL, "$1").replace(EMAIL, "[email]");
}

export function scrubUrl(url: string): string {
  return scrubText(url.replace(/[?#][\s\S]*$/, ""));
}

// Keys whose string values are URLs or paths: everything from "?" or "#" on is dropped.
const URL_KEYS = new Set([
  "url",
  "from",
  "to",
  "referer",
  "request_path",
  "path",
]);
const MAX_DEPTH = 6;

/** Scrubs every string inside value (objects and arrays included, MAX_DEPTH levels deep). */
function scrubDeep<T>(value: T, key = "", depth = 0): T {
  if (typeof value === "string") {
    return (
      URL_KEYS.has(key.toLowerCase()) ? scrubUrl(value) : scrubText(value)
    ) as T;
  }
  if (value === null || typeof value !== "object" || depth >= MAX_DEPTH)
    return value;
  if (Array.isArray(value)) {
    return value.map((item) => scrubDeep(item, key, depth + 1)) as T;
  }
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value))
    out[k] = scrubDeep(v, k, depth + 1);
  return out as T;
}

function scrubBreadcrumb(crumb: Breadcrumb): Breadcrumb {
  return {
    ...crumb,
    message: crumb.message ? scrubText(crumb.message) : crumb.message,
    data: crumb.data ? scrubDeep(crumb.data) : crumb.data,
  };
}

/**
 * beforeSend for every runtime: drops query strings and fragments, emails, cookies, the
 * user and request bodies, and keeps only harmless request headers. Contexts and extra are
 * scrubbed too: Next.js puts the full request path (with its query) in contexts.nextjs.
 */
export function scrubEvent(event: ErrorEvent): ErrorEvent {
  if (event.message) event.message = scrubText(event.message);
  if (event.transaction) event.transaction = scrubUrl(event.transaction);
  for (const value of event.exception?.values ?? []) {
    if (value.value) value.value = scrubText(value.value);
  }
  if (event.request) {
    const { url, headers } = event.request;
    event.request = {
      method: event.request.method,
      url: url ? scrubUrl(url) : url,
      headers: headers
        ? scrubDeep(
            Object.fromEntries(
              Object.entries(headers).filter(([key]) =>
                KEPT_HEADERS.has(key.toLowerCase()),
              ),
            ),
          )
        : headers,
    };
  }
  if (event.breadcrumbs) {
    event.breadcrumbs = event.breadcrumbs.map(scrubBreadcrumb);
  }
  if (event.tags) event.tags = scrubDeep(event.tags);
  if (event.contexts) event.contexts = scrubDeep(event.contexts);
  if (event.extra) event.extra = scrubDeep(event.extra);
  delete event.user;
  return event;
}
