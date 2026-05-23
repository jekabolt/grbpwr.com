import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LANGUAGE_CODE_TO_ID } from "@/constants";
import { getTranslations } from "next-intl/server";

import { getStorefrontAccount } from "@/lib/storefront-account/get-storefront-account";
import FlexibleLayout from "@/components/flexible-layout";

import { CheckoutFormWrapper } from "./_components/checkout-form-wrapper";
import { CheckoutLoginFormSkeleton } from "./_components/checkout-skeleton";
import { buildOrderConfirmationUrl } from "./_components/new-order-form/utils";

function pickSearchParam(
  qs: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const v = qs[key];
  if (typeof v === "string" && v.length > 0) return v;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return undefined;
}

type CheckoutPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CheckoutPage({
  params,
  searchParams,
}: CheckoutPageProps) {
  const qs = await searchParams;
  const redirectStatus = pickSearchParam(qs, "redirect_status");
  const orderUuid = pickSearchParam(qs, "order_uuid");
  const emailB64 = pickSearchParam(qs, "email");
  const paymentIntent = pickSearchParam(qs, "payment_intent");

  if (
    redirectStatus === "succeeded" &&
    orderUuid &&
    emailB64 &&
    paymentIntent
  ) {
    const { locale } = await params;
    const h = await headers();
    const countryCode = h.get("x-nextjs-country")?.toLowerCase() || "gb";
    const languageId = LANGUAGE_CODE_TO_ID[locale] ?? 1;

    redirect(
      buildOrderConfirmationUrl({
        countryCode,
        languageId,
        orderUuid,
        emailBase64: emailB64,
        redirectStatus: "succeeded",
      }),
    );
  }

  const t = await getTranslations("navigation");
  const account = await getStorefrontAccount();

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
        <Suspense fallback={<CheckoutLoginFormSkeleton />}>
          <CheckoutFormWrapper initialAccount={account} />
        </Suspense>
      </div>
    </FlexibleLayout>
  );
}
