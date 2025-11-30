"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { common_OrderFull } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";

import { useCart } from "@/lib/stores/cart/store-provider";
import { useCurrency } from "@/lib/stores/currency/store-provider";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { OrderProducts } from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/order-products";

import { OrderSecondaryInfo } from "./order-secondary-info";
import { StatusBadge } from "./status-badge";

export function OrderPageComponent({
  orderPromise,
}: {
  orderPromise: Promise<{ order: common_OrderFull | undefined }>;
}) {
  const { order: orderData } = use(orderPromise);
  const { selectedCurrency } = useCurrency((state) => state);
  const { clearCart } = useCart((state) => state);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const redirectStatus = params.get("redirect_status");

    if (redirectStatus === "succeeded") {
      clearCart();
    } else if (redirectStatus === "failed" || redirectStatus === "canceled") {
      console.error("Payment failed or canceled");
      router.push("/checkout");
    }
  }, [clearCart, router, orderData]);

  if (!orderData) return null;

  const currentCurrency = currencySymbols[selectedCurrency];

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
        <div className="flex flex-col items-center justify-between gap-y-6 border-b border-textInactiveColor py-6 lg:flex-row">
          <div className="flex w-full flex-row justify-between gap-4 lg:flex-col">
            <Text variant="uppercase">order id</Text>
            <Text>{`#${order?.uuid}`}</Text>
          </div>
          <div className="flex w-full flex-row justify-between gap-4 lg:flex-col">
            <Text variant="uppercase">order date</Text>
            {order?.placed && (
              <Text>{new Date(order.placed).toLocaleDateString()}</Text>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-y-6 border-b border-textInactiveColor py-6 lg:flex-row">
          <div className="flex w-full flex-row justify-between gap-4 lg:flex-col">
            <Text variant="uppercase">status</Text>
            {order?.orderStatusId && (
              <StatusBadge statusId={order.orderStatusId} />
            )}
          </div>
          {shipment && shipment.trackingCode && (
            <div className="flex w-full flex-row gap-4 lg:flex-col">
              <Text variant="uppercase">tracking number</Text>
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
      <div className="w-full space-y-20">
        <div className="space-y-8">
          <Text variant="uppercase">order summary</Text>
          <div className="space-y-3">
            {promoCode?.promoCodeInsert?.code && (
              <div className="flex justify-between">
                <Text variant="uppercase">discount code</Text>
                <Text>{promoCode?.promoCodeInsert?.code}</Text>
              </div>
            )}
            {promoCode?.promoCodeInsert?.code && (
              <div className="flex justify-between">
                <Text variant="uppercase">promo discount</Text>
                <Text>{promoCode?.promoCodeInsert?.discount?.value} %</Text>
              </div>
            )}
            {promoCode?.promoCodeInsert?.code && (
              <div className="flex justify-between">
                <Text variant="uppercase">shipping:</Text>
                <Text>{`${currentCurrency} ${shipment?.cost?.value}`}</Text>
              </div>
            )}
          </div>

          <div className="flex justify-between border-t border-textInactiveColor pt-3">
            <Text variant="uppercase">grand total:</Text>
            <Text>{`${currentCurrency} ${order?.totalPrice?.value}`}</Text>
          </div>
        </div>
        <OrderProducts validatedProducts={orderItems || []} />
      </div>
    </div>
  );
}
