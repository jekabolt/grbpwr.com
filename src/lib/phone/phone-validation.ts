import {
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js/min";

import { findPhoneCountryByCode } from "./phone-country";

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

  return parsed?.isValid() === true && parsed.country === isoCountry;
}
