import type {
  common_GenderEnum,
  common_OrderFactor,
  common_SortFactor,
} from "./api/proto-http/frontend";

export const PRODUCTS_CACHE_TAG = "products";
export const ARCHIVES_CACHE_TAG = "archives";
export const HERO_CACHE_TAG = "hero";

export const FOOTER_YEAR = Math.floor(Date.now() / 1000);

export const EMPTY_PREORDER = "0001-01-01T00:00:00Z";

export const FOOTER_LINKS: { text: string; href: string }[] = [
  { text: "x", href: "https://www.x.com/grbpwr/" },
  { text: "gh", href: "https://www.github.com/grbpwr/" },
  { text: "ig", href: "https://www.instagram.com/grb.pwr/" },
  { text: "tg", href: "https://www.t.me/grbpwr/" },
];

export const CATALOG_LIMIT = 16;

export const ARCHIVE_LIMIT = 48;

export const CURRENCY_MAP = {
  eth: "eth",
};
export const MAX_LIMIT = 9999999;

export const GRBPWR_CART = "grbpwr-cart";

export const GENDER_MAP: Record<string, common_GenderEnum> = {
  men: "GENDER_ENUM_MALE",
  women: "GENDER_ENUM_FEMALE",
  unisex: "GENDER_ENUM_UNISEX",
  ukn: "GENDER_ENUM_UNKNOWN",
};

export const GENDER_MAP_REVERSE: Record<common_GenderEnum, string> = {
  GENDER_ENUM_MALE: "men",
  GENDER_ENUM_FEMALE: "women",
  GENDER_ENUM_UNISEX: "unisex",
  GENDER_ENUM_UNKNOWN: "ukn",
};

export const ORDER_MAP: Record<string, common_OrderFactor> = {
  asc: "ORDER_FACTOR_ASC",
  desc: "ORDER_FACTOR_DESC",
};

export const SORT_MAP_URL: Record<string, common_SortFactor> = {
  created_at: "SORT_FACTOR_CREATED_AT",
  updated_at: "SORT_FACTOR_UPDATED_AT",
  name: "SORT_FACTOR_NAME",
  price: "SORT_FACTOR_PRICE",
};

export const paymentMethodNamesMap = {
  // PAYMENT_METHOD_NAME_ENUM_CARD: "card",
  PAYMENT_METHOD_NAME_ENUM_CARD_TEST: "card (Test)",
  // PAYMENT_METHOD_NAME_ENUM_ETH: "Ethereum (ETH)",
  // PAYMENT_METHOD_NAME_ENUM_ETH_TEST: "Ethereum (ETH) Test",
  // PAYMENT_METHOD_NAME_ENUM_USDT_TRON: "tron usdt",
  // PAYMENT_METHOD_NAME_ENUM_USDT_SHASTA: "tron usdt (Test)",
};

export const currencyKeyMap: Record<string, string> = {
  Bitcoin: "BTC",
  Ethereum: "ETH",
};

// Helper function to get display currency key
export const getDisplayCurrencyKey = (serverKey: string): string => {
  return currencyKeyMap[serverKey] || serverKey;
};

export const currencySymbols: Record<string, string> = {
  CNY: "¥", // Chinese Yuan
  EUR: "€", // Euro
  KRW: "₩", // Korean Won
  GBP: "£", // British Pound Sterling
  JPY: "¥", // Japanese Yen
  USD: "$", // United States Dollar
  // BTC: "₿", // Bitcoin
  // CHF: "Fr", // Swiss Franc
  // CZK: "Kč", // Czech Republic Koruna
  // DKK: "kr", // Danish Krone
  // ETH: "⟠", // Ethereum
  // GEL: "₾", // Georgian Lari
  // HUF: "Ft", // Hungarian Forint
  // ILS: "₪", // Israeli New Sheqel
  // NOK: "kr", // Norwegian Krone
  // PLN: "zł", // Polish Zloty
  // RUB: "₽", // Russian Ruble
  // SEK: "kr", // Swedish Krona
  // TRY: "₺", // Turkish Lira
  // UAH: "₴", // Ukrainian Hryvnia
  // HKD: "$", // Hong Kong Dollar
};

export type OrderFactorOption = {
  factor: common_OrderFactor;
  name: string;
  sale?: boolean;
};

