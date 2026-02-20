/**
 * Tracks whether the initial checkout validation has run this session.
 * Used to ensure only one validate-items request on checkout page load.
 */

let checkoutInitialValidationDone = false;

export function hasCheckoutInitialValidationRun(): boolean {
  return checkoutInitialValidationDone;
}

export function setCheckoutInitialValidationDone(): void {
  checkoutInitialValidationDone = true;
}

export function resetCheckoutValidationState(): void {
  checkoutInitialValidationDone = false;
}
