import { pushCustomEvent } from "../utils";

interface FormEventData {
  formId: string;
}

interface NewsletterSignupData {
  signup_location: string;
  page_path: string;
}

export function sendNewsletterSignupEvent(data: NewsletterSignupData) {
  pushCustomEvent("newsletter_signup", {
    signup_location: data.signup_location,
    page_path: data.page_path,
  });
}

export function sendFormEvent(data: FormEventData) {
  if (typeof window === "undefined") return;

  // Never attach the email — GA4 forbids PII in event params. (The page_path is
  // scrubbed of any email in pushCustomEvent.)
  pushCustomEvent("form_submit", {
    form_id: data.formId,
    form_name: data.formId,
    page_path: window.location.pathname,
  });
}
