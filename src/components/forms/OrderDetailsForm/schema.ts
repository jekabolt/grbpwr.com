import { z } from "zod";

export const orderDetailsSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  dateOfBirth: z.string().regex(/^\d{2}.\d{2}.\d{4}$/, {
    message: "Incorrect format",
  }),
  subscribe: z.boolean(),
  country: z.string(),
  termsOfService: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms & conditions" }),
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
