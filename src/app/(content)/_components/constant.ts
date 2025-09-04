export type LegalSection =
    | "privacy"
    | "terms"
    | "cookies"
    | "return-exchange"
    | "terms-of-sale"
    | "legal-notice";

export const legalSections: Record<LegalSection, { title: string; file?: string }> = {
    privacy: {
        title: "Privacy Policy",
        file: "/content/legal/privacy-policy.md",
    },
    terms: {
        title: "Terms and Conditions of Use",
        file: "/content/legal/terms-conditions.md",
    },
    "terms-of-sale": {
        title: "Terms and Conditions of Sale",
        file: "/content/legal/terms-of-sale.md",
    },
    "legal-notice": {
        title: "Legal Notice",
        file: "/content/legal/legal-notice.md",
    },
    "return-exchange": {
        title: "Return and Exchange Policy",
        file: "/content/legal/return-exchange.md",
    },
    cookies: {
        title: "Cookie Settings",
    },
};



export const options = {
    "product information": [
        "availability",
        "price",
        "sizing",
        "characteristics",
        "care",
    ],
    "purchase": [
        "order status",
        "delivery",
        "cancellation request",
        "invoice request",
        "payment issue",
        "website issue",
    ],
    "return & exchange": [
        "return process",
        "refund request",
        "return in store",
        "return policy",
        "exchange request",
        "pickup"
    ],
    repair: [
        "repair process",
        "repair status",
        "repair request",
    ],
}

export const civility = [
    "miss, mrs, ms",
    "mx",
    "mr",
    "i'd rather not say",
]
