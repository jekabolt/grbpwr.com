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

function scrubValues<T extends Record<string, unknown>>(
  values: T,
  urlKeys: readonly string[] = [],
): T {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    if (typeof value !== "string") {
      out[key] = value;
    } else {
      out[key] = urlKeys.includes(key) ? scrubUrl(value) : scrubText(value);
    }
  }
  return out as T;
}

function scrubBreadcrumb(crumb: Breadcrumb): Breadcrumb {
  return {
    ...crumb,
    message: crumb.message ? scrubText(crumb.message) : crumb.message,
    data: crumb.data
      ? scrubValues(crumb.data, ["url", "from", "to"])
      : crumb.data,
  };
}

/**
 * beforeSend for every runtime: drops query strings and fragments, emails, cookies, the
 * user and request bodies, and keeps only harmless request headers.
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
        ? scrubValues(
            Object.fromEntries(
              Object.entries(headers).filter(([key]) =>
                KEPT_HEADERS.has(key.toLowerCase()),
              ),
            ),
            ["referer", "Referer"],
          )
        : headers,
    };
  }
  if (event.breadcrumbs) {
    event.breadcrumbs = event.breadcrumbs.map(scrubBreadcrumb);
  }
  if (event.tags) event.tags = scrubValues(event.tags, ["url"]);
  delete event.user;
  return event;
}
