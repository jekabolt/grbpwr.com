import { CheckoutData } from "../schema";

// 1st
export const CONTACT_GROUP_FIELDS = ["email", "phone", "subscribe", "termsOfService"];

// 2nd
export const SHIPPING_GROUP_FIELDS = [
  "firstName",
  "lastName",
  "country",
  "state",
  "city",
  "address",
  "additionalAddress",
  "company",
  "postalCode",
  "shipmentCarrierId",
];

// 4th
export const PAYMENT_GROUP_FIELDS = [
  "paymentMethod",
  "billingAddressIsSameAsAddress",
  "billingAddress",
];


export type OpenGroups = "contact" | "shipping" | "payment";

export const GROUP_FIELDS: Record<OpenGroups, Array<keyof CheckoutData>> = {
  contact: CONTACT_GROUP_FIELDS as Array<keyof CheckoutData>,
  shipping: SHIPPING_GROUP_FIELDS as Array<keyof CheckoutData>,
  payment: [],
};
