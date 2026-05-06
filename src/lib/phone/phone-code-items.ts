import { getUniquePhoneCountries } from "./phone-country";

export type PhoneCodeSelectItem = {
  label: string;
  value: string;
  phoneCode: string;
};

let cachedItems: PhoneCodeSelectItem[] | undefined;

export function getPhoneCodeSelectItems(): PhoneCodeSelectItem[] {
  if (cachedItems) return cachedItems;
  cachedItems = getUniquePhoneCountries()
    .map((country) => ({
      label: `${country.name} +${country.phoneCode}`,
      value: `${country.countryCode}-${country.phoneCode}`,
      phoneCode: country.phoneCode,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
  return cachedItems;
}
