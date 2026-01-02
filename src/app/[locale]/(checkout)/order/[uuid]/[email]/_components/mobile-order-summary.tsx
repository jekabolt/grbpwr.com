"use client";

import type { common_OrderFull } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";
import { useTranslations } from "next-intl";
import { useState } from "react";

import FieldsGroupContainer from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/fields-group-container";
import { OrderProducts } from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/order-products";
import { Text } from "@/components/ui/text";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

type Props = {
    orderData: common_OrderFull;
};

export function MobileOrderSummary({ orderData }: Props) {
    const t = useTranslations("checkout");
    const tOrder = useTranslations("order-info");
    const { currentCountry } = useTranslationsStore((state) => state);
    const [isOpen, setIsOpen] = useState(false);

    const currentCurrency = currencySymbols[currentCountry.currencyKey || "EUR"];

    const { order, orderItems, shipment, promoCode } = orderData;

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
                <Text>{`${currentCurrency} ${order?.totalPrice?.value || ""}`}</Text>
            }
            isOpen={isOpen}
            onToggle={handleToggle}
        >
            <div className="mt-4 space-y-3">
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
                            <Text>{`${currentCurrency} ${shipment?.cost?.value}`}</Text>
                        </div>
                    )}
                </div>

                <div className="pt-5">
                    <div className="flex justify-between border-t border-textInactiveColor pt-3">
                        <Text variant="uppercase">{t("grand total")}:</Text>
                        <Text>{`${currentCurrency} ${order?.totalPrice?.value}`}</Text>
                    </div>
                </div>
            </div>
            <OrderProducts validatedProducts={orderItems || []} />
        </FieldsGroupContainer>
    );
}

