"use client";

import { use } from "react";
import Link from "next/link";
import type { common_OrderFull } from "@/api/proto-http/frontend";

import { useDataContext } from "@/components/DataContext";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import CartProductsList from "../../../cart/_components/CartProductsList";
import { StatusBadge } from "./status-badge";

export function OrderPageComponent({
  orderPromise,
}: {
  orderPromise: Promise<{ order: common_OrderFull | undefined }>;
}) {
  const { order: orderData } = use(orderPromise);
  const { dictionary } = useDataContext();

  if (!orderData) return null;

  const {
    order,
    orderItems,
    payment,
    shipment,
    promoCode,
    buyer,
    billing,
    shipping,
  } = orderData;

  // Mock tracking URL - replace with actual tracking provider URL in production
  const getTrackingUrl = (trackingCode: string) =>
    `https://tracking-provider.com/track/${trackingCode}`;

  return (
    <div className="flex min-h-screen flex-col justify-between gap-40 px-16 pb-10 pt-20">
      <div>
        <Text variant="uppercase" component="h1">
          Order info
        </Text>

        <div className="grid gap-10 border-b border-dashed border-textInactiveColor py-10 md:grid-cols-5">
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
            <Text variant="inactive">items</Text>
            {orderItems?.length && (
              <Text variant="default">{orderItems.length}</Text>
            )}
          </div>
          <div className="space-y-4">
            <Text variant="inactive">status</Text>
            {order?.orderStatusId && (
              <StatusBadge statusId={order.orderStatusId} />
            )}
          </div>
        </div>

        <div className="mb-10 grid gap-10 border-b border-dashed border-textInactiveColor py-10 md:grid-cols-5 ">
          <div className="space-y-4">
            <Text variant="inactive">shipping address</Text>
            {shipping && (
              <Text variant="default">
                {`${shipping.addressInsert?.addressLineOne}, ${shipping.addressInsert?.city}`}
              </Text>
            )}
          </div>
          <div className="space-y-4">
            <Text variant="inactive">billing address</Text>
            {billing && (
              <Text variant="default">
                {`${billing.addressInsert?.addressLineOne}, ${billing.addressInsert?.city}`}
              </Text>
            )}
          </div>
          <div className="space-y-4">
            <Text variant="inactive">shipping method</Text>
            {shipment && (
              <Text variant="default">{`Carrier ID: ${shipment.carrierId}`}</Text>
            )}
          </div>
          <div className="space-y-4">
            <Text variant="inactive">payment method</Text>
            {payment && (
              <Text variant="default">
                {payment.paymentInsert?.paymentMethod}
              </Text>
            )}
          </div>
          <div className="space-y-4">
            <Text variant="inactive">tracking number</Text>
            {shipment && shipment.trackingCode ? (
              <Button variant="underlineWithColors" size="default" asChild>
                <Link href={getTrackingUrl(shipment.trackingCode)}>
                  {shipment.trackingCode}
                </Link>
              </Button>
            ) : (
              <Text variant="default">-</Text>
            )}
          </div>
        </div>

        <div className="lg:w-1/3">
          <CartProductsList hideQuantityButtons />
        </div>
      </div>

      <div>
        {/* // add button style based on text */}
        <Button variant="default" size="sm" asChild>
          <Link href="/">
            <Text component="span" size="small" variant="inactive">
              contact support
            </Text>
          </Link>
        </Button>
      </div>
    </div>
  );
}
