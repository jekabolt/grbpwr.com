import { PaymentMethod } from "@/api/proto-http/common";
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

const baseCheckoutSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(5),
  subscribe: z.boolean().optional(),
  termsOfService: z.boolean().refine(Boolean, {
    message: "You must accept the terms & conditions",
  }),
  ...addressFields,
  shippingMethod: z.string().min(1),

  billingAddressIsSameAsAddress: z.boolean(),
  billingAddress: z.object(addressFields).optional(),

  rememberMe: z.boolean().optional(),
});

export const checkoutSchema = z.discriminatedUnion("paymentMethod", [
  baseCheckoutSchema.extend({
    paymentMethod: z.literal("PAYMENT_METHOD_NAME_ENUM_ETH"),
  }),
  baseCheckoutSchema.extend({
    paymentMethod: z.literal("PAYMENT_METHOD_NAME_ENUM_USDT_TRON"),
  }),
  baseCheckoutSchema.extend({
    paymentMethod: z.literal("PAYMENT_METHOD_NAME_ENUM_USDT_SHASTA"),
  }),
  baseCheckoutSchema.extend({
    paymentMethod: z.literal("PAYMENT_METHOD_NAME_ENUM_CARD"),
    creditCard: z.object({
      // todo: add validation of the mask
      // reuse same mask constant for inout and for schema
      number: z.string().length(19),
      fullName: z.string().min(3),
      expirationDate: z.string().length(5),
      cvc: z.string().length(3),
    }),
  }),
]);

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
  shippingMethod: "",
  subscribe: false,
  billingAddressIsSameAsAddress: true,
  billingAddress: undefined,
  paymentMethod: "PAYMENT_METHOD_NAME_ENUM_CARD",
  creditCard: {
    number: "",
    fullName: "",
    expirationDate: "",
    cvc: "",
  },
  rememberMe: false, // todo: groom the feature
};

export type CheckoutData = z.infer<typeof checkoutSchema>;
