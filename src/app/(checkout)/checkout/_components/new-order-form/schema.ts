import { z } from "zod";

const addressFields = {
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  country: z.string().min(2),
  state: z.string().optional(),
  city: z.string().min(2),
  address: z.string().min(10),
  additionalAddress: z.string().optional(),
  company: z.string().optional(),
  postalCode: z.string().min(2),
};

// const creditCardFields = {
//   number: z.string().length(19),
//   fullName: z.string().min(3),
//   expirationDate: z.string().length(5),
//   cvc: z.string().length(3),
// };

const baseCheckoutSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(5),
  subscribe: z.boolean().optional(),
  termsOfService: z.boolean().refine(Boolean, {
    message: "You must accept the terms & conditions",
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
