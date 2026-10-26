const NON_PRODUCTION_SITE_ENVIRONMENTS = new Set([
  "beta",
  "development",
  "dev",
  "local",
  "preview",
  "staging",
  "test",
]);

/**
 * Production predates NEXT_PUBLIC_SITE_ENV, so an unset or unknown value must
 * remain indexable. Known non-production contours, including beta-NN, opt in to
 * the noindex policy explicitly.
 */
export function isProductionSiteEnvironment(
  value: string | undefined,
): boolean {
  const environment = value?.trim().toLowerCase();
  if (!environment) return true;
  if (/^beta-\d+$/.test(environment)) return false;
  return !NON_PRODUCTION_SITE_ENVIRONMENTS.has(environment);
}
