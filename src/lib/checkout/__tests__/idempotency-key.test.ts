/**
 * Tests for idempotency key management
 *
 * Note: These tests use a mock localStorage since the actual implementation
 * runs in a browser environment.
 */

import {
    clearIdempotencyKey,
    getOrCreateIdempotencyKey,
    refreshIdempotencyKey,
} from "../idempotency-key";

const STORAGE_KEY = "checkout-idempotency-key";
const MAX_AGE_MS = 15 * 60 * 1000;

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

Object.defineProperty(global, "localStorage", {
    value: localStorageMock,
});

// Mock crypto.randomUUID
const mockUUID = "123e4567-e89b-12d3-a456-426614174000";
Object.defineProperty(global, "crypto", {
    value: {
        randomUUID: () => mockUUID,
    },
});

function storeKey(key: string, createdAt: number) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ key, createdAt }),
    );
}

describe("Idempotency Key Management", () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    describe("getOrCreateIdempotencyKey", () => {
        it("should create a new key if none exists", () => {
            const key = getOrCreateIdempotencyKey();
            expect(key).toBe(mockUUID);
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
            expect(stored.key).toBe(mockUUID);
            expect(typeof stored.createdAt).toBe("number");
        });

        it("should return existing key if one exists and is not expired", () => {
            const existingKey = "existing-key-123";
            storeKey(existingKey, Date.now());

            const key = getOrCreateIdempotencyKey();
            expect(key).toBe(existingKey);
        });

        it("should persist the key across multiple calls", () => {
            const key1 = getOrCreateIdempotencyKey();
            const key2 = getOrCreateIdempotencyKey();
            expect(key1).toBe(key2);
        });

        it("should create new key if existing key is older than 15 minutes", () => {
            const oldKey = "old-key-123";
            storeKey(oldKey, Date.now() - MAX_AGE_MS - 1);

            const key = getOrCreateIdempotencyKey();
            expect(key).toBe(mockUUID);
            expect(key).not.toBe(oldKey);
        });

        it("should treat legacy plain-string format as expired", () => {
            localStorage.setItem(STORAGE_KEY, "legacy-key");

            const key = getOrCreateIdempotencyKey();
            expect(key).toBe(mockUUID);
        });
    });

    describe("clearIdempotencyKey", () => {
        it("should remove the key from storage", () => {
            storeKey(mockUUID, Date.now());
            expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();

            clearIdempotencyKey();
            expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
        });

        it("should not throw if no key exists", () => {
            expect(() => clearIdempotencyKey()).not.toThrow();
        });
    });

    describe("refreshIdempotencyKey", () => {
        it("should replace existing key with a new one", () => {
            const oldKey = "old-key-123";
            storeKey(oldKey, Date.now());

            const newKey = refreshIdempotencyKey();
            expect(newKey).toBe(mockUUID);
            expect(newKey).not.toBe(oldKey);
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
            expect(stored.key).toBe(mockUUID);
        });

        it("should create a new key if none exists", () => {
            const key = refreshIdempotencyKey();
            expect(key).toBe(mockUUID);
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
            expect(stored.key).toBe(mockUUID);
        });
    });
});
