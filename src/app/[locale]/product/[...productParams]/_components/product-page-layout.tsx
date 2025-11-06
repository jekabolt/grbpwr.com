"use client";

import { useRouter } from "next/navigation";

import FlexibleLayout from "@/components/flexible-layout";

export function ProductPageLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <FlexibleLayout
      mobileHeaderType="flexible"
      headerType="catalog"
      displayFooter={false}
      headerProps={{
        left: `<`,
        onClick: () => router.back(),
      }}
    >
      {children}
    </FlexibleLayout>
  );
}
