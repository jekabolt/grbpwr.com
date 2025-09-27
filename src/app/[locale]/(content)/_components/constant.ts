export type LegalSection =
    | "privacy"
    | "terms"
    | "cookies"
    | "return-exchange"
    | "terms-of-sale"
    | "legal-notice";

export const legalSections: Record<LegalSection, { title: string; file?: string }> = {
    privacy: {
        title: "privacy policy",
        file: "/content/legal/privacy-policy.md",
    },
    terms: {
        title: "terms and conditions of use",
        file: "/content/legal/terms-conditions.md",
    },
    "terms-of-sale": {
        title: "terms and conditions of sale",
        file: "/content/legal/terms-of-sale.md",
    },
    "legal-notice": {
        title: "legal notice",
        file: "/content/legal/legal-notice.md",
    },
    "return-exchange": {
        title: "return and exchange policy",
        file: "/content/legal/return-exchange.md",
    },
    cookies: {
        title: "cookie settings",
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
    "gender",
    "mx",
    "mr",
    "i'd rather not say",
]
