export interface Product {
  id:             number;
  dateCreated:    number;
  lat:            number;
  mainImage:      string;
  name:           string;
  price:          Price;
  availableSizes: AvailableSizes;
  description:    string;
  categories:     string[];
  productImages:  string[];
  selectedSize?:  string;
}

export interface AvailableSizes {
  xxs?: number;
  xs?: number;
  s?: number;
  m?: number;
  l?: number;
  xl?: number;
  xxl?: number;
  os?: number;
}

export interface Price {
  usd?: number;
  rub?: number;
  byn?: number;
  eur?: number;
}