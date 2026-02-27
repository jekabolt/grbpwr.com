import { pushCustomEvent, pushToDataLayer } from "../utils";

interface NewsletterFormData {
  email: string;
  formId?: string;
}

interface GenerateLeadData {
  currency: string;
  value: number;
  lead_source: string;
}

interface NewsletterSignupData {
  signup_location: string;
  page_path: string;
}

export function sendFormEvent(data: NewsletterFormData) {
  pushCustomEvent("form_submission", {
    form_id: data.formId,
    form_data: {
      email: data.email,
      email_domain: data.email.split("@")[1] || "",
    },
  });
}

export function sendGenerateLeadEvent(data: GenerateLeadData) {
  pushToDataLayer({
    event: "generate_lead",
    ecommerce: {
      currency: data.currency,
      value: data.value,
      lead_source: data.lead_source,
    },
  });
}

export function sendNewsletterSignupEvent(data: NewsletterSignupData) {
  pushCustomEvent("newsletter_signup", {
    signup_location: data.signup_location,
    page_path: data.page_path,
  });
}
