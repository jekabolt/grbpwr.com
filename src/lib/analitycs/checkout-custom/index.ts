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
  error_code: string | object;
  payment_type: string;
  order_value: number;
  currency: string;
  page_path: string;
  /** Order UUID for joining with purchase / recovery funnels */
  transaction_id?: string;
}

const FORM_START_KEY = "ga4_form_started";

export function sendFormStartEvent(data: FormStartEvent): void {
  if (typeof window === "undefined") return;

  const storageKey = `${FORM_START_KEY}_${data.form_id}`;
  if (sessionStorage.getItem(storageKey)) return;

  sessionStorage.setItem(storageKey, "true");

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
  const errorCode = typeof data.error_code === "object"
    ? (data.error_code as any)?.message || JSON.stringify(data.error_code)
    : String(data.error_code || "unknown");

  pushCustomEvent("payment_failed", {
    error_code: errorCode,
    payment_type: data.payment_type,
    order_value: Math.max(0, data.order_value || 0),
    currency: data.currency,
    page_path: data.page_path,
    ...(data.transaction_id && { transaction_id: data.transaction_id }),
  });
}

interface FormErrorEvent {
  form_id: string;
  form_name: string;
  error_fields: string[];
  page_path: string;
}

export function sendFormErrorEvent(data: FormErrorEvent): void {
  pushCustomEvent("form_error", {
    form_id: data.form_id,
    form_name: data.form_name,
    error_fields: data.error_fields.join(","),
    error_count: data.error_fields.length,
    page_path: data.page_path,
  });
}
