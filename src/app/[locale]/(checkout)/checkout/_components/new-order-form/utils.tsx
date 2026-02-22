import {
  common_AddressInsert,
  common_BuyerInsert,
  common_OrderItemInsert,
  common_OrderNew,
  common_ShipmentCarrier,
  common_ShipmentCarrierPrice,
  common_ShippingRegion,
} from "@/api/proto-http/frontend";
import { COUNTRIES_BY_REGION } from "@/constants";

import { CheckoutData } from "./schema";

const REGION_TO_SHIPPING_REGION: Record<string, common_ShippingRegion> = {
  AFRICA: "SHIPPING_REGION_AFRICA",
  AMERICAS: "SHIPPING_REGION_AMERICAS",
  "ASIA PACIFIC": "SHIPPING_REGION_ASIA_PACIFIC",
  EUROPE: "SHIPPING_REGION_EUROPE",
  "MIDDLE EAST": "SHIPPING_REGION_MIDDLE_EAST",
};

const COUNTRY_TO_SHIPPING_REGION = (() => {
  const map = new Map<string, common_ShippingRegion>();
  for (const [regionKey, countries] of Object.entries(COUNTRIES_BY_REGION)) {
    const shippingRegion = REGION_TO_SHIPPING_REGION[regionKey];
    if (shippingRegion) {
      for (const c of countries) {
        map.set(c.countryCode.toLowerCase(), shippingRegion);
      }
    }
  }
  return map;
})();

export function getShippingRegionForCountry(
  countryCode: string,
): common_ShippingRegion | undefined {
  return countryCode
    ? COUNTRY_TO_SHIPPING_REGION.get(countryCode.toLowerCase())
    : undefined;
}

export function isCarrierEligibleForRegion(
  carrier: common_ShipmentCarrier,
  region: common_ShippingRegion | undefined,
): boolean {
  const allowedRegions = carrier.allowedRegions;
  if (!allowedRegions || allowedRegions.length === 0) return false; // not set = not eligible
  if (!region) return false; // country not in map
  return allowedRegions.includes(region);
}

/** Get carrier price for given currency. Falls back to first price if no match. */
export function getCarrierPriceForCurrency(
  carrier: common_ShipmentCarrier,
  currency: string,
): string | undefined {
  const prices = carrier.prices;
  if (!prices?.length) return undefined;
  const key = currency?.toUpperCase() || "";
  const match = prices.find(
    (p: common_ShipmentCarrierPrice) =>
      p.currency?.toUpperCase() === key,
  );
  return match?.price?.value ?? prices[0]?.price?.value;
}

export function getFieldName(
  prefix: string | undefined,
  field: string,
): string {
  return prefix ? `${prefix}.${field}` : field;
}

export function mapFormFieldToOrderDataFormat(
  data: CheckoutData,
  orderItems: common_OrderItemInsert[],
  currency: string,
) {
  const shippingAddress: common_AddressInsert = {
    addressLineOne: data.address,
    addressLineTwo: data.additionalAddress,
    company: data.company,
    city: data.city,
    state: data.state,
    // country: data.country,
    country: data.country,
    postalCode: data.postalCode,
  };

  const billingAddress: common_AddressInsert | undefined =
    data.billingAddressIsSameAsAddress
      ? shippingAddress
      : data.billingAddress
        ? {
            addressLineOne: data.billingAddress.address,
            addressLineTwo: data.billingAddress.additionalAddress,
            company: data.billingAddress.company,
            city: data.billingAddress.city,
            state: data.billingAddress.state,
            country: data.country,
            // country: data.billingAddress.country,
            postalCode: data.billingAddress.postalCode,
          }
        : undefined;

  const buyer: common_BuyerInsert = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    receivePromoEmails: data.subscribe,
  };

  const newOrderData: common_OrderNew = {
    items: orderItems,
    shippingAddress,
    billingAddress,
    buyer,
    paymentMethod: data.paymentMethod,
    shipmentCarrierId: parseInt(data.shipmentCarrierId),
    promoCode: data.promoCode,
    currency,
  };

  return newOrderData;
}

export function getUniqueCountries() {
  const countries = Object.values(COUNTRIES_BY_REGION).flat();
  const countryMap = new Map();

  for (const country of countries) {
    const key = country.countryCode;
    const existing = countryMap.get(key);

    if (!existing || (existing.lng !== "en" && country.lng === "en")) {
      countryMap.set(key, country);
    }
  }

  return Array.from(countryMap.values());
}

export function findCountryByCode(
  countries: ReturnType<typeof getUniqueCountries>,
  countryCode: string,
) {
  return countries.find(
    (c) => c.countryCode.toLowerCase() === countryCode.toLowerCase(),
  );
}