export type SortFactorConfig = {
  label?: string;
  orderFactors: OrderFactorOption[];
};

export const SORT_MAP: Partial<Record<common_SortFactor, SortFactorConfig>> = {
  SORT_FACTOR_CREATED_AT: {
    orderFactors: [
      { factor: "ORDER_FACTOR_DESC", name: "sort.latest arrivals" },
    ],
  },
  SORT_FACTOR_PRICE: {
    label: "sort.price",
    orderFactors: [
      { factor: "ORDER_FACTOR_ASC", name: "sort.low to high" },
      { factor: "ORDER_FACTOR_DESC", name: "sort.high to low" },
      { factor: "ORDER_FACTOR_ASC", name: "sort.low to high", sale: true },
      { factor: "ORDER_FACTOR_DESC", name: "sort.high to low", sale: true },
    ],
  },
};

export const CARE_INSTRUCTIONS_MAP: Record<string, string> = {
  BA: "Bleach Allowed",
  DCAS: "Dry Clean with Any Solvent",
  DCASE: "Dry Clean with Any Solvent Except Trichloroethylene",
  DCPS: "Dry Clean with Petroleum Solvent Only",
  DD: "Drip Dry",
  DDS: "Drip Dry in Shade",
  DF: "Dry Flat",
  DFS: "Dry Flat in Shade",
  DIS: "Dry in Shade",
  DNB: "Do Not Bleach",
  DNDC: "Do Not Dry Clean",
  DNI: "Do Not Iron",
  DNS: "Do Not Steam",
  DNTD: "Do Not Tumble Dry",
  DNW: "Do Not Wash",
  DNWC: "Do Not Wet Clean",
  GDC: "Gentle Dry Clean with Any Solvent Except Trichloroethylene",
  GPWC: "Gentle Professional Wet Clean",
  GW: "Gentle Wash",
  HW: "Hand Wash Only",
  IH: "Iron at High Temperature (200°C)",
  IL: "Iron at Low Temperature (110°C)",
  IM: "Iron at Medium Temperature (150°C)",
  LD: "Line Dry",
  LDS: "Line Dry in Shade",
  MW30: "Machine Wash Cold (30°C)",
  MW40: "Machine Wash Warm (40°C)",
  MW50: "Machine Wash Hot (50°C)",
  MW60: "Machine Wash Very Hot (60°C)",
  MW95: "Machine Wash Boiling (95°C)",
  MWN: "Machine Wash Normal",
  NCB: "Non-Chlorine Bleach Only",
  PWC: "Professional Wet Clean",
  TDH: "Tumble Dry High Heat",
  TDL: "Tumble Dry Low Heat",
  TDM: "Tumble Dry Medium Heat",
  TDN: "Tumble Dry Normal",
  VGDC: "Very Gentle Dry Clean with Any Solvent Except Trichloroethylene",
  VGPWC: "Very Gentle Professional Wet Clean",
  VGW: "Very Gentle Wash",
};

export const COMPOSITION_MAP: Record<string, string> = {
  ACE: "Acetate",
  ACR: "Acrylic",
  ALP: "Alpaca",
  ANG: "Angora",
  BAM: "Bamboo",
  "BAM-COT": "Bamboo-Cotton",
  CAM: "Camel Hair",
  CAS: "Cashmere",
  CMX: "Coolmax",
  CORD: "Cordura",
  COT: "Cotton",
  "COT-POL": "Cotton-Polyester",
  ECO: "Econyl",
  GTX: "Gore-Tex",
  HEM: "Hemp",
  JUT: "Jute",
  KAP: "Kapok",
  KEV: "Kevlar",
  LEA: "Leather",
  LIN: "Linen",
  "LIN-COT": "Linen-Cotton",
  "LYC-BLD": "Lycra Blends",
  MER: "Merino Wool",
  MOD: "Modal",
  MOH: "Mohair",
  MULS: "Mulberry Silk",
  NEO: "Neoprene",
  NYL: "Nylon",
  OCOT: "Organic Cotton",
  POL: "Polyester",
  PP: "Polypropylene",
  PRL: "PrimaLoft",
  PRX: "Pertex",
  PU: "Polyurethane (PU)",
  QIV: "Qiviut (Muskox Wool)",
  RAM: "Ramie",
  RAY: "Rayon (Viscose)",
  RIP: "Ripstop",
  RPET: "Recycled Polyester (rPET)",
  RWOL: "Recycled Wool",
  SAB: "Sable Fur",
  SEA: "Seacell",
  SIC: "Sea Island Cotton",
  SIL: "Silk",
  "SIL-COT": "Silk-Cotton",
  SOY: "Soy Silk",
  SPA: "Spandex (Elastane)",
  THL: "Thermolite",
  VIC: "Vicuna",
  WOL: "Wool",
  "WOL-SYN": "Wool-Synthetic Blend",
  YAK: "Yak Wool",
  ZIB: "Zibeline",
};

