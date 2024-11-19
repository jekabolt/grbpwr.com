"use client";

import { use } from "react";
import Link from "next/link";
import type { common_OrderFull } from "@/api/proto-http/frontend";

import { useDataContext } from "@/components/DataContext";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import ItemRow from "@/app/(checkout)/cart/_components/ItemRow";

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

  const shipmentCarrierName = dictionary?.shipmentCarriers?.find(
    (carrier) => carrier.id === shipment?.carrierId,
  )?.shipmentCarrier?.carrier;

  return (
    <div>
      <div className="grid min-h-52 gap-10 border-b border-dashed border-textInactiveColor py-10 md:grid-cols-4">
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

      <div className="mb-10 grid min-h-52 gap-10 border-b border-dashed border-textInactiveColor py-10 md:grid-cols-4">
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
          <Text variant="default">{shipmentCarrierName}</Text>
        </div>
        <div className="space-y-4">
          <Text variant="inactive">receipt</Text>
          <Button variant="underlineWithColors" size="default" asChild>
            <Link href={"/some-page"}>link</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-72">
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
        <div className="col-span-1 space-y-6">
          {orderItems?.map((item, i) => (
            <ItemRow
              key={item?.id + "" + item.orderId + i}
              product={item}
              hideQuantityButtons
            />
          ))}
        </div>
      </div>
    </div>
  );
}
