import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import FlexibleLayout from "@/components/flexible-layout";

import { CheckoutFormWrapper } from "./_components/checkout-form-wrapper";
import { CheckoutFormSkeleton } from "./_components/checkout-skeleton";

export default async function CheckoutPage() {
  const t = await getTranslations("navigation");

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
      <div className="px-2.5 py-20 lg:relative lg:min-h-screen lg:px-32 lg:py-24">
        <Suspense fallback={<CheckoutFormSkeleton />}>
          <CheckoutFormWrapper />
        </Suspense>
      </div>
    </FlexibleLayout>
  );
}
