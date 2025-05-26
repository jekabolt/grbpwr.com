import { z } from "zod";
import { errorMessages } from "./error-messages";

const addressFields = {
  firstName: z.string().min(1, errorMessages.firstName.min).max(40, errorMessages.firstName.max).regex(errorMessages.firstName.regex.restriction, errorMessages.firstName.regex.message),
  lastName: z.string().min(1, errorMessages.lastName.min).max(40, errorMessages.lastName.max).regex(errorMessages.lastName.regex.restriction, errorMessages.lastName.regex.message),
  country: z.string().min(2, errorMessages.country.min),
  state: z.string().optional(),
  city: z.string().min(2, errorMessages.city.min).regex(errorMessages.city.regex.restriction, errorMessages.city.regex.message),
  address: z.string().min(10, errorMessages.address.min).max(40, errorMessages.address.max).regex(errorMessages.address.regex.restriction, errorMessages.address.regex.message),
  additionalAddress: z.string().min(10, errorMessages.address.min).max(40, errorMessages.address.max).regex(errorMessages.address.regex.restriction, errorMessages.address.regex.message).optional(),
  company: z.string().min(1, errorMessages.company.min).max(40, errorMessages.company.max).optional(),
  phone: z.string().min(5, errorMessages.phone.min).max(15, errorMessages.phone.max),
  postalCode: z.string().min(2, errorMessages.postalCode.min).max(12, errorMessages.postalCode.max).regex(errorMessages.postalCode.regex.restriction, errorMessages.postalCode.regex.message),
};

// const creditCardFields = {
//   number: z.string().length(19),
//   fullName: z.string().min(3),
//   expirationDate: z.string().length(5),
//   cvc: z.string().length(3),
// };

const baseCheckoutSchema = z.object({
  email: z.string().max(40, errorMessages.email.max).email(errorMessages.email.invalid),
  subscribe: z.boolean().optional(),
  termsOfService: z.boolean().refine(Boolean, {
    message: "you must accept the terms & conditions",
  }),
  ...addressFields,
  shipmentCarrierId: z.string().min(1),
  promoCode: z.string().optional(),

  billingAddressIsSameAsAddress: z.boolean(),
  billingAddress: z.object(addressFields).optional(),

  rememberMe: z.boolean().optional(),
  paymentMethod: z.union([
    z.literal("PAYMENT_METHOD_NAME_ENUM_ETH"),
    z.literal("PAYMENT_METHOD_NAME_ENUM_USDT_TRON"),
    z.literal("PAYMENT_METHOD_NAME_ENUM_USDT_SHASTA"),
    z.literal("PAYMENT_METHOD_NAME_ENUM_CARD_TEST"),
    z.literal("PAYMENT_METHOD_NAME_ENUM_CARD"),
  ]),
});

export const checkoutSchema = baseCheckoutSchema;

export const defaultData: z.infer<typeof checkoutSchema> = {
  email: "",
  phone: "",
  termsOfService: false,
  firstName: "",
  lastName: "",
  country: "",
  state: "",
  city: "",
  address: "",
  additionalAddress: "",
  company: "",
  postalCode: "",
  shipmentCarrierId: "",
  subscribe: false,
  billingAddressIsSameAsAddress: true,
  billingAddress: undefined,
  paymentMethod: "PAYMENT_METHOD_NAME_ENUM_CARD_TEST",
  // creditCard: {
  //   number: "4242424242424242",
  //   fullName: "wdwd wdwd",
  //   expirationDate: "11/30",
  //   cvc: "122",
  // },
  rememberMe: false, // todo: groom the feature
  promoCode: "",
};

export type CheckoutData = z.infer<typeof checkoutSchema>;
