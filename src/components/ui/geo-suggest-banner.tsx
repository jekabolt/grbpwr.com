"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { COUNTRIES_BY_REGION, LANGUAGE_CODE_TO_ID } from "@/constants";
import { useLocale, useTranslations } from "next-intl";

import { parseCountryLocalePath } from "@/lib/middleware-utils";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { getCountryName } from "@/lib/utils";

import { Banner } from "./banner";
import { Button } from "./button";
import { Text } from "./text";

function clearSuggestCookiesOnClient() {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  const names = [
    "NEXT_SUGGEST_COUNTRY",
    "NEXT_SUGGEST_LOCALE",
    "NEXT_SUGGEST_CURRENT_COUNTRY",
  ];
  for (const name of names) {
    document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax${secure}`;
  }
}

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
  const [isCookiesAccepted, setIsCookiesAccepted] = useState(() =>
    typeof window !== "undefined"
      ? !!(
          localStorage.getItem("cookieConsent") ||
          document.cookie.includes("cookieConsent=")
        )
      : false,
  );
  const pathname = usePathname();
  const locale = useLocale();
  const defaultT = useTranslations("geo-suggest");

  const { setCurrentCountry, setLanguageId } = useTranslationsStore(
    (state) => state,
  );

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
    const path =
      typeof window !== "undefined" ? window.location.pathname : pathname ?? "";
    const parsed = parseCountryLocalePath(path);
    const alreadyOnSuggested =
      parsed != null &&
      parsed.country?.toLowerCase() === suggestCountry.toLowerCase() &&
      parsed.locale === suggestLocale;
    setVisible(!alreadyOnSuggested);
  }, [pathname, suggestCountry, suggestLocale]);

  useEffect(() => {
    const onConsentAccepted = () => setIsCookiesAccepted(true);
    if (
      localStorage.getItem("cookieConsent") ||
      document.cookie.includes("cookieConsent=")
    ) {
      setIsCookiesAccepted(true);
    }
    window.addEventListener("cookie-consent-accepted", onConsentAccepted);
    return () => {
      window.removeEventListener("cookie-consent-accepted", onConsentAccepted);
    };
  }, []);

  const onDismiss = () => {
    setVisible(false);
    clearSuggestCookiesOnClient();
    const url = new URL(window.location.href);
    url.searchParams.set("geo", "dismiss");
    window.location.assign(url.toString());
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
        // Do not clear suggest cookies here — middleware `geo=accept` reads them from the request.
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
            className="w-full bg-textColor uppercase text-bgColor"
            variant="main"
            onClick={onAccept}
          >
            {suggestedCountryName}
          </Button>
          <Button
            size="lg"
            className="w-full border border-transparent uppercase hover:border-textColor"
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
