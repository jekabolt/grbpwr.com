"use client";

import type { common_OrderFull } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

import { OrderProducts } from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/order-products";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { clearIdempotencyKey } from "@/lib/checkout/idempotency-key";
import { resetCheckoutValidationState } from "@/lib/checkout/checkout-validation-state";
import { useCart } from "@/lib/stores/cart/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

import { MobileOrderSummary } from "./mobile-order-summary";
import { OrderSecondaryInfo } from "./order-secondary-info";
import { StatusBadge } from "./status-badge";

export function OrderPageComponent({
  orderPromise,
}: {
  orderPromise: Promise<{ order: common_OrderFull | undefined }>;
}) {
  const { order: orderData } = use(orderPromise);
  const { currentCountry } = useTranslationsStore((state) => state);
  const { clearCart } = useCart((state) => state);
  const router = useRouter();
  const t = useTranslations("order-info");
  const tCheckout = useTranslations("checkout");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const redirectStatus = params.get("redirect_status");

    if (redirectStatus === "succeeded") {
      clearCart();
      clearIdempotencyKey();
      resetCheckoutValidationState();
    } else if (redirectStatus === "failed" || redirectStatus === "canceled") {
      console.error("Payment failed or canceled");
      router.push("/checkout");
    }
  }, [clearCart, router, orderData]);

  if (!orderData) return null;

  const currentCurrency = currencySymbols[currentCountry.currencyKey || "EUR"];

  const {
    order,
    orderItems,
    shipment,
    promoCode,
    billing,
    shipping,
    buyer,
    payment,
  } = orderData;

  return (
    <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-52">
      <div className="w-full">
        <div className="block lg:hidden">
          <MobileOrderSummary orderData={orderData} />
        </div>
        <div className="flex flex-col items-center justify-between gap-y-6 border-b border-textInactiveColor py-6 lg:flex-row">
          <div className="flex w-full flex-row justify-between gap-4 lg:flex-col">
            <Text variant="uppercase">{t("order id")}</Text>
            <Text className="select-all break-all py-2">{order?.uuid}</Text>
          </div>
          <div className="flex w-full flex-row justify-between gap-4 lg:flex-col">
            <Text variant="uppercase">{t("order date")}</Text>
            {order?.placed && (
              <Text>{new Date(order.placed).toLocaleDateString()}</Text>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-y-6 border-b border-textInactiveColor py-6 lg:flex-row">
          <div className="flex w-full flex-row justify-between gap-4 lg:flex-col">
            <Text variant="uppercase">{t("status")}</Text>
            {order?.orderStatusId && (
              <StatusBadge statusId={order.orderStatusId} />
            )}
          </div>
          {shipment && shipment.trackingCode && (
            <div className="flex w-full flex-row gap-4 lg:flex-col">
              <Text variant="uppercase">{t("tracking number")}</Text>
              <Button variant="underlineWithColors" size="default" asChild>
                <Link href={"/some-page"}>{shipment.trackingCode}</Link>
              </Button>
            </div>
          )}
        </div>
        <OrderSecondaryInfo
          shipping={shipping}
          billing={billing}
          shipment={shipment}
          buyer={buyer}
          payment={payment}
        />
      </div>
      <div className="hidden w-full space-y-20 lg:block">
        <div className="space-y-8">
          <Text variant="uppercase">{tCheckout("order summary")}</Text>
          <div className="space-y-3">
            {promoCode?.promoCodeInsert?.code && (
              <div className="flex justify-between">
                <Text variant="uppercase">{t("discount code")}</Text>
                <Text>{promoCode?.promoCodeInsert?.code}</Text>
              </div>
            )}
            {promoCode?.promoCodeInsert?.code && (
              <div className="flex justify-between">
                <Text variant="uppercase">{tCheckout("promo discount")}</Text>
                <Text>{promoCode?.promoCodeInsert?.discount?.value} %</Text>
              </div>
            )}
            {promoCode?.promoCodeInsert?.code && (
              <div className="flex justify-between">
                <Text variant="uppercase">{t("shipping")}:</Text>
                <Text>{`${currentCurrency} ${shipment?.cost?.value}`}</Text>
              </div>
            )}
          </div>

          <div className="flex justify-between border-t border-textInactiveColor pt-3">
            <Text variant="uppercase">{tCheckout("grand total")}:</Text>
            <Text>{`${currentCurrency} ${order?.totalPrice?.value}`}</Text>
          </div>
        </div>
        <OrderProducts validatedProducts={orderItems || []} />
      </div>
    </div>
  );
}
