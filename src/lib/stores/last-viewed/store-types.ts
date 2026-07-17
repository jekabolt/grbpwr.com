import { common_Colorway } from "@/api/proto-http/frontend";

export interface LastViewedState {
  products: common_Colorway[];
}

export interface LastViewedActions {
  addProduct: (product: common_Colorway) => void;
}

export type LastViewedStore = LastViewedState & LastViewedActions;
