/**
 * VAT Rate Verification Utility
 * 
 * This file provides utilities to verify and validate VAT rates.
 * 
 * To verify VAT rates:
 * 1. Run: console.log(getAllCountriesWithVatRates()) in browser console
 * 2. Or use the validation functions to check specific countries
 * 3. Compare with official sources:
 *    - EU: https://europa.eu/youreurope/business/taxation/vat/vat-rules-rates/index_en.htm
 *    - Global: https://www.avalara.com/vatlive/en/vat-rates.html
 */

import {
    getAllCountriesWithVatRates,
    getCountriesWithoutVatRates,
    getVatRateByCountryCode,
    validateVatRate,
} from "@/constants";

/**
 * Print all countries with VAT rates to console
 * Useful for verification and debugging
 */
export function printAllVatRates() {
    const countries = getAllCountriesWithVatRates();

    console.group("🌍 VAT Rates by Country");
    console.table(
        countries.map((c) => ({
            Country: c.name,
            Code: c.countryCode.toUpperCase(),
            "VAT Rate": c.vatRate !== undefined ? `${c.vatRate}%` : "Not set",
            Region: c.region,
        })),
    );
    console.groupEnd();

    const missing = getCountriesWithoutVatRates();
    if (missing.length > 0) {
        console.group("⚠️ Countries without VAT rates");
        console.table(missing.map((c) => ({
            Country: c.name,
            Code: c.countryCode.toUpperCase(),
            Region: c.region,
        })));
        console.groupEnd();
    }

    return countries;
}

/**
 * Verify VAT rate for a specific country
 * @param countryCode - ISO country code (e.g., "de", "fr")
 */
export function verifyCountryVatRate(countryCode: string) {
    const validation = validateVatRate(countryCode);
    const vatRate = getVatRateByCountryCode(countryCode);

    console.group(`🔍 VAT Verification: ${countryCode.toUpperCase()}`);
    console.log("Validation:", validation.message);
    if (vatRate !== undefined) {
        console.log("VAT Rate:", `${vatRate}%`);
        console.log(
            "Calculation Example:",
            `100€ with ${vatRate}% VAT = ${((100 * vatRate) / (100 + vatRate)).toFixed(2)}€ VAT`,
        );
    }
    console.groupEnd();

    return validation;
}

/**
 * Get summary statistics about VAT rates
 */
export function getVatRateSummary() {
    const countries = getAllCountriesWithVatRates();
    const withVat = countries.filter((c) => c.vatRate !== undefined);
    const withoutVat = countries.filter((c) => c.vatRate === undefined);
    const vatRates = withVat
        .map((c) => c.vatRate!)
        .filter((rate) => rate > 0);

    const stats = {
        total: countries.length,
        withVatRate: withVat.length,
        withoutVatRate: withoutVat.length,
        averageVatRate:
            vatRates.length > 0
                ? (vatRates.reduce((a, b) => a + b, 0) / vatRates.length).toFixed(2)
                : 0,
        minVatRate: vatRates.length > 0 ? Math.min(...vatRates) : 0,
        maxVatRate: vatRates.length > 0 ? Math.max(...vatRates) : 0,
    };

    console.group("📊 VAT Rate Statistics");
    console.log(stats);
    console.groupEnd();

    return stats;
}

/**
 * Compare VAT rates with expected values
 * Useful for bulk verification
 * @param expectedRates - Object mapping country codes to expected VAT rates
 */
export function compareVatRates(expectedRates: Record<string, number>) {
    const mismatches: Array<{
        countryCode: string;
        expected: number;
        actual: number | undefined;
    }> = [];

    Object.entries(expectedRates).forEach(([countryCode, expected]) => {
        const actual = getVatRateByCountryCode(countryCode);
        if (actual !== expected) {
            mismatches.push({ countryCode, expected, actual });
        }
    });

    if (mismatches.length > 0) {
        console.group("❌ VAT Rate Mismatches");
        console.table(mismatches);
        console.groupEnd();
    } else {
        console.log("✅ All VAT rates match expected values");
    }

    return mismatches;
}

// Example usage (uncomment to run in browser console):
// import { printAllVatRates, verifyCountryVatRate, getVatRateSummary } from '@/lib/vat-verification';
// printAllVatRates();
// verifyCountryVatRate('de');
// getVatRateSummary();

