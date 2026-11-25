export type LegalSection =
  | "privacy"
  | "terms"
  | "cookies"
  | "return-exchange"
  | "terms-of-sale"
  | "legal-notice"
  | "membership";

export const legalSections: Record<
  LegalSection,
  {
    title: string;
    /** Key of the page in the shop profile `legal` map. */ file?: string;
  }
> = {
  privacy: {
    title: "privacy policy",
    file: "privacy-policy",
  },
  terms: {
    title: "terms and conditions of use",
    file: "terms-conditions",
  },
  "terms-of-sale": {
    title: "terms and conditions of sale",
    file: "terms-of-sale",
  },
  "legal-notice": {
    title: "legal notice",
    file: "legal-notice",
  },
  "return-exchange": {
    title: "return and exchange policy",
    file: "return-exchange",
  },
  cookies: {
    title: "cookie settings",
  },
  membership: {
    title: "membership policy",
    file: "membership",
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
  purchase: [
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
    "pickup",
  ],
  repair: ["repair process", "repair status", "repair request"],
};

export const civility = ["ms", "mx", "mr", "i'd rather not say"];

export const reasons = [
  "size issues",
  "damaged or defective",
  "wrong item received",
  "item does not match description",
  "changed my mind",
  "quality not as expected",
  "ordered by mistake",
  "other",
];
