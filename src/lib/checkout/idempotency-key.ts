/**
 * Manages idempotency keys for checkout sessions.
 * The key associates pre-orders with payment intent IDs on the backend.
 */

const STORAGE_KEY = "checkout-idempotency-key";

/**
 * Generates a new UUID v4 idempotency key
 */
function generateIdempotencyKey(): string {
    return crypto.randomUUID();
}

/**
 * Gets the current idempotency key from storage, or creates a new one if it doesn't exist
 */
export function getOrCreateIdempotencyKey(): string {
    if (typeof window === "undefined") {
        // Server-side: generate a temporary key (won't be persisted)
        return generateIdempotencyKey();
    }

    try {
        const existingKey = localStorage.getItem(STORAGE_KEY);
        if (existingKey) {
            return existingKey;
        }

        const newKey = generateIdempotencyKey();
        localStorage.setItem(STORAGE_KEY, newKey);
        return newKey;
    } catch (error) {
        console.error("Error accessing localStorage for idempotency key:", error);
        // Fallback to generating a temporary key
        return generateIdempotencyKey();
    }
}

/**
 * Clears the current idempotency key from storage
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

/**
 * Replaces the current idempotency key with a new one
 */
export function refreshIdempotencyKey(): string {
    clearIdempotencyKey();
    return getOrCreateIdempotencyKey();
}
