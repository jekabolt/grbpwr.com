import type {
  common_GenderEnum,
  common_OrderFactor,
  common_SortFactor
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
  "GENDER_ENUM_MALE": "men",
  "GENDER_ENUM_FEMALE": "women",
  "GENDER_ENUM_UNISEX": "unisex",
  "GENDER_ENUM_UNKNOWN": "ukn",
};

export const ORDER_MAP: Record<string, common_OrderFactor> = {
  asc: "ORDER_FACTOR_ASC",
  desc: "ORDER_FACTOR_DESC",
};

export const SORT_MAP_URL: Record<string, common_SortFactor> = {
  "created_at": "SORT_FACTOR_CREATED_AT",
  "updated_at": "SORT_FACTOR_UPDATED_AT",
  name: "SORT_FACTOR_NAME",
  price: "SORT_FACTOR_PRICE",
};

export const paymentMethodNamesMap = {
  PAYMENT_METHOD_NAME_ENUM_CARD: "card",
  PAYMENT_METHOD_NAME_ENUM_CARD_TEST: "card (Test)",
  PAYMENT_METHOD_NAME_ENUM_ETH: "Ethereum (ETH)",
  PAYMENT_METHOD_NAME_ENUM_ETH_TEST: "Ethereum (ETH) Test",
  PAYMENT_METHOD_NAME_ENUM_USDT_TRON: "tron usdt",
  PAYMENT_METHOD_NAME_ENUM_USDT_SHASTA: "tron usdt (Test)",
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
  BTC: "₿", // Bitcoin
  CHF: "Fr", // Swiss Franc
  CNY: "¥", // Chinese Yuan
  CZK: "Kč", // Czech Republic Koruna
  DKK: "kr", // Danish Krone
  EUR: "€", // Euro
  ETH: "⟠", // Ethereum
  GBP: "£", // British Pound Sterling
  GEL: "₾", // Georgian Lari
  HKD: "$", // Hong Kong Dollar
  HUF: "Ft", // Hungarian Forint
  ILS: "₪", // Israeli New Sheqel
  JPY: "¥", // Japanese Yen
  NOK: "kr", // Norwegian Krone
  PLN: "zł", // Polish Zloty
  RUB: "₽", // Russian Ruble
  SEK: "kr", // Swedish Krona
  SGD: "$", // Singapore Dollar
  TRY: "₺", // Turkish Lira
  UAH: "₴", // Ukrainian Hryvnia
  USD: "$", // United States Dollar
};

export type OrderFactorOption = {
  factor: common_OrderFactor;
  name: string;
  sale?: boolean;
}

export type SortFactorConfig = {
  label?: string;
  orderFactors: OrderFactorOption[];
}

