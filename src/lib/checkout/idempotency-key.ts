/**
 * Manages idempotency keys for checkout sessions.
 * The key associates pre-orders with payment intent IDs on the backend.
 */

const STORAGE_KEY = "checkout-idempotency-key";
const MAX_AGE_MS = 15 * 60 * 1000; // 15 minutes

interface StoredKey {
    key: string;
    createdAt: number;
}

/**
 * Generates a new UUID v4 idempotency key
 */
function generateIdempotencyKey(): string {
    return crypto.randomUUID();
}

/**
 * Parses stored value. Returns null if invalid or expired.
 * Handles legacy format (plain string) by treating it as expired.
 */
function parseStoredKey(raw: string | null): StoredKey | null {
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw) as StoredKey;
        if (
            typeof parsed?.key !== "string" ||
            typeof parsed?.createdAt !== "number"
        ) {
            return null; // Invalid format
        }
        if (Date.now() - parsed.createdAt > MAX_AGE_MS) {
            return null; // Expired
        }
        return parsed;
    } catch {
        // Legacy format (plain string) - treat as expired
        return null;
    }
}

/**
 * Gets the current idempotency key from storage, or creates a new one if it doesn't exist or is expired (>15 min)
 */
export function getOrCreateIdempotencyKey(): string {
    if (typeof window === "undefined") {
        // Server-side: generate a temporary key (won't be persisted)
        return generateIdempotencyKey();
    }

    try {
        const stored = parseStoredKey(localStorage.getItem(STORAGE_KEY));
        if (stored) {
            return stored.key;
        }

        const newKey = generateIdempotencyKey();
        const toStore: StoredKey = {
            key: newKey,
            createdAt: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
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
