import type {
  common_GenderEnum,
  common_OrderFactor,
  common_SortFactor
} from "./api/proto-http/frontend";

export const FOOTER_YEAR = new Date().getFullYear();

export const FOOTER_LINKS: { text: string; href: string }[] = [
  { text: "x", href: "https://www.x.com/grbpwr/" },
  { text: "github", href: "https://www.github.com/grbpwr/" },
  { text: "instagram", href: "https://www.instagram.com/grb.pwr/" },
  { text: "telegram", href: "https://www.t.me/grbpwr/" },
];

export const CATALOG_LIMIT = 16;

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



