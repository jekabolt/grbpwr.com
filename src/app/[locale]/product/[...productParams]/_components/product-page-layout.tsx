"use client";

import { useRouter } from "next/navigation";
import { LANGUAGE_ID_TO_LOCALE } from "@/constants";

import { canGoBackInApp } from "@/lib/navigation/internal-navigation";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import FlexibleLayout from "@/components/flexible-layout";

export function ProductPageLayout({
  children,
  gender,
}: {
  children: React.ReactNode;
  // Catalog gender of the item (from the URL) — fallback back-target when there
  // is no in-app history (e.g. arriving via a direct link).
  gender?: string;
}) {
  const router = useRouter();
  const { currentCountry, languageId } = useTranslationsStore((s) => s);

  const country = currentCountry.countryCode?.toLowerCase() || "gb";
  const locale = LANGUAGE_ID_TO_LOCALE[languageId] || "en";
  const homePath = `/${country}/${locale}`;
  const fallbackPath = gender ? `${homePath}/catalog/${gender}` : homePath;

  const handleBack = () => {
    // Real history pop when we got here in-app — avoids the push(prev) ping-pong
    // that caused cyclic "back" loops (product↔checkout, product↔recently-viewed).
    if (typeof window !== "undefined" && canGoBackInApp()) {
      router.back();
      return;
    }
    // Direct entry / no in-app history: go to the item's gender catalog so the
    // user is never stranded on the product detail page.
    router.push(fallbackPath);
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
