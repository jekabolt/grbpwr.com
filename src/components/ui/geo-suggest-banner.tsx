"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { COUNTRIES_BY_REGION, LANGUAGE_CODE_TO_ID } from "@/constants";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

import { Banner } from "./banner";
import { Button } from "./button";
import { Text } from "./text";

interface Props {
  suggestCountry?: string;
  suggestLocale?: string;

  currentCountry?: string;
}

export function GeoSuggestBanner({
  suggestCountry,
  suggestLocale,

  currentCountry,
}: Props) {
  const { setLanguageId, setCountry } = useTranslationsStore((state) => state);
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const suggestedCountryName = useMemo(() => {
    if (!suggestCountry) return undefined;
    const codeLc = suggestCountry.toLowerCase();
    const preferredLng = suggestLocale?.toLowerCase();
    let fallback: string | undefined;
    for (const [, list] of Object.entries(COUNTRIES_BY_REGION)) {
      for (const c of list) {
        if (c.countryCode.toLowerCase() !== codeLc) continue;
        // Prefer exact locale match (e.g., de → "deutschland")
        if (preferredLng && c.lng.toLowerCase() === preferredLng) return c.name;
        // Capture first match as fallback (likely en)
        if (!fallback) fallback = c.name;
      }
    }
    return fallback || suggestCountry.toUpperCase();
  }, [suggestCountry, suggestLocale]);

  const currentCountryName = useMemo(() => {
    if (!currentCountry) return undefined;
    const codeLc = currentCountry.toLowerCase();
    // Try to infer current display locale from the store's languageId (reverse map)
    let currentLng: string | undefined;
    // Reverse LANGUAGE_CODE_TO_ID
    for (const [lng, id] of Object.entries(LANGUAGE_CODE_TO_ID)) {
      if (id === undefined) continue;
      if (id === undefined) continue;
    }
    // We do have setLanguageId in scope but not the current value; rely on best available name
    for (const [, list] of Object.entries(COUNTRIES_BY_REGION)) {
      const found = list.find((c) => c.countryCode.toLowerCase() === codeLc);
      if (found) return found.name;
    }
    return currentCountry.toUpperCase();
  }, [currentCountry]);

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
    // Update translations store immediately for zero-lag UI, then let middleware persist cookies and redirect
    if (suggestCountry && suggestLocale) {
      const langId = LANGUAGE_CODE_TO_ID[suggestLocale];
      if (langId !== undefined) setLanguageId(langId);

      // Find country display name from constants
      let displayName = suggestCountry.toUpperCase();
      outer: for (const [, list] of Object.entries(COUNTRIES_BY_REGION)) {
        for (const c of list) {
          if (c.countryCode.toLowerCase() === suggestCountry.toLowerCase()) {
            displayName = c.name;
            break outer;
          }
        }
      }
      setCountry({
        name: displayName,
        countryCode: suggestCountry.toUpperCase(),
      });
    }
    // Trigger middleware to accept and redirect to suggested route
    const url = new URL(window.location.href);
    url.searchParams.set("geo", "accept");
    router.push(url.toString());
  };

  if (!visible) return null;

  return (
    <Banner>
      <div className="flex flex-col gap-y-6 p-2.5">
        <Text className="uppercase">
          {`We think you are in ${suggestedCountryName}. Update your location?`}
        </Text>
        <div className="flex items-center gap-2">
          <Button
            size="lg"
            className="w-full uppercase"
            variant="main"
            onClick={onDismiss}
          >
            {`Stay ${currentCountryName}`}
          </Button>
          <Button
            size="lg"
            className="w-full uppercase"
            variant="simpleReverse"
            onClick={onAccept}
          >
            Switch
          </Button>
        </div>
      </div>
    </Banner>
  );
}
