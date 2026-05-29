"use client";

import { useMemo } from "react";
import Link from "next/link";
import type {
  common_OrderFull,
  StorefrontAccount,
} from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { buildTrackingUrl } from "@/lib/shipment/tracking-url";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { Text } from "@/components/ui/text";

import { buildOrderConfirmationUrl } from "../../(checkout)/checkout/_components/new-order-form/utils";
import { StatusBadge } from "../../(checkout)/order/[uuid]/[email]/_components/status-badge";
import { encodeEmailBase64, formatOrderDate } from "../utils/utility";

export function OrderItem({
  order,
  account,
}: {
  order: common_OrderFull;
  account: StorefrontAccount;
}) {
  const t = useTranslations("account");
  const { dictionary } = useDataContext();
  const { currentCountry, languageId } = useTranslationsStore((s) => s);
  const createdAt = formatOrderDate(
    order.order?.placed ??
      order.order?.modified ??
      order.orderReview?.orderReview?.createdAt,
  );
  const orderHref = buildOrderConfirmationUrl({
    countryCode: currentCountry.countryCode,
    languageId,
    orderUuid: order.order?.uuid ?? "",
    emailBase64: encodeEmailBase64(account.email ?? ""),
  });
  const trackingUrl = useMemo(() => {
    if (!order.shipment || !dictionary?.shipmentCarriers) return undefined;
    const carrier = dictionary.shipmentCarriers.find(
      (c) => String(c.id) === String(order.shipment?.carrierId),
    );
    return buildTrackingUrl(
      carrier?.shipmentCarrier?.trackingUrl,
      order.shipment.trackingCode,
    );
  }, [dictionary?.shipmentCarriers, order.shipment]);

  return (
    <div className="border-b border-textInactiveColor bg-bgColor py-6 text-textColor first:pt-0">
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0 space-y-6">
          <Link href={orderHref} className="block space-y-6">
            <Text>{createdAt}</Text>
            <div>
              <Text>{order.order?.uuid}</Text>
              <StatusBadge statusId={order.order?.orderStatusId ?? 0} />
            </div>
          </Link>
          {trackingUrl ? (
            <Button asChild variant="underlineWithColors" className="uppercase">
              <Link
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("track order")}
              </Link>
            </Button>
          ) : null}
        </div>
        <Link href={orderHref} className="flex shrink-0 justify-end gap-2">
          {order.orderItems?.slice(0, 2).map((i) => (
            <div key={i.id} className="w-20">
              <Image
                src={i.thumbnail ?? ""}
                fit="contain"
                aspectRatio="4/5"
                alt={t("order product thumbnail alt")}
              />
            </div>
          ))}
        </Link>
      </div>
    </div>
  );
}
