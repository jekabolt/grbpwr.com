import type { ValidateOrderItemsInsertResponse } from "@/api/proto-http/frontend";
import { UseFormReturn } from "react-hook-form";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { useDataContext } from "@/components/contexts/DataContext";
import { Text } from "@/components/ui/text";

export function PriceSummary({ order, form }: PriceSummaryProps) {
  const { dictionary } = useDataContext();
  const { convertPrice } = useCurrency((state) => state);
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
          <Text variant={"uppercase"}>subtotal:</Text>
          <Text>{convertPrice(order?.subtotal?.value || "")}</Text>
        </div>
        {(selectedShipmentCarrierPrice || promoFreeShipping) && (
          <div className="flex justify-between">
            <Text variant={"uppercase"}>shipping:</Text>
            <Text>
              {promoFreeShipping
                ? "free by promo"
                : selectedShipmentCarrierPrice}
            </Text>
          </div>
        )}
        {!!promoPercentageOff && (
          <div className="flex justify-between">
            <Text variant={"uppercase"}>promo discount:</Text>
            <Text>{`${promoPercentageOff}%`}</Text>
          </div>
        )}

        <div className="pt-5">
          <div className="flex justify-between border-t border-textInactiveColor pt-3">
            <Text variant={"uppercase"}>grand total:</Text>
            <Text>{convertPrice(order.totalSale?.value || "")}</Text>
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
