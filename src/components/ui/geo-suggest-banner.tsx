"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { COUNTRIES_BY_REGION, LANGUAGE_CODE_TO_ID } from "@/constants";
import { useLocale, useTranslations } from "next-intl";

import { useCart } from "@/lib/stores/cart/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { getCountryName } from "@/lib/utils";

import { Banner } from "./banner";
import { Button } from "./button";
import { Text } from "./text";

interface Props {
  suggestCountry?: string;
  suggestLocale?: string;
  currentCountry?: string;
  messages?: any;
}

export function GeoSuggestBanner({
  suggestCountry,
  suggestLocale,
  currentCountry,
  messages,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [isCookiesAccepted, setIsCookiesAccepted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const defaultT = useTranslations("geo-suggest");

  const { setCurrentCountry, setLanguageId } = useTranslationsStore(
    (state) => state,
  );
  const { clearCart } = useCart((state) => state);

  const t =
    messages && messages["geo-suggest"]
      ? (key: string, values?: any) => {
          const template = messages["geo-suggest"][key];
          if (!template) return key;
          return template.replace(
            /\{(\w+)\}/g,
            (_: any, name: string) => values?.[name] || "",
          );
        }
      : defaultT;

  const suggestedCountryName = getCountryName(suggestCountry, suggestLocale);

  const currentCountryName = getCountryName(currentCountry, locale);

  useEffect(() => {
    if (!suggestCountry || !suggestLocale) return;
    const alreadyOnSuggested = pathname?.startsWith(
      `/${suggestCountry}/${suggestLocale}`,
    );
    setVisible(!alreadyOnSuggested);
  }, [pathname, suggestCountry, suggestLocale]);

  useEffect(() => {
    const onConsentAccepted = () => setIsCookiesAccepted(true);
    window.addEventListener("cookie-consent-accepted", onConsentAccepted);
    return () => {
      window.removeEventListener("cookie-consent-accepted", onConsentAccepted);
    };
  }, []);

  const onDismiss = () => {
    setVisible(false);

    const url = new URL(window.location.href);
    url.searchParams.set("geo", "dismiss");
    router.push(url.toString());
  };

  const onAccept = () => {
    if (suggestCountry && suggestLocale) {
      let countryData: any = null;
      outer: for (const [, list] of Object.entries(COUNTRIES_BY_REGION)) {
        for (const c of list) {
          if (
            c.countryCode.toLowerCase() === suggestCountry.toLowerCase() &&
            c.lng === suggestLocale
          ) {
            countryData = c;
            break outer;
          }
        }
      }

      if (countryData) {
        clearCart();

        setCurrentCountry({
          name: countryData.name,
          countryCode: countryData.countryCode,
          currencyKey: countryData.currencyKey,
        });

        const newLanguageId = LANGUAGE_CODE_TO_ID[countryData.lng];
        if (newLanguageId !== undefined) {
          setLanguageId(newLanguageId);
        }

        const pathWithoutLocaleCountry =
          pathname.replace(
            /^\/(?:[A-Za-z]{2}\/[a-z]{2}|[a-z]{2})(?=\/|$)/,
            "",
          ) || "/";

        const newPath = `/${suggestCountry.toLowerCase()}/${suggestLocale}${pathWithoutLocaleCountry}`;
        const url = new URL(window.location.href);
        url.pathname = newPath;
        url.searchParams.set("geo", "accept");
        window.location.href = url.toString();
      }
    }
  };

  if (!visible || !isCookiesAccepted) return null;

  return (
    <Banner>
      <div className="flex flex-col gap-y-4 p-2.5">
        <Text className="uppercase">
          {t("message", { country: suggestedCountryName || "" })}
        </Text>
        <div className="flex items-center justify-between gap-2">
          <Button
            size="lg"
            className="w-full uppercase"
            variant="main"
            onClick={onAccept}
          >
            {suggestedCountryName}
          </Button>
          <Button
            size="lg"
            className="w-full uppercase"
            variant="simpleReverse"
            onClick={onDismiss}
          >
            {currentCountryName}
          </Button>
        </div>
      </div>
    </Banner>
  );
}
