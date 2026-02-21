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

    if (withPlaceholder !== template) {
      return withPlaceholder;
    }

    // No placeholder: append tracking code (base URL typically ends with = or ?)
    return `${template}${template.endsWith("=") || template.endsWith("?") ? "" : "/"}${encodeURIComponent(code)}`;
  }

  // Fallback: universal tracking service when carrier has no trackingUrl configured
  return `https://parcelsapp.com/en/tracking/${encodeURIComponent(code)}`;
}
