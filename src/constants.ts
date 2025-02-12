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

