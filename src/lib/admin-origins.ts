const DEFAULT_ADMIN_ORIGINS = [
  "https://admin.grbpwr.com",
  "https://admin.beta.grbpwr.com",
] as const;

const LOCAL_ADMIN_ORIGIN = "http://localhost:4040";

function isHttpsOrigin(value: string): boolean {
  if (value.includes("*")) return false;

  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.username === "" &&
      url.password === "" &&
      url.origin === value
    );
  } catch {
    return false;
  }
}

/**
 * Resolve the exact origins allowed to host the storefront preview iframe.
 * A configured value replaces the deployed defaults; invalid entries are
 * ignored instead of widening the allow-list.
 */
export function parseAdminOrigins(
  value: string | undefined,
  includeLocalhost = false,
): string[] {
  const configured = value?.trim();
  const candidates = configured
    ? configured.split(",").map((origin) => origin.trim())
    : [...DEFAULT_ADMIN_ORIGINS];
  const origins = candidates.filter(isHttpsOrigin);

  if (includeLocalhost) origins.push(LOCAL_ADMIN_ORIGIN);
  return [...new Set(origins)];
}