export const SHOES_SIZE_CONVERSION: Record<string, Record<string, string>> = {
  "35": { EU: "35", US: "5", UK: "2", CM: "22.0" },
  "35.5": { EU: "35.5", US: "5.5", UK: "2.5", CM: "22.5" },
  "36": { EU: "36", US: "6", UK: "3", CM: "23.0" },
  "36.5": { EU: "36.5", US: "6.5", UK: "3.5", CM: "23.5" },
  "37": { EU: "37", US: "7", UK: "4", CM: "24.0" },
  "37.5": { EU: "37.5", US: "7.5", UK: "4.5", CM: "24.5" },
  "38": { EU: "38", US: "8", UK: "5", CM: "25.0" },
  "38.5": { EU: "38.5", US: "8.5", UK: "5.5", CM: "25.5" },
  "39": { EU: "39", US: "9", UK: "6", CM: "26.0" },
  "39.5": { EU: "39.5", US: "9.5", UK: "6.5", CM: "26.5" },
  "40": { EU: "40", US: "10", UK: "7", CM: "27.0" },
  "40.5": { EU: "40.5", US: "10.5", UK: "7.5", CM: "27.5" },
  "41": { EU: "41", US: "11", UK: "8", CM: "28.0" },
  "41.5": { EU: "41.5", US: "11.5", UK: "8.5", CM: "28.5" },
  "42": { EU: "42", US: "12", UK: "9", CM: "29.0" },
  "42.5": { EU: "42.5", US: "12.5", UK: "9.5", CM: "29.5" },
  "43": { EU: "43", US: "13", UK: "10", CM: "30.0" },
  "43.5": { EU: "43.5", US: "13.5", UK: "10.5", CM: "30.5" },
  "44": { EU: "44", US: "14", UK: "11", CM: "31.0" },
  "44.5": { EU: "44.5", US: "14.5", UK: "11.5", CM: "31.5" },
  "45": { EU: "45", US: "15", UK: "12", CM: "32.0" },
  "45.5": { EU: "45.5", US: "15.5", UK: "12.5", CM: "32.5" },
  "46": { EU: "46", US: "16", UK: "13", CM: "33.0" },
  "46.5": { EU: "46.5", US: "16.5", UK: "13.5", CM: "33.5" },
  "47": { EU: "47", US: "17", UK: "14", CM: "34.0" },
  "47.5": { EU: "47.5", US: "17.5", UK: "14.5", CM: "34.5" },
  "48": { EU: "48", US: "18", UK: "15", CM: "35.0" },
};

export const RING_SIZE_CONVERSION: Record<string, Record<string, string>> = {
  "35": { EU: "35", US: "6", UK: "2" },
  "35.5": { EU: "35.5", US: "6.5", UK: "2.5" },
  "36": { EU: "36", US: "7", UK: "3" },
  "36.5": { EU: "36.5", US: "7.5", UK: "3.5" },
  "37": { EU: "37", US: "8", UK: "4" },
  "37.5": { EU: "37.5", US: "8.5", UK: "4.5" },
  "38": { EU: "38", US: "9", UK: "5" },
  "38.5": { EU: "38.5", US: "9.5", UK: "5.5" },
  "39": { EU: "39", US: "10", UK: "6" },
  "39.5": { EU: "39.5", US: "10.5", UK: "6.5" },
  "40": { EU: "40", US: "11", UK: "7" },
  "40.5": { EU: "40.5", US: "11.5", UK: "7.5" },
  "41": { EU: "41", US: "12", UK: "8" },
  "41.5": { EU: "41.5", US: "12.5", UK: "8.5" },
  "42": { EU: "42", US: "13", UK: "9" },
  "42.5": { EU: "42.5", US: "13.5", UK: "9.5" },
  "43": { EU: "43", US: "14", UK: "10" },
  "43.5": { EU: "43.5", US: "14.5", UK: "10.5" },
  "44": { EU: "44", US: "15", UK: "11" },
  "44.5": { EU: "44.5", US: "15.5", UK: "11.5" },
  "45": { EU: "45", US: "16", UK: "12" },
  "45.5": { EU: "45.5", US: "16.5", UK: "12.5" },
  "46": { EU: "46", US: "17", UK: "13" },
  "46.5": { EU: "46.5", US: "17.5", UK: "13.5" },
  "47": { EU: "47", US: "18", UK: "14" },
  "47.5": { EU: "47.5", US: "18.5", UK: "14.5" },
  "48": { EU: "48", US: "19", UK: "15" },
};

