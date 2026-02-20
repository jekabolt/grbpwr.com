/**
 * Manages idempotency keys for checkout sessions.
 * Keys are server-generated and returned in ValidateOrderItemsInsert responses.
 * The client stores and sends them for retries and refreshes.
 */

const STORAGE_KEY = "checkout-idempotency-key";

/**
 * Gets the stored idempotency key from localStorage, or null if none exists.
 */
export function getStoredIdempotencyKey(): string | null {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return typeof stored === "string" && stored.length > 0 ? stored : null;
    } catch (error) {
        console.error("Error accessing localStorage for idempotency key:", error);
        return null;
    }
}

/**
 * Stores the idempotency key from the server response.
 * Call when ValidateOrderItemsInsert returns idempotency_key for CARD/CARD_TEST.
 */
export function setIdempotencyKey(key: string): void {
    if (typeof window === "undefined") {
        return;
    }

    try {
        localStorage.setItem(STORAGE_KEY, key);
    } catch (error) {
        console.error("Error storing idempotency key in localStorage:", error);
    }
}

/**
 * Clears the idempotency key from storage.
 * Call after successful payment or when "Payment already completed" error occurs.
 */
export function clearIdempotencyKey(): void {
    if (typeof window === "undefined") {
        return;
    }

    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error("Error clearing idempotency key from localStorage:", error);
    }
}
