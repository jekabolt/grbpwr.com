"use client";

import type { common_OrderFull } from "@/api/proto-http/frontend";
import { paymentMethodNamesMap } from "@/constants";
import { useTranslations } from "next-intl";

import FieldsGroupContainer from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/fields-group-container";
import { useDataContext } from "@/components/contexts/DataContext";
import { Text } from "@/components/ui/text";

export function OrderSecondaryInfo({
  shipping,
  billing,
  shipment,
  buyer,
  payment,
}: Props) {
  const { dictionary } = useDataContext();

  const shipmentCarrierName = dictionary?.shipmentCarriers?.find(
    (carrier) => carrier.id === shipment?.carrierId,
  )?.shipmentCarrier?.carrier;

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
            <div>
              <Text>
                {`${buyer?.buyerInsert?.firstName} ${buyer?.buyerInsert?.lastName}`}
              </Text>
              <Text>{shipping.addressInsert?.addressLineOne}</Text>
              {shipping.addressInsert?.addressLineTwo && (
                <Text>{shipping.addressInsert?.addressLineTwo}</Text>
              )}
              <Text>{shipping.addressInsert?.city}</Text>
              <Text>{shipping.addressInsert?.postalCode}</Text>
            </div>
          )}
        </div>
        <div className="flex w-full flex-col gap-4">
          <Text variant="uppercase">{tCheckout("billing address")}</Text>
          {billing && (
            <div>
              <Text>
                {`${buyer?.buyerInsert?.firstName} ${buyer?.buyerInsert?.lastName}`}
              </Text>
              <Text>{billing.addressInsert?.addressLineOne}</Text>
              {billing.addressInsert?.addressLineTwo && (
                <Text>{billing.addressInsert?.addressLineTwo}</Text>
              )}
              <Text>{billing.addressInsert?.city}</Text>
              <Text>{billing.addressInsert?.postalCode}</Text>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 border-b border-textInactiveColor pb-6">
        <Text variant="uppercase">{tCheckout("shipping method")}</Text>
        <Text variant="default">{shipmentCarrierName}</Text>
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
      className="space-y-0 border-b border-l border-r border-textInactiveColor p-2.5"
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
              <Text>
                {`${buyer?.buyerInsert?.firstName} ${buyer?.buyerInsert?.lastName}`}
              </Text>
              <Text>{shipping.addressInsert?.addressLineOne}</Text>
              {shipping.addressInsert?.addressLineTwo && (
                <Text>{shipping.addressInsert?.addressLineTwo}</Text>
              )}
              <Text>{shipping.addressInsert?.city}</Text>
              <Text>{shipping.addressInsert?.postalCode}</Text>
            </div>
          )}
        </div>
        <div className="flex w-full justify-between">
          <Text variant="uppercase" className="w-full">
            {tCheckout("billing address")}
          </Text>
          {billing && (
            <div className="w-full">
              <Text>
                {`${buyer?.buyerInsert?.firstName} ${buyer?.buyerInsert?.lastName}`}
              </Text>
              <Text>{billing.addressInsert?.addressLineOne}</Text>
              {billing.addressInsert?.addressLineTwo && (
                <Text>{billing.addressInsert?.addressLineTwo}</Text>
              )}
              <Text>{billing.addressInsert?.city}</Text>
              <Text>{billing.addressInsert?.postalCode}</Text>
            </div>
          )}
        </div>
        <div className="flex w-full justify-between">
          <Text variant="uppercase" className="w-full">
            {tCheckout("shipping method")}
          </Text>
          <Text className="w-full">{shipmentCarrierName}</Text>
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
> & {
  shipmentCarrierName?: string;
};

type DesktopMobileProps = Pick<
  common_OrderFull,
  "shipping" | "billing" | "buyer" | "payment"
> & {
  shipmentCarrierName?: string;
};
