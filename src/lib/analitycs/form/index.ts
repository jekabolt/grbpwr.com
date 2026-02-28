import { pushToDataLayer } from "../utils";

interface GenerateLeadData {
  currency: string;
  value: number;
  lead_source: string;
}

interface NewsletterSignupData {
  signup_location: string;
  page_path: string;
}

interface FormEventData {
  email: string;
  formId: string;
}

export function sendFormEvent(data: FormEventData) {
  pushToDataLayer({
    event: "form_submit",
    ecommerce: {
      currency: "EUR",
      email: data.email,
      form_id: data.formId,
    },
  });
}

export function sendGenerateLeadEvent(data: GenerateLeadData) {
  pushToDataLayer({
    event: "generate_lead",
    ecommerce: {
      currency: data.currency,
      value: Math.max(0, data.value),
      lead_source: data.lead_source,
    },
  });
}

export function sendNewsletterSignupEvent(data: NewsletterSignupData) {
  pushToDataLayer({
    event: "newsletter_signup",
    ecommerce: {
      currency: "EUR",
      signup_location: data.signup_location,
      page_path: data.page_path,
    },
  });
}
