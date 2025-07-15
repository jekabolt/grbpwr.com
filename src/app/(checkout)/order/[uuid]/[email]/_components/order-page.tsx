"use client";

import { use } from "react";
import Link from "next/link";
import type { common_OrderFull } from "@/api/proto-http/frontend";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { OrderProductsList } from "./order-products-list";
import {
  DesktopOrderSecondaryInfo,
  MobileOrderSecondaryInfo,
} from "./order-secondary-info";
import { StatusBadge } from "./status-badge";

export function OrderPageComponent({
  orderPromise,
}: {
  orderPromise: Promise<{ order: common_OrderFull | undefined }>;
}) {
  const { order: orderData } = use(orderPromise);

  if (!orderData) return null;

  const { order, orderItems, shipment, promoCode, billing, shipping } =
    orderData;

  return (
    <div>
      <div className="grid min-h-52 gap-6 border-dashed border-textInactiveColor py-10 md:grid-cols-4 lg:gap-10 lg:border-b">
        <div className="space-y-4">
          <Text variant="inactive">order id</Text>
          <Text variant="default">{`#${order?.uuid}`}</Text>
        </div>
        <div className="space-y-4">
          <Text variant="inactive">date</Text>
          {order?.placed && (
            <Text variant="default">
              {new Date(order.placed).toLocaleDateString()}
            </Text>
          )}
        </div>
        <div className="space-y-4">
          <Text variant="inactive">status</Text>
          {order?.orderStatusId && (
            <StatusBadge statusId={order.orderStatusId} />
          )}
        </div>
        <div className="space-y-4">
          <Text variant="inactive">tracking number</Text>
          {shipment && shipment.trackingCode ? (
            <Button variant="underlineWithColors" size="default" asChild>
              <Link href={"/some-page"}>{shipment.trackingCode}</Link>
            </Button>
          ) : (
            <Text variant="default">-</Text>
          )}
        </div>
      </div>

      <DesktopOrderSecondaryInfo
        shipping={shipping}
        billing={billing}
        shipment={shipment}
      />

      <OrderProductsList orderItems={orderItems || []} className="lg:hidden" />

      <div className="grid grid-cols-1 gap-10 pt-10 lg:grid-cols-2 lg:gap-72 lg:pt-0">
        <div className="lg:hidden">
          <MobileOrderSecondaryInfo
            shipping={shipping}
            billing={billing}
            shipment={shipment}
          />
        </div>

        <div className="col-span-1 space-y-8">
          <Text variant="inactive">order summary</Text>

          <div className="space-y-3">
            {promoCode?.promoCodeInsert?.code && (
              <div className="flex justify-between">
                <Text variant="uppercase">discount code</Text>
                <Text variant="default">
                  {promoCode?.promoCodeInsert?.code}
                </Text>
              </div>
            )}
            {promoCode?.promoCodeInsert?.code && (
              <div className="flex justify-between">
                <Text variant="uppercase">promo discount</Text>
                <Text variant="default">
                  {promoCode?.promoCodeInsert?.discount?.value} %
                </Text>
              </div>
            )}
            {promoCode?.promoCodeInsert?.code && (
              <div className="flex justify-between">
                <Text variant="uppercase">shipping:</Text>
                <Text variant="default">
                  {"[todo] "}
                  {shipment?.cost?.value}
                </Text>
              </div>
            )}
          </div>

          <div className="flex justify-between border-t border-dashed border-textInactiveColor pt-3">
            <Text variant="uppercase">grand total:</Text>
            <Text variant="default">{order?.totalPrice?.value}</Text>
          </div>
        </div>

        <OrderProductsList
          orderItems={orderItems || []}
          className="col-span-1 hidden lg:block"
        />
      </div>
    </div>
  );
}
