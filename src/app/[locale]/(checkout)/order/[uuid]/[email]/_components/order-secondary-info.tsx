"use client";

import type { common_OrderFull } from "@/api/proto-http/frontend";
import { paymentMethodNamesMap } from "@/constants";
import { useTranslations } from "next-intl";

import { useDataContext } from "@/components/contexts/DataContext";
import { Text } from "@/components/ui/text";
import FieldsGroupContainer from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/fields-group-container";

import { OrderAddressLines } from "./order-address-lines";

export function OrderSecondaryInfo({
  shipping,
  billing,
  shipment,
  buyer,
  payment,
}: Props) {
  const { dictionary } = useDataContext();
  const tCheckout = useTranslations("checkout");

  const carrier = dictionary?.shipmentCarriers?.find(
    (c) => String(c.id) === String(shipment?.carrierId),
  );
  const rawCarrierName = carrier?.shipmentCarrier?.carrier;
  const shipmentCarrierName =
    rawCarrierName === "FREE" ? tCheckout("FREE") : rawCarrierName;
  return (
    <>
      <div className="hidden lg:block">
        <DesktopOrderSecondaryInfo
          shipping={shipping}
          billing={billing}
          buyer={buyer}
          payment={payment}
          shipmentCarrierName={shipmentCarrierName}
        />
      </div>
      <div className="block lg:hidden">
        <MobileOrderSecondaryInfo
          shipping={shipping}
          billing={billing}
          buyer={buyer}
          payment={payment}
          shipmentCarrierName={shipmentCarrierName}
        />
      </div>
    </>
  );
}

export function DesktopOrderSecondaryInfo({
  shipping,
  billing,
  buyer,
  payment,
  shipmentCarrierName,
}: DesktopMobileProps) {
  const t = useTranslations("order-info");
  const tCheckout = useTranslations("checkout");

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-row items-center justify-between border-b border-textInactiveColor py-6">
        <div className="flex w-full flex-col gap-4">
          <Text variant="uppercase">{t("shipping address")}</Text>
          {shipping && (
            <OrderAddressLines buyer={buyer} addressSource={shipping} />
          )}
        </div>
        <div className="flex w-full flex-col gap-4">
          <Text variant="uppercase">{tCheckout("billing address")}</Text>
          {billing && (
            <OrderAddressLines buyer={buyer} addressSource={billing} />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 border-b border-textInactiveColor pb-6">
        <Text variant="uppercase">{tCheckout("shipping method")}</Text>
        <div className="flex flex-col gap-1">
          {shipmentCarrierName && (
            <Text variant="default">{shipmentCarrierName}</Text>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Text variant="uppercase">{tCheckout("payment method")}</Text>
        <Text className="lowercase">
          {
            paymentMethodNamesMap[
              payment?.paymentInsert
                ?.paymentMethod as keyof typeof paymentMethodNamesMap
            ]
          }
        </Text>
      </div>
    </div>
  );
}

export function MobileOrderSecondaryInfo({
  shipping,
  billing,
  buyer,
  payment,
  shipmentCarrierName,
}: DesktopMobileProps) {
  const t = useTranslations("order-info");
  const tCheckout = useTranslations("checkout");

  return (
    <FieldsGroupContainer
      title={t("delivery/payment info")}
      signType="plus-minus"
      className="space-y-0 border border-textInactiveColor p-2.5"
      signPosition="before"
      clickableAreaClassName="w-full"
    >
      <div className="mt-4 space-y-10">
        <div className="flex w-full justify-between">
          <Text variant="uppercase" className="w-full">
            {t("shipping address")}
          </Text>
          {shipping && (
            <div className="w-full">
              <OrderAddressLines buyer={buyer} addressSource={shipping} />
            </div>
          )}
        </div>
        <div className="flex w-full justify-between">
          <Text variant="uppercase" className="w-full">
            {tCheckout("billing address")}
          </Text>
          {billing && (
            <div className="w-full">
              <OrderAddressLines buyer={buyer} addressSource={billing} />
            </div>
          )}
        </div>
        <div className="flex w-full justify-between">
          <Text variant="uppercase" className="w-full">
            {tCheckout("shipping method")}
          </Text>
          <div className="flex w-full flex-col gap-1">
            {shipmentCarrierName && <Text>{shipmentCarrierName}</Text>}
          </div>
        </div>
        <div className="flex w-full justify-between">
          <Text variant="uppercase" className="w-full">
            {tCheckout("payment method")}
          </Text>
          <Text className="w-full lowercase">
            {
              paymentMethodNamesMap[
                payment?.paymentInsert
                  ?.paymentMethod as keyof typeof paymentMethodNamesMap
              ]
            }
          </Text>
        </div>
      </div>
    </FieldsGroupContainer>
  );
}

type Props = Pick<
  common_OrderFull,
  "shipping" | "billing" | "shipment" | "buyer" | "payment"
>;

type DesktopMobileProps = Pick<
  common_OrderFull,
  "shipping" | "billing" | "buyer" | "payment"
> & {
  shipmentCarrierName?: string;
};
