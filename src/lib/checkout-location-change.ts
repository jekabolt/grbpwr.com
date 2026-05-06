export const CHECKOUT_LOCATION_CHANGE_CANCELLED =
  "checkout:location-change-cancelled";

export function notifyCheckoutLocationChangeCancelled() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CHECKOUT_LOCATION_CHANGE_CANCELLED));
}
