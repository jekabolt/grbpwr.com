import { z } from "zod";

export const addToCartSchema = z.object({
  size: z.string(),
  color: z.string().optional(),
});

export type AddToCartData = z.infer<typeof addToCartSchema>;
