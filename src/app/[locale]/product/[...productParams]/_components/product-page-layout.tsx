"use client";

import { useRouter } from "next/navigation";
import { LANGUAGE_ID_TO_LOCALE } from "@/constants";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import FlexibleLayout from "@/components/flexible-layout";

export function ProductPageLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { currentCountry, languageId } = useTranslationsStore((s) => s);

  const country = currentCountry.countryCode?.toLowerCase() || "gb";
  const locale = LANGUAGE_ID_TO_LOCALE[languageId] || "en";
  const homePath = `/${country}/${locale}`;

  const handleBack = () => {
    if (typeof window === "undefined") {
      router.push(homePath);
      return;
    }

    const historyIdx = window.history.state?.idx;
    if (typeof historyIdx === "number" && historyIdx > 0) {
      router.back();
      return;
    }

    try {
      const ref = document.referrer;
      if (ref) {
        const refUrl = new URL(ref);
        if (refUrl.origin === window.location.origin) {
          router.push(`${refUrl.pathname}${refUrl.search}${refUrl.hash}`);
          return;
        }
      }
    } catch {
      /* invalid referrer */
    }

    router.push(homePath);
  };

  return (
    <FlexibleLayout
      mobileHeaderType="flexible"
      headerType="catalog"
      displayFooter={false}
      headerProps={{
        left: `<`,
        onClick: handleBack,
      }}
    >
      {children}
    </FlexibleLayout>
  );
}