export const MEASUREMENT_DESCRIPTIONS: Record<string, string> = {
  waist: "Measured waist flat across garment",
  chest: "Measured chest flat across garment, from under-arm to under-arm",
  shoulders:
    "Measured horizontally across garment, from shoulder-seam to shoulder-seam",
  hips: "Measured hip flat across garment",
  "leg-opening": "Measure the bottom hem opening.",
  "bottom-width": "Measured bottom width flat across garment",
  "end-fit-length": "Length from end fit point.",
  "start-fit-length": "Length from start fit point.",
  length: "Measured from center-back neck down to bottom of garment",
  inseam: "Measured from crotch down to bottom along inseam (inside leg)",
  sleeve: "Measured from center back neck, including shoulder to bottom of hem",
  height: "Full height of the garment.",
  width: "Width at the specified point",
};

export const keyboardRestrictions = {
  nameFields: /[A-Za-z .'-]/,
  addressField: /[A-Za-z0-9 .','-]/,
  postalCodeField: /[A-Za-z0-9 \-]/,
  companyField: /[A-Za-z0-9 .'-]/,
};

export const errorMessages = {
  firstName: {
    min: "first name must contain at least 1 character",
    max: "first name must contain at most 40 characters",
    regex: {
      restriction: /^(?!.*  )(?=.*\p{L})[\p{L} .'-]+$/u,
      message:
        "must contain at least one letter and only letters, spaces, hyphens, apostrophes, and periods are allowed",
    },
  },
  lastName: {
    min: "last name must contain at least 1 character",
    max: "last name must contain at most 40 characters",
    regex: {
      restriction: /^(?!.*  )(?=.*\p{L})[\p{L} .'-]+$/u,
      message:
        "must contain at least one letter and only letters, spaces, hyphens, apostrophes, and periods are allowed",
    },
  },
  phone: {
    min: "phone must contain at least 5 numbers",
    max: "phone must contain at most 15 numbers",
  },
  city: {
    min: "city must contain at least 2 characters",
    regex: {
      restriction: /^(?!.*  )(?=.*\p{L})[\p{L} .'-]+$/u,
      message:
        "must contain at least one letter and only letters, spaces, hyphens, apostrophes, and periods are allowed",
    },
  },
  address: {
    min: "address must contain at least 3 characters",
    max: "address must contain at most 40 characters",
    regex: {
      restriction: /^(?!.*  )[\p{L}0-9 .'-]+$/u,
      message:
        "only letters, numbers, spaces, hyphens, apostrophes, and periods are allowed",
    },
  },
  postalCode: {
    min: "postal code must contain at least 2 characters",
    max: "postal code must contain at most 12 characters",
    regex: {
      restriction: /^(?!.*  )[A-Za-z0-9 \- ]{2,12}$/,
      message:
        "postal code must contain only letters, numbers, spaces, or hyphens",
    },
  },
  country: {
    min: "country must contain at least 2 characters",
  },
  company: {
    min: "company must contain at least 1 character",
    max: "company must contain at most 40 characters",
    regex: {
      restriction: /^(?!.*  )[\p{L}0-9 .'-]+$/u,
      message:
        "only letters, numbers, spaces, hyphens, apostrophes, and periods are allowed",
    },
  },
  email: {
    invalid: "invalid email",
    max: "email must contain at most 40 characters",
  },
};

export type CountryOption = {
  name: string;
  currency: string;
  currencyKey: string;
  lng: string;
  countryCode: string;
  phoneCode: string;
  displayLng?: string;
  vatRate?: number; // VAT rate as percentage (e.g., 19 for 19%)
  taxType?: "VAT" | "Sales Tax" | "GST"; // Tax terminology used in the country
};

// Helper to create country with defaults
const country = (
  name: string,
  countryCode: string,
  phoneCode: string,
  overrides: Partial<
    Omit<CountryOption, "name" | "countryCode" | "phoneCode">
  > = {},
): CountryOption => ({
  currency: "€",
  currencyKey: "EUR",
  lng: "en",
  displayLng: "english",
  ...overrides,
  name,
  countryCode,
  phoneCode,
});

export const COUNTRIES_BY_REGION = {
  AFRICA: [country("south africa", "za", "27", { vatRate: 15 })],
  //remove vat
  AMERICAS: [
    country("canada", "ca", "1", { currency: "$", currencyKey: "USD", vatRate: 0, taxType: "GST" }), // GST/HST varies by province
    country("chile", "cl", "56", { currency: "$", currencyKey: "USD", vatRate: 19 }),
    country("mexico", "mx", "52", { currency: "$", currencyKey: "USD", vatRate: 16 }),
    country("united states", "us", "1", { currency: "$", currencyKey: "USD", vatRate: 0, taxType: "Sales Tax" }), // Sales tax varies by state
  ],
  // remove vat
  "ASIA PACIFIC": [
    country("australia", "au", "61", { vatRate: 10, taxType: "GST" }),
    country("hong kong sar", "hk", "852", { vatRate: 0 }),
    country("india", "in", "91", { vatRate: 18, taxType: "GST" }),
    country("japan", "jp", "81", { currency: "¥", currencyKey: "JPY", vatRate: 10 }),
    country("日本", "jp", "81", {
      currency: "¥",
      currencyKey: "JPY",
      lng: "ja",
      displayLng: "日本語",
      vatRate: 10,
    }),
    country("macau sar", "mo", "853", { vatRate: 0 }),
    country("mainland china", "cn", "86", {
      currency: "¥",
      currencyKey: "CNY",
      vatRate: 13,
    }),
    country("中国大陆", "cn", "86", {
      currency: "¥",
      currencyKey: "CNY",
      lng: "zh",
      displayLng: "简体中文",
      vatRate: 13,
    }),
    country("malaysia", "my", "60", { vatRate: 6 }), // SST (Sales and Service Tax)
    country("new zealand", "nz", "64", { vatRate: 15, taxType: "GST" }),
    country("singapore", "sg", "65", { vatRate: 8, taxType: "GST" }),
    country("south korea", "kr", "82", { currency: "₩", currencyKey: "KRW", vatRate: 10 }),
    country("대한민국", "kr", "82", { currency: "₩", currencyKey: "KRW", lng: "ko", displayLng: "한국인", vatRate: 10 }),
    country("taiwan", "tw", "886", { vatRate: 5 }),
    country("台湾地区", "tw", "886", { lng: "zh", displayLng: "繁體中文", vatRate: 5 }),
    country("thailand", "th", "66", { vatRate: 7 }),
  ],
  EUROPE: [
    country("aland islands", "ax", "358", { vatRate: 0 }),
    country("andorra", "ad", "376", { vatRate: 4.5 }),
    country("austria", "at", "43", { vatRate: 20 }),
    country("belgium", "be", "32", { vatRate: 21 }),
    country("bulgaria", "bg", "359", { vatRate: 20 }),
    country("croatia", "hr", "385", { vatRate: 25 }),
    country("cyprus", "cy", "357", { vatRate: 19 }),
    country("czech republic", "cz", "420", { vatRate: 21 }),
    country("denmark", "dk", "45", { vatRate: 25 }),
    country("estonia", "ee", "372", { vatRate: 20 }),
    country("faroe islands", "fo", "298", { vatRate: 0 }),
    country("finland", "fi", "358", { vatRate: 24 }),
    country("france", "fr", "33", { vatRate: 20 }),
    country("france", "fr", "33", { lng: "fr", displayLng: "français", vatRate: 20 }),
    country("germany", "de", "49", { vatRate: 19 }),
    country("deutschland", "de", "49", { lng: "de", displayLng: "deutsch", vatRate: 19 }),
    country("gibraltar", "gi", "350", { vatRate: 0 }),
    country("greece", "gr", "30", { vatRate: 24 }),
    country("greenland", "gl", "299", { vatRate: 0 }),
    country("guernsey", "gg", "44", { vatRate: 0 }),
    country("hungary", "hu", "36", { vatRate: 27 }),
    country("iceland", "is", "354", { vatRate: 24 }),
    country("italy", "it", "39", { vatRate: 22 }),
    country("italy", "it", "39", { lng: "it", displayLng: "italiano", vatRate: 22 }),
    country("jersey", "je", "44", { vatRate: 0 }),
    country("latvia", "lv", "371", { vatRate: 21 }),
    country("liechtenstein", "li", "423", { vatRate: 7.7 }),
    country("lithuania", "lt", "370", { vatRate: 21 }),
    country("luxembourg", "lu", "352", { vatRate: 17 }),
    country("malta", "mt", "356", { vatRate: 18 }),
    country("monaco", "mc", "377", { vatRate: 20 }),
    country("netherland", "nl", "31", { vatRate: 21 }),
    country("norway", "no", "47", { vatRate: 25 }),
    country("poland", "pl", "48", { vatRate: 23 }),
    country("portugal", "pt", "351", { vatRate: 23 }),
    country("romania", "ro", "40", { vatRate: 19 }),
    country("slovakia", "sk", "421", { vatRate: 20 }),
    country("slovenia", "si", "386", { vatRate: 22 }),
    country("spain", "es", "34", { vatRate: 21 }),
    country("sweeden", "se", "46", { vatRate: 25 }),
    country("switzerland", "ch", "41", { vatRate: 7.7 }),
    country("turkey", "tr", "90", { vatRate: 20 }),
    country("united kingdom", "gb", "44", { currency: "£", currencyKey: "GBP", vatRate: 20 }),
  ],
  // remove vat
  "MIDDLE EAST": [
    country("bahrain", "bh", "973", { vatRate: 10 }),
    country("israel", "il", "972", { vatRate: 17 }),
    country("kuwait", "kw", "965", { vatRate: 0 }), // VAT not implemented yet
    country("qatar", "qa", "974", { vatRate: 0 }), // VAT not implemented yet
    country("saudi arabia", "sa", "966", { vatRate: 15 }),
    country("united arab emirates", "ae", "971", { vatRate: 5 }),
  ],
} satisfies Record<string, CountryOption[]>;

export const LANGUAGE_CODE_TO_ID: Record<string, number> = {
  en: 1,
  fr: 2,
  de: 3,
  it: 4,
  ja: 5,
  zh: 6,
  ko: 7,
};

export const LANGUAGE_ID_TO_LOCALE: Record<number, string> = {
  1: "en",
  2: "fr",
  3: "de",
  4: "it",
  5: "ja",
  6: "zh",
  7: "ko",
};

// Map validation messages to translation keys
export const errorMap: Record<string, string> = {
  "invalid email": "invalid",
  "must contain at least": "min",
  "must contain at most": "max",
  "must not exceed": "max",
  required: "required",
  regex: "regex",
  format: "regex",
  "you must accept the terms & conditions": "required",
  "you must accept the terms and conditions": "required",
};

export const PLURIAL_SINGLE_CATEGORY_MAP: Record<string, string> = {
  dresses: "dress",
  jackets: "jacket",
  coats: "coat",
  vests: "vest",
  shirts: "shirt",
  tshirts: "tshirt",
  sweaters_knits: "sweater",
  tanks: "tank",
  hoodies_sweatshirts: "sweatshirt",
  crop: "crop",
  skirts: "skirt",
  bralettes: "bralette",
  robes: "robe",
  hats: "hat",
  belts: "belt",
  scarves: "scarf",
  backpacks: "backpack",
};


export const TOP_CATEGORIES = [
  { key: "outerwear", label: "outerwear" },
  { key: "tops", label: "tops" },
  { key: "bottoms", label: "bottoms" },
  { key: "dresses", label: "dresses" },
  { key: "loungewear_sleepwear", label: "loungewear" },
  { key: "accessories", label: "accessories" },
  { key: "shoes", label: "shoes" },
  { key: "bags", label: "bags" },
] as const;

export const FIT_OPTIONS = [
  "regular",
  "slim",
  "loose",
  "relaxed",
  "skinny",
  "cropped",
  "tailored",
] as const;