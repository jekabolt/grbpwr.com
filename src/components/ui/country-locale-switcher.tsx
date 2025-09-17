"use client";

import { usePathname, useRouter } from "next/navigation";
import { getAvailableCombinations, getLocalesForCountry } from "@/i18n/routing";
import { useLocale } from "next-intl";

import { createCountryLocaleUrl } from "@/lib/utils/url";

interface CountryLocaleSwitcherProps {
  className?: string;
}

export function CountryLocaleSwitcher({
  className,
}: CountryLocaleSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const availableCombinations = getAvailableCombinations();

  // Get current country from URL or default to 'fr'
  const pathSegments = pathname.split("/").filter(Boolean);
  const currentCountry =
    pathSegments[0] && ["fr", "de"].includes(pathSegments[0])
      ? pathSegments[0]
      : "fr";

  const handleCountryChange = (newCountry: string) => {
    const availableLocales = getLocalesForCountry(newCountry);
    const newLocale = availableLocales.includes(currentLocale)
      ? currentLocale
      : availableLocales[0];

    try {
      const newUrl = createCountryLocaleUrl(pathname, newCountry, newLocale);
      router.push(newUrl);
    } catch (error) {
      console.error("Invalid country/locale combination:", error);
    }
  };

  const handleLocaleChange = (newLocale: string) => {
    try {
      const newUrl = createCountryLocaleUrl(
        pathname,
        currentCountry,
        newLocale,
      );
      router.push(newUrl);
    } catch (error) {
      console.error("Invalid country/locale combination:", error);
    }
  };

  const availableLocalesForCurrentCountry =
    getLocalesForCountry(currentCountry);

  return (
    <div className={className}>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Country:</label>
          <select
            value={currentCountry}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="rounded border px-3 py-2"
          >
            <option value="fr">France (fr)</option>
            <option value="de">Germany (de)</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Locale:</label>
          <select
            value={currentLocale}
            onChange={(e) => handleLocaleChange(e.target.value)}
            className="rounded border px-3 py-2"
          >
            {availableLocalesForCurrentCountry.map((locale) => (
              <option key={locale} value={locale}>
                {locale === "en"
                  ? "English"
                  : locale === "fr"
                    ? "Français"
                    : "Deutsch"}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-600">
          <p>
            Current URL: /{currentCountry}/{currentLocale}/...
          </p>
          <p>Available combinations:</p>
          <ul className="ml-4 list-inside list-disc">
            {availableCombinations.map((combo, index) => (
              <li key={index}>
                /{combo.country}/{combo.locale}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
