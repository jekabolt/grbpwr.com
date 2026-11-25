import type { SubscribeNewsletterRequest } from "@/api/proto-http/frontend";
import { EMAIL_PREFERENCES, SHOPPING_PREFERENCE_ENUM } from "@/constants";
import { z } from "zod";

const newsletterFormFields = z.object({
  email: z.string().optional(),
  name: z.string(),
  shoppingPreference: z.enum(SHOPPING_PREFERENCE_ENUM),
  subscribeNewsletter: z.boolean(),
  subscribeNewArrivals: z.boolean(),
  subscribeEvents: z.boolean(),
});

export const newsletterFormSchema = newsletterFormFields.transform(
  ({ email, name, ...rest }): SubscribeNewsletterRequest => ({
    ...rest,
    email: email?.trim() || undefined,
    name: name.trim() || undefined,
    // The signup site locale is filled in at submit time (the form schema has no
    // access to it); see the SubscribeNewsletter call in the form component.
    language: undefined,
  }),
);

export const newsletterDefaultValues: NewsletterFormInput = {
  email: "",
  name: "",
  shoppingPreference: EMAIL_PREFERENCES.all,
  subscribeNewsletter: true,
  subscribeNewArrivals: false,
  subscribeEvents: false,
};

export type NewsletterFormInput = z.input<typeof newsletterFormSchema>;
export type NewsletterFormValues = z.output<typeof newsletterFormSchema>;
