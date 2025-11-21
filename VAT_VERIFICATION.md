# VAT Rate Verification Guide

This guide explains how to verify the correctness of VAT rates configured in the application.

## Quick Verification Methods

### 1. Browser Console (Easiest)

Open your browser console on any page and run:

```javascript
// Import the verification utilities
import { printAllVatRates, verifyCountryVatRate, getVatRateSummary } from '@/lib/vat-verification';

// Print all countries with VAT rates
printAllVatRates();

// Verify a specific country
verifyCountryVatRate('de'); // Germany
verifyCountryVatRate('fr'); // France
verifyCountryVatRate('us'); // United States

// Get summary statistics
getVatRateSummary();
```

### 2. Using the Constants Directly

```javascript
import { getAllCountriesWithVatRates, getVatRateByCountryCode } from '@/constants';

// Get all countries
const countries = getAllCountriesWithVatRates();
console.table(countries);

// Check specific country
const vatRate = getVatRateByCountryCode('de');
console.log('Germany VAT:', vatRate); // Should be 19
```

### 3. Programmatic Verification

```javascript
import { validateVatRate, getCountriesWithoutVatRates } from '@/constants';

// Validate a country
const result = validateVatRate('de');
console.log(result);

// Find countries without VAT rates
const missing = getCountriesWithoutVatRates();
console.log('Countries without VAT:', missing);
```

## Official Sources for Verification

### European Union
- **EU VAT Rates**: https://europa.eu/youreurope/business/taxation/vat/vat-rules-rates/index_en.htm
- **EU Commission**: https://ec.europa.eu/taxation_customs/business/vat/eu-vat-rates_en

### Global VAT Rates
- **Avalara VAT Live**: https://www.avalara.com/vatlive/en/vat-rates.html
- **World Tax**: https://www.worldtax.com/vat-rates

### Country-Specific Sources
- **Germany**: https://www.bundesfinanzministerium.de (19% standard rate)
- **France**: https://www.service-public.fr (20% standard rate)
- **Italy**: https://www.agenziaentrate.gov.it (22% standard rate)
- **Spain**: https://www.agenciatributaria.es (21% standard rate)
- **UK**: https://www.gov.uk/vat-rates (20% standard rate)

## Common VAT Rates Reference

### European Union (Standard Rates)
- **Germany**: 19%
- **France**: 20%
- **Italy**: 22%
- **Spain**: 21%
- **UK**: 20%
- **Austria**: 20%
- **Belgium**: 21%
- **Netherlands**: 21%
- **Poland**: 23%
- **Portugal**: 23%
- **Greece**: 24%
- **Denmark**: 25%
- **Sweden**: 25%
- **Finland**: 24%
- **Czech Republic**: 21%
- **Hungary**: 27%
- **Romania**: 19%
- **Bulgaria**: 20%
- **Croatia**: 25%
- **Slovakia**: 20%
- **Slovenia**: 22%
- **Estonia**: 20%
- **Latvia**: 21%
- **Lithuania**: 21%
- **Luxembourg**: 17%
- **Malta**: 18%
- **Cyprus**: 19%

### Non-EU Europe
- **Switzerland**: 7.7%
- **Norway**: 25%
- **Iceland**: 24%
- **Turkey**: 20%

### Americas
- **Canada**: 0% (GST/HST varies by province: 5-15%)
- **United States**: 0% (Sales tax varies by state: 0-10%)
- **Chile**: 19%
- **Mexico**: 16%

### Asia Pacific
- **Japan**: 10%
- **China**: 13%
- **South Korea**: 10%
- **Singapore**: 8% (GST)
- **Australia**: 10% (GST)
- **New Zealand**: 15% (GST)
- **India**: 18% (GST)
- **Thailand**: 7%
- **Taiwan**: 5%
- **Malaysia**: 6% (SST)
- **Hong Kong**: 0%
- **Macau**: 0%

### Middle East
- **UAE**: 5%
- **Saudi Arabia**: 15%
- **Bahrain**: 10%
- **Israel**: 17%
- **Kuwait**: 0% (VAT not implemented)
- **Qatar**: 0% (VAT not implemented)

### Africa
- **South Africa**: 15%

## Verification Checklist

- [ ] All EU countries have VAT rates configured
- [ ] VAT rates match official government sources
- [ ] Countries with 0% VAT are correctly marked (e.g., US, Hong Kong)
- [ ] No countries have unrealistic VAT rates (>30% or <0%)
- [ ] All countries in COUNTRIES_BY_REGION have vatRate field (even if undefined)
- [ ] Duplicate country entries (different languages) have same VAT rate

## Testing VAT Calculation

```javascript
// Test VAT calculation
function testVatCalculation(price, vatRate) {
  const vatAmount = (price * vatRate) / (100 + vatRate);
  const priceExcludingVat = price - vatAmount;
  
  console.log(`Price including VAT: ${price}€`);
  console.log(`VAT Rate: ${vatRate}%`);
  console.log(`VAT Amount: ${vatAmount.toFixed(2)}€`);
  console.log(`Price excluding VAT: ${priceExcludingVat.toFixed(2)}€`);
  console.log(`Verification: ${priceExcludingVat + vatAmount}€ = ${price}€`);
}

// Example: 100€ with 19% VAT (Germany)
testVatCalculation(100, 19);
// Should output:
// Price including VAT: 100€
// VAT Rate: 19%
// VAT Amount: 15.97€
// Price excluding VAT: 84.03€
// Verification: 100.00€ = 100€
```

## Notes

- VAT rates are subject to change by governments
- Some countries have reduced rates for specific products (not implemented here)
- US and Canada don't have federal VAT, but have state/provincial taxes
- Some countries may have different rates for digital vs physical goods
- Always verify with official government sources before production use

