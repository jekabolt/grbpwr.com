import { COUNTRIES_BY_REGION } from "@/constants";

export function getUniquePhoneCountries() {
  const countries = Object.values(COUNTRIES_BY_REGION).flat();
  const countryMap = new Map<string, (typeof countries)[number]>();

  for (const country of countries) {
    const key = country.countryCode;
    const existing = countryMap.get(key);

    if (!existing || (existing.lng !== "en" && country.lng === "en")) {
      countryMap.set(key, country);
    }
  }

  return Array.from(countryMap.values());
}

export function findPhoneCountryByCode(countryCode: string) {
  return getUniquePhoneCountries().find(
    (country) =>
      country.countryCode.toLowerCase() === countryCode.toLowerCase(),
  );
}
