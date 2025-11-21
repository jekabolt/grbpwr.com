import type { ValidateOrderItemsInsertResponse } from "@/api/proto-http/frontend";
import { currencySymbols, getVatRateByCountryCode } from "@/constants";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { useDataContext } from "@/components/contexts/DataContext";
import { Text } from "@/components/ui/text";

/**
 * Calculate VAT amount from a price that includes VAT
 * @param priceIncludingVat - The total price including VAT
 * @param vatRate - VAT rate as percentage (e.g., 19 for 19%)
 * @returns The VAT amount
 */
function calculateVatFromInclusivePrice(
  priceIncludingVat: string | number,
  vatRate: number,
): number {
  const price =
    typeof priceIncludingVat === "string"
      ? parseFloat(priceIncludingVat)
      : priceIncludingVat;

  if (isNaN(price) || price === 0) return 0;

  // Formula: VAT = Price × (VAT Rate / (100 + VAT Rate))
  return (price * vatRate) / (100 + vatRate);
}

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

  // Get VAT rate from country or use provided vatRate prop
  const countryVatRate = selectedCountry
    ? getVatRateByCountryCode(selectedCountry)
    : undefined;
  const effectiveVatRate = vatRate ?? countryVatRate;

  // Check if VAT exists (VAT exists if rate is defined and > 0)
  const hasVat = effectiveVatRate !== undefined && effectiveVatRate > 0;

  // Calculate VAT from subtotal (products only, excluding shipping)
  // Shipping may or may not be subject to VAT depending on jurisdiction
  const subtotalPrice = parseFloat(order.subtotal?.value || "0");
  const vatAmount = effectiveVatRate
    ? calculateVatFromInclusivePrice(subtotalPrice, effectiveVatRate)
    : 0;

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
          <Text variant={"uppercase"}>
            {`${!hasVat ? "sales tax" : "vat"}`}:
          </Text>
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
  vatRate?: number; // VAT rate as percentage (e.g., 19 for 19%)
}
