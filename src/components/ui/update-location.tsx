"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { LANGUAGE_ID_TO_LOCALE } from "@/constants";
import { useTranslations } from "next-intl";

import { parseCountryLocalePath } from "@/lib/middleware-utils";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { setDefaultAddressRequest } from "@/app/[locale]/account/utils/address-actions";

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
  const t = useTranslations("update_location");
  const pathname = usePathname();
  const initialCountryName = useRef(currentCountry.name);
  const targetLocale =
    nextCountry.localeCode || LANGUAGE_ID_TO_LOCALE[languageId] || "";
  const parsedPath = parseCountryLocalePath(pathname || "");
  const isAlreadyOnTargetPath =
    !!parsedPath &&
    parsedPath.country?.toLowerCase() ===
      nextCountry.countryCode.toLowerCase() &&
    parsedPath.locale === targetLocale;

  useEffect(() => {
    if (!nextCountry.countryCode) return;

    const isAlreadyAppliedCountry =
      nextCountry.countryCode.toLowerCase() ===
      currentCountry.countryCode.toLowerCase();

    if (isAlreadyAppliedCountry || isAlreadyOnTargetPath) {
      cancelNextCountry();
    }
  }, [
    cancelNextCountry,
    currentCountry.countryCode,
    isAlreadyOnTargetPath,
    nextCountry.countryCode,
  ]);

  const handleApplyCountry = async () => {
    const targetCountryCode = nextCountry.countryCode;
    const newLocale =
      nextCountry.localeCode || LANGUAGE_ID_TO_LOCALE[languageId];

    if (!targetCountryCode || !newLocale) return;

    const selectedSavedAddressId = Number(nextCountry.savedAddressId);
    if (Number.isFinite(selectedSavedAddressId) && selectedSavedAddressId > 0) {
      await setDefaultAddressRequest(selectedSavedAddressId).catch(() => {});
    }

    applyNextCountry();

    const pathWithoutLocaleCountry =
      pathname.replace(/^\/(?:[A-Za-z]{2}\/[a-z]{2}|[a-z]{2})(?=\/|$)/, "") ||
      "/";

    const newPath = `/${targetCountryCode.toLowerCase()}/${newLocale}${pathWithoutLocaleCountry}`;
    const url = new URL(newPath, window.location.origin);
    url.searchParams.set("from_picker", "1");
    window.location.href = url.toString();
  };

  return (
    <>
      {nextCountry.name &&
        nextCountry.countryCode &&
        !isAlreadyOnTargetPath && (
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
                  onClick={() => {
                    void handleApplyCountry();
                  }}
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
