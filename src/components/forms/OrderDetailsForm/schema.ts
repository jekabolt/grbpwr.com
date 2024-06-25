import { z } from "zod";

export const orderDetailsSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(5),
  subscribe: z.boolean().optional(),
  termsOfService: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms & conditions" }),
  }),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  country: z.string().min(2),
  state: z.string().optional(),
  city: z.string().min(2),
  address: z.string().min(10),
  additionalAddress: z.string().optional(),
  company: z.string().optional(),
  postalCode: z.string().min(2),
  shippingMethod: z.string(),

  dateOfBirth: z
    .string()
    .regex(/^\d{2}.\d{2}.\d{4}$/, {
      message: "Incorrect format",
    })
    .optional(),
});

export const defaultData = {
  name: "",
  email: "",
  dateOfBirth: "",
  subscribe: false,
  country: "",
};

export type OrderDetailsData = z.infer<typeof orderDetailsSchema>;
