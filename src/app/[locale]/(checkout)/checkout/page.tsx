import { Suspense } from "react";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

import {
  CHECKOUT_GUEST_COOKIE,
  hasPersistedGuestCheckoutCookie,
} from "@/lib/checkout/guest-checkout-intent";
import { getStorefrontAccount } from "@/lib/storefront-account/get-storefront-account";
import FlexibleLayout from "@/components/flexible-layout";

import { CheckoutFormWrapper } from "./_components/checkout-form-wrapper";
import {
  CheckoutGuestSkeleton,
  CheckoutLoginFormSkeleton,
} from "./_components/checkout-skeleton";

export default async function CheckoutPage() {
  const t = await getTranslations("navigation");
  const account = await getStorefrontAccount();
  const jar = await cookies();
  const persistedGuestCheckout = hasPersistedGuestCheckoutCookie(
    jar.get(CHECKOUT_GUEST_COOKIE)?.value,
  );

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
      <div className="px-2.5 pb-8 pt-20 lg:relative lg:min-h-dvh lg:px-32 lg:py-24">
        <Suspense
          fallback={
            persistedGuestCheckout ? (
              <CheckoutGuestSkeleton />
            ) : (
              <CheckoutLoginFormSkeleton />
            )
          }
        >
          <CheckoutFormWrapper
            initialAccount={account}
            persistedGuestCheckout={persistedGuestCheckout}
          />
        </Suspense>
      </div>
    </FlexibleLayout>
  );
}
