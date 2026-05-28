"use client";

import { use, useMemo, useRef } from "react";
import type { common_OrderFull } from "@/api/proto-http/frontend";

import type { SizeMap } from "@/lib/analitycs/utils";
import { buildTrackingUrl } from "@/lib/shipment/tracking-url";
import { useDataContext } from "@/components/contexts/DataContext";

import { useOrderRedirectAnalytics } from "../utils/use-order-redirect-analytics";
import { MobileOrderPage } from "./mobile-order-page";
import { OrderIdDateRow } from "./order-id-date-row";
import { OrderSecondaryInfo } from "./order-secondary-info";
import { OrderStatusAndTracking } from "./order-status-and-tracking";
import { OrderDesktopSummary } from "./order-summary-shared";

export function OrderPageComponent({
  orderPromise,
}: {
  orderPromise: Promise<{ order: common_OrderFull | undefined }>;
}) {
  const { order: orderData } = use(orderPromise);
  const { dictionary } = useDataContext();

  const sizeMap: SizeMap = useMemo(() => {
    const sizes = dictionary?.sizes || [];
    return sizes.reduce<SizeMap>((acc, s) => {
      if (s.id != null && s.name) acc[s.id] = s.name.trim();
      return acc;
    }, {});
  }, [dictionary?.sizes]);

  const sizeMapRef = useRef(sizeMap);
  sizeMapRef.current = sizeMap;

  const trackingUrl = useMemo(() => {
    if (!orderData?.shipment || !dictionary?.shipmentCarriers) return undefined;
    const carrier = dictionary.shipmentCarriers.find(
      (c) => String(c.id) === String(orderData.shipment?.carrierId),
    );
    return buildTrackingUrl(
      carrier?.shipmentCarrier?.trackingUrl,
      orderData.shipment.trackingCode,
    );
  }, [dictionary?.shipmentCarriers, orderData?.shipment]);

  useOrderRedirectAnalytics({
    orderData,
    dictionaryCategories: dictionary?.categories,
    sizeMapRef,
  });

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

  return (
    <>
      <div className="block md:hidden">
        <MobileOrderPage
          order={order}
          orderData={orderData}
          shipping={shipping}
          billing={billing}
          shipment={shipment}
          buyer={buyer}
          payment={payment}
          trackingUrl={trackingUrl || ""}
        />
      </div>
      <div className="hidden h-full min-h-0 md:grid md:grid-cols-2 md:items-start md:gap-28">
        <div className="w-full min-h-0">
          <OrderIdDateRow orderUuid={order?.uuid} placedAt={order?.placed} />
          <OrderStatusAndTracking
            order={order}
            shipment={shipment}
            trackingUrl={trackingUrl}
          />
          <OrderSecondaryInfo
            shipping={shipping}
            billing={billing}
            shipment={shipment}
            buyer={buyer}
            payment={payment}
          />
        </div>
        <OrderDesktopSummary
          order={order}
          orderItems={orderItems}
          promoCode={promoCode}
          shipment={shipment}
        />
      </div>
    </>
  );
}
