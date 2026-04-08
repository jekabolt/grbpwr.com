import { z } from "zod";

export const newsletterFormSchema = z.object({
  email: z.string().optional(),
});

export const newsletterDefaultValues: NewsletterFormValues = {
  email: "",
};

export type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;
