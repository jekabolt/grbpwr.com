import { getUniqueCountries } from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/utils";

export type PhoneCodeSelectItem = {
  label: string;
  value: string;
  phoneCode: string;
};

let cachedItems: PhoneCodeSelectItem[] | undefined;

export function getPhoneCodeSelectItems(): PhoneCodeSelectItem[] {
  if (cachedItems) return cachedItems;
  cachedItems = getUniqueCountries()
    .map((country) => ({
      label: `${country.name} +${country.phoneCode}`,
      value: `${country.countryCode}-${country.phoneCode}`,
      phoneCode: country.phoneCode,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
  return cachedItems;
}
