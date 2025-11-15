import {
  common_AddressInsert,
  common_BuyerInsert,
  common_OrderItemInsert,
  common_OrderNew,
} from "@/api/proto-http/frontend";
import { COUNTRIES_BY_REGION } from "@/constants";

import { Dhl } from "@/components/ui/icons/dhl";
import { Text } from "@/components/ui/text";

import { CheckoutData } from "./schema";

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

export const createShipmentCarrierIcon = (
  carrier: string,
  price: number,
  currency: string,
): React.ReactNode => {
  const carrierName = carrier.toLowerCase();

  switch (carrierName) {
    case "dhl":
      return (
        <div className="flex items-center justify-between gap-x-2">
          <Dhl className="h-6" />
          <Text>{`${price} ${currency}`}</Text>
        </div>
      );
    default:
      return null;
  }
};

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
