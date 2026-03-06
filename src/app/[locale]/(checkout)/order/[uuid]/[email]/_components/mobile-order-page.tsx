"use client";

import Link from "next/link";
import { common_Order, common_OrderFull } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { MobileOrderSummary } from "./mobile-order-summary";
import { OrderSecondaryInfo } from "./order-secondary-info";
import { StatusBadge } from "./status-badge";

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
  const t = useTranslations("order-info");
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
          <div className="flex flex-col gap-4">
            <div className="flex w-full items-baseline justify-between">
              <Text variant="uppercase">{t("order id")}</Text>
              <Text className="select-all break-all">{order?.uuid}</Text>
            </div>
            <div className="flex w-full items-baseline justify-between">
              <Text variant="uppercase">{t("order date")}</Text>
              {order?.placed && (
                <Text>{new Date(order.placed).toLocaleDateString()}</Text>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex w-full items-baseline justify-between">
              <Text variant="uppercase">{t("status")}</Text>
              {order?.orderStatusId && (
                <StatusBadge statusId={order.orderStatusId} />
              )}
            </div>
            {shipment && (
              <div className="flex w-full items-baseline justify-between">
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
