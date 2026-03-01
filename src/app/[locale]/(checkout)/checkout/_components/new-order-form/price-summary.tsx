import type { ValidateOrderItemsInsertResponse } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";
import { formatPrice } from "@/lib/currency";
import { isEuropeanCountry } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";

import { useDataContext } from "@/components/contexts/DataContext";
import { Text } from "@/components/ui/text";

import { useVatCalculation } from "./hooks/useVatCalculation";
import { getCarrierPriceForCurrency } from "./utils";

export function PriceSummary({ order, form, vatRate, orderCurrency }: PriceSummaryProps) {
  const t = useTranslations("checkout");

  const { dictionary } = useDataContext();

  const currency = orderCurrency || "EUR";
  const currencySymbol =
    currencySymbols[currency] ||
    currencySymbols[dictionary?.baseCurrency || "EUR"];

  const selectedShipmentCarrierId = form.watch("shipmentCarrierId");
  const selectedCountry = form.watch("country");

  const { vatAmount, taxLabel } = useVatCalculation({
    countryCode: selectedCountry,
    subtotal: order?.subtotal?.value || "0",
    vatRate,
  });

  if (!order) return null;

  const promoPercentageOff = parseInt(order.promo?.discount?.value || "0");
  const promoFreeShipping = !!order.promo?.freeShipping;

  const selectedCarrier = dictionary?.shipmentCarriers?.find(
    (c) => c.id + "" === selectedShipmentCarrierId,
  );
  const selectedShipmentCarrierPrice = selectedCarrier
    ? getCarrierPriceForCurrency(selectedCarrier, currency)
    : undefined;

  return (
    <>
      <div className="mt-4 space-y-3">
        <div className="flex justify-between">
          <Text variant={"uppercase"}>{t("subtotal")}:</Text>
          <Text>{formatPrice(order?.subtotal?.value || "0", currency, currencySymbol)}</Text>
        </div>
        {(selectedShipmentCarrierPrice || promoFreeShipping) && (
          <div className="flex justify-between">
            <Text variant={"uppercase"}>{t("shipping summary")}:</Text>
            <Text>
              {promoFreeShipping
                ? t("free by promo")
                : formatPrice(selectedShipmentCarrierPrice || "0", currency, currencySymbol)}
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
          <Text variant={"uppercase"}>{t(taxLabel)}:</Text>
          <Text>{formatPrice(vatAmount, currency, currencySymbol)}</Text>
        </div>

        <div className="pt-5">
          <div className="flex justify-between border-t border-textInactiveColor pt-3">
            <Text variant={"uppercase"}>{t("grand total")}:</Text>
            <div className="flex items-center gap-x-2">
              {isEuropeanCountry(selectedCountry || "") && (
                <Text variant="uppercase" className="text-textInactiveColor">
                  {t("incl")}
                </Text>
              )}
              <Text>{formatPrice(order.totalSale?.value || "0", currency, currencySymbol)}</Text>
            </div>
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
  orderCurrency?: string;
}
