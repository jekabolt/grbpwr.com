"use client";

import { useRouter } from "next/navigation";
import { LANGUAGE_ID_TO_LOCALE } from "@/constants";

import { getPreviousPath } from "@/lib/navigation/internal-navigation";
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

    const prevPath = getPreviousPath();
    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (prevPath && prevPath !== currentPath) {
      router.push(prevPath);
      return;
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
