"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { COUNTRIES_BY_REGION, LANGUAGE_CODE_TO_ID } from "@/constants";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";

import { Button } from "./button";

interface Props {
  suggestCountry?: string;
  suggestLocale?: string;
  suggestPath?: string;
  currentCountry?: string;
  currentLocale?: string;
}

export function GeoSuggestBanner({
  suggestCountry,
  suggestLocale,
  suggestPath,
  currentCountry,
  currentLocale,
}: Props) {
  const { setLanguageId, setCountry } = useTranslationsStore((state) => state);
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const targetHref = useMemo(() => {
    if (!suggestCountry || !suggestLocale) return null;
    const rest = suggestPath || "";
    return `/${suggestCountry}/${suggestLocale}${rest}`;
  }, [suggestCountry, suggestLocale, suggestPath]);

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

  if (!visible || !targetHref) return null;

  return (
    <div
      className={cn(
        "blackTheme fixed inset-x-2 top-2 z-40 flex items-center justify-between gap-3 bg-bgColor p-2.5 text-textColor lg:bottom-2 lg:left-auto lg:top-auto lg:w-[520px]",
      )}
    >
      <div className="text-sm">
        We detected your region. Switch to {suggestCountry?.toUpperCase()} /{" "}
        {suggestLocale?.toUpperCase()}?
      </div>
      <div className="flex items-center gap-2">
        <Button variant="simpleReverse" size="sm" onClick={onDismiss}>
          Stay {currentCountry?.toUpperCase()} / {currentLocale?.toUpperCase()}
        </Button>
        <Button variant="secondary" size="sm" onClick={onAccept}>
          Switch
        </Button>
      </div>
    </div>
  );
}
