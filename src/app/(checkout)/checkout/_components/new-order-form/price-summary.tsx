import type { ValidateOrderItemsInsertResponse } from "@/api/proto-http/frontend";
import { UseFormReturn } from "react-hook-form";

import { useDataContext } from "@/components/DataContext";
import { Text } from "@/components/ui/text";

export function PriceSummary({ order, form }: PriceSummaryProps) {
  const { dictionary } = useDataContext();

  console.log(order);
  if (!order) return null;

  const promoPercentageOff = parseInt(order.promo?.discount?.value || "0");
  const promoFreeShipping = !!order.promo?.freeShipping;
  const selectedShipmentCarrierId = form.watch("shipmentCarrierId");

  const selectedShipmentCarrierPrice = dictionary?.shipmentCarriers?.find(
    (c) => c.id + "" === selectedShipmentCarrierId,
  )?.shipmentCarrier?.price?.value;

  console.log(dictionary?.shipmentCarriers, selectedShipmentCarrierId);

  return (
    <>
      <div className="space-y-3">
        <div className="flex justify-between">
          <Text variant={"uppercase"}>subtotal:</Text>
          <div>{order?.subtotal?.value}</div>
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
            <div>{order.totalSale?.value} </div>
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
