"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { LANGUAGE_ID_TO_LOCALE } from "@/constants";
import { useTranslations } from "next-intl";

import { useCart } from "@/lib/stores/cart/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

import { Banner } from "./banner";
import { Button } from "./button";
import { Text } from "./text";

export function UpdateLocation() {
  const {
    currentCountry,
    nextCountry,
    languageId,
    applyNextCountry,
    cancelNextCountry,
  } = useTranslationsStore((state) => state);
  const { clearCart } = useCart((state) => state);
  // const { handleCountrySelect } = useLocation();
  const t = useTranslations("update_location");
  const pathname = usePathname();
  const initialCountryName = useRef(currentCountry.name);

  const handleApplyCountry = () => {
    const targetCountryCode = nextCountry.countryCode;
    const newLocale = LANGUAGE_ID_TO_LOCALE[languageId];

    if (!targetCountryCode || !newLocale) return;

    clearCart();

    applyNextCountry();

    const pathWithoutLocaleCountry =
      pathname.replace(/^\/(?:[A-Za-z]{2}\/[a-z]{2}|[a-z]{2})(?=\/|$)/, "") ||
      "/";

    const newPath = `/${targetCountryCode.toLowerCase()}/${newLocale}${pathWithoutLocaleCountry}`;
    window.location.href = newPath;
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
