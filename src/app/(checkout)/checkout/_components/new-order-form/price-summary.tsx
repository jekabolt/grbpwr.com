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
          <div>{convertPrice(order?.subtotal?.value || "")}</div>
        </div>
        {(selectedShipmentCarrierPrice || promoFreeShipping) && (
          <div className="flex justify-between">
            <Text variant={"uppercase"}>shipping:</Text>
            <div>
              {promoFreeShipping
                ? "free by promo"
                : selectedShipmentCarrierPrice}
            </div>
          </div>
        )}
        {!!promoPercentageOff && (
          <div className="flex justify-between">
            <Text variant={"uppercase"}>promo discount:</Text>
            <div>{`${promoPercentageOff}%`}</div>
          </div>
        )}

        <div className="pt-5">
          <div className="flex justify-between border-t border-dashed border-textInactiveColor pt-3">
            <Text variant={"uppercase"}>grand total:</Text>
            <div>{convertPrice(order.totalSale?.value || "")} </div>
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
