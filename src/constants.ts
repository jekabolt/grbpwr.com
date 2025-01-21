import type {
  common_GenderEnum,
  common_OrderFactor,
  common_SizeEnum,
  common_SortFactor,
} from "./api/proto-http/frontend";

export const FOOTER_YEAR = new Date().getFullYear();

export const FOOTER_LINKS: { text: string; href: string }[] = [
  { text: "ig", href: "https://www.instagram.com/grb.pwr/" },
  { text: "x", href: "https://www.x.com/grbpwr/" },
  { text: "tg", href: "https://www.t.me/grbpwr/" },
  { text: "gh", href: "https://www.github.com/grbpwr/" },
  { text: "p", href: "https://www.pinterest.com/grbpwr/" },
];

export const CATALOG_LIMIT = 16;

export const CURRENCY_MAP = {
  eth: "eth",
};
export const MAX_LIMIT = 9999999;

export const GRBPWR_CART = "grbpwr-cart";

export const SIZE_NAME_MAP: Record<common_SizeEnum, string> = {
  SIZE_ENUM_UNKNOWN: "ukn💩",
  SIZE_ENUM_XXS: "xxs",
  SIZE_ENUM_XS: "xs",
  SIZE_ENUM_S: "s",
  SIZE_ENUM_M: "m",
  SIZE_ENUM_L: "l",
  SIZE_ENUM_XL: "xl",
  SIZE_ENUM_XXL: "xxl",
  SIZE_ENUM_OS: "os",
};

export const GENDER_MAP: Record<string, common_GenderEnum> = {
  men: "GENDER_ENUM_MALE",
  women: "GENDER_ENUM_FEMALE",
  unisex: "GENDER_ENUM_UNISEX",
  ukn: "GENDER_ENUM_UNKNOWN",
};

export const currencySymbols: Record<string, string> = {
  Bitcoin: "₿", // Bitcoin
  CHF: "Fr", // Swiss Franc
  CNY: "¥", // Chinese Yuan
  CZK: "Kč", // Czech Republic Koruna
  DKK: "kr", // Danish Krone
  EUR: "€", // Euro
  Ethereum: "Ξ", // Ethereum
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

