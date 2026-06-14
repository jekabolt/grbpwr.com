/** Only http(s) URLs may be rendered into an anchor href. */
function isSafeHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Builds tracking URL from carrier's trackingUrl template and tracking code.
 * Supports placeholders: {tracking_code}, {tracking_number} (case insensitive), %s (printf-style).
 * If no placeholder, appends tracking code to the base URL.
 * Returns undefined if both template and code are not provided.
 */
export function buildTrackingUrl(
  trackingUrlTemplate: string | undefined,
  trackingCode: string | undefined,
): string | undefined {
  if (!trackingCode?.trim()) {
    return undefined;
  }

  const code = trackingCode.trim();

  if (trackingUrlTemplate?.trim()) {
    const template = trackingUrlTemplate.trim();

    // Replace common placeholders (case insensitive) and %s (printf-style, e.g. DHL)
    const withPlaceholder = template
      .replace(/\{tracking_code\}/gi, code)
      .replace(/\{tracking_number\}/gi, code)
      .replace(/%s/g, encodeURIComponent(code));

    const candidate =
      withPlaceholder !== template
        ? withPlaceholder
        : // No placeholder: append tracking code (base URL typically ends with = or ?)
          `${template}${template.endsWith("=") || template.endsWith("?") ? "" : "/"}${encodeURIComponent(code)}`;

    // Carrier templates are admin/backend config — never trust them to be safe.
    // A `javascript:`/`data:` template must not reach an href; fall back instead.
    if (isSafeHttpUrl(candidate)) {
      return candidate;
    }
  }

  // Fallback: universal tracking service when carrier has no (usable) trackingUrl
  return `https://parcelsapp.com/en/tracking/${encodeURIComponent(code)}`;
}
