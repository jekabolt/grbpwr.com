"use client";

import Link from "next/link";
import type { common_Order, common_OrderFull } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { StatusBadge } from "./status-badge";

export function OrderStatusAndTracking({
  order,
  shipment,
  trackingUrl,
  variant = "desktop",
}: {
  order?: common_Order;
  shipment: common_OrderFull["shipment"] | undefined;
  trackingUrl?: string;
  variant?: "desktop" | "mobile";
}) {
  const t = useTranslations("order-info");

  const trackingSection =
    shipment != null ? (
      <div
        className={
          variant === "desktop"
            ? "flex w-full flex-col items-baseline justify-between gap-4"
            : "flex w-full items-baseline justify-between"
        }
      >
        <Text variant="uppercase">{t("tracking number")}</Text>
        {shipment.trackingCode && trackingUrl ? (
          <Button variant="underlineWithColors" size="default" asChild>
            <Link href={trackingUrl} target="_blank" rel="noopener noreferrer">
              {shipment.trackingCode}
            </Link>
          </Button>
        ) : (
          <Text className="text-textInactiveColor">—</Text>
        )}
      </div>
    ) : null;

  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-baseline justify-between">
          <Text variant="uppercase">{t("status")}</Text>
          {order?.orderStatusId && (
            <StatusBadge statusId={order.orderStatusId} />
          )}
        </div>
        {trackingSection}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between border-b border-textInactiveColor py-6">
      <div className="flex w-full flex-col items-baseline justify-between gap-4">
        <Text variant="uppercase">{t("status")}</Text>
        {order?.orderStatusId && (
          <StatusBadge statusId={order.orderStatusId} />
        )}
      </div>
      {trackingSection}
    </div>
  );
}
