import {
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js/min";

import { findPhoneCountryByCode } from "./phone-country";
import { getPhoneCodeSelectItems } from "./phone-code-items";

/** libphonenumber regions that share E.164 country calling code +44. */
const UK_CC_REGIONS = new Set(["GB", "GG", "JE", "IM"]);

function parsedIsoMatchesSelected(
  selectedUpper: string,
  parsedRegion: string | undefined,
): boolean {
  if (!parsedRegion) return false;
  const parsed = parsedRegion.toUpperCase();
  if (selectedUpper === parsed) return true;
  return (
    UK_CC_REGIONS.has(selectedUpper) &&
    UK_CC_REGIONS.has(parsed)
  );
}

/**
 * Longest calling-code match; when several territories share the same code (e.g. +44),
 * uses libphonenumber so GB numbers are not attributed to GG/JE by sort order.
 */
export function resolvePhoneCodeItemForNumber<
  T extends { value: string; phoneCode?: string },
>(phone: string, items: readonly T[]): T | undefined {
  const digits = phone.replace(/\D/g, "");
  if (!digits || items.length === 0) return undefined;

  const candidates = items
    .filter((it) => it.phoneCode && digits.startsWith(it.phoneCode))
    .sort(
      (a, b) => (b.phoneCode?.length ?? 0) - (a.phoneCode?.length ?? 0),
    );
  if (candidates.length === 0) return undefined;

  const maxLen = candidates[0].phoneCode!.length;
  const sameLen = candidates.filter((c) => c.phoneCode!.length === maxLen);
  if (sameLen.length === 1) return sameLen[0];

  const parsed = parsePhoneNumberFromString(`+${digits}`);
  if (parsed?.country) {
    const iso = parsed.country.toLowerCase();
    const byLib = sameLen.find(
      (it) => it.value.split("-")[0].toLowerCase() === iso,
    );
    if (byLib) return byLib;
  }

  return sameLen[0];
}

/** ISO country slug from leading dial code (longest-prefix + shared-code disambiguation). */
export function findIsoCountryFromPhoneNumber(
  phone: string,
): string | undefined {
  const match = resolvePhoneCodeItemForNumber(
    phone,
    getPhoneCodeSelectItems(),
  );
  return match?.value.split("-")[0];
}

export function isValidPhoneForCountry(phone: string, countryCode: string) {
  const country = findPhoneCountryByCode(countryCode);
  if (!country) return false;

  const digits = phone.replace(/\D/g, "");
  if (!digits.startsWith(country.phoneCode)) return false;

  const isoCountry = country.countryCode.toUpperCase() as CountryCode;
  const parsed = (() => {
    try {
      return parsePhoneNumberFromString(`+${digits}`, isoCountry);
    } catch {
      return undefined;
    }
  })();

  return (
    parsed?.isValid() === true &&
    parsedIsoMatchesSelected(isoCountry, parsed.country)
  );
}