export const SORT_MAP: Partial<Record<common_SortFactor, SortFactorConfig>> = {
  SORT_FACTOR_CREATED_AT: {
    orderFactors: [
      { factor: 'ORDER_FACTOR_DESC', name: 'latest arrivals' }
    ]
  },
  SORT_FACTOR_PRICE: {
    label: 'price',
    orderFactors: [
      { factor: 'ORDER_FACTOR_ASC', name: 'low to high' },
      { factor: 'ORDER_FACTOR_DESC', name: 'high to low' },
      { factor: 'ORDER_FACTOR_ASC', name: 'low to high', sale: true },
      { factor: 'ORDER_FACTOR_DESC', name: 'high to low', sale: true }
    ]
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
  VGW: "Very Gentle Wash"
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
  ZIB: "Zibeline"
};

export const SHOES_SIZE_CONVERSION: Record<string, Record<string, string>> = {
  "35": { "EU": "35", "US": "5", "UK": "2", "CM": "22.0" },
  "35.5": { "EU": "35.5", "US": "5.5", "UK": "2.5", "CM": "22.5" },
  "36": { "EU": "36", "US": "6", "UK": "3", "CM": "23.0" },
  "36.5": { "EU": "36.5", "US": "6.5", "UK": "3.5", "CM": "23.5" },
  "37": { "EU": "37", "US": "7", "UK": "4", "CM": "24.0" },
  "37.5": { "EU": "37.5", "US": "7.5", "UK": "4.5", "CM": "24.5" },
  "38": { "EU": "38", "US": "8", "UK": "5", "CM": "25.0" },
  "38.5": { "EU": "38.5", "US": "8.5", "UK": "5.5", "CM": "25.5" },
  "39": { "EU": "39", "US": "9", "UK": "6", "CM": "26.0" },
  "39.5": { "EU": "39.5", "US": "9.5", "UK": "6.5", "CM": "26.5" },
  "40": { "EU": "40", "US": "10", "UK": "7", "CM": "27.0" },
  "40.5": { "EU": "40.5", "US": "10.5", "UK": "7.5", "CM": "27.5" },
  "41": { "EU": "41", "US": "11", "UK": "8", "CM": "28.0" },
  "41.5": { "EU": "41.5", "US": "11.5", "UK": "8.5", "CM": "28.5" },
  "42": { "EU": "42", "US": "12", "UK": "9", "CM": "29.0" },
  "42.5": { "EU": "42.5", "US": "12.5", "UK": "9.5", "CM": "29.5" },
  "43": { "EU": "43", "US": "13", "UK": "10", "CM": "30.0" },
  "43.5": { "EU": "43.5", "US": "13.5", "UK": "10.5", "CM": "30.5" },
  "44": { "EU": "44", "US": "14", "UK": "11", "CM": "31.0" },
  "44.5": { "EU": "44.5", "US": "14.5", "UK": "11.5", "CM": "31.5" },
  "45": { "EU": "45", "US": "15", "UK": "12", "CM": "32.0" },
  "45.5": { "EU": "45.5", "US": "15.5", "UK": "12.5", "CM": "32.5" },
  "46": { "EU": "46", "US": "16", "UK": "13", "CM": "33.0" },
  "46.5": { "EU": "46.5", "US": "16.5", "UK": "13.5", "CM": "33.5" },
  "47": { "EU": "47", "US": "17", "UK": "14", "CM": "34.0" },
  "47.5": { "EU": "47.5", "US": "17.5", "UK": "14.5", "CM": "34.5" },
  "48": { "EU": "48", "US": "18", "UK": "15", "CM": "35.0" }
}

export const RING_SIZE_CONVERSION: Record<string, Record<string, string>> = {
  "35": { "EU": "35", "US": "6", "UK": "2" },
  "35.5": { "EU": "35.5", "US": "6.5", "UK": "2.5" },
  "36": { "EU": "36", "US": "7", "UK": "3" },
  "36.5": { "EU": "36.5", "US": "7.5", "UK": "3.5" },
  "37": { "EU": "37", "US": "8", "UK": "4" },
  "37.5": { "EU": "37.5", "US": "8.5", "UK": "4.5" },
  "38": { "EU": "38", "US": "9", "UK": "5" },
  "38.5": { "EU": "38.5", "US": "9.5", "UK": "5.5" },
  "39": { "EU": "39", "US": "10", "UK": "6" },
  "39.5": { "EU": "39.5", "US": "10.5", "UK": "6.5" },
  "40": { "EU": "40", "US": "11", "UK": "7" },
  "40.5": { "EU": "40.5", "US": "11.5", "UK": "7.5" },
  "41": { "EU": "41", "US": "12", "UK": "8" },
  "41.5": { "EU": "41.5", "US": "12.5", "UK": "8.5" },
  "42": { "EU": "42", "US": "13", "UK": "9" },
  "42.5": { "EU": "42.5", "US": "13.5", "UK": "9.5" },
  "43": { "EU": "43", "US": "14", "UK": "10" },
  "43.5": { "EU": "43.5", "US": "14.5", "UK": "10.5" },
  "44": { "EU": "44", "US": "15", "UK": "11" },
  "44.5": { "EU": "44.5", "US": "15.5", "UK": "11.5" },
  "45": { "EU": "45", "US": "16", "UK": "12" },
  "45.5": { "EU": "45.5", "US": "16.5", "UK": "12.5" },
  "46": { "EU": "46", "US": "17", "UK": "13" },
  "46.5": { "EU": "46.5", "US": "17.5", "UK": "13.5" },
  "47": { "EU": "47", "US": "18", "UK": "14" },
  "47.5": { "EU": "47.5", "US": "18.5", "UK": "14.5" },
  "48": { "EU": "48", "US": "19", "UK": "15" }
}

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
}

