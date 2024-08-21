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

export const checkoutSchema = z.object({
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

  paymentMethod: z.string(),
  creditCard: z
    .object({
      // todo: add validation of the mask
      // reuse same mask constant for inout and for schema
      number: z.string().length(19),
      fullName: z.string().min(3),
      expirationDate: z.string().length(5),
      cvc: z.string().length(3),
    })
    .optional(),

  rememberMe: z.boolean().optional(),

  promoCode: z.string().optional(),
});

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
  paymentMethod: "card",
  creditCard: undefined,
  rememberMe: false, // todo: groom the feature
  promoCode: "",
};

export type CheckoutData = z.infer<typeof checkoutSchema>;
