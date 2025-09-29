"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { LANGUAGE_ID_TO_LOCALE } from "@/constants";
import { useTranslations } from "next-intl";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

import { Banner } from "./banner";
import { Button } from "./button";
import { Text } from "./text";

// type Props = {
//   selectedLocation: CountryOption;
//   onCancel: () => void;
// };

export function UpdateLocation() {
  const {
    currentCountry,
    nextCountry,
    languageId,
    applyNextCountry,
    cancelNextCountry,
  } = useTranslationsStore((state) => state);
  // const { handleCountrySelect } = useLocation();
  const t = useTranslations("update_location");
  const pathname = usePathname();
  const initialCountryName = useRef(currentCountry.name);

  const handleApplyCountry = () => {
    applyNextCountry();

    // Navigate to new country/locale URL
    const newLocale = LANGUAGE_ID_TO_LOCALE[languageId];
    if (newLocale && nextCountry.countryCode) {
      const pathWithoutLocaleCountry =
        pathname.replace(/^\/(?:[A-Za-z]{2}\/[a-z]{2}|[a-z]{2})(?=\/|$)/, "") ||
        "/";

      const newPath = `/${nextCountry.countryCode.toLowerCase()}/${newLocale}${pathWithoutLocaleCountry}`;
      window.location.href = newPath;
    }
  };

  return (
    <>
      {nextCountry.name && nextCountry.countryCode && (
        <Banner>
          <div className="flex flex-col gap-y-4 p-2.5">
            <Text className="uppercase">
              {t("message", { currentCountry: initialCountryName.current })}
            </Text>
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="main"
                size="lg"
                className="w-full uppercase"
                onClick={handleApplyCountry}
              >
                {t("continue", { country: nextCountry.name })}
              </Button>
              <Button
                variant="simpleReverse"
                size="lg"
                className="w-full uppercase"
                onClick={cancelNextCountry}
              >
                {t("cancel")}
              </Button>
            </div>
          </div>
        </Banner>
      )}
    </>
  );
}
