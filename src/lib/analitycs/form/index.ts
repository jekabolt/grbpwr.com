import { pushCustomEvent, pushToDataLayer } from "../utils";

interface FormEventData {
  formId: string;
  email?: string;
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
  pushCustomEvent("newsletter_signup", {
    signup_location: data.signup_location,
    page_path: data.page_path,
  });
}

export function sendFormEvent(data: FormEventData) {
  if (typeof window === "undefined") return;

  pushCustomEvent("form_submit", {
    form_id: data.formId,
    form_name: data.formId,
    page_path: window.location.pathname,
    ...(data.email && { email: data.email }),
  });
}
