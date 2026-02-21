/**
 * ISO 4217 currencies with 0 minor units (no decimal places).
 * JPY, KRW don't use decimals in display.
 */
const ZERO_DECIMAL_CURRENCIES = new Set(["JPY", "KRW"]);

/**
 * Formats a numeric amount for display based on currency.
 * Zero-decimal currencies (JPY, KRW) show no trailing .00.
 */
export function formatCurrencyAmount(
  value: number | string,
  currencyKey: string,
): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  const key = currencyKey?.toUpperCase() || "EUR";

  if (ZERO_DECIMAL_CURRENCIES.has(key)) {
    return Math.round(num).toString();
  }
  return num.toFixed(2);
}
