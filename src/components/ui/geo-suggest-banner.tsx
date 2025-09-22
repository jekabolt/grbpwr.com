"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { COUNTRIES_BY_REGION } from "@/constants";
import { useTranslations } from "next-intl";

import { getCountryName } from "@/lib/utils";
import { useLocation } from "@/app/[locale]/_components/useLocation";

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
  const { handleCountrySelect } = useLocation();
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const defaultT = useTranslations("geo-suggest");

  const t = messages?.geo_suggest
    ? (key: string, values?: any) => {
        const template = messages.geo_suggest[key];
        if (!template) return key;
        return template.replace(
          /\{(\w+)\}/g,
          (_: any, name: string) => values?.[name] || "",
        );
      }
    : defaultT;

  const suggestedCountryName = getCountryName(suggestCountry, suggestLocale);

  const currentCountryName = getCountryName(currentCountry);

  useEffect(() => {
    if (!suggestCountry || !suggestLocale) return;
    const alreadyOnSuggested = pathname?.startsWith(
      `/${suggestCountry}/${suggestLocale}`,
    );
    setVisible(!alreadyOnSuggested);
  }, [pathname, suggestCountry, suggestLocale]);

  const onDismiss = () => {
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
        handleCountrySelect(countryData);
      } else {
        const url = new URL(window.location.href);
        url.searchParams.set("geo", "accept");
        router.push(url.toString());
      }
    }
  };

  if (!visible) return null;

  return (
    <Banner>
      <div className="flex flex-col gap-y-6 p-2.5">
        <Text className="uppercase">
          {t("message", { country: suggestedCountryName || "" })}
        </Text>
        <div className="flex items-center gap-2">
          <Button
            size="lg"
            className="w-full uppercase"
            variant="main"
            onClick={onDismiss}
          >
            {t("stay", { country: currentCountryName || "" })}
          </Button>
          <Button
            size="lg"
            className="w-full uppercase"
            variant="simpleReverse"
            onClick={onAccept}
          >
            {t("switch")}
          </Button>
        </div>
      </div>
    </Banner>
  );
}
