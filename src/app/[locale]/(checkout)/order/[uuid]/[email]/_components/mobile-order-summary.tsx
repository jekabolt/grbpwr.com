"use client";

import type { common_OrderFull } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";
import { useTranslations } from "next-intl";
import { useState } from "react";

import FieldsGroupContainer from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/fields-group-container";
import { OrderProducts } from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/order-products";
import { Text } from "@/components/ui/text";
type Props = {
    orderData: common_OrderFull;
};

export function MobileOrderSummary({ orderData }: Props) {
    const t = useTranslations("checkout");
    const tOrder = useTranslations("order-info");
    const [isOpen, setIsOpen] = useState(false);

    const { order, orderItems, shipment, promoCode } = orderData;
    const orderCurrency =
      currencySymbols[order?.currency?.toUpperCase() || "EUR"];

    function handleToggle() {
        setIsOpen((prev) => !prev);
    }

    return (
        <FieldsGroupContainer
            signType="plus-minus"
            className="space-y-0 border border-textInactiveColor p-2.5"
            signPosition="before"
            title={`${isOpen ? t("hide") : t("show")} ${t("order summary")}`}
            preview={
                <Text>{`${orderCurrency} ${order?.totalPrice?.value || ""}`}</Text>
            }
            isOpen={isOpen}
            onToggle={handleToggle}
        >
            <div className="mt-4 space-y-3">
                <OrderProducts
                validatedProducts={orderItems || []}
                currencyKey={order?.currency?.toUpperCase()}
              />
                <div className="space-y-3">
                    {promoCode?.promoCodeInsert?.code && (
                        <div className="flex justify-between">
                            <Text variant="uppercase">{tOrder("discount code")}</Text>
                            <Text>{promoCode?.promoCodeInsert?.code}</Text>
                        </div>
                    )}
                    {promoCode?.promoCodeInsert?.code && (
                        <div className="flex justify-between">
                            <Text variant="uppercase">{t("promo discount")}</Text>
                            <Text>{promoCode?.promoCodeInsert?.discount?.value} %</Text>
                        </div>
                    )}
                    {shipment?.cost?.value && (
                        <div className="flex justify-between">
                            <Text variant="uppercase">{tOrder("shipping")}:</Text>
                            <Text>{`${orderCurrency} ${shipment?.cost?.value}`}</Text>
                        </div>
                    )}
                </div>
                <div className="border-t border-textInactiveColor pt-3">
                    <div className="flex justify-between">
                        <Text variant="uppercase">{t("grand total")}:</Text>
                        <Text>{`${orderCurrency} ${order?.totalPrice?.value}`}</Text>
                    </div>
                </div>
            </div>
        </FieldsGroupContainer>
    );
}

