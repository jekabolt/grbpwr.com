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

describe("Idempotency Key Management", () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    describe("getOrCreateIdempotencyKey", () => {
        it("should create a new key if none exists", () => {
            const key = getOrCreateIdempotencyKey();
            expect(key).toBe(mockUUID);
            expect(localStorage.getItem("checkout-idempotency-key")).toBe(mockUUID);
        });

        it("should return existing key if one exists", () => {
            const existingKey = "existing-key-123";
            localStorage.setItem("checkout-idempotency-key", existingKey);

            const key = getOrCreateIdempotencyKey();
            expect(key).toBe(existingKey);
        });

        it("should persist the key across multiple calls", () => {
            const key1 = getOrCreateIdempotencyKey();
            const key2 = getOrCreateIdempotencyKey();
            expect(key1).toBe(key2);
        });
    });

    describe("clearIdempotencyKey", () => {
        it("should remove the key from storage", () => {
            localStorage.setItem("checkout-idempotency-key", mockUUID);
            expect(localStorage.getItem("checkout-idempotency-key")).toBe(mockUUID);

            clearIdempotencyKey();
            expect(localStorage.getItem("checkout-idempotency-key")).toBeNull();
        });

        it("should not throw if no key exists", () => {
            expect(() => clearIdempotencyKey()).not.toThrow();
        });
    });

    describe("refreshIdempotencyKey", () => {
        it("should replace existing key with a new one", () => {
            const oldKey = "old-key-123";
            localStorage.setItem("checkout-idempotency-key", oldKey);

            const newKey = refreshIdempotencyKey();
            expect(newKey).toBe(mockUUID);
            expect(newKey).not.toBe(oldKey);
            expect(localStorage.getItem("checkout-idempotency-key")).toBe(mockUUID);
        });

        it("should create a new key if none exists", () => {
            const key = refreshIdempotencyKey();
            expect(key).toBe(mockUUID);
            expect(localStorage.getItem("checkout-idempotency-key")).toBe(mockUUID);
        });
    });
});
