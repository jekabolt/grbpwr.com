import type {
  common_GenderEnum,
  common_OrderFactor,
  common_SortFactor
} from "./api/proto-http/frontend";

export const PRODUCTS_CACHE_TAG = "products";
export const ARCHIVES_CACHE_TAG = "archives";
export const HERO_CACHE_TAG = "hero";

export const FOOTER_YEAR = new Date().getFullYear();

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

export const currencySymbols: Record<string, string> = {
  Bitcoin: "₿", // Bitcoin
  CHF: "Fr", // Swiss Franc
  CNY: "¥", // Chinese Yuan
  CZK: "Kč", // Czech Republic Koruna
  DKK: "kr", // Danish Krone
  EUR: "€", // Euro
  Ethereum: "⟠", // Ethereum
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
