import type { ValidateOrderItemsInsertResponse } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";

import { useDataContext } from "@/components/contexts/DataContext";
import { Text } from "@/components/ui/text";

export function PriceSummary({ order, form }: PriceSummaryProps) {
  const { dictionary } = useDataContext();
  const t = useTranslations("checkout");

  if (!order) return null;

  const promoPercentageOff = parseInt(order.promo?.discount?.value || "0");
  const promoFreeShipping = !!order.promo?.freeShipping;
  const selectedShipmentCarrierId = form.watch("shipmentCarrierId");

  const selectedShipmentCarrierPrice = dictionary?.shipmentCarriers?.find(
    (c) => c.id + "" === selectedShipmentCarrierId,
  )?.shipmentCarrier?.price?.value;
  return (
    <>
      <div className="space-y-3">
        <div className="flex justify-between">
          <Text variant={"uppercase"}>{t("subtotal")}:</Text>
          <Text>{order?.subtotal?.value || ""}</Text>
        </div>
        {(selectedShipmentCarrierPrice || promoFreeShipping) && (
          <div className="flex justify-between">
            <Text variant={"uppercase"}>{t("shipping summary")}:</Text>
            <Text>
              {promoFreeShipping
                ? t("free by promo")
                : selectedShipmentCarrierPrice}
            </Text>
          </div>
        )}
        {!!promoPercentageOff && (
          <div className="flex justify-between">
            <Text variant={"uppercase"}>{t("promo discount")}:</Text>
            <Text>{`${promoPercentageOff}%`}</Text>
          </div>
        )}

        <div className="pt-5">
          <div className="flex justify-between border-t border-textInactiveColor pt-3">
            <Text variant={"uppercase"}>{t("grand total")}:</Text>
            <Text>{order.totalSale?.value || ""}</Text>
          </div>
        </div>
      </div>
    </>
  );
}

interface PriceSummaryProps {
  form: UseFormReturn<any>;
  order?: ValidateOrderItemsInsertResponse;
}
