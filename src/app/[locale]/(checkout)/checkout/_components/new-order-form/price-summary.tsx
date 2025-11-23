import type { ValidateOrderItemsInsertResponse } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { useDataContext } from "@/components/contexts/DataContext";
import { Text } from "@/components/ui/text";

import { useVatCalculation } from "./hooks/useVatCalculation";

export function PriceSummary({ order, form, vatRate }: PriceSummaryProps) {
  const t = useTranslations("checkout");

  const { dictionary } = useDataContext();
  const { selectedCurrency } = useCurrency((state) => state);

  const currency = selectedCurrency;
  const currencySymbol =
    currencySymbols[currency] ||
    currencySymbols[dictionary?.baseCurrency || "EUR"];

  if (!order) return null;

  const promoPercentageOff = parseInt(order.promo?.discount?.value || "0");
  const promoFreeShipping = !!order.promo?.freeShipping;
  const selectedShipmentCarrierId = form.watch("shipmentCarrierId");
  const selectedCountry = form.watch("country");

  const selectedShipmentCarrierPrice = dictionary?.shipmentCarriers?.find(
    (c) => c.id + "" === selectedShipmentCarrierId,
  )?.prices?.[0]?.price?.value;

  const { vatAmount, taxLabel } = useVatCalculation({
    countryCode: selectedCountry,
    subtotal: order.subtotal?.value || "0",
    vatRate,
  });

  return (
    <>
      <div className="space-y-3">
        <div className="flex justify-between">
          <Text variant={"uppercase"}>{t("subtotal")}:</Text>
          <Text>{`${currencySymbol} ${order?.subtotal?.value || ""}`}</Text>
        </div>
        {(selectedShipmentCarrierPrice || promoFreeShipping) && (
          <div className="flex justify-between">
            <Text variant={"uppercase"}>{t("shipping summary")}:</Text>
            <Text>
              {promoFreeShipping
                ? t("free by promo")
                : `${currencySymbol} ${selectedShipmentCarrierPrice}`}
            </Text>
          </div>
        )}
        {!!promoPercentageOff && (
          <div className="flex justify-between">
            <Text variant={"uppercase"}>{t("promo discount")}:</Text>
            <Text>{`${promoPercentageOff}%`}</Text>
          </div>
        )}

        <div className="flex justify-between">
          <Text variant={"uppercase"}>{taxLabel}:</Text>
          <Text>{`${currencySymbol} ${vatAmount.toFixed(2)}`}</Text>
        </div>

        <div className="pt-5">
          <div className="flex justify-between border-t border-textInactiveColor pt-3">
            <Text variant={"uppercase"}>{t("grand total")}:</Text>
            <Text>{`${currencySymbol} ${order.totalSale?.value || ""}`}</Text>
          </div>
        </div>
      </div>
    </>
  );
}

interface PriceSummaryProps {
  form: UseFormReturn<any>;
  order?: ValidateOrderItemsInsertResponse;
  vatRate?: number;
}
