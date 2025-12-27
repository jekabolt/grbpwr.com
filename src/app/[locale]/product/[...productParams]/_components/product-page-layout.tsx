"use client";

import { useParams, useRouter } from "next/navigation";

import FlexibleLayout from "@/components/flexible-layout";

export function ProductPageLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const productParams = params.productParams as string[] | undefined;
  // Product params structure: [gender, brand, name, id]
  const gender = productParams?.[0];

  const handleBack = () => {
    // Check if there's browser history to go back to
    // If history.length is 1, it means this is the first page in the session
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      // If no history, navigate to catalog page with associated gender
      const catalogPath = gender
        ? `/${locale}/catalog/${gender}`
        : `/${locale}/catalog`;
      router.push(catalogPath);
    }
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
