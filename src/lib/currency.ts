/**
 * ISO 4217 currencies with 0 minor units (no decimal places).
 * JPY, KRW don't use decimals in display.
 */
const ZERO_DECIMAL_CURRENCIES = new Set(["JPY", "KRW"]);

/** Currencies where symbol comes before the amount (e.g. $100). */
const SYMBOL_BEFORE_CURRENCIES = new Set(["USD"]);

export function toStripeMinorUnitAmount(
  value: number | string,
  currencyKey: string,
): number {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (!Number.isFinite(num) || num <= 0) return 0;

  const key = currencyKey?.toUpperCase() || "EUR";
  const multiplier = ZERO_DECIMAL_CURRENCIES.has(key) ? 1 : 100;
  return Math.round(num * multiplier);
}

/**
 * Formats a numeric amount for display based on currency.
 * Zero-decimal currencies (JPY, KRW) always show whole numbers.
 * Others omit ".00" for whole amounts; show decimals only when non-zero cents exist.
 */
export function formatCurrencyAmount(
  value: number | string,
  currencyKey: string,
): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  const key = currencyKey?.toUpperCase() || "EUR";

  if (!Number.isFinite(num)) return "0";

  if (ZERO_DECIMAL_CURRENCIES.has(key)) {
    return Math.round(num).toString();
  }

  const cents = Math.round(num * 100);
  if (cents % 100 === 0) {
    return String(cents / 100);
  }
  return (cents / 100).toFixed(2);
}

/**
 * Formats a price with currency symbol. USD/GBP: symbol before (e.g. $100);
 * others: symbol after (e.g. 100€).
 */
export function formatPrice(
  value: number | string,
  currencyKey: string,
  symbol: string,
): string {
  const formatted = formatCurrencyAmount(value, currencyKey);
  const key = currencyKey?.toUpperCase() || "EUR";
  if (SYMBOL_BEFORE_CURRENCIES.has(key)) {
    return `${symbol}${formatted}`;
  }
  return `${formatted} ${symbol}`;
}
