/**
 * Tests for idempotency key management
 *
 * Note: These tests use a mock localStorage since the actual implementation
 * runs in a browser environment.
 */

import {
    clearIdempotencyKey,
    getStoredIdempotencyKey,
    setIdempotencyKey,
} from "../idempotency-key";

const STORAGE_KEY = "checkout-idempotency-key";

// Mock localStorage
const localStorageMock = (() => {
    const store: Record<string, string> = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            Object.keys(store).forEach((k) => delete store[k]);
        },
    };
})();

Object.defineProperty(global, "localStorage", {
    value: localStorageMock,
});

describe("Idempotency Key Management", () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    describe("getStoredIdempotencyKey", () => {
        it("should return null if no key exists", () => {
            expect(getStoredIdempotencyKey()).toBeNull();
        });

        it("should return the stored key", () => {
            const key = "server-generated-key-123";
            setIdempotencyKey(key);
            expect(getStoredIdempotencyKey()).toBe(key);
        });

        it("should return null for empty string", () => {
            localStorageMock.setItem(STORAGE_KEY, "");
            expect(getStoredIdempotencyKey()).toBeNull();
        });
    });

    describe("setIdempotencyKey", () => {
        it("should store the key", () => {
            const key = "server-generated-key-456";
            setIdempotencyKey(key);
            expect(localStorage.getItem(STORAGE_KEY)).toBe(key);
        });

        it("should overwrite existing key", () => {
            setIdempotencyKey("old-key");
            setIdempotencyKey("new-key");
            expect(getStoredIdempotencyKey()).toBe("new-key");
        });
    });

    describe("clearIdempotencyKey", () => {
        it("should remove the key from storage", () => {
            setIdempotencyKey("key-to-clear");
            expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();

            clearIdempotencyKey();
            expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
        });

        it("should not throw if no key exists", () => {
            expect(() => clearIdempotencyKey()).not.toThrow();
        });
    });
});
