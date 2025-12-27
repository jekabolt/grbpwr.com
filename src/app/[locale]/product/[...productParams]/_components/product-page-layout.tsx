"use client";

import { useParams, useRouter } from "next/navigation";

import FlexibleLayout from "@/components/flexible-layout";

function getCatalogGender(gender: string | undefined): string | undefined {
  if (!gender) return undefined;
  const normalizedGender = gender.toLowerCase();
  if (normalizedGender === "male") return "men";
  if (normalizedGender === "female") return "women";
  if (normalizedGender === "men" || normalizedGender === "women") {
    return normalizedGender;
  }
  return undefined;
}

export function ProductPageLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const productParams = params.productParams as string[] | undefined;
  const genderFromUrl = productParams?.[0];

  const catalogGender = getCatalogGender(genderFromUrl);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      const catalogPath = catalogGender
        ? `/${locale}/catalog/${catalogGender}`
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
