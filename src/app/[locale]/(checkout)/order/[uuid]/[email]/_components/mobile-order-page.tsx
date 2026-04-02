"use client";

import { common_Order, common_OrderFull } from "@/api/proto-http/frontend";

import { MobileOrderSummary } from "./mobile-order-summary";
import { OrderIdDateRow } from "./order-id-date-row";
import { OrderSecondaryInfo } from "./order-secondary-info";
import { OrderStatusAndTracking } from "./order-status-and-tracking";

export function MobileOrderPage({
  order,
  orderData,
  shipping,
  billing,
  shipment,
  buyer,
  payment,
  trackingUrl,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-10">
        <div className="space-y-4">
          <MobileOrderSummary orderData={orderData} />
          <OrderSecondaryInfo
            shipping={shipping}
            billing={billing}
            shipment={shipment}
            buyer={buyer}
            payment={payment}
          />
        </div>
        <div className="flex flex-col gap-4">
          <OrderIdDateRow
            variant="mobile"
            orderUuid={order?.uuid}
            placedAt={order?.placed}
          />
          <OrderStatusAndTracking
            variant="mobile"
            order={order}
            shipment={shipment}
            trackingUrl={trackingUrl || undefined}
          />
        </div>
      </div>
    </div>
  );
}

type OrderProps = Pick<
  common_OrderFull,
  "order" | "shipping" | "billing" | "shipment" | "buyer" | "payment"
>;

type Props = OrderProps & {
  order?: common_Order;
  orderData: common_OrderFull;
  trackingUrl: string;
};
