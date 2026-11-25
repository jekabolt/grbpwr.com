// Strict-Transport-Security per host. `includeSubDomains` only on hosts whose
// every subdomain the platform runs (grbpwr.com, lekalo.studio): on a
// customer's own domain it would force HTTPS onto subdomains we do not serve.
// Pure module: next.config.ts and the node test runner both read it.

const MAX_AGE = "max-age=63072000";

export const HSTS_WITH_SUBDOMAINS = `${MAX_AGE}; includeSubDomains`;
export const HSTS_HOST_ONLY = MAX_AGE;

/**
 * Hosts that keep `includeSubDomains`, as a next.config `has: [{ type: "host" }]`
 * value (Next anchors it as ^…$ and matches the lower-cased host, no port).
 */
export const HSTS_SUBDOMAIN_HOSTS =
  "(?:[a-z0-9-]+\\.)*(?:grbpwr\\.com|lekalo\\.studio)";

/** The HSTS value a response for `host` carries (mirrors the next.config rules). */
export function hstsFor(host: string): string {
  return new RegExp(`^${HSTS_SUBDOMAIN_HOSTS}$`).test(host.toLowerCase())
    ? HSTS_WITH_SUBDOMAINS
    : HSTS_HOST_ONLY;
}
