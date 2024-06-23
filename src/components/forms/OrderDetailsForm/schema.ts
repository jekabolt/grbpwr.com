import { z } from "zod";

export const orderDetailsSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  dateOfBirth: z.string(),
  subscribe: z.boolean(),
  country: z.string(),
  termsOfService: z.boolean().refine((v) => Boolean(v), {
    message: "You must agree to the terms of service",
  }),
});

export const defaultData = {
  name: "",
  email: "",
  dateOfBirth: "",
  subscribe: false,
  country: "",
};

export type OrderDetailsData = z.infer<typeof orderDetailsSchema>;