export const keyboardRestrictions = {
  nameFields: /[A-Za-z .'-]/,
  addressField: /[A-Za-z0-9 .','-]/,
  postalCodeField: /[A-Za-z0-9 \-]/,
  companyField: /[A-Za-z0-9 .'-]/,
};

export const errorMessages = {
  firstName: {
    min: 'first name must contain at least 1 character',
    max: 'first name must contain at most 40 characters',
    regex: {
      restriction: /^(?!.*  )(?=.*\p{L})[\p{L} .'-]+$/u,
      message: 'must contain at least one letter and only letters, spaces, hyphens, apostrophes, and periods are allowed',
    }
  },
  lastName: {
    min: 'last name must contain at least 1 character',
    max: 'last name must contain at most 40 characters',
    regex: {
      restriction: /^(?!.*  )(?=.*\p{L})[\p{L} .'-]+$/u,
      message: 'must contain at least one letter and only letters, spaces, hyphens, apostrophes, and periods are allowed',
    }
  },
  phone: {
    min: 'phone must contain at least 5 numbers',
    max: 'phone must contain at most 15 numbers'
  },
  city: {
    min: 'city must contain at least 2 characters',
    regex: {
      restriction: /^(?!.*  )(?=.*\p{L})[\p{L} .'-]+$/u,
      message: 'must contain at least one letter and only letters, spaces, hyphens, apostrophes, and periods are allowed',
    }
  },
  address: {
    min: 'address must contain at least 3 characters',
    max: 'address must contain at most 40 characters',
    regex: {
      restriction: /^(?!.*  )[\p{L}0-9 .'-]+$/u,
      message: 'only letters, numbers, spaces, hyphens, apostrophes, and periods are allowed',
    }
  },
  postalCode: {
    min: 'postal code must contain at least 2 characters',
    max: 'postal code must contain at most 12 characters',
    regex: {
      restriction: /^(?!.*  )[A-Za-z0-9 \- ]{2,12}$/,
      message: 'postal code must contain only letters, numbers, spaces, or hyphens'
    }
  },
  country: {
    min: 'country must contain at least 2 characters'
  },
  company: {
    min: 'company must contain at least 1 character',
    max: 'company must contain at most 40 characters',
    regex: {
      restriction: /^(?!.*  )[\p{L}0-9 .'-]+$/u,
      message: 'only letters, numbers, spaces, hyphens, apostrophes, and periods are allowed',
    }
  },
  email: {
    invalid: 'invalid email',
    max: 'email must contain at most 40 characters'
  }
};



export type CountryOption = {
  name: string;
  currency: string;
  currencyKey: string;
  lng: string;
  countryCode: string;
  phoneCode: string;
  displayLng?: string;
};

export const COUNTRIES_BY_REGION = {
  AFRICA: [
    { name: 'south africa', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'za', phoneCode: '27', displayLng: 'english' },
  ],
  AMERICAS: [
    { name: 'canada', currency: '$', currencyKey: 'USD', lng: 'en', countryCode: 'ca', phoneCode: '1', displayLng: 'english' },
    { name: 'chile', currency: '$', currencyKey: 'USD', lng: 'en', countryCode: 'cl', phoneCode: '56', displayLng: 'english' },
    { name: 'mexico', currency: '$', currencyKey: 'USD', lng: 'en', countryCode: 'mx', phoneCode: '52', displayLng: 'english' },
    { name: 'united states', currency: '$', currencyKey: 'USD', lng: 'en', countryCode: 'us', phoneCode: '1', displayLng: 'english' },
  ],
  'ASIA PACIFIC': [
    { name: 'australia', currency: '$', currencyKey: 'USD', lng: 'en', countryCode: 'au', phoneCode: '61', displayLng: 'english' },
    { name: 'hong kong sar', currency: '$', currencyKey: 'USD', lng: 'en', countryCode: 'hk', phoneCode: '852', displayLng: 'english' },
    { name: 'india', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'in', phoneCode: '91', displayLng: 'english' },
    { name: 'japan', currency: '¥', currencyKey: 'JPY', lng: 'en', countryCode: 'jp', phoneCode: '81', displayLng: 'english' },
    { name: '日本', currency: '¥', currencyKey: 'JPY', lng: 'ja', countryCode: 'jp', phoneCode: '81', displayLng: '日本語' },
    { name: 'macau sar', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'mo', phoneCode: '853', displayLng: 'english' },
    { name: 'mainland china', currency: '¥', currencyKey: 'CNY', lng: 'en', countryCode: 'cn', phoneCode: '86', displayLng: 'english' },
    { name: '中国大陆', currency: '¥', currencyKey: 'CNY', lng: 'zh', countryCode: 'cn', phoneCode: '86', displayLng: '简体中文' },
    { name: 'malaysia', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'my', phoneCode: '60', displayLng: 'english' },
    { name: 'new zealand', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'nz', phoneCode: '64', displayLng: 'english' },
    { name: 'singapore', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'sg', phoneCode: '65', displayLng: 'english' },
    { name: 'south korea', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'kr', phoneCode: '82', displayLng: 'english' },
    { name: '대한민국', currency: '€', currencyKey: 'EUR', lng: 'ko', countryCode: 'kr', phoneCode: '82', displayLng: '한국인' },
    { name: 'taiwan', currency: '$', currencyKey: 'USD', lng: 'en', countryCode: 'tw', phoneCode: '886', displayLng: 'english' },
    { name: '台湾地区', currency: '$', currencyKey: 'USD', lng: 'zh', countryCode: 'tw', phoneCode: '886', displayLng: '繁體中文' },
    { name: 'thailand', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'th', phoneCode: '66', displayLng: 'english' },
  ],
  EUROPE: [
    { name: 'aland islands', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'ax', phoneCode: '358', displayLng: 'english' },
    { name: 'andorra', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'ad', phoneCode: '376', displayLng: 'english' },
    { name: 'austria', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'at', phoneCode: '43', displayLng: 'english' },
    { name: 'belgium', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'be', phoneCode: '32', displayLng: 'english' },
    { name: 'bulgaria', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'bg', phoneCode: '359', displayLng: 'english' },
    { name: 'croatia', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'hr', phoneCode: '385', displayLng: 'english' },
    { name: 'cyprus', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'cy', phoneCode: '357', displayLng: 'english' },
    { name: 'czech republic', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'cz', phoneCode: '420', displayLng: 'english' },
    { name: 'denmark', currency: 'kr', currencyKey: 'DKK', lng: 'en', countryCode: 'dk', phoneCode: '45', displayLng: 'english' },
    { name: 'estonia', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'ee', phoneCode: '372', displayLng: 'english' },
    { name: 'faroe islands', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'fo', phoneCode: '298', displayLng: 'english' },
    { name: 'finland', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'fi', phoneCode: '358', displayLng: 'english' },
    { name: 'france', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'fr', phoneCode: '33', displayLng: 'english' },
    { name: 'france', currency: '€', currencyKey: 'EUR', lng: 'fr', countryCode: 'fr', phoneCode: '33', displayLng: 'français' },
    { name: 'germany', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'de', phoneCode: '49', displayLng: 'english' },
    { name: 'deutschland', currency: '€', currencyKey: 'EUR', lng: 'de', countryCode: 'de', phoneCode: '49', displayLng: 'deutsch' },
    { name: 'gibraltar', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'gi', phoneCode: '350', displayLng: 'english' },
    { name: 'greece', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'gr', phoneCode: '30', displayLng: 'english' },
    { name: 'greenland', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'gl', phoneCode: '299', displayLng: 'english' },
    { name: 'guernsey', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'gg', phoneCode: '44', displayLng: 'english' },
    { name: 'hungary', currency: '€', currencyKey: 'HUF', lng: 'en', countryCode: 'hu', phoneCode: '36', displayLng: 'english' },
    { name: 'iceland', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'is', phoneCode: '354', displayLng: 'english' },
    { name: 'italy', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'it', phoneCode: '39', displayLng: 'english' },
    { name: 'italy', currency: '€', currencyKey: 'EUR', lng: 'it', countryCode: 'it', phoneCode: '39', displayLng: 'italiano' },
    { name: 'jersey', currency: '€', currencyKey: 'GBP', lng: 'en', countryCode: 'je', phoneCode: '44', displayLng: 'english' },
    { name: 'latvia', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'lv', phoneCode: '371', displayLng: 'english' },
    { name: 'liechtenstein', currency: '€', currencyKey: 'CHF', lng: 'en', countryCode: 'li', phoneCode: '423', displayLng: 'english' },
    { name: 'lithuania', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'lt', phoneCode: '370', displayLng: 'english' },
    { name: 'luxembourg', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'lu', phoneCode: '352', displayLng: 'english' },
    { name: 'malta', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'mt', phoneCode: '356', displayLng: 'english' },
    { name: 'monaco', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'mc', phoneCode: '377', displayLng: 'english' },
    { name: 'netherland', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'nl', phoneCode: '31', displayLng: 'english' },
    { name: 'norway', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'no', phoneCode: '47', displayLng: 'english' },
    { name: 'poland', currency: '€', currencyKey: 'PLN', lng: 'en', countryCode: 'pl', phoneCode: '48', displayLng: 'english' },
    { name: 'portugal', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'pt', phoneCode: '351', displayLng: 'english' },
    { name: 'romania', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'ro', phoneCode: '40', displayLng: 'english' },
    { name: 'slovakia', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'sk', phoneCode: '421', displayLng: 'english' },
    { name: 'slovenia', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'si', phoneCode: '386', displayLng: 'english' },
    { name: 'spain', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'es', phoneCode: '34', displayLng: 'english' },
    { name: 'sweeden', currency: 'kr', currencyKey: 'SEK', lng: 'en', countryCode: 'se', phoneCode: '46', displayLng: 'english' },
    { name: 'switzerland', currency: '€', currencyKey: 'CHF', lng: 'en', countryCode: 'ch', phoneCode: '41', displayLng: 'english' },
    { name: 'turkey', currency: '€', currencyKey: 'TRY', lng: 'en', countryCode: 'tr', phoneCode: '90', displayLng: 'english' },
    { name: 'united kingdom', currency: '£', currencyKey: 'GBP', lng: 'en', countryCode: 'gb', phoneCode: '44', displayLng: 'english' },
  ],
  'MIDDLE EAST': [
    { name: 'bahrain', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'bh', phoneCode: '973', displayLng: 'english' },
    { name: 'israel', currency: '€', currencyKey: 'ILS', lng: 'en', countryCode: 'il', phoneCode: '972', displayLng: 'english' },
    { name: 'kuwait', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'kw', phoneCode: '965', displayLng: 'english' },
    { name: 'qatar', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'qa', phoneCode: '974', displayLng: 'english' },
    { name: 'saudi arabia', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'sa', phoneCode: '966', displayLng: 'english' },
    { name: 'united arab emirates', currency: '€', currencyKey: 'EUR', lng: 'en', countryCode: 'ae', phoneCode: '971', displayLng: 'english' },
  ],
} satisfies Record<string, CountryOption[]>;

export const LANGUAGE_CODE_TO_ID: Record<string, number> = {
  'en': 1,
  'fr': 2,
  'de': 3,
  'it': 4,
  'ja': 5,
  'zh': 6,
  'ko': 7,
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