"use client";

import { use, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { common_OrderFull } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";
import { useTranslations } from "next-intl";

import { sendPurchaseEvent } from "@/lib/analitycs/checkout";
import { SizeMap, pushUserIdToDataLayer, ensureGtag } from "@/lib/analitycs/utils";
import { getTopCategoryName, getSubCategoryName } from "@/lib/categories-map";
import { resetCheckoutValidationState } from "@/lib/checkout/checkout-validation-state";
import { clearIdempotencyKey } from "@/lib/checkout/idempotency-key";
import { formatPrice } from "@/lib/currency";
import { buildTrackingUrl } from "@/lib/shipment/tracking-url";
import { useCart } from "@/lib/stores/cart/store-provider";
import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { OrderProducts } from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/order-products";

import { MobileOrderSummary } from "./mobile-order-summary";
import { OrderSecondaryInfo } from "./order-secondary-info";
import { StatusBadge } from "./status-badge";

export function OrderPageComponent({
  orderPromise,
}: {
  orderPromise: Promise<{ order: common_OrderFull | undefined }>;
}) {
  const { order: orderData } = use(orderPromise);
  const { dictionary } = useDataContext();
  const { clearCart } = useCart((state) => state);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("order-info");
  const tCheckout = useTranslations("checkout");
  const purchaseFiredRef = useRef(false);

  const sizeMap: SizeMap = useMemo(() => {
    const sizes = dictionary?.sizes || [];
    return sizes.reduce<SizeMap>((acc, s) => {
      if (s.id != null && s.name) acc[s.id] = s.name.trim();
      return acc;
    }, {});
  }, [dictionary?.sizes]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    ensureGtag();

    const params = new URLSearchParams(window.location.search);
    const redirectStatus = params.get("redirect_status");

    if (redirectStatus === "succeeded") {
      clearCart();
      clearIdempotencyKey();
      resetCheckoutValidationState();

      if (
        !purchaseFiredRef.current &&
        orderData?.orderItems?.length &&
        orderData.order?.uuid
      ) {
        purchaseFiredRef.current = true;

        const items = orderData.orderItems;
        const topCategoryId =
          items.find((v) => v?.topCategoryId)?.topCategoryId || 0;
        const subCategoryId =
          items.find((v) => v?.subCategoryId)?.subCategoryId || 0;

        sendPurchaseEvent(
          items,
          orderData.order.uuid,
          getTopCategoryName(dictionary?.categories || [], topCategoryId) || "",
          getSubCategoryName(dictionary?.categories || [], subCategoryId) || "",
          orderData.order.currency?.toUpperCase() || "EUR",
          sizeMap,
          {
            coupon: orderData.promoCode?.promoCodeInsert?.code || undefined,
            shipping:
              parseFloat(orderData.shipment?.cost?.value || "0") || undefined,
          },
        );

        const buyerEmail = orderData.buyer?.buyerInsert?.email;
        if (buyerEmail) {
          void pushUserIdToDataLayer(buyerEmail);
        }
      }

      // Clean URL params to prevent re-firing on soft navigation
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);
    } else if (redirectStatus === "failed" || redirectStatus === "canceled") {
      console.error("Payment failed or canceled");
      // Preserve locale from current path (e.g. /de/de/order/...) — path carries locale from return_url
      const parts = pathname?.split("/").filter(Boolean) ?? [];
      const country = parts[0] || "us";
      const locale = parts[1] || "en";
      router.push(`/${country}/${locale}/checkout`);
    }
  }, [clearCart, router, orderData, dictionary?.categories, sizeMap, pathname]);

  if (!orderData) return null;

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

  const orderCurrencyKey = order?.currency?.toUpperCase() || "EUR";
  const orderCurrency = currencySymbols[orderCurrencyKey];

  const carrier = dictionary?.shipmentCarriers?.find(
    (c) => String(c.id) === String(shipment?.carrierId),
  );
  const trackingUrl = buildTrackingUrl(
    carrier?.shipmentCarrier?.trackingUrl,
    shipment?.trackingCode,
  );

  return (
    <div className="flex flex-col gap-6 md:flex-row md:justify-between lg:gap-52">
      <div className="w-full space-y-10">
        <div className="block space-y-4 lg:hidden">
          <MobileOrderSummary orderData={orderData} />
          <OrderSecondaryInfo
            shipping={shipping}
            billing={billing}
            shipment={shipment}
            buyer={buyer}
            payment={payment}
          />
        </div>
        <div className="flex flex-col items-center justify-between gap-y-6 border-b border-transparent pb-6 lg:flex-row lg:border-textInactiveColor">
          <div className="flex w-full flex-row items-baseline justify-between gap-4 lg:flex-col">
            <Text variant="uppercase">{t("order id")}</Text>
            <Text className="select-all break-all">{order?.uuid}</Text>
          </div>
          <div className="flex w-full flex-row items-baseline justify-between gap-4 lg:flex-col">
            <Text variant="uppercase">{t("order date")}</Text>
            {order?.placed && (
              <Text>{new Date(order.placed).toLocaleDateString()}</Text>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-y-6 border-b border-transparent py-6 lg:flex-row lg:border-textInactiveColor">
          <div className="flex w-full flex-row items-baseline justify-between gap-4 lg:flex-col">
            <Text variant="uppercase">{t("status")}</Text>
            {order?.orderStatusId && (
              <StatusBadge statusId={order.orderStatusId} />
            )}
          </div>
          {shipment && (
            <div className="flex w-full flex-row items-baseline justify-between gap-4 lg:flex-col">
              <Text variant="uppercase">{t("tracking number")}</Text>
              {shipment.trackingCode && trackingUrl ? (
                <Button variant="underlineWithColors" size="default" asChild>
                  <Link
                    href={trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {shipment.trackingCode}
                  </Link>
                </Button>
              ) : (
                <Text className="text-textInactiveColor">—</Text>
              )}
            </div>
          )}
        </div>
        <div className="hidden lg:block">
          <OrderSecondaryInfo
            shipping={shipping}
            billing={billing}
            shipment={shipment}
            buyer={buyer}
            payment={payment}
          />
        </div>
      </div>

      <div className="hidden w-full space-y-3 md:block">
        <div className="space-y-2">
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
          </div>
        </div>
        <OrderProducts
          validatedProducts={orderItems || []}
          currencyKey={order?.currency?.toUpperCase()}
        />
        <div className="space-y-3 pt-3">
          <div className="flex justify-between">
            <Text variant="uppercase">{t("shipping")}:</Text>
            <Text>
              {shipment?.freeShipping
                ? tCheckout("FREE")
                : formatPrice(
                    shipment?.cost?.value ?? "0",
                    orderCurrencyKey,
                    orderCurrency,
                  )}
            </Text>
          </div>
          <div className="flex justify-between border-t border-textInactiveColor pt-3">
            <Text variant="uppercase">{tCheckout("grand total")}:</Text>
            <Text>
              {formatPrice(
                order?.totalPrice?.value || "0",
                orderCurrencyKey,
                orderCurrency,
              )}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
