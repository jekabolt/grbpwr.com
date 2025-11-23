import { getVatRateByCountryCode } from "@/constants";
import { calculateVatFromInclusivePrice } from "@/lib/utils";

interface UseVatCalculationProps {
    countryCode?: string;
    subtotal: string | number;
    vatRate?: number; // Optional override VAT rate
}


export function useVatCalculation({
    countryCode,
    subtotal,
    vatRate,
}: UseVatCalculationProps): {
    vatAmount: number;
    taxLabel: "vat" | "sales tax";
} {
    const countryVatRate = countryCode
        ? getVatRateByCountryCode(countryCode)
        : undefined;
    const effectiveVatRate = vatRate ?? countryVatRate;

    const hasVat = effectiveVatRate !== undefined && effectiveVatRate > 0;

    const subtotalPrice =
        typeof subtotal === "string" ? parseFloat(subtotal) : subtotal;
    const vatAmount = effectiveVatRate
        ? calculateVatFromInclusivePrice(subtotalPrice, effectiveVatRate)
        : 0;

    const taxLabel: "vat" | "sales tax" = hasVat ? "vat" : "sales tax";

    return {
        vatAmount,
        taxLabel,
    };
}

