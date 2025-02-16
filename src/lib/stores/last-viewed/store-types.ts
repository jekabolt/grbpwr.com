import { common_Product } from "@/api/proto-http/frontend";

export interface LastViewedState {
  products: common_Product[];
}

export interface LastViewedActions {
  addProduct: (product: common_Product) => void;
}

export type LastViewedStore = LastViewedState & LastViewedActions;
