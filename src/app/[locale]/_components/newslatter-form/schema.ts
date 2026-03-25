import { z } from "zod";

/** All optional: validation is done on submit with toasters (no Zod field errors). */
export const newsletterFormSchema = z.object({
  email: z.string().optional(),
  acceptTerms: z.boolean().optional(),
});

export const newsletterDefaultValues: NewsletterFormValues = {
  email: "",
  acceptTerms: false,
};

export type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;
