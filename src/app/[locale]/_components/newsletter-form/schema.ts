import { EMAIL_PREFERENCES, SHOPPING_PREFERENCE_ENUM } from "@/constants";
import { z } from "zod";

export const newsletterFormSchema = z.object({
  email: z.string().optional(),
  firstName: z.string(),
  shoppingPreference: z.enum(SHOPPING_PREFERENCE_ENUM),
  subscribeNewArrivals: z.boolean(),
  subscribeEvents: z.boolean(),
});

export const newsletterDefaultValues: NewsletterFormValues = {
  email: "",
  firstName: "",
  shoppingPreference: EMAIL_PREFERENCES.all,
  subscribeNewArrivals: false,
  subscribeEvents: false,

};

export type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;
