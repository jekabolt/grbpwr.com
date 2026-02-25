"use client";

import { useTranslations } from "next-intl";

import FlexibleLayout from "@/components/flexible-layout";

export function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("navigation");

  return (
    <FlexibleLayout
      headerType="flexible"
      displayFooter={false}
      headerProps={{
        left: "<",
        center: t("checkout"),
        right: t("close"),
      }}
    >
      {children}
    </FlexibleLayout>
  );
}
