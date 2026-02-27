import { pushCustomEvent } from "../utils";

interface FormStartEvent {
  form_id: string;
  form_name: string;
  page_path: string;
}

interface FormSubmitEvent {
  form_id: string;
  form_name: string;
  page_path: string;
}

interface PaymentFailedEvent {
  error_code: string;
  payment_type: string;
  order_value: number;
  currency: string;
  page_path: string;
}

export function sendFormStartEvent(data: FormStartEvent): void {
  pushCustomEvent("form_start", {
    form_id: data.form_id,
    form_name: data.form_name,
    page_path: data.page_path,
  });
}

export function sendFormSubmitEvent(data: FormSubmitEvent): void {
  pushCustomEvent("form_submit", {
    form_id: data.form_id,
    form_name: data.form_name,
    page_path: data.page_path,
  });
}

export function sendPaymentFailedEvent(data: PaymentFailedEvent): void {
  pushCustomEvent("payment_failed", {
    error_code: data.error_code,
    payment_type: data.payment_type,
    order_value: data.order_value,
    currency: data.currency,
    page_path: data.page_path,
  });
}
