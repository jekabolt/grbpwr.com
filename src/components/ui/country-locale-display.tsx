import { useEffect, useState } from "react";
import { getAvailableCombinations } from "@/i18n/routing";
import { useLocale } from "next-intl";

import { getCountry } from "@/lib/hooks/useCountry";

interface CountryLocaleDisplayProps {
  className?: string;
}

export async function CountryLocaleDisplay({
  className,
}: CountryLocaleDisplayProps) {
  const locale = useLocale();
  const country = await getCountry();
  const availableCombinations = getAvailableCombinations();

  return (
    <div className={className}>
      <p>Country: {country}</p>
      <p>Locale: {locale}</p>
      <p>
        URL Pattern: /{country}/{locale}/...
      </p>
      <div className="mt-4">
        <p className="font-semibold">Available combinations:</p>
        <ul className="list-inside list-disc">
          {availableCombinations.map((combo, index) => (
            <li key={index}>
              /{combo.country}/{combo.locale}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Client component version
("use client");

export function CountryLocaleDisplayClient({
  className,
}: CountryLocaleDisplayProps) {
  const locale = useLocale();
  const [country, setCountry] = useState<string>("");
  const availableCombinations = getAvailableCombinations();

  useEffect(() => {
    // Get country from data attribute set in layout
    const htmlElement = document.documentElement;
    const countryFromData = htmlElement.getAttribute("data-country");
    setCountry(countryFromData || locale);
  }, [locale]);

  return (
    <div className={className}>
      <p>Country: {country}</p>
      <p>Locale: {locale}</p>
      <p>
        URL Pattern: /{country}/{locale}/...
      </p>
      <div className="mt-4">
        <p className="font-semibold">Available combinations:</p>
        <ul className="list-inside list-disc">
          {availableCombinations.map((combo, index) => (
            <li key={index}>
              /{combo.country}/{combo.locale}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
